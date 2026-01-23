/**
 * PA System - Shared Navbar Component
 * ใช้ร่วมกันทุกหน้าเพื่อให้แก้ไขที่เดียว
 * 
 * มี 2 แบบ:
 * 1. Main Navbar - มี hamburger menu สำหรับเปิด sidebar
 * 2. Back Navbar - มีปุ่มกลับ สำหรับหน้าย่อย
 */

// กำหนด base path สำหรับ assets
function getNavbarBasePath() {
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

/**
 * สร้าง Main Navbar HTML (มี hamburger menu)
 * @param {Object} options - ตัวเลือก
 * @param {boolean} options.showLogoOnScroll - แสดง logo เมื่อ scroll (default: true)
 * @returns {string} HTML string
 */
function createMainNavbarHTML(options = {}) {
  const basePath = getNavbarBasePath();
  const showLogoOnScroll = options.showLogoOnScroll !== false;
  const logoOpacity = showLogoOnScroll ? 'opacity-0' : '';
  const logoStyle = showLogoOnScroll ? 'style="opacity: 0;"' : '';
  
  return `
    <nav class="fixed top-0 left-0 right-0 z-50" style="background: rgba(251, 251, 253, 0.7); backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(60px);">
      <div class="px-4 relative flex items-center" style="height: 65px;">
        <button onclick="toggleSidebar()" class="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center justify-end w-full">
          <img id="navbar-logo" src="${basePath}/logo/Pattaya Aviation.png" alt="Logo" class="w-9 h-9 object-contain ${logoOpacity} transition-opacity duration-300" ${logoStyle}>
        </div>
      </div>
    </nav>
  `;
}

/**
 * สร้าง Home Navbar HTML (Apple-style สำหรับ desktop)
 * @param {Object} options - ตัวเลือก
 * @returns {string} HTML string
 */
function createHomeNavbarHTML(options = {}) {
  const basePath = getNavbarBasePath();
  
  // Define menu items for desktop navbar
  const menuItems = [
    { name: 'หน้าแรก', href: `${basePath}/home/pa-system.html`, hasDropdown: false },
    { name: 'Voice for Change', href: `${basePath}/voice for change/voice for change.html`, hasDropdown: true,
      dropdown: [
        { section: 'เลือกซื้อผลิตภัณฑ์ล่าสุด', items: [
          { name: 'ร้องเรียน', href: `${basePath}/voice for change/complaint.html` },
          { name: 'เสนอแนะ', href: `${basePath}/voice for change/suggestion.html` },
          { name: 'ชมเชย', href: `${basePath}/voice for change/compliment.html` }
        ]},
        { section: 'ลิงก์ด่วน', items: [
          { name: 'ค้นหาร้าน', href: '#' },
          { name: 'สถานะคำสั่งซื้อ', href: `${basePath}/voice for change/track.html` }
        ]},
        { section: 'เลือกซื้อในร้านค้าพิเศษ', items: [
          { name: 'การศึกษา', href: '#' },
          { name: 'ธุรกิจ', href: '#' }
        ]}
      ]
    },
    { name: 'HR Services', href: '#', hasDropdown: true,
      dropdown: [
        { section: 'บริการพนักงาน', items: [
          { name: 'ลางาน', href: '#' },
          { name: 'ขอเอกสาร', href: '#' },
          { name: 'สวัสดิการ', href: '#' }
        ]}
      ]
    },
    { name: 'เกี่ยวกับเรา', href: '#', hasDropdown: false }
  ];
  
  // Generate menu items HTML for desktop
  const menuItemsHTML = menuItems.map((item, index) => `
    <button onclick="${item.hasDropdown ? `toggleNavDropdown(${index})` : `window.location.href='${item.href}'`}" class="nav-menu-item px-3 py-1 text-xs text-gray-600 hover:text-black transition-colors cursor-pointer whitespace-nowrap" data-menu-index="${index}">
      ${item.name}
    </button>
  `).join('');
  
  // Generate dropdown HTML
  const dropdownsHTML = menuItems.map((item, index) => {
    if (!item.hasDropdown) return '';
    
    const sectionsHTML = item.dropdown.map(section => `
      <div class="dropdown-section min-w-[140px]">
        <p class="text-[11px] text-gray-400 mb-3 uppercase tracking-wide">${section.section}</p>
        ${section.items.map(subItem => `
          <a href="${subItem.href}" class="block text-base font-medium text-blue-500 hover:text-blue-600 mb-2 transition-colors">${subItem.name}</a>
        `).join('')}
      </div>
    `).join('');
    
    return `
      <div id="nav-dropdown-${index}" class="nav-dropdown fixed left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 overflow-hidden transition-all duration-300 z-40" style="top: 65px; max-height: 0; opacity: 0;">
        <div class="max-w-screen-xl mx-auto px-8 py-10">
          <div class="flex gap-20">
            ${sectionsHTML}
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  return `
    <!-- Mobile Navbar (hamburger menu) -->
    <nav class="lg:hidden fixed top-0 left-0 right-0 z-50" style="background: rgba(251, 251, 253, 0.7); backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
      <div class="px-4 relative flex items-center" style="height: 65px;">
        <button onclick="toggleSidebar()" class="absolute left-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:text-gray-800 transition">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="flex items-center justify-end w-full">
          <img src="${basePath}/logo/Pattaya Aviation.png" alt="Logo" class="w-9 h-9 object-contain">
        </div>
      </div>
    </nav>
    
    <!-- Desktop Navbar (Apple-style) -->
    <nav class="hidden lg:block fixed top-0 left-0 right-0 z-50" style="background: rgba(251, 251, 253, 0.7); backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
      <div class="flex items-center justify-center px-4 relative" style="height: 65px;">
        <!-- Logo (absolute left edge) -->
        <a href="${basePath}/home/pa-system.html" class="absolute left-4 flex items-center">
          <img src="${basePath}/logo/Pattaya Aviation.png" alt="Logo" class="w-9 h-9 object-contain">
        </a>
        
        <!-- Center Menu Items -->
        <div class="flex items-center gap-1">
          ${menuItemsHTML}
        </div>
      </div>
      
      <!-- Dropdown Overlay -->
      <div id="nav-dropdown-overlay" class="fixed inset-0 bg-black/30 transition-opacity duration-300 pointer-events-none opacity-0 z-30" style="top: 65px;" onclick="closeAllDropdowns()"></div>
      
      <!-- Dropdown Menus -->
      ${dropdownsHTML}
    </nav>
    
    <!-- Search Overlay -->
    <div id="nav-search-overlay" class="hidden fixed inset-0 z-[60] bg-white/98 backdrop-blur-xl">
      <div class="max-w-screen-lg mx-auto pt-3 px-8">
        <div class="flex items-center gap-4 border-b border-gray-200 pb-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input id="nav-search-input" type="text" placeholder="ค้นหา..." class="flex-1 text-lg border-none outline-none bg-transparent py-2">
          <button onclick="closeNavSearch()" class="text-blue-500 hover:text-blue-600 text-sm font-medium">ยกเลิก</button>
        </div>
        <div class="py-6">
          <p class="text-xs text-gray-400 mb-4 uppercase tracking-wide">ลิงก์ด่วน</p>
          <div class="space-y-3">
            <a href="${basePath}/voice for change/voice for change.html" class="block text-sm text-gray-700 hover:text-blue-500 transition-colors">Voice for Change</a>
            <a href="${basePath}/voice for change/track.html" class="block text-sm text-gray-700 hover:text-blue-500 transition-colors">ติดตามเรื่อง</a>
            <a href="${basePath}/voice for change/complaint.html" class="block text-sm text-gray-700 hover:text-blue-500 transition-colors">ร้องเรียน</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Toggle dropdown menu
function toggleNavDropdown(index) {
  const dropdown = document.getElementById(`nav-dropdown-${index}`);
  const overlay = document.getElementById('nav-dropdown-overlay');
  const allDropdowns = document.querySelectorAll('.nav-dropdown');
  const menuItems = document.querySelectorAll('.nav-menu-item');
  
  // Check if this dropdown is already open
  const isOpen = dropdown && dropdown.style.maxHeight !== '0px' && dropdown.style.maxHeight !== '';
  
  // Close all dropdowns first
  allDropdowns.forEach(d => {
    d.style.maxHeight = '0';
    d.style.opacity = '0';
  });
  
  // Remove active state from all menu items
  menuItems.forEach(item => {
    item.classList.remove('font-semibold', 'text-black');
    item.classList.add('text-gray-600');
  });
  
  if (!isOpen && dropdown) {
    // Open this dropdown
    dropdown.style.maxHeight = '400px';
    dropdown.style.opacity = '1';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    
    // Add active state to clicked menu item
    const activeItem = document.querySelector(`[data-menu-index="${index}"]`);
    if (activeItem) {
      activeItem.classList.add('font-semibold', 'text-black');
      activeItem.classList.remove('text-gray-600');
    }
  } else {
    // Close overlay
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }
}

// Close all dropdowns
function closeAllDropdowns() {
  const allDropdowns = document.querySelectorAll('.nav-dropdown');
  const overlay = document.getElementById('nav-dropdown-overlay');
  const menuItems = document.querySelectorAll('.nav-menu-item');
  
  allDropdowns.forEach(d => {
    d.style.maxHeight = '0';
    d.style.opacity = '0';
  });
  
  if (overlay) {
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }
  
  menuItems.forEach(item => {
    item.classList.remove('font-semibold', 'text-black');
    item.classList.add('text-gray-600');
  });
}

// Open search overlay
function openNavSearch() {
  const searchOverlay = document.getElementById('nav-search-overlay');
  if (searchOverlay) {
    searchOverlay.classList.remove('hidden');
    setTimeout(() => {
      document.getElementById('nav-search-input').focus();
    }, 100);
  }
}

// Close search overlay
function closeNavSearch() {
  const searchOverlay = document.getElementById('nav-search-overlay');
  if (searchOverlay) {
    searchOverlay.classList.add('hidden');
  }
}

// Export new functions
window.createHomeNavbarHTML = createHomeNavbarHTML;
window.toggleNavDropdown = toggleNavDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.openNavSearch = openNavSearch;
window.closeNavSearch = closeNavSearch;

/**
 * สร้าง Back Navbar HTML (มีปุ่มกลับ)
 * @param {Object} options - ตัวเลือก
 * @param {string} options.backUrl - URL สำหรับปุ่มกลับ (default: 'voice for change.html')
 * @param {string} options.backText - ข้อความปุ่มกลับ (default: 'กลับ')
 * @param {string} options.pageTitle - ชื่อหน้าที่จะแสดงตรงกลางเมื่อ scroll (optional)
 * @param {string} options.pageSubtitle - คำอธิบายใต้ชื่อหน้า (optional)
 * @param {string} options.pageTitleColor - สีของชื่อหน้า (default: 'text-gray-800')
 * @returns {string} HTML string
 */
function createBackNavbarHTML(options = {}) {
  const basePath = getNavbarBasePath();
  const backUrl = options.backUrl || 'voice for change.html';
  const backText = options.backText || 'กลับ';
  const pageTitle = options.pageTitle || '';
  const pageSubtitle = options.pageSubtitle || '';
  const pageTitleColor = options.pageTitleColor || 'text-gray-800';
  
  const subtitleHTML = pageSubtitle ? `<p class="text-xs text-gray-500">${pageSubtitle}</p>` : '';
  
  const titleHTML = pageTitle ? `
        <div id="navbar-title" class="absolute left-24 top-1/2 transform -translate-y-1/2 opacity-0 transition-opacity duration-300 flex items-center gap-4">
          <div class="w-px h-8 bg-gray-300"></div>
          <div class="leading-tight">
            <span class="font-semibold ${pageTitleColor}">${pageTitle}</span>
            ${subtitleHTML}
          </div>
        </div>
  ` : '';
  
  return `
    <nav class="fixed top-0 left-0 right-0 z-50" style="background: rgba(251, 251, 253, 0.7); backdrop-filter: saturate(180%) blur(40px); -webkit-backdrop-filter: saturate(180%) blur(40px);">
      <div class="px-4 relative flex items-center" style="height: 65px;">
        <a href="${backUrl}" class="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-1 text-gray-600 hover:text-gray-800 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          <span class="text-sm font-medium">${backText}</span>
        </a>
        ${titleHTML}
        <div class="flex items-center justify-end w-full">
          <a href="${backUrl}">
            <img src="${basePath}/logo/Pattaya Aviation.png" alt="Logo" class="w-9 h-9 object-contain">
          </a>
        </div>
      </div>
    </nav>
  `;
}

/**
 * Setup scroll listener เพื่อแสดง/ซ่อน title ใน navbar
 */
function setupNavbarTitleScroll() {
  // รอให้ DOM พร้อม
  function initTitleScroll() {
    const navbarTitle = document.getElementById('navbar-title');
    const contentArea = document.querySelector('.content-area');
    
    if (!navbarTitle) {
      console.log('navbar-title not found');
      return;
    }
    
    if (!contentArea) {
      console.log('content-area not found, retrying...');
      setTimeout(initTitleScroll, 100);
      return;
    }
    
    // เพิ่ม scroll listener
    contentArea.addEventListener('scroll', function() {
      if (contentArea.scrollTop > 80) {
        navbarTitle.style.opacity = '1';
      } else {
        navbarTitle.style.opacity = '0';
      }
    });
  }
  
  // เริ่มหลังจาก DOM พร้อม
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTitleScroll);
  } else {
    setTimeout(initTitleScroll, 50);
  }
}

/**
 * Inject Main Navbar เข้าไปในหน้า
 * @param {string} containerId - ID ของ container element (default: 'app')
 * @param {Object} options - ตัวเลือกสำหรับ navbar
 */
function initMainNavbar(containerId = 'app', options = {}) {
  const container = document.getElementById(containerId);
  if (container) {
    container.insertAdjacentHTML('afterbegin', createMainNavbarHTML(options));
    
    // Setup scroll listener for logo fade
    if (options.showLogoOnScroll !== false) {
      setupNavbarLogoScroll(containerId);
    }
  }
}

/**
 * Inject Back Navbar เข้าไปในหน้า
 * @param {string} containerId - ID ของ container element (default: 'main-content')
 * @param {Object} options - ตัวเลือกสำหรับ navbar
 */
function initBackNavbar(containerId = 'main-content', options = {}) {
  const body = document.body;
  // Insert at the beginning of body
  body.insertAdjacentHTML('afterbegin', createBackNavbarHTML(options));
}

/**
 * Setup scroll listener เพื่อแสดง/ซ่อน logo
 * @param {string} containerId - ID ของ scrollable container (deprecated, uses .content-area now)
 */
function setupNavbarLogoScroll(containerId) {
  const container = document.querySelector('.content-area') || document.getElementById(containerId);
  const navbarLogo = document.getElementById('navbar-logo');
  
  if (container && navbarLogo) {
    container.addEventListener('scroll', function() {
      if (container.scrollTop > 100) {
        navbarLogo.style.opacity = '1';
      } else {
        navbarLogo.style.opacity = '0';
      }
    });
  }
}

// Export for manual use
window.createMainNavbarHTML = createMainNavbarHTML;
window.createBackNavbarHTML = createBackNavbarHTML;
window.initMainNavbar = initMainNavbar;
window.initBackNavbar = initBackNavbar;
window.setupNavbarLogoScroll = setupNavbarLogoScroll;
window.setupNavbarTitleScroll = setupNavbarTitleScroll;
