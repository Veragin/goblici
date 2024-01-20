import { TEndState, TTree } from '../constants';
import * as fs from 'fs';

const TREE_FILE_NAME = './tree.txt';

export const saveTree = (tree: TTree) => {
    let data: string = '';
    Object.keys(tree).forEach((key) => {
        const info = tree[key];
        data += `${key}: ${info.state}: ${info.board.join(', ')}\n`;
    });

    fs.writeFileSync(TREE_FILE_NAME, data);
};

export const loadTree = () => {
    if (!fs.existsSync(TREE_FILE_NAME)) {
        throw new Error(`File ${TREE_FILE_NAME} does not exists.`);
    }

    const s = fs.readFileSync(TREE_FILE_NAME, 'utf8');
    const data = s.split('\n').map((s) => s.split(': '));

    const tree: TTree = {};
    for (let d of data) {
        if (d.length < 2) continue;
        tree[d[0]] = { state: d[1] as TEndState, board: d[2].split(', ') };
    }

    return tree;
};
