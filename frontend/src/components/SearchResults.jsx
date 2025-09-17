import React from 'react';
import { Users, Loader, Search, UserPlus } from 'lucide-react';
import ProfileCard from './ProfileCard';
import './HackathonTeamBuilder.css';

const SearchResults = ({ 
  searchResults, 
  allProfiles, 
  hasSearched, 
  onCreateProfile, 
  onViewProfile = null, // Default to null for backward compatibility
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="search-results-loading">
        <Loader className="loading-spinner" size={40} />
        <h3>Searching for teammates...</h3>
        <p>Finding the perfect match for your project</p>
      </div>
    );
  }

  if (hasSearched && searchResults.length === 0) {
    return (
      <div className="search-results-empty">
        <Search size={48} color="#9ca3af" />
        <h3>No teammates found</h3>
        <p>Try adjusting your search criteria or check back later for new profiles.</p>
      </div>
    );
  }

  if (hasSearched && searchResults.length > 0) {
    return (
      <div className="search-results-container">
        <div className="search-results-header">
          <Users size={24} />
          <h3>
            Found {searchResults.length} potential teammate{searchResults.length !== 1 ? 's' : ''} matching your criteria
          </h3>
        </div>
        
        <div className="profiles-grid">
          {searchResults.map((profile, index) => (
            <ProfileCard 
              key={profile.id || index} 
              profile={profile}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-initial">
      <div className="search-instruction">
        
        
        {allProfiles && allProfiles.length > 0 && (
          <>
            <div className="divider">
              <span>Or browse all {allProfiles.length} available profiles:</span>
            </div>
            <div className="profiles-grid">
              {allProfiles.slice(0, 6).map((profile, index) => (
                <ProfileCard 
                  key={profile.id || index} 
                  profile={profile}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
            {allProfiles.length > 6 && (
              <p className="more-profiles-hint">
                And {allProfiles.length - 6} more profiles available...
              </p>
            )}
          </>
        )}
        
        {(!allProfiles || allProfiles.length === 0) && (
          <div className="no-profiles-yet">
            <UserPlus size={32} color="#9ca3af" />
            <p></p>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
