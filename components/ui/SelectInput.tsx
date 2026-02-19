import { css } from '../../styled-system/css';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Add any specific props if needed
}

export const SelectInput = (props: SelectInputProps) => (
  <select
    {...props}
    className={css({
      flex: 1,
      padding: '0.8rem',
      borderRadius: '8px',
      border: '1px solid #444',
      backgroundColor: '#333',
      color: '#fff',
      fontSize: '0.9rem',
      cursor: 'pointer',
    })}
  >
    {props.children}
  </select>
);
