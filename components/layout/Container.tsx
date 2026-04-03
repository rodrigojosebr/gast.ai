import { css } from '../../styled-system/css';

export const Container = ({ children }: { children: React.ReactNode }) => (
  <div
    className={css({
      backgroundColor: '#121212',
      color: '#e0e0e0',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
      paddingTop: 'calc(2rem + env(safe-area-inset-top))',
      paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
      boxSizing: 'border-box',
      overflowY: 'auto',
      position: 'relative',
      overscrollBehaviorY: 'contain',
    })}
  >
    {children}
  </div>
);
