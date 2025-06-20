'use client';
import useMinesweeper from './hooks/useMinesweeper';
import styles from './page.module.css';

export default function Home() {
  const {
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
  } = useMinesweeper();

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
