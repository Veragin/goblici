import { buildTree } from './buildTree/buildTree';
import * as fs from 'fs';

const tree = buildTree();
let data: string = '';
Object.keys(tree).forEach((key) => {
    const next = tree[key].next;
    data += key + ': ';
    if (Array.isArray(next)) {
        data += next.map((b) => b.step).join(', ');
    } else {
        data += next.state + (next.board?.step ?? '');
    }
    data += '\n';
});

fs.writeFileSync('./boards.txt', data);
