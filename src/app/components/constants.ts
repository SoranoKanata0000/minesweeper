export const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

export const nextStateMap: { [key: number]: number } = {
  0: 8, // 未開封(0) -> 旗(2)
  8: 7, // 旗(2) -> ？(3)
  7: 0, // ？(3) -> 未開封(0)
};

export const difficultySettings = {
  easy: { width: 9, height: 9, bombs: 10 },
  medium: { width: 16, height: 16, bombs: 40 },
  hard: { width: 30, height: 16, bombs: 99 },
  custom: { width: 10, height: 10, bombs: 15 },
};
