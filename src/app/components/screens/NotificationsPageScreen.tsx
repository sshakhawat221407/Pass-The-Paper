import React, { useState, useEffect } from 'react';
import { ChevronLeft, Bell, CheckCheck, Trash2, Trash } from 'lucide-react';
import { useMockData, Notification } from '../../utils/MockDataContext';
import { User } from '../../App';
import { Footer } from '../Footer';

type NotificationsPageScreenProps = {
  user: User;
  onBack: () => void;
};

export function NotificationsPageScreen({ user, onBack }: NotificationsPageScreenProps) {
  const mockData = useMockData();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(mockData.getNotifications());
  }, [mockData.notifications]);

  const markAsRead = (id: string) => {
    mockData.markNotificationAsRead(id);
    setNotifications(mockData.getNotifications().map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    mockData.markAllNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteOne = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    mockData.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAll = () => {
    mockData.deleteAllNotifications();
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'purchase': return '🛒';
      case 'sale':     return '💰';
      case 'feedback': return '⭐';
      default:         return '🔔';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins  = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays  = Math.floor(diffMs / 86400000);
    if (diffMins  < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays  <  7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Page Title Row — no white bar */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/60 transition-colors"
          >
            <ChevronLeft size={22} color="#E56E20" />
          </button>
          <h2 className="text-2xl font-bold" style={{ color: '#E56E20' }}>
            Notifications
          </h2>
          {unreadCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: '#E56E20' }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        {/* Action buttons */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 hover:border-[#E56E20] transition-colors"
                style={{ color: '#E56E20' }}
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={deleteAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 hover:border-red-400 hover:text-red-500 text-gray-500 transition-colors"
              title="Delete all notifications"
            >
              <Trash size={14} />
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-6 max-w-4xl mx-auto w-full">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center mt-4">
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
                className={`bg-white rounded-xl shadow-sm p-4 transition-all cursor-pointer hover:shadow-md flex items-start gap-4 ${
                  !notification.isRead ? 'border-l-4 border-[#E56E20]' : 'border-l-4 border-transparent'
                }`}
              >
                <div className="flex-shrink-0 text-2xl mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(notification.createdAt)}
                      </span>
                      {notification.isRead && (
                        <CheckCheck size={14} className="text-gray-300" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">{notification.message}</p>
                </div>

                {/* Delete individual */}
                <button
                  onClick={(e) => deleteOne(notification.id, e)}
                  className="flex-shrink-0 p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete notification"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
