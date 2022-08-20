import { GameState } from "../types/game";
import { parse } from "./parse";

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
        `;

describe("parse test input", () => {
  it("should find a grid of 5 width 4 height", () => {
    const game: GameState = parse(testInputString);

    console.log('got a game ', game.grid)
    expect(game).not.toBe(null);
    expect(game.grid.width).toBe(5);
    expect(game.grid.height).toBe(4);
    expect(game.obstacles.length).toBe(3);
    expect(game.commands.length).toBe(3);
  });
});
