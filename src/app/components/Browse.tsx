import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { Header } from './Header';
import { Footer } from './Footer';
import { useMockData, Resource as ResourceType } from '../utils/MockDataContext';
import { Search, Filter, FileText, Download, Star, ShoppingCart, X, Crown, Lock } from 'lucide-react';
import { ItemDetailsModal } from './ItemDetailsModal';

type BrowseProps = {
  user: User;
};

export function Browse({ user }: BrowseProps) {
  const mockData = useMockData();
  const [resources, setResources] = useState<ResourceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceType, setSelectedPriceType] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<ResourceType[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [checkoutMethod, setCheckoutMethod] = useState<'Wallet' | 'Bkash' | 'Nagad'>('Wallet');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutTrxId, setCheckoutTrxId] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment'>('review');

  const isPremium = user.membershipType === 'premium_monthly' || user.membershipType === 'premium_yearly';
  const liveUser = mockData.users.find((u: any) => u.id === user.id) || user;

  const categories = ['All', 'Previous Papers', 'Lecture Notes', 'Assignments', 'Study Guides', 'Books', 'Electronic Equipment'];
  const departments = ['All', 'Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry'];

  useEffect(() => {
    fetchResources();
  }, [selectedCategory]);

  const fetchResources = () => {
    setLoading(true);
    const allResources = mockData.getResourcesByCategory(selectedCategory === 'All' ? undefined : selectedCategory);
    setResources(allResources);
    setLoading(false);
  };

  const addToCart = (resource: ResourceType) => {
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

    let totalMoney = 0;
    let totalPoints = 0;
    cart.forEach(item => {
      if (item.priceType === 'money') totalMoney += item.price;
      else totalPoints += item.price;
    });

    if (checkoutMethod === 'Wallet') {
      const hasEnoughMoney = liveUser.walletBalance >= totalMoney;
      const hasEnoughPoints = (liveUser.rewardPoints || 0) >= totalPoints;
      if (!hasEnoughMoney || !hasEnoughPoints) {
        let message = 'Insufficient balance!\n';
        if (!hasEnoughMoney) message += `\nNeed ৳${(totalMoney - liveUser.walletBalance).toFixed(2)} more in wallet.`;
        if (!hasEnoughPoints) message += `\nNeed ${totalPoints - (liveUser.rewardPoints || 0)} more reward points.`;
        alert(message);
        return;
      }
      try {
        mockData.purchaseFromCart('Wallet', false);
        setCart([]);
        setShowCart(false);
        setCheckoutStep('review');
        alert('Purchase successful! You can now access your resources.');
      } catch (error: any) {
        alert(error.message || 'Purchase failed. Please try again.');
      }
    } else {
      // External payment - require phone and trx id
      if (!checkoutPhone || checkoutPhone.length < 11) { alert('Enter a valid phone number'); return; }
      if (!checkoutTrxId.trim()) { alert('Enter the transaction ID'); return; }
      try {
        mockData.purchaseFromCart(checkoutMethod, false);
        setCart([]);
        setShowCart(false);
        setCheckoutStep('review');
        setCheckoutPhone('');
        setCheckoutTrxId('');
        alert('Purchase submitted! Admin will verify your payment shortly.');
      } catch (error: any) {
        alert(error.message || 'Purchase failed. Please try again.');
      }
    }
  };

  const filteredResources = resources.filter(resource => {
    // Search filter
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price type filter
    const matchesPriceType = selectedPriceType === 'All' || resource.priceType === selectedPriceType;
    
    // Department filter
    const matchesDepartment = selectedDepartment === 'All' || resource.department === selectedDepartment;
    
    // Course filter
    const matchesCourse = selectedCourse === 'All' || resource.course === selectedCourse;
    
    // Price range filter
    const minPrice = priceRange.min ? parseFloat(priceRange.min) : 0;
    const maxPrice = priceRange.max ? parseFloat(priceRange.max) : Infinity;
    const matchesPriceRange = resource.price >= minPrice && resource.price <= maxPrice;

    return matchesSearch && matchesPriceType && matchesDepartment && matchesCourse && matchesPriceRange;
  });

  // Get unique courses from resources
  const courses = ['All', ...Array.from(new Set(resources.map(r => r.course).filter(Boolean)))];

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
                            <X size={20} />
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
                    <div className="mb-4 space-y-1">
                      {cart.filter(i => i.priceType === 'money').length > 0 && (
                        <div className="flex justify-between text-sm"><span className="text-gray-500">BDT Total:</span><span className="font-bold" style={{ color: '#E56E20' }}>৳{cart.filter(i=>i.priceType==='money').reduce((s,i)=>s+i.price,0)}</span></div>
                      )}
                      {cart.filter(i => i.priceType === 'points').length > 0 && (
                        <div className="flex justify-between text-sm"><span className="text-gray-500">Points Total:</span><span className="font-bold text-purple-600">{cart.filter(i=>i.priceType==='points').reduce((s,i)=>s+i.price,0)} pts</span></div>
                      )}
                    </div>

                    {checkoutStep === 'review' ? (
                      <button
                        className="w-full py-3 rounded-lg text-white font-semibold"
                        style={{ backgroundColor: '#E56E20' }}
                        onClick={() => setCheckoutStep('payment')}
                      >
                        Proceed to Payment
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="font-semibold text-gray-800">Select Payment Method</h3>
                        {[
                          { id: 'Wallet', label: 'Wallet', emoji: '💼', sub: `Balance: ৳${liveUser.walletBalance?.toFixed(2)}` },
                          { id: 'Bkash', label: 'bKash', emoji: '📱', sub: 'Send money then submit TrxID' },
                          { id: 'Nagad', label: 'Nagad', emoji: '💳', sub: 'Send money then submit TrxID' },
                        ].map(m => (
                          <button key={m.id} onClick={() => setCheckoutMethod(m.id as any)}
                            className={`w-full p-3 rounded-xl border-2 text-sm font-semibold text-left flex items-center gap-3 transition-all ${checkoutMethod === m.id ? 'border-[#E56E20] bg-orange-50' : 'border-gray-200'}`}>
                            <span className="text-xl">{m.emoji}</span>
                            <div><div>{m.label}</div><div className="text-xs text-gray-400 font-normal">{m.sub}</div></div>
                          </button>
                        ))}
                        {checkoutMethod !== 'Wallet' && (
                          <div className="space-y-2">
                            <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-xs text-pink-900">
                              Send to <strong>01629668094</strong> via {checkoutMethod}, then submit details below.
                            </div>
                            <input type="tel" value={checkoutPhone} onChange={e => setCheckoutPhone(e.target.value.replace(/\D/g, ''))}
                              placeholder="Your phone number (01XXXXXXXXX)" maxLength={11}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none text-sm" />
                            <input type="text" value={checkoutTrxId} onChange={e => setCheckoutTrxId(e.target.value)}
                              placeholder="Transaction ID"
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-[#E56E20] outline-none text-sm" />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => setCheckoutStep('review')} className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 font-semibold text-sm hover:bg-gray-50">Back</button>
                          <button onClick={handleCheckout} className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm" style={{ background: 'linear-gradient(135deg, #E56E20, #f7a35c)' }}>Confirm Purchase</button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h2 className="text-3xl font-bold mb-6">Browse Resources</h2>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for resources..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <Filter size={20} className="text-gray-500" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedCategory === category ? { backgroundColor: '#E56E20' } : {}}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle - Premium Only */}
          {isPremium ? (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm font-medium flex items-center gap-2"
              style={{ color: '#E56E20' }}
            >
              {showFilters ? 'Hide' : 'Show'} Advanced Filters
              <Filter size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-fit">
              <Lock size={14} />
              Advanced Filters
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                <Crown size={11} /> Premium Only
              </span>
            </div>
          )}

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Type
                </label>
                <select
                  value={selectedPriceType}
                  onChange={(e) => setSelectedPriceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                >
                  <option value="All">All Types</option>
                  <option value="money">Money (BDT)</option>
                  <option value="points">Points</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                >
                  {courses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="Min"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="Max"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#E56E20' }}></div>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <FileText size={64} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No resources found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedResourceId(resource.id)}
              >
                <div className="h-2" style={{ backgroundColor: '#D4ECF7' }}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: '#E56E20' }}
                    >
                      {resource.category}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>{resource.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>by {resource.uploaderName}</span>
                    <div className="flex items-center gap-1">
                      <Download size={14} />
                      <span>{resource.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold" style={{ color: '#E56E20' }}>
                      {resource.price === 0 ? 'Free' : `${resource.price} ${resource.priceType === 'money' ? 'BDT' : 'Points'}`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(resource);
                      }}
                      className="px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
                      style={{ backgroundColor: '#E56E20' }}
                    >
                      {resource.price === 0 ? 'Download' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
