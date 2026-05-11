import { Home, Search, Upload, Wallet, User } from 'lucide-react';

interface NavigationProps {
  activeTab: 'home' | 'browse' | 'upload' | 'wallet' | 'profile';
  onTabChange: (tab: 'home' | 'browse' | 'upload' | 'wallet' | 'profile') => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'browse' as const, label: 'Browse', icon: Search },
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'wallet' as const, label: 'Wallet', icon: Wallet },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="bg-white border-t border-gray-200" style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-around px-4 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center py-1 px-3 transition-colors"
            >
              <Icon 
                size={22} 
                style={{ 
                  color: isActive ? '#E56E20' : '#666666',
                  strokeWidth: isActive ? 2.5 : 2
                }} 
              />
              <span 
                className="text-xs mt-1"
                style={{ 
                  color: isActive ? '#E56E20' : '#666666',
                  fontWeight: isActive ? 600 : 400
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
