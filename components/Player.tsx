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
  const getTransformRotation = (direction: string) => {
    switch(direction) {
      case 'E' :
        return 'rotate(90deg)'
      case 'S' :
        return 'rotate(180deg)'
      case 'W' :
        return 'rotate(270deg)'
      default:
          return 'rotate(0deg)'
    }
  }
  return (
    <div
      style={{
        background: 'transparent',
        width: '100%',
        height: '100%',
        border: '1px solid black'
      }}
    >
      <img src="arrow.svg" width={50} height={50} style={{ left: '25%', top: '25%', position: 'relative', transform: getTransformRotation(playerPosition.direction) }}/>
    </div>
  );
};

export default Player;
