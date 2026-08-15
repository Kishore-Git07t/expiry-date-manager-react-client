import React, { useState, useEffect, useCallback } from 'react';
import {
  getProductsApi,
  addProductApi,
  removeProductApi,
} from '../utils/api';

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORIES = ['General', 'Food', 'Beverage', 'Medicine', 'Cosmetics', 'Household', 'Other'];

function daysUntilExpiry(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(dateStr);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
}

function expiryBadge(days) {
  if (days < 0) return { label: 'Expired', cls: 'bg-red-100 text-red-700 border-red-200' };
  if (days === 0) return { label: 'Expires Today', cls: 'bg-orange-100 text-orange-700 border-orange-200' };
  if (days <= 7) return { label: `${days}d left`, cls: 'bg-amber-100 text-amber-700 border-amber-200' };
  if (days <= 30) return { label: `${days}d left`, cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
  return { label: `${days}d left`, cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

const CATEGORY_ICONS = {
  General: '📦',
  Food: '🍎',
  Beverage: '🥤',
  Medicine: '💊',
  Cosmetics: '💄',
  Household: '🏠',
  Other: '🔖',
};

// ── Add Product Modal ──────────────────────────────────────────────────────

function AddProductModal({ onClose, onAdd, loading }) {
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: 'General',
    expiryDate: '',
    quantity: 1,
    notes: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Product name is required.');
    if (!form.expiryDate) return setError('Expiry date is required.');
    try {
      await onAdd(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeInScale_0.2s_ease-out]"
        style={{ animationFillMode: 'both' }}
      >
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">➕</div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Add New Product</h2>
              <p className="text-xs text-slate-500">Track a product's expiry date</p>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Product Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Whole Milk"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="brand" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={form.brand}
                onChange={handleChange}
                placeholder="e.g. Amul"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Expiry Date *
              </label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={form.expiryDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                placeholder="Optional notes…"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="add-product-submit-btn"
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                <>➕ Add Product</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────

function ProductCard({ product, onRemove, removing }) {
  const days = daysUntilExpiry(product.expiryDate);
  const badge = expiryBadge(days);
  const icon = CATEGORY_ICONS[product.category] || '📦';

  return (
    <div
      className={`group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 ${
        days < 0 ? 'border-red-200 bg-red-50/30' : days <= 7 ? 'border-amber-200' : 'border-slate-100'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{product.name}</h3>
          {product.brand && (
            <p className="text-xs text-slate-500 mt-0.5">{product.brand}</p>
          )}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls} shrink-0`}>
          {badge.label}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-400 uppercase text-[10px] mb-0.5">Category</span>
          <span>{product.category}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-400 uppercase text-[10px] mb-0.5">Quantity</span>
          <span>{product.quantity}</span>
        </div>
        <div className="col-span-2 flex flex-col">
          <span className="font-semibold text-slate-400 uppercase text-[10px] mb-0.5">Expires On</span>
          <span className="font-medium text-slate-800">{formatDate(product.expiryDate)}</span>
        </div>
      </div>

      {product.notes && (
        <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-2 line-clamp-2">
          {product.notes}
        </p>
      )}

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product._id)}
        disabled={removing === product._id}
        className="mt-auto flex items-center justify-center gap-1.5 w-full py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-lg transition-colors disabled:opacity-50"
        id={`remove-product-${product._id}`}
      >
        {removing === product._id ? (
          <>
            <span className="w-3 h-3 border border-red-400/40 border-t-red-500 rounded-full animate-spin" />
            Removing…
          </>
        ) : (
          <>🗑 Remove</>
        )}
      </button>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────

function StatCard({ label, value, icon, color }) {
  return (
    <div className={`rounded-2xl p-5 flex items-center gap-4 ${color}`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-xs font-semibold opacity-70 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────

export default function DashboardPage({ user, token, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('expiryDate');
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Fetch products on mount
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setFetchError('');
    try {
      const data = await getProductsApi(token);
      setProducts(data.products || []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (formData) => {
    setAddingProduct(true);
    try {
      const data = await addProductApi(token, formData);
      setProducts((prev) => [...prev, data.product]);
      setShowAddModal(false);
      showToast('✅ Product added successfully!');
    } finally {
      setAddingProduct(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    setRemovingId(productId);
    try {
      await removeProductApi(token, productId);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      showToast('🗑 Product removed.');
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setRemovingId(null);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await onLogout();
  };

  // Derived stats
  const total = products.length;
  const expiredCount = products.filter((p) => daysUntilExpiry(p.expiryDate) < 0).length;
  const expiringSoon = products.filter((p) => { const d = daysUntilExpiry(p.expiryDate); return d >= 0 && d <= 7; }).length;
  const safeCount = total - expiredCount - expiringSoon;

  // Filter + Sort
  const filteredProducts = products
    .filter((p) => filterCategory === 'All' || p.category === filterCategory)
    .sort((a, b) => {
      if (sortBy === 'expiryDate') return new Date(a.expiryDate) - new Date(b.expiryDate);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-[fadeInScale_0.2s_ease-out]">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="ExpiryGuard Logo" className="w-9 h-9 rounded-lg object-contain shadow-xs border border-slate-200" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Expiry<span className="text-primary">Guard</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              id="logout-btn"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200/60 disabled:opacity-60 flex items-center gap-1.5"
            >
              {logoutLoading ? (
                <span className="w-3 h-3 border border-red-400/40 border-t-red-500 rounded-full animate-spin" />
              ) : null}
              Log Out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-blue-600 text-white rounded-2xl px-6 py-5 mb-8 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <h1 className="text-2xl font-extrabold">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
            <p className="text-blue-100 text-sm mt-1">
              You have <strong className="text-white">{total}</strong> product{total !== 1 ? 's' : ''} tracked.
              {expiredCount > 0 && <span className="text-red-200 font-semibold"> {expiredCount} expired!</span>}
            </p>
          </div>
          <button
            id="open-add-product-btn"
            onClick={() => setShowAddModal(true)}
            className="shrink-0 px-5 py-2.5 text-sm font-bold bg-white text-primary hover:bg-blue-50 rounded-xl shadow transition-all hover:scale-105 active:scale-95"
          >
            ➕ Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Products" value={total} icon="📦" color="bg-slate-100 text-slate-800" />
          <StatCard label="Safe" value={safeCount} icon="✅" color="bg-emerald-50 text-emerald-800" />
          <StatCard label="Expiring Soon" value={expiringSoon} icon="⚠️" color="bg-amber-50 text-amber-800" />
          <StatCard label="Expired" value={expiredCount} icon="❌" color="bg-red-50 text-red-800" />
        </div>

        {/* Filter & Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {['All', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase()}`}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  filterCategory === cat
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-primary hover:text-primary'
                }`}
              >
                {cat === 'All' ? '🔹 All' : `${CATEGORY_ICONS[cat]} ${cat}`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold">Sort:</span>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="expiryDate">Expiry Date</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading your products…</p>
          </div>
        ) : fetchError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 text-sm font-semibold mb-3">Failed to load products</p>
            <p className="text-red-500 text-xs mb-4">{fetchError}</p>
            <button onClick={fetchProducts} className="px-4 py-2 text-xs font-bold text-primary border border-primary/40 rounded-lg hover:bg-primary/5 transition-colors">
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-slate-700 font-bold text-lg mb-2">
              {filterCategory === 'All' ? 'No products yet' : `No "${filterCategory}" products`}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {filterCategory === 'All'
                ? 'Start tracking your products by clicking "Add Product".'
                : 'Try a different category filter.'}
            </p>
            {filterCategory === 'All' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-md"
              >
                ➕ Add your first product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onRemove={handleRemoveProduct}
                removing={removingId}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddProduct}
          loading={addingProduct}
        />
      )}
    </div>
  );
}
