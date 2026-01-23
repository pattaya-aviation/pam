/**
 * PA System - Scrollbar Component
 * จัดการ scrollable content area ที่เริ่มจากใต้ navbar
 */

/**
 * สร้าง scrollable content area
 * ใช้ครอบเนื้อหาหลักเพื่อให้ scroll ได้ตั้งแต่ใต้ navbar
 */
function initScrollableContent() {
  // ตรวจสอบว่า inject styles แล้วหรือยัง
  if (document.getElementById('scrollbar-styles')) {
    return; // inject แล้ว ไม่ต้องทำซ้ำ
  }
  
  // หา navbar height
  const navbar = document.querySelector('nav.fixed');
  const navbarHeight = navbar ? navbar.offsetHeight : 56; // default 56px (h-14)
  
  // สร้าง style สำหรับ content-area
  const style = document.createElement('style');
  style.id = 'scrollbar-styles';
  style.textContent = `
    html, body {
      overflow: hidden !important;
      height: 100% !important;
      margin: 0;
      padding: 0;
    }
    
    .content-area {
      position: absolute;
      top: ${navbarHeight}px;
      left: 0;
      right: 0;
      bottom: 0;
      overflow-y: scroll !important;
      overflow-x: hidden !important;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
      overscroll-behavior: contain;
    }
    
    /* Custom scrollbar styling - hidden but functional */
    .content-area::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    
    .content-area::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .content-area::-webkit-scrollbar-thumb {
      background: transparent;
    }
    
    /* For Firefox - hide scrollbar but allow scroll */
    .content-area {
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(style);
}


/**
 * ครอบเนื้อหาใน content-area wrapper
 * เรียกหลังจาก DOM พร้อมแล้ว
 */
function wrapContentArea() {
  // หา main content (ทุกอย่างหลัง navbar)
  const navbar = document.querySelector('nav.fixed');
  if (!navbar) return;
  
  // ตรวจสอบว่ามี content-area อยู่แล้วหรือไม่
  if (document.querySelector('.content-area')) return;
  
  // สร้าง content-area wrapper
  const contentArea = document.createElement('div');
  contentArea.className = 'content-area';
  
  // หา elements ที่อยู่หลัง navbar
  const navbarContainer = document.getElementById('navbar-container');
  let nextElement = navbarContainer ? navbarContainer.nextElementSibling : navbar.nextElementSibling;
  
  // ย้าย elements เข้าไปใน content-area
  const elementsToMove = [];
  while (nextElement) {
    // ข้าม script tags
    if (nextElement.tagName !== 'SCRIPT') {
      elementsToMove.push(nextElement);
    }
    nextElement = nextElement.nextElementSibling;
  }
  
  // ย้าย elements
  elementsToMove.forEach(el => contentArea.appendChild(el));
  
  // เพิ่ม content-area เข้าไปใน body
  document.body.appendChild(contentArea);
}

/**
 * Initialize scrollbar functionality
 * เรียกใช้งานเมื่อ DOM พร้อม
 */
function initScrollbar() {
  initScrollableContent();
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollbar);
} else {
  initScrollbar();
}

// Export for manual use
window.initScrollbar = initScrollbar;
window.initScrollableContent = initScrollableContent;
window.wrapContentArea = wrapContentArea;
