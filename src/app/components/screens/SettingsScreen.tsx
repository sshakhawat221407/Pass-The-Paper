import { User, Lock, CreditCard, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function SettingsScreen({ onNavigate, onBack }: SettingsScreenProps) {
  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Account Information', action: () => onNavigate('edit-profile') },
        { icon: Lock, label: 'Privacy & Security', action: () => onNavigate('privacy-security') },
      ]
    },
    {
      title: 'Payment',
      items: [
        { icon: CreditCard, label: 'Payment Methods', action: () => onNavigate('wallet') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => {} },
      ]
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Settings" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-4">
            <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 px-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={20} color="#E56E20" />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <ChevronRight size={18} color="#E56E20" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* App Info */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Pass The Paper</p>
            <p className="text-xs text-gray-500">Version 1.0.0</p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              onNavigate('login');
            }
          }}
          className="w-full bg-white rounded-xl p-4 border border-gray-200 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-semibold">Logout</span>
        </button>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          Logged in as student • Your data is secure
        </p>
      </div>

      <Footer />
    </div>
  );
}