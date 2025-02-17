import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod';
import { PromptTemplate } from 'langchain/prompts';
import { Document } from 'langchain/document';
import { loadQARefineChain } from 'langchain/chains';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
        sentimentScore: z
            .number()
            .describe('这篇日记的情感分数,分数在-10到10之间,-10表示非常消极,10表示非常积极,0表示中性.'),
        mood: z
            .string()
            .describe('写这个日记的人的心情.'),
        subject: z
            .string()
            .describe('这篇日记的主题.'),
        summary: z
            .string()
            .describe('简要概括日记内容.'),
        negative: z
            .boolean()
            .describe('这篇日记是情绪低落的吗?(i.e. 日记内容包含消极情绪吗?)'),
        color: z
            .string()
            .describe('用一个十六进制的颜色来表示日志描述的心情. e.g. #0101fe 这种蓝色舒适的颜色用来表示开心的情绪.'),

    })
)
const getPrompt = async (content: string) => {
    const formatted_instructions = parser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template: '分析下面的日志. 按照说明并格式化您的回复以匹配格式说明, 必须这么做! \n{formatted_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { formatted_instructions },
    });

    const input = await prompt.format({ entry: content });
    console.log(input);
    return input;
}

export const analyze = async (content: string) => {
    const prompt = await getPrompt(content);
    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', topP: 0.95 });
    const result = await model.call(prompt);
    try {
        return parser.parse(result);
    } catch (e) {
        console.error(e, 'error');
        return {}
    }
}

export const qa = async (question, entries) => {
    const docs = entries.map((entry) => {
        return new Document({
            pageContent: entry.content,
            metadata: {
                id: entry.id,
                createdAt: entry.createdAt
            }
        })
    });

    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo', topP: 0.95 });
    // chain allows you to chain multiple calls to the model
    // chain允许将多个调用链接到模型
    const chain = loadQARefineChain(model);
    // embeddings are a group of vectors that represent the meaning of words
    // embeddings是一组代表单词含义的向量
    const embeddings = new OpenAIEmbeddings();
    // 在内存中创建一个内存向量存储库
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    // 找出适合回答问题的文档
    const relevantDocs = await store.similaritySearch(question);

    const res = await chain.call({
        input_documents: relevantDocs,
        question
    })

    return res.output_text;
}