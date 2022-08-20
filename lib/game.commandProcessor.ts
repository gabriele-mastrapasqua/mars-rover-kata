import {
  Command,
  CommandSequence,
  moveCommandArray,
  turnCommandArray,
  TurnCommand,
  MoveCommand,
} from "../types/commands";
import {
  Direction,
  GameState,
  PlayerPosition,
  Obstacle,
  Position,
} from "../types/game";
import Grid, { Cell } from "../types/grid";
import { clone } from "./utils";



const NEXT_TURN_LEFT: any = {
  N: "W",
  W: "S",
  S: "E",
  E: "N",
};
const NEXT_TURN_RIGHT: any = {
  N: "E",
  E: "S",
  S: "W",
  W: "N",
};

// turn a player direction
const turn = (state: GameState, turnCommand: TurnCommand): GameState => {
  const newState = clone(state);
  switch (turnCommand) {
    case "L":
      newState.playerPosition.direction =
        NEXT_TURN_LEFT[newState.playerPosition.direction];
      break;
    case "R":
      newState.playerPosition.direction =
        NEXT_TURN_RIGHT[newState.playerPosition.direction];
      break;
  }
  return newState;
};

type Size = "width" | "height";
type Axis = "x" | "y";

// move forward mapping:
// from a starting direction we move forward
const MOVE_FORMWARD = {
  N: { axis: "y", increment: 1 },
  S: { axis: "y", increment: -1 },
  E: { axis: "x", increment: 1 },
  W: { axis: "x", increment: -1 },
};
// move backward mapping:
// from a starting direction we move backward
const MOVE_BACKWARD = {
  N: { axis: "y", increment: -1 },
  S: { axis: "y", increment: 1 },
  E: { axis: "x", increment: -1 },
  W: { axis: "x", increment: 1 },
};
// move the player to a new cell or detect a collision and stop
const move = (state: GameState, moveCommand: MoveCommand): GameState | null => {
  const newState = clone(state);

  let mappingMoves: any = MOVE_FORMWARD;
  if (moveCommand === "B") {
    mappingMoves = MOVE_BACKWARD;
  }

  // get moving properties based on where player is facing
  const nextMoveProperties = mappingMoves[newState.playerPosition.direction];

  // calculate next move plus check for grid overflow
  (newState.playerPosition[nextMoveProperties.axis] +
    nextMoveProperties.increment) %
    (nextMoveProperties.axis === "y"
      ? newState.grid.height
      : newState.grid.width);

  // check collision: validate next move if is feasible
  const hasMoveCollided = checkCollision(
    newState.grid,
    newState.playerPosition
  );
  if (hasMoveCollided) {
    return null;
  }

  return newState;
};

const checkCollision = (grid: Grid, position: Position): boolean => {
  // TODO - add for each err 1 test
  if (!grid.cells || grid.cells.length == 0 || grid.cells[0].length) {
    throw new Error("invalid grid cells of len 0");
  }

  if (position.y >= grid.cells.length) {
    throw new Error(
      `invalid position y for the grid max rows: ${grid.cells.length}`
    );
  }
  if (position.x >= grid.cells[0].length) {
    throw new Error(
      `invalid position x for the grid max cols: ${grid.cells[0].length}`
    );
  }

  // check cell type if is a collision tile
  if (grid.cells[position.y][position.x] === "X") {
    return true;
  }

  return false;
};

// recursevly process coommands, one by one and return a new state
const executeCommand = (
  state: GameState,
  commandSequence: CommandSequence,
  commandIndex: number
): GameState => {
  // check for finishing the sequence, return the new state plus result
  if (commandIndex >= commandSequence.length) {
    return {
      ...state,
      commandsResults: [
        ...state.commandsResults,
        `${state.playerPosition.x}:${state.playerPosition.y}:${state.playerPosition.direction}`,
      ],
    } as GameState;
  }

  const command = commandSequence[commandIndex];

  // it is a turn command
  if (turnCommandArray.includes(command as TurnCommand)) {
    const newState = turn(state, command as TurnCommand);
    return executeCommand(newState, commandSequence, commandIndex + 1);
  }
  // else is a move command
  const newState = move(state, command as MoveCommand);
  // got a collision! stop all the commands sequence
  if (!newState) {
    return {
      ...state,
      commandsResults: [
        ...state.commandsResults,
        `O:${state.playerPosition.x}:${state.playerPosition.y}:${state.playerPosition.direction}`,
      ],
    } as GameState;
  }

  // else continue to process the next command
  return executeCommand(newState, commandSequence, commandIndex + 1);
};
const executeCommandSequence = (
  state: GameState,
  commandSequence: CommandSequence
): GameState => {
  //commandSequence.map((command: Command) => {
  //    executeCommand(state, command)
  //})
  return executeCommand(state, commandSequence, 0);
};
const playStep = (state: GameState): GameState => {
  // TODO - add a timer for UI animation from 1 commands to another
  const newState = executeCommandSequence(
    state,
    state.commands[state.currentCommandSequence]
  );
  // increment so we know where we left...
  if (newState.currentCommandSequence + 1 < newState.commands.length) {
    newState.currentCommandSequence = newState.currentCommandSequence + 1;
  }

  return newState;
};

const generateGrid = (
  rows: number,
  columns: number,
  mapValuesFunction: (rowIndex: number, colIndex: number) => Cell
): Grid => {
  return {
    width: columns,
    height: rows,
    cells: Array(rows)
      .fill(undefined)
      .map((row, rowIndex: number) =>
        Array(columns)
          .fill(undefined)
          .map((col, colIndex: number) => mapValuesFunction(rowIndex, colIndex))
      ),
  } as Grid;
};

const newGrid = (
  rows: number,
  columns: number,
  obstacles: Obstacle[]
): Grid => {
  // this f(x) maps cell type (empty or collisionable) in the grid
  const celllMappingFunction = (rowIndex: number, colIndex: number): Cell => {
    if (obstacles.includes({ position: { x: colIndex, y: rowIndex } })) {
      return "X";
    }
    return "0";
  };
  return generateGrid(rows, columns, celllMappingFunction);
};
