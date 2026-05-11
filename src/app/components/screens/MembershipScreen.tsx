import { Check, Crown, Zap, Star, Gift } from 'lucide-react';
import { Header } from '../Header';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';

interface MembershipScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function MembershipScreen({ onNavigate, onBack }: MembershipScreenProps) {
  const mockData = useMockData();
  const cartItemCount = mockData.getCartItems().length;
  const notificationCount = mockData.getNotifications().filter(n => !n.isRead).length;

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('profile');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header 
        title="Membership" 
        onBack={handleBack}
        showCart
        showNotifications
        cartItemCount={cartItemCount}
        notificationCount={notificationCount}
        onCartClick={() => onNavigate('cart')}
        onNotificationsClick={() => onNavigate('notifications')}
      />

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="px-4 pt-6 pb-8 text-center" style={{ background: 'linear-gradient(135deg, #E56E20 0%, #F59E0B 100%)' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
            <Crown size={32} color="#E56E20" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Unlock Premium Benefits
          </h2>
          <p className="text-sm text-white opacity-90">
            Join our membership program and get the most out of Pass The Paper
          </p>
        </div>

        <div className="px-4 pb-4">
          {/* Current Plan Badge */}
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200 -mt-6 relative z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Current Plan</p>
                <p className="text-lg font-bold text-gray-900">Free Member</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">৳0</p>
                <p className="text-xs text-gray-600">per month</p>
              </div>
            </div>
          </div>

          {/* Benefits Comparison */}
          <div className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-center">What You Get with Membership</h3>
            
            <div className="space-y-4">
              {/* Benefit 1 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                  <Zap size={20} color="#E56E20" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">2x Reward Points</h4>
                  <p className="text-xs text-gray-600">Earn double points on every resource you upload</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                  <Star size={20} color="#E56E20" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">15% Discount</h4>
                  <p className="text-xs text-gray-600">Save on all your purchases with member pricing</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                  <Gift size={20} color="#E56E20" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">500 Bonus Points Monthly</h4>
                  <p className="text-xs text-gray-600">Get free points every month just for being a member</p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4ECF7' }}>
                  <Crown size={20} color="#E56E20" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">Exclusive Access</h4>
                  <p className="text-xs text-gray-600">Get early access to premium resources and features</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 mb-4 border-2 shadow-lg relative overflow-hidden" style={{ borderColor: '#E56E20' }}>
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5" style={{ background: 'radial-gradient(circle, #E56E20 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            
            {/* Recommended Badge */}
            <div 
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-md"
              style={{ backgroundColor: '#E56E20' }}
            >
              ⭐ MOST POPULAR
            </div>

            <div className="text-center mt-2 mb-5">
              <div className="inline-flex items-center gap-2 mb-3">
                <Crown size={28} color="#E56E20" />
                <h3 className="text-xl font-bold text-gray-900">Premium Membership</h3>
              </div>
              
              <div className="mb-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold" style={{ color: '#E56E20' }}>৳199</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Cancel anytime • No commitment</p>
              </div>

              <button
                className="w-full py-3.5 rounded-lg text-white font-bold text-base transition-all hover:shadow-lg"
                style={{ backgroundColor: '#E56E20' }}
              >
                Upgrade Now
              </button>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 pt-4 border-t border-gray-200">
              {[
                'All Free features included',
                '2x reward points on all uploads',
                '15% discount on purchases',
                'Priority customer support',
                'Exclusive premium resources',
                '500 bonus points every month',
                'Early access to new features',
                'Member-only study groups'
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl p-5 mb-4 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">How do I pay?</h4>
                <p className="text-xs text-gray-600">We accept Bkash, Nagad, and all major credit/debit cards.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">Can I cancel anytime?</h4>
                <p className="text-xs text-gray-600">Yes! You can cancel your membership at any time with no penalties.</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm mb-1">What happens when I upgrade?</h4>
                <p className="text-xs text-gray-600">All benefits activate immediately after successful payment.</p>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center pb-4">
            <p className="text-xs text-gray-500">
              Pass The Paper © 2024<br />
              Trusted by thousands of verified students
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
