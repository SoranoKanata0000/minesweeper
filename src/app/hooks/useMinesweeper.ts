'use client';
import { useEffect, useRef, useState } from 'react';
import { difficultySettings, directions, nextStateMap } from '../components/constants';

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  type Difficulty = keyof typeof difficultySettings;

  const createBoard = (height: number, width: number): number[][] => {
    return Array.from({ length: height }, () => Array.from({ length: width }, () => 0));
  };

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
  return {
    settings,
    userInputs,
    bombMap,
    time,
    calcBoard,
    bombsRemaining,
    clickHandler,
    flagAndQuestion,
    handleDifficultyChange,
    resetHandler,
    difficulty,
    customHeightRef,
    customWidthRef,
    customBombsRef,
    customSettings,
    checkGameStatus,
  };
}
