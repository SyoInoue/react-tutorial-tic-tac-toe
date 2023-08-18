import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const win = calculateWinner(squares);
  let status = "Draw";
  let line = [];
  if (win) {
    status = "Winner: " + win.player;
    line = win.line;
  } else if (squares.includes(null)) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 3 }).map((_, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {Array.from({ length: 3 }).map((_, colIndex) => {
            const index = rowIndex * 3 + colIndex;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
                className={"square " + (line.includes(index) ? "win" : null)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

function SortButton({ handleSort }) {
  return <button onClick={handleSort}>Let's Sort!!</button>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  const handleSort = () => {
    setIsAscending(!isAscending);
    setHistory((prev) => prev.reverse());
  };

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = [
    <li key={0}>
      <button onClick={() => jumpTo(0)}>Go to game start</button>
    </li>,
    ...history.slice(1).map((_, moveIndex) => {
      const move = isAscending ? moveIndex + 1 : history.length - moveIndex - 1;
      const description =
        currentMove === move ? (
          <div>{"You are at move #" + move}</div>
        ) : (
          <button onClick={() => jumpTo(move)}>{"Go to move #" + move}</button>
        );

      return <li key={move}>{description}</li>;
    }),
  ];

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>

      <div className="game-info">
        <SortButton handleSort={handleSort} />
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
