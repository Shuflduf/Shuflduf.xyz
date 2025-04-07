import { Client } from "@notionhq/client";
import { NotionConverter } from "notion-to-md";
import { DefaultExporter } from "notion-to-md/plugins/exporter";
import { DATABASE_ID } from "./notionData";

// Add cache interface and cache object
interface CacheEntry extends NotionPage {
  lastModified: string;
}

const pageCache: Record<string, CacheEntry> = {};

type NotionPage = {
  name: string;
  description: string;
  pageContent: string;
  lastModified: string;
  createdAt: string;
};

const getNotionContent = async (pagePath: string): Promise<NotionPage> => {
  const notion = new Client({
    auth: import.meta.env.NOTION_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: "Path",
      rich_text: {
        equals: pagePath,
      },
    },
  });
  const firstPage = response.results[0] as any;
  const pageLastModified = firstPage.last_edited_time;

  // Check cache
  const cachedPage = pageCache[pagePath];
  if (cachedPage && cachedPage.lastModified === pageLastModified) {
    return cachedPage;
  }

  const pageName = firstPage.properties.Name.title[0].plain_text;
  const pageCreatedAt = firstPage.created_time;
  const pageDescription =
    firstPage.properties.Description.rich_text[0].plain_text;
  const pageId = response.results[0].id;

  const buffer = {};
  const exporter = new DefaultExporter({
    outputType: "buffer",
    buffer: buffer,
  });
  const n2m = new NotionConverter(notion).withExporter(exporter);
  await n2m.convert(pageId);

  const page = {
    name: pageName,
    description: pageDescription,
    pageContent: (buffer as any)[pageId],
    lastModified: pageLastModified,
    createdAt: pageCreatedAt,
  };

  // Update cache
  pageCache[pagePath] = page;

  return page;
};

export default getNotionContent;
export type { NotionPage };
