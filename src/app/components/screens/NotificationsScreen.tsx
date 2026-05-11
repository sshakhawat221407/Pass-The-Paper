import { Bell, Upload, DollarSign, Award, CheckCircle } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface NotificationsScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function NotificationsScreen({ onNavigate, onBack }: NotificationsScreenProps) {
  const notifications = [
    {
      id: 1,
      type: 'upload',
      icon: Upload,
      title: 'Upload Approved',
      message: 'Your upload "CSE 101 Final Exam 2023" has been approved. You earned 200 points!',
      time: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'purchase',
      icon: DollarSign,
      title: 'Purchase Successful',
      message: 'You successfully purchased "Calculus II Complete Notes" for ৳120',
      time: '1 day ago',
      unread: true,
    },
    {
      id: 3,
      type: 'points',
      icon: Award,
      title: 'Daily Login Bonus',
      message: 'You earned 50 points for logging in today!',
      time: '1 day ago',
      unread: false,
    },
    {
      id: 4,
      type: 'verification',
      icon: CheckCircle,
      title: 'Account Verified',
      message: 'Your student account has been successfully verified.',
      time: '3 days ago',
      unread: false,
    },
    {
      id: 5,
      type: 'upload',
      icon: Upload,
      title: 'Resource Downloaded',
      message: 'Someone downloaded your resource "Linear Algebra Solutions"',
      time: '4 days ago',
      unread: false,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'upload': return '#E56E20';
      case 'purchase': return '#3B82F6';
      case 'points': return '#10B981';
      case 'verification': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case 'upload': return '#FEF3C7';
      case 'purchase': return '#DBEAFE';
      case 'points': return '#D1FAE5';
      case 'verification': return '#EDE9FE';
      default: return '#F3F4F6';
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Notifications" onBack={onBack ? onBack : () => onNavigate('home')} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {notifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#D4ECF7' }}>
              <Bell size={24} color="#E56E20" />
            </div>
            <p className="text-sm text-gray-600 mb-1">No notifications yet</p>
            <p className="text-xs text-gray-500">We'll notify you about uploads, purchases, and rewards</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl p-4 border border-gray-200 ${
                    notification.unread ? 'shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: notification.unread ? 'white' : '#FAFAFA'
                  }}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: getIconBg(notification.type) }}
                    >
                      <Icon size={18} color={getIconColor(notification.type)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm">{notification.title}</h3>
                        {notification.unread && (
                          <div className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}