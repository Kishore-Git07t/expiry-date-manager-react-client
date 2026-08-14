import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import { getStoredAuth, clearStoredAuth } from './utils/api';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth.user && auth.token) {
      setCurrentUser(auth.user);
    }
  }, []);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleAuthSuccess = (user, token) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
    setCurrentView('home');
  };

  return (
    <div>
      {currentView === 'home' && (
        currentUser ? (
          <DashboardPage user={currentUser} onLogout={handleLogout} />
        ) : (
          <LandingPage onNavigate={handleNavigate} />
        )
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
        <DashboardPage user={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
