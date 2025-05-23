'use client';

import { useState } from 'react';
import styles from './page.module.css';

const calcTotalPoint = (array: number[], counter: number) => {
  counter;
  const result = array.reduce((accumulator, currentValue) => accumulator + currentValue);
  return result + counter;
};
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
  const [sampleCounter, setSampleCounter] = useState(0);
  console.log('sampleCounter=', sampleCounter);
  const [samplePoints, setSamplePoints] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  console.log('samplePoints=', samplePoints);
  const totalPoint = calcTotalPoint(samplePoints, sampleCounter);
  console.log('totalPoint=', totalPoint);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = () => {
    setSampleCounter((sampleCounter + 1) % 14);
    const newSamplePoints = structuredClone(samplePoints);
    newSamplePoints[sampleCounter] += 1;
    setSamplePoints(newSamplePoints);
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.sampleCell} style={{ backgroundPosition: sampleCounter * -30 }} /> */}
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`}>
              a
            </div>
          )),
        )}
      </div>
      <button onClick={clickHandler}>一般脳死凸戦犯</button>
    </div>
  );
}

/*userInputs + bombMap => calcBoard*/
