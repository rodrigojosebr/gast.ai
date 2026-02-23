import { css } from '../../styled-system/css';
import { useState, useEffect } from 'react';

// Generate a number of '$' symbols with random properties for the rain effect
export const MoneyRain = ({ count = 50 }: { count?: number }) => {
  const [mounted, setMounted] = useState(false);
  const [symbols, setSymbols] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    const newSymbols = [];
    for (let i = 0; i < count; i++) {
      newSymbols.push({
        id: i,
        delay: Math.random() * 10,
        duration: 5 + Math.random() * 5,
        left: Math.random() * 100,
        size: 15 + Math.random() * 15,
        opacity: 0.5 + Math.random() * 0.5,
      });
    }
    setSymbols(newSymbols);
  }, [count]);

  if (!mounted) return null; // Prevent server-side rendering of random values

  return (
    <>
      {symbols.map((sym) => (
        <span
          key={sym.id}
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
            left: `${sym.left}vw`,
            top: `-${sym.size}px`,
            fontSize: `${sym.size}px`,
            opacity: sym.opacity,
            animationDuration: `${sym.duration}s`,
            animationDelay: `${sym.delay}s`,
          }}
        >
          $
        </span>
      ))}
    </>
  );
};
