import type { NotionPath } from "./notion/getNotionPaths";

interface TreeNode {
  [key: string]: TreeNode | string;
}

const pathsToTree = (paths: NotionPath[]): TreeNode => {
  const root: TreeNode = {};
  console.log("Input: ", paths);

  paths.forEach(path => {
    const parts = path.path.replace(/^\//, '').split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      // ignore the error its fine
      current = current[part];

      if (i == parts.length - 1) {
        current.name = path.name
      }
    }
  });

  console.log("Output: ", JSON.stringify(root, null, 2));

  return root;
};

export default pathsToTree;
export type { TreeNode };
