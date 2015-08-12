// Globals
var board = null;
var finish = false;
var moveCount = 0;

/*
Reset html board and all global variables.
Also reset the status displayed on html.
*/
function resetBoard () {
    var colArray = Array.prototype.slice.call(document.getElementsByClassName('col')).forEach(function (col) {
        col.textContent = '';
    });

    board = initBoard();
    finish = false;
    moveCount = 0;
    updateStatus("Your Turn. Select a Cell");
}

/*
The below functions marks the board on html as well as the global board object.
If fake is true, then it doesn't mark the board on html as makeMove is being used
by MiniMax algorithm for generating intermediate boards.
*/
function makeMove(board, move, mark, fake) {
    var x = move[0],
        y = move[1];

    board[x][y] = mark;

    if(!fake)
        document.getElementById("col"+x+y).textContent = mark;
}

function updateStatus(status) {
    var status_p = document.getElementById("status");

    status_p.textContent = status;
}

/*
Returns the [x, y] coordinates from Cell Id
*/
function getMoveFromBoxId (id) {
    // Id is of the form colxy
    return [parseInt(id[3]), parseInt(id[4])];
}

/*
Wrapper function responsible for making opponent move.
Finds the best move by calling getMaxMove function.
*/
function makeOpponentMove() {
    moveCount++;
    temp_score_move_temp = getMaxMove(board, 'X');
    move_t = temp_score_move_temp[1];
    makeMove(board, move_t, 'X', false);

    if (getIsWin(board, 'X')) {
        updateStatus("PC won");
        finish = true;
    }
    else if (moveCount == 9) {
        updateStatus("Draw");
        finish = true;
    }
}

/*
For generating empty board
*/
function initBoard() {
    var board = [];
    for (var x=0; x<3; x++) {
        var row = [];
        for (var y=0; y<3; y++) {
            row.push('0');
        }
        board.push(row);
    }

    return board;
}


/*
Function checks whether the mark is in a winning position or not.
mark can be 'X' or 'O'
*/
function getIsWin(board, mark) {
    var win;
    var x, y;

    // Checking Columns
    for (x=0; x<3; x++) {
        win = true;
        for (y=0; y<3; y++) {
            if (board[x][y] != mark) {
                win = false;
                break;
            }
        }

        if (win)
            return true;
    }

    // Checking Rows
    for (y=0; y<3; y++) {
        win = true;
        for (x=0; x<3; x++) {
            if (board[x][y] != mark) {
                win = false;
                break;
            }
        }

        if (win)
            return true;
    }

    // Checking diagonals
    if (board[0][0] == mark && board[1][1] == mark && board[2][2] == mark)
        return true;

    if (board[2][0] == mark && board[1][1] == mark && board[0][2] == mark)
        return true;

    return false;
}
 
/*
Returns a copy of passed board.
*/
function getCopy(board) {
    var l = initBoard();
    for (var x=0; x<3; x++) {
        for (var y=0; y<3; y++) {
            l[x][y] = board[x][y];
        }
    }

    return l;
}

/*
Function returns a list of cells empty on board (Where the player can make a move)
*/
function getMoveList(board) {
    var move_list = [];
    for (var x=0; x<3; x++) {
        for (var y=0; y<3; y++) {
            if (board[x][y] == '0') {
                move_list.push([x, y]);
            }
        }
    }

    return move_list;
}

function flip(mark) {
    if (mark == 'X')
        return 'O';
    
    return 'X';
}

/*
Checks whether board is full or not
*/
function boardIsFull(board) {
    for (var x=0; x<3; x++) {
        for (var y=0; y<3; y++) {
            if (board[x][y] == '0') {
                return false;
            }
        }
    }

    return true;
}

/*
Minimax function: Calculates the best move available on board for callee.
*/
function getMaxMove(board, mark) {
    var move_list = getMoveList(board);
    
    var win_move = null;
    var move_score = -1;
    for (var i=0; i<move_list.length; i++) {
        var move = move_list[i];
        var copy_board = getCopy(board);
        makeMove(copy_board, move, mark, true);

        if (getIsWin(copy_board, mark)) {
            move_score = 1;
            win_move = move;
            break;
        }

        if (boardIsFull(copy_board)) {
            score = 0;
        }
        else {
            score = getMinMove(copy_board, flip(mark));
        }
            
        if (score > move_score) {
            move_score = score;
            win_move = move;
        }
    }
            
    return [move_score, win_move];
}

/*
Minimax twin function: Called by getMaxMove function to calculate best move for opponent.
*/
function getMinMove(board, mark) {
    var move_list = getMoveList(board);

    var move_score = 1;
    var score;

    for (var i=0; i<move_list.length; i++) {
        var move = move_list[i];
        var copy_board = getCopy(board);
        makeMove(copy_board, move, mark, true);

        if (getIsWin(copy_board, mark)) {
            move_score = -1;
            win_move = move;
            break;
        }

        if (boardIsFull(copy_board)) {
            score = 0;
        }
        else {
            var temp_score_move_temp = getMaxMove(copy_board, flip(mark));
            score = temp_score_move_temp[0];
        }

        if (score < move_score) {
            move_score = score;
        }
    }
            
    return move_score;
}

window.onload = function () {
    resetBoard();

    document.getElementById('play-again').addEventListener("click", function (event) {
        event.preventDefault();
        resetBoard();
    }, false);

    Array.prototype.slice.call(document.getElementsByClassName('col')).forEach(function (col) {
        col.addEventListener("click", function (event) {
            event.preventDefault();
            
            // Board is full or winner already declared.
            if (finish)
                return;

            var box = document.getElementById(this.id);
            if (box.textContent) {
                updateStatus("This box is already filed. Try another one!");
            }
            else {
                // Get move in [x, y] from using Id of clicked cell
                move_t = getMoveFromBoxId(this.id);
                moveCount++;
                makeMove(board, move_t, 'O', false);
                
                if (getIsWin(board, 'O')) {
                    updateStatus("Winner is user");
                    finish = true;
                }
                else if (moveCount == 9) {
                    updateStatus("Draw");
                    finish = true;
                }
                else {
                    makeOpponentMove();
                }
            }
        }, false);
    });

};