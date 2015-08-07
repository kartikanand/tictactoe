

function resetGlobals (argument) {
    var board;
var finish = false;
var count = 0;
}

function makeMoveOnPage (move, mark) {
    var x = move[0],
        y = move[1];

    var id = "col"+x+y;
    console.log(id);
    console.log(mark);
    var obj = document.getElementById(id);
    console.log(obj);    
    obj.textContent = mark;
}

window.onload = function () {
    board = initBoard();

    document.getElementById('play-again').addEventListener("click", function (event) {
        event.preventDefault();

        board = initBoard();
        initBoardOnPage();
    }, false);
    var cols = document.getElementsByClassName("col");
    for (var i=0; i<cols.length; i++) {
        cols[i].addEventListener("click", markBox, false);
        cols[i].textContent = '';
    }
};

function initBoardOnPage () {
    var cols = document.getElementsByClassName("col");
    for (var i=0; i<cols.length; i++) {
        cols[i].textContent = '';
    }
}

function markBox() {
    if (finish) {
        return;
    }

    var box = document.getElementById(this.id);
    if (box.textContent) {
        alert ("This box is already filed. Try another one!");
    }
    else {
        count++;
        move_t = getMoveFromBoxId(this.id);
        makeMove(board, move_t, 'O');
        makeMoveOnPage(move_t, 'O');
        
        if (getIsWin(board, 'O')) {
            alert("Winner is user");
        }
        else if (count == 9) {
            alert("Draw");
        }
        else {
            makeOpponentMove();
        }
    }
}

function getMoveFromBoxId (id) {
    // Id is of the form colxy
    var movex = parseInt(id[3]);
    var movey = parseInt(id[4]);

    return [movex, movey];
}

function makeOpponentMove() {
    count++;
    temp_score_move_temp = getMaxMove(board, 'X');
    move_t = temp_score_move_temp[1];
    makeMove(board, move_t, 'X');
    makeMoveOnPage(move_t, 'X');

    if (getIsWin(board, 'X')) {
        alert("PC won");
        finish = true;
    }
    else if (count == 9) {
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
    //console.log("getIsWin");
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

        if (win) {
            return true;
        }
    }

    for (y=0; y<3; y++) {
        win = true;
        for (x=0; x<3; x++) {
            if (board[x][y] != mark) {
                win = false;
                break;
            }
        }

        if (win) {
            return true;
        }
    }

    if (board[0][0] == mark && board[1][1] == mark && board[2][2] == mark) {
        return true;
    }

    if (board[2][0] == mark && board[1][1] == mark && board[0][2] == mark) {
        return true;
    }

    return false;
}
    
function getCopy(board) {
    //console.log("getCopy");
    var l = initBoard();
    for (var x=0; x<3; x++) {
        for (var y=0; y<3; y++) {
            l[x][y] = board[x][y];
        }
    }

    return l;
}

function getMoveList(board) {
    //console.log("getMoveList");
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

function makeMove(board, move, mark) {
    //console.log("makeMove");
    var x = move[0],
        y = move[1];

    board[x][y] = mark;
}

function flip(mark) {
    //console.log("flip");
    if (mark == 'X') {
        return 'O';
    }
    else {
        return 'X';
    }
}

function boardIsFull(board) {
    //console.log("boardisfull");
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
    //console.log("getMinMove");
    var move_list = getMoveList(board);

    var move_score = 1;
    var score;

    for (var i=0; i<move_list.length; i++) {
        var move = move_list[i];
        var copy_board = getCopy(board);
        makeMove(copy_board, move, mark);

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
    //console.log("getMaxMove");
    var move_list = getMoveList(board);
    
    var win_move = null;
    var move_score = -1;
    for (var i=0; i<move_list.length; i++) {
        var move = move_list[i];
        var copy_board = getCopy(board);
        makeMove(copy_board, move, mark);

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