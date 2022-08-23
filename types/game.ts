import { CommandSequence } from "./commands";
import Grid from "./grid";

export type Direction = "N" | "S" | "E" | "W"; // N: nord, ...

// 2d position
export type Position = {
  x: number;
  y: number;
};

// the player has position but also a direction
export type PlayerPosition = Position & {
  direction: Direction;
};

// an obstacle has a position
export type Obstacle = {
  position: Position;
};

export interface GameState {
  playerPosition: PlayerPosition; // rover position
  grid: Grid; // Grid of rows and cols
  status: "pending" | "running" | "finished"; // for UI start, stop
  obstacles: Obstacle[];
  commands: CommandSequence[];
  currentCommandSequence: number;
  commandsResults: string[];
}