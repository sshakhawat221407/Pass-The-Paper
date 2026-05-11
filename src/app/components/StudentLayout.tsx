import React, { ReactNode, useEffect, useState } from 'react';
import {
  Bell, ChevronDown, Crown, Edit, GraduationCap, Home, LogOut,
  MessageSquare, Search, Settings, ShoppingBag, ShoppingCart,
  Upload, User, Wallet as WalletIcon,
} from 'lucide-react';
import { useMockData } from '../utils/MockDataContext';
import { NavigationTab, Screen } from '../App';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from './ui/dropdown-menu';

type StudentLayoutProps = {
  children: ReactNode;
  onCartClick?: () => void;
  onNotificationsClick?: () => void;
  activeTab?: NavigationTab;
  onTabChange?: (tab: NavigationTab) => void;
  onNavigate?: (screen: Screen) => void;
  onLogout?: () => void;
  currentPage?: Screen;
};

const ACCENT = '#E56E20';

export function StudentLayout({
  children, onCartClick, onNotificationsClick,
  activeTab = 'home', onTabChange, onNavigate, onLogout, currentPage,
}: StudentLayoutProps) {
  const mockData = useMockData();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [notificationCount, setNotificationCount] = useState(0);

  const dashboardPages: Screen[] = ['profile', 'edit-profile', 'history', 'feedback', 'membership', 'settings'];
  const isDashboardActive = currentPage ? dashboardPages.includes(currentPage) : activeTab === 'profile';

  const navItems = [
    { id: 'home' as NavigationTab, label: 'Home', icon: Home },
    { id: 'browse' as NavigationTab, label: 'Browse', icon: Search },
    { id: 'upload' as NavigationTab, label: 'Upload', icon: Upload },
    { id: 'wallet' as NavigationTab, label: 'Wallet', icon: WalletIcon },
  ];

  useEffect(() => {
    setCartItemCount(mockData.getCartItems().length);
    setNotificationCount(mockData.getNotifications().filter((n: any) => !n.isRead).length);
  }, [mockData]);

  const user = mockData.currentUser;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #f7a35c, ${ACCENT})` }} />
        <div className="max-w-[1800px] mx-auto px-3 sm:px-5 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 h-14 sm:h-16">

            {/* Logo */}
            <button onClick={() => onTabChange?.('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` }}>
                <GraduationCap size={20} color="white" />
              </div>
              <span className="hidden sm:block text-base font-extrabold tracking-tight" style={{ color: ACCENT }}>
                Pass The Paper
              </span>
            </button>

            <div className="hidden sm:block h-6 w-px bg-gray-200 flex-shrink-0" />

            {/* Nav */}
            <nav className="flex items-center flex-1 gap-0.5 overflow-x-auto">
              {navItems.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button key={id} onClick={() => onTabChange?.(id)}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                      active ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-orange-50 hover:text-[#E56E20]'
                    }`}
                    style={active ? { background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` } : {}}>
                    <Icon size={15} />
                    <span>{label}</span>
                  </button>
                );
              })}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isDashboardActive ? 'text-white shadow-sm' : 'text-gray-600 hover:bg-orange-50 hover:text-[#E56E20]'
                  }`}
                  style={isDashboardActive ? { background: `linear-gradient(135deg, ${ACCENT}, #f7a35c)` } : {}}>
                    <User size={15} />
                    <span className="hidden sm:inline">Dashboard</span>
                    <ChevronDown size={12} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 bg-white z-50">
                  <DropdownMenuItem onClick={() => onNavigate?.('profile')} className="cursor-pointer gap-2">
                    <User size={15} /><span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('edit-profile')} className="cursor-pointer gap-2">
                    <Edit size={15} /><span>Edit Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('history')} className="cursor-pointer gap-2">
                    <Upload size={15} /><span>My Uploads</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('history')} className="cursor-pointer gap-2">
                    <ShoppingBag size={15} /><span>Purchase History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('feedback')} className="cursor-pointer gap-2">
                    <MessageSquare size={15} /><span>Feedback</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('membership')} className="cursor-pointer gap-2">
                    <Crown size={15} /><span>Membership</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate?.('settings')} className="cursor-pointer gap-2">
                    <Settings size={15} /><span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer gap-2" variant="destructive">
                    <LogOut size={15} /><span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={onNotificationsClick}
                className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors" aria-label="Notifications">
                <Bell size={20} style={{ color: ACCENT }} />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                    style={{ backgroundColor: ACCENT }}>
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              <button onClick={onCartClick}
                className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors" aria-label="Cart">
                <ShoppingCart size={20} style={{ color: ACCENT }} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                    style={{ backgroundColor: ACCENT }}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Avatar — no star rating here anymore */}
              <button onClick={() => onNavigate?.('profile')}
                className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm transition-transform hover:scale-105"
                style={{ border: `2px solid ${user?.isVerified ? '#10B981' : '#E5E7EB'}`, backgroundColor: '#F3F4F6' }}
                aria-label="Profile">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
