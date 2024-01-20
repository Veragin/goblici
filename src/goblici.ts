import { buildTree, tree } from './buildTree';
import * as fs from 'fs';

const data = buildTree();
const s = data.join('\n');
fs.writeFileSync('./boards.txt', s);
