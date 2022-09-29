import {
  CommandSequence,
  MoveCommand,
  moveCommandArray,
  TurnCommand,
  turnCommandArray,
} from '../types/commands'
import {GameState, Obstacle} from '../types/game'
import {
  InvalidCommandError,
  InvalidCommandSequenceError,
  InvalidGridError,
  InvalidObstaclesError,
} from './errors'
import {initialState, newGameState} from './game'
import {sanitize} from './utils'

type ParseSection = 'none' | 'grid' | 'obstacles' | 'commands'

const parseSizes = (row: string) => {
  const sizes = row.split(' ')
  if (sizes.length !== 3) {
    throw new InvalidGridError(`Bad grid size format: ${row}`)
  }
  const gridWidth = parseInt(sizes[1], 10)
  const gridHeight = parseInt(sizes[2], 10)
  return [gridWidth, gridHeight]
}

export const parse = (input: string): GameState => {
  input = sanitize(input)

  let currentSection: ParseSection = 'none'

  const rows = input.split('\n')
  let sizes = [0, 0]
  let obstacles: Obstacle[] = []
  let commands: CommandSequence[] = []

  rows
    .filter(row => row !== '')
    .forEach((row: string) => {
      if (currentSection === 'none' && row.startsWith('Size')) {
        currentSection = 'grid'
        sizes = parseSizes(row)
      } else if (row.startsWith('Obstacle')) {
        currentSection = 'obstacles'
        const positions = row.split(' ')
        if (positions.length !== 3) {
          throw new InvalidObstaclesError(`Bad obstacles line format: ${row}`)
        }
        const x = parseInt(positions[1], 10)
        const y = parseInt(positions[2], 10)
        obstacles.push({position: {x, y}})
      } else if (row.startsWith('Commands')) {
        currentSection = 'commands'
      }

      // commands are multi lines sections after the first Commands
      if (currentSection === 'commands' && !row.startsWith('Commands')) {
        const commandSequence = row.split('')
        if (commandSequence.length === 0) {
          throw new InvalidCommandSequenceError(
            `Bad command line format: ${row}`,
          )
        }
        validateCommands(commandSequence)
        commands.push(commandSequence as CommandSequence)
      }
    })

  let [gridWidth, gridHeight] = sizes

  // basic check for input errors
  if (gridWidth === 0 || gridHeight === 0) {
    throw new InvalidGridError('Bad grid size parsed!')
  }

  if (commands.length === 0) {
    throw new InvalidCommandSequenceError(
      'Bad commands parsed! We got no commands to execute!',
    )
  }

  const game = newGameState(gridWidth, gridHeight, obstacles, commands)
  return game
}
const validateCommands = (commandList: string[]): boolean => {
  commandList.forEach(command => {
    if (
      !turnCommandArray.includes(command as TurnCommand) &&
      !moveCommandArray.includes(command as MoveCommand)
    ) {
      throw new InvalidCommandError(`invalid commmand: ${command}`)
    }
  })
  return true
}
