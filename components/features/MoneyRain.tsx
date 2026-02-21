import { css } from '../../styled-system/css';

// Generate a number of '$' symbols with random properties for the rain effect
export const MoneyRain = ({ count = 50 }: { count?: number }) => {
  const moneySymbols = [];
  for (let i = 0; i < count; i++) {
    const delay = Math.random() * 10;
    const duration = 5 + Math.random() * 5;
    const left = Math.random() * 100;
    const size = 15 + Math.random() * 15;
    const opacity = 0.5 + Math.random() * 0.5;

    moneySymbols.push(
      <span
        key={i}
        className={css({
          position: 'absolute',
          color: '#4CAF50',
          zIndex: 1,
          pointerEvents: 'none',
          display: 'block',
          animationName: 'moneyFall',
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        })}
        style={{
          left: `${left}vw`,
          top: `-${size}px`,
          fontSize: `${size}px`,
          opacity: opacity,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      >
        $
      </span>
    );
  }
  return <>{moneySymbols}</>;
};
