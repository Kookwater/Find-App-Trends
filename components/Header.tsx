
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8 md:py-12">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">
        App Trend Finder
      </h1>
      <p className="mt-4 text-lg text-gray-400">
        Discover your next big app idea, powered by Gemini.
      </p>
    </header>
  );
};

export default Header;
