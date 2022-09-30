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
    //console.log('mirrorGrid(game)', mirrorGrid(game))
    expect(mirrorGrid(game)[0]).toEqual(['X', '0', '0', '0', '0'])
  })
})
