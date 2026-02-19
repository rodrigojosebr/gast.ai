import { css } from '../../styled-system/css';

export const Header = ({ children }: { children: React.ReactNode }) => (
  <header
    className={css({
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'left',
      zIndex: 10,
      position: 'relative',
      flexShrink: 0,
    })}
  >
    {children}
  </header>
);
