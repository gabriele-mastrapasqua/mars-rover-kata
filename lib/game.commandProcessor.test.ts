import { GameState } from "../types/game";
import { mirrorGrid } from "./game";
import { executeCommandSequence } from "./game.commandProcessor";
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

describe("test executing commmands", () => {
  it("should execute the demo command sequences", () => {
    const game: GameState = parse(testInputString);

    expect(game).not.toBe(null);
    expect(game.grid.width).toBe(5);
    expect(game.grid.height).toBe(4);
    expect(game.obstacles.length).toBe(3);
    expect(game.commands.length).toBe(3);
    
    // now try to execute the first sequence of commands
    expect(game.commands[0]).toEqual(["R", "F", "F"]);
    let newState = executeCommandSequence(game, game.commands[0])
    expect(newState.commandsResults.length).toBe(1);
    expect(newState.commandsResults[0]).toEqual("O:1:0:E");

    //console.log('new state', newState)
    expect(game.commands[1]).toEqual(["R", "F"]);
    newState = executeCommandSequence(newState, game.commands[1])
    expect(newState.commandsResults.length).toBe(2);
    expect(newState.commandsResults[1]).toEqual("1:3:S");

    //LFRFFLFFFLL
    expect(game.commands[2]).toEqual(["L", "F", "R", "F", "F", "L", "F", "F",  "F",  "L", "L"]);
    newState = executeCommandSequence(newState, game.commands[2])
    expect(newState.commandsResults.length).toBe(3);
    expect(newState.commandsResults[2]).toEqual("0:1:W");

    

  });
});
