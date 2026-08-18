import React, { useState, useEffect, useCallback } from 'react';
import {
  searchProductsApi,
  addProductApi,
  updateProductApi,
  removeProductApi,
} from '../utils/api';

// ── Helpers ────────────────────────────────────────────────────────────────

const CATEGORIES = ['General', 'Food', 'Beverage', 'Medicine', 'Cosmetics', 'Household', 'Other'];
const EXPIRY_FILTERS = [
  { label: 'Any time', value: '' },
  { label: 'Within 7 Days', value: '7' },
  { label: 'Within 30 Days', value: '30' },
  { label: 'Within 90 Days', value: '90' },
];

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

// ── Product Modal (Add/Edit) ───────────────────────────────────────────────

function ProductModal({ onClose, onSave, loading, initialData = null }) {
  const isEdit = !!initialData;
  const [form, setForm] = useState(
    initialData || {
      name: '',
      upcCode: '',
      brand: '',
      category: 'General',
      expiryDate: '',
      quantity: 1,
      notes: '',
    }
  );
  const [error, setError] = useState('');

  // Format date for input type="date" if initialData exists
  useEffect(() => {
    if (initialData && initialData.expiryDate) {
      const dateObj = new Date(initialData.expiryDate);
      if (!isNaN(dateObj)) {
        setForm(prev => ({
          ...prev,
          expiryDate: dateObj.toISOString().split('T')[0]
        }));
      }
    }
  }, [initialData]);

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
      await onSave(form);
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
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">
              {isEdit ? '✏️' : '➕'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="text-xs text-slate-500">Track a product's expiry date</p>
            </div>
          </div>
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-lg"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
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

            <div className="sm:col-span-2">
              <label htmlFor="upcCode" className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                UPC Barcode (Optional)
              </label>
              <input
                id="upcCode"
                name="upcCode"
                type="text"
                value={form.upcCode || ''}
                onChange={handleChange}
                placeholder="e.g. 012345678905"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
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

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              id="product-submit-btn"
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEdit ? 'Saving…' : 'Adding…'}
                </>
              ) : (
                <>{isEdit ? '💾 Save Changes' : '➕ Add Product'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Product Card ─────────────────────────────────────────────────────────

function ProductCard({ product, onEdit, onRemove, actionId }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const days = daysUntilExpiry(product.expiryDate);
  const badge = expiryBadge(days);
  const icon = CATEGORY_ICONS[product.category] || '📦';
  const isRemoving = actionId === `remove-${product._id}`;

  return (
    <div
      className={`group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col gap-3 ${
        days < 0 ? 'border-red-200 bg-red-50/30' : days <= 7 ? 'border-amber-200' : 'border-slate-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{product.name}</h3>
          {product.brand && (
            <p className="text-xs text-slate-500 mt-0.5 truncate">{product.brand}</p>
          )}
          {product.upcCode && (
            <p className="text-[10px] text-slate-400 font-mono mt-1">UPC: {product.upcCode}</p>
          )}
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.cls} shrink-0`}>
          {badge.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mt-2">
        <div className="flex flex-col">
          <span className="font-semibold text-slate-400 uppercase text-[10px] mb-0.5">Category</span>
          <span>{product.category}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-slate-400 uppercase text-[10px] mb-0.5">Quantity</span>
          <span>{product.quantity}</span>
        </div>
        <div className="col-span-2 flex flex-col mt-1">
          <span className="font-semibold text-slate-400 uppercase text-[10px] mb-0.5">Expires On</span>
          <span className="font-medium text-slate-800">{formatDate(product.expiryDate)}</span>
        </div>
      </div>

      {product.notes && (
        <p className="text-xs text-slate-500 italic border-t border-slate-100 pt-2 line-clamp-2 mt-1">
          {product.notes}
        </p>
      )}

      {/* Action Buttons */}
      {showConfirmDelete ? (
        <div className="mt-auto pt-3 border-t border-slate-50">
          <p className="text-xs text-center text-slate-600 mb-2 font-medium">Are you sure you want to delete this?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmDelete(false)}
              disabled={isRemoving}
              className="flex-1 flex items-center justify-center py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setShowConfirmDelete(false);
                onRemove(product._id);
              }}
              disabled={isRemoving}
              className="flex-1 flex items-center justify-center py-2 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 border border-red-600 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRemoving ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex gap-2 pt-3 border-t border-slate-50">
          <button
            onClick={() => onEdit(product)}
            disabled={!!actionId}
            className="flex-1 flex items-center justify-center py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200/60 rounded-lg transition-colors disabled:opacity-50"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={!!actionId}
            className="flex-1 flex items-center justify-center py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/60 rounded-lg transition-colors disabled:opacity-50"
          >
            {isRemoving ? 'Removing…' : '🗑 Remove'}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────

export default function DashboardPage({ user, token, onLogout, onNavigate }) {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, totalProducts: 0, totalPages: 1 });
  
  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterExpiry, setFilterExpiry] = useState('');
  
  // UI State
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionId, setActionId] = useState(null); // tracking remove/edit action
  
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const fetchProducts = useCallback(async (page = 1) => {
    setLoadingProducts(true);
    setFetchError('');
    try {
      const params = { page, limit: 20 };
      if (searchQuery.trim()) params.q = searchQuery;
      // We could also check if searchQuery is numeric to pass it as upcCode, 
      // but backend handles general text search and we can let users type UPC in 'q' 
      // or we can detect it. For now, let's pass it as 'q' mostly, but if it looks like UPC, maybe send it.
      // Actually backend text search does not include UPC by default unless indexed.
      // If it's purely digits, we might pass it as upcCode.
      if (searchQuery.trim() && /^\d+$/.test(searchQuery.trim())) {
        params.upcCode = searchQuery.trim();
        delete params.q; // search by UPC
      }
      
      if (filterCategory && filterCategory !== 'All') params.category = filterCategory;
      if (filterExpiry) params.expiryWithin = filterExpiry;

      const data = await searchProductsApi(token, params);
      setProducts(data.products || []);
      setPagination(data.pagination || { page: 1, limit: 20, totalProducts: 0, totalPages: 1 });
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoadingProducts(false);
    }
  }, [token, searchQuery, filterCategory, filterExpiry]);

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchProducts(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterCategory, filterExpiry, fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage);
    }
  };

  const handleSaveProduct = async (formData) => {
    setActionLoading(true);
    try {
      if (editingProduct) {
        await updateProductApi(token, editingProduct._id, formData);
        showToast('✅ Product updated successfully!');
      } else {
        await addProductApi(token, formData);
        showToast('✅ Product added successfully!');
      }
      setShowModal(false);
      setEditingProduct(null);
      // Refresh current page
      fetchProducts(pagination.page);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveProduct = async (productId) => {
    setActionId(`remove-${productId}`);
    try {
      await removeProductApi(token, productId);
      showToast('🗑 Product removed.');
      fetchProducts(pagination.page);
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setActionId(null);
    }
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    await onLogout();
  };

  // Stats for current loaded view (we use total from pagination for total)
  const total = pagination.totalProducts || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg animate-[fadeInScale_0.2s_ease-out]">
          {toastMsg}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
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
              You have <strong className="text-white">{total}</strong> product{total !== 1 ? 's' : ''} tracked matching your criteria.
            </p>
          </div>
          <button
            id="open-add-product-btn"
            onClick={() => onNavigate('addProduct')}
            className="shrink-0 px-5 py-2.5 text-sm font-bold bg-white text-primary hover:bg-blue-50 rounded-xl shadow transition-all hover:scale-105 active:scale-95"
          >
            ➕ Add Product
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1 w-full max-w-md relative">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Search by product name or UPC code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Expires:</span>
              <select
                value={filterExpiry}
                onChange={(e) => setFilterExpiry(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              >
                {EXPIRY_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-slate-500 text-sm">Loading products…</p>
          </div>
        ) : fetchError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 text-sm font-semibold mb-3">Failed to load products</p>
            <p className="text-red-500 text-xs mb-4">{fetchError}</p>
            <button onClick={() => fetchProducts(pagination.page)} className="px-4 py-2 text-xs font-bold text-primary border border-primary/40 rounded-lg hover:bg-primary/5 transition-colors">
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-slate-700 font-bold text-lg mb-2">No products found</h3>
            <p className="text-slate-400 text-sm mb-6">
              Try adjusting your search or filters, or add a new product.
            </p>
            <button
              onClick={() => onNavigate('addProduct')}
              className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors shadow-md"
            >
              ➕ Add your first product
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setShowModal(true);
                  }}
                  onRemove={handleRemoveProduct}
                  actionId={actionId}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-sm text-slate-500">
                  Showing page <strong className="text-slate-900">{pagination.page}</strong> of <strong className="text-slate-900">{pagination.totalPages}</strong>
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage || loadingProducts}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={!pagination.hasNextPage || loadingProducts}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <ProductModal
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
          loading={actionLoading}
          initialData={editingProduct}
        />
      )}
    </div>
  );
}
