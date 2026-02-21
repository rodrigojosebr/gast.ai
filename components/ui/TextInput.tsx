import { css } from '../../styled-system/css';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any specific props if needed
}

export const TextInput = (props: TextInputProps) => (
  <input
    {...props}
    className={css({
      width: '100%',
      padding: '0.8rem 2.5rem 0.8rem 0.8rem',
      border: '1px solid #444',
      borderRadius: '8px',
      backgroundColor: '#333',
      color: '#fff',
      fontSize: '1rem',
      boxSizing: 'border-box',
    })}
  />
);
