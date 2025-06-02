import { Client } from "@notionhq/client";
import { NOTION_API_KEY } from "$env/static/private";
import { listToTree } from "./listToTree";

export type Page = {
  name: string;
  path: string;
}

export const GET = async () => {
  const notion = new Client({
    auth: NOTION_API_KEY,
  });
  const DATABASE_ID = "1caea13be4d480ae8492f352fcf5466e"
  const queryRes = await notion.databases.query({
    database_id: DATABASE_ID,
  })
  const pages: Page[] = queryRes.results.map((page: any) => {
    return {
      name: page.properties.Name.title[0].plain_text,
      path: page.properties.Path.rich_text[0].plain_text,
    } as Page;
  });
  console.log(JSON.stringify(queryRes["results"], null, 2));
  console.log(JSON.stringify(pages, null, 2));
  const tree = listToTree(pages);
  console.log(JSON.stringify(tree, null, 2));
  return new Response(JSON.stringify(tree));
}

