'use client';

import { useState } from 'react';
import styles from './page.module.css';

// const calcTotalPoint = (array: number[], counter: number) => {
//   counter;
//   const result = array.reduce((accumulator, currentValue) => accumulator + currentValue);
//   return result + counter;
// };
// const down = (n: number) => {
//   console.log(n);
//   if (n === 0) {
//     return n;
//   } else {
//     down(n - 1);
//   }
// };
// down(10);
// const sum1 = (n: number): number => {
//   return n === 0 ? n : n + sum1(n - 1);
// };
// console.log('sum1=>', sum1(10));

// const sum2 = (n: number, m: number): number => {
//   return n === m ? n : n + sum2(n + 1, m);
// };
// console.log('sum2=>', sum2(4, 10));
// const sum3 = (n: number, m: number): number => {
//   return (1 / 2) * (m + 1 - n) * (n + m);
// };
// console.log('sum3=>', sum3(4, 10));
export default function Home() {
  // const [sampleCounter, setSampleCounter] = useState(0);
  // console.log('sampleCounter=', sampleCounter);
  // const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // console.log('samplePoints=', samplePoints);
  // const totalPoint = calcTotalPoint(samplePoints, sampleCounter);
  // console.log('totalPoint=', totalPoint);
  const board = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const [userInputs, setUserInputs] = useState(board);
  const [bombMap, setBombMap] = useState(board);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const makeBombRandom = (x: number, y: number) => {
    // const newBombMap = structuredClone(bombMap);
    const bombCoordinate: number[][] = [];
    for (let p = 0; p < 10; p++) {
      const a = Math.floor(Math.random() * 9);
      const b = Math.floor(Math.random() * 9);
      a !== y || b !== x ? bombCoordinate.push([a, bombMap[a].indexOf(1)]) : (p -= 1);
    }
    // setBombMap(newBombMap);
  };
  //Geminiに作ってもらったところ
  // calculateCombinedBoard.ts または同じファイル内のどこかに定義
  const calculateCombinedBoard = (userInputs: number[][], bombMap: number[][]): number[][] => {
    // for (const value of bombCoordinate) {
    //   calcBombMap
    // }
    const combinedBoard: number[][] = [];
    const rows = board.length;
    const cols = board[0].length;
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        // bombMapとuserInputsのどちらかに0以外の数値が入っている場合はその数値を入れる
        // どちらも0の場合は0
        row.push(userInputs[y][x] + bombMap[y][x]);
      }
      combinedBoard.push(row);
    }
    return combinedBoard;
  };
  //ここまで
  const clickHandler = (x: number, y: number) => {
    console.log(y, x);
    if (!isGameStarted) {
      makeBombRandom(x, y);
      setIsGameStarted(true);
    }
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = 1;
    setUserInputs(newUserInputs);
    calculateCombinedBoard(userInputs, bombMap);
    //引数は後で追加
  };
  const calcBoard: number[][] = calculateCombinedBoard(userInputs, bombMap);

  const flagAndQuestion = (y: number, x: number, evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();
    console.log(y, x);
    //右クリック onContextMenu
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.sampleCell} style={{ backgroundPosition: sampleCounter * -30 }} /> */}
      <div className={styles.flame}>
        <div className={styles.board}>
          {calcBoard.map((row, y) =>
            row.map((value, x) => (
              <div
                className={styles.cell}
                key={`${x}-${y}`}
                style={{
                  backgroundPosition: userInputs[y][x] > 0 ? (value - 1) * -30 : 30,
                  border: userInputs[y][x] === 0 ? `4px outset #aaa` : `1px solid #000`,
                }}
                onClick={() => clickHandler(x, y)}
                onContextMenu={(evt) => flagAndQuestion(x, y, evt)}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}

// for (let i = -1; i < 2; i++) {
//         for (let j = -1; j < 2; j++) {
//           if (i === 0 && j === 0) {
//             continue;
//           }
//           newBombMap[a + i] !== undefined && newBombMap[a + i][b + j] === 10
//             ? (newBombMap[a + i][b + j] -= 0)
//             : newBombMap[a + i] !== undefined && newBombMap[a + i][b + j]++;
//         }
//       }
