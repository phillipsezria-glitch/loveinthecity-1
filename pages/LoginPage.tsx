import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Phone, ArrowRight, AlertCircle } from 'lucide-react';
import { simpleStorage } from '../utils/storageSimple';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!phone.trim()) {
        setError('📱 Please enter your phone number');
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError('🔐 Please enter your password');
        setLoading(false);
        return;
      }

      // Get user profile
      console.log('🔐 Authenticating user:', phone);
      
      const userProfile = simpleStorage.get('userProfile');
      if (!userProfile) {
        setError('❌ Account not found. Please create an account first.');
        setLoading(false);
        console.log('❌ No user profile found in storage');
        return;
      }

      // Check if phone matches
      if (userProfile.phone !== phone) {
        setError('❌ Phone number does not match any account');
        setLoading(false);
        console.log('❌ Phone mismatch:', { attempted: phone, stored: userProfile.phone });
        return;
      }

      // Check if password matches
      if (userProfile.password !== password) {
        setError('❌ Invalid password');
        setLoading(false);
        console.log('❌ Password mismatch for user:', phone);
        return;
      }

      console.log('✅ Credentials verified for:', phone);
      const userSession = {
        id: userProfile.userId,
        phone,
        isAuthenticated: true,
        loginTime: new Date().toISOString(),
        lastActive: Date.now()
      };

      // Store session
      simpleStorage.set('userSession', userSession);
      
      console.log('✅ Login successful for:', phone);
      setLoading(false);
      onLogin();
    } catch (err) {
      console.error('❌ Login error:', err);
      setError('❌ Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-gradient-to-br from-primary to-secondary flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-gray-900">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[10%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute top-[40%] left-[20%] w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>

      <div className="w-full max-w-sm flex flex-col items-center relative z-10">
        
        {/* Brand Logo */}
        <div className="mb-8 flex flex-col items-center animate-fade-in-up">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-glow rotate-3 flex items-center justify-center mb-6">
                <Heart className="text-primary fill-primary" size={40} />
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm text-center">Love in the City</h1>
            <p className="text-white/90 text-lg font-medium mt-2">Where connections happen</p>
        </div>

        {/* Login Form Card */}
        <div className="w-full bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Phone Number</label>
                    <input 
                        type="tel" 
                        placeholder="Enter your phone" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium disabled:opacity-50"
                    />
                </div>
                
                <div>
                    <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Password</label>
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium disabled:opacity-50"
                    />
                </div>

                <div className="flex justify-end">
                    <button 
                      type="button"
                      disabled={loading}
                      className="text-primary text-sm font-bold hover:underline disabled:opacity-50"
                    >
                      Forgot Password?
                    </button>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? '🔄 Signing in...' : 'Start Dating'}
                    {!loading && <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center space-y-4">
            <button 
              type="button"
              onClick={() => {
                console.log('🔵 Create Account button clicked');
                navigate('/signup');
              }}
              className="text-white font-bold text-sm bg-white/20 px-6 py-2 rounded-full hover:bg-white/30 transition backdrop-blur-md">
                Create New Account
            </button>
            
            <div className="flex items-center text-white/80 text-xs space-x-1">
                 <Phone size={12} />
                 <span>Need help? Contact Support</span>
            </div>
        </div>

      </div>
    </div>
  );
};