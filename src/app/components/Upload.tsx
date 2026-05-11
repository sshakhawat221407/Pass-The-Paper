import React, { useState } from 'react';
import { User } from '../App';
import { Footer } from './Footer';
import { useMockData } from '../utils/MockDataContext';
import { Upload as UploadIcon, FileText, AlertCircle, CheckCircle } from 'lucide-react';

type UploadProps = {
  user: User;
};

export function Upload({ user }: UploadProps) {
  const mockData = useMockData();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceType, setPriceType] = useState<'money' | 'points'>('points');
  const [price, setPrice] = useState('0');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Previous Papers', 'Lecture Notes', 'Assignments', 'Study Guides', 'Lab Reports', 'Books', 'Electronic Equipment'];
  const departments = ['Computer Science', 'Electrical Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Business', 'Engineering'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!user.isVerified) {
      setError('Please wait for your account to be verified before uploading resources.');
      return;
    }

    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add resource to mock data
      mockData.addResource({
        title,
        description,
        category,
        priceType,
        price: parseInt(price) || 0,
        uploadedBy: user.id,
        uploaderName: user.name,
        status: 'pending',
        fileUrl: '#',
        department,
        course,
        semester: 'Current',
      });

      // Award points for upload
      mockData.addTransaction({
        userId: user.id,
        type: 'upload_reward',
        amount: 10,
        description: `Upload reward for: ${title}`,
      });

      setSuccess(true);
      setTitle('');
      setDescription('');
      setCategory('');
      setPriceType('points');
      setPrice('0');
      setDepartment('');
      setCourse('');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (err: any) {
      setError(err.message || 'Failed to upload resource. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F0D7C7' }}>
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <h2 className="text-3xl font-bold mb-6">Upload Resource</h2>

        {!user.isVerified && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-yellow-800 mb-1">Account Verification Pending</p>
              <p className="text-sm text-yellow-700">
                Your account is currently being verified. You'll be able to upload resources once your account is approved by our admin team.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-800 mb-1">Upload Successful!</p>
                  <p className="text-sm text-green-700">
                    Your resource has been uploaded and is pending admin approval. You earned 10 bonus points!
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., CS101 Final Exam 2023"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                required
                disabled={!user.isVerified}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of your resource..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent resize-none"
                required
                disabled={!user.isVerified}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                  disabled={!user.isVerified}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                  required
                  disabled={!user.isVerified}
                >
                  <option value="">Select a department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g., CS101"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                required
                disabled={!user.isVerified}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Type *
                  </label>
                  <select
                    value={priceType}
                    onChange={(e) => setPriceType(e.target.value as 'money' | 'points')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                    disabled={!user.isVerified}
                  >
                    <option value="points">Points (Reward Points from buyers)</option>
                    <option value="money">BDT (Bangladeshi Taka)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ({priceType === 'money' ? 'BDT' : 'Points'})
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    min="0"
                    placeholder="0 for free"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E56E20] focus:border-transparent"
                    disabled={!user.isVerified}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {priceType === 'money' ? 'Amount in Bangladeshi Taka' : 'Points required to purchase'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#E56E20] transition-colors">
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  className="hidden"
                  disabled={!user.isVerified}
                />
                <label
                  htmlFor="file-input"
                  className={`cursor-pointer ${!user.isVerified ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <UploadIcon size={48} className="mx-auto mb-4" style={{ color: '#E56E20' }} />
                  {file ? (
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX, PPT, PPTX (Max 50MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading || !user.isVerified}
              className="w-full py-3 rounded-lg text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#E56E20' }}
            >
              {uploading ? 'Uploading...' : 'Upload Resource'}
            </button>

            <p className="text-xs text-gray-500 text-center">
              By uploading, you agree to our terms of service and confirm that you have the right to share this content.
            </p>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}