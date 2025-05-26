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
  const makeBombRandom = () => {
    const newBombBoard = structuredClone(bombBoard);
    for (let y = 0; y < 10; y++) {
      const a = Math.floor(Math.random() * 9);
      const b = Math.floor(Math.random() * 9);
      newBombBoard[a][b] = 11;
    }
    return newBombBoard;
  };

  const clickHandler = (x: number, y: number) => {
    const newUserInputs = structuredClone(userInputs);
    newUserInputs[y][x] = 1;
    setUserInputs(newUserInputs);
    makeBombRandom(); //引数は後で追加
  };

  /*ボタンを押したらそのマスの表示が変わるようにしたい*/

  return (
    <div className={styles.container}>
      {/* <div className={styles.sampleCell} style={{ backgroundPosition: sampleCounter * -30 }} /> */}
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <button
              className={color === 0 ? styles.cell : styles.openedCell}
              key={`${x}-${y}`}
              onClick={() => clickHandler(x, y)}
            />
          )),
        )}
      </div>
    </div>
  );
}

/*userInputs + bombMap => calcBoard*/
