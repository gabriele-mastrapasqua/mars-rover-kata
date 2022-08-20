import {
  Command,
  CommandSequence,
  moveCommandArray,
  turnCommandArray,
} from "../types/commands";
import {
  Direction,
  GameState,
  PlayerPosition,
  Obstacle,
  Position,
} from "../types/game";
import { initialState } from "./game.state";

type ParseSection = "none" | "grid" | "obstacles" | "commands";

export const parse = (input: string): GameState => {
  input = input.replace(/\t/g, "").replace(/  /g, "");

  let currentSection: ParseSection = "none";

  const rows = input.split("\n");
  let [gridWidth, gridHeight] = [0, 0];
  let obstacles: Obstacle[] = [];
  let commands: CommandSequence[] = [];

  rows.forEach((row: string) => {
    if (row !== "") {
      console.log(`section ${currentSection} row '${row}'`);

      if (currentSection === "none" && row.startsWith("Size")) {
        currentSection = "grid";
        const sizes = row.split(" ");
        if (sizes.length !== 3) {
          throw new Error(`Bad grid size format: ${row}`);
        }
        gridWidth = parseInt(sizes[1], 10);
        gridHeight = parseInt(sizes[2], 10);
        console.log(`sizes w:${gridWidth} h:${gridHeight}`);
      } else if (row.startsWith("Obstacle")) {
        currentSection = "obstacles";
        const positions = row.split(" ");
        if (positions.length !== 3) {
          throw new Error(`Bad obstacles line format: ${row}`);
        }
        const x = parseInt(positions[1], 10);
        const y = parseInt(positions[2], 10);
        obstacles.push({ position: { x, y } });
      } else if (row.startsWith("Commands")) {
        currentSection = "commands";
      }

      // commands are multi lines sections after the first Commands
      if (currentSection === "commands" && !row.startsWith("Commands")) {
        const commandSequence = row.split("");
        if (commandSequence.length === 0) {
          throw new Error(`Bad command line format: ${row}`);
        }
        commands.push(commandSequence as CommandSequence);
      }
    }
  });

  // basic check for input errors
  if (gridWidth === 0 || gridHeight === 0) {
    throw new Error("Bad grid size parsed!");
  }

  if (commands.length === 0) {
    throw new Error("Bad commands parsed! We got no commands to execute!");
  }

  const game = initialState(gridWidth, gridHeight, obstacles, commands);
  return game;
};
