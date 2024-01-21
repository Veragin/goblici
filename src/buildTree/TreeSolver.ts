import { TEndState, TStep, TTree } from '../constants';
import { parseStep } from '../utils';
import { processBoard } from './buildTree';

export class TreeSolver {
    log: string[] = [];
    processDepth = 0;

    stack: TStep[] = [];
    maxReachedDepth = 1;

    constructor(public tree: TTree, private maxDepth: number, private maxProcessDepth: number) {}

    solve = (initStep: TStep) => {
        this.stack.push(initStep);

        while (this.stack.length > 0) {
            if (this.processDepth > this.maxProcessDepth || this.stack.length > this.maxDepth) {
                console.log('Step when it ended', this.stack[this.stack.length - 1]);
                return;
            }

            const step = this.stack[this.stack.length - 1];
            this.doSolve(step);
        }
    };

    private doSolve = (step: TStep) => {
        if (this.tree[step] === undefined) {
            const board = parseStep(step);
            processBoard(board);
        }

        const info = this.tree[step];

        if (info.state !== 'NONE') {
            this.stack.pop();
            return;
        }

        let isDrawPossible = false;
        for (let nextItStep of info.board) {
            let nextStep = nextItStep;
            let next = this.tree[nextItStep];
            let nextState = this.tree[nextItStep]?.state;

            if (nextState === 'SAME') {
                nextStep = next.board[0];
                next = this.tree[nextStep];
                nextState = this.tree[nextStep].state;
            }

            if (nextState === undefined || nextState === 'NONE') {
                if (!this.stack.includes(nextStep)) {
                    this.addToLog(`CHECK ${nextStep}`);
                    this.stack.push(nextStep);
                    return;
                }

                this.tree[step].state = 'DRAW';
                this.addToLog(`DRAW BY REPETITION ${nextStep}`);
                this.stack.pop();
                return;
            }

            if (nextState[nextState.length - 1] === step[0]) {
                // we are winning
                this.tree[step].state = nextState;
                this.tree[step].board = [nextItStep];
                this.addToLog(nextState);
                this.stack.pop();
                return;
            }

            if (nextState === 'DRAW') {
                isDrawPossible = true;
            }
        }

        const loserState = isDrawPossible ? 'DRAW' : step[0] === 'A' ? 'PLAYER_B' : 'PLAYER_A';
        this.tree[step].state = loserState;
        this.addToLog(loserState);
        this.stack.pop();
    };

    private addToLog = (msg: string) => {
        this.processDepth++;
        if (this.processDepth % 1000 === 0) {
            console.log(this.processDepth / this.maxProcessDepth);
        }
        this.log.push(`${this.stack.length}: ${this.stack[this.stack.length - 1]}: ${msg}`);
    };
}
