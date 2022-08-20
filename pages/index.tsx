import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Grid from "../components/Grid";
import { useState } from "react";

const Home: NextPage = () => {
  
  const [inputString] = useState(`Grid
  Size 5 4
  Obstacle 2 0
  Obstacle 0 3
  Obstacle 3 2
  Commands
  RFF
  RF
  LFRFFLFFFLL
  `.replace(/\t/g, '').replace(/  /g, '')
  );
  const [rows] = useState(0);
  const [cols] = useState(0);

  return (
    <div className={styles.container}>
      <Head>
        <title>Mars rover kata</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to the Mars rover kata!</h1>
        input:
        <textarea value={inputString} rows={10}/>
        start btn step btn
        <Grid rows={rows} cols={cols} />
        output:
        <textarea />
      </main>
    </div>
  );
};

export default Home;
