import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { PlayerPosition } from "../types/game";
import Grid from "../types/grid";

interface Props {
  playerPosition: PlayerPosition;
}

const Player: React.FC<Props> = ({ playerPosition }) => {
  return (
    <div
      style={{
        background: 'red',
        width: 50,
        height: 50,
        border: '1px solid black'
      }}
    >
      Player {playerPosition.x}, {playerPosition.y}, {playerPosition.direction}
    </div>
  );
};

export default Player;
