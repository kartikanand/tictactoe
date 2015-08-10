// Globals
var board = null;
var finish = false;
var moveCount = 0;

window.onload = function () {
    resetBoard();

    document.getElementById('play-again').addEventListener("click", function (event) {
        event.preventDefault();
        resetBoard();
    }, false);

    var colArray = Array.prototype.slice.call(document.getElementsByClassName('col')).forEach(function (col) {
        col.addEventListener("click", function (event) {
            event.preventDefault();
            if (finish)
                return;

            var box = document.getElementById(this.id);
            if (box.textContent) {
                alert ("This box is already filed. Try another one!");
            }
            else {
                moveCount++;
                move_t = getMoveFromBoxId(this.id);
                makeMove(board, move_t, 'O', false);
                
                if (getIsWin(board, 'O')) {
                    alert("Winner is user");
                }
                else if (moveCount == 9) {
                    alert("Draw");
                }
                else {
                    makeOpponentMove();
                }
            }
        }, false);
    });

};

function resetBoard () {
    var colArray = Array.prototype.slice.call(document.getElementsByClassName('col')).forEach(function (col) {
        col.textContent = '';
    });

    board = initBoard();
    finish = false;
    moveCount = 0;
}

function makeMove(board, move, mark, fake) {
    var x = move[0],
        y = move[1];

    board[x][y] = mark;

    if(!fake)
        document.getElementById("col"+x+y).textContent = mark;
}



function getMoveFromBoxId (id) {
    // Id is of the form colxy
    return [parseInt(id[3]), parseInt(id[4])];
}

function makeOpponentMove() {
    moveCount++;
    temp_score_move_temp = getMaxMove(board, 'X');
    move_t = temp_score_move_temp[1];
    makeMove(board, move_t, 'X', false);

    if (getIsWin(board, 'X')) {
        alert("PC won");
        finish = true;
    }
    else if (moveCount == 9) {
        alert("Draw");
    }
}

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

function getIsWin(board, mark) {
    var win = null;
    var x, y;

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

    if (board[0][0] == mark && board[1][1] == mark && board[2][2] == mark)
        return true;

    if (board[2][0] == mark && board[1][1] == mark && board[0][2] == mark)
        return true;

    return false;
}
    
function getCopy(board) {
    var l = initBoard();
    for (var x=0; x<3; x++) {
        for (var y=0; y<3; y++) {
            l[x][y] = board[x][y];
        }
    }

    return l;
}

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