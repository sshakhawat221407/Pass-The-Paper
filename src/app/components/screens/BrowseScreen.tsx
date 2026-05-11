import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Header } from '../Header';
import { ResourceCard } from '../ResourceCard';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData, Resource } from '../../utils/MockDataContext';

interface BrowseScreenProps {
  onNavigate: (screen: Screen) => void;
  initialCategory?: string;
}

export function BrowseScreen({ onNavigate, initialCategory }: BrowseScreenProps) {
  const mockData = useMockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedPriceType, setSelectedPriceType] = useState<string>('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Previous Papers', 'Lecture Notes', 'Assignments', 'Study Guides', 'Books', 'Electronic Equipment'];
  const departments = ['All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Electrical Engineering'];
  const semesters = ['All', 'Fall 2023', 'Spring 2024', 'Summer 2024', 'Available'];
  const priceTypes = ['All', 'Money', 'Points'];

  // Get filtered resources
  const filteredResources = mockData.resources.filter((resource: Resource) => {
    // Only show approved resources
    if (resource.status !== 'approved') return false;

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        resource.title.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query) ||
        resource.category.toLowerCase().includes(query) ||
        resource.department?.toLowerCase().includes(query) ||
        resource.course?.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && resource.category !== selectedCategory) {
      return false;
    }

    // Department filter
    if (selectedDepartment !== 'All' && resource.department !== selectedDepartment) {
      return false;
    }

    // Semester filter
    if (selectedSemester !== 'All' && resource.semester !== selectedSemester) {
      return false;
    }

    // Price type filter
    if (selectedPriceType !== 'All') {
      const filterType = selectedPriceType.toLowerCase();
      if (resource.priceType !== filterType) {
        return false;
      }
    }

    // Price range filter
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    if (resource.price < min || resource.price > max) {
      return false;
    }

    return true;
  });

  // Reset filters function
  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedDepartment('All');
    setSelectedSemester('All');
    setSelectedPriceType('All');
    setMinPrice('');
    setMaxPrice('');
    setSearchQuery('');
  };

  const activeFiltersCount = [
    selectedCategory !== 'All',
    selectedDepartment !== 'All',
    selectedSemester !== 'All',
    selectedPriceType !== 'All',
    minPrice !== '',
    maxPrice !== ''
  ].filter(Boolean).length;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Browse Resources" showNotifications showCart onNavigate={onNavigate} cartItemCount={2} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1800px] mx-auto px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by title, subject, or semester..."
                className="w-full pl-14 pr-32 py-4 rounded-2xl border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow text-lg focus:border-[#E56E20] focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={24} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button 
                className={`absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                  showFilters ? 'bg-[#E56E20] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                <span className="font-semibold">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-[#E56E20] text-xs font-bold px-2 py-0.5 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-3 px-1">
              Found {filteredResources.length} resources
            </p>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-[#E56E20] hover:underline font-semibold flex items-center gap-1"
                  >
                    <X size={16} />
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Category</p>
                    {selectedCategory !== 'All' && (
                      <button 
                        onClick={() => setSelectedCategory('All')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundColor: selectedCategory === category ? '#E56E20' : undefined
                        }}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Department</p>
                    {selectedDepartment !== 'All' && (
                      <button 
                        onClick={() => setSelectedDepartment('All')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {departments.map((dept) => (
                      <button
                        key={dept}
                        onClick={() => setSelectedDepartment(dept)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedDepartment === dept
                            ? 'text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundColor: selectedDepartment === dept ? '#E56E20' : undefined
                        }}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Semester Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Semester</p>
                    {selectedSemester !== 'All' && (
                      <button 
                        onClick={() => setSelectedSemester('All')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {semesters.map((semester) => (
                      <button
                        key={semester}
                        onClick={() => setSelectedSemester(semester)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedSemester === semester
                            ? 'text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundColor: selectedSemester === semester ? '#E56E20' : undefined
                        }}
                      >
                        {semester}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Type Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-gray-700">Payment Type</p>
                    {selectedPriceType !== 'All' && (
                      <button 
                        onClick={() => setSelectedPriceType('All')}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {priceTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedPriceType(type)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          selectedPriceType === type
                            ? 'text-white shadow-md scale-105'
                            : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          backgroundColor: selectedPriceType === type ? '#E56E20' : undefined
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Price Range</p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="px-4 pb-4">
            <div className="space-y-3">
              {filteredResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  title={resource.title}
                  subject={resource.department || 'N/A'}
                  semester={resource.semester || 'N/A'}
                  type={resource.category}
                  points={resource.priceType === 'points' ? resource.price : undefined}
                  price={resource.priceType === 'money' ? resource.price : undefined}
                  onClick={() => onNavigate('resource-details')}
                />
              ))}
              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-2">No resources found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}