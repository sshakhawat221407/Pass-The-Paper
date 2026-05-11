import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, ChevronLeft } from 'lucide-react';
import { useMockData, Resource } from '../../utils/MockDataContext';
import { User } from '../../App';

type CartPageScreenProps = {
  user: User;
  onBack: () => void;
  onCheckout: () => void;
};

export function CartPageScreen({ user, onBack, onCheckout }: CartPageScreenProps) {
  const mockData = useMockData();
  const [cartItems, setCartItems] = useState<Resource[]>([]);

  useEffect(() => {
    const items = mockData.getCartItems();
    setCartItems(items);
  }, [mockData]);

  const removeFromCart = (resourceId: string) => {
    mockData.removeFromCart(resourceId);
    const updatedItems = mockData.getCartItems();
    setCartItems(updatedItems);
  };

  const totalBDT = cartItems
    .filter(item => item.priceType === 'money')
    .reduce((sum, item) => sum + item.price, 0);

  const totalPoints = cartItems
    .filter(item => item.priceType === 'points')
    .reduce((sum, item) => sum + item.price, 0);

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
              <h2 className="font-semibold text-gray-900 text-xl">Shopping Cart</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <ShoppingCart size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg mb-6">Your cart is empty</p>
            <button
              onClick={onBack}
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: '#E56E20' }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{item.category}</p>
                      <p className="font-semibold text-lg" style={{ color: '#E56E20' }}>
                        {item.price} {item.priceType === 'money' ? 'BDT' : 'Points'}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-xl mb-4">Order Summary</h3>
              <div className="space-y-3 mb-6">
                {totalBDT > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total (BDT)</span>
                    <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                      {totalBDT} BDT
                    </span>
                  </div>
                )}
                {totalPoints > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total (Points)</span>
                    <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                      {totalPoints} Points
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3 rounded-lg text-white font-semibold text-lg"
                style={{ backgroundColor: '#E56E20' }}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
