import React, { useState, useEffect } from 'react';
import { MockDataProvider, useMockData } from './utils/MockDataContext';
import { Home } from './components/Home';
import { Browse } from './components/Browse';
import { Upload } from './components/Upload';
import { Wallet } from './components/Wallet';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { AdminDashboardEnhanced } from './components/AdminDashboardEnhanced';
import { SplashScreen } from './components/SplashScreen';
import { SetupPage } from './components/SetupPage';
import { StudentLayout } from './components/StudentLayout';
import { CartPageScreen } from './components/screens/CartPageScreen';
import { CheckoutPageScreen } from './components/screens/CheckoutPageScreen';
import { NotificationsPageScreen } from './components/screens/NotificationsPageScreen';
import { MembershipPageScreen } from './components/screens/MembershipPageScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { PurchaseHistoryScreen } from './components/screens/PurchaseHistoryScreen';
import { MyUploadsScreen } from './components/screens/MyUploadsScreen';
import { FeedbackScreen } from './components/screens/FeedbackScreen';
import { EditProfileScreen } from './components/screens/EditProfileScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { BannedUserScreen } from './components/screens/BannedUserScreen';
import { Toaster } from './components/ui/sonner';

export type User = {
  id: string;
  email: string;
  name: string;
  university: string;
  isVerified: boolean;
  isAdmin: boolean;
  studentId?: string;
  walletBalance: number;
  pendingBalance?: number;
  rewardPoints?: number;
  profilePicture?: string;
  membershipType?: 'free' | 'premium_monthly' | 'premium_yearly';
  membershipExpiry?: string;
  isBanned?: boolean;
  banReason?: string;
  idCardImage?: string;
  idCardStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  sellerRating?: number;
  totalRatings?: number;
};

export type NavigationTab = 'home' | 'browse' | 'upload' | 'wallet' | 'profile';
export type StudentPage =
  | 'home'
  | 'browse'
  | 'upload'
  | 'wallet'
  | 'profile'
  | 'cart'
  | 'notifications'
  | 'checkout'
  | 'membership'
  | 'history'
  | 'my-uploads'
  | 'feedback'
  | 'edit-profile'
  | 'settings';

export type Screen = StudentPage;

function AppContent() {
  const [showSplash, setShowSplash] = useState(true);
  const [view, setView] = useState<'login' | 'register' | 'app' | 'admin' | 'setup'>('login');
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currentPage, setCurrentPage] = useState<StudentPage>('home');
  const mockData = useMockData();

  useEffect(() => {
    if (mockData.currentUser) {
      if (mockData.currentUser.isAdmin) {
        setView('admin');
      } else {
        setView('app');
      }
      setShowSplash(false);
    }
  }, [mockData.currentUser]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await mockData.login(email, password);
      setView('app');
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    try {
      await mockData.adminLogin(email, password);
      setView('admin');
    } catch (error: any) {
      throw new Error(error.message || 'Admin login failed');
    }
  };

  const handleRegister = async (
    email: string,
    password: string,
    name: string,
    university: string,
    studentId: string
  ) => {
    try {
      await mockData.register(email, password, name, university, studentId);
      setView('app');
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const handleLogout = () => {
    mockData.logout();
    setView('login');
    setActiveTab('home');
    setCurrentPage('home');
  };

  if (showSplash) {
    return <SplashScreen onGetStarted={() => setShowSplash(false)} />;
  }

  if (view === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onAdminLogin={handleAdminLogin}
        onNavigateToRegister={() => setView('register')}
        onNavigateBack={() => setShowSplash(true)}
      />
    );
  }

  if (view === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onNavigateToLogin={() => setView('login')}
      />
    );
  }

  if (view === 'admin' && mockData.currentUser?.isAdmin) {
    return (
      <AdminDashboardEnhanced
        user={mockData.currentUser}
        onLogout={handleLogout}
      />
    );
  }

  if (view === 'app' && mockData.currentUser) {
    if (mockData.currentUser.isBanned) {
      return (
        <BannedUserScreen
          user={mockData.currentUser}
          onLogout={handleLogout}
        />
      );
    }

    return (
      <StudentLayout
        onCartClick={() => setCurrentPage('cart')}
        onNotificationsClick={() => setCurrentPage('notifications')}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(tab);
        }}
        onNavigate={(screen) => {
          setCurrentPage(screen);
          const dashboardPages: StudentPage[] = [
            'profile',
            'edit-profile',
            'history',
            'my-uploads',
            'feedback',
            'membership',
            'settings',
          ];
          if (dashboardPages.includes(screen)) {
            setActiveTab('profile');
          }
        }}
        onLogout={handleLogout}
        currentPage={currentPage}
      >
        {currentPage === 'home' && <Home user={mockData.currentUser} />}
        {currentPage === 'browse' && <Browse user={mockData.currentUser} />}
        {currentPage === 'upload' && <Upload user={mockData.currentUser} />}
        {currentPage === 'wallet' && <Wallet user={mockData.currentUser} />}

        {currentPage === 'profile' && (
          <Profile
            user={mockData.currentUser}
            onLogout={handleLogout}
            onUserUpdate={(updatedUser) => {
              mockData.updateUser(updatedUser.id, updatedUser);
            }}
            onNavigateToHistory={() => {
              setCurrentPage('history');
              setActiveTab('profile');
            }}
            onNavigateToUploads={() => {
              setCurrentPage('my-uploads');
              setActiveTab('profile');
            }}
            onNavigateToFeedback={() => {
              setCurrentPage('feedback');
              setActiveTab('profile');
            }}
            onNavigateToMembership={() => {
              setCurrentPage('membership');
              setActiveTab('profile');
            }}
          />
        )}

        {currentPage === 'cart' && (
          <CartPageScreen
            user={mockData.currentUser}
            onBack={() => {
              if (activeTab === 'home' || activeTab === 'browse') {
                setCurrentPage(activeTab);
              } else {
                setCurrentPage('home');
              }
            }}
            onCheckout={() => setCurrentPage('checkout')}
          />
        )}

        {currentPage === 'checkout' && (
          <CheckoutPageScreen
            user={mockData.currentUser}
            onBack={() => setCurrentPage('cart')}
            onSuccess={() => {
              setCurrentPage('home');
              setActiveTab('home');
            }}
          />
        )}

        {currentPage === 'notifications' && (
          <NotificationsPageScreen
            user={mockData.currentUser}
            onBack={() => {
              if (activeTab === 'home' || activeTab === 'browse') {
                setCurrentPage(activeTab);
              } else {
                setCurrentPage('home');
              }
            }}
          />
        )}

        {currentPage === 'membership' && (
          <MembershipPageScreen
            user={mockData.currentUser}
            onBack={() => setCurrentPage('profile')}
          />
        )}

        {currentPage === 'history' && (
          <PurchaseHistoryScreen
            onNavigate={(screen) => setCurrentPage(screen)}
            onBack={() => setCurrentPage('profile')}
          />
        )}

        {currentPage === 'my-uploads' && (
          <MyUploadsScreen
            onNavigate={(screen) => setCurrentPage(screen)}
            onBack={() => setCurrentPage('profile')}
          />
        )}

        {currentPage === 'feedback' && (
          <FeedbackScreen
            onNavigate={(screen) => setCurrentPage(screen)}
            onBack={() => setCurrentPage('profile')}
          />
        )}

        {currentPage === 'edit-profile' && (
          <EditProfileScreen
            onNavigate={(screen) => setCurrentPage(screen)}
            onBack={() => setCurrentPage('profile')}
          />
        )}

        {currentPage === 'settings' && (
          <SettingsScreen
            onNavigate={(screen) => setCurrentPage(screen)}
            onBack={() => setCurrentPage('profile')}
          />
        )}
      </StudentLayout>
    );
  }

  if (view === 'setup') {
    return <SetupPage onSetupComplete={() => setView('login')} />;
  }

  return null;
}

function App() {
  return (
    <MockDataProvider>
      <AppContent />
      <Toaster />
    </MockDataProvider>
  );
}

export default App;
