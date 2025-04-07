import type { NotionPage } from "./getNotionContent";

const formatNotionContent = (content: NotionPage): string => {
  return content.pageContent;
}

export default formatNotionContent;
