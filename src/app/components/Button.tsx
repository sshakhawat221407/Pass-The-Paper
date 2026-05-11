import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', fullWidth = false, disabled = false }: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all';
  
  const variantStyles = {
    primary: 'text-white',
    secondary: 'bg-white text-gray-800 border border-gray-300',
    outline: 'bg-transparent border-2 text-gray-800'
  };

  const primaryBg = disabled ? '#CCCCCC' : '#E56E20';
  const primaryHover = disabled ? '#CCCCCC' : '#D65F18';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''}`}
      style={{
        backgroundColor: variant === 'primary' ? primaryBg : undefined,
        borderColor: variant === 'outline' ? '#E56E20' : undefined,
        color: variant === 'outline' ? '#E56E20' : undefined,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary' && !disabled) {
          e.currentTarget.style.backgroundColor = primaryHover;
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary' && !disabled) {
          e.currentTarget.style.backgroundColor = primaryBg;
        }
      }}
    >
      {children}
    </button>
  );
}
