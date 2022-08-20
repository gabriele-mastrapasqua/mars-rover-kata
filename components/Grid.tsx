import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

interface Props {
  rows: number;
  cols: number;
}

const Grid : React.FC<Props>  = ({rows, cols}) => {
  return (
    <div>
      this is a grid {rows} and cols {cols}
    </div>
  )
}

export default Grid
