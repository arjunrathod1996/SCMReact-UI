import React, { useState, useEffect } from 'react';
import BatteryLoading from './BatteryLoading';

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate a delay to showcase the loading spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <BatteryLoading />;
  }

  return (
    <div 
      className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 lg:ml-100" 
      style={{ marginTop: "60px" }}
    >
      <header className="bg-white shadow w-full py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            CRM and Trade
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CRM Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Customer Relationship Management (CRM)</h2>
            <img 
              src="https://via.placeholder.com/400x200" 
              alt="CRM Illustration" 
              className="rounded-lg mb-4 w-full object-cover" 
            />
            <p className="text-gray-700">
              Manage your customer relationships effectively with our comprehensive CRM system. 
              Track leads, monitor customer interactions, and improve sales performance.
            </p>
          </div>

          {/* Trade Management Section */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Trade Management</h2>
            <img 
              src="https://via.placeholder.com/400x200" 
              alt="Trade Illustration" 
              className="rounded-lg mb-4 w-full object-cover" 
            />
            <p className="text-gray-700">
              Streamline your trading activities with our advanced trade management system. 
              Handle orders, manage portfolios, and analyze market trends efficiently.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white w-full py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;