import { useState } from 'react';
import { User, Camera, ChevronLeft } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Footer } from '../Footer';
import { Screen } from '../../App';
import { useMockData } from '../../utils/MockDataContext';
import { toast } from 'sonner@2.0.3';

interface EditProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  onBack?: () => void;
}

export function EditProfileScreen({ onNavigate, onBack }: EditProfileScreenProps) {
  const mockData = useMockData();
  const currentUser = mockData.currentUser;
  
  const [name, setName] = useState(currentUser?.name || 'Sarah Johnson');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.johnson@university.edu');
  const [studentId, setStudentId] = useState(currentUser?.studentId || '2021-CS-001');
  const [university, setUniversity] = useState(currentUser?.university || 'State University');
  const [department, setDepartment] = useState('Computer Science');
  const [profilePicture, setProfilePicture] = useState<string | null>(currentUser?.profilePicture || null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      onNavigate('profile');
    }
  };

  const handleSave = () => {
    if (!currentUser) {
      toast.error('No user logged in');
      return;
    }

    // Validate inputs
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    if (!email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!studentId.trim()) {
      toast.error('Student ID is required');
      return;
    }

    if (!university.trim()) {
      toast.error('University is required');
      return;
    }

    // Update user in context
    mockData.updateUser(currentUser.id, {
      name: name.trim(),
      email: email.trim(),
      studentId: studentId.trim(),
      university: university.trim(),
      profilePicture: profilePicture || undefined,
    });

    toast.success('Profile updated successfully!');
    
    // Navigate back to profile
    setTimeout(() => {
      onNavigate('profile');
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FDF6F0' }}>
      {/* Page Title Row */}
      <div className="flex items-center gap-2 px-4 pt-5 pb-3">
        <button onClick={handleBack} className="p-2 rounded-lg hover:bg-white/60 transition-colors">
          <ChevronLeft size={22} color="#E56E20" />
        </button>
        <h2 className="text-2xl font-bold" style={{ color: '#E56E20' }}>Edit Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Profile Photo */}
        <div className="bg-white rounded-xl p-6 mb-4 border border-gray-200 text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mx-auto mb-3 overflow-hidden">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} color="#666666" />
              )}
            </div>
            <label 
              htmlFor="profile-picture-input"
              className="absolute bottom-2 right-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white cursor-pointer"
              style={{ backgroundColor: '#E56E20' }}
            >
              <Camera size={16} color="white" />
            </label>
          </div>
          <p className="text-xs text-gray-600">Tap to update profile photo</p>
          <input
            id="profile-picture-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfilePictureChange}
          />
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChange={setName}
            />

            <Input
              label="University Email"
              type="email"
              placeholder="your.email@university.edu"
              value={email}
              onChange={setEmail}
            />
            <p className="text-xs text-gray-600 -mt-2 px-1">
              Email cannot be changed after verification
            </p>

            <Input
              label="Student ID"
              placeholder="Your student ID"
              value={studentId}
              onChange={setStudentId}
            />
          </div>
        </div>

        {/* Academic Information */}
        <div className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Academic Information</h3>
          <div className="space-y-4">
            <Input
              label="University"
              placeholder="Your university name"
              value={university}
              onChange={setUniversity}
            />

            <Input
              label="Department / Major"
              placeholder="Your department"
              value={department}
              onChange={setDepartment}
            />
          </div>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-900">
            <strong>Privacy:</strong> Your personal information is only used for verification. 
            Other users see you as "Anonymous User" to protect your identity.
          </p>
        </div>

        {/* Save Button */}
        <Button fullWidth onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <Footer />
    </div>
  );
}
