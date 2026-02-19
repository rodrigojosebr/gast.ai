import { css } from '../../styled-system/css';

export const MainContent = ({
  children,
  pushDown,
}: {
  children: React.ReactNode;
  pushDown: boolean;
}) => (
  <main
    className={css({
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      zIndex: 10,
      position: 'relative',
      width: '100%',
      marginTop: pushDown ? '0' : '2rem',
    })}
  >
    {children}
  </main>
);
