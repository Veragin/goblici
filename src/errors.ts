import { TBoard } from './constants';

export class NotAMove extends Error {
    constructor() {
        super('Not a move');
        Object.setPrototypeOf(this, NotAMove.prototype);
    }
}

export class PlayerAWon extends Error {
    constructor(public board: TBoard) {
        super('Player A has won');
        Object.setPrototypeOf(this, PlayerAWon.prototype);
    }
}

export class PlayerBWon extends Error {
    constructor(public board: TBoard) {
        super('Player B has won');
        Object.setPrototypeOf(this, PlayerBWon.prototype);
    }
}

export class Draw extends Error {
    constructor(public board: TBoard) {
        super('Draw');
        Object.setPrototypeOf(this, Draw.prototype);
    }
}
