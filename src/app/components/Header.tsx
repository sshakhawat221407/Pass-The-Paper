import React from 'react';
import { GraduationCap, ShoppingCart, Bell, ChevronLeft } from 'lucide-react';

type HeaderProps = {
  title?: string;
  showLogo?: boolean;
  showCart?: boolean;
  showNotifications?: boolean;
  cartItemCount?: number;
  notificationCount?: number;
  onBack?: () => void;
  onCartClick?: () => void;
  onNotificationsClick?: () => void;
};

export function Header({ 
  title,
  showLogo = false,
  showCart = false,
  showNotifications = false,
  cartItemCount = 0, 
  notificationCount = 0,
  onBack,
  onCartClick,
  onNotificationsClick,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo or Back button with title */}
          {showLogo ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E56E20' }}>
                <GraduationCap size={20} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ color: '#E56E20' }}>
                  Pass The Paper
                </h1>
                <p className="text-xs text-gray-500">Academic Resources</p>
              </div>
            </div>
          ) : onBack ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={24} color="#E56E20" />
              </button>
              <h2 className="font-semibold text-gray-900 text-xl">{title}</h2>
            </div>
          ) : (
            <h2 className="font-semibold text-gray-900 text-xl">{title}</h2>
          )}

          {/* Right side - Notifications and Cart buttons */}
          <div className="flex items-center gap-2">
            {showNotifications && (
              <button
                onClick={onNotificationsClick}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell size={24} style={{ color: '#E56E20' }} />
                {notificationCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-semibold"
                    style={{ backgroundColor: '#E56E20' }}
                  >
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
            )}
            {showCart && (
              <button
                onClick={onCartClick}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ShoppingCart size={24} style={{ color: '#E56E20' }} />
                {cartItemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-semibold"
                    style={{ backgroundColor: '#E56E20' }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}