interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function Input({ label, type = 'text', placeholder, value, onChange }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 bg-white"
        style={{ 
          focusRingColor: '#E56E20',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#E56E20';
          e.currentTarget.style.boxShadow = '0 0 0 2px rgba(229, 110, 32, 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#D1D5DB';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
    </div>
  );
}
