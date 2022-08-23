import {
  CommandSequence,
  MoveCommand,
  moveCommandArray,
  TurnCommand,
  turnCommandArray,
} from "../types/commands";
import {
  GameState,
  Obstacle,
} from "../types/game";
import { InvalidCommandError, InvalidCommandSequenceError, InvalidGridError, InvalidObstaclesError } from "./errors";
import { initialState } from "./game";

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
      //console.log(`section ${currentSection} row '${row}'`);

      if (currentSection === "none" && row.startsWith("Size")) {
        currentSection = "grid";
        const sizes = row.split(" ");
        if (sizes.length !== 3) {
          throw new InvalidGridError(`Bad grid size format: ${row}`);
        }
        gridWidth = parseInt(sizes[1], 10);
        gridHeight = parseInt(sizes[2], 10);
      } else if (row.startsWith("Obstacle")) {
        currentSection = "obstacles";
        const positions = row.split(" ");
        if (positions.length !== 3) {
          throw new InvalidObstaclesError(`Bad obstacles line format: ${row}`);
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
          throw new InvalidCommandSequenceError(`Bad command line format: ${row}`);
        }
        validateCommands(commandSequence);
        commands.push(commandSequence as CommandSequence);
      }
    }
  });

  // basic check for input errors
  if (gridWidth === 0 || gridHeight === 0) {
    throw new InvalidGridError("Bad grid size parsed!");
  }

  if (commands.length === 0) {
    throw new InvalidCommandSequenceError("Bad commands parsed! We got no commands to execute!");
  }

  const game = initialState(gridWidth, gridHeight, obstacles, commands);
  return game;
};
const validateCommands = (commandList: string[]): boolean => {
  commandList.forEach(command => {
    if( !turnCommandArray.includes(command as TurnCommand) && !moveCommandArray.includes(command as MoveCommand) ){
      throw new InvalidCommandError(`invalid commmand: ${command}`)
    }
  })
  return true;
};

