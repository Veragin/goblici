import { buildTree } from './buildTree/buildTree';
import { loadTree, saveTree } from './loader/treeLoader';

const tree = buildTree(6);
saveTree(tree);

// const tree = loadTree();
// console.log('done');
