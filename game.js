// Pure game logic: no DOM access, so it can be tested with `node --test`.

export const EMPTY = null;

export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],            // diagonals
];

export const newBoard = () => Array(9).fill(EMPTY);

export const other = (mark) => (mark === 'X' ? 'O' : 'X');

/** Returns { mark, line } if someone has won, otherwise null. */
export function findWinner(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line };
    }
  }
  return null;
}

export const isFull = (board) => board.every((cell) => cell !== EMPTY);

export const emptyCells = (board) =>
  board.flatMap((cell, i) => (cell === EMPTY ? [i] : []));

/**
 * Minimax with alpha-beta pruning, scored from `me`'s point of view.
 * Wins are weighted by depth so faster wins and slower losses are preferred.
 */
function score(board, turn, me, depth, alpha, beta) {
  const win = findWinner(board);
  if (win) return win.mark === me ? 10 - depth : depth - 10;
  if (isFull(board)) return 0;

  const maximizing = turn === me;
  let best = maximizing ? -Infinity : Infinity;

  for (const i of emptyCells(board)) {
    board[i] = turn;
    const value = score(board, other(turn), me, depth + 1, alpha, beta);
    board[i] = EMPTY;

    if (maximizing) {
      best = Math.max(best, value);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, value);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}

/** Index of the best cell for `mark`, or -1 if the board is full. */
export function bestMove(board, mark) {
  const work = board.slice();
  let best = -Infinity;
  let move = -1;

  for (const i of emptyCells(work)) {
    work[i] = mark;
    const value = score(work, other(mark), mark, 1, -Infinity, Infinity);
    work[i] = EMPTY;
    if (value > best) {
      best = value;
      move = i;
    }
  }
  return move;
}
