interface HelperTextProps {
  children: string;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export function HelperText({ children, type = 'info' }: HelperTextProps) {
  const colors = {
    info: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
    success: { bg: '#D1FAE5', border: '#A7F3D0', text: '#065F46' },
    warning: { bg: '#FEF3C7', border: '#FDE68A', text: '#92400E' },
    error: { bg: '#FEE2E2', border: '#FECACA', text: '#991B1B' }
  };

  const { bg, border, text } = colors[type];

  return (
    <div 
      className="rounded-lg p-3"
      style={{ backgroundColor: bg, borderWidth: '1px', borderColor: border }}
    >
      <p className="text-xs" style={{ color: text }}>
        {children}
      </p>
    </div>
  );
}
