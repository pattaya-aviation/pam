/**
 * PA System - Shared Sidebar Component
 * ใช้ร่วมกันทุกหน้าเพื่อให้แก้ไขที่เดียว
 */

// กำหนด base path สำหรับ assets
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/home/')) {
    return '..';
  } else if (path.includes('/voice for change/') || path.includes('/voice%20for%20change/')) {
    return '..';
  } else if (path.includes('/login/')) {
    return '..';
  }
  return '.';
}

// สร้าง Sidebar HTML
function createSidebarHTML(currentPage = 'home') {
  const basePath = getBasePath();
  
  // กำหนดหัวข้อ sidebar ตามหน้าปัจจุบัน
  const sidebarTitle = currentPage === 'vfc' ? 'Voice for Change' : 'PA System';
  const sidebarSubtitle = 'เสียงแห่งการเปลี่ยนแปลง';
  
  return `
    <!-- Sidebar Overlay -->
    <div id="sidebar-overlay" class="fixed inset-0 bg-black/50 z-[60] hidden" style="padding-bottom: env(safe-area-inset-bottom, 0);" onclick="toggleSidebar()"></div>
    
    <!-- Sidebar -->
    <div id="sidebar" class="fixed top-0 left-0 h-full w-72 bg-white z-[60] transform -translate-x-full transition-transform duration-300 shadow-2xl">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img src="${basePath}/logo/Pattaya Aviation.png" alt="Logo" class="w-10 h-10 object-contain">
            <div>
              <h2 class="font-semibold text-gray-800">${sidebarTitle}</h2>
              <p class="text-xs text-gray-500">${sidebarSubtitle}</p>
            </div>
          </div>
          <button onclick="toggleSidebar()" class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Sidebar Content -->
      <nav class="p-4">
        <p class="text-xs text-gray-400 uppercase tracking-wider mb-3 px-3">เมนูหลัก</p>
        
        <!-- หน้าหลัก PA System -->
        <a href="${basePath}/home/pa-system.html" class="flex items-center gap-3 px-3 py-3 rounded-xl ${currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-800'} transition mb-1">
          <div class="w-9 h-9 ${currentPage === 'home' ? 'bg-blue-100' : 'bg-gray-100'} rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 ${currentPage === 'home' ? 'text-blue-500' : 'text-gray-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div>
            <span class="font-medium">หน้าหลัก</span>
            <p class="text-xs ${currentPage === 'home' ? 'text-blue-400' : 'text-gray-400'}">PA System</p>
          </div>
        </a>
        
        <!-- Voice for Change -->
        <a href="${basePath}/voice for change/voice for change.html" class="flex items-center gap-3 px-3 py-3 rounded-xl ${currentPage === 'vfc' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'} transition mb-1">
          <div class="w-9 h-9 ${currentPage === 'vfc' ? 'bg-blue-100' : 'bg-blue-50'} rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
            </svg>
          </div>
          <div>
            <span class="font-medium">Voice for Change</span>
            <p class="text-xs ${currentPage === 'vfc' ? 'text-blue-400' : 'text-gray-400'}">เสียงแห่งการเปลี่ยนแปลง</p>
          </div>
        </a>
      </nav>
    </div>
  `;
}

// Toggle Sidebar Function
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  }
}

// Initialize Sidebar
function initSidebar(currentPage = 'home') {
  // หา container สำหรับ inject sidebar - ลองหา nav.fixed ก่อน แล้วค่อย fallback
  let navElement = document.querySelector('nav.fixed') || document.querySelector('nav.sticky') || document.querySelector('nav');
  
  if (navElement) {
    // Insert sidebar HTML after nav
    navElement.insertAdjacentHTML('afterend', createSidebarHTML(currentPage));
  } else {
    // ถ้าไม่เจอ nav ให้ inject เข้า body โดยตรง
    document.body.insertAdjacentHTML('afterbegin', createSidebarHTML(currentPage));
  }
}

// Auto-detect current page and initialize immediately
(function() {
  const path = window.location.pathname.toLowerCase();
  let currentPage = 'home';
  
  if (path.includes('voice for change') || path.includes('voice%20for%20change')) {
    currentPage = 'vfc';
  }
  
  // ตรวจสอบว่ามี sidebar อยู่แล้วหรือไม่
  if (!document.getElementById('sidebar')) {
    // Inject sidebar เข้า body โดยตรง
    document.body.insertAdjacentHTML('afterbegin', createSidebarHTML(currentPage));
  }
})();
