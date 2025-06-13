'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
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
  // 'isGameStarted' の代わりに、より詳細なゲーム状態を管理するstateを導入
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'cleared' | 'gameOver'>(
    'ready',
  );
  const [time, setTime] = useState(0);
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
    // gameStatus が 'playing' の間だけタイマーを動かす
    if (gameStatus === 'playing') {
      timerId = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [gameStatus]);
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
  const makeBombRandom = (x: number, y: number): number[][] => {
    const newBombMap = structuredClone(bombMap);
    for (let p = 0; p < 10; p++) {
      const a = Math.floor(Math.random() * board.length);
      const b = Math.floor(Math.random() * board[0].length);
      if ((a !== y || b !== x) && newBombMap[a][b] !== 11) {
        newBombMap[a][b] = 11;
        for (const row of directions) {
          if (
            newBombMap[a + row[0]] !== undefined &&
            newBombMap[a + row[0]][b + row[1]] !== 11 &&
            b + row[1] < board[0].length
          ) {
            newBombMap[a + row[0]][b + row[1]] += 1;
          }
        }
      } else {
        p -= 1;
      }
    }
    setBombMap(newBombMap);
    return newBombMap;
  };
  const calculateCombinedBoard = (userInputs: number[][], bombMap: number[][]): number[][][] => {
    return userInputs.map((row, y) => row.map((userInput, x) => [userInput, bombMap[y][x]]));
  };

  const clickHandler = (x: number, y: number) => {
    console.log(y, x);
    if (gameStatus === 'cleared' || gameStatus === 'gameOver') {
      return;
    }
    let currentBombMap: number[][] = bombMap;
    // 最初のクリック時の処理
    if (gameStatus === 'ready') {
      const newBombMap = makeBombRandom(x, y);
      currentBombMap = newBombMap;
      setGameStatus('playing'); // ゲーム状態を 'playing' に更新
    }
    console.log(currentBombMap);

    const newUserInputs = findBomb(y, x, userInputs, currentBombMap);

    const newGameStatus = checkGameStatus(newUserInputs, currentBombMap);

    if (newGameStatus === 'gameOver') {
      alert('Game Over!');
      setGameStatus('gameOver');
    } else if (newGameStatus === 'cleared') {
      alert('Game Clear!');
      setGameStatus('cleared');
    }

    setUserInputs(newUserInputs);
  };
  const findBomb = (
    y: number,
    x: number,
    currentUserInputs: number[][],
    currentBombMap: number[][],
  ): number[][] => {
    const newUserInputs = structuredClone(currentUserInputs);

    const openAdjacentCells = (cy: number, cx: number) => {
      // 範囲外または既に開いているマスは処理しない
      if (
        cy < 0 ||
        cy >= newUserInputs.length ||
        cx < 0 ||
        cx >= newUserInputs[0].length ||
        newUserInputs[cy][cx] === 1
      ) {
        return;
      }

      newUserInputs[cy][cx] = 1; // マスを開く

      // 開いたマスが0でなければ、そこで再帰を止める
      if (currentBombMap[cy][cx] !== 0) {
        return;
      }

      // 0のマスなら、周囲のマスに対して再帰的に処理を行う
      for (const d of directions) {
        openAdjacentCells(cy + d[0], cx + d[1]);
      }
    };
    openAdjacentCells(y, x);
    return newUserInputs;
  };

  const checkGameStatus = (
    newInputs: number[][],
    bombMap: number[][],
  ): 'cleared' | 'gameOver' | 'playing' => {
    const isGameOver = newInputs.flat().some((input, i) => input === 1 && bombMap.flat()[i] === 11);
    console.log(isGameOver);

    if (isGameOver) {
      return 'gameOver';
    }

    // 開かれていないマスの数を数える
    const unopenedCells = newInputs.flat().filter((input) => input !== 1).length;

    // 開かれていないマスの数と爆弾の数が同じならゲームクリア
    if (unopenedCells === 10) {
      // 10は爆弾の数
      return 'cleared';
    }

    return 'playing';
  };
  const calcBoard: number[][][] = calculateCombinedBoard(userInputs, bombMap);

  const flagsPlaced = userInputs.flat().filter((userInput) => userInput === 8).length;
  const bombsRemaining = 10 - flagsPlaced;

  const nextStateMap: { [key: number]: number } = {
    0: 8, // 未開封(0) -> 旗(2)
    8: 7, // 旗(2) -> ？(3)
    7: 0, // ？(3) -> 未開封(0)
  };

  const flagAndQuestion = (y: number, x: number, evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();
    console.log(y, x);
    //右クリック onContextMenu
    const newUserInputs = structuredClone(userInputs);
    const currentStatus = newUserInputs[y][x];

    newUserInputs[y][x] = nextStateMap[currentStatus] ?? currentStatus;

    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.flame}>
        <div className={styles.info}>
          <div className={styles.flagCounter}>{bombsRemaining}</div>
          <div className={styles.space} />
          <button className={styles.infoButton} style={{ backgroundPosition: `-329px` }} />
          <div className={styles.space} />
          <div className={styles.timer}>{time}</div>
        </div>
        <div className={styles.horizontalFlame} />
        <div className={styles.board}>
          {calcBoard.map((row, y) =>
            row.map((cellData, x) => {
              const userInput = cellData[0];
              const bombValue = cellData[1];
              return (
                <div
                  className={styles.cell}
                  key={`${x}-${y}`}
                  style={{
                    backgroundPosition: (() => {
                      // userInputの値に応じて表示を切り替える
                      if (userInput === 1) {
                        // 1: 開封済み
                        // bombValueを使って数字の画像位置を決める
                        return `${(bombValue - 1) * -30}px`;
                      }
                      if (userInput === 8) {
                        // 8: 旗
                        return '-272px';
                      }
                      if (userInput === 7) {
                        // 7: ？
                        return '-242px';
                      }
                      // 0: 未開封
                      return '30px';
                    })(),
                    border: userInput === 1 ? '1px solid #000' : '3px outset #aaa',
                  }}
                  onClick={() => clickHandler(x, y)}
                  onContextMenu={(evt) => flagAndQuestion(y, x, evt)}
                />
              );
            }),
          )}
        </div>
      </div>
    </div>
  );
}
//くぁｗせｄｒｆｔｇｙふじこｌｐ
