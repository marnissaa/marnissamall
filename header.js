// ========== MARNISSAMALL HEADER - واعر ومحتال ==========
(function() {
  'use strict';
  
  console.log('🚀 MarnissaMall Header - التحميل بدأ');

  // ========== حماية XSS ==========
  function escHtml(s) {
    return (s || '').replace(/[&<>\"']/g, function(m) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return map[m];
    });
  }

  // ========== إدارة حالة تسجيل الدخول ==========
  function isAdminLoggedIn() {
    return sessionStorage.getItem('marnissa_admin_logged_in') === 'true';
  }

  function getAdminName() {
    return sessionStorage.getItem('marnissa_admin_name') || 'بائع مرنيسة';
  }

  function logout() {
    sessionStorage.clear();
    showToast('✅ تم تسجيل الخروج بنجاح', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  // ========== نظام التوست ==========
  function showToast(message, type) {
    const existingToast = document.querySelector('.marnissa-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `marnissa-toast marnissa-toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
      <span>${escHtml(message)}</span>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .marnissa-toast {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #0d1117;
        border: 1px solid #0057b3;
        border-radius: 12px;
        padding: 0.8rem 1.2rem;
        display: flex;
        align-items: center;
        gap: 0.8rem;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        font-family: 'Tajawal', sans-serif;
        font-size: 0.85rem;
        color: #ffffff;
      }
      .marnissa-toast-success {
        border-right: 3px solid #25D366;
      }
      .marnissa-toast-success i {
        color: #25D366;
      }
      @keyframes slideInRight {
        from { transform: translateX(100px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100px); opacity: 0; }
      }
    `;
    if (!document.querySelector('.marnissa-toast-style')) {
      style.classList.add('marnissa-toast-style');
      document.head.appendChild(style);
    }
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ========== وظيفة تغيير الشعار حسب الثيم ==========
  function updateLogoByTheme() {
    const logoImg = document.querySelector('.marnissa-nav__logo-img');
    if (!logoImg) return;
    
    const isBlueTheme = document.body.classList.contains('blue-theme');
    if (isBlueTheme) {
      logoImg.src = 'images/logo-blue-theme.png';
    } else {
      logoImg.src = 'images/logo.png';
    }
  }

  // ========== انتظار تحميل الصفحة ==========
  function whenReady(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(callback, 1);
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  whenReady(function() {
    if (document.getElementById('marnissaNav')) {
      console.log('ℹ️ Header déjà présent');
      initHeaderEvents();
      updateLogoByTheme();
      return;
    }

    // ========== حقن CSS ==========
    var style = document.createElement('style');
    style.textContent = `
      @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap");

      /* ========== ألوان متناسقة ========== */
      :root {
        --header-blue: #0057b3;
        --header-blue-dark: #003d80;
        --header-blue-light: #3a8fd4;
        --header-black: #0a0a0a;
        --header-black-light: #0d1117;
        --header-text: #ffffff;
        --header-text-muted: #c9d1d9;
        --header-border: rgba(0,87,179,0.35);
      }

      /* ========== NAV STYLES ========== */
      .marnissa-nav {
        background: rgba(10,10,10,0.95);
        backdrop-filter: blur(14px);
        border-bottom: 1px solid var(--header-border);
        position: sticky;
        top: 0;
        z-index: 999;
        font-family: 'Tajawal', sans-serif;
        direction: rtl;
        transition: all 0.3s ease;
      }

      body.blue-theme .marnissa-nav {
        background: rgba(255,255,255,0.95);
        border-bottom: 1px solid rgba(0,87,179,0.2);
      }

      .marnissa-nav.scrolled {
        background: rgba(10,10,10,0.98);
        box-shadow: 0 4px 30px rgba(0,0,0,0.4);
      }

      body.blue-theme .marnissa-nav.scrolled {
        background: rgba(255,255,255,0.98);
        box-shadow: 0 4px 30px rgba(0,0,0,0.08);
      }

      .marnissa-nav__inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0.9rem 2rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1.5rem;
      }

      /* ========== LOGO ========== */
      .marnissa-nav__logo {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        text-decoration: none;
        flex-shrink: 0;
      }

      .marnissa-nav__logo-img {
        height: 48px;
        width: auto;
        border-radius: 12px;
        transition: transform 0.3s;
      }

      .marnissa-nav__logo:hover .marnissa-nav__logo-img {
        transform: scale(1.04);
      }

      .marnissa-nav__brand {
        font-family: 'Tajawal', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--header-blue);
        letter-spacing: 1px;
        white-space: nowrap;
      }

      .marnissa-nav__brand span {
        font-size: 0.55rem;
        font-weight: 300;
        letter-spacing: 2px;
        color: var(--header-text-muted);
        display: block;
        margin-top: -2px;
      }

      body.blue-theme .marnissa-nav__brand span {
        color: #1a3a5c;
      }

      /* ========== LIENS ========== */
      .marnissa-nav__links {
        display: flex;
        align-items: center;
        gap: 2rem;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .marnissa-nav__links a {
        color: var(--header-text-muted);
        text-decoration: none;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        position: relative;
        padding-bottom: 3px;
        transition: color 0.3s;
      }

      .marnissa-nav__links a::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        width: 0;
        height: 2px;
        background: var(--header-blue);
        transition: width 0.3s ease;
        border-radius: 2px;
      }

      .marnissa-nav__links a:hover,
      .marnissa-nav__links a.active {
        color: var(--header-blue);
      }

      .marnissa-nav__links a:hover::after,
      .marnissa-nav__links a.active::after {
        width: 100%;
        right: auto;
        left: 0;
      }

      body.blue-theme .marnissa-nav__links a {
        color: #1a3a5c;
      }

      body.blue-theme .marnissa-nav__links a:hover,
      body.blue-theme .marnissa-nav__links a.active {
        color: var(--header-blue);
      }

      /* ========== سلة التسوق ========== */
      .marnissa-nav__cart {
        position: relative;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--header-text-muted);
        text-decoration: none;
        font-size: 0.7rem;
        font-weight: 500;
        letter-spacing: 1.5px;
        transition: color 0.3s;
      }

      .marnissa-nav__cart:hover {
        color: var(--header-blue);
      }

      .marnissa-nav__cart i {
        font-size: 1.1rem;
      }

      .marnissa-nav__cart-count {
        position: absolute;
        top: -8px;
        right: -12px;
        background: var(--header-blue);
        color: white;
        font-size: 0.6rem;
        font-weight: bold;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      /* ========== زر تسجيل الدخول ========== */
      .marnissa-nav__login-btn {
        padding: 0.5rem 1.2rem !important;
        background: var(--header-blue) !important;
        color: white !important;
        border-radius: 40px !important;
        font-weight: 700 !important;
        letter-spacing: 1px !important;
        transition: all 0.3s !important;
      }

      .marnissa-nav__login-btn:hover {
        background: var(--header-blue-dark) !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,87,179,0.3);
      }

      .marnissa-nav__login-btn::after {
        display: none !important;
      }

      /* ========== زر تسجيل الخروج ========== */
      .marnissa-nav__logout-btn {
        padding: 0.5rem 1.2rem !important;
        background: rgba(255,71,87,0.15) !important;
        border: 1px solid rgba(255,71,87,0.3) !important;
        color: #ff6b6b !important;
        border-radius: 40px !important;
        font-weight: 700 !important;
        transition: all 0.3s !important;
      }

      .marnissa-nav__logout-btn:hover {
        background: rgba(255,71,87,0.25) !important;
        transform: translateY(-1px);
        color: #ff4757 !important;
      }

      .marnissa-nav__logout-btn::after {
        display: none !important;
      }

      /* ========== معلومات المستخدم ========== */
      .marnissa-nav__user-info {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--header-blue);
        font-size: 0.75rem;
        font-weight: 500;
      }

      .marnissa-nav__user-info i {
        font-size: 0.9rem;
      }

      /* ========== BURGER MENU ========== */
      .marnissa-nav__burger {
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        width: 36px;
        height: 36px;
        background: rgba(0,87,179,0.1);
        border: 1px solid var(--header-border);
        border-radius: 8px;
        cursor: pointer;
        padding: 6px 8px;
        flex-shrink: 0;
        transition: all 0.3s;
        z-index: 1000;
      }

      .marnissa-nav__burger:hover {
        background: rgba(0,87,179,0.2);
        border-color: var(--header-blue);
      }

      .marnissa-nav__burger span {
        display: block;
        width: 18px;
        height: 2px;
        background: var(--header-blue);
        border-radius: 2px;
        transition: transform 0.35s ease, opacity 0.35s ease;
        transform-origin: center;
      }

      .marnissa-nav__burger.open span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }

      .marnissa-nav__burger.open span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }

      .marnissa-nav__burger.open span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }

      /* ========== MENU MOBILE ========== */
      .marnissa-nav__mobile {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.45s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s;
        opacity: 0;
        border-top: 1px solid transparent;
        background: rgba(10,10,10,0.97);
      }

      body.blue-theme .marnissa-nav__mobile {
        background: rgba(255,255,255,0.97);
      }

      .marnissa-nav__mobile.open {
        max-height: 500px;
        opacity: 1;
        border-top-color: var(--header-border);
      }

      .marnissa-nav__mobile ul {
        list-style: none;
        margin: 0;
        padding: 0.5rem 1.5rem 1.25rem;
        display: flex;
        flex-direction: column;
      }

      .marnissa-nav__mobile ul li a {
        display: block;
        padding: 0.85rem 0;
        color: var(--header-text-muted);
        text-decoration: none;
        font-size: 0.72rem;
        font-weight: 500;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        border-bottom: 1px solid var(--header-border);
        transition: color 0.3s, padding-right 0.3s;
      }

      .marnissa-nav__mobile ul li:last-child a {
        border-bottom: none;
      }

      .marnissa-nav__mobile ul li a:hover,
      .marnissa-nav__mobile ul li a.active {
        color: var(--header-blue);
        padding-right: 6px;
      }

      body.blue-theme .marnissa-nav__mobile ul li a {
        color: #1a3a5c;
      }

      body.blue-theme .marnissa-nav__mobile ul li a:hover,
      body.blue-theme .marnissa-nav__mobile ul li a.active {
        color: var(--header-blue);
      }

      /* أزرار الموبايل */
      .marnissa-nav__mobile .mobile-login-btn {
        background: var(--header-blue) !important;
        color: white !important;
        text-align: center !important;
        margin-top: 0.5rem !important;
        border-radius: 40px !important;
        font-weight: 700 !important;
        padding: 0.7rem 0 !important;
        border-bottom: none !important;
      }

      .marnissa-nav__mobile .mobile-logout-btn {
        background: rgba(255,71,87,0.15) !important;
        border: 1px solid rgba(255,71,87,0.3) !important;
        color: #ff6b6b !important;
        text-align: center !important;
        margin-top: 0.5rem !important;
        border-radius: 40px !important;
        font-weight: 700 !important;
        padding: 0.7rem 0 !important;
        border-bottom: none !important;
      }

      /* ========== RESPONSIVE ========== */
      @media (min-width: 769px) {
        .marnissa-nav__links {
          display: flex;
        }
        .marnissa-nav__burger {
          display: none;
        }
        .marnissa-nav__mobile {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .marnissa-nav__inner {
          padding: 0.75rem 1rem;
        }
        .marnissa-nav__links {
          display: none;
        }
        .marnissa-nav__burger {
          display: flex;
        }
        .marnissa-nav__brand {
          font-size: 1rem;
        }
        .marnissa-nav__logo-img {
          height: 40px;
        }
      }

      @media (max-width: 480px) {
        .marnissa-nav__inner {
          padding: 0.65rem 0.75rem;
        }
        .marnissa-nav__logo-img {
          height: 36px;
        }
        .marnissa-nav__brand {
          font-size: 0.9rem;
        }
        .marnissa-nav__burger {
          width: 32px;
          height: 32px;
          padding: 5px 7px;
        }
        .marnissa-nav__burger span {
          width: 16px;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('🎨 Header CSS injecté');

    // ========== التحقق من حالة تسجيل الدخول ==========
    const loggedIn = isAdminLoggedIn();
    const adminName = getAdminName();
    const escapedAdminName = escHtml(adminName);

    var desktopLinks = '';
    var mobileLinks = '';

    if (loggedIn) {
      desktopLinks = `
        <li><a href="dashboard.html" data-page="dashboard">📊 لوحة التحكم</a></li>
        <li><div class="marnissa-nav__user-info"><i class="fas fa-user-circle"></i> <span>${escapedAdminName}</span></div></li>
        <li><a href="#" data-page="logout" class="marnissa-nav__logout-btn" id="logoutBtnDesktop"><i class="fas fa-sign-out-alt"></i> خروج</a></li>
      `;
      mobileLinks = `
        <li><a href="dashboard.html" data-page="dashboard">📊 لوحة التحكم</a></li>
        <li><a href="#" data-page="logout" class="mobile-logout-btn" id="logoutBtnMobile"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</a></li>
      `;
    } else {
      desktopLinks = `
        <li><a href="login.html" data-page="login" class="marnissa-nav__login-btn">🔐 دخول</a></li>
      `;
      mobileLinks = `
        <li><a href="login.html" data-page="login" class="mobile-login-btn">🔐 تسجيل الدخول</a></li>
      `;
    }

    // ========== حقن HTML ==========
    var headerHTML = `
      <nav class="marnissa-nav" id="marnissaNav">
        <div class="marnissa-nav__inner">
          <a href="index.html" class="marnissa-nav__logo">
            <img src="images/logo.png" alt="MarnissaMall" class="marnissa-nav__logo-img" onerror="this.src='https://placehold.co/48x48/0057b3/ffffff?text=M'">
            <div class="marnissa-nav__brand">
              <span>MarnissaMall</span>
              <span>مرنيسة قرية - تاونات</span>
            </div>
          </a>
          <ul class="marnissa-nav__links" id="marnissaNavLinks">
            <li><a href="index.html" data-page="index"> الرئيسية</a></li>
            <li><a href="products.html" data-page="products"> المنتجات</a></li>
            <li><a href="offers.html" data-page="offers"> العروض</a></li>
            <li><a href="sellers.html" data-page="sellers"> الباعة</a></li>
            ${desktopLinks}
          </ul>
          <a href="cart.html" class="marnissa-nav__cart" id="cartLink">
            <i class="fas fa-shopping-cart"></i>
            <span class="marnissa-nav__cart-count" id="cartCountHeader">0</span>
          </a>
          <button class="marnissa-nav__burger" id="marnissaBurger" aria-label="القائمة" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
        <div class="marnissa-nav__mobile" id="marnissaMobile">
          <ul>
            <li><a href="index.html" data-page="index"> الرئيسية</a></li>
            <li><a href="products.html" data-page="products"> المنتجات</a></li>
            <li><a href="offers.html" data-page="offers"> العروض</a></li>
            <li><a href="sellers.html" data-page="sellers"> الباعة</a></li>
            ${mobileLinks}
          </ul>
        </div>
      </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    console.log('📝 Header HTML injecté');

    // ========== أحداث تسجيل الخروج ==========
    if (loggedIn) {
      const logoutBtnDesktop = document.getElementById('logoutBtnDesktop');
      const logoutBtnMobile = document.getElementById('logoutBtnMobile');
      
      if (logoutBtnDesktop) {
        logoutBtnDesktop.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
        });
      }
      if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
        });
      }
    }

    // ========== تحديث عداد السلة ==========
    function updateCartCountHeader() {
      const cartCountElem = document.getElementById('cartCountHeader');
      if (cartCountElem) {
        let cart = JSON.parse(localStorage.getItem('marnissaCart')) || [];
        cartCountElem.innerText = cart.length;
      }
    }

    updateCartCountHeader();
    window.addEventListener('storage', updateCartCountHeader);
    setInterval(updateCartCountHeader, 1000);

    // ========== مراقبة تغيير الثيم لتحديث الشعار ==========
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.attributeName === 'class') {
          updateLogoByTheme();
        }
      });
    });
    observer.observe(document.body, { attributes: true });

    // ========== تهيئة الأحداث ==========
    initHeaderEvents();
    updateLogoByTheme();
  });

  // ========== تهيئة أحداث الهيدر ==========
  function initHeaderEvents() {
    var currentPage = location.pathname.split('/').pop().replace('.html', '') || 'index';
    console.log('📍 Page courante:', currentPage);
    
    var links = document.querySelectorAll('.marnissa-nav [data-page]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].dataset.page === currentPage) {
        links[i].classList.add('active');
      }
    }

    var burger = document.getElementById('marnissaBurger');
    var mobileMenu = document.getElementById('marnissaMobile');
    var nav = document.getElementById('marnissaNav');

    if (!burger || !mobileMenu || !nav) {
      console.error('❌ Header elements missing');
      return;
    }

    burger.onclick = function(e) {
      e.stopPropagation();
      var isOpen = !burger.classList.contains('open');
      
      if (isOpen) {
        burger.classList.add('open');
        mobileMenu.classList.add('open');
      } else {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
      
      burger.setAttribute('aria-expanded', isOpen);
    };

    var mobileLinks = mobileMenu.querySelectorAll('a');
    for (var j = 0; j < mobileLinks.length; j++) {
      mobileLinks[j].onclick = function() {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      };
    }

    document.onclick = function(e) {
      if (!nav.contains(e.target) && mobileMenu.classList.contains('open')) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    };

    document.onkeydown = function(e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    };

    window.onscroll = function() {
      if (window.scrollY > 30) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
  }

  // ========== وظيفة تغيير الشعار ==========
  function updateLogoByTheme() {
    const logoImg = document.querySelector('.marnissa-nav__logo-img');
    if (!logoImg) return;
    
    const isBlueTheme = document.body.classList.contains('blue-theme');
    if (isBlueTheme) {
      logoImg.src = 'images/logo-blue-theme.png';
    } else {
      logoImg.src = 'images/logo.png';
    }
  }

  // ========== تصدير الدوال ==========
  window.marnissaLogout = function() {
    sessionStorage.clear();
    window.location.href = 'index.html';
  };
  
  window.isMarnissaAdminLoggedIn = function() {
    return sessionStorage.getItem('marnissa_admin_logged_in') === 'true';
  };
  
  window.updateCartCount = function() {
    const cartCountElem = document.getElementById('cartCountHeader');
    if (cartCountElem) {
      let cart = JSON.parse(localStorage.getItem('marnissaCart')) || [];
      cartCountElem.innerText = cart.length;
    }
  };
  
  window.updateLogoByTheme = updateLogoByTheme;

})();