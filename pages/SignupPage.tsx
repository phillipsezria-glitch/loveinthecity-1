import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Phone } from 'lucide-react';
import { simpleStorage } from '../utils/storageSimple';
import { StorageManager } from '../utils/localStorage';

interface SignupFormData {
  name: string;
  age: string;
  phone: string;
  city: string;
  state: string;
  password: string;
}

interface SignupPageProps {
  onSignup?: () => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    age: '',
    phone: '',
    city: '',
    state: '',
    password: ''
  });
  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string>('');

  // DEBUG: Log when component mounts and unmounts
  React.useEffect(() => {
    console.log('✅ SignupPage mounted');
    return () => {
      console.log('❌ SignupPage unmounted');
    };
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Partial<SignupFormData> = {};

    console.log('🔍 Validating form data:', formData);

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      console.log('❌ Name validation failed');
    }

    if (!formData.age.trim()) {
      newErrors.age = 'Age is required';
      console.log('❌ Age validation failed - empty');
    } else if (isNaN(parseInt(formData.age)) || parseInt(formData.age) < 18 || parseInt(formData.age) > 120) {
      newErrors.age = 'Age must be between 18 and 120';
      console.log('❌ Age validation failed - not valid number:', formData.age);
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      console.log('❌ Phone validation failed - empty');
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Phone number must have at least 10 digits';
      console.log('❌ Phone validation failed - too short:', formData.phone);
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      console.log('❌ City validation failed');
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
      console.log('❌ State validation failed');
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      console.log('❌ Password validation failed - empty');
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
      console.log('❌ Password validation failed - too short');
    }

    console.log('🔍 Validation errors found:', Object.keys(newErrors).length);
    if (Object.keys(newErrors).length > 0) {
      console.log('📋 Errors:', newErrors);
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('🔍 Form is valid:', isValid);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof SignupFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔴 ========== SIGNUP HANDLER CALLED ==========');
    console.log('🔍 Form data before validation:', formData);

    if (!validateForm()) {
      console.log('❌ Validation failed - stopping signup');
      return;
    }

    console.log('✅ Validation passed - starting signup process');
    setIsLoading(true);
    console.log('⏳ Set isLoading to true');

    try {
      console.log('Step 1️⃣ Starting signup...');
      
      // NO DELAY - respond immediately for better UX
      console.log('Step 2️⃣ Creating user data object...');

      // Store user data
      const userData = {
        name: formData.name,
        age: parseInt(formData.age),
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        password: formData.password,
        userId: `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        signedUpAt: new Date().toISOString()
      };
      console.log('Step 3️⃣ User data object created:', userData);

      // Save to simpleStorage (for backwards compatibility)
      console.log('Step 4️⃣ Saving userProfile to simpleStorage...');
      const savedProfile = simpleStorage.set('userProfile', userData);
      console.log('   Result:', savedProfile);
      
      // Also save to StorageManager for consistency across app
      console.log('Step 4️⃣b Saving to StorageManager...');
      const storageManager = StorageManager.getInstance();
      storageManager.set('userProfile', {
        id: userData.userId,
        name: userData.name,
        phone: userData.phone,
        password: userData.password,
        city: userData.city,
        state: userData.state,
        createdAt: userData.signedUpAt,
        lastLogin: userData.signedUpAt,
        preferences: {
          ageRange: [18, 50],
          location: userData.city,
          interests: []
        },
        supportMetadata: {
          sessionCount: 1,
          totalVisits: 1,
          referralSource: 'signup'
        }
      });
      console.log('   StorageManager saved ✓');
      
      console.log('Step 5️⃣ Saving funloves_token to storage...');
      const savedToken = simpleStorage.set('funloves_token', 'mock_jwt_token_' + Date.now());
      console.log('   Result:', savedToken);
      
      // Save customer support data (signup details)
      const supportData = {
        userId: userData.userId,
        name: userData.name,
        phone: userData.phone,
        email: 'support@loveinthecity.com',
        city: userData.city,
        state: userData.state,
        age: userData.age,
        signupDate: userData.signedUpAt,
        accountStatus: 'active',
        lastActivity: new Date().toISOString()
      };
      console.log('Step 6️⃣ Support data object created:', supportData);
      
      console.log('Step 7️⃣ Saving customerSupportData to storage...');
      const savedSupport = simpleStorage.set('customerSupportData', supportData);
      console.log('   Result:', savedSupport);

      console.log('Step 8️⃣ All data saved successfully');
      console.log('✅ User registered:', userData.name, '(ID:', userData.userId + ')');
      
      // Verify data was saved
      console.log('Step 9️⃣ Verifying stored data...');
      const verifyProfile = simpleStorage.get('userProfile');
      console.log('   Retrieved userProfile:', verifyProfile);
      const verifyToken = simpleStorage.get('funloves_token');
      console.log('   Retrieved funloves_token:', verifyToken);
      
      console.log('Step 🔟 Checking onSignup callback...');
      console.log('   onSignup defined?:', !!onSignup);
      console.log('   onSignup type:', typeof onSignup);
      
      // Automatically log in the user (proceed to home page)
      if (onSignup) {
        console.log('Step 1️⃣1️⃣ 🎉 CALLING onSignup - proceeding to home page');
        console.log('   Callback:', onSignup.toString());
        onSignup();
        console.log('Step 1️⃣2️⃣ onSignup callback executed');
        
        // Navigate to home after a brief delay to ensure state updates
        console.log('Step 1️⃣3️⃣ Scheduling navigation to /home');
        setTimeout(() => {
          console.log('⏰ Executing delayed navigation to /home');
          navigate('/home', { replace: true });
        }, 100);
      } else {
        console.log('Step 1️⃣1️⃣ ⚠️ No onSignup callback - using navigate fallback');
        navigate('/home', { replace: true });
      }
      console.log('🟢 ========== SIGNUP COMPLETE ==========');
    } catch (error) {
      console.log('🔴 ========== SIGNUP ERROR ==========');
      const errorMessage = error instanceof Error ? error.message : 'Signup failed. Please try again.';
      console.error('❌ Signup error:', error);
      console.error('💥 Error message:', errorMessage);
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      setGlobalError(errorMessage);
      setErrors({ name: errorMessage });
    } finally {
      console.log('Finally: Setting isLoading to false');
      setIsLoading(false);
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
            <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-sm text-center">Find Love Now</h1>
            <p className="text-white/90 text-lg font-medium mt-2">Create your account</p>
        </div>

        {/* Signup Form Card */}
        <form onSubmit={handleSignup} className="w-full bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., John Smith"
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium ${
                errors.name
                  ? 'border-red-400 focus:border-red-500 focus:bg-red-50'
                  : 'border-gray-100 focus:border-primary focus:bg-white'
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-3">{errors.name}</p>
            )}
          </div>

          {/* Age Input */}
          <div>
            <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="e.g., 25"
              min="18"
              max="120"
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium ${
                errors.age
                  ? 'border-red-400 focus:border-red-500 focus:bg-red-50'
                  : 'border-gray-100 focus:border-primary focus:bg-white'
              }`}
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-3">{errors.age}</p>
            )}
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g., (555) 123-4567"
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium ${
                errors.phone
                  ? 'border-red-400 focus:border-red-500 focus:bg-red-50'
                  : 'border-gray-100 focus:border-primary focus:bg-white'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-3">{errors.phone}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a password"
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium ${
                errors.password
                  ? 'border-red-400 focus:border-red-500 focus:bg-red-50'
                  : 'border-gray-100 focus:border-primary focus:bg-white'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-3">{errors.password}</p>
            )}
          </div>

          {/* City Input */}
          <div>
            <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., New York"
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium ${
                errors.city
                  ? 'border-red-400 focus:border-red-500 focus:bg-red-50'
                  : 'border-gray-100 focus:border-primary focus:bg-white'
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-3">{errors.city}</p>
            )}
          </div>

          {/* State Input */}
          <div>
            <label className="block text-gray-500 text-xs font-bold ml-3 mb-1 uppercase">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="e.g., California"
              className={`w-full bg-gray-50 border-2 rounded-2xl py-4 px-5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all font-medium ${
                errors.state
                  ? 'border-red-400 focus:border-red-500 focus:bg-red-50'
                  : 'border-gray-100 focus:border-primary focus:bg-white'
              }`}
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-3">{errors.state}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                Create Now
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Global Error Display */}
          {globalError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-4">
              <p className="text-red-700 text-sm font-medium">{globalError}</p>
            </div>
          )}

          {/* Terms */}
          <p className="text-gray-500 text-xs text-center leading-relaxed mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy. We keep your data secure and use it only for customer support.
          </p>
        </form>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col items-center space-y-4">
            <button type="button" onClick={() => navigate('/login')} className="text-white font-bold text-sm bg-white/20 px-6 py-2 rounded-full hover:bg-white/30 transition backdrop-blur-md">
                Already have account? Login
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
