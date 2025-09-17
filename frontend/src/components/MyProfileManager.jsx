import React, { useState, useEffect } from 'react';
import Header from './Header';
import ProfileForm from './ProfileForm';
import apiService from '../api/apiService';
import { Loader, ArrowLeft, User, Edit } from 'lucide-react';
import './HackathonTeamBuilder.css';

const MyProfileManager = ({ currentUserId, onNavigateBack, onUpdateSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (currentUserId) {
      fetchProfile(currentUserId);
    } else {
      setError("Please create a profile first to manage it.");
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchProfile = async (id) => {
    setLoading(true);
    setError(null);
    try {
      console.log(`🔍 MyProfileManager DEBUG - Fetching profile for user ID: ${id}`);
      const fetchedProfile = await apiService.getProfileById(id);
      console.log('🔍 MyProfileManager DEBUG - Fetched profile data:', fetchedProfile);
      console.log('🔍 MyProfileManager DEBUG - College name:', fetchedProfile.college_name);
      console.log('🔍 MyProfileManager DEBUG - Hackathon experiences:', fetchedProfile.hackathon_experiences);
      console.log('🔍 MyProfileManager DEBUG - Known skills:', fetchedProfile.known_skills);
      console.log('🔍 MyProfileManager DEBUG - Desired skills:', fetchedProfile.desired_skills);
      setProfile(fetchedProfile);
    } catch (err) {
      console.error('🔍 MyProfileManager DEBUG - Error fetching profile:', err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Handle complete profile updates, not just skills
  const handleProfileUpdate = async (updatedProfileData) => {
    if (!profile) {
      setError("No profile to update.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      console.log('🔍 MyProfileManager DEBUG - Updating profile with data:', updatedProfileData);
      console.log('🔍 MyProfileManager DEBUG - College field being sent:', updatedProfileData.college);
      console.log('🔍 MyProfileManager DEBUG - Hackathon experiences being sent:', updatedProfileData.hackathonExperiences);
      
      
      const response = await apiService.updateUserProfile(profile.id, updatedProfileData);
      console.log('🔍 MyProfileManager DEBUG - Update response:', response);
      console.log('🔍 MyProfileManager DEBUG - Updated college name:', response.college_name);
      console.log('🔍 MyProfileManager DEBUG - Updated hackathon experiences:', response.hackathon_experiences);
      
      setProfile(response);
      setEditMode(false);
      alert('Profile updated successfully!');
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      console.error('🔍 MyProfileManager DEBUG - Profile update error:', err);
      setError(`Failed to update profile: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    console.log('🔍 MyProfileManager DEBUG - Toggling edit mode. Current mode:', editMode);
    setEditMode(!editMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={onNavigateBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>

          <Header />
          
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={onNavigateBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
          </div>

          <Header />
          
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-500">Create a profile to get started and manage your skills here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onNavigateBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>

          {!editMode && profile && (
            <button
              onClick={handleEditToggle}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>

        <Header />
        
        <div className="mt-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          
          

          {profile && (
            <div>
              {editMode ? (
                //EDIT MODE with proper ProfileForm props
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Edit Your Profile</h2>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {/* Use onUpdate prop instead of onSubmit when editing */}
                  <ProfileForm
                    onUpdate={handleProfileUpdate}
                    editingProfile={profile}
                    loading={loading}
                  />
                </div>
              ) : (
                // VIEW MODE: Show profile details
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Your Profile</h2>
                    <p className="text-gray-600">Manage your hackathon team-building profile</p>
                  </div>

                  {/* PROFILE DETAILS DISPLAY */}
                  <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <p className="mt-1 text-sm text-gray-900">{profile.name || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <p className="mt-1 text-sm text-gray-900">{profile.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">College/University</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.college_name || 'Not provided'}
                            {!profile.college_name && (
                              <span className="text-xs text-red-500 ml-2">[DEBUG: NULL VALUE]</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.year ? 
                              profile.year === 'graduate' ? 'Graduate' : `${profile.year}${profile.year === '1' ? 'st' : profile.year === '2' ? 'nd' : profile.year === '3' ? 'rd' : 'th'} Year`
                              : 'Not provided'
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Gender</label>
                          <p className="mt-1 text-sm text-gray-900 capitalize">
                            {profile.gender || 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                          <p className="mt-1 text-sm text-gray-900">
                            {profile.is_beginner ? 'Beginner' : 'Experienced'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Social Links */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">LinkedIn Profile</label>
                          {profile.linkedin_url ? (
                            <a 
                              href={profile.linkedin_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-1 text-sm text-blue-600 hover:text-blue-800 break-all"
                            >
                              {profile.linkedin_url}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">Not provided</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">GitHub Profile</label>
                          {profile.github_url ? (
                            <a 
                              href={profile.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="mt-1 text-sm text-blue-600 hover:text-blue-800 break-all"
                            >
                              {profile.github_url}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">Not provided</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                      
                      {/* Known Skills */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Known Skills</label>
                        <div className="flex flex-wrap gap-2">
                          {(profile.known_skills || []).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                            >
                              {typeof skill === 'object' ? skill.name : skill}
                            </span>
                          ))}
                          {(!profile.known_skills || profile.known_skills.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No known skills added yet</p>
                          )}
                        </div>
                      </div>

                      {/* Desired Skills */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Skills You Want to Learn</label>
                        <div className="flex flex-wrap gap-2">
                          {(profile.desired_skills || []).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                            >
                              {typeof skill === 'object' ? skill.name : skill}
                            </span>
                          ))}
                          {(!profile.desired_skills || profile.desired_skills.length === 0) && (
                            <p className="text-sm text-gray-500 italic">No desired skills added yet</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Hackathon Experiences Display */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Hackathon Experiences
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          ({profile.hackathon_experiences?.length || 0} experiences)
                        </span>
                      </h3>
                      
                      {(profile.hackathon_experiences && profile.hackathon_experiences.length > 0) ? (
                        <div className="space-y-4">
                          {profile.hackathon_experiences.map((experience, index) => (
                            <div key={experience.id || index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-gray-900">
                                  {experience.hackathon_name || 'Unnamed Hackathon'}
                                </h4>
                                <span className="text-xs text-gray-500">
                                  #{experience.id || `temp-${index}`}
                                </span>
                              </div>
                              
                              <div className="space-y-2">
                                <p className="text-sm text-gray-700">
                                  <strong>Organizer:</strong> {experience.organizer_name || 'Unknown'}
                                </p>
                                
                                {experience.achievements && experience.achievements.trim() && (
                                  <p className="text-sm text-gray-700">
                                    <strong>Achievement:</strong> {experience.achievements}
                                  </p>
                                )}
                                
                                {experience.description && experience.description.trim() && (
                                  <p className="text-sm text-gray-700">
                                    <strong>Description:</strong> {experience.description}
                                  </p>
                                )}
                                
                                {experience.created_at && (
                                  <p className="text-xs text-gray-500">
                                    <strong>Added:</strong> {new Date(experience.created_at).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                          <p className="text-sm text-gray-500 italic mb-2">No hackathon experiences added yet</p>
                          <p className="text-xs text-gray-400">Click "Edit Profile" to add your hackathon experiences</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfileManager;
