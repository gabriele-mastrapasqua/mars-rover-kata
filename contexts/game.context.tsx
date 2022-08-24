import * as React from 'react'
import {initialState} from '../lib/game'
import {executeCommandSequence} from '../lib/game.commandProcessor'
import {parse} from '../lib/parse'
import {CommandSequence} from '../types/commands'
import {GameState} from '../types/game'

type Action =
  | {type: 'reset'}
  | {type: 'parse'; input: string}
  | {type: 'nextCommands'; commandSequence: CommandSequence}
type Dispatch = (action: Action) => void
type GameProviderProps = {children: React.ReactNode}

export const GameContext = React.createContext<
  {state: GameState; dispatch: Dispatch} | undefined
>(undefined)

function gameReducer(state: GameState, action: Action) {
  switch (action.type) {
    case 'reset': {
      return initialState()
    }
    case 'parse': {
      console.log('context parse action', action)
      const nextState = parse(action.input)
      console.log('context parse action next', nextState)
      return nextState
    }
    case 'nextCommands': {
      return executeCommandSequence(state, action.commandSequence)
    }
  }
}

function GameProvider({children}: GameProviderProps) {
  const [state, dispatch] = React.useReducer(gameReducer, initialState())
  const value = {state, dispatch}
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export {GameProvider}
