import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Grid from '../components/Grid'
import {useState} from 'react'
import {useGame} from '../hooks/game.hook'
import {mirrorGrid, mirrorPlayer} from '../lib/game'

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
                onClick={() => dispatch({type: 'parse', input: inputString})}
              >
                Start game
              </button>
            </div>

            {state.grid && (
              <div>
                <h2>Output</h2>
                <textarea
                  value={formatOutput(state.commandsResults)}
                  rows={5}
                />
              </div>
            )}
          </div>

          <div>
            {state.grid && (
              <div>
                <h3>Current comman sequence: </h3>
                <div className="command-panel">
                  <input
                    disabled
                    value={state.commands[state.currentCommandSequence]}
                  />{' '}
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
                    2. Execute next comman sequence
                  </button>
                  <button onClick={() => dispatch({type: 'reset'})}>
                    Reset game
                  </button>
                </div>
                <Grid
                  grid={mirrorGrid(state)}
                  playerPosition={mirrorPlayer(state)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
