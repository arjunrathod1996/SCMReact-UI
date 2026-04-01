import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../api';
import { FaUserCircle, FaLock, FaPhone } from 'react-icons/fa';

// Types
interface LoginPageProps {
  onLogin: (token: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  // UI State
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLogin, setIsEmailLogin] = useState(true);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [fade, setFade] = useState(true);
  
  const navigate = useNavigate();

  // Handle Animation transitions
  useEffect(() => {
    setFade(true);
  }, [isEmailLogin]);

  const handleSendOtp = async (): Promise<void> => {
    if (!phoneNumber) return setError('Please enter a phone number');
    
    setIsLoading(true);
    setError(null);
    try {
      // Assuming sendOtp returns a success indicator or the OTP (for dev)
      await authAPI.sendOtp(phoneNumber);
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

 const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let response;
      if (isEmailLogin) {
        response = await authAPI.login(email, password);
      } else {
        response = await authAPI.loginWithPhone(phoneNumber, otp);
      }

      if (response?.token) {
        const { token } = response;

        // 1. SAVE TO STORAGE FIRST
        localStorage.setItem('token', token);
        
        // 2. UPDATE GLOBAL STATE 
        // This MUST happen before navigation so the ProtectedRoute 
        // allows the user through.
        await onLogin(token); 
        
        // 3. FETCH PROFILE (Optional but good for data sync)
        await authAPI.getCurrentUser();

        // 4. SMALL DELAY OR CHECK (To prevent race conditions)
        const targetPath = isEmailLogin ? '/dashboard' : '/my_app';
        
        // Use replace: true to prevent the user from clicking "back" 
        // into the login page after logging in.
        navigate(targetPath, { replace: true });
      } 
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
      // If login fails, make sure we don't have a half-saved token
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLoginMethod = (): void => {
    setFade(false);
    setTimeout(() => {
      setIsEmailLogin(!isEmailLogin);
      setIsOtpSent(false);
      setError(null);
      // Reset fields
      setEmail('');
      setPassword('');
      setPhoneNumber('');
      setOtp('');
      setFade(true);
    }, 300);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className={`w-full max-w-md transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white p-8 shadow-xl rounded-2xl border border-gray-100">
          
          <div className="flex flex-col items-center mb-8">
            <FaUserCircle className="text-blue-600 text-6xl mb-2" />
            <h2 className="text-2xl font-bold text-gray-800">
              {isEmailLogin ? 'Welcome Back' : 'Phone Sign-in'}
            </h2>
            <p className="text-gray-500 text-sm">Please enter your details</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {isEmailLogin ? (
              <>
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Email</label>
                  <div className="relative mt-1">
                    <FaUserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Password</label>
                  <div className="relative mt-1">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Phone Number</label>
                  <div className="relative mt-1">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isOtpSent}
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl outline-none transition-all ${
                        isOtpSent ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-gray-50 border-gray-200 focus:ring-2 focus:ring-blue-500 focus:bg-white'
                      }`}
                      placeholder="+1 (555) 000-0000"
                      required
                    />
                  </div>
                </div>

                {isOtpSent && (
                  <div className="relative animate-fade-in">
                    <label className="text-xs font-semibold text-gray-600 uppercase ml-1">Enter OTP</label>
                    <div className="relative mt-1">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        placeholder="6-digit code"
                        required
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                {error}
              </div>
            )}

            {!isEmailLogin && !isOtpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:bg-gray-400"
              >
                {isLoading ? 'Requesting Code...' : 'Send Verification Code'}
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:bg-gray-400"
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <button
              type="button"
              onClick={toggleLoginMethod}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              {isEmailLogin ? 'Use phone number instead' : 'Back to email login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;