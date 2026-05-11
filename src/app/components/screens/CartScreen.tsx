import { useState } from 'react';
import { ShoppingCart, FileText, X, Wallet as WalletIcon, Award } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { EmptyState } from '../EmptyState';
import { Footer } from '../Footer';
import { Screen, NavigationContext } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { toast } from 'sonner@2.0.3';

interface CartScreenProps {
  onNavigate: (screen: Screen, tab?: any, context?: NavigationContext) => void;
  onBack?: () => void;
  navigationContext?: NavigationContext;
}

export function CartScreen({ onNavigate, onBack, navigationContext }: CartScreenProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  const cartItems = mockData.getCartItems();
  
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'points'>('wallet');
  const [useRewardPoints, setUseRewardPoints] = useState(false);

  const removeItem = (resourceId: string) => {
    mockData.removeFromCart(resourceId);
    toast.success('Item removed from cart');
  };

  // Calculate totals
  const totalPrice = cartItems.reduce((sum, item) => {
    return item.priceType === 'money' ? sum + item.price : sum;
  }, 0);
  
  const totalPoints = cartItems.reduce((sum, item) => {
    return item.priceType === 'points' ? sum + item.price : sum;
  }, 0);

  // Calculate what user needs to pay
  const rewardPointsToUse = useRewardPoints && paymentMethod === 'points' 
    ? Math.min(currentUser?.rewardPoints || 0, totalPoints) 
    : 0;
  
  const pointsNeeded = totalPoints - rewardPointsToUse;
  const moneyNeeded = totalPrice;

  // Check if user can afford
  const canAffordWithWallet = paymentMethod === 'wallet' 
    ? (currentUser?.walletBalance || 0) >= moneyNeeded 
    : true;
  
  const canAffordWithPoints = paymentMethod === 'points' 
    ? (currentUser?.rewardPoints || 0) >= pointsNeeded 
    : true;

  const canCheckout = (paymentMethod === 'wallet' && canAffordWithWallet) || 
                      (paymentMethod === 'points' && canAffordWithPoints);

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error('Please login to checkout');
      return;
    }

    if (!canCheckout) {
      if (paymentMethod === 'wallet') {
        toast.error(`Insufficient balance. You need ৳${moneyNeeded - (currentUser.walletBalance || 0)} more.`);
      } else {
        toast.error(`Insufficient points. You need ${pointsNeeded - (currentUser.rewardPoints || 0)} more points.`);
      }
      return;
    }

    try {
      // Process purchase
      if (paymentMethod === 'wallet') {
        // Deduct wallet balance
        mockData.updateUser(currentUser.id, {
          walletBalance: currentUser.walletBalance - moneyNeeded,
        });
      } else {
        // Deduct points
        mockData.updateUser(currentUser.id, {
          rewardPoints: currentUser.rewardPoints - pointsNeeded,
        });
      }

      // Clear cart
      cartItems.forEach(item => {
        mockData.removeFromCart(item.id);
      });

      toast.success('Purchase successful! You can now access your resources.');
      
      // Navigate to success screen or history
      setTimeout(() => {
        onNavigate('history');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed');
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('browse');
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="My Cart" onBack={handleBack} showNotifications onNavigate={onNavigate} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {cartItems.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your cart is empty"
            description="Add resources to your cart to purchase them together"
          />
        ) : (
          <>
            {/* Cart Items */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
              </p>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex gap-3">
                      <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" 
                        style={{ backgroundColor: '#D4ECF7' }}
                      >
                        <FileText size={20} color="#E56E20" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                          <span>{item.department || item.category}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold" style={{ color: '#E56E20' }}>
                            {item.priceType === 'money' ? `৳${item.price}` : `${item.price} points`}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X size={16} color="#EF4444" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('wallet')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'wallet' ? 'bg-white' : 'bg-transparent'
                  }`}
                  style={{
                    borderColor: paymentMethod === 'wallet' ? '#E56E20' : '#D1D5DB'
                  }}
                >
                  <WalletIcon size={20} color={paymentMethod === 'wallet' ? '#E56E20' : '#666666'} className="mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-900">Wallet</p>
                  <p className="text-xs text-gray-600">৳{currentUser?.walletBalance || 0} available</p>
                </button>

                <button
                  onClick={() => setPaymentMethod('points')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    paymentMethod === 'points' ? 'bg-white' : 'bg-transparent'
                  }`}
                  style={{
                    borderColor: paymentMethod === 'points' ? '#E56E20' : '#D1D5DB'
                  }}
                >
                  <Award size={20} color={paymentMethod === 'points' ? '#E56E20' : '#666666'} className="mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-900">Points</p>
                  <p className="text-xs text-gray-600">{currentUser?.rewardPoints || 0} available</p>
                </button>
              </div>
            </div>

            {/* Insufficient Balance Warning */}
            {!canCheckout && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-800">
                  {paymentMethod === 'wallet' 
                    ? `⚠️ Insufficient balance. You need ৳${moneyNeeded - (currentUser?.walletBalance || 0)} more.`
                    : `⚠️ Insufficient points. You need ${pointsNeeded - (currentUser?.rewardPoints || 0)} more points.`
                  }
                </p>
                <button
                  onClick={() => onNavigate('wallet')}
                  className="text-sm font-semibold mt-2"
                  style={{ color: '#E56E20' }}
                >
                  Add {paymentMethod === 'wallet' ? 'Money' : 'Points'} →
                </button>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-xl p-4 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
              <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold text-gray-900">
                    {paymentMethod === 'wallet' ? `৳${totalPrice}` : `${totalPoints} points`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Processing Fee</span>
                  <span className="font-semibold text-gray-900">Free</span>
                </div>
                <div className="border-t border-gray-300 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-lg" style={{ color: '#E56E20' }}>
                      {paymentMethod === 'wallet' ? `৳${totalPrice}` : `${totalPoints} points`}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Button fullWidth onClick={handleCheckout} disabled={!canCheckout}>
              {canCheckout ? 'Proceed to Checkout' : 'Insufficient Balance'}
            </Button>
            <p className="text-xs text-center text-gray-600 mt-2">
              Instant access after successful payment
            </p>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}