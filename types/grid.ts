// Tile type:
// 0: empty
// X: collisionable
export type Cell = '0' | 'X'

// a Grid of cells
export default interface Grid {
  width: number
  height: number
  cells: Cell[][]
}
