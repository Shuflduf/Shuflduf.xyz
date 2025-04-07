import { Client } from "@notionhq/client";
import { DATABASE_ID } from "./notionData";
import path from "path";

interface NotionPath {
  path: string;
  name: string;
}

const pathCache: Record<string, any[]> = {};

const getNotionPaths = async (basePath: string = "/"): Promise<NotionPath[]> => {
  if (pathCache[basePath]) {
    return pathCache[basePath];
  }

  const notion = new Client({
    auth: import.meta.env.NOTION_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    // filter_properties: ["bpR%3D"],
    filter: {
      property: "Path",
      rich_text: {
        starts_with: basePath,
      },
    },
  });
  const paths = response.results.map((element: any) => {
    return {
      path: (element.properties.Path.rich_text[0].plain_text as string).replace(
        basePath,
        "",
      ),
      name: element.properties.Name.title[0].plain_text as string,
    } as NotionPath;
  });

  pathCache[basePath] = paths;
  return paths;
};

export default getNotionPaths;
export type { NotionPath };
