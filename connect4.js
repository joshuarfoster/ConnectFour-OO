class Game {
    constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
        this.players = [p1, p2]
        this.HEIGHT = HEIGHT;
        this.WIDTH = WIDTH;
        this.board = [];
        this.currPlayer = p1;
        this.gameOver = 0
        this.makeBoard();
        this.makeHtmlBoard();

    };



    makeBoard() {
        for (let y = 0; y < this.HEIGHT; y++) {
            this.board.push(Array.from({ length: this.WIDTH }));
        }
    };
    makeHtmlBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';


        const top = document.createElement('tr');
        top.setAttribute('id', 'column-top');
        this.handleClickBound = this.handleClick.bind(this);
        top.addEventListener('click', this.handleClickBound);

        for (let x = 0; x < this.WIDTH; x++) {
            const headCell = document.createElement('td');
            headCell.setAttribute('id', x);
            top.append(headCell);
        }

        board.append(top);


        for (let y = 0; y < this.HEIGHT; y++) {
            const row = document.createElement('tr');

            for (let x = 0; x < this.WIDTH; x++) {
                const cell = document.createElement('td');
                cell.setAttribute('id', `${y}-${x}`);
                row.append(cell);
            }

            board.append(row);
        }
    };
    findSpotForCol(x) {
        for (let y = this.HEIGHT - 1; y >= 0; y--) {
            if (!this.board[y][x]) {
                return y;
            }
        }
        return null;
    };
    placeInTable(y, x) {
        const piece = document.createElement('div');
        piece.classList.add('piece');
        piece.style.backgroundColor = this.currPlayer.color
        piece.style.top = -50 * (y + 2);

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    };
    endGame(msg) {
        alert(msg);
        this.gameOver = 1;
    };
    handleClick(evt) {
        if (this.gameOver) {
            return
        }

        const x = +evt.target.id;

        const y = this.findSpotForCol(x);
        if (y === null) {
            return;
        }


        this.board[y][x] = this.currPlayer;
        this.placeInTable(y, x);

        if (this.checkForWin()) {
            return this.endGame(`Player ${this.currPlayer.color} won!`);
        }


        if (this.board.every(row => row.every(cell => cell))) {
            return this.endGame('Tie!');
        }


        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    };
    checkForWin() {

        // Check four cells to see if they're all color of current player
        //  - cells: list of four (y, x) cells
        //  - returns true if all are legal coordinates & all match currPlayer

        const _win = cells => cells.every(
            ([y, x]) =>
            y >= 0 &&
            y < this.HEIGHT &&
            x >= 0 &&
            x < this.WIDTH &&
            this.board[y][x] === this.currPlayer
        );


        for (let y = 0; y < this.HEIGHT; y++) {
            for (let x = 0; x < this.WIDTH; x++) {
                // get "check list" of 4 cells (starting here) for each of the different
                // ways to win
                const horiz = [
                    [y, x],
                    [y, x + 1],
                    [y, x + 2],
                    [y, x + 3]
                ];
                const vert = [
                    [y, x],
                    [y + 1, x],
                    [y + 2, x],
                    [y + 3, x]
                ];
                const diagDR = [
                    [y, x],
                    [y + 1, x + 1],
                    [y + 2, x + 2],
                    [y + 3, x + 3]
                ];
                const diagDL = [
                    [y, x],
                    [y + 1, x - 1],
                    [y + 2, x - 2],
                    [y + 3, x - 3]
                ];

                // find winner (only checking each win-possibility as needed)
                if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    return true;
                }
            }
        }
    }
}
class Player {
    constructor(color) {
        this.color = color
    }
}

document.getElementById('start-restart').addEventListener('click', () => {
    let p1 = new Player(document.getElementById('p1').value);
    let p2 = new Player(document.getElementById('p2').value);
    new Game(p1, p2);
});