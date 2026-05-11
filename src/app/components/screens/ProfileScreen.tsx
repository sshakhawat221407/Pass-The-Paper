import { User, Upload, ShoppingBag, Wallet, Award, Crown, Settings, ChevronRight, Edit, LogOut, MessageSquare } from 'lucide-react';
import { Header } from '../Header';
import { VerifiedBadge } from '../VerifiedBadge';
import { StarRating } from '../StarRating';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function ProfileScreen({ onNavigate, onLogout }: ProfileScreenProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;

  const menuItems = [
    { icon: Edit, label: 'Edit Profile', screen: 'edit-profile' as Screen },
    { icon: Upload, label: 'My Uploads', screen: 'history' as Screen, count: 12, initialTab: 'uploads' },
    { icon: ShoppingBag, label: 'Purchase History', screen: 'history' as Screen, count: mockData.getUserPurchases().length, initialTab: 'purchases' },
    { icon: MessageSquare, label: 'Feedback', screen: 'feedback' as Screen, subtitle: 'View and manage your feedback' },
    { icon: Crown, label: 'Membership', screen: 'membership' as Screen },
    { icon: Settings, label: 'Settings', screen: 'settings' as Screen },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="My Profile" showNotifications showCart onNavigate={onNavigate} cartItemCount={mockData.getCartItems().length} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Profile Header */}
        <div className="bg-white rounded-xl p-6 mb-4 border border-gray-200 text-center">
          {currentUser?.profilePicture ? (
            <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden">
              <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3">
              <User size={32} color="#666666" />
            </div>
          )}
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">{currentUser?.name || 'User'}</h2>
          <div className="flex justify-center mb-1">
            <VerifiedBadge />
          </div>
          <p className="text-xs text-gray-600 mb-3">{currentUser?.university || 'University'}</p>
          <p className="text-xs text-gray-600 mb-3">Member since Jan 2024</p>
          
          <div className="flex items-center justify-center gap-1 mb-4">
            <StarRating rating={4} size={16} />
            <span className="text-sm text-gray-600 ml-1">(4.5)</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-xl font-bold text-gray-900">12</p>
              <p className="text-xs text-gray-600">Uploads</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{mockData.getUserPurchases().length}</p>
              <p className="text-xs text-gray-600">Purchases</p>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">4.5</p>
              <p className="text-xs text-gray-600">Rating</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => onNavigate(item.screen)}
                className="w-full flex items-center justify-between p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#D4ECF7' }}>
                    <Icon size={20} color="#E56E20" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-900 block">{item.label}</span>
                    {item.subtitle && (
                      <span className="text-xs text-gray-600">{item.subtitle}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.count !== undefined && (
                    <span className="text-sm text-gray-600">{item.count}</span>
                  )}
                  <ChevronRight size={18} color="#E56E20" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-50">
                <LogOut size={20} color="#EF4444" />
              </div>
              <span className="font-medium text-red-600">Logout</span>
            </div>
            <ChevronRight size={18} color="#EF4444" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}