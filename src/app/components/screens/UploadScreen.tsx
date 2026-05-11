import { useState } from 'react';
import { Upload as UploadIcon, FileText, MapPin } from 'lucide-react';
import { Header } from '../Header';
import { Button } from '../Button';
import { Input } from '../Input';
import { Footer } from '../Footer';
import { Screen } from '../../App';

interface UploadScreenProps {
  onNavigate: (screen: Screen) => void;
}

export function UploadScreen({ onNavigate }: UploadScreenProps) {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [points, setPoints] = useState('');
  const [priceType, setPriceType] = useState<'money' | 'points'>('points');
  const [resourceFormat, setResourceFormat] = useState<'digital' | 'hardcopy'>('digital');
  const [pickupLocation, setPickupLocation] = useState('');
  const [bookCondition, setBookCondition] = useState('Good');

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <Header title="Upload Resource" showNotifications showCart onNavigate={onNavigate} cartItemCount={2} />
      
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        <p className="text-sm text-gray-600 mb-6">Share your notes and earn points or money</p>

        {/* Resource Format Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Resource Format *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setResourceFormat('digital')}
              className={`p-3 rounded-lg border-2 transition-all ${
                resourceFormat === 'digital' ? 'bg-white' : 'bg-transparent'
              }`}
              style={{
                borderColor: resourceFormat === 'digital' ? '#E56E20' : '#D1D5DB'
              }}
            >
              <FileText size={20} color={resourceFormat === 'digital' ? '#E56E20' : '#666666'} className="mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-900">Digital File</p>
            </button>

            <button
              onClick={() => setResourceFormat('hardcopy')}
              className={`p-3 rounded-lg border-2 transition-all ${
                resourceFormat === 'hardcopy' ? 'bg-white' : 'bg-transparent'
              }`}
              style={{
                borderColor: resourceFormat === 'hardcopy' ? '#E56E20' : '#D1D5DB'
              }}
            >
              <MapPin size={20} color={resourceFormat === 'hardcopy' ? '#E56E20' : '#666666'} className="mx-auto mb-1" />
              <p className="text-xs font-medium text-gray-900">Hard Copy</p>
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Choose digital file or physical hard copy book</p>
        </div>

        {/* File Upload (Digital Only) */}
        {resourceFormat === 'digital' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File *</label>
            <div 
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-white"
              style={{ borderColor: '#E56E20' }}
            >
              <UploadIcon size={32} color="#E56E20" className="mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900 mb-1">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-600">PDF, DOC, JPG, PNG (Max 25MB)</p>
            </div>
            <p className="text-xs text-gray-600 mt-2">Upload clear, readable files for better downloads</p>
          </div>
        )}

        {/* Hard Copy Details */}
        {resourceFormat === 'hardcopy' && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">Hard Copy Details</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Condition *</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                  value={bookCondition}
                  onChange={(e) => setBookCondition(e.target.value)}
                >
                  <option>Excellent - Like New</option>
                  <option>Good - Minor wear</option>
                  <option>Fair - Some wear and tear</option>
                  <option>Acceptable - Well used</option>
                </select>
              </div>

              <Input
                label="Pickup Location *"
                placeholder="e.g., Campus Library, Main Gate"
                value={pickupLocation}
                onChange={setPickupLocation}
              />
              <p className="text-xs text-gray-600 -mt-2 px-1">Where can buyers pick up the book?</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Book Photos *</label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer bg-white"
                  style={{ borderColor: '#E56E20' }}
                >
                  <UploadIcon size={24} color="#E56E20" className="mx-auto mb-2" />
                  <p className="text-xs font-medium text-gray-900 mb-1">Upload clear photos</p>
                  <p className="text-xs text-gray-600">Front cover, back, and any damage</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
          <p className="text-xs font-semibold text-gray-700 mb-3">Resource Details</p>
          
          {/* Resource Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type *</label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white">
              <option>Select type</option>
              <option>Previous Year Question</option>
              <option>Lecture Notes</option>
              <option>Assignments</option>
              <option>Study Guide</option>
              {resourceFormat === 'hardcopy' && <option>Textbook / Reference Book</option>}
            </select>
            <p className="text-xs text-gray-600 mt-1">Choose the category that best fits</p>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white">
              <option>Select subject</option>
              <option>Computer Science</option>
              <option>Mathematics</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Engineering</option>
            </select>
          </div>

          {/* Semester */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Semester / Trimester *</label>
            <select className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white">
              <option>Select semester</option>
              <option>Fall 2023</option>
              <option>Spring 2024</option>
              <option>Summer 2024</option>
              <option>Fall 2024</option>
            </select>
          </div>

          {/* Description */}
          <div className="mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              placeholder="Describe your resource: what it covers, quality, usefulness..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
              rows={4}
            />
            <p className="text-xs text-gray-600 mt-1">Help others understand what they'll get</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Set Your Price *</label>
          <p className="text-xs text-gray-600 mb-3">Choose to earn money or reward points</p>
          
          <div className="flex gap-3 mb-3">
            <button
              onClick={() => {
                setPriceType('money');
                setPoints('');
              }}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                priceType === 'money' ? 'bg-white' : 'bg-transparent'
              }`}
              style={{
                borderColor: priceType === 'money' ? '#E56E20' : '#D1D5DB'
              }}
            >
              <p className="text-sm font-medium">Money (৳)</p>
              <p className="text-xs text-gray-600 mt-1">Sell for cash</p>
            </button>

            <button
              onClick={() => {
                setPriceType('points');
                setPrice('');
              }}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                priceType === 'points' ? 'bg-white' : 'bg-transparent'
              }`}
              style={{
                borderColor: priceType === 'points' ? '#E56E20' : '#D1D5DB'
              }}
            >
              <p className="text-sm font-medium">Points</p>
              <p className="text-xs text-gray-600 mt-1">Exchange for points</p>
            </button>
          </div>

          {priceType === 'money' ? (
            <div>
              <Input
                placeholder="Enter amount in BDT (৳)"
                value={price}
                onChange={setPrice}
                type="number"
              />
              <p className="text-xs text-gray-600 mt-1 px-1">Set a fair price for your resource</p>
            </div>
          ) : (
            <div>
              <Input
                placeholder="Enter points"
                value={points}
                onChange={setPoints}
                type="number"
              />
              <p className="text-xs text-gray-600 mt-1 px-1">Recommended: 100-300 points based on quality</p>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button fullWidth onClick={() => onNavigate('profile')}>
            Submit Upload
          </Button>
          <p className="text-xs text-center text-gray-600 mt-2">
            {resourceFormat === 'digital' 
              ? 'Your upload will be reviewed within 24 hours'
              : 'Hard copy listings are reviewed within 24 hours'}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}