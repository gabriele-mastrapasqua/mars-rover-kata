import * as React from 'react'
import {GameContext} from '../contexts/game.context'

export function useGame() {
  const context = React.useContext(GameContext)
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider')
  }
  return context
}
