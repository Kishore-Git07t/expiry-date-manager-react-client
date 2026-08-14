import React from 'react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <img 
              src="/logo.jpg" 
              alt="Expiry Date Manager Logo" 
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5"
            />
            <div>
              <span className="text-lg font-bold text-white tracking-tight">
                Expiry<span className="text-primary">Guard</span>
              </span>
              <p className="text-xs text-slate-500">Smart Expiry Date Management System</p>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <button onClick={() => onNavigate && onNavigate('home')} className="hover:text-white transition-colors">Home</button>
            <button onClick={() => onNavigate && onNavigate('login')} className="hover:text-white transition-colors">Login</button>
            <button onClick={() => onNavigate && onNavigate('register')} className="hover:text-white transition-colors">Register</button>
          </div>

          {/* Copyright Notice */}
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} ExpiryGuard Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
