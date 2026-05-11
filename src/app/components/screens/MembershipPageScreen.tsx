import React, { useState } from 'react';
import { ChevronLeft, Check, Crown, Star, Zap, TrendingUp, Wallet as WalletIcon, Smartphone, X, Clock } from 'lucide-react';
import { User } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import type { MembershipPlan } from '../../utils/MockDataContext';
import { toast } from 'sonner@2.0.3';
import { Footer } from '../Footer';

type MembershipPageScreenProps = {
  user: User;
  onBack: () => void;
};

type PremiumPlan = Exclude<MembershipPlan, 'free'>;
type PaymentMethod = 'Wallet' | 'Bkash' | 'Nagad';

const MERCHANT_NUMBER = '01629668094';

const plans = [
  {
    id: 'free' as MembershipPlan,
    name: 'Free',
    price: 0,
    period: 'Forever',
    features: [
      'Browse academic resources',
      'Upload up to 5 resources/month',
      'Basic search filters',
      'Standard support',
      'Download approved resources',
    ],
    icon: Star,
    color: '#6B7280',
  },
  {
    id: 'premium_monthly' as MembershipPlan,
    name: 'Premium Monthly',
    price: 299,
    period: 'Per Month',
    features: [
      'Unlimited uploads',
      'Priority approval for uploads',
      'Advanced search and filters',
      'Priority support',
      'Early access to new resources',
      '10% bonus on all earnings',
      'Exclusive member badge',
    ],
    icon: Zap,
    color: '#E56E20',
    popular: true,
  },
  {
    id: 'premium_yearly' as MembershipPlan,
    name: 'Premium Yearly',
    price: 2999,
    period: 'Per Year',
    savings: 'Save 16%',
    features: [
      'Everything in Monthly',
      '20% bonus on all earnings',
      'Free featured listings (2/month)',
      'Dedicated account manager',
      'Custom analytics dashboard',
      'API access (coming soon)',
      'Lifetime member badge',
    ],
    icon: Crown,
    color: '#8B5CF6',
    bestValue: true,
  },
];

export function MembershipPageScreen({ user, onBack }: MembershipPageScreenProps) {
  const mockData = useMockData();
  const liveUser = mockData.users.find((u: any) => u.id === user.id) || user;
  const currentPlan = (liveUser.membershipType || 'free') as MembershipPlan;
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan>(currentPlan);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Wallet');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [transactionNumber, setTransactionNumber] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');

  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan) || plans[0];

  const resetPaymentForm = () => {
    setShowPayment(false);
    setPaymentMethod('Wallet');
    setPaymentPhone('');
    setTransactionNumber('');
    setPaymentMessage('');
  };

  const handleSubscribe = () => {
    if (selectedPlan === 'free') {
      mockData.updateUser(user.id, {
        membershipType: 'free',
        membershipExpiry: undefined,
      });
      toast.success('Free plan selected');
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSubmit = () => {
    if (selectedPlan === 'free') return;

    const plan = selectedPlanDetails;

    try {
      if (paymentMethod === 'Wallet') {
        if ((liveUser.walletBalance || 0) < plan.price) {
          setPaymentMessage(`Insufficient wallet balance. You need BDT ${plan.price - (liveUser.walletBalance || 0)} more.`);
          return;
        }

        mockData.addTransaction({
          userId: user.id,
          type: 'membership',
          amount: plan.price,
          currency: 'BDT',
          description: `${plan.name} membership paid from wallet`,
          paymentMethod: 'Wallet',
          membershipPlan: selectedPlan as PremiumPlan,
          status: 'approved',
        });
        toast.success(`${plan.name} selected successfully`);
        resetPaymentForm();
        return;
      }

      if (!paymentPhone || paymentPhone.length < 11) {
        setPaymentMessage('Enter the phone number you sent money from');
        return;
      }

      if (!transactionNumber.trim()) {
        setPaymentMessage('Enter the transaction number');
        return;
      }

      mockData.addTransaction({
        userId: user.id,
        type: 'membership',
        amount: plan.price,
        currency: 'BDT',
        description: `${plan.name} membership request via ${paymentMethod}`,
        paymentMethod,
        paymentPhone,
        transactionNumber: transactionNumber.trim(),
        membershipPlan: selectedPlan as PremiumPlan,
        status: 'pending',
      });
      toast.success('Membership payment request submitted for admin approval');
      resetPaymentForm();
    } catch (error: any) {
      setPaymentMessage(error.message || 'Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0D7C7' }}>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ChevronLeft size={24} color="#E56E20" />
              </button>
              <h2 className="font-semibold text-gray-900 text-xl">Membership Plans</h2>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#E56E20' }}>
            Upgrade Your Experience
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a free, monthly, or yearly membership plan.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white border border-orange-100 text-sm font-semibold text-gray-700">
            Current plan: {currentPlan === 'premium_yearly' ? 'Premium Yearly' : currentPlan === 'premium_monthly' ? 'Premium Monthly' : 'Free'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-white rounded-2xl shadow-lg p-8 cursor-pointer transition-all ${
                  isSelected ? 'ring-4 ring-offset-2 scale-105' : 'hover:shadow-xl'
                }`}
                style={isSelected ? { borderColor: plan.color, boxShadow: `0 0 0 3px ${plan.color}33` } : {}}
              >
                {(plan.popular || plan.bestValue || isCurrent) && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full text-white text-xs font-semibold shadow-md" style={{ backgroundColor: plan.color }}>
                      {isCurrent ? 'Current Plan' : plan.popular ? 'Most Popular' : 'Best Value'}
                    </span>
                  </div>
                )}

                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${plan.color}20` }}>
                    <Icon size={32} style={{ color: plan.color }} />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                <div className="text-center mb-2">
                  <span className="text-4xl font-bold" style={{ color: plan.color }}>
                    {plan.price === 0 ? 'Free' : `BDT ${plan.price}`}
                  </span>
                  {plan.price > 0 && <span className="text-gray-500 text-sm block">{plan.period}</span>}
                </div>
                {plan.savings && (
                  <div className="text-center mb-4">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">
                      {plan.savings}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 my-6" />
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check size={20} className="flex-shrink-0 mt-0.5" style={{ color: plan.color }} />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    setSelectedPlan(plan.id);
                  }}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    isSelected ? 'text-white shadow-lg' : 'border-2 text-gray-700 hover:border-gray-400'
                  }`}
                  style={isSelected ? { backgroundColor: plan.color } : { borderColor: '#D1D5DB' }}
                >
                  {isSelected ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Why Go Premium?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#E5F3FF' }}>
                <TrendingUp size={24} style={{ color: '#3B82F6' }} />
              </div>
              <h4 className="font-semibold mb-2">Earn More</h4>
              <p className="text-sm text-gray-600">Get up to 20% bonus on your resource earnings.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#FEF3E2' }}>
                <Zap size={24} style={{ color: '#E56E20' }} />
              </div>
              <h4 className="font-semibold mb-2">Priority Access</h4>
              <p className="text-sm text-gray-600">Get faster approval and early access to new features.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                <Crown size={24} style={{ color: '#8B5CF6' }} />
              </div>
              <h4 className="font-semibold mb-2">Stand Out</h4>
              <p className="text-sm text-gray-600">Get exclusive badges and featured listings.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubscribe}
            className="px-12 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: '#E56E20' }}
          >
            {selectedPlan === 'free' ? 'Select Free Plan' : `Continue to Payment for ${selectedPlanDetails.name}`}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Wallet payments activate instantly. bKash and Nagad requests need admin approval.
          </p>
        </div>
      </div>

      {showPayment && selectedPlan !== 'free' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Pay for {selectedPlanDetails.name}</h3>
                <p className="text-sm text-gray-500">Amount: BDT {selectedPlanDetails.price}</p>
              </div>
              <button onClick={resetPaymentForm} className="p-1.5 rounded-lg hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { id: 'Wallet' as PaymentMethod, label: 'Wallet', icon: WalletIcon },
                { id: 'Bkash' as PaymentMethod, label: 'bKash', icon: Smartphone },
                { id: 'Nagad' as PaymentMethod, label: 'Nagad', icon: Smartphone },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setPaymentMethod(id);
                    setPaymentMessage('');
                  }}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold flex flex-col items-center gap-2 ${
                    paymentMethod === id ? 'border-[#E56E20] bg-orange-50 text-[#E56E20]' : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </button>
              ))}
            </div>

            {paymentMethod === 'Wallet' ? (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4 text-sm">
                <p className="text-gray-700">Wallet balance</p>
                <p className="font-bold text-lg" style={{ color: '#E56E20' }}>BDT {(liveUser.walletBalance || 0).toFixed(2)}</p>
              </div>
            ) : (
              <>
                <div className="bg-pink-50 border border-pink-200 rounded-xl p-3 mb-4 text-sm text-pink-900">
                  Send BDT {selectedPlanDetails.price} to <strong>{MERCHANT_NUMBER}</strong> using the Send Money option, then enter your sender phone number and transaction number below.
                </div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Sender Phone Number</label>
                <input
                  type="tel"
                  value={paymentPhone}
                  onChange={(event) => {
                    setPaymentPhone(event.target.value.replace(/\D/g, ''));
                    setPaymentMessage('');
                  }}
                  placeholder="01XXXXXXXXX"
                  maxLength={11}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-4 text-sm"
                />
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Transaction Number</label>
                <input
                  type="text"
                  value={transactionNumber}
                  onChange={(event) => {
                    setTransactionNumber(event.target.value);
                    setPaymentMessage('');
                  }}
                  placeholder="Enter bKash/Nagad TrxID"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none mb-4 text-sm"
                />
              </>
            )}

            {paymentMessage && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2 mb-4">{paymentMessage}</p>
            )}

            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4 flex items-center gap-2">
              <Clock size={13} /> bKash and Nagad memberships activate after admin approval.
            </p>

            <div className="flex gap-3">
              <button onClick={resetPaymentForm} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handlePaymentSubmit} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #E56E20, #f7a35c)' }}>
                {paymentMethod === 'Wallet' ? 'Pay from Wallet' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
