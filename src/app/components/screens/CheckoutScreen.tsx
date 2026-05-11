import { useState } from 'react';
import { CreditCard, Smartphone, Wallet as WalletIcon, Award, AlertCircle, MessageSquare, Star } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { toast } from 'sonner@2.0.3';

interface CheckoutScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function CheckoutScreen({ onNavigate, onBack }: CheckoutScreenProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  const cartItems = mockData.getCartItems();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Wallet' | 'Bkash' | 'Nagad' | 'Card'>('Wallet');
  const [checkoutStep, setCheckoutStep] = useState<'payment' | 'feedback'>('payment');
  const [itemFeedbacks, setItemFeedbacks] = useState<Record<string, { rating: number; comment: string }>>({});

  // Calculate totals
  const totalBDT = cartItems.reduce((sum, item) => {
    return item.priceType === 'money' ? sum + item.price : sum;
  }, 0);
  
  const totalPoints = cartItems.reduce((sum, item) => {
    return item.priceType === 'points' ? sum + item.price : sum;
  }, 0);

  // Check if user can afford
  const canAffordWithWallet = selectedPaymentMethod === 'Wallet' 
    ? (currentUser?.walletBalance || 0) >= totalBDT && (currentUser?.rewardPoints || 0) >= totalPoints
    : true;

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'Card':
        return <CreditCard size={20} color="#E56E20" />;
      case 'Bkash':
      case 'Nagad':
        return <Smartphone size={20} color="#E56E20" />;
      case 'Wallet':
      default:
        return <WalletIcon size={20} color="#E56E20" />;
    }
  };

  const handleFeedbackChange = (resourceId: string, field: 'rating' | 'comment', value: number | string) => {
    setItemFeedbacks(prev => ({
      ...prev,
      [resourceId]: {
        ...(prev[resourceId] || { rating: 0, comment: '' }),
        [field]: value,
      }
    }));
  };

  const handleProceedToFeedback = () => {
    if (!currentUser) {
      toast.error('Please login to continue');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    // Check balance for wallet payment
    if (selectedPaymentMethod === 'Wallet') {
      if (totalBDT > (currentUser.walletBalance || 0)) {
        toast.error(`Insufficient BDT. You need ৳${totalBDT - (currentUser.walletBalance || 0)} more.`);
        return;
      }
      if (totalPoints > (currentUser.rewardPoints || 0)) {
        toast.error(`Insufficient Points. You need ${totalPoints - (currentUser.rewardPoints || 0)} more points.`);
        return;
      }
    }

    setCheckoutStep('feedback');
  };

  const handleCompleteCheckout = () => {
    if (!currentUser) {
      toast.error('Please login to continue');
      return;
    }

    try {
      // Process payment
      if (selectedPaymentMethod === 'Wallet') {
        // Deduct from wallet
        mockData.updateUser(currentUser.id, {
          walletBalance: currentUser.walletBalance - totalBDT,
          rewardPoints: currentUser.rewardPoints - totalPoints,
        });
      } else {
        // For Bkash/Nagad/Card, simulate payment success
        // In real app, this would integrate with payment gateway
      }

      // Create purchases and add feedback
      cartItems.forEach(item => {
        const purchaseId = `pur-${Date.now()}-${item.id}`;
        
        // Add purchase
        const newPurchase = {
          id: purchaseId,
          userId: currentUser.id,
          resourceId: item.id,
          price: item.price,
          priceType: item.priceType,
          purchasedAt: new Date().toISOString(),
          paymentMethod: selectedPaymentMethod,
          feedback: itemFeedbacks[item.id]?.comment,
          rating: itemFeedbacks[item.id]?.rating,
        };
        mockData.purchases.push(newPurchase);

        // Add feedback if provided
        if (itemFeedbacks[item.id]?.rating && itemFeedbacks[item.id]?.comment) {
          mockData.addFeedback({
            userId: currentUser.id,
            type: 'item',
            rating: itemFeedbacks[item.id].rating,
            comment: itemFeedbacks[item.id].comment,
            itemId: item.id,
            itemTitle: item.title,
          });

          // Send notification to seller
          mockData.addNotification({
            userId: item.uploadedBy,
            type: 'feedback',
            title: 'New Feedback Received',
            message: `${currentUser.name} left feedback on "${item.title}"`,
            isRead: false,
            relatedId: item.id,
          });
        }

        // Add notification to seller about sale
        mockData.addNotification({
          userId: item.uploadedBy,
          type: 'sale',
          title: 'Item Sold!',
          message: `Your item "${item.title}" was purchased for ${item.priceType === 'money' ? `৳${item.price}` : `${item.price} points`}`,
          isRead: false,
          relatedId: item.id,
        });

        // Add transaction
        mockData.addTransaction({
          userId: currentUser.id,
          type: 'purchase',
          amount: item.price,
          currency: item.priceType === 'money' ? 'BDT' : 'Points',
          description: `Purchased: ${item.title}`,
          paymentMethod: selectedPaymentMethod,
        });

        // Update seller's wallet (add BDT or Points)
        const seller = mockData.users.find(u => u.id === item.uploadedBy);
        if (seller) {
          if (item.priceType === 'money') {
            mockData.updateUser(seller.id, {
              walletBalance: seller.walletBalance + item.price,
            });
          } else {
            mockData.updateUser(seller.id, {
              rewardPoints: seller.rewardPoints + item.price,
            });
          }
        }

        // Remove from cart
        mockData.removeFromCart(item.id);
      });

      toast.success('Purchase completed successfully!');
      
      // Navigate to purchase history
      setTimeout(() => {
        onNavigate('history');
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed');
    }
  };

  const handleBack = () => {
    if (checkoutStep === 'feedback') {
      setCheckoutStep('payment');
    } else if (onBack) {
      onBack();
    } else {
      onNavigate('cart');
    }
  };

  const cartItemCount = cartItems.length;
  const notificationCount = mockData.getNotifications().filter(n => !n.isRead).length;

  if (checkoutStep === 'feedback') {
    return (
      <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
        <Header 
          title="Feedback" 
          onBack={handleBack}
          showCart
          showNotifications
          cartItemCount={cartItemCount}
          notificationCount={notificationCount}
          onCartClick={() => onNavigate('cart')}
          onNotificationsClick={() => onNavigate('notifications')}
        />
        
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
          <p className="text-sm text-gray-600 mb-4">
            Help sellers improve by leaving feedback on your purchases (optional)
          </p>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">{item.title}</h3>
                
                {/* Rating */}
                <div className="mb-3">
                  <label className="text-sm text-gray-700 mb-2 block">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleFeedbackChange(item.id, 'rating', star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={24}
                          fill={star <= (itemFeedbacks[item.id]?.rating || 0) ? '#E56E20' : 'none'}
                          color={star <= (itemFeedbacks[item.id]?.rating || 0) ? '#E56E20' : '#D1D5DB'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-sm text-gray-700 mb-2 block">Comment</label>
                  <textarea
                    placeholder="Share your thoughts about this resource..."
                    value={itemFeedbacks[item.id]?.comment || ''}
                    onChange={(e) => handleFeedbackChange(item.id, 'comment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            <Button fullWidth onClick={handleCompleteCheckout}>
              Complete Purchase
            </Button>
            <Button fullWidth variant="outline" onClick={() => setCheckoutStep('payment')}>
              Back to Payment
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header 
        title="Checkout" 
        onBack={handleBack}
        showCart
        showNotifications
        cartItemCount={cartItemCount}
        notificationCount={notificationCount}
        onCartClick={() => onNavigate('cart')}
        onNotificationsClick={() => onNavigate('notifications')}
      />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Cart Items */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">
            Order Summary ({cartItems.length} items)
          </h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700 flex-1">{item.title}</span>
                <span className="text-sm font-semibold text-gray-900 ml-3">
                  {item.priceType === 'money' ? `৳${item.price}` : `${item.price} Points`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Wallet', 'Bkash', 'Nagad', 'Card'].map((method) => (
              <button
                key={method}
                onClick={() => setSelectedPaymentMethod(method as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  selectedPaymentMethod === method ? 'bg-white' : 'bg-transparent'
                }`}
                style={{
                  borderColor: selectedPaymentMethod === method ? '#E56E20' : '#D1D5DB'
                }}
              >
                <div className="flex flex-col items-center">
                  {getPaymentIcon(method)}
                  <p className="text-xs font-medium text-gray-900 mt-2">{method}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Balance Display */}
        {selectedPaymentMethod === 'Wallet' && (
          <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Available Balance</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">BDT</p>
                <p className="text-lg font-bold text-gray-900">৳{currentUser?.walletBalance || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Points</p>
                <p className="text-lg font-bold text-gray-900">{currentUser?.rewardPoints || 0} Points</p>
              </div>
            </div>
            {!canAffordWithWallet && (
              <div className="mt-3 p-2 bg-red-50 rounded-lg">
                <p className="text-xs text-red-800">
                  ⚠️ Insufficient balance. 
                  {totalBDT > (currentUser?.walletBalance || 0) && ` Need ৳${totalBDT - (currentUser?.walletBalance || 0)} more BDT.`}
                  {totalPoints > (currentUser?.rewardPoints || 0) && ` Need ${totalPoints - (currentUser?.rewardPoints || 0)} more Points.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Payment Summary */}
        <div className="rounded-xl p-4 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
          <h3 className="font-semibold text-gray-900 mb-3">Payment Summary</h3>
          <div className="space-y-2">
            {totalBDT > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Total (BDT)</span>
                <span className="font-semibold text-gray-900">৳{totalBDT}</span>
              </div>
            )}
            {totalPoints > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-700">Total (Points)</span>
                <span className="font-semibold text-gray-900">{totalPoints} Points</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Processing Fee</span>
              <span className="font-semibold text-green-600">FREE</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <div className="text-right">
                  {totalBDT > 0 && (
                    <p className="font-bold text-lg" style={{ color: '#E56E20' }}>৳{totalBDT}</p>
                  )}
                  {totalPoints > 0 && (
                    <p className="font-bold text-sm" style={{ color: '#E56E20' }}>{totalPoints} Points</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proceed Button */}
        <Button 
          fullWidth 
          onClick={handleProceedToFeedback}
          disabled={selectedPaymentMethod === 'Wallet' && !canAffordWithWallet}
        >
          Proceed to Checkout
        </Button>
        <p className="text-xs text-center text-gray-600 mt-2">
          🔒 Secure payment with bank-level encryption
        </p>
      </div>

      <Footer />
    </div>
  );
}