import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Footer } from './Footer';
import { useMockData } from '../utils/MockDataContext';
import { BookOpen, FileText, Clipboard, TrendingUp, ShoppingCart, Book, Cpu } from 'lucide-react';
import { ItemDetailsModal } from './ItemDetailsModal';

type HomeProps = {
  user: User;
};

type Resource = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'money' | 'points';
  uploadedBy: string;
  uploaderName: string;
  downloads: number;
  rating: number;
};

export function Home({ user }: HomeProps) {
  const mockData = useMockData();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Resource[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = () => {
    setLoading(true);
    const filteredResources = selectedCategory 
      ? mockData.getResourcesByCategory(selectedCategory)
      : mockData.getFeaturedResources();
    setResources(filteredResources);
    setLoading(false);
  };

  const addToCart = (resource: Resource) => {
    if (!cart.find(item => item.id === resource.id)) {
      setCart([...cart, resource]);
      mockData.addToCart(resource.id);
    }
  };

  const removeFromCart = (resourceId: string) => {
    setCart(cart.filter(item => item.id !== resourceId));
    mockData.removeFromCart(resourceId);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Calculate total cost
    let totalMoney = 0;
    let totalPoints = 0;

    cart.forEach(item => {
      if (item.priceType === 'money') {
        totalMoney += item.price;
      } else {
        totalPoints += item.price;
      }
    });

    // Check if user has enough balance
    const hasEnoughMoney = user.walletBalance >= totalMoney;
    const hasEnoughPoints = (user.rewardPoints || 0) >= totalPoints;

    if (!hasEnoughMoney || !hasEnoughPoints) {
      const moneyNeeded = Math.max(0, totalMoney - user.walletBalance);
      const pointsNeeded = Math.max(0, totalPoints - (user.rewardPoints || 0));
      
      let message = 'Insufficient balance!\n';
      if (moneyNeeded > 0) message += `\nNeed ৳${moneyNeeded} more in wallet.`;
      if (pointsNeeded > 0) message += `\nNeed ${pointsNeeded} more reward points.`;
      
      alert(message);
      return;
    }

    // Process the purchase
    try {
      mockData.purchaseFromCart('wallet', false);
      setCart([]);
      alert('Purchase successful! You can now access your resources.');
      setShowCart(false);
    } catch (error: any) {
      alert(error.message || 'Purchase failed. Please try again.');
    }
  };

  const categories = [
    { name: 'Previous Papers', icon: FileText, color: '#E56E20' },
    { name: 'Lecture Notes', icon: BookOpen, color: '#3B82F6' },
    { name: 'Assignments', icon: Clipboard, color: '#10B981' },
    { name: 'Books', icon: Book, color: '#8B5CF6' },
    { name: 'Electronic Equipment', icon: Cpu, color: '#EC4899' },
    { name: 'Trending', icon: TrendingUp, color: '#F59E0B' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-start justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white h-full w-full max-w-md shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                        <p className="font-semibold" style={{ color: '#E56E20' }}>
                          {item.price} {item.priceType === 'money' ? 'BDT' : 'Points'}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>
                        {cart.filter(item => item.priceType === 'money').length > 0 && 
                          `৳${cart.filter(item => item.priceType === 'money').reduce((sum, item) => sum + item.price, 0)}`}
                        {cart.filter(item => item.priceType === 'money').length > 0 && cart.filter(item => item.priceType === 'points').length > 0 && ' + '}
                        {cart.filter(item => item.priceType === 'points').length > 0 && 
                          `${cart.filter(item => item.priceType === 'points').reduce((sum, item) => sum + item.price, 0)} Points`}
                      </span>
                    </div>
                    <button
                      className="w-full py-3 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: '#E56E20' }}
                      onClick={handleCheckout}
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h2>
              <p className="text-gray-600">
                {user.isVerified ? (
                  <span className="text-green-600 font-medium">✓ Verified Student</span>
                ) : (
                  <span className="text-yellow-600 font-medium">⏳ Verification Pending</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold" style={{ color: '#E56E20' }}>
                {user.walletBalance}
              </p>
              <p className="text-sm text-gray-500">points</p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Browse by Category</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => {
                  if (category.name === 'Trending') {
                    setSelectedCategory(undefined);
                  } else {
                    setSelectedCategory(category.name);
                  }
                }}
                className={`bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all ${
                  selectedCategory === category.name ? 'ring-2 ring-offset-2' : ''
                }`}
                style={selectedCategory === category.name ? { ringColor: category.color } : {}}
              >
                <category.icon size={32} style={{ color: category.color }} className="mb-3 mx-auto" />
                <h4 className="font-semibold text-gray-800 text-sm text-center">{category.name}</h4>
              </button>
            ))}
          </div>
        </div>

        {/* Featured/Filtered Resources */}
        <div>
          <h3 className="text-xl font-bold mb-4">
            {selectedCategory ? `${selectedCategory}` : 'Featured Resources'}
          </h3>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#E56E20' }}></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedResourceId(resource.id)}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText size={20} style={{ color: '#E56E20' }} />
                      <span className="text-sm text-gray-500">{resource.category}</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{resource.title}</h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{resource.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-500">by {resource.uploaderName}</span>
                      <span className="text-sm text-gray-500">⭐ {resource.rating}/5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold" style={{ color: '#E56E20' }}>
                        {resource.price} {resource.priceType === 'money' ? 'BDT' : 'Points'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(resource);
                        }}
                        className="px-4 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: '#E56E20' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Details Modal */}
      {selectedResourceId && (
        <ItemDetailsModal
          resourceId={selectedResourceId}
          onClose={() => setSelectedResourceId(null)}
          onAddToCart={() => {
            const resource = resources.find(r => r.id === selectedResourceId);
            if (resource) {
              addToCart(resource);
            }
          }}
        />
      )}

      <Footer />
    </div>
  );
}
