
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-6 border-t border-gray-100">
      <div className="container flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-gray-500 mb-4 md:mb-0">
          © 2025 LeaperStuff - All rights reserved
        </p>
        <div className="flex gap-6 items-center">
          <a 
            href="https://ko-fi.com/ivaansrivastavadev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-leaper-500 transition-colors flex items-center gap-2"
          >
            <span className="bg-leaper-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs font-bold">K</span>
            Support on Ko-fi
          </a>
          <a 
            href="https://youtube.com/@curiousaboutlife" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-gray-600 hover:text-leaper-500 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Channel
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
