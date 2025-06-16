// src/app/DigitalDisplay.tsx (新規作成)

import styles from './page.module.css';

// このコンポーネントが受け取るPropsの型を定義
type Props = {
  number: number;
  digits?: number; // 表示する桁数（任意、デフォルトは3）
};

// デジタル数字1文字と、そのbackground-positionのX座標のマッピング
const digitMap: { [key: string]: string } = {
  0: '0px',
  1: '-21px',
  2: '-42px',
  3: '-63px',
  4: '-84px',
  5: '-105px',
  6: '-126px',
  7: '-147px',
  8: '-168px',
  9: '-189px',
};

const DigitalDisplay = ({ number, digits = 3 }: Props) => {
  // 1. 表示する数値を文字列に変換
  // 2. 負の数の場合はマイナス記号を保持
  // 3. 指定された桁数になるように先頭を'0'で埋める
  const formatted = String(Math.abs(number)).padStart(digits, '0');
  const fullString = (number < 0 ? '-' : '') + formatted;

  // 桁数が多すぎる場合はスライスし、少なすぎる場合は先頭に空白（またはマイナス）を追加
  const displayChars = fullString.slice(-digits).padStart(digits, ' ');

  return (
    <div className={styles.displayContainer}>
      {/* 文字列を1文字ずつの配列に変換して、それぞれを描画 */}
      {displayChars.split('').map((char, index) => (
        <div
          key={index}
          className={styles.digit}
          style={{ backgroundPosition: digitMap[char] ?? '0px', backgroundSize: '275px 40px' }}
        />
      ))}
    </div>
  );
};

export default DigitalDisplay;
