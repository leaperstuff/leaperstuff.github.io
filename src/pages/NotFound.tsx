
import React from 'react';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="container mx-auto py-16 flex flex-col items-center justify-center animate-fade-in">
        <div className="bg-leaper-50 border border-leaper-100 rounded-full w-24 h-24 flex items-center justify-center mb-8">
          <span className="text-5xl font-bold text-leaper-500">404</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-gray-600 mb-6 text-center">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button 
          className="bg-leaper-500 hover:bg-leaper-600 text-black"
          onClick={() => window.location.href = '/'}
        >
          Go Home
        </Button>
      </div>
    </Layout>
  );
};

export default NotFound;
