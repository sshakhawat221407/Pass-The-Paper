import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
        style={{ backgroundColor: '#D4ECF7' }}
      >
        <Icon size={24} color="#E56E20" />
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}
