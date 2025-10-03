import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">
        SEO Analyzer & Strategy Dashboard
      </h1>
      <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
        Let Gemini agents perform a comprehensive analysis of your page and the competitive landscape to build a winning SEO strategy.
      </p>
    </header>
  );
};

export default Header;