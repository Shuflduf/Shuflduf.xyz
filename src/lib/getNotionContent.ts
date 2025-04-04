import { Client } from "@notionhq/client";
import { NotionConverter } from "notion-to-md";
import { DefaultExporter } from "notion-to-md/plugins/exporter";

type NotionPage = {
  name: string;
  content: string;
  lastModified: string;
  createdAt: string;
}

const getNotionContent = async (pagePath: string): Promise<NotionPage> => {
  const notion = new Client({
    auth: import.meta.env.NOTION_TOKEN,
  });

  console.log("Querying Notion...");
  const databaseId = "1caea13be4d480ae8492f352fcf5466e";
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "Path",
      rich_text: {
        equals: pagePath,
      },
    }
  });
  const firstPage = response.results[0] as any;
  const pageName = firstPage.properties.Name.title[0].plain_text;
  const pageLastModified = firstPage.last_edited_time;
  const pageCreatedAt = firstPage.created_time;
  const pageId = response.results[0].id;

  console.log("Converting Notion page to Markdown...");
  const buffer = {};
  const exporter = new DefaultExporter(({
    outputType: "buffer",
    buffer: buffer,
  }))
  const n2m = new NotionConverter(notion)
    .withExporter(exporter)
  await n2m.convert(pageId);
  console.log(buffer);

  return {
    name: pageName,
    content: buffer.toString(),
    lastModified: pageLastModified,
    createdAt: pageCreatedAt,
  };
};

export default getNotionContent;
