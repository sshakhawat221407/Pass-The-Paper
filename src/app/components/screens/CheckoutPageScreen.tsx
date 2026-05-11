import React, { useState, useEffect } from 'react';
import { ChevronLeft, CreditCard, Wallet as WalletIcon, Star } from 'lucide-react';
import { useMockData, Resource } from '../../utils/MockDataContext';
import { User } from '../../App';
import { toast } from 'sonner@2.0.3';

type CheckoutPageScreenProps = {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
};

export function CheckoutPageScreen({ user, onBack, onSuccess }: CheckoutPageScreenProps) {
  const mockData = useMockData();
  const [cartItems, setCartItems] = useState<Resource[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Bkash' | 'Nagad' | 'Card' | 'Wallet'>('Wallet');
  const [step, setStep] = useState<'payment' | 'feedback' | 'processing'>('payment');
  const [feedbacks, setFeedbacks] = useState<Record<string, { rating: number; comment: string }>>({});
  const [accountNumber, setAccountNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  useEffect(() => {
    const items = mockData.getCartItems();
    setCartItems(items);
    // Initialize feedback for each item
    const initialFeedbacks: Record<string, { rating: number; comment: string }> = {};
    items.forEach(item => {
      initialFeedbacks[item.id] = { rating: 5, comment: '' };
    });
    setFeedbacks(initialFeedbacks);
  }, [mockData]);

  const totalBDT = cartItems
    .filter(item => item.priceType === 'money')
    .reduce((sum, item) => sum + item.price, 0);

  const totalPoints = cartItems
    .filter(item => item.priceType === 'points')
    .reduce((sum, item) => sum + item.price, 0);

  const handleSetRating = (itemId: string, rating: number) => {
    setFeedbacks(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], rating }
    }));
  };

  const handleSetComment = (itemId: string, comment: string) => {
    setFeedbacks(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], comment }
    }));
  };

  const handlePayment = () => {
    // Validate wallet balance if using wallet
    if (paymentMethod === 'Wallet') {
      const hasEnoughBDT = user.walletBalance >= totalBDT;
      const hasEnoughPoints = (user.rewardPoints || 0) >= totalPoints;

      if (!hasEnoughBDT) {
        toast.error(`Insufficient BDT balance. You need ${totalBDT - user.walletBalance} more BDT.`);
        return;
      }

      if (!hasEnoughPoints) {
        toast.error(`Insufficient Points. You need ${totalPoints - (user.rewardPoints || 0)} more Points.`);
        return;
      }
    }

    // Validate payment details for other methods
    if (paymentMethod === 'Bkash' || paymentMethod === 'Nagad') {
      if (!accountNumber || accountNumber.length < 10) {
        toast.error('Please enter a valid account number');
        return;
      }
    }

    if (paymentMethod === 'Card') {
      if (!cardNumber || cardNumber.length < 16 || !cardExpiry || !cardCVV) {
        toast.error('Please enter valid card details');
        return;
      }
    }

    setStep('feedback');
  };

  const handleCompletePurchase = () => {
    setStep('processing');

    setTimeout(() => {
      try {
        // Process the purchase
        cartItems.forEach(item => {
          const feedback = feedbacks[item.id];
          mockData.addFeedback({
            userId: user.id,
            type: 'item',
            rating: feedback.rating,
            comment: feedback.comment,
            itemId: item.id,
            itemTitle: item.title,
          });

          // Add notification to seller
          mockData.addNotification({
            userId: item.uploadedBy,
            type: 'sale',
            title: 'Item Purchased!',
            message: `Your item "${item.title}" has been purchased.`,
            isRead: false,
            relatedId: item.id,
          });
        });

        mockData.purchaseFromCart(paymentMethod, false);
        toast.success('Purchase completed successfully!');
        onSuccess();
      } catch (error: any) {
        toast.error(error.message || 'Purchase failed. Please try again.');
        setStep('payment');
      }
    }, 2000);
  };

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
              <h2 className="font-semibold text-gray-900 text-xl">Checkout</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'payment' && (
          <>
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-gray-700">{item.title}</span>
                    <span className="font-semibold" style={{ color: '#E56E20' }}>
                      {item.price} {item.priceType === 'money' ? 'BDT' : 'Points'}
                    </span>
                  </div>
                ))}
                <div className="pt-3 space-y-2">
                  {totalBDT > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total (BDT)</span>
                      <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                        {totalBDT} BDT
                      </span>
                    </div>
                  )}
                  {totalPoints > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total (Points)</span>
                      <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                        {totalPoints} Points
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-bold text-xl mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {['Wallet', 'Bkash', 'Nagad', 'Card'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as any)}
                    className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                      paymentMethod === method
                        ? 'border-[#E56E20] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {method === 'Wallet' && '💰 '}
                    {method}
                  </button>
                ))}
              </div>

              {/* Payment Method Details */}
              {paymentMethod === 'Wallet' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Your Wallet:</strong> {user.walletBalance} BDT, {user.rewardPoints || 0} Points
                  </p>
                </div>
              )}

              {(paymentMethod === 'Bkash' || paymentMethod === 'Nagad') && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {paymentMethod} Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value.slice(0, 3))}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-4 rounded-lg text-white font-semibold text-lg"
              style={{ backgroundColor: '#E56E20' }}
            >
              Continue to Feedback
            </button>
          </>
        )}

        {step === 'feedback' && (
          <>
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="font-bold text-xl mb-4">Rate Your Purchases</h3>
              <p className="text-gray-600 mb-6">Help other students by sharing your feedback</p>

              <div className="space-y-6">
                {cartItems.map(item => (
                  <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <h4 className="font-semibold mb-3">{item.title}</h4>
                    
                    {/* Star Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleSetRating(item.id, rating)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            fill={rating <= feedbacks[item.id]?.rating ? '#E56E20' : 'none'}
                            stroke={rating <= feedbacks[item.id]?.rating ? '#E56E20' : '#D1D5DB'}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Comment */}
                    <textarea
                      value={feedbacks[item.id]?.comment || ''}
                      onChange={(e) => handleSetComment(item.id, e.target.value)}
                      placeholder="Share your thoughts (optional)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleCompletePurchase}
              className="w-full py-4 rounded-lg text-white font-semibold text-lg"
              style={{ backgroundColor: '#E56E20' }}
            >
              Complete Purchase
            </button>
          </>
        )}

        {step === 'processing' && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-4" style={{ borderColor: '#E56E20' }}></div>
            <p className="text-lg font-semibold text-gray-700">Processing your purchase...</p>
          </div>
        )}
      </div>
    </div>
  );
}
