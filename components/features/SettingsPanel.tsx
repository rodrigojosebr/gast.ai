import { css } from '../../styled-system/css';

export const SettingsPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      className={css({
        backgroundColor: '#1c1c1e',
        padding: '1.5rem',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        boxSizing: 'border-box',
        textAlign: 'left',
        zIndex: 10,
        position: 'relative',
        marginTop: '1rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        flexShrink: 0,
      })}
    >
      {children}
    </div>
  );
};
