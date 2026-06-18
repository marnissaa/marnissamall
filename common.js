// ==========================================
// MARNISSAMALL - COMMON FUNCTIONS
// Shared between all POS pages
// ==========================================

// ========== GLOBAL VARIABLES ==========
window.MARNISSA = window.MARNISSA || {};
window.MARNISSA.common = {
  isOnline: navigator.onLine,
  sb: null,
  walletId: null
};

// ========== TOAST ==========
window.showToast = function(msg, type) {
  const toast = document.getElementById('toastMsg');
  const icon = document.querySelector('#toastMsg i');
  const text = document.getElementById('toastText');
  if (!toast) {
    // Create toast if not exists
    const div = document.createElement('div');
    div.className = 'toast-msg';
    div.id = 'toastMsg';
    div.innerHTML = '<i class="fas fa-info-circle"></i> <span id="toastText"></span>';
    document.body.appendChild(div);
  }
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const iconEl = document.querySelector('#toastMsg i');
  const textEl = document.getElementById('toastText');
  iconEl.className = 'fas ' + (icons[type] || icons.info);
  textEl.textContent = msg;
  const toastEl = document.getElementById('toastMsg');
  toastEl.className = `toast-msg ${type} show`;
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3500);
};

// ========== NETWORK ==========
window.updateOnlineStatus = function() {
  const isOnline = window.MARNISSA.common.isOnline;
  const statusEl = document.getElementById('sidebarStatus');
  const dot = document.getElementById('sidebarDot');
  const text = document.getElementById('sidebarStatusText');
  if (!statusEl) return;
  if (isOnline) {
    statusEl.className = 'online-status online';
    dot.className = 'status-dot online';
    text.textContent = 'متصل';
  } else {
    statusEl.className = 'online-status offline';
    dot.className = 'status-dot offline';
    text.textContent = 'غير متصل';
  }
};

// ========== ESCAPE HTML ==========
window.escapeHtml = function(s) {
  if (!s) return '';
  return String(s).replace(/[&<>]/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;' }[m]));
};

// ========== SAFE SUPABASE REQUEST ==========
window.safeSupabaseRequest = async function(requestFn, fallbackData = null) {
  if (!window.MARNISSA.common.isOnline) {
    window.showToast('⚠️ لا يوجد اتصال بالإنترنت', 'error');
    return fallbackData;
  }
  try {
    return await requestFn();
  } catch (error) {
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      window.MARNISSA.common.isOnline = false;
      window.updateOnlineStatus();
      window.showToast('❌ فشل الاتصال بالخادم', 'error');
    } else {
      console.error('Supabase error:', error);
      window.showToast('❌ خطأ: ' + (error.message || 'حدث خطأ'), 'error');
    }
    return fallbackData;
  }
};

// ========== INIT NETWORK MONITORING ==========
window.startNetworkMonitoring = function() {
  if (window._networkInterval) clearInterval(window._networkInterval);
  window._networkInterval = setInterval(() => {
    const currentStatus = navigator.onLine;
    if (currentStatus !== window.MARNISSA.common.isOnline) {
      window.MARNISSA.common.isOnline = currentStatus;
      window.updateOnlineStatus();
      if (currentStatus) {
        window.showToast('🌐 تم استعادة الاتصال', 'success');
        // Reload current page data
        if (window.loadAllOrdersFull) window.loadAllOrdersFull();
        if (window.loadTransactionsFull) window.loadTransactionsFull();
        if (window.loadWalletFull) window.loadWalletFull();
        if (window.loadPendingOrders) window.loadPendingOrders();
        if (window.loadAllStock) window.loadAllStock();
        if (window.loadWallet) window.loadWallet();
        if (window.updateStats) window.updateStats();
      } else {
        window.showToast('⚠️ انقطع الاتصال بالإنترنت', 'error');
      }
    }
  }, 5000);
};

// ========== FORMAT CURRENCY ==========
window.formatCurrency = function(amount) {
  return parseFloat(amount || 0).toFixed(2) + ' درهم';
};

// ========== DATE FORMATTER ==========
window.formatDate = function(date) {
  if (!date) return '—';
  return new Date(date).toLocaleString('ar-MA');
};

// ========== TRUNCATE ID ==========
window.truncateId = function(id) {
  if (!id) return '---';
  return id.slice(0, 8);
};

// ========== INIT COMMON ==========
document.addEventListener('DOMContentLoaded', function() {
  // Set up Supabase
  if (window.sb) {
    window.MARNISSA.common.sb = window.sb;
  }
  
  // Set up network
  window.updateOnlineStatus();
  window.startNetworkMonitoring();
  
  // Handle online/offline events
  window.addEventListener('online', () => {
    window.MARNISSA.common.isOnline = true;
    window.updateOnlineStatus();
    window.showToast('🌐 تم استعادة الاتصال بالإنترنت', 'success');
  });
  
  window.addEventListener('offline', () => {
    window.MARNISSA.common.isOnline = false;
    window.updateOnlineStatus();
    window.showToast('⚠️ انقطع الاتصال بالإنترنت', 'error');
  });
});

console.log('✅ MarnissaMall common.js loaded');