import React from 'react';
import { Users } from 'lucide-react';

const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="p-2 bg-blue-500 rounded-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">
          ByteBrigade Team Builder
        </h1>
      </div>
      
      <p className="text-gray-400 max-w-xl mx-auto mb-4">
        Find your perfect hackathon teammates based on skills and experience
      </p>
      
      <div className="flex items-center justify-center gap-4">
        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
          🚀 AI Matching
        </span>
        <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">
          ⚡ Real-time
        </span>
        <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200">
          🎯 Skill-based
        </span>
      </div>
    </div>
  );
};

export default Header;
