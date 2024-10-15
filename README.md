# AI-App
This's an app you can write your entries. By AI power, it can tell you what the mood of your journal entry is. And it would try to analysis what you were feeling, saying, how you feel that day(pos or neg).

U can ask it, how i felt that day? Was i in a bad mood this month?... AI will give you answer.

We don't need to know anything about the ai algorithm, just need to know how to call the api of openAI.

## Crypto Env
I use crypto to upload env variables, `npm run gen` to generate env variable. 

- 通过将【密码】做hash(使用`id`)生成`SigningKey`【私钥】
- 使用`id`生成【消息摘要】
- 用【私钥】对【消息摘要】做签名，生成【地址】，使用`recoverAddress`
- 【地址】用于验证密码是否正确，【地址】明文保存
- 用【对称加密】恢复环境变量文件

## Database Server
[Neon](https://console.neon.tech/app/projects)

if don't have `neonctl` need to install it `npm install -g neonctl`

## Database ORM
[Prisma](https://www.prisma.io/)

# Setup
`npm install`


# Run
`npm run dev`