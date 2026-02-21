import { css } from '../../styled-system/css';

interface MicButtonProps {
  onClick: () => void;
  disabled: boolean;
  recording: boolean;
  children: React.ReactNode;
}

export const MicButton = ({ onClick, disabled, recording, children }: MicButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={css({
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      backgroundColor: recording ? '#333' : '#007aff',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      boxShadow: recording
        ? '0 0 0 10px rgba(255, 82, 82, 0.5), 0 0 0 20px rgba(255, 82, 82, 0.3)'
        : '0 4px 15px rgba(0, 122, 255, 0.4)',
    })}
    aria-label={recording ? 'Parar gravação' : 'Iniciar gravação'}
  >
    {children}
  </button>
);
