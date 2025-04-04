import { Client } from "@notionhq/client";
import { DATABASE_ID } from "./notionData";
import path from "path";

const getNotionPaths = async (root: string): Promise<string[]> => {
  const notion = new Client({
    auth: import.meta.env.NOTION_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter_properties: ["bpR%3D"],
    filter: {
      property: "Path",
      rich_text: {
        starts_with: root,
      },
    },
  });
  const paths = response.results.map((element: any) => {
    return element.properties.Path.rich_text[0].plain_text;
  });
  console.log("Paths: ", paths);
  return paths
}

export default getNotionPaths;