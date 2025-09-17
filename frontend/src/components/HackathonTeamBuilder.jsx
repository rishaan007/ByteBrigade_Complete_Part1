import React, { useState, useEffect } from 'react';
import Header from './Header';
import NavigationTabs from './NavigationTabs';
import ProfileForm from './ProfileForm';
import SearchForm from './SearchForm';
import SearchResults from './SearchResults';
import ViewProfile from './ViewProfile'; 
import apiService from '../api/apiService';
import './HackathonTeamBuilder.css';
import { ArrowLeft, User, Lock, UserPlus, LogOut, AlertCircle } from 'lucide-react';

const HackathonTeamBuilder = ({ onProfileCreated, currentUserId, onNavigateBack, initialTab }) => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Form states
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', name: '', email: '' });
  
  // App states
  const [activeTab, setActiveTab] = useState('profile');
  const [profiles, setProfiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileExists, setProfileExists] = useState(false);

  // NEW: Add states for profile viewing
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showViewProfile, setShowViewProfile] = useState(false);

  // Check if user is logged in from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsLoggedIn(true);
        checkExistingProfile(user.id);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  // 🔧 FIXED: Check for existing profile after login
  const checkExistingProfile = async (userId) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const existingProfile = await apiService.getProfileById(userId);
      if (existingProfile) {
        console.log('Existing profile found:', existingProfile);
        setUserProfile(existingProfile);
        
        // Check if profile has required fields filled
        const hasBasicInfo = existingProfile.name && existingProfile.email;
        const hasSkills = existingProfile.known_skills && existingProfile.known_skills.length > 0;
        
        if (hasBasicInfo && hasSkills) {
          setProfileExists(true);
          setActiveTab('search');
          console.log(' Profile is complete, redirecting to search');
        } else {
          setProfileExists(false);
          setActiveTab('profile');
          console.log(' Profile incomplete, showing profile form');
        }
      }
    } catch (err) {
      console.log('No existing profile found, showing creation form');
      setProfileExists(false);
      setActiveTab('profile');
    } finally {
      setLoading(false);
    }
  };

  // Handle initial tab setting
  useEffect(() => {
    if (initialTab && profileExists) {
      setActiveTab(initialTab);
    }
  }, [initialTab, profileExists]);

  // NEW: Add profile viewing handlers
  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowViewProfile(true);
  };

  const handleCloseViewProfile = () => {
    setSelectedProfile(null);
    setShowViewProfile(false);
  };

  // Authentication functions
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username.trim() || !loginData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setAuthLoading(true);
    setError(null);
    try {
      const response = await apiService.login(loginData);
      const userData = {
        id: response.user_id,
        username: response.username,
        name: response.name
      };
      setCurrentUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setLoginData({ username: '', password: '' });
      
      await checkExistingProfile(userData.id);
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.username.trim() || !registerData.password.trim() || 
        !registerData.name.trim() || !registerData.email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setAuthLoading(true);
    setError(null);
    try {
      const response = await apiService.createUser(registerData);
      const userData = {
        id: response.id,
        username: response.username,
        name: response.name
      };
      setCurrentUser(userData);
      setIsLoggedIn(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setRegisterData({ username: '', password: '', name: '', email: '' });
      
      setProfileExists(false);
      setActiveTab('profile');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserProfile(null);
    setProfileExists(false);
    setActiveTab('profile');
    setProfiles([]);
    setSearchResults([]);
    setHasSearched(false);
    setError(null);
    // NEW: Clear view profile state on logout
    setSelectedProfile(null);
    setShowViewProfile(false);
    localStorage.removeItem('currentUser');
  };

  // 🔧 FIXED: Handle profile submission - Update existing user instead of creating new profile
  const handleProfileSubmit = async (profileData) => {
    if (!currentUser) {
      setError('User session expired. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log(' Updating user profile for:', currentUser.id);
      
      // Use updateUserProfile instead of createProfile
      const updatedProfile = await apiService.updateUserProfile(currentUser.id, profileData);
      setUserProfile(updatedProfile);
      setProfileExists(true);
      
      if (onProfileCreated) {
        onProfileCreated(updatedProfile.id);
      }
      
      setActiveTab('search');
      
      // Success message
      const message = userProfile ? 'Profile updated successfully!' : 'Profile created successfully! You can now search for teammates.';
      alert(message);
      
    } catch (err) {
      console.error(' Profile submission error:', err);
      setError('Failed to save profile. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchCriteria) => {
    setLoading(true);
    setHasSearched(true);
    setError(null);
    try {
      console.log(' Searching with criteria:', searchCriteria);
      const results = await apiService.searchProfiles(searchCriteria);
      console.log(' Search results:', results);
      setSearchResults(results);
    } catch (err) {
      console.error(' Search failed:', err);
      setError('Failed to search. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    if (tab === 'profile' && profileExists) {
      alert('You already have a profile! Use the Manage Profile section to update your details.');
      return;
    }
    
    setActiveTab(tab);
    setError(null);
    
    if (tab === 'search') {
      setHasSearched(false);
      setSearchResults([]);
    }
  };

  // NEW: Show ViewProfile if selected
  if (showViewProfile && selectedProfile) {
    return (
      <ViewProfile 
        profile={selectedProfile}
        onClose={handleCloseViewProfile}
      />
    );
  }

  // Authentication screen (keep the authentication JSX the same as before...)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-neutral-400 mb-2">
              {authMode === 'login' ? 'Welcome to ByteBrigade' : 'Join ByteBrigade'}
            </h2>
            <p className="text-sm text-gray-600">
              {authMode === 'login' ? 'Sign in to find your hackathon teammates' : 'Create your account to get started'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-400">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Authentication forms (keep same as before) */}
            {authMode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium transform hover:scale-[1.02]"
                >
                  {authLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your full name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Choose a username"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      minLength="6"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Create a password (min 6 characters)"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium transform hover:scale-[1.02]"
                >
                  {authLoading ? 'Creating account...' : 'Create Account 🎯'}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setError(null);
                  setLoginData({ username: '', password: '' });
                  setRegisterData({ username: '', password: '', name: '', email: '' });
                }}
                className="text-sm text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2 mx-auto transition duration-200"
              >
                {authMode === 'login' ? (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Don't have an account? Register here
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    Already have an account? Sign in
                  </>
                )}
              </button>
            </div>
          </div>

          {onNavigateBack && (
            <div className="text-center">
              <button
                onClick={onNavigateBack}
                className="text-gray-600 hover:text-gray-900 flex items-center justify-center gap-2 mx-auto transition duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main app when logged in 
  return (
    <div className="min-h-screen  from-slate-900 via-blue-800 to-black bg-gradient-to-br">
      {/* Clean Header with user info */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Left side - Back button */}
            <div>
              {onNavigateBack && (
                <button
                  onClick={onNavigateBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="font-medium">Back to Home</span>
                </button>
              )}
            </div>
            
            {/* Right side - User info and logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">Welcome, </span>
                  <span className="font-semibold text-gray-900">
                    {currentUser?.name || currentUser?.username}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
            
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Always show Header component */}
        <Header />
        
        {/* Show different content based on profile status */}
        {!profileExists ? (
          <div className="text-center mb-8 bg-white rounded-xl p-8 shadow-lg border border-gray-200">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Developer Profile</h2>
            <p className="text-gray-600">Add your skills and information to find teammates</p>
          </div>
        ) : (
          <NavigationTabs 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
            availableTabs={['search', 'manage']}
          />
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-400 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8">
          {(activeTab === 'profile' && !profileExists) && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <UserPlus className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Complete Your Profile</h2>
              </div>
              <ProfileForm 
                onSubmit={handleProfileSubmit}
                editingProfile={userProfile}
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔍</span>
                  <h2 className="text-2xl font-bold text-gray-900">Find Teammates</h2>
                </div>
                <SearchForm 
                  onSearch={handleSearch}
                  loading={loading}
                />
              </div>
              
              <SearchResults
                searchResults={searchResults}
                allProfiles={[]}
                hasSearched={hasSearched}
                onCreateProfile={() => setActiveTab('profile')}
                onViewProfile={handleViewProfile} 
                loading={loading}
              />
            </div>
          )}

          {activeTab === 'manage' && profileExists && (
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">⚙️</span>
                <h2 className="text-2xl font-bold text-gray-900">Manage Your Profile</h2>
              </div>
              <ProfileForm 
                onSubmit={handleProfileSubmit}
                editingProfile={userProfile}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HackathonTeamBuilder;
