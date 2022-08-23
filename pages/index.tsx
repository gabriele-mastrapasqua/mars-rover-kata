import type {NextPage} from 'next'
import Head from 'next/head'
import Image from 'next/image'
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Mars rover kata</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Mars rover kata!</h1>
        input:
        <textarea
          value={inputString}
          rows={10}
          onChange={e => {
            setInputString(e.target.value)
          }}
        />
        <button onClick={() => dispatch({type: 'reset'})}>
          Reset game
        </button>

        <button onClick={() => dispatch({type: 'parse', input: inputString})}>
          1. Parse input
        </button>
        
        Current comman sequence:{' '}
        <input disabled value={state.commands[state.currentCommandSequence]} />{' '}
        <button
          disabled={state.currentCommandSequence >= state.commands.length}
          onClick={() =>
            dispatch({
              type: 'nextCommands',
              commandSequence: state.commands[state.currentCommandSequence],
            })
          }
        >
          2. Execute next comman sequence
        </button>
        {state.grid && <>state.grid? {state.grid.cells.length}</>}
        {state.grid && (
          <Grid grid={mirrorGrid(state)} playerPosition={mirrorPlayer(state)} />
        )}
        output:
        <textarea />
      </main>
    </div>
  )
}

export default Home
