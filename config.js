// ========== MARNISSAMALL CONFIG + SUPABASE + CLOUDINARY ==========
window.CONFIG = {
  SITE_NAME: "MarnissaMall",
  SITE_TAGLINE: "أول سوق إلكتروني في مرنيسة قرية",

  // ========== Supabase ==========
  SUPABASE_URL: 'https://mbzrhdszwfutwlfmldyv.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ienJoZHN6d2Z1dHdsZm1sZHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0MjUzNjAsImV4cCI6MjA5NzAwMTM2MH0.0XtnF-ZrhczJyUEHBpsCpsPriCrxxQyMg2d2u75XGXs',

  // ========== Cloudinary ==========
  CLOUDINARY_CLOUD_NAME: 'dnmaezmqx',
  CLOUDINARY_API_KEY: '911785224427914',
  CLOUDINARY_UPLOAD_PRESET: 'marnissamall',

  // ========== الشحن ==========
  SHIPPING_COST: 25,
  FREE_SHIPPING_ABOVE: 300,

  // ========== المخزون ==========
  LOW_STOCK_THRESHOLD: 5,

  // ========== الآراء ==========
  REVIEWS_STORAGE_KEY: 'marnissa_reviews',

  // ========== التواصل الاجتماعي ==========
  SOCIAL: {
    whatsapp: 'https://wa.me/212612345678',
    instagram: 'https://www.instagram.com/marnissamall',
    facebook: 'https://www.facebook.com/marnissamall',
    tiktok: 'https://www.tiktok.com/@marnissamall',
    email: 'contact@marnissamall.ma'
  }
};

// منع التعديل
Object.freeze(window.CONFIG);

// ========== SUPABASE CLIENT ==========
// ملاحظة: لازم سكريبت @supabase/supabase-js يكون محمّل قبل هاد الملف:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="config.js"></script>
(function () {
  'use strict';

  if (typeof supabase === 'undefined') {
    console.error('❌ Supabase SDK غير محمّل. تأكد من إضافة سكريبت @supabase/supabase-js قبل config.js');
  } else {
    window.sb = supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
    console.log('✅ Supabase client جاهز');
  }
})();

// ========== CLOUDINARY UPLOAD HELPER ==========
(function () {
  'use strict';

  const cloud_name = CONFIG.CLOUDINARY_CLOUD_NAME;
  const upload_preset = CONFIG.CLOUDINARY_UPLOAD_PRESET;

  /**
   * رفع ملف واحد (صورة أو فيديو) لـ Cloudinary
   * @param {File} file - الملف المراد رفعه
   * @param {function} onProgress - دالة اختيارية لتتبع التقدم (0-100)
   * @returns {Promise<{url, public_id, resource_type}>}
   */
  async function uploadToCloudinary(file, onProgress) {
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';
    const endpoint = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', upload_preset);
    formData.append('folder', 'marnissamall/products');

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      if (onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            onProgress(percent);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText);
          resolve({
            url: data.secure_url,
            public_id: data.public_id,
            resource_type: data.resource_type
          });
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error?.message || 'فشل الرفع'));
          } catch {
            reject(new Error('فشل الرفع لـ Cloudinary'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('خطأ فالشبكة عند الرفع'));
      xhr.send(formData);
    });
  }

  /**
   * رفع عدة ملفات دفعة واحدة
   * @param {File[]} files
   * @param {function} onFileProgress - (index, percent) => void
   * @returns {Promise<Array<{url, public_id, resource_type}>>}
   */
  async function uploadMultipleToCloudinary(files, onFileProgress) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      const result = await uploadToCloudinary(files[i], (percent) => {
        if (onFileProgress) onFileProgress(i, percent);
      });
      results.push(result);
    }
    return results;
  }

  window.MarnissaCloudinary = {
    upload: uploadToCloudinary,
    uploadMultiple: uploadMultipleToCloudinary
  };

  console.log('✅ Cloudinary helper جاهز');
})();