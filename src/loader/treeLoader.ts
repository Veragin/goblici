import { STATES, TEndState, TSoftTree, TTree } from '../constants';
import * as fs from 'fs';
import { isEndState } from '../utils';

const TREE_FILE_NAME = './tree.txt';

export const saveTree = (tree: TTree) => {
    let data: string = '';
    Object.keys(tree).forEach((key) => {
        const next = tree[key].next;
        data += key + ': ';
        if (Array.isArray(next)) {
            data += next.map((b) => b.step).join(', ');
        } else {
            data += next.state + ', ' + (next.board?.step ?? '');
        }
        data += '\n';
    });

    fs.writeFileSync(TREE_FILE_NAME, data);
};

export const loadTree = () => {
    if (!fs.existsSync(TREE_FILE_NAME)) {
        throw new Error(`File ${TREE_FILE_NAME} does not exists.`);
    }

    const s = fs.readFileSync(TREE_FILE_NAME, 'utf8');
    const data = s.split('\n').map((s) => s.split(': '));

    const tree: TSoftTree = {};
    for (let d of data) {
        if (d.length < 2) continue;
        const next = d[1].split(', ');
        tree[d[0]] = isEndState(next[0]) ? { state: next[0], board: next[1] } : next;
    }

    return tree;
};
