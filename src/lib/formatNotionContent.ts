import type { NotionPage } from "./getNotionContent";

const formatNotionContent = (content: NotionPage): string => {
  console.log("FORMATTING")
  const { name, description, pageContent, lastModified, createdAt } = content;

  const formattedContent = `---
title: ${name}
description: ${description}
pubDate: ${createdAt}
modDate: ${lastModified}
---
${pageContent}
`;

  return formattedContent;
}

export default formatNotionContent;
