import {
  Command,
  CommandSequence,
  moveCommandArray,
  turnCommandArray,
  TurnCommand,
  MoveCommand,
} from '../types/commands'
import {
  Direction,
  GameState,
  PlayerPosition,
  Obstacle,
  Position,
} from '../types/game'
import Grid, {Cell} from '../types/grid'
import {clone, mod} from './utils'

// for resetting and set a new game state
export const initialState = (): GameState => {
  return {
    playerPosition: {x: 0, y: 0, direction: 'N'},
    grid: null,
    status: 'pending',
    obstacles: [],
    commands: [],
    currentCommandSequence: 0,
    commandsResults: [],
  } as GameState
}
export const newGameState = (
  gridWidth: number,
  gridHeight: number,
  obstacles: Obstacle[],
  commands: CommandSequence[],
): GameState => {
  const grid = newGrid(gridWidth, gridHeight, obstacles)
  return {
    playerPosition: {x: 0, y: 0, direction: 'N'},
    grid,
    status: 'pending',
    obstacles,
    commands,
    currentCommandSequence: 0,
    commandsResults: [],
  } as GameState
}

const generateGrid = (
  rows: number,
  columns: number,
  mapValuesFunction: (rowIndex: number, colIndex: number) => Cell,
): Grid => {
  return {
    width: columns,
    height: rows,
    cells: Array(rows)
      .fill(undefined)
      .map((row, rowIndex: number) =>
        Array(columns)
          .fill(undefined)
          .map((col, colIndex: number) =>
            mapValuesFunction(rowIndex, colIndex),
          ),
      ),
  } as Grid
}

const newGrid = (
  columns: number,
  rows: number,
  obstacles: Obstacle[],
): Grid => {
  // this f(x) maps cell type (empty or collisionable) in the grid
  const celllMappingFunction = (rowIndex: number, colIndex: number): Cell => {
    if (
      obstacles &&
      obstacles.some(
        item => item.position.x === colIndex && item.position.y === rowIndex,
      )
    ) {
      return 'X'
    }
    return '0'
  }
  return generateGrid(rows, columns, celllMappingFunction)
}

// used for UI rapresentation, mirror rows like the examples so y axis is from bottom to top
export const mirrorGrid = (state: GameState): Cell[][] => {
  const newGrid: Grid = clone(state.grid)
  return newGrid.cells.reverse()
}

// used for UI rapresentation, mirror rows like the examples so y axis is from bottom to top
export const mirrorPlayer = (state: GameState): PlayerPosition => {
  if(!state.grid) {
    return state.playerPosition;
  }
  const newPlayerPosition: PlayerPosition = clone(state.playerPosition)
  newPlayerPosition.y = mod(
    state.grid.height - 1 - newPlayerPosition.y,
    state.grid.height,
  )
  return newPlayerPosition
}
