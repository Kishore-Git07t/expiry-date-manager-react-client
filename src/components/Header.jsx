import React from 'react';

export default function Header({ onNavigate }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onNavigate && onNavigate('home')}
        >
          <img 
            src="/logo.jpg" 
            alt="Expiry Date Manager Logo" 
            className="w-11 h-11 rounded-xl object-contain shadow-xs border border-slate-200/60"
          />
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Expiry<span className="text-primary">Guard</span>
            </span>
            <span className="block text-xs text-slate-500 font-medium -mt-1">Date Manager</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">How it Works</a>
          <a href="#benefits" className="hover:text-primary transition-colors">Why ExpiryGuard</a>
        </nav>

        {/* CTA Action Buttons */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate && onNavigate('login')}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-primary hover:bg-slate-50 rounded-lg transition-all"
          >
            Log in
          </button>
          <button 
            onClick={() => onNavigate && onNavigate('register')}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-primary-hover active:bg-primary-dark rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            Create Account
          </button>
        </div>
      </div>
    </header>
  );
}
