import React from 'react';

export default function DashboardPage({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Dashboard Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-lg object-contain shadow-xs border border-slate-200" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Expiry<span className="text-primary">Guard</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Logged-in User'}</p>
              <p className="text-xs text-slate-500">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200/60"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-md mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-2xl">
              👋
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name || 'User'}!</h1>
              <p className="text-slate-500 text-sm">Authentication successful. Session active.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">User ID</span>
              <span className="text-sm font-mono text-slate-800 break-all">{user?._id || 'N/A'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Email Address</span>
              <span className="text-sm font-medium text-slate-800">{user?.email || 'N/A'}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-xs font-semibold text-slate-400 block uppercase mb-1">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Authenticated (JWT Active)
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
