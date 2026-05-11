import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, Check, CheckCheck } from 'lucide-react';
import { useMockData, Notification } from '../../utils/MockDataContext';
import { User } from '../../App';

type NotificationsPageScreenProps = {
  user: User;
  onBack: () => void;
};

export function NotificationsPageScreen({ user, onBack }: NotificationsPageScreenProps) {
  const mockData = useMockData();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const userNotifications = mockData.getNotifications();
    setNotifications(userNotifications);
  }, [mockData]);

  const markAsRead = (notificationId: string) => {
    // Mock implementation - in real app would update via mockData
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return '🛒';
      case 'sale':
        return '💰';
      case 'feedback':
        return '⭐';
      case 'system':
      default:
        return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={24} color="#E56E20" />
              </button>
              <h2 className="font-semibold text-gray-900 text-xl">Notifications</h2>
              {unreadCount > 0 && (
                <span
                  className="px-2 py-1 rounded-full text-white text-xs font-semibold"
                  style={{ backgroundColor: '#E56E20' }}
                >
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-medium text-gray-600 hover:text-[#E56E20] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <Bell size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-2">No notifications yet</p>
            <p className="text-gray-400 text-sm">
              You'll be notified when there's important activity
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && markAsRead(notification.id)}
                className={`bg-white rounded-xl shadow-md p-5 transition-all cursor-pointer hover:shadow-lg ${
                  !notification.isRead ? 'border-l-4 border-[#E56E20]' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-3xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatDate(notification.createdAt)}
                        </span>
                        {notification.isRead ? (
                          <CheckCheck size={16} className="text-gray-400" />
                        ) : (
                          <Check size={16} className="text-[#E56E20]" />
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
