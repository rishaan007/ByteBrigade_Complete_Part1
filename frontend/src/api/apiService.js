const API_BASE_URL = "https://byte-brigade.onrender.com/api";


const handleResponse = async (response) => {
  console.log(`API Response Status: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      console.error('Failed to parse error response as JSON:', e);
      errorData = { detail: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    console.error('API Error Response:', errorData);
    
    let errorMessage = '';
    
    if (errorData.username) {
      errorMessage += `Username: ${Array.isArray(errorData.username) ? errorData.username[0] : errorData.username}; `;
    }
    if (errorData.email) {
      errorMessage += `Email: ${Array.isArray(errorData.email) ? errorData.email[0] : errorData.email}; `;
    }
    if (errorData.password) {
      errorMessage += `Password: ${Array.isArray(errorData.password) ? errorData.password[0] : errorData.password}; `;
    }
    if (errorData.error) {
      errorMessage += errorData.error;
    }
    if (errorData.detail) {
      errorMessage += errorData.detail;
    }
    if (errorData.non_field_errors) {
      errorMessage += Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
    }
    
    if (errorData.college) {
      errorMessage += `College: ${Array.isArray(errorData.college) ? errorData.college[0] : errorData.college}; `;
    }
    if (errorData.year) {
      errorMessage += `Year: ${Array.isArray(errorData.year) ? errorData.year[0] : errorData.year}; `;
    }
    
    if (!errorMessage.trim()) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    }
    
    throw new Error(errorMessage.trim());
  }
  
  const data = await response.json();
  console.log('API Success Response:', data);
  return data;
};

const logRequest = (method, url, data = null) => {
  console.log(`API ${method} Request:`, url);
  if (data) {
    console.log('Request Data:', data);
  }
};

const validateHackathonExperiences = (experiences) => {
  if (!Array.isArray(experiences)) {
    console.log('HACKATHON DEBUG - No experiences array provided');
    return [];
  }

  const validExperiences = experiences.filter(exp => {
    const hasOrganizer = exp.organizer_name && exp.organizer_name.trim();
    const hasHackathon = exp.hackathon_name && exp.hackathon_name.trim();
    
    if (!hasOrganizer || !hasHackathon) {
      console.log(`HACKATHON DEBUG - Skipping invalid experience:`, exp);
      return false;
    }
    
    return true;
  });

  console.log(`HACKATHON DEBUG - Validated ${validExperiences.length} out of ${experiences.length} experiences`);
  return validExperiences;
};

const formatYearField = (year) => {
  if (!year) return null;
  
  const yearStr = year.toString().trim();
  if (yearStr === 'graduate') {
    console.log('YEAR DEBUG - Setting year as graduate');
    return 'graduate';
  }
  
  const yearNum = parseInt(yearStr);
  if (!isNaN(yearNum) && yearNum > 0 && yearNum <= 10) {
    console.log(`YEAR DEBUG - Setting year as number: ${yearNum}`);
    return yearNum;
  }
  
  console.log(`YEAR DEBUG - Invalid year value: ${year}, setting to null`);
  return null;
};

const apiService = {
  
  createUser: async (userData) => {
    try {
      console.log('Creating user with data:', userData);
      
      const requestData = {
        username: userData.username,
        password: userData.password,
        name: userData.name,
        email: userData.email
      };
      
      logRequest('POST', `${API_BASE_URL}/users/`, requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const result = await handleResponse(response);
      console.log('User created successfully:', result);
      return result;
      
    } catch (error) {
      console.error(' Error creating user:', error);
      throw error;
    }
  },

  // 🔧 FIXED: Login function to match your backend endpoint
  login: async (credentials) => {
    try {
      console.log(' Logging in user:', credentials.username);
      
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      const result = await handleResponse(response);
      console.log(' Login successful:', result);
      return result;
      
    } catch (error) {
      console.error(' Login error:', error);
      throw error;
    }
  },

  getAllProfiles: async () => {
    try {
      logRequest('GET', `${API_BASE_URL}/users/`);
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await handleResponse(response);
      console.log(`Fetched ${result.length} profiles successfully`);
      return result;
    } catch (error) {
      console.error("Error fetching all profiles:", error.message);
      throw error;
    }
  },

  getProfileById: async (id) => {
    try {
      logRequest('GET', `${API_BASE_URL}/users/${id}/`);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}/`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await handleResponse(response);
      console.log(`Profile for user ${id} fetched successfully:`, result.name);
      return result;
    } catch (error) {
      console.error(`Error fetching profile for user ${id}:`, error.message);
      throw error;
    }
  },

  createProfile: async (profileData) => {
    try {
      console.log('CREATE DEBUG - Raw profile data received:', profileData);
      
      const validatedExperiences = validateHackathonExperiences(profileData.hackathonExperiences || []);
      
      const formattedYear = formatYearField(profileData.year);
      
      const collegeValue = profileData.college ? profileData.college.toString().trim() : '';
      console.log(`CREATE DEBUG - College field: "${collegeValue}"`);
      
      const requestData = {
        username: profileData.email,
        password: 'defaultpass123',
        name: profileData.name,
        email: profileData.email,
        college: collegeValue,
        year: formattedYear,
        gender: profileData.gender || '',
        linkedin: profileData.linkedin ? profileData.linkedin.toString().trim() : '',
        github: profileData.github ? profileData.github.toString().trim() : '',
        isBeginner: Boolean(profileData.isBeginner),
        knownSkills: Array.isArray(profileData.knownSkills) ? profileData.knownSkills : [],
        desiredSkills: Array.isArray(profileData.desiredSkills) ? profileData.desiredSkills : [],
        hackathonExperiences: validatedExperiences
      };
      
      console.log('CREATE DEBUG - Formatted request data:');
      console.log('Basic info:', {
        name: requestData.name,
        email: requestData.email,
        college: requestData.college,
        year: requestData.year,
        gender: requestData.gender
      });
      console.log('Social links:', {
        linkedin: requestData.linkedin,
        github: requestData.github,
        isBeginner: requestData.isBeginner
      });
      console.log('Skills:', {
        knownSkills: requestData.knownSkills,
        desiredSkills: requestData.desiredSkills
      });
      console.log('Hackathon experiences:', requestData.hackathonExperiences);
      
      logRequest('POST', `${API_BASE_URL}/users/`, requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await handleResponse(response);
      console.log(`Profile created successfully for user: ${result.name} (ID: ${result.id})`);
      console.log('Created profile data:', result);
      
      if (result.hackathon_experiences) {
        console.log(`SUCCESS - ${result.hackathon_experiences.length} hackathon experiences created`);
      } else {
        console.warn('WARNING - No hackathon_experiences field in response');
      }
      
      return result;
    } catch (error) {
      console.error("Error creating profile:", error.message);
      throw error;
    }
  },

  updateUserProfile: async (userId, profileData) => {
    try {
      console.log(`UPDATE DEBUG - Updating user ${userId} with data:`, profileData);
      
      const validatedExperiences = validateHackathonExperiences(profileData.hackathonExperiences || []);
      
      const formattedYear = formatYearField(profileData.year);
      
      const collegeValue = profileData.college ? profileData.college.toString().trim() : '';
      console.log(`UPDATE DEBUG - College field: "${collegeValue}"`);
      
      const requestData = {
        name: profileData.name,
        email: profileData.email,
        gender: profileData.gender || '',
        college: collegeValue,
        year: formattedYear,
        linkedin: profileData.linkedin ? profileData.linkedin.toString().trim() : '',
        github: profileData.github ? profileData.github.toString().trim() : '',
        isBeginner: Boolean(profileData.isBeginner),
        knownSkills: Array.isArray(profileData.knownSkills) ? profileData.knownSkills : [],
        desiredSkills: Array.isArray(profileData.desiredSkills) ? profileData.desiredSkills : [],
        hackathonExperiences: validatedExperiences
      };
      
      console.log('UPDATE DEBUG - Request data (no username/password):', requestData);
      console.log('College field being sent:', requestData.college);
      console.log('Hackathon experiences being sent:', requestData.hackathonExperiences);
      
      logRequest('PATCH', `${API_BASE_URL}/users/${userId}/`, requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await handleResponse(response);
      console.log(`Profile updated successfully for user: ${result.name} (ID: ${userId})`);
      console.log('Updated profile data:', result);
      console.log('Updated college name:', result.college_name);
      
      if (result.hackathon_experiences) {
        console.log(`SUCCESS - ${result.hackathon_experiences.length} hackathon experiences updated`);
      } else {
        console.warn('WARNING - No hackathon_experiences field in response');
      }
      
      return result;
    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error.message);
      throw error;
    }
  },

  updateProfileSkills: async (id, skillsUpdate) => {
    try {
      const requestData = {
        knownSkills: Array.isArray(skillsUpdate.knownSkills) ? skillsUpdate.knownSkills : [],
        desiredSkills: Array.isArray(skillsUpdate.desiredSkills) ? skillsUpdate.desiredSkills : []
      };
      
      logRequest('PUT', `${API_BASE_URL}/users/${id}/skills/`, requestData);
      
      const response = await fetch(`${API_BASE_URL}/users/${id}/skills/`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      const result = await handleResponse(response);
      console.log(`Skills updated successfully for user ID: ${id}`);
      return result;
    } catch (error) {
      console.error(`Error updating skills for user ${id}:`, error.message);
      throw error;
    }
  },

  
searchProfiles: async (criteria) => {
  try {
    const params = new URLSearchParams();
    
    if (criteria.requiredSkills && Array.isArray(criteria.requiredSkills) && criteria.requiredSkills.length > 0) {
      params.append('skills', criteria.requiredSkills.join(','));
    }
    
    if (criteria.teamSize && criteria.teamSize.toString().trim()) {
      params.append('team_size', criteria.teamSize.toString());
    }
    
    if (criteria.includeBeginner !== undefined) {
      params.append('include_beginner', criteria.includeBeginner.toString());
    }
    
    const queryString = params.toString();
    
    const searchUrl = `${API_BASE_URL}/search/${queryString ? '?' + queryString : ''}`;
    
    logRequest('GET', searchUrl);
    
    const response = await fetch(searchUrl, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const result = await handleResponse(response);
    console.log(`Search completed: ${result.length} profiles found`);
    
    if (result.length > 0) {
      const experiencedCount = result.filter(profile => 
        profile.hackathon_experiences && profile.hackathon_experiences.length > 0
      ).length;
      console.log(`Search Results: ${result.length} total, ${experiencedCount} with hackathon experience`);
      
      const withCollegeCount = result.filter(profile => 
        profile.college_name && profile.college_name.trim()
      ).length;
      console.log(`College Info: ${withCollegeCount} profiles have college information`);
    }
    
    return result;
  } catch (error) {
    console.error("Error searching profiles:", error.message);
    throw error;
  }
},


  getUsersBySkill: async (skillName) => {
    try {
      const params = new URLSearchParams();
      params.append('skill', skillName);
      
      const skillSearchUrl = `${API_BASE_URL}/users/by-skill/?${params.toString()}`;
      
      logRequest('GET', skillSearchUrl);
      
      const response = await fetch(skillSearchUrl, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await handleResponse(response);
      console.log(`Found ${result.length} users with skill: ${skillName}`);
      return result;
    } catch (error) {
      console.error(`Error getting users by skill ${skillName}:`, error.message);
      throw error;
    }
  },

  deleteProfile: async (userId) => {
    try {
      logRequest('DELETE', `${API_BASE_URL}/users/${userId}/`);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
        method: 'DELETE',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 204) {
        console.log(`Profile deleted successfully for user ID: ${userId}`);
        return { success: true, message: 'Profile deleted successfully' };
      }
      
      await handleResponse(response);
    } catch (error) {
      console.error(`Error deleting profile for user ${userId}:`, error.message);
      throw error;
    }
  },

  getAllSkills: async () => {
    try {
      logRequest('GET', `${API_BASE_URL}/skills/`);
      
      const response = await fetch(`${API_BASE_URL}/skills/`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await handleResponse(response);
      console.log(`Fetched ${result.length} skills from database`);
      return result;
    } catch (error) {
      console.error("Error fetching skills:", error.message);
      throw error;
    }
  },

  healthCheck: async () => {
    try {
      logRequest('GET', `${API_BASE_URL}/health/`);
      
      const response = await fetch(`${API_BASE_URL}/health/`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      const result = await handleResponse(response);
      console.log('API Health Check: OK');
      return result;
    } catch (error) {
      console.error("API Health Check failed:", error.message);
      throw error;
    }
  },

  formatProfileForDisplay: (profileData) => {
    if (!profileData) return null;
    
    const formatted = {
      ...profileData,
      formattedSkills: {
        known: (profileData.known_skills || []).map(skill => 
          typeof skill === 'object' ? skill.name : skill
        ),
        desired: (profileData.desired_skills || []).map(skill => 
          typeof skill === 'object' ? skill.name : skill
        )
      },
      experienceCount: (profileData.hackathon_experiences || []).length,
      isExperienced: (profileData.hackathon_experiences || []).length > 0,
      hasCollegeInfo: !!(profileData.college_name && profileData.college_name.trim())
    };
    
    console.log(`DISPLAY FORMAT - Profile ${profileData.id}: ${formatted.experienceCount} experiences, college: ${formatted.hasCollegeInfo}`);
    return formatted;
  },

  validateProfileData: (profileData) => {
    console.log('VALIDATION DEBUG - Checking profile data:', profileData);
    
    const issues = [];
    
    if (!profileData.name || !profileData.name.trim()) {
      issues.push('Name is required');
    }
    
    if (!profileData.email || !profileData.email.trim()) {
      issues.push('Email is required');
    }
    
    if (!Array.isArray(profileData.knownSkills) || profileData.knownSkills.length === 0) {
      issues.push('At least one known skill is required');
    }
    
    if (profileData.hackathonExperiences) {
      const validExperiences = validateHackathonExperiences(profileData.hackathonExperiences);
      if (validExperiences.length !== profileData.hackathonExperiences.length) {
        issues.push(`${profileData.hackathonExperiences.length - validExperiences.length} invalid hackathon experiences will be skipped`);
      }
    }
    
    if (issues.length > 0) {
      console.warn('VALIDATION ISSUES:', issues);
    } else {
      console.log('VALIDATION PASSED - Profile data is valid');
    }
    
    return issues;
  }
};

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    window.apiService = apiService;
    console.log('apiService is available in window.apiService for debugging');
  }
}

export default apiService;
