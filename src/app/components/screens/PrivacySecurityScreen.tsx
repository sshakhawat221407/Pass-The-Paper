import { Lock, Shield, Eye, Key } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface PrivacySecurityScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function PrivacySecurityScreen({ onNavigate, onBack }: PrivacySecurityScreenProps) {
  const privacyOptions = [
    {
      icon: Key,
      title: 'Password Reset',
      description: 'Change your account password',
      action: () => onNavigate('change-password')
    },
    {
      icon: Shield,
      title: 'Two-Factor Authentication',
      description: 'Add an extra layer of security',
      action: () => {},
      badge: 'Coming Soon'
    },
    {
      icon: Eye,
      title: 'Privacy Settings',
      description: 'Control who can see your profile',
      action: () => {}
    },
    {
      icon: Lock,
      title: 'Data & Privacy',
      description: 'Manage your personal data',
      action: () => {}
    }
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Privacy & Security" onBack={onBack} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex gap-3">
            <Shield size={20} color="#3B82F6" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Your Security Matters</p>
              <p className="text-xs text-blue-800">
                We use industry-standard encryption to protect your data and privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Options */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {privacyOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <button
                key={index}
                onClick={option.action}
                className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                    <Icon size={20} color="#E56E20" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{option.title}</span>
                      {option.badge && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                          {option.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{option.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Security Tips */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 mt-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Lock size={18} color="#E56E20" />
            Security Tips
          </h3>
          <ul className="space-y-2 text-xs text-gray-700">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Use a strong, unique password with letters, numbers, and symbols</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Never share your password with anyone</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Change your password regularly (every 3-6 months)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Log out from shared or public devices</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
}
