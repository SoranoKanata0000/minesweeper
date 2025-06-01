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
  const [bombBoard, setBombBoard] = useState(board);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  const makeBombRandom = (x: number, y: number) => {
    const newBombBoard = structuredClone(bombBoard);
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * 9);
      const b = Math.floor(Math.random() * 9);
      (newBombBoard[a][b] === 0 && a !== y) || b !== x ? (newBombBoard[a][b] = 11) : (i -= 1);
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          newBombBoard[a + i] !== undefined && newBombBoard[a + i][b + j] === 11
            ? (newBombBoard[a + i][b + j] += 0)
            : (newBombBoard[a + i][b + j] += 1);
        }
      }
    }
    setBombBoard(newBombBoard);
  };
  //Geminiに作ってもらったところ
  // calculateCombinedBoard.ts または同じファイル内のどこかに定義
  const calculateCombinedBoard = (userInputs: number[][], bombBoard: number[][]): number[][] => {
    const combinedBoard: number[][] = [];
    const rows = userInputs.length;
    const cols = userInputs[0].length;
    for (let y = 0; y < rows; y++) {
      const row: number[] = [];
      for (let x = 0; x < cols; x++) {
        // bombBoardとuserInputsのどちらかに0以外の数値が入っている場合はその数値を入れる
        // どちらも0の場合は0
        row.push(userInputs[y][x] + bombBoard[y][x]);
      }
      combinedBoard.push(row);
    }
    return combinedBoard;
  };
  //ここまで
  const clickHandler = (x: number, y: number) => {
    if (!isGameStarted) {
      makeBombRandom(x, y);
      setIsGameStarted(true);
    }
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = 1;
    setUserInputs(newUserInputs);
    calculateCombinedBoard(userInputs, bombBoard);
    //引数は後で追加
  };
  const calcBoard: number[][] = calculateCombinedBoard(userInputs, bombBoard);

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
                className={styles.openCell}
                key={`${x}-${y}`}
                style={{
                  backgroundPosition:
                    calcBoard[y][x] - 1 === 0 ? `transparent` : (calcBoard[y][x] - 1) * -30,
                }}
                onContextMenu={(evt) => flagAndQuestion(x, y, evt)}
              >
                <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)} />
              </div>
            )),
          )}
        </div>
      </div>
    </div>
  );
}
