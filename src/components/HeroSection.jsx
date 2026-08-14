import React from 'react';

export default function HeroSection({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-sky-50/30 to-white pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 text-primary text-xs font-bold uppercase tracking-wider mb-6 shadow-xs border border-sky-200/50">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            Smart Inventory & Expiry Tracker
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Never Waste Food or Products Again. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Track Expiry Dates Effortlessly.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed mb-10 max-w-2xl mx-auto">
            Scan product UPC barcodes using your device camera, get smart alerts before items spoil, and keep your kitchen & pantry perfectly organized.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => onNavigate && onNavigate('register')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-primary hover:bg-primary-hover active:bg-primary-dark rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Get Started Free — Register Now
            </button>
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="w-full sm:w-auto px-8 py-4 text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              Log in to Dashboard
            </button>
          </div>

          {/* Feature Highlights Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left mt-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-xl mb-4">
                📷
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">UPC Camera Scanner</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Scan product barcodes instantly with your smartphone or web camera to auto-fetch details.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary font-bold text-xl mb-4">
                🔔
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Expiry Alerts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Receive proactive notifications before products expire, eliminating waste and saving money.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 font-bold text-xl mb-4">
                📊
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pantry Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Categorize groceries, cosmetics, medications, and household items in a unified dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
