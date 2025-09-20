import React from 'react';
import Chatbot from './Chatbot';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main content area */}
      <div className="flex-1 mr-80">
        {children}
      </div>

      {/* Chatbot - always visible */}
      <Chatbot />
    </div>
  );
};

export default MainLayout;