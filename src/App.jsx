import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddProductPage from './pages/AddProductPage';
import { getStoredAuth, setStoredAuth, clearStoredAuth, logoutApi } from './utils/api';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth.user && auth.token) {
      setCurrentUser(auth.user);
      setAuthToken(auth.token);
      setCurrentView('dashboard');
    }
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleAuthSuccess = (user, token) => {
    setStoredAuth(user, token);
    setCurrentUser(user);
    setAuthToken(token);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      // silently ignore network errors during logout
    } finally {
      clearStoredAuth();
      setCurrentUser(null);
      setAuthToken(null);
      setCurrentView('home');
    }
  };

  return (
    <div>
      {currentView === 'home' && (
        <LandingPage onNavigate={handleNavigate} />
      )}

      {currentView === 'login' && (
        <LoginPage
          onNavigate={handleNavigate}
          onLoginSuccess={handleAuthSuccess}
        />
      )}

      {currentView === 'register' && (
        <RegisterPage
          onNavigate={handleNavigate}
          onRegisterSuccess={handleAuthSuccess}
        />
      )}

      {currentView === 'dashboard' && (
        <DashboardPage user={currentUser} token={authToken} onLogout={handleLogout} onNavigate={handleNavigate} />
      )}

      {currentView === 'addProduct' && (
        <AddProductPage user={currentUser} token={authToken} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;
