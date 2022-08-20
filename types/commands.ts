
export const turnCommandArray = ["R", "L"] as const; // R: Right, L: Left
export type TurnCommand = typeof turnCommandArray[number]; // to literal type

export const moveCommandArray = ["F", "B"] as const; // F: forward, B: Backward
export type MoveCommand = typeof moveCommandArray[number]; // to literal type

export type Command = TurnCommand | MoveCommand; // union turns ands moves
export type CommandSequence = Command[];
