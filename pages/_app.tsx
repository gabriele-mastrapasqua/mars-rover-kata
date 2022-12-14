import '../styles/globals.css'
import '../styles/button.css'
import type {AppProps} from 'next/app'
import {GameProvider} from '../contexts/game.context'

function MyApp({Component, pageProps}: AppProps) {
  return (
    <GameProvider>
      <Component {...pageProps} />
    </GameProvider>
  )
}

export default MyApp
