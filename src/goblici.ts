import { TreeSolver } from './buildTree/TreeSolver';
import { buildTree } from './buildTree/buildTree';
import { INIT_STEP } from './constants';
import { loadTree, saveLog, saveTree } from './loader/treeLoader';

const tree = buildTree(5);

console.log('LETS SOLVE');
const treeSolver = new TreeSolver(tree, 500, 10000);
treeSolver.solve(INIT_STEP);
const log = treeSolver.log.join('\n');
saveLog(log);
saveTree(tree);

// const tree = loadTree();
// console.log('done');
