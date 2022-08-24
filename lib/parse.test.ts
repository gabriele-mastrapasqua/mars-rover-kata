import {GameState} from '../types/game'
import {
  InvalidCommandSequenceError,
  InvalidGridError,
  InvalidObstaclesError,
} from './errors'
import {InvalidCommandError, parse} from './parse'

let testInputString: string = `
        Grid
        Size 5 4
        Obstacle 2 0
        Obstacle 0 3
        Obstacle 3 2
        Commands
        RFF
        RF
        LFRFFLFFFLL
        `

describe('parse test input', () => {
  it('should find a grid of 5 width 4 height', () => {
    const game: GameState = parse(testInputString)

    //console.log("got a game ", game.grid);
    expect(game).not.toBe(null)
    expect(game.grid.width).toBe(5)
    expect(game.grid.height).toBe(4)
    expect(game.obstacles.length).toBe(3)
    expect(game.commands.length).toBe(3)
    expect(game.grid.cells.length).toBe(4)
    expect(game.grid.cells[0].length).toBe(5)
    expect(game.grid.cells[0]).toEqual(['0', '0', 'X', '0', '0'])
    expect(game.grid.cells[1]).toEqual(['0', '0', '0', '0', '0'])
    expect(game.grid.cells[2]).toEqual(['0', '0', '0', 'X', '0'])
    expect(game.grid.cells[3]).toEqual(['X', '0', '0', '0', '0'])
  })
  it('should throw an error for invalid commands', () => {
    const f = () => {
      const game: GameState = parse(`
          Grid
          Size 5 4
          Commands
          RFX
          `)
    }
    expect(f).toThrow(InvalidCommandError)
  })
  it('should throw an error for invalid grid format', () => {
    const f = () => {
      const game: GameState = parse(`
          Grid
          Size 5 4 6
          Commands
          RFX
          `)
    }
    expect(f).toThrow(InvalidGridError)
  })
  it('should throw an error for invalid obstacle format', () => {
    const f = () => {
      const game: GameState = parse(`
          Grid
          Size 5 4
          Obstacle 2
          Commands
          RFX
          `)
    }
    expect(f).toThrow(InvalidObstaclesError)
  })
  it('should throw an error for invalid obstacle format', () => {
    const f = () => {
      const game: GameState = parse(`
          Grid
          Size 5 4
          Obstacle 2 2
          Commands
          
          `)
    }
    expect(f).toThrow(InvalidCommandSequenceError)
  })
  it('should throw an error for invalid grid size', () => {
    const f = () => {
      const game: GameState = parse(`
          Grid
          Size 1 0
          Obstacle 2 2
          Commands
          RFF
          `)
    }
    expect(f).toThrow(InvalidGridError)
  })
})
