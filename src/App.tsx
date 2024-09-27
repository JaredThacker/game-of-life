import "bulma/css/bulma.min.css";
import { FC, useCallback, useRef, useState } from "react";
import { Globe, Pause, Play, XCircle } from "react-feather";
import { useInterval } from "usehooks-ts";

const numRows = 25;
const numCols = 35;

const positions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const randomTiles = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const generateEmptyGrid = (): number[][] => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App: FC = () => {
  const [grid, setGrid] = useState(() => {
    return randomTiles();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid: number[][]) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;

        positions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
  }, []);

  useInterval(() => {
    runSimulation(grid);
  }, 150);

  return (
    <div className="container has-text-centered py-5">
      <h1 className="title is-uppercase">Conway's Game of Life</h1>
      <div
        style={{
          backgroundColor: "#000000",
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                let newGrid = JSON.parse(JSON.stringify(grid));
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "white" : undefined,
                border: "1px solid #595959",
              }}
            />
          ))
        )}
      </div>
      <div className="buttons is-centered pt-5">
        <button
          className="button start-game mx-2"
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
            }
          }}
        >
          <span className="icon">{running ? <Pause /> : <Play />}</span>
          <span>{running ? "Stop" : "Start"}</span>
        </button>
        <button
          className="button mx-2"
          onClick={() => {
            setGrid(randomTiles());
          }}
        >
          <span className="icon">
            <Globe />
          </span>
          <span>Random</span>
        </button>
        <button
          className="button mx-2"
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          <span className="icon">
            <XCircle />
          </span>
          <span>Clear Board</span>
        </button>
      </div>
    </div>
  );
};

export default App;
