import React from 'react';
import { Plus } from 'lucide-react';
import SkillTag from './SkillTag';

const SkillInput = ({ 
  label, 
  value, 
  onChange, 
  onAdd, 
  onRemove, 
  skills, 
  placeholder, 
  type = 'known', 
  suggestions = [], 
  required = false 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };

  const handleInputChange = (e) => {
    if (onChange && e && e.target) {
      onChange(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Fill the input with the clicked suggestion (no auto-add)
    const syntheticEvent = {
      target: { value: suggestion }
    };
    onChange(syntheticEvent);
  };

  // FIXED: Convert skill objects to strings for display
  const displaySkills = skills ? skills.map(skill => {
    // Handle both object format {id, name} and string format
    if (typeof skill === 'object' && skill !== null) {
      return skill.name || String(skill);
    }
    return String(skill);
  }) : [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {required && <span className="text-red-500 text-sm">*</span>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Display added skills - FIXED to show strings */}
      {displaySkills && displaySkills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {displaySkills.map((skillName, index) => (
            <SkillTag
              key={`${skillName}-${index}`}
              skill={skillName}
              onRemove={() => onRemove(index)}
              removable={true}
              type={type}
            />
          ))}
        </div>
      )}

      {/* Suggestions */}
      {suggestions && suggestions.length > 0 && value && (
        <div className="mt-2">
          <div className="text-xs text-gray-500 mb-1">Suggestions:</div>
          <div className="flex flex-wrap gap-1">
            {suggestions
              .filter(suggestion => 
                suggestion.toLowerCase().includes(value.toLowerCase()) &&
                !displaySkills.includes(suggestion)
              )
              .slice(0, 5)
              .map((suggestion, index) => (
                <button
                  key={`suggestion-${suggestion}-${index}`}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillInput;
