import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'success' | 'pending' | 'error';
  label: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = {
    success: {
      icon: CheckCircle,
      color: '#10B981',
      bgColor: '#D1FAE5',
      textColor: '#065F46'
    },
    pending: {
      icon: Clock,
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      textColor: '#92400E'
    },
    error: {
      icon: XCircle,
      color: '#EF4444',
      bgColor: '#FEE2E2',
      textColor: '#991B1B'
    }
  };

  const { icon: Icon, color, bgColor, textColor } = config[status];

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <Icon size={12} color={color} />
      <span>{label}</span>
    </div>
  );
}
