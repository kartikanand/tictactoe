# Tic Tac Toe

Play Tic Tac Toe against an unbeatable computer opponent that uses the
[minimax algorithm](https://en.wikipedia.org/wiki/Minimax) with alpha-beta pruning.

**Demo:** https://kartikanand.github.io/tictactoe/

Relevant XKCD: [Tic-Tac-Toe](https://xkcd.com/832/)

## Development

There is no build step and no dependencies. The site is plain HTML, CSS and ES modules.

```sh
python3 -m http.server   # then open http://localhost:8000
node --test              # run the game logic tests (Node 18+)
```

## Layout

- `index.html`: markup and Content-Security-Policy
- `style.css`: styles (system font stack, dark mode, reduced-motion support)
- `main.js`: DOM and events
- `game.js`: pure game logic and minimax, covered by `game.test.js`

## License

MIT
