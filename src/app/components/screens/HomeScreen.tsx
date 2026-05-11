import { Search, FileText, BookOpen, ClipboardList, TrendingUp, Book, Cpu, Sparkles, Award, Zap } from 'lucide-react';
import { Header } from '../Header';
import { VerifiedBadge } from '../VerifiedBadge';
import { ResourceCard } from '../ResourceCard';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface HomeScreenProps {
  onNavigate: (screen: Screen, params?: { category?: string }) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const categories = [
    { id: 1, name: 'Previous Papers', displayName: 'Previous Year Questions', icon: FileText },
    { id: 2, name: 'Lecture Notes', displayName: 'Lecture Notes', icon: BookOpen },
    { id: 3, name: 'Assignments', displayName: 'Assignments', icon: ClipboardList },
    { id: 4, name: 'Books', displayName: 'Books', icon: Book },
    { id: 5, name: 'Electronic Equipment', displayName: 'Electronic Equipment', icon: Cpu },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header showLogo showNotifications showCart onNavigate={onNavigate} cartItemCount={2} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-8 py-8">
          {/* Hero Section with Gradient */}
          <div className="mb-8 bg-gradient-to-r from-white to-[#D4ECF7] rounded-3xl p-10 shadow-lg border border-white/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="text-4xl font-bold text-gray-900">
                    Hello, Sarah! 👋
                  </h2>
                  <VerifiedBadge />
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Find resources, share knowledge, and earn rewards in your academic journey
                </p>
                
                {/* Search Bar */}
                <div className="relative max-w-2xl">
                  <input
                    type="text"
                    placeholder="Search by subject, semester, or type..."
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow text-lg focus:border-[#E56E20] focus:outline-none"
                    onClick={() => onNavigate('browse')}
                  />
                  <Search size={24} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 min-w-[180px]">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={20} className="text-[#E56E20]" />
                    <p className="text-sm text-gray-600">Wallet Balance</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">৳450</p>
                  <button 
                    onClick={() => onNavigate('wallet')}
                    className="mt-3 text-sm text-[#E56E20] hover:underline font-semibold"
                  >
                    Add Money →
                  </button>
                </div>
                
                <div className="rounded-2xl p-6 shadow-md border border-gray-100 min-w-[180px]" style={{ backgroundColor: '#D4ECF7' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={20} className="text-[#E56E20]" />
                    <p className="text-sm text-gray-600">Reward Points</p>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">1,250</p>
                  <button 
                    onClick={() => onNavigate('reward-points')}
                    className="mt-3 text-sm text-[#E56E20] hover:underline font-semibold"
                  >
                    Redeem Now →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Browse by Category</h3>
              <Zap size={24} className="text-[#E56E20]" />
            </div>
            
            <div className="grid grid-cols-5 gap-5">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button 
                    key={category.id}
                    className="bg-white rounded-2xl p-6 text-center border-2 border-gray-200 hover:border-[#E56E20] hover:shadow-xl transition-all duration-200 hover:scale-105 group"
                    onClick={() => onNavigate('browse', { category: category.name })}
                  >
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: '#D4ECF7' }}>
                      <Icon size={32} color="#E56E20" />
                    </div>
                    <p className="text-base font-semibold text-gray-900 leading-tight">{category.displayName}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trending Resources */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp size={28} color="#E56E20" />
                Trending Resources
              </h3>
              <button 
                onClick={() => onNavigate('browse')}
                className="text-[#E56E20] hover:underline font-semibold text-lg"
              >
                View All →
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <ResourceCard
                title="CSE 101 Final Exam 2023"
                subject="Computer Science"
                semester="Fall 2023"
                type="Previous Year Question"
                points={150}
                onClick={() => onNavigate('resource-details')}
              />
              <ResourceCard
                title="Calculus II Complete Notes"
                subject="Mathematics"
                semester="Spring 2024"
                type="Lecture Notes"
                price={120}
                onClick={() => onNavigate('resource-details')}
              />
              <ResourceCard
                title="Physics Lab Reports Collection"
                subject="Physics"
                semester="Fall 2023"
                type="Assignments"
                points={200}
                onClick={() => onNavigate('resource-details')}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}