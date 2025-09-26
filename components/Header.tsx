
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">NATPAC Travel Diary</h1>
            <span className="hidden sm:block text-sm font-medium text-slate-500">For a better tomorrow</span>
        </div>
      </div>
    </header>
  );
};
