import { TBoard } from './constants';

export class NotAMove extends Error {}

export class PlayerAWon extends Error {
    constructor(public board: TBoard) {
        super('Player A has won');
    }
}

export class PlayerBWon extends Error {
    constructor(public board: TBoard) {
        super('Player B has won');
    }
}

export class Draw extends Error {
    constructor(public board: TBoard) {
        super('Draw');
    }
}
