/**
 * PA System - Footer Component
 * สร้าง footer พร้อม copyright สำหรับทุกหน้า
 * ใช้เพื่อให้มี padding และ copyright ที่ consistent ทุกหน้า
 */

// ======================================
// COPYRIGHT CONFIGURATION - แก้ไขที่นี่ที่เดียว!
// ======================================
const COPYRIGHT_TEXT = "Copyright © 2026 Pattaya Aviation | Human Resource Department";

/**
 * สร้าง footer HTML พร้อม copyright
 * @param {Object} options - ตัวเลือก
 * @param {boolean} options.showDisclaimer - แสดง disclaimer หรือไม่ (default: false)
 * @returns {string} HTML string
 */
function createFooterHTML(options = {}) {
  const { showDisclaimer = false } = options;
  
  const disclaimerHTML = showDisclaimer ? `
    <div class="w-full max-w-7xl mx-auto mt-2 pb-6 px-8">
      <p class="text-xs text-gray-400 text-left leading-relaxed">
        ระบบนี้จัดทำขึ้นโดยมีวัตถุประสงค์เพื่อให้พนักงานทุกคนภายในบริษัทพัทยา เอวิเอชั่น จำกัด ใช้เป็นช่องทางในการสื่อสาร แลกเปลี่ยน ร้องเรียน โดยข้อมูลที่ได้จากแบบสอบถามนี้ ทางฝ่ายทรัพยากรบุคคลจะนำไปปรับปรุงนโยบาย การบริหารจัดการ ผลตอบแทน สวัสดิการ การพัฒนาความรู้ ความก้าวหน้า สภาพแวดล้อม ความปลอดภัย และเรื่องอื่น ๆ ในการทำงาน และข้อมูลที่ได้จากการสำรวจ บริษัทจะไม่มีการสืบค้นถึงตัวบุคคลผู้ให้ข้อมูลและไม่เปิดเผยข้อมูลไปยังบุคคลอื่น
      </p>
    </div>
  ` : '';

  return `
    ${disclaimerHTML}
    <!-- Copyright Footer - Always at bottom -->
    <div class="w-full py-6 pb-12 mt-auto">
      <p class="text-xs text-gray-400 text-center">${COPYRIGHT_TEXT}</p>
    </div>
  `;
}

/**
 * เพิ่ม footer ให้กับ content-area โดยอัตโนมัติ
 * เรียกใช้หลังจาก DOM พร้อม
 * @param {Object} options - ตัวเลือก
 */
function appendFooter(options = {}) {
  const contentArea = document.querySelector('.content-area');
  if (contentArea) {
    // ตรวจสอบว่ามี footer อยู่แล้วหรือไม่
    const existingFooter = contentArea.querySelector('[data-footer="true"]');
    if (!existingFooter) {
      const footerWrapper = document.createElement('div');
      footerWrapper.setAttribute('data-footer', 'true');
      footerWrapper.innerHTML = createFooterHTML(options);
      contentArea.appendChild(footerWrapper);
    }
  }
}

/**
 * อัพเดท copyright text ในหน้าปัจจุบัน
 * ใช้สำหรับหน้าที่มี copyright hardcode อยู่แล้ว
 */
function updateCopyright() {
  // หา copyright elements ทั้งหมดที่มี "Copyright" อยู่
  const copyrightElements = document.querySelectorAll('p');
  copyrightElements.forEach(el => {
    if (el.textContent.includes('Copyright ©')) {
      el.textContent = COPYRIGHT_TEXT;
    }
  });
}

/**
 * เพิ่ม scroll padding ให้ content-area
 * ป้องกันเนื้อหาถูกตัดที่ขอบล่าง
 */
function ensureScrollPadding() {
  const style = document.createElement('style');
  style.id = 'footer-scroll-padding';
  style.textContent = `
    .content-area {
      padding-bottom: 20px !important;
    }
    
    /* Ensure footer sticks to bottom */
    .content-area > [data-footer="true"] {
      margin-top: auto;
    }
  `;
  
  if (!document.getElementById('footer-scroll-padding')) {
    document.head.appendChild(style);
  }
}

// ======================================
// AUTO-INIT: รันอัตโนมัติเมื่อ DOM พร้อม
// ======================================
document.addEventListener('DOMContentLoaded', function() {
  // อัพเดท copyright ในหน้าปัจจุบัน
  updateCopyright();
  // เพิ่ม scroll padding
  ensureScrollPadding();
});
