interface TreeNode {
  [key: string]: TreeNode | string[];
}

const pathsToTree = (paths: string[]): TreeNode => {
  const root: TreeNode = {};

  paths.forEach(path => {
    const parts = path.replace(/^\//, '').split('/');
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        const key = parts[i - 1] ?? "index"; // Use "index" if parts[i - 1] is undefined
        if (!current[key]) {
          current[key] = [];
        }
        (current[key] as string[]).push(part);
      } else {
        const key = part ?? "index"; // Use "index" if part is undefined
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key] as TreeNode;
      }
    }
  });

  return root;
};

export default pathsToTree;
export type { TreeNode };
