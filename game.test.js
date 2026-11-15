import { test } from 'node:test';
import assert from 'node:assert/strict';
import { newBoard, findWinner, isFull, emptyCells, bestMove, other } from './game.js';

const b = (s) => [...s].map((c) => (c === '.' ? null : c));

test('detects every winning line', () => {
  assert.equal(findWinner(b('XXX......'))?.mark, 'X');
  assert.equal(findWinner(b('...OOO...'))?.mark, 'O');
  assert.equal(findWinner(b('X..X..X..'))?.mark, 'X');
  assert.deepEqual(findWinner(b('..O.O.O..'))?.line, [2, 4, 6]);
  assert.equal(findWinner(b('XO.......')), null);
});

test('detects a full board', () => {
  assert.equal(isFull(b('XOXXOOOXX')), true);
  assert.equal(isFull(newBoard()), false);
  assert.deepEqual(emptyCells(b('XO.......')), [2, 3, 4, 5, 6, 7, 8]);
});

test('takes an immediate win', () => {
  assert.equal(bestMove(b('XX.OO....'), 'X'), 2);
});

test('blocks an immediate loss', () => {
  assert.equal(bestMove(b('OO.X.....'), 'X'), 2);
});

test('returns -1 on a full board', () => {
  assert.equal(bestMove(b('XOXXOOOXX'), 'X'), -1);
});

// Exhaustively play every human line against the computer: the computer must never lose.
for (const computer of ['X', 'O']) {
  test(`computer playing ${computer} never loses (all human lines)`, () => {
    const human = other(computer);
    let games = 0;

    const play = (board, turn) => {
      const win = findWinner(board);
      if (win) {
        assert.notEqual(win.mark, human, `human won: ${board}`);
        games++;
        return;
      }
      if (isFull(board)) { games++; return; }

      if (turn === computer) {
        const next = board.slice();
        next[bestMove(board, computer)] = computer;
        play(next, human);
      } else {
        for (const i of emptyCells(board)) {
          const next = board.slice();
          next[i] = human;
          play(next, computer);
        }
      }
    };

    play(newBoard(), 'X');
    assert.ok(games > 0);
  });
}
