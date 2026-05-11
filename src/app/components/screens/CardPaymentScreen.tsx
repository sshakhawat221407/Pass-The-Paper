import { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { Input } from '../Input';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface CardPaymentScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function CardPaymentScreen({ onNavigate }: CardPaymentScreenProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleFormatCardNumber = (value: string) => {
    // Format card number with spaces every 4 digits
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    setCardNumber(formatted.slice(0, 19)); // Max 16 digits + 3 spaces
  };

  const handleFormatExpiry = (value: string) => {
    // Format as MM/YY
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      setExpiryDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4));
    } else {
      setExpiryDate(cleaned);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Card Payment" onBack={() => onNavigate('add-money')} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Payment Amount */}
        <div className="rounded-xl p-4 mb-4 border border-gray-200" style={{ backgroundColor: '#D4ECF7' }}>
          <p className="text-xs text-gray-600 mb-1">Payment Amount</p>
          <p className="text-2xl font-bold text-gray-900">৳500</p>
        </div>

        {/* Card Display */}
        <div className="relative mb-6">
          <div 
            className="rounded-2xl p-6 shadow-lg"
            style={{ 
              background: 'linear-gradient(135deg, #E56E20 0%, #D65F18 100%)',
              aspectRatio: '1.586'
            }}
          >
            <div className="flex justify-between items-start mb-8">
              <CreditCard size={32} color="white" opacity={0.8} />
              <p className="text-white text-xs opacity-80">VISA / MASTERCARD</p>
            </div>
            <div className="mb-4">
              <p className="text-white text-lg tracking-wider font-mono">
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white text-xs opacity-70 mb-1">CARDHOLDER</p>
                <p className="text-white text-sm font-medium">
                  {cardholderName.toUpperCase() || 'YOUR NAME'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white text-xs opacity-70 mb-1">EXPIRES</p>
                <p className="text-white text-sm font-medium">
                  {expiryDate || 'MM/YY'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Details Form */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock size={16} color="#E56E20" />
            Secure Card Information
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => handleFormatCardNumber(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base"
                maxLength={19}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                placeholder="Name as shown on card"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => handleFormatExpiry(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base"
                  maxLength={5}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="password"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.slice(0, 3))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-base"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Notes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-900">
            <strong>Your card is safe:</strong> We use bank-level encryption. Card details are processed securely and never stored on our servers.
          </p>
        </div>

        {/* Payment Button */}
        <Button 
          fullWidth 
          onClick={() => onNavigate('checkout')}
          disabled={!cardNumber || !cardholderName || !expiryDate || !cvv}
        >
          Continue to Checkout
        </Button>
      </div>

      <Footer />
    </div>
  );
}