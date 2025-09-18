import React from 'react';
import { ArrowLeft, User, Mail, School, Calendar, Laugh } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTrophy } from 'react-icons/fa';
import SkillTag from './SkillTag';
import './HackathonTeamBuilder.css';

const ViewProfile = ({ profile, onClose }) => {
  if (!profile) return null;

  const knownSkills = profile.known_skills || [];
  const desiredSkills = profile.desired_skills || [];
  const hackathonExperiences = profile.hackathon_experiences || [];

  return (
    <div className="profile-manager-container from-slate-900 via-blue-800 to-black bg-gradient-to-br w-100 min-h-screen">
      <div className="top-bar">
        <button
          className="back-btn flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-lg "
          onClick={onClose}
        >
          <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />

          {/* Hide text on small screens */}
          <span className="hidden md:inline font-small">Back to Search</span>
        </button>

        <div className="header-content">
          <div className="header-title">
            <User className="header-icon" size={18} />
            <h1>Profile Details</h1>
            <p>View teammate profile information</p>
          </div>
        </div>
      </div>


<div className="app-container from-slate-900 via-blue-800 to-black bg-gradient-to-br !border-none">
        <div className="content-wrapper">
          <div className="form-card">
            <h2 className="form-title">
              {profile.name || 'Anonymous User'}
            </h2>

            {/* Basic Information */}
            <div className="profile-section">
              <h3>Basic Information</h3>
              <div className="profile-info-grid">
                <div className="info-item">
                  <Mail size={18} />
                  <span>{profile.email || 'Not provided'}</span>
                </div>

                <div className="info-item">
                  <School size={18} />
                  <span>{profile.college_name || 'Not provided'}</span>
                </div>

                <div className="info-item">
                  <Calendar size={18} />
                  <span>
                    {profile.year
                      ? profile.year === 'graduate'
                        ? 'Graduate'
                        : (() => {
                          const y = parseInt(profile.year, 10);
                          if ([11, 12, 13].includes(y % 100)) return `${y}th Year`;
                          switch (y % 10) {
                            case 1: return `${y}st Year`;
                            case 2: return `${y}nd Year`;
                            case 3: return `${y}rd Year`;
                            default: return `${y}th Year`;
                          }
                        })()
                      : 'Not provided'
                    }

                  </span>
                </div>

                <div className="info-item">
                  <Laugh size={18} />
                  <span>{profile.gender || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Experience Level */}
            <div className="profile-section">
              <h3>Experience Level</h3>
              <div className="experience-badge">
                {profile.is_beginner ? 'Beginner' : 'Experienced'}
              </div>
            </div>

            {/* Social Links */}
            {(profile.linkedin_url || profile.github_url) && (
              <div className="profile-section">
                <h3>Social Links</h3>
                <div className="social-links">
                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <FaLinkedin size={20} />
                      LinkedIn
                    </a>
                  )}
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link"
                    >
                      <FaGithub size={20} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="profile-section">
              <h3>Known Skills</h3>
              <div className="skills-display">
                {knownSkills.length > 0 ? (
                  knownSkills.map((skill, index) => (
                    <SkillTag
                      key={index}
                      skill={skill}
                      removable={false}
                      type="known"
                    />
                  ))
                ) : (
                  <p className="no-skills">No known skills listed</p>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h3>Skills to Learn</h3>
              <div className="skills-display">
                {desiredSkills.length > 0 ? (
                  desiredSkills.map((skill, index) => (
                    <SkillTag
                      key={index}
                      skill={skill}
                      removable={false}
                      type="desired"
                    />
                  ))
                ) : (
                  <p className="no-skills">No desired skills listed</p>
                )}
              </div>
            </div>

            {/* Hackathon Experiences */}
            <div className="profile-section">
              <h3>Hackathon Experiences</h3>
              {hackathonExperiences.length > 0 ? (
                hackathonExperiences.map((experience, index) => (
                  <div key={index} className="experience-card">
                    <div className="experience-header">
                      <FaTrophy className="experience-icon" />
                      <h4>{experience.hackathon_name}</h4>
                    </div>
                    <div className="experience-details">
                      <p><strong>Organizer:</strong> {experience.organizer_name}</p>
                      <p><strong>Achievement:</strong> {experience.achievements}</p>
                      <p><strong>Description:</strong> {experience.description}</p>
                      <p><strong>Date:</strong> {new Date(experience.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-experiences">No hackathon experiences shared</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
