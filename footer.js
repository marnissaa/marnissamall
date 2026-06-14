// ========== MARNISSAMALL FOOTER - واعر ومحتال ==========
(function () {
  'use strict';

  console.log('🚀 MarnissaMall Footer - التحميل بدأ');

  // ==========================================
  //  THEME MANAGER — أزرق/أسود
  // ==========================================
  const MarnissaTheme = (function () {
    const STORAGE_KEY  = 'marnissa-theme';
    const BLUE_CLASS   = 'blue-theme';
    const BTN_CLASS    = 'theme-toggle-btn';
    const BTN_SELECTOR = '.' + BTN_CLASS;

    function _isBlue() {
      return document.body.classList.contains(BLUE_CLASS);
    }

    function _updateButtons() {
      document.querySelectorAll(BTN_SELECTOR).forEach(function (btn) {
        if (_isBlue()) {
          btn.innerHTML = '<i class="fas fa-sun"></i><span class="btn-text">فاتح</span>';
          btn.setAttribute('title', 'التحويل للوضع الداكن (أسود)');
          btn.setAttribute('aria-label', 'التحويل للوضع الداكن');
        } else {
          btn.innerHTML = '<i class="fas fa-moon"></i><span class="btn-text">داكن</span>';
          btn.setAttribute('title', 'التحويل للوضع الفاتح (أزرق)');
          btn.setAttribute('aria-label', 'التحويل للوضع الفاتح');
        }
      });
    }

    // وظيفة تغيير شعار الفوتر حسب الثيم
    function _updateFooterLogo() {
      const footerLogo = document.querySelector('.marnissa-footer__logo-img');
      if (!footerLogo) return;
      
      if (_isBlue()) {
        footerLogo.src = 'images/logo-blue-theme.png';
      } else {
        footerLogo.src = 'images/logo.png';
      }
    }

    function applyTheme(theme) {
      if (theme === 'blue') {
        document.body.classList.add(BLUE_CLASS);
      } else {
        document.body.classList.remove(BLUE_CLASS);
      }
      _updateButtons();
      _updateFooterLogo();
    }

    function loadSaved() {
      var saved = localStorage.getItem(STORAGE_KEY);
      applyTheme(saved === 'blue' ? 'blue' : 'dark');
    }

    function toggle() {
      var next = _isBlue() ? 'dark' : 'blue';
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(next);
    }

    function _createButtonIfMissing() {
      setTimeout(function() {
        if (document.querySelector(BTN_SELECTOR)) return;
        
        const footer = document.getElementById('marnissaFooter') || document.querySelector('.marnissa-footer');
        
        if (footer) {
          const themeDiv = document.createElement('div');
          themeDiv.className = 'theme-btn-wrapper';
          
          const themeLink = document.createElement('a');
          themeLink.className = BTN_CLASS;
          themeLink.setAttribute('aria-label', 'تغيير السمة');
          themeLink.setAttribute('title', 'تغيير السمة');
          themeLink.setAttribute('href', 'javascript:void(0);');
          themeLink.setAttribute('role', 'button');
          themeLink.innerHTML = '<i class="fas fa-moon"></i><span class="btn-text">داكن</span>';
          
          themeDiv.appendChild(themeLink);
          
          const socialsDiv = footer.querySelector('.marnissa-footer__socials');
          if (socialsDiv) {
            socialsDiv.parentNode.insertBefore(themeDiv, socialsDiv.nextSibling);
            console.log('✅ Theme button added after socials section');
          } else {
            const colDiv = footer.querySelector('.marnissa-footer__col:last-child');
            if (colDiv) {
              colDiv.appendChild(themeDiv);
              console.log('✅ Theme button added to last column');
            }
          }
          
          _updateButtons();
          _updateFooterLogo();
        } else {
          console.log('⚠️ Footer not found yet, retrying...');
          setTimeout(_createButtonIfMissing, 100);
        }
      }, 50);
    }

    function _bindDelegatedClick() {
      document.addEventListener('click', function (e) {
        const target = e.target.closest(BTN_SELECTOR);
        if (target) {
          e.preventDefault();
          toggle();
        }
      });
    }

    function init() {
      loadSaved();
      _bindDelegatedClick();

      function onReady() {
        _createButtonIfMissing();
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onReady);
      } else {
        onReady();
      }
    }

    return { init: init, toggle: toggle, applyTheme: applyTheme };
  })();

  MarnissaTheme.init();

  // ==========================================
  //  FOOTER HTML & CSS INJECTION
  // ==========================================
  console.log('🚀 MarnissaMall Footer - بدأ حقن الفوتر');

  function whenReady(callback) {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(callback, 1);
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  whenReady(function () {
    if (document.getElementById('marnissaFooter')) {
      console.log('ℹ️ Footer déjà présent');
      return;
    }

    // ---- CSS Injection ----
    var style = document.createElement('style');
    style.textContent = `
      @import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700&display=swap");

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
      body {
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
      body.blue-theme {
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

      /* Footer Base */
      .marnissa-footer {
        position: relative;
        z-index: 1;
        background: var(--bg2);
        border-top: 1px solid var(--border);
        font-family: 'Tajawal', sans-serif;
        direction: rtl;
        color: var(--text-muted);
        transition: background 0.5s ease, color 0.5s ease;
      }

      /* Divider */
      .marnissa-footer__divider {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        position: relative;
      }
      .marnissa-footer__divider::before,
      .marnissa-footer__divider::after {
        content: "";
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--blue-primary), transparent);
      }
      .marnissa-footer__diamond {
        display: inline-block;
        width: 8px;
        height: 8px;
        background: var(--blue-primary);
        transform: rotate(45deg);
        margin: 0 1rem;
        flex-shrink: 0;
        opacity: 0.7;
      }

      /* Inner Grid */
      .marnissa-footer__inner {
        max-width: 1200px;
        margin: 0 auto;
        padding: 3rem 2rem 2rem;
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1.2fr;
        gap: 2rem;
        align-items: start;
      }

      /* Logo */
      .marnissa-footer__logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        margin-bottom: 1rem;
      }
      .marnissa-footer__logo img {
        height: 50px;
        width: auto;
        border-radius: 12px;
        transition: opacity 0.3s;
      }
      .marnissa-footer__logo-name {
        display: block;
        font-family: 'Tajawal', sans-serif;
        font-size: 1.15rem;
        font-weight: 700;
        color: var(--blue-primary);
        letter-spacing: 1px;
      }
      .marnissa-footer__logo-tagline {
        display: block;
        font-size: 0.6rem;
        font-weight: 300;
        color: var(--text-muted);
        margin-top: 2px;
      }
      .marnissa-footer__about {
        font-size: 0.72rem;
        font-weight: 300;
        line-height: 1.9;
        max-width: 280px;
      }

      /* Columns */
      .marnissa-footer__col-title {
        font-size: 0.6rem;
        letter-spacing: 2.5px;
        text-transform: uppercase;
        color: var(--blue-primary);
        margin-bottom: 1.1rem;
        font-weight: 600;
      }
      .marnissa-footer__list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .marnissa-footer__list a {
        font-size: 0.68rem;
        font-weight: 400;
        letter-spacing: 1.2px;
        color: var(--text-muted);
        text-decoration: none;
        transition: color 0.3s, padding-right 0.3s;
        display: inline-block;
      }
      .marnissa-footer__list a:hover {
        color: var(--blue-primary);
        padding-right: 4px;
      }

      /* Contact */
      .marnissa-footer__contact {
        list-style: none;
        padding: 0;
        margin: 0 0 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;
      }
      .marnissa-footer__contact-link {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.68rem;
        font-weight: 400;
        color: var(--text-muted);
        text-decoration: none;
        transition: color 0.3s;
      }
      .marnissa-footer__contact-link:hover {
        color: var(--blue-primary);
      }
      .marnissa-footer__contact-link i {
        font-size: 0.9rem;
        width: 16px;
        text-align: center;
      }
      .marnissa-footer__icon--whatsapp {
        color: var(--success);
      }
      .marnissa-footer__icon--mail {
        color: var(--blue-primary);
      }

      /* Socials */
      .marnissa-footer__socials {
        display: flex;
        gap: 0.6rem;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 0.5rem;
      }
      .marnissa-footer__social {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        border-radius: 50%;
        border: 1.5px solid var(--border);
        background: rgba(0,87,179,0.05);
        color: var(--text-muted);
        font-size: 0.95rem;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        position: relative;
      }
      .marnissa-footer__social::before {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        margin-bottom: 8px;
        padding: 4px 8px;
        background: rgba(0,0,0,0.8);
        color: #fff;
        font-size: 0.65rem;
        border-radius: 6px;
        white-space: nowrap;
        opacity: 0;
        visibility: hidden;
        transition: all 0.2s;
        pointer-events: none;
        z-index: 10;
      }
      .marnissa-footer__social:hover::before {
        opacity: 1;
        visibility: visible;
        transform: translateY(-2px);
      }
      .marnissa-footer__social:hover {
        color: var(--blue-primary);
        border-color: var(--blue-primary);
        background: rgba(0,87,179,0.15);
        transform: translateY(-3px) scale(1.05);
      }

      /* Theme Button Wrapper */
      .theme-btn-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.5rem 0 0 0;
        padding-top: 0.5rem;
      }

      /* Theme Toggle Button */
      .marnissa-footer .theme-toggle-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 40px;
        border: 1.5px solid var(--blue-primary);
        background: linear-gradient(135deg, var(--bg2), var(--bg));
        color: var(--blue-primary);
        font-size: 0.75rem;
        font-weight: 500;
        text-decoration: none;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        cursor: pointer;
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 10px rgba(0,87,179,0.15);
        letter-spacing: 0.3px;
      }
      .marnissa-footer .theme-toggle-btn i {
        font-size: 0.9rem;
        transition: transform 0.3s ease;
      }
      .marnissa-footer .theme-toggle-btn .btn-text {
        font-size: 0.7rem;
        font-weight: 500;
      }
      .marnissa-footer .theme-toggle-btn:hover {
        transform: translateY(-2px) scale(1.02);
        border-color: var(--blue-light);
        box-shadow: 0 4px 15px rgba(0,87,179,0.25);
        gap: 8px;
        background: linear-gradient(135deg, var(--bg), var(--bg2));
      }
      .marnissa-footer .theme-toggle-btn:hover i {
        transform: rotate(15deg);
      }
      .marnissa-footer .theme-toggle-btn:active {
        transform: translateY(0) scale(0.98);
      }

      /* Bottom Bar */
      .marnissa-footer__bottom {
        max-width: 1200px;
        margin: 0 auto;
        padding: 1.25rem 2rem;
        border-top: 1px solid var(--border);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        font-size: 0.55rem;
        font-weight: 300;
        letter-spacing: 1px;
        color: var(--text-muted);
        flex-wrap: wrap;
        text-align: center;
      }
      .marnissa-footer__bottom-sep {
        color: var(--blue-primary);
        opacity: 0.5;
        font-size: 0.45rem;
      }

      /* Responsive */
      @media (max-width: 1000px) {
        .marnissa-footer__inner {
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .marnissa-footer__brand {
          grid-column: 1/-1;
        }
        .marnissa-footer__about {
          max-width: 100%;
        }
      }
      @media (max-width: 768px) {
        .marnissa-footer__socials {
          gap: 0.5rem;
        }
        .marnissa-footer__social {
          width: 32px;
          height: 32px;
          font-size: 0.9rem;
        }
        .marnissa-footer .theme-toggle-btn {
          padding: 5px 12px;
          gap: 5px;
        }
      }
      @media (max-width: 600px) {
        .marnissa-footer__inner {
          grid-template-columns: 1fr;
          padding: 2rem 1.25rem 1.5rem;
          gap: 1.75rem;
        }
        .marnissa-footer__bottom {
          padding: 1rem 1.25rem;
          font-size: 0.5rem;
        }
      }
    `;

    document.head.appendChild(style);
    console.log('🎨 MarnissaMall Footer CSS injected');

    // ---- HTML Injection with dynamic logo ----
    // تحديد الشعار الافتراضي حسب الثيم الحالي
    const isBlueTheme = document.body.classList.contains('blue-theme');
    const defaultLogoSrc = isBlueTheme ? 'images/logo-blue-theme.png' : 'images/logo.png';
    
    var footerHTML = `
      <footer class="marnissa-footer" id="marnissaFooter">
        <div class="marnissa-footer__divider">
          <span class="marnissa-footer__diamond"></span>
        </div>
        <div class="marnissa-footer__inner">

          <!-- Col 1 - Brand -->
          <div class="marnissa-footer__brand">
            <a href="index.html" class="marnissa-footer__logo">
              <img src="${defaultLogoSrc}" alt="MarnissaMall" class="marnissa-footer__logo-img" onerror="this.src='https://placehold.co/60x60/0057b3/0a0a0a?text=M'">
              <div>
                <span class="marnissa-footer__logo-name">MarnissaMall</span>
                <span class="marnissa-footer__logo-tagline">أول سوق إلكتروني في مرنيسة قرية</span>
              </div>
            </a>
            <p class="marnissa-footer__about">منتجات مرنيسة الأصلية — زيت الزيتون، عسل جبلي، حرف يدوية، ومنتجات تقليدية بجودة عالية. نوصل لكل المغرب.</p>
          </div>

          <!-- Col 2 - Navigation -->
          <div class="marnissa-footer__col">
            <h4 class="marnissa-footer__col-title">التصفح</h4>
            <ul class="marnissa-footer__list">
              <li><a href="index.html">🏠 الرئيسية</a></li>
              <li><a href="products.html">✨ جميع المنتجات</a></li>
              <li><a href="offers.html">🔥 العروض الخاصة</a></li>
              <li><a href="sellers.html">👨‍🌾 الباعة المحليين</a></li>
              <li><a href="contact.html">📞 اتصل بنا</a></li>
            </ul>
          </div>

          <!-- Col 3 - Legal & Info -->
          <div class="marnissa-footer__col">
            <h4 class="marnissa-footer__col-title">معلومات قانونية</h4>
            <ul class="marnissa-footer__list">
              <li><a href="returns.html">سياسة الإرجاع والاستبدال</a></li>
              <li><a href="shipping.html">سياسة التوصيل والشحن</a></li>
              <li><a href="terms.html">الشروط العامة للبيع</a></li>
              <li><a href="privacy.html">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <!-- Col 4 - Contact & Socials -->
          <div class="marnissa-footer__col">
            <h4 class="marnissa-footer__col-title">تواصل معنا</h4>
            <ul class="marnissa-footer__contact">
              <li>
                <a href="https://wa.me/212612345678" target="_blank" rel="noopener" class="marnissa-footer__contact-link">
                  <i class="fab fa-whatsapp marnissa-footer__icon--whatsapp"></i>
                  <span>واتساب - خدمة العملاء</span>
                </a>
              </li>
              <li>
                <a href="mailto:contact@marnissamall.ma" class="marnissa-footer__contact-link">
                  <i class="far fa-envelope marnissa-footer__icon--mail"></i>
                  <span>البريد الإلكتروني</span>
                </a>
              </li>
            </ul>
            <div class="marnissa-footer__socials">
              <a href="https://www.instagram.com/marnissamall" target="_blank" rel="noopener" class="marnissa-footer__social" aria-label="Instagram" title="إنستغرام">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/marnissamall" target="_blank" rel="noopener" class="marnissa-footer__social" aria-label="Facebook" title="فيسبوك">
                <i class="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.tiktok.com/@marnissamall" target="_blank" rel="noopener" class="marnissa-footer__social" aria-label="TikTok" title="تيك توك">
                <i class="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

        </div>

        <!-- Bottom Bar -->
        <div class="marnissa-footer__bottom">
          <span>© 2026 MarnissaMall — مرنيسة قرية، تاونات، المغرب</span>
          <span class="marnissa-footer__bottom-sep">✦</span>
          <span>💙 بالأزرق والأسود نخدم مرنيسة 💙</span>
        </div>
      </footer>
    `;

    // إضافة الفوتر
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
      footerContainer.outerHTML = footerHTML;
      console.log('📝 Footer injected into #footer-container');
    } else {
      document.body.insertAdjacentHTML('beforeend', footerHTML);
      console.log('📝 Footer injected at end of body (fallback)');
    }
    
    console.log('✅ MarnissaMall Footer loaded successfully');
  });

  // تصدير الثيم للاستخدام العام
  window.MarnissaTheme = MarnissaTheme;

})();