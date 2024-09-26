import { useState } from "react";
import "./App.css";

const numRows = 25;
const numCols = 35;

const randomTiles = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const App = () => {
  const [grid, setGrid] = useState(() => {
    return randomTiles();
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {grid.map((rows, i) =>
        rows.map((col, k) => (
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][k] ? "#F68E5F" : undefined,
              border: "1px solid #595959",
            }}
          />
        ))
      )}
    </div>
  );
};
