import type { NotionPage } from "./notion/getNotionContent";

const formatNotionContent = (content: NotionPage): string => {
  return content.pageContent;
}

export default formatNotionContent;
