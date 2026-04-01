import React from 'react';
// 1. Import UserProfile to type the prop
import { User } from '../../store';

/** --- 1. Interfaces --- **/

// FIXED: Added Props interface to allow the 'user' prop passed from App.tsx
interface MyAppProps {
  user: User | null;
}

/** --- 2. Component --- **/

const MyApp: React.FC<MyAppProps> = ({ user }) => {
  return (
    <div className="p-3 lg:ml-64 mt-7 relative z-10">
      {/* 2. Meaningful Header */}
      <h1 className="text-2xl font-bold text-gray-400 uppercase mt-8 mb-4">
        Customer Dashboard
      </h1>

      <div className="bg-white p-6 shadow-md rounded-lg">
        {user ? (
          <>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-500 mb-4">
              Here is an overview of your account and recent activities.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {/* Profile Summary Card */}
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <span className="text-xs font-bold text-blue-600 uppercase">Your Profile</span>
                <p className="text-sm mt-2 text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-sm text-gray-600"><strong>City:</strong> {user.city || 'Not provided'}</p>
              </div>

              {/* Account Status Card */}
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                <span className="text-xs font-bold text-green-600 uppercase">Account Status</span>
                <p className="text-sm mt-2 text-gray-600"><strong>Role:</strong> CUSTOMER</p>
                <p className="text-sm text-gray-600"><strong>Status:</strong> Active</p>
              </div>

              {/* Placeholder for actions */}
              <div className="p-4 border border-gray-100 rounded-lg bg-gray-50 flex items-center justify-center">
                <button className="text-sm font-bold text-blue-600 hover:underline">
                  View Order History →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading your personalized dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApp;