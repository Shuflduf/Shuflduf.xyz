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
        if (!current[parts[i - 1]]) {
          current[parts[i - 1]] = [];
        }
        (current[parts[i - 1]] as string[]).push(part);
      } else {
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part] as TreeNode;
      }
    }
  });

  return root;

}

export default pathsToTree;
