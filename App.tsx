import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { CommunityPage } from './pages/CommunityPage';
import { ChoosePage } from './pages/ChoosePage';
import { HotelPage } from './pages/HotelPage';
import { MinePage } from './pages/MinePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { LoginPage } from './pages/LoginPage';
import { VipPage } from './pages/VipPage';
import { MessagesPage } from './pages/MessagesPage';
import { SignupPage } from './pages/SignupPage';
import { simpleStorage } from './utils/storageSimple';

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Layout component to handle conditional rendering of BottomNav
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  // Hide nav on login, signup, and detailed user profile pages
  const hideNavPaths = ['/login', '/signup', '/vip', '/messages'];
  const isUserProfile = location.pathname.startsWith('/user/');
  const showNav = !hideNavPaths.includes(location.pathname) && !isUserProfile;

  React.useEffect(() => {
    console.log('🟣 LAYOUT UPDATE - Current path:', location.pathname);
    console.log('   showNav:', showNav);
    console.log('   hideNavPaths:', hideNavPaths);
    console.log('   isUserProfile:', isUserProfile);
  }, [location.pathname, showNav]);

  return (
    <div className="flex flex-col h-full w-full max-w-md mx-auto bg-gray-50 shadow-2xl overflow-hidden relative font-sans">
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide relative bg-gray-50">
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // START AS FALSE - require explicit login

  return (
    <HashRouter>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </HashRouter>
  );
}

function AppContent({ isAuthenticated, setIsAuthenticated }: { isAuthenticated: boolean; setIsAuthenticated: (val: boolean) => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mounted, setMounted] = React.useState(false);

  // Check authentication using simple storage
  useEffect(() => {
    console.log('🔴 ========== INITIAL AUTH CHECK (on mount) ==========');
    try {
      const userSession = simpleStorage.get('userSession');
      console.log('Step 1️⃣ Retrieved userSession:', userSession);
      
      if (userSession && userSession.isAuthenticated) {
        console.log('Step 2️⃣ ✅ Valid session found, setting authenticated = true');
        setIsAuthenticated(true);
      } else {
        console.log('Step 2️⃣ ⛔ No valid session, keeping authenticated = false');
      }
      console.log('Step 3️⃣ Setting mounted = true');
      setMounted(true);
      console.log('🟢 ========== INITIAL AUTH CHECK COMPLETE ==========');
    } catch (error) {
      console.error('🔴 Auth check error:', error);
      setMounted(true);
    }
  }, [setIsAuthenticated]);

  // CRITICAL: Watch for authentication changes and navigate
  // Only run AFTER initial mount to avoid redirecting on page load
  useEffect(() => {
    console.log('🟡 ========== REDIRECT CHECK EFFECT ==========');
    console.log('   mounted:', mounted);
    console.log('   isAuthenticated:', isAuthenticated);
    console.log('   location.pathname:', location.pathname);
    
    if (!mounted) {
      console.log('⏳ Still initializing (mounted=false), skip redirect logic');
      console.log('🟢 ========== REDIRECT CHECK COMPLETE ==========');
      return;
    }

    // If user IS authenticated and on signup/login pages, go to home
    if (isAuthenticated) {
      const publicPaths = ['/login', '/signup'];
      const isPublicPath = publicPaths.includes(location.pathname);
      if (isPublicPath) {
        console.log('✅ User authenticated on public page, navigating to /home');
        navigate('/home', { replace: true });
      } else {
        console.log('✅ User is authenticated, allowing page navigation');
      }
    } else {
      // If user is NOT authenticated, redirect to signup (except on public pages)
      const publicPaths = ['/login', '/signup'];
      const isPublicPath = publicPaths.includes(location.pathname);
      
      console.log('   publicPaths:', publicPaths);
      console.log('   isPublicPath:', isPublicPath);
      
      if (!isPublicPath) {
        console.log('🔴 Not authenticated and not on public path - navigating to /signup');
        navigate('/signup', { replace: true });
      } else {
        console.log('✅ Not authenticated but on public path, allowing access');
      }
    }
    console.log('🟢 ========== REDIRECT CHECK COMPLETE ==========');
  }, [isAuthenticated, navigate, mounted, location.pathname]);

  const handleLogin = () => {
    console.log('🔴 ========== HANDLE LOGIN CALLED ==========');
    console.log('🔐 LOGIN INITIATED');
    
    // Create session
    const userSession = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      isAuthenticated: true,
      loginTime: new Date().toISOString()
    };
    console.log('Step 1️⃣ Creating session object:', userSession);
    
    const saveSession = simpleStorage.set('userSession', userSession);
    console.log('Step 2️⃣ Session saved to storage:', saveSession);
    
    const saveToken = simpleStorage.set('funloves_token', 'mock_jwt_token_' + Date.now());
    console.log('Step 3️⃣ Token saved to storage:', saveToken);
    
    console.log('Step 4️⃣ Calling setIsAuthenticated(true)');
    // Update auth state
    setIsAuthenticated(true);
    
    console.log('✅ LOGIN COMPLETE - state updated to authenticated');
    console.log('🟢 ========== HANDLE LOGIN FINISHED ==========');
  };

  const handleLogout = () => {
    console.log('🚀 LOGOUT INITIATED');
    console.log('Step 1️⃣ Removing userSession...');
    simpleStorage.remove('userSession');
    console.log('Step 2️⃣ Removing funloves_token...');
    simpleStorage.remove('funloves_token');
    console.log('Step 3️⃣ Setting isAuthenticated to false...');
    setIsAuthenticated(false);
    console.log('✅ LOGOUT COMPLETE');
  };

  return (
    <Layout>
      <Routes>
        {/* Public routes - no auth required, must be BEFORE private routes */}
        <Route path="/signup" element={<SignupPage onSignup={handleLogin} />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage onLogin={handleLogin} />
        } />
        
        {/* Protected routes - require authentication */}
        <Route path="/home" element={
          isAuthenticated ? <HomePage /> : <Navigate to="/signup" replace />
        } />
        
        <Route path="/" element={
          <Navigate to={isAuthenticated ? "/home" : "/signup"} replace />
        } />
        
        <Route path="/community" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <CommunityPage />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />
        
        <Route path="/choose" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <ChoosePage />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />
        
        <Route path="/hotel" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <HotelPage />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />
        
        <Route path="/mine" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <MinePage onLogout={handleLogout} />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />

        <Route path="/vip" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <VipPage />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />
        
        <Route path="/messages" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <MessagesPage />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />

        <Route path="/user/:id" element={
          isAuthenticated ? (
            <Suspense fallback={<LoadingFallback />}>
              <UserProfilePage />
            </Suspense>
          ) : <Navigate to="/signup" replace />
        } />
        
        {/* Catch all redirect - must be LAST */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </Layout>
  );
}