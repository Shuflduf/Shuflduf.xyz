import { Client } from "@notionhq/client"

const getNotionContent = async (pagePath: String): Promise<string> => {
    console.log(process.env.NOTION_TOKEN)

    const notion = new Client({
        auth: process.env.NOTION_TOKEN,
    })

    const listUsersResponse = await notion.users.list({})
    console.log(listUsersResponse)

    return "AIUSGAKJHGFSKJFHS"
}

export default getNotionContent;