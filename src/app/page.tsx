'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const difficultySettings = {
    easy: { width: 9, height: 9, bombs: 10 },
    medium: { width: 16, height: 16, bombs: 40 },
    hard: { width: 30, height: 16, bombs: 99 },
    custom: { width: 10, height: 10, bombs: 15 },
  };

  type Difficulty = keyof typeof difficultySettings;

  const createBoard = (height: number, width: number): number[][] => {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
  };

  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  const [customSettings, setCustomSettings] = useState({
    height: 10,
    width: 10,
    bombs: 15,
  });

  const initialSettings = difficultySettings[difficulty];
  const settings = difficulty === 'custom' ? customSettings : difficultySettings[difficulty];

  const [userInputs, setUserInputs] = useState(
    createBoard(initialSettings.height, initialSettings.width),
  );
  const [bombMap, setBombMap] = useState(
    createBoard(initialSettings.height, initialSettings.width),
  );
  const [gameStatus, setGameStatus] = useState<'ready' | 'playing' | 'cleared' | 'gameOver'>(
    'ready',
  );

  const [time, setTime] = useState(0);
  useEffect(() => {
    let timerId: NodeJS.Timeout | undefined;
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

  const customHeightRef = useRef<HTMLInputElement>(null);
  const customWidthRef = useRef<HTMLInputElement>(null);
  const customBombsRef = useRef<HTMLInputElement>(null);

  const makeBombRandom = (x: number, y: number, bombs: number): number[][] => {
    const currentSettings = settings;
    const newBombMap = createBoard(currentSettings.height, currentSettings.width);
    for (let p = 0; p < bombs; p++) {
      const a = Math.floor(Math.random() * currentSettings.height);
      const b = Math.floor(Math.random() * currentSettings.width);
      if ((a !== y || b !== x) && newBombMap[a][b] !== 11) {
        newBombMap[a][b] = 11;
        for (const row of directions) {
          if (
            newBombMap[a + row[0]] !== undefined &&
            newBombMap[a + row[0]][b + row[1]] !== 11 &&
            b + row[1] < currentSettings.width
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
    if (
      gameStatus === 'cleared' ||
      gameStatus === 'gameOver' ||
      userInputs[y][x] === 8 ||
      userInputs[y][x] === 7
    ) {
      return;
    }
    let currentBombMap: number[][] = bombMap;
    // 最初のクリック時の処理
    if (gameStatus === 'ready') {
      const currentSettings = settings;
      const newBombMap = makeBombRandom(x, y, currentSettings.bombs);
      currentBombMap = newBombMap;
      setGameStatus('playing');
    }
    console.log(currentBombMap);

    const newUserInputs = findBomb(y, x, userInputs, currentBombMap);

    const newGameStatus = checkGameStatus(newUserInputs, currentBombMap);

    if (newGameStatus === 'gameOver') {
      currentBombMap[y][x] = -1;
      alert('Game Over!');
      setGameStatus('gameOver');

      const finalBoard = newUserInputs.map((row, y) =>
        row.map((userInput, x) => {
          if (currentBombMap[y][x] === 11) {
            return 1;
          }
          return userInput;
        }),
      );

      setUserInputs(finalBoard);
      return;
    }
    setUserInputs(newUserInputs);

    if (newGameStatus === 'cleared') {
      alert('Game Clear!');
      setGameStatus('cleared');
      const finalBoard = newUserInputs.map((row, y) =>
        row.map((userInput, x) => {
          if (currentBombMap[y][x] === 11) {
            return 8;
          }
          return userInput;
        }),
      );

      setUserInputs(finalBoard);
      return;
    }
  };
  const findBomb = (
    y: number,
    x: number,
    currentUserInputs: number[][],
    currentBombMap: number[][],
  ): number[][] => {
    const newUserInputs = structuredClone(currentUserInputs);

    const openAdjacentCells = (cy: number, cx: number) => {
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

      if (currentBombMap[cy][cx] !== 0) {
        return;
      }

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

    if (isGameOver) {
      return 'gameOver';
    }

    const unopenedCells = newInputs.flat().filter((input) => input !== 1).length;
    const currentBombCount = settings.bombs;
    if (unopenedCells === currentBombCount) {
      return 'cleared';
    }

    return 'playing';
  };
  const calcBoard: number[][][] = calculateCombinedBoard(userInputs, bombMap);

  const flagsPlaced = userInputs.flat().filter((userInput) => userInput === 8).length;
  const bombsRemaining = settings.bombs - flagsPlaced;

  const nextStateMap: { [key: number]: number } = {
    0: 8, // 未開封(0) -> 旗(2)
    8: 7, // 旗(2) -> ？(3)
    7: 0, // ？(3) -> 未開封(0)
  };

  const flagAndQuestion = (y: number, x: number, evt: React.MouseEvent<HTMLDivElement>) => {
    evt.preventDefault();
    console.log(y, x);
    if (gameStatus === 'cleared' || gameStatus === 'gameOver') {
      return;
    }
    const newUserInputs = structuredClone(userInputs);
    const currentStatus = newUserInputs[y][x];

    newUserInputs[y][x] = nextStateMap[currentStatus] ?? currentStatus;

    setUserInputs(newUserInputs);
  };
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    const newSettings = difficultySettings[newDifficulty];
    resetBoard(newSettings);
  };
  const resetHandler = () => {
    console.log('reset');
    let settingsToUse = difficultySettings[difficulty];

    if (difficulty === 'custom') {
      if (customHeightRef.current && customWidthRef.current && customBombsRef.current) {
        const height = Number(customHeightRef.current.value);
        const width = Number(customWidthRef.current.value);
        const bombs =
          (Number(customBombsRef.current.value) / (height * width)) * 100 <= 38
            ? Number(customBombsRef.current.value)
            : Number(Math.floor(height * width * 0.38));

        settingsToUse = { height, width, bombs };
        customBombsRef.current.value = String(bombs);
        setCustomSettings(settingsToUse);
      }
    }

    resetBoard(settingsToUse);
  };

  const resetBoard = (settings: { height: number; width: number; bombs: number }) => {
    const newBoard = createBoard(settings.height, settings.width);
    setUserInputs(newBoard);
    setBombMap(newBoard);
    setGameStatus('ready');
    setTime(0);
  };

  return (
    <div className={styles.container}>
      <div>
        <button onClick={() => handleDifficultyChange('easy')}>初級</button>
        <button onClick={() => handleDifficultyChange('medium')}>中級</button>
        <button onClick={() => handleDifficultyChange('hard')}>上級</button>
        <button onClick={() => handleDifficultyChange('custom')}>カスタム</button>
      </div>
      {difficulty === 'custom' && (
        <div className={styles.customSettings}>
          <div>
            <label>高さ:</label>
            <input type="number" ref={customHeightRef} defaultValue={customSettings.height} />
          </div>
          <div>
            <label>幅:</label>
            <input type="number" ref={customWidthRef} defaultValue={customSettings.width} />
          </div>
          <div>
            <label>爆弾:</label>
            <input type="number" ref={customBombsRef} defaultValue={customSettings.bombs} />
          </div>
          <button onClick={resetHandler}>開始</button>
        </div>
      )}
      <div
        className={styles.flame}
        style={{
          width: settings.width * 30 + 36,
          height: settings.height * 30 + 112,
        }}
      >
        <div
          className={styles.info}
          style={{
            width: settings.width * 30 + 8,
            padding: `10px`,
          }}
        >
          <div className={styles.flagCounter}>
            {[
              bombsRemaining / 100 > 0 ? Math.floor(bombsRemaining / 100) * -19 : 0,
              bombsRemaining / 10 > 0 ? Math.floor((bombsRemaining % 100) / 10) * -19 : 0,
              bombsRemaining % 10 > 0 ? (bombsRemaining % 10) * -19 : 0,
            ].map((m, i) => (
              <div
                key={`${i}-${m}`}
                className={styles.degitalNumber}
                style={{ backgroundPositionX: `${m}px` }}
              />
            ))}
          </div>
          <button
            className={styles.infoButton}
            style={{
              backgroundPosition: (() => {
                if (checkGameStatus(userInputs, bombMap) === 'playing') {
                  return `-329px`;
                }
                if (checkGameStatus(userInputs, bombMap) === 'gameOver') {
                  return `-389px`;
                }
                if (checkGameStatus(userInputs, bombMap) === 'cleared') {
                  return `-359px`;
                }
              })(),
            }}
            onClick={() => resetHandler()}
          />
          <div className={styles.timer}>
            {[
              time / 100 > 0 ? Math.floor(time / 100) * -19 : 0,
              time / 10 > 0 ? Math.floor((time % 100) / 10) * -19 : 0,
              time % 10 > 0 ? (time % 10) * -19 : 0,
            ].map((m, i) => (
              <div
                key={`${i}-${m}`}
                className={styles.degitalNumber}
                style={{ backgroundPositionX: `${m}px` }}
              />
            ))}
          </div>
        </div>
        <div
          className={styles.horizontalFlame}
          style={{
            width: settings.width * 30,
          }}
        />
        <div
          className={styles.board}
          style={{
            width: settings.width * 30 + 8,
            height: settings.height * 30 + 8,
          }}
        >
          {calcBoard.map((row, y) =>
            row.map((cellData, x) => {
              const userInput = cellData[0];
              const bombValue = cellData[1];
              return (
                <div
                  className={styles.cell}
                  key={`${x}-${y}`}
                  style={{
                    backgroundSize:
                      userInputs[y][x] === 7 || userInputs[y][x] === 8
                        ? `325px 23px`
                        : `420px 30px`,
                    backgroundPosition: (() => {
                      if (bombMap[y][x] === -1) {
                        return `-300px`;
                      } else if (userInput === 1) {
                        return `${(bombValue - 1) * -30}px`;
                      } else if (userInput === 8) {
                        return '-207px';
                      } else if (userInput === 7) {
                        return '-185px';
                      }
                      return '30px';
                    })(),
                    backgroundColor:
                      userInputs[y][x] === 1 && bombMap[y][x] === 11
                        ? `#999`
                        : bombMap[y][x] === -1
                          ? `#f00`
                          : `#999`,
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
