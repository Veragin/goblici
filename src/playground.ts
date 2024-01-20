import { nextMoves } from './buildTree/moves';
import { parseStep } from './utils';

const board3 = parseStep('A;;1B2A3A;;;3A;;3B;3B;');
const moves3 = nextMoves(board3);
console.log(moves3);
