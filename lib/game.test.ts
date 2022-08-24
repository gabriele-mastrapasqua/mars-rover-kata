import {GameState} from '../types/game'
import {mirrorGrid} from './game'
import {parse} from './parse'

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

describe('test mirror y axis', () => {
  it('should reverse the y axis values for UI', () => {
    const game: GameState = parse(testInputString)

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

    //console.log('mirrorGrid(game)', mirrorGrid(game))
    expect(mirrorGrid(game)[0]).toEqual(['X', '0', '0', '0', '0'])
  })
})
