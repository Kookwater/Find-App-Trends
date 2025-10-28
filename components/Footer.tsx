
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="text-center py-6 mt-12 border-t border-gray-700">
      <p className="text-gray-500">
        Powered by <a href="https://ai.google.dev/gemini-api" target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">Gemini API</a> with Google Search Grounding.
      </p>
    </footer>
  );
};

export default Footer;
