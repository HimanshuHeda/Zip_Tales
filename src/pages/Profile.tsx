import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Mail, MapPin, Calendar, Award, Edit3, Save, X, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [searchParams] = useSearchParams();
  const isSetup = searchParams.get('setup') === 'true';
  
  const [isEditing, setIsEditing] = useState(isSetup);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    interests: user?.interests || []
  });

  const availableInterests = [
    'Technology', 'Politics', 'Sports', 'Entertainment', 'Health', 
    'Science', 'Business', 'Environment', 'Education', 'Travel'
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        location: user.location || '',
        interests: user.interests || []
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        bio: user.bio || '',
        location: user.location || '',
        interests: user.interests || []
      });
    }
    setIsEditing(false);
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 500) return { level: 'Expert', color: 'text-purple-600', bg: 'bg-purple-100' };
    if (reputation >= 200) return { level: 'Trusted', color: 'text-green-600', bg: 'bg-green-100' };
    if (reputation >= 100) return { level: 'Verified', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { level: 'Newcomer', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <p className="text-gray-600">You need to be authenticated to access this page.</p>
        </div>
      </div>
    );
  }

  const reputationInfo = getReputationLevel(user.reputation);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        {isSetup && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Welcome to ZipTales! 🎉</h3>
            <p className="text-blue-700">
              Complete your profile to get personalized news recommendations and start building your reputation in our community.
            </p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-blue-500 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-pink-600 shadow-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-pink-600 shadow-md">
                    <Camera className="h-3 w-3" />
                  </button>
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-pink-100">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${reputationInfo.bg} ${reputationInfo.color}`}>
                      {reputationInfo.level}
                    </span>
                    <span className="text-pink-100">•</span>
                    <span className="text-pink-100">{user.reputation} points</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-white text-pink-600 rounded-lg font-medium hover:bg-pink-50 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{user.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <p className="text-gray-900 flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{user.email}</span>
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-900">{user.bio || 'No bio added yet.'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Your location"
                        />
                      ) : (
                        <p className="text-gray-900 flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{user.location || 'Location not specified'}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                  {isEditing ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {availableInterests.map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                            formData.interests.includes(interest)
                              ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white border-transparent'
                              : 'bg-white text-gray-700 border-gray-300 hover:border-pink-500'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {user.interests.length > 0 ? (
                        user.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-500">No interests selected yet.</p>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-blue-600 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Stats Sidebar */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-pink-50 to-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Award className="h-5 w-5 text-pink-600" />
                    <span>Reputation Stats</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current Level</span>
                      <span className={`font-semibold ${reputationInfo.color}`}>
                        {reputationInfo.level}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Points</span>
                      <span className="font-semibold text-gray-900">{user.reputation}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Articles Voted</span>
                      <span className="font-semibold text-gray-900">23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">News Submitted</span>
                      <span className="font-semibold text-gray-900">5</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Voted on "AI Technology Breakthrough"</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Submitted news article</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Earned 20 reputation points</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;