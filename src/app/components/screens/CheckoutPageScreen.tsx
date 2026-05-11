import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Wallet as WalletIcon,
  Smartphone,
  AlertCircle,
  CheckCircle2,
  Clock,
  Star,
  Copy,
} from 'lucide-react';
import { useMockData, Resource } from '../../utils/MockDataContext';
import { User } from '../../App';
import { toast } from 'sonner@2.0.3';

type CheckoutPageScreenProps = {
  user: User;
  onBack: () => void;
  onSuccess: () => void;
};

type PaymentMethod = 'Wallet' | 'Bkash' | 'Nagad';

const MERCHANT_NUMBER = '01629668094';

export function CheckoutPageScreen({ user, onBack, onSuccess }: CheckoutPageScreenProps) {
  const mockData = useMockData();
  const liveUser = mockData.users.find((u: any) => u.id === user.id) || user;

  const [cartItems, setCartItems] = useState<Resource[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wallet');

  // Bkash / Nagad form
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionNumber, setTransactionNumber] = useState('');

  // Step: 'payment' | 'processing' | 'pending' | 'feedback' | 'done'
  const [step, setStep] = useState<'payment' | 'processing' | 'pending' | 'feedback' | 'done'>('payment');

  // Wallet balance error messages
  const [walletError, setWalletError] = useState('');

  // Feedback
  const [feedbacks, setFeedbacks] = useState<Record<string, { rating: number; comment: string }>>({});

  useEffect(() => {
    const items = mockData.getCartItems();
    setCartItems(items);
    const init: Record<string, { rating: number; comment: string }> = {};
    items.forEach((item) => {
      init[item.id] = { rating: 5, comment: '' };
    });
    setFeedbacks(init);
  }, []);

  const totalBDT = cartItems
    .filter((i) => i.priceType === 'money')
    .reduce((s, i) => s + i.price, 0);

  const totalPoints = cartItems
    .filter((i) => i.priceType === 'points')
    .reduce((s, i) => s + i.price, 0);

  // ---------- Wallet validation ----------
  const walletBDTOk = (liveUser.walletBalance || 0) >= totalBDT;
  const walletPointsOk = (liveUser.rewardPoints || 0) >= totalPoints;

  const getWalletError = (): string => {
    if (!walletBDTOk && !walletPointsOk) {
      return `Not enough balance. Need ${totalBDT - (liveUser.walletBalance || 0)} more BDT and ${totalPoints - (liveUser.rewardPoints || 0)} more Points.`;
    }
    if (!walletBDTOk) {
      return `Not enough balance. You need ${totalBDT - (liveUser.walletBalance || 0)} more BDT in your wallet.`;
    }
    if (!walletPointsOk) {
      return `Not enough Points. You need ${totalPoints - (liveUser.rewardPoints || 0)} more Points.`;
    }
    return '';
  };

  // ---------- Pay handlers ----------
  const handleWalletPay = () => {
    const err = getWalletError();
    if (err) {
      setWalletError(err);
      return;
    }
    setWalletError('');
    setStep('processing');
    setTimeout(() => {
      try {
        mockData.purchaseFromCart('Wallet', false);

        // Notify sellers
        cartItems.forEach((item) => {
          mockData.addNotification({
            userId: item.uploadedBy,
            type: 'sale',
            title: 'Item Purchased!',
            message: `Your item "${item.title}" has been purchased.`,
            isRead: false,
            relatedId: item.id,
          });
        });

        toast.success('Purchase successful!');
        setStep('feedback');
      } catch (e: any) {
        toast.error(e.message || 'Purchase failed. Please try again.');
        setStep('payment');
      }
    }, 1800);
  };

  const handleMobilePay = () => {
    if (!senderPhone || senderPhone.length < 11) {
      toast.error('Please enter the phone number you sent money from');
      return;
    }
    if (!transactionNumber.trim()) {
      toast.error('Please enter the transaction number');
      return;
    }

    setStep('processing');
    setTimeout(() => {
      try {
        // Record purchase as pending — admin will approve
        mockData.purchaseFromCart(paymentMethod, false);

        // Notify admin (system notification) — in real app this would be a DB record
        cartItems.forEach((item) => {
          mockData.addNotification({
            userId: item.uploadedBy,
            type: 'system',
            title: 'Payment Pending Approval',
            message: `A payment request for "${item.title}" via ${paymentMethod} is awaiting admin approval.`,
            isRead: false,
            relatedId: item.id,
          });
        });

        setStep('pending');
      } catch (e: any) {
        toast.error(e.message || 'Failed to submit. Please try again.');
        setStep('payment');
      }
    }, 1800);
  };

  const handleProceedPayment = () => {
    if (paymentMethod === 'Wallet') {
      handleWalletPay();
    } else {
      handleMobilePay();
    }
  };

  // ---------- Feedback submit ----------
  const handleSubmitFeedback = () => {
    cartItems.forEach((item) => {
      const fb = feedbacks[item.id];
      mockData.addFeedback({
        userId: user.id,
        type: 'item',
        rating: fb.rating,
        comment: fb.comment,
        itemId: item.id,
        itemTitle: item.title,
      });
    });
    toast.success('Thank you for your feedback!');
    onSuccess();
  };

  const handleSkipFeedback = () => {
    onSuccess();
  };

  // ---------- Copy helper ----------
  const copyNumber = () => {
    navigator.clipboard.writeText(MERCHANT_NUMBER).then(() => toast.success('Number copied!'));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0D7C7' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-3">
            {step === 'payment' && (
              <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft size={24} color="#E56E20" />
              </button>
            )}
            <h2 className="font-semibold text-gray-900 text-xl">
              {step === 'payment' && 'Checkout'}
              {step === 'processing' && 'Processing…'}
              {step === 'pending' && 'Payment Submitted'}
              {step === 'feedback' && 'Rate Your Purchases'}
              {step === 'done' && 'Done'}
            </h2>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* ===== PAYMENT STEP ===== */}
        {step === 'payment' && (
          <>
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-700 text-sm">{item.title}</span>
                    <span className="font-semibold text-sm" style={{ color: '#E56E20' }}>
                      {item.price} {item.priceType === 'money' ? 'BDT' : 'Points'}
                    </span>
                  </div>
                ))}
                <div className="pt-3 space-y-1.5">
                  {totalBDT > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">Total (BDT)</span>
                      <span className="font-bold text-lg" style={{ color: '#E56E20' }}>
                        {totalBDT} BDT
                      </span>
                    </div>
                  )}
                  {totalPoints > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">Total (Points)</span>
                      <span className="font-bold text-lg" style={{ color: '#E56E20' }}>
                        {totalPoints} Points
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
              <h3 className="font-bold text-lg mb-4">Payment Method</h3>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {(
                  [
                    { id: 'Wallet' as PaymentMethod, label: 'Wallet', icon: WalletIcon },
                    { id: 'Bkash' as PaymentMethod, label: 'bKash', icon: Smartphone },
                    { id: 'Nagad' as PaymentMethod, label: 'Nagad', icon: Smartphone },
                  ] as const
                ).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setPaymentMethod(id);
                      setWalletError('');
                    }}
                    className={`py-4 rounded-xl border-2 font-semibold text-sm flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === id
                        ? 'border-[#E56E20] bg-orange-50 text-[#E56E20]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={22} />
                    {label}
                  </button>
                ))}
              </div>

              {/* ---- Wallet details ---- */}
              {paymentMethod === 'Wallet' && (
                <div>
                  <div className="rounded-xl border border-gray-200 overflow-hidden mb-3">
                    <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Your Wallet Balance
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center border-b border-gray-100">
                      <span className="text-sm text-gray-700">BDT Balance</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            !walletBDTOk && totalBDT > 0 ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {(liveUser.walletBalance || 0).toFixed(2)} BDT
                        </span>
                        {!walletBDTOk && totalBDT > 0 && (
                          <AlertCircle size={15} color="#DC2626" />
                        )}
                        {walletBDTOk && totalBDT > 0 && (
                          <CheckCircle2 size={15} color="#16A34A" />
                        )}
                      </div>
                    </div>
                    <div className="px-4 py-3 flex justify-between items-center">
                      <span className="text-sm text-gray-700">Points Balance</span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            !walletPointsOk && totalPoints > 0 ? 'text-red-600' : 'text-gray-900'
                          }`}
                        >
                          {liveUser.rewardPoints || 0} Points
                        </span>
                        {!walletPointsOk && totalPoints > 0 && (
                          <AlertCircle size={15} color="#DC2626" />
                        )}
                        {walletPointsOk && totalPoints > 0 && (
                          <CheckCircle2 size={15} color="#16A34A" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Inline balance error */}
                  {walletError && (
                    <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{walletError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* ---- Bkash / Nagad details ---- */}
              {(paymentMethod === 'Bkash' || paymentMethod === 'Nagad') && (
                <div className="space-y-4">
                  {/* Send money instruction */}
                  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4">
                    <p className="text-sm text-pink-900 mb-3">
                      Please send{' '}
                      <span className="font-bold">
                        BDT {totalBDT > 0 ? totalBDT : totalPoints + ' Points worth'}
                      </span>{' '}
                      to the following {paymentMethod} number using the{' '}
                      <span className="font-semibold">Send Money</span> option:
                    </p>
                    <div className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-pink-200">
                      <span className="font-bold text-lg text-gray-900 tracking-wide">
                        {MERCHANT_NUMBER}
                      </span>
                      <button
                        onClick={copyNumber}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor: '#E56E2020', color: '#E56E20' }}
                      >
                        <Copy size={13} />
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Sender phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Your {paymentMethod} Number (Sender)
                    </label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#E56E20] text-sm"
                    />
                  </div>

                  {/* Transaction number */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Transaction ID / TrxID
                    </label>
                    <input
                      type="text"
                      value={transactionNumber}
                      onChange={(e) => setTransactionNumber(e.target.value)}
                      placeholder={`Enter ${paymentMethod} transaction ID`}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-[#E56E20] text-sm"
                    />
                  </div>

                  {/* Pending notice */}
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
                    <Clock size={16} className="flex-shrink-0 mt-0.5" />
                    <span>
                      Your purchase will be pending until an admin approves your payment. You'll be
                      notified once approved.
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleProceedPayment}
              className="w-full py-4 rounded-xl text-white font-semibold text-lg shadow transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#E56E20' }}
            >
              {paymentMethod === 'Wallet' ? 'Pay Now' : 'Submit Payment Request'}
            </button>
          </>
        )}

        {/* ===== PROCESSING STEP ===== */}
        {step === 'processing' && (
          <div className="bg-white rounded-2xl shadow-md p-16 text-center">
            <div
              className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 mb-6"
              style={{ borderColor: '#E56E20' }}
            />
            <p className="text-lg font-semibold text-gray-700">Processing your payment…</p>
            <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
          </div>
        )}

        {/* ===== PENDING STEP (Bkash / Nagad submitted) ===== */}
        {step === 'pending' && (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ backgroundColor: '#FEF3C7' }}
            >
              <Clock size={40} color="#D97706" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Request Sent!</h3>
            <p className="text-gray-600 mb-2">
              Your {paymentMethod} payment request has been submitted successfully.
            </p>
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6">
              An admin will review your payment and approve your purchase. You'll receive a
              notification once it's confirmed. You can give feedback after approval.
            </p>
            <div className="text-left bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="font-semibold">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sender Phone</span>
                <span className="font-semibold">{senderPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-semibold">{transactionNumber}</span>
              </div>
              {totalBDT > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold">{totalBDT} BDT</span>
                </div>
              )}
            </div>
            <button
              onClick={onSuccess}
              className="w-full py-3 rounded-xl text-white font-semibold"
              style={{ backgroundColor: '#E56E20' }}
            >
              Back to Home
            </button>
          </div>
        )}

        {/* ===== FEEDBACK STEP (Wallet — instant purchase) ===== */}
        {step === 'feedback' && (
          <>
            <div className="bg-white rounded-2xl shadow-md p-6 mb-5">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: '#DCFCE7' }}
                >
                  <CheckCircle2 size={26} color="#16A34A" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Purchase Successful!</h3>
                  <p className="text-sm text-gray-500">Would you like to rate your purchases?</p>
                </div>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <h4 className="font-semibold mb-3 text-gray-800">{item.title}</h4>

                    {/* Stars */}
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() =>
                            setFeedbacks((prev) => ({
                              ...prev,
                              [item.id]: { ...prev[item.id], rating: r },
                            }))
                          }
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={28}
                            fill={r <= (feedbacks[item.id]?.rating || 0) ? '#E56E20' : 'none'}
                            stroke={r <= (feedbacks[item.id]?.rating || 0) ? '#E56E20' : '#D1D5DB'}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Comment */}
                    <textarea
                      value={feedbacks[item.id]?.comment || ''}
                      onChange={(e) =>
                        setFeedbacks((prev) => ({
                          ...prev,
                          [item.id]: { ...prev[item.id], comment: e.target.value },
                        }))
                      }
                      placeholder="Share your thoughts (optional)"
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:border-[#E56E20] text-sm resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkipFeedback}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Skip
              </button>
              <button
                onClick={handleSubmitFeedback}
                className="flex-1 py-3 rounded-xl text-white font-semibold"
                style={{ backgroundColor: '#E56E20' }}
              >
                Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
