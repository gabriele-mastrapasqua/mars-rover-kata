import { PlayerPosition } from "../types/game";
import { Cell as Column } from "../types/grid";
import Cell from "./Cell";
import Player from "./Player";

interface Props {
  grid: Column[][];
  playerPosition: PlayerPosition;
}

const Grid: React.FC<Props> = ({ grid, playerPosition }) => {
  return (
    <div style={{ display: "inline-block" }}>
      got grid {grid.length}
      got grid {grid[0].length}
      got playerPosition {playerPosition.x}, {playerPosition.y}
      <div
        style={{
          backgroundColor: "#444",
          display: "grid",
          gridTemplateRows: `repeat(${grid.length}, 1fr)`,
          gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
          gridGap: 2,
        }}
      >
        {grid.map((row, rowIdx) =>
          row.map((value, colIdx) => (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              x={colIdx}
              y={rowIdx}
              value={value}
            >
              {playerPosition.x === colIdx && playerPosition.y === rowIdx && (
                <Player playerPosition={playerPosition}/>
              )}
              row {rowIdx} col {colIdx}
            </Cell>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
