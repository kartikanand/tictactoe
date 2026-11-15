import { newBoard, findWinner, isFull, bestMove, other } from './game.js';

const HUMAN = 'X';
const COMPUTER = other(HUMAN);
const THINK_MS = 700;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const cells = [...boardEl.querySelectorAll('.cell')];

let board;
let over;
let thinking;
let timer;

const where = (i) => `row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}`;

function setStatus(text, { dots = false } = {}) {
  statusEl.textContent = text;
  if (dots) {
    const wrap = document.createElement('span');
    wrap.className = 'dots';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.append(...[1, 2, 3].map(() => document.createElement('span')));
    statusEl.append(wrap);
  }
}

function place(i, mark) {
  board[i] = mark;
  const cell = cells[i];
  cell.dataset.mark = mark;
  cell.setAttribute('aria-disabled', 'true');
  cell.setAttribute('aria-label', `${where(i)}, ${mark}`);
  const span = document.createElement('span');
  span.className = 'mark';
  span.textContent = mark;
  cell.replaceChildren(span);
}

/** Returns true if the game ended. */
function checkEnd() {
  const win = findWinner(board);
  if (win) {
    over = true;
    win.line.forEach((i) => cells[i].classList.add('win'));
    setStatus(win.mark === HUMAN ? 'You win!' : 'Computer wins.');
    return true;
  }
  if (isFull(board)) {
    over = true;
    setStatus("It's a draw.");
    return true;
  }
  return false;
}

function setThinking(value) {
  thinking = value;
  boardEl.dataset.thinking = String(value);
  boardEl.setAttribute('aria-busy', String(value));
}

function computerTurn() {
  setThinking(true);
  setStatus('Computer is thinking', { dots: true });
  timer = setTimeout(() => {
    place(bestMove(board, COMPUTER), COMPUTER);
    setThinking(false);
    if (!checkEnd()) setStatus('Your turn.');
  }, THINK_MS);
}

function reset() {
  clearTimeout(timer);
  board = newBoard();
  over = false;
  setThinking(false);
  cells.forEach((cell, i) => {
    cell.replaceChildren();
    cell.classList.remove('win');
    delete cell.dataset.mark;
    cell.removeAttribute('aria-disabled');
    cell.setAttribute('aria-label', `${where(i)}, empty`);
  });
  setStatus('Your turn. Pick a square.');
}

boardEl.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (!cell || over || thinking) return;

  const i = Number(cell.dataset.index);
  if (board[i]) {
    setStatus('That square is taken. Try another.');
    return;
  }

  place(i, HUMAN);
  if (!checkEnd()) computerTurn();
});

resetBtn.addEventListener('click', () => {
  reset();
  cells[0].focus();
});

reset();
