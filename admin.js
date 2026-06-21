// admin.js - Marnissa Admin Drawer Navigation
// الصفحات: admin-dashboard.html | admin-products.html | admin-product-form.html | admin-stock.html | admin-categories.html

(function () {
  if (document.getElementById('admin-navbar')) return;
  if (window.adminMenuLoaded) return;
  window.adminMenuLoaded = true;

  function createAdminMenu() {
    const placeholder = document.getElementById('admin-navbar-placeholder');
    if (!placeholder) {
      console.warn('admin-navbar-placeholder غير موجود، سيتم الإضافة في بداية body');
    }

    // ==========================================
    // تحديد الصفحة الحالية
    // ==========================================
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'admin-dashboard.html';
    
    const pageInfo = {
      'admin-dashboard.html': { label: 'لوحة التحكم', icon: '📊', section: 'dashboard' },
      'admin-products.html': { label: 'إدارة المنتجات', icon: '🏷️', section: 'products' },
      'admin-product-form.html': { label: 'إضافة منتج', icon: '➕', section: 'products' },
      'admin-stock.html': { label: 'المخزون', icon: '📋', section: 'products' },
      'admin-categories.html': { label: 'الفئات', icon: '📂', section: 'categories' }
    };
    
    const info = pageInfo[currentPage] || { label: 'الإدارة', icon: '⚙️', section: 'other' };
    const isProductSection = info.section === 'products';
    const isCategorySection = info.section === 'categories';

    // ==========================================
    // CSS مخصص للقائمة - باستخدام نفس ألوان admin-products.html
    // ==========================================
    if (!document.getElementById('admin-nav-styles')) {
      const style = document.createElement('style');
      style.id = 'admin-nav-styles';
      style.textContent = `
        /* ========== الألوان الأساسية ========== */
        :root {
          --blue-primary: #0057b3;
          --blue-dark: #003d80;
          --blue-light: #3a8fd4;
          --black: #0a0a0a;
          --black-light: #0d1117;
          --gray: #161b22;
          --text-light: #ffffff;
          --text-muted: #c9d1d9;
          --text-dim: #8b949e;
          --gold: #C4A06A;
          --success: #25D366;
        }

        /* ========== الوضع الداكن (أسود + أزرق) ========== */
        body:not(.blue-theme) .adm-topbar {
          --bg: #0a0a0a;
          --bg2: #0d1117;
          --text: #ffffff;
          --text-muted: #c9d1d9;
          --text-dim: #8b949e;
          --border: rgba(0,87,179,0.35);
          --border2: rgba(0,87,179,0.5);
          --card: rgba(13,17,23,0.85);
          --card-hover: rgba(0,87,179,0.2);
        }

        /* ========== الوضع الفاتح (أزرق فاتح) ========== */
        body.blue-theme .adm-topbar {
          --bg: #e8f0fe;
          --bg2: #ffffff;
          --text: #0a0a0a;
          --text-muted: #1a3a5c;
          --text-dim: #4a6a8c;
          --border: rgba(0,87,179,0.2);
          --border2: rgba(0,87,179,0.3);
          --card: rgba(255,255,255,0.9);
          --card-hover: rgba(0,87,179,0.1);
        }

        /* الشريط العلوي */
        .adm-topbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          direction: rtl;
          padding: 0.6rem 1.5rem;
          font-family: 'Tajawal', sans-serif;
          transition: all 0.3s ease;
          background: var(--bg);
          border-bottom: 1px solid var(--border);
        }

        .adm-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          color: var(--blue-primary);
        }
        .adm-brand i { font-size: 1.1rem; }

        .adm-topbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .adm-page-label {
          font-size: 0.75rem;
          color: var(--text-dim);
          font-weight: 500;
        }

        .adm-menu-btn {
          background: transparent;
          border: 1px solid var(--border2);
          border-radius: 10px;
          padding: 0.45rem 0.8rem;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.2s;
          font-family: 'Tajawal', sans-serif;
          color: var(--text-dim);
        }
        .adm-menu-btn:hover {
          border-color: var(--blue-primary);
          color: var(--blue-primary);
          background: rgba(0,87,179,0.1);
        }
        .adm-menu-btn span { font-size: 0.8rem; }
        @media (max-width: 768px) {
          .adm-topbar { padding: 0.5rem 1rem; }
          .adm-page-label, .adm-menu-btn span { display: none; }
          .adm-menu-btn { padding: 0.4rem 0.6rem; }
        }

        /* الخلفية المعتمة */
        .adm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(3px);
          z-index: 290;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }
        .adm-overlay.active { opacity: 1; visibility: visible; }

        /* الدرج الجانبي */
        .adm-drawer {
          position: fixed;
          top: 0;
          right: -300px;
          width: 280px;
          max-width: 85vw;
          height: 100%;
          z-index: 300;
          transition: right 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          display: flex;
          flex-direction: column;
          direction: rtl;
          overflow-y: auto;
          box-shadow: -8px 0 30px rgba(0,0,0,0.2);
          font-family: 'Tajawal', sans-serif;
          background: var(--bg);
        }
        .adm-drawer.open { right: 0; }

        .adm-drawer-header {
          padding: 1.25rem 1.2rem;
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .adm-drawer-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          color: var(--blue-primary);
        }
        .adm-drawer-close {
          background: none;
          border: none;
          color: var(--text-dim);
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.3rem 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }
        .adm-drawer-close:hover { color: var(--blue-primary); background: rgba(0,87,179,0.1); }

        .adm-drawer-nav { flex: 1; padding: 0.5rem 0; }

        /* عنصر القائمة */
        .adm-nav-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.8rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          border-bottom: 1px solid var(--border);
          transition: all 0.2s ease;
          text-decoration: none;
          color: var(--text-dim);
          gap: 0.5rem;
        }
        .adm-nav-item:hover {
          background: rgba(0,87,179,0.08);
          color: var(--blue-primary);
          padding-right: 1.5rem;
        }
        .adm-nav-item.active {
          background: rgba(0,87,179,0.12);
          color: var(--blue-primary);
          border-right: 3px solid var(--blue-primary);
          font-weight: 600;
        }
        .adm-nav-item .adm-nav-icon { font-size: 1rem; width: 22px; text-align: center; flex-shrink: 0; }
        .adm-nav-item .adm-nav-label { flex: 1; }
        .adm-nav-item .adm-chevron {
          font-size: 0.65rem;
          transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .adm-nav-item.expanded .adm-chevron { transform: rotate(180deg); color: var(--blue-primary); }

        /* القائمة الفرعية */
        .adm-submenu {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.4s ease;
        }
        .adm-submenu.open { max-height: 400px; }

        .adm-sub-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 2rem 0.6rem 1.2rem;
          font-size: 0.82rem;
          cursor: pointer;
          text-decoration: none;
          color: var(--text-dim);
          transition: all 0.2s;
          border-bottom: 1px solid var(--border);
        }
        .adm-sub-item:hover {
          background: rgba(0,87,179,0.08);
          color: var(--blue-primary);
          padding-right: 2.2rem;
        }
        .adm-sub-item.active { 
          color: var(--blue-primary); 
          font-weight: 600;
          background: rgba(0,87,179,0.06);
        }

        /* الفوتر */
        .adm-drawer-footer {
          border-top: 1px solid var(--border);
          padding: 0.75rem 1rem;
          flex-shrink: 0;
        }
        .adm-back-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          text-decoration: none;
          color: var(--text-dim);
          font-size: 0.85rem;
          transition: all 0.2s;
        }
        .adm-back-link:hover { color: var(--blue-primary); background: rgba(0,87,179,0.08); }
      `;
      document.head.appendChild(style);
    }

    // ==========================================
    // بناء HTML الشريط العلوي
    // ==========================================
    const topbar = document.createElement('div');
    topbar.id = 'admin-navbar';
    topbar.className = 'adm-topbar';
    topbar.innerHTML = `
      <a href="admin-dashboard.html" class="adm-brand">
        <i class="fas fa-crown"></i>
        <span>Marnissa Admin</span>
      </a>
      <div class="adm-topbar-actions">
        <span class="adm-page-label">${info.icon} ${info.label}</span>
        <button class="adm-menu-btn" id="admMenuBtn" aria-label="القائمة">
          <i class="fas fa-bars"></i>
          <span>القائمة</span>
        </button>
      </div>
    `;

    // ==========================================
    // بناء HTML الخلفية المعتمة
    // ==========================================
    const overlay = document.createElement('div');
    overlay.id = 'admOverlay';
    overlay.className = 'adm-overlay';

    // ==========================================
    // بناء HTML الدرج الجانبي
    // ==========================================
    const drawer = document.createElement('div');
    drawer.id = 'admDrawer';
    drawer.className = 'adm-drawer';

    // تحديد العنصر النشط في القوائم الفرعية
    const isProductsActive = currentPage === 'admin-products.html' || 
                            currentPage === 'admin-product-form.html' || 
                            currentPage === 'admin-stock.html';
    
    const isCategoriesActive = currentPage === 'admin-categories.html';

    drawer.innerHTML = `
      <div class="adm-drawer-header">
        <a href="admin-dashboard.html" class="adm-drawer-brand">
          <i class="fas fa-crown"></i>
          <span>Marnissa Admin</span>
        </a>
        <button class="adm-drawer-close" id="admDrawerClose">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <nav class="adm-drawer-nav">
        <!-- لوحة التحكم -->
        <a href="admin-dashboard.html" class="adm-nav-item ${currentPage === 'admin-dashboard.html' ? 'active' : ''}">
          <i class="fas fa-home adm-nav-icon"></i>
          <span class="adm-nav-label">📊 لوحة التحكم</span>
        </a>

        <!-- المنتجات - قائمة فرعية -->
        <div class="adm-nav-item ${isProductsActive ? 'active expanded' : ''}" id="productsSection">
          <i class="fas fa-tag adm-nav-icon"></i>
          <span class="adm-nav-label">🏷️ المنتجات</span>
          <i class="fas fa-chevron-down adm-chevron"></i>
        </div>
        <div class="adm-submenu ${isProductsActive ? 'open' : ''}" id="productsSubmenu">
          <a href="admin-products.html" class="adm-sub-item ${currentPage === 'admin-products.html' ? 'active' : ''}">
            <span>📋 إدارة المنتجات</span>
          </a>
          <a href="admin-product-form.html" class="adm-sub-item ${currentPage === 'admin-product-form.html' ? 'active' : ''}">
            <span>➕ إضافة منتج جديد</span>
          </a>
          <a href="admin-stock.html" class="adm-sub-item ${currentPage === 'admin-stock.html' ? 'active' : ''}">
            <span>📦 إدارة المخزون</span>
          </a>
        </div>

        <!-- الفئات - قائمة فرعية -->
        <div class="adm-nav-item ${isCategoriesActive ? 'active expanded' : ''}" id="categoriesSection">
          <i class="fas fa-folder adm-nav-icon"></i>
          <span class="adm-nav-label">📂 الفئات</span>
          <i class="fas fa-chevron-down adm-chevron"></i>
        </div>
        <div class="adm-submenu ${isCategoriesActive ? 'open' : ''}" id="categoriesSubmenu">
          <a href="admin-categories.html" class="adm-sub-item ${currentPage === 'admin-categories.html' ? 'active' : ''}">
            <span>📋 إدارة الفئات</span>
          </a>
        </div>
      </nav>
      
      <div class="adm-drawer-footer">
        <a href="index.html" class="adm-back-link">
          <i class="fas fa-store"></i>
          <span>🏠 العودة للمتجر</span>
        </a>
      </div>
    `;

    // ==========================================
    // إضافة العناصر لـ DOM
    // ==========================================
    if (placeholder) {
      placeholder.appendChild(topbar);
    } else {
      document.body.insertBefore(topbar, document.body.firstChild);
    }
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    // ==========================================
    // الأحداث والتفاعلات
    // ==========================================
    const menuBtn = document.getElementById('admMenuBtn');
    const drawerClose = document.getElementById('admDrawerClose');
    const productsSection = document.getElementById('productsSection');
    const productsSubmenu = document.getElementById('productsSubmenu');
    const categoriesSection = document.getElementById('categoriesSection');
    const categoriesSubmenu = document.getElementById('categoriesSubmenu');

    function openDrawer() {
      drawer.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    function toggleSubmenu(section, submenu) {
      const isOpen = submenu.classList.contains('open');
      if (isOpen) {
        submenu.classList.remove('open');
        section.classList.remove('expanded');
      } else {
        submenu.classList.add('open');
        section.classList.add('expanded');
      }
    }

    // ربط الأحداث
    menuBtn?.addEventListener('click', openDrawer);
    drawerClose?.addEventListener('click', closeDrawer);
    overlay?.addEventListener('click', closeDrawer);
    
    productsSection?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSubmenu(productsSection, productsSubmenu);
    });

    categoriesSection?.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSubmenu(categoriesSection, categoriesSubmenu);
    });

    // إغلاق الدرج بعد النقر على أي رابط
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeDrawer, 150);
      });
    });

    // إغلاق بـ ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // إغلاق باللمس خارج الدرج (للتيفون)
    let touchStartX = 0;
    drawer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    });
    
    drawer.addEventListener('touchmove', (e) => {
      const touchX = e.touches[0].clientX;
      const diff = touchX - touchStartX;
      
      if (diff > 80) {
        closeDrawer();
      }
    });

    console.log('✅ Admin Drawer initialized | Page:', currentPage, '| Section:', info.section);
  }

  // ==========================================
  // بدء التشغيل
  // ==========================================
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAdminMenu);
  } else {
    createAdminMenu();
  }
})();