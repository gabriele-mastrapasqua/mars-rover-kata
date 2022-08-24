import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { ReactNode } from "react";
import styles from "../styles/Home.module.css";
import Grid from "../types/grid";

interface Props {
  x: number;
  y: number;
  value: string;
  children: ReactNode;
}

const Cell: React.FC<Props> = ({ x, y, value, children }) => {
  return (
    <div
      style={{
        //backgroundColor: value === 'X' ? '#000' : "#fff",
        background: 'url(tile_terrain.jpg)',
        width: 100,
        height: 100,
      }}
    >
      {value === 'X' && (
        <img src="tile_rock1.png" width={70} height={70} style={{position: 'relative', top: '20%', left: '20%'}}/>
      )}
      {children}
    </div>
  );
};

export default Cell;
