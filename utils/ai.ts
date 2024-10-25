import { OpenAI } from 'langchain/llms/openai'
import { StructuredOutputParser } from 'langchain/output_parsers'
import z from 'zod';
import { PromptTemplate } from 'langchain/prompts';

const parser = StructuredOutputParser.fromZodSchema(
    z.object({
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
        template: 'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{formatted_instructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { formatted_instructions },
    });

    const input = await prompt.format({ entry: content });
    console.log(input);
    return input;
}

export const analyze = async (content: string) => {
    const prompt = await getPrompt(content);
    const model = new OpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
    const result = await model.call(prompt);
    try {
        return parser.parse(result);
    } catch (e) {
        console.error(e, 'error');
        return {}
    }
}