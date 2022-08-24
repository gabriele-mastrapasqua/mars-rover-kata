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
import {InvalidGridError, InvalidPlayerPositionError} from './errors'
import {clone, mod} from './utils'

const NEXT_TURN_LEFT: any = {
  N: 'W',
  W: 'S',
  S: 'E',
  E: 'N',
}
const NEXT_TURN_RIGHT: any = {
  N: 'E',
  E: 'S',
  S: 'W',
  W: 'N',
}

// turn a player direction
const turn = (state: GameState, turnCommand: TurnCommand): GameState => {
  const newState = clone(state)
  switch (turnCommand) {
    case 'L':
      newState.playerPosition.direction =
        NEXT_TURN_LEFT[newState.playerPosition.direction]
      break
    case 'R':
      newState.playerPosition.direction =
        NEXT_TURN_RIGHT[newState.playerPosition.direction]
      break
  }
  return newState
}

type Size = 'width' | 'height'
type Axis = 'x' | 'y'

// move forward mapping:
// from a starting direction we move forward
const MOVE_FORMWARD = {
  N: {axis: 'y', increment: 1},
  S: {axis: 'y', increment: -1},
  E: {axis: 'x', increment: 1},
  W: {axis: 'x', increment: -1},
}
// move backward mapping:
// from a starting direction we move backward
const MOVE_BACKWARD = {
  N: {axis: 'y', increment: -1},
  S: {axis: 'y', increment: 1},
  E: {axis: 'x', increment: -1},
  W: {axis: 'x', increment: 1},
}
// move the player to a new cell or detect a collision and stop
const move = (state: GameState, moveCommand: MoveCommand): GameState | null => {
  const newState = clone(state)

  let mappingMoves: any = MOVE_FORMWARD
  if (moveCommand === 'B') {
    mappingMoves = MOVE_BACKWARD
  }

  // get moving properties based on where player is facing
  const nextMoveProperties = mappingMoves[newState.playerPosition.direction]

  // calculate next move plus check for grid overflow using the modulo
  newState.playerPosition[nextMoveProperties.axis] = mod(
    newState.playerPosition[nextMoveProperties.axis] +
      nextMoveProperties.increment,
    nextMoveProperties.axis === 'y'
      ? newState.grid.height
      : newState.grid.width,
  )

  // check collision: validate next move if is feasible
  const hasMoveCollided = checkCollision(newState.grid, newState.playerPosition)
  if (hasMoveCollided) {
    return null
  }

  return newState
}

const checkCollision = (grid: Grid, position: Position): boolean => {
  //console.log("check collision first", grid.cells, "position", position);

  if (!grid.cells || grid.cells.length == 0) {
    throw new InvalidGridError('invalid grid cells empty of with len 0')
  }
  if (grid.cells[0].length === 0) {
    throw new InvalidGridError('invalid first row grid cells of len 0')
  }

  if (position.y >= grid.cells.length) {
    throw new InvalidPlayerPositionError(
      `invalid position y for the grid max rows: ${grid.cells.length}`,
    )
  }
  if (position.x >= grid.cells[0].length) {
    throw new InvalidPlayerPositionError(
      `invalid position x for the grid max cols: ${grid.cells[0].length}`,
    )
  }

  // check cell type if is a collision tile
  if (grid.cells[position.y][position.x] === 'X') {
    return true
  }

  return false
}

// a generator function that process the command and yield a new game state
export function* makeCommandIterator(
  state: GameState,
  commandSequence: CommandSequence,
) {
  if (commandSequence.length === 0) {
    return
  }

  let commandIndex = 0
  let lastState = {
    ...state,
    status: 'running',
  } as GameState

  yield lastState

  while (true) {
    // check for finishing the sequence, return the new state plus result
    if (commandIndex >= commandSequence.length) {
      yield {
        ...lastState,
        currentCommandSequence: lastState.currentCommandSequence + 1,
        status: 'stopped',
        commandsResults: [
          ...lastState.commandsResults,
          `${lastState.playerPosition.x}:${lastState.playerPosition.y}:${lastState.playerPosition.direction}`,
        ],
      } as GameState

      return // exit generator
    }

    const command = commandSequence[commandIndex]
    //console.log("executing command", command);

    // it is a turn command
    if (turnCommandArray.includes(command as TurnCommand)) {
      lastState = turn(lastState, command as TurnCommand)
      yield lastState
    } else {
      // else is a move command
      const moveState = move(lastState, command as MoveCommand)
      // got a collision! stop all the commands sequence
      if (!moveState) {
        yield {
          ...lastState,
          currentCommandSequence: lastState.currentCommandSequence + 1,
          status: 'stopped',
          commandsResults: [
            ...lastState.commandsResults,
            `O:${lastState.playerPosition.x}:${lastState.playerPosition.y}:${lastState.playerPosition.direction}`,
          ],
        } as GameState

        return
      } else {
        lastState = moveState
        yield lastState
      }
    }

    commandIndex++
  }
}

// consume a command sequence using a generator function, so we can iterate throgh commands one by one
export function executeCommandSequence(
  state: GameState,
  commandSequence: CommandSequence,
): GameState {
  //console.log("* Command sequence to process: ", commandSequence);

  const commandsIterator = makeCommandIterator(state, commandSequence)
  let lastState = state
  for (const newState of commandsIterator) {
    //console.log("\tNEXT command new state: ", newState.playerPosition);

    lastState = clone(newState)
  }
  //console.log("ending new state: ", lastState);
  return lastState
}
