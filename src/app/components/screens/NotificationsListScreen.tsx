import { Bell, ShoppingBag, MessageSquare, AlertCircle, Check } from 'lucide-react';
import { Header } from '../Header';
import { EmptyState } from '../EmptyState';
import { Footer } from '../Footer';
import { useMockData } from '../../utils/MockDataContext';
import { Screen } from '../../App';

interface NotificationsListScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function NotificationsListScreen({ onNavigate, onBack }: NotificationsListScreenProps) {
  const mockData = useMockData();
  const notifications = mockData.getNotifications();
  const cartItemCount = mockData.getCartItems().length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('home');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <ShoppingBag size={20} color="#E56E20" />;
      case 'sale':
        return <Check size={20} color="#10B981" />;
      case 'feedback':
        return <MessageSquare size={20} color="#6366F1" />;
      case 'system':
      default:
        return <AlertCircle size={20} color="#F59E0B" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header 
        title="Notifications" 
        onBack={handleBack}
        showCart
        cartItemCount={cartItemCount}
        onCartClick={() => onNavigate('cart')}
      />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You're all caught up! We'll notify you when something important happens."
          />
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">
              {notifications.filter(n => !n.isRead).length} unread notifications
            </p>
            <div className="space-y-3">
              {notifications
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`bg-white rounded-xl p-4 border ${
                      notification.isRead ? 'border-gray-200' : 'border-[#E56E20]'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`}
                        style={{ backgroundColor: notification.isRead ? '#F3F4F6' : '#D4ECF7' }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0 ml-2 mt-1"
                              style={{ backgroundColor: '#E56E20' }}
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
