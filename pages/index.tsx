import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from '../components/Grid'
import {useState} from 'react'
import {useGame} from '../hooks/game.hook'
import {mirrorGrid, mirrorPlayer} from '../lib/game'
import {makeCommandIterator} from '../lib/game.commandProcessor'
import {clone} from '../lib/utils'

const Home: NextPage = () => {
  const [inputString, setInputString] = useState(
    `Grid
  Size 5 4
  Obstacle 2 0
  Obstacle 0 3
  Obstacle 3 2
  Commands
  RFF
  RF
  LFRFFLFFFLL
  `
      .replace(/\t/g, '')
      .replace(/  /g, ''),
  )
  const {state, dispatch} = useGame()
  const [gameStarted, setGameStarted] = useState(false)
  const [timeNextTick, setTimeNextTick] = useState(500)

  const formatOutput = (commandResults: string[]) => {
    return commandResults.join('\n')
  }

  return (
    <div
      className={styles.container}
      style={{
        background: 'url(stars.jpg)',
      }}
    >
      <Head>
        <title>Mars rover kata</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Mars rover kata!</h1>

        {!gameStarted && (
          <div style={{padding: '10px'}}>
            <button onClick={() => setGameStarted(true)}>Start game</button>
          </div>
        )}

        {gameStarted && (
          <>
            <audio src="space-chillout-14194.mp3" autoPlay={true} loop={true} />

            <div className="container">
              <div className="input-panel">
                <h2>Input</h2>
                <textarea
                  value={inputString}
                  rows={10}
                  onChange={e => {
                    setInputString(e.target.value)
                  }}
                />
                <div>
                  <button
                    disabled={state.grid !== null}
                    onClick={() =>
                      dispatch({type: 'parse', input: inputString})
                    }
                  >
                    Load input
                  </button>
                </div>

                {state.grid && (
                  <div>
                    <h2>Output</h2>
                    <textarea
                      readOnly
                      value={formatOutput(state.commandsResults)}
                      rows={5}
                    />
                    <div className="command-panel">
                      <button
                        disabled={!state.grid}
                        onClick={() => dispatch({type: 'reset'})}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div>
                {state.grid && (
                  <div>
                    <h3>Game</h3>

                    <Grid
                      grid={mirrorGrid(state)}
                      playerPosition={mirrorPlayer(state)}
                    />

                    <div className="command-panel" style={{paddingTop: '10px'}}>
                      <div className="command-panel">
                        Current command sequence:{' '}
                        <input
                          disabled
                          value={state.commands[state.currentCommandSequence]}
                        />{' '}
                      </div>
                      <div>
                        {/*
                  <button
                    disabled={
                      state.currentCommandSequence >= state.commands.length
                    }
                    onClick={() =>
                      dispatch({
                        type: 'nextCommands',
                        commandSequence:
                          state.commands[state.currentCommandSequence],
                      })
                    }
                  >
                    Execute next comman sequence
                  </button>
                  */}
                        Time:{' '}
                        <input
                          disabled={state.status === 'running'}
                          type="number"
                          min={0}
                          style={{width: '60px'}}
                          value={timeNextTick}
                          onChange={e =>
                            setTimeNextTick(parseInt(e.target.value, 10))
                          }
                        />{' '}
                        <button
                          disabled={
                            state.currentCommandSequence >=
                              state.commands.length ||
                            state.status === 'running'
                          }
                          onClick={() => {
                            // consume the generator function using a timer, so we can see the changes for each moves
                            const commandSequence =
                              state.commands[state.currentCommandSequence]
                            const commandsIterator = makeCommandIterator(
                              state,
                              commandSequence,
                            )

                            const executeNextCommand = (
                              commandsIterator: any,
                            ) => {
                              const nextIter = commandsIterator.next()
                              if (!nextIter.done) {
                                //console.log('*** next iter', nextIter.value.status)
                                const nextState = nextIter.value

                                dispatch({
                                  type: 'updateGameState',
                                  nextState: nextState,
                                })
                                setTimeout(() => {
                                  executeNextCommand(commandsIterator)
                                }, timeNextTick)
                              }
                            }

                            executeNextCommand(commandsIterator)
                          }}
                        >
                          Process next commands sequence
                        </button>
                      </div>
                      {state.currentCommandSequence >=
                        state.commands.length && (
                        <>
                          <h1 style={{color: '#59e359'}}>Game completed!</h1>
                          <h3 style={{color: '#59e359'}}>
                            Press reset to reload the game!
                          </h3>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
