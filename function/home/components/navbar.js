/**
 * PAM Shared Navbar Component
 * 
 * Usage: Include this script in your HTML and call renderNavbar() after the container element
 * 
 * Example:
 *   <div id="navbar-container"></div>
 *   <script src="../../function/components/navbar.js"></script>
 *   <script>renderNavbar();</script>
 */

(function () {
    'use strict';

    // Auto-detect base path: works on both file:// (local) and http:// (server)
    // Strategy: find 'page' folder in URL, count directory depth after it,
    // then return enough '../' to reach project root (parent of 'page').
    //
    // Example — file:///C:/dev/pa-system/page/home/vfc/complaint.html
    //   parts after filter: ['C:', 'dev', 'pa-system', 'page', 'home', 'vfc', 'complaint.html']
    //   pageIdx = 3, parts after 'page' (excl. filename) = ['home', 'vfc'] → 2 sub-dirs
    //   dirDepth = 2, so return '../../../' (2 sub-dirs + 1 for 'page' itself)
    //
    // Example — /page/home/vfc/complaint.html (server)
    //   parts: ['page', 'home', 'vfc', 'complaint.html']
    //   pageIdx = 0, subDirs = 2, return '../../../'
    function getBasePath() {
        const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
        const pageIdx = parts.lastIndexOf('page');
        if (pageIdx === -1) return '../'.repeat(Math.max(0, parts.length - 1));
        const subDirs = parts.length - pageIdx - 2; // segments between 'page' and filename
        return '../'.repeat(subDirs + 1);            // +1 to go up past 'page' itself
    }

    // Generate navbar HTML
    function generateNavbarHTML(basePath) {
        // Determine current page for active states
        const currentPath = window.location.pathname;
        const isHomePage = currentPath.includes('/main/') || currentPath.includes('/home/main/');
        const isVFCPage = currentPath.includes('/vfc/');
        const isTaxPage = currentPath.includes('/tax/');

        // Check if this is a sub/detail page
        const isSubPage = (currentPath.includes('complaint.html') ||
            currentPath.includes('compliment.html') ||
            currentPath.includes('suggestion.html') ||
            currentPath.includes('track.html') ||
            currentPath.includes('calculator.html') ||
            currentPath.includes('ly01.html'));

        // Generate relative paths
        const paths = {
            logo: `${basePath}function/shared/logo/Pattaya Aviation.png`,
            home: `${basePath}page/home/main/pam.html`,
            vfcHome: `${basePath}page/home/vfc/vfc.html`,
            complaint: `${basePath}page/home/vfc/complaint.html`,
            compliment: `${basePath}page/home/vfc/compliment.html`,
            suggestion: `${basePath}page/home/vfc/suggestion.html`,
            track: `${basePath}page/home/vfc/track.html`,
            taxHome: `${basePath}page/home/tax/tax.html`,
            taxCalculator: `${basePath}page/home/tax/calculator.html`,
            paLy01: `${basePath}page/home/tax/ly01.html`,
            login: `${basePath}page/login/login.html`
        };

        // Determine back URL based on current section
        const backUrl = isVFCPage ? paths.vfcHome : isTaxPage ? paths.taxHome : paths.home;

        // If sub page, return simple navbar with back button and title
        if (isSubPage) {
            return `
    <!-- Sub Page Navbar (Static then Floating on Scroll) -->
    <nav id="subPageNavbar" class="relative z-50 transition-all duration-300">
        <div id="subPageNavbarInner" class="bg-white/70 backdrop-blur-xl px-4 py-3 flex items-center gap-3 border-b border-gray-200/50 transition-all duration-300">
            <!-- Back Button -->
            <a href="${backUrl}" class="inline-flex items-center gap-1 px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-100/70 transition-colors shrink-0">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                <span class="text-gray-700 text-sm font-medium leading-none">กลับ</span>
            </a>
            
            <!-- Divider -->
            <div class="h-8 w-px bg-gray-300"></div>
            
            <!-- Title & Subtitle -->
            <div class="flex flex-col pr-3">
                <span class="text-gray-800 font-semibold text-sm leading-tight" id="navbarPageTitle"></span>
                <span class="text-gray-500 text-xs leading-tight" id="navbarPageSubtitle"></span>
            </div>
        </div>
    </nav>`;
        }

        return `
    <!-- Desktop Navbar (Floating Pill Style) -->
    <nav class="hidden lg:block fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div class="bg-white/70 backdrop-blur-xl rounded-full px-4 py-2 flex items-center gap-1 border border-gray-200/50">
            <!-- Logo -->
            <a href="${paths.home}" class="shrink-0 mr-2">
                <img src="${paths.logo}" alt="Logo" class="h-8 object-contain">
            </a>
            
            <!-- Menu Items -->
            <div class="flex items-center gap-1">
                <a href="${paths.home}" class="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-full transition-colors font-medium text-sm">
                    หน้าหลัก
                </a>
                
                <!-- Voice for Change with Dropdown -->
                <div class="relative group">
                    <a href="${paths.vfcHome}" class="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-full transition-colors font-medium text-sm flex items-center gap-1">
                        Voice for Change
                        <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </a>
                    <!-- Dropdown -->
                    <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 transition-all duration-200 z-50">
                        <a href="${paths.complaint}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <span class="text-gray-700 text-sm">ร้องเรียน</span>
                        </a>
                        <a href="${paths.compliment}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span class="text-gray-700 text-sm">ชมเชย</span>
                        </a>
                        <a href="${paths.suggestion}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <span class="text-gray-700 text-sm">เสนอแนะ</span>
                        </a>
                        <div class="h-px bg-gray-100 my-1"></div>
                        <a href="${paths.track}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                            <span class="text-gray-700 text-sm">ติดตามคำร้อง</span>
                        </a>
                    </div>
                </div>
                
                <!-- Tax with Dropdown -->
                <div class="relative group">
                    <a href="${paths.taxHome}" class="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-full transition-colors font-medium text-sm flex items-center gap-1">
                        ภาษี
                        <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </a>
                    <!-- Dropdown -->
                    <div class="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 py-2 transition-all duration-200 z-50">
                        <a href="${paths.taxCalculator}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-gray-700 text-sm">คำนวณภาษี</span>
                        </a>
                        <a href="${paths.paLy01}" class="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="text-gray-700 text-sm">ลดหย่อนภาษี (ล.ย.01)</span>
                        </a>
                    </div>
                </div>
            </div>
            
            <!-- Login Button -->
            <button onclick="openLoginModal()" class="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors font-medium text-sm">
                เข้าสู่ระบบ
            </button>
        </div>
    </nav>
    
    <!-- Mobile Navbar (Top Fixed Style) -->
    <nav class="lg:hidden fixed top-0 left-0 right-0 z-50">
        <div class="bg-white/40 backdrop-blur-2xl px-4 py-3 flex items-center justify-between border-b border-white/30 shadow-sm">
            <!-- Logo -->
            <a href="${paths.home}" class="shrink-0" id="mobileLogoLink">
                <img src="${paths.logo}" alt="Logo" class="h-8 object-contain" id="navbarLogo">
            </a>
            
            <!-- Right Side Buttons -->
            <div class="flex items-center gap-2">
                <!-- Login Button -->
                <button onclick="openLoginModal()" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors font-medium text-sm">
                    เข้าสู่ระบบ
                </button>
                
                <!-- Hamburger Button -->
                <button id="menuToggle" onclick="toggleMobileMenu()" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100/70 transition-colors">
                    <svg id="hamburgerIcon" class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                    <svg id="closeIcon" class="w-5 h-5 text-gray-700 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Mobile Dropdown Menu -->
        <div id="dropdownMenu" class="hidden bg-white/40 backdrop-blur-2xl rounded-b-3xl shadow-xl border-x border-b border-white/30 py-3 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div class="flex flex-col">
                <a href="${paths.home}" class="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/70 rounded-xl mx-2 transition-colors">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="text-gray-800 font-medium">หน้าหลัก</span>
                </a>
                
                <!-- Voice for Change Section -->
                <div class="border-t border-gray-100/50 mt-2 pt-2 mx-2">
                    <div class="flex items-center justify-between hover:bg-gray-50/70 rounded-xl transition-colors">
                        <a href="${paths.vfcHome}" class="flex-1 flex items-center gap-3 px-5 py-3">
                            <svg class="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                            <span class="text-gray-800 font-medium">Voice for Change</span>
                        </a>
                        <button onclick="toggleSubmenu('vfcSubmenu', 'vfcArrow')" class="px-4 py-3">
                            <svg id="vfcArrow" class="w-4 h-4 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                    <!-- VFC Submenu -->
                    <div id="vfcSubmenu" class="hidden">
                        <a href="${paths.complaint}" class="flex items-center gap-3 px-9 py-2.5 hover:bg-gray-50/70 rounded-lg mx-2 transition-colors">
                            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <span class="text-gray-600 text-sm">ร้องเรียน</span>
                        </a>
                        <a href="${paths.compliment}" class="flex items-center gap-3 px-9 py-2.5 hover:bg-gray-50/70 rounded-lg mx-2 transition-colors">
                            <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                            <span class="text-gray-600 text-sm">ชมเชย</span>
                        </a>
                        <a href="${paths.suggestion}" class="flex items-center gap-3 px-9 py-2.5 hover:bg-gray-50/70 rounded-lg mx-2 transition-colors">
                            <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                            </svg>
                            <span class="text-gray-600 text-sm">เสนอแนะ</span>
                        </a>
                        <a href="${paths.track}" class="flex items-center gap-3 px-9 py-2.5 hover:bg-gray-50/70 rounded-lg mx-2 transition-colors">
                            <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                            </svg>
                            <span class="text-gray-600 text-sm">ติดตามคำร้อง</span>
                        </a>
                    </div>
                </div>
                
                <!-- Tax Section -->
                <div class="border-t border-gray-100/50 mt-2 pt-2 mx-2">
                    <div class="flex items-center justify-between hover:bg-gray-50/70 rounded-xl transition-colors">
                        <a href="${paths.taxHome}" class="flex-1 flex items-center gap-3 px-5 py-3">
                            <svg class="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="text-gray-800 font-medium">ภาษี</span>
                        </a>
                        <button onclick="toggleSubmenu('taxSubmenu', 'taxArrow')" class="px-4 py-3">
                            <svg id="taxArrow" class="w-4 h-4 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                        </button>
                    </div>
                    <!-- Tax Submenu -->
                    <div id="taxSubmenu" class="hidden">
                        <a href="${paths.taxCalculator}" class="flex items-center gap-3 px-9 py-2.5 hover:bg-gray-50/70 rounded-lg mx-2 transition-colors">
                            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                            </svg>
                            <span class="text-gray-600 text-sm">คำนวณภาษี</span>
                        </a>
                        <a href="${paths.paLy01}" class="flex items-center gap-3 px-9 py-2.5 hover:bg-gray-50/70 rounded-lg mx-2 transition-colors">
                            <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            <span class="text-gray-600 text-sm">ลดหย่อนภาษี (ล.ย.01)</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- Login Modal -->
    <div id="loginModal" class="fixed inset-0 z-[100] hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="closeLoginModal()"></div>
        
        <!-- Modal Content -->
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 w-full max-w-md border border-gray-200 relative">
                <!-- Close Button -->
                <button onclick="closeLoginModal()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                
                <!-- Logo -->
                <div class="text-center mb-8">
                    <img src="${paths.logo}" alt="Pattaya Aviation" class="h-14 mx-auto mb-4">
                    <h2 class="text-xl font-bold text-gray-900">เข้าสู่ระบบ PAM</h2>
                </div>
                
                <!-- Login Form -->
                <form id="modalLoginForm" class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
                        <input type="text" id="modalEmail" required
                            class="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50"
                            placeholder="example@pattayaaviation.com">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">รหัสผ่าน</label>
                        <div class="relative">
                            <input type="password" id="modalPassword" required
                                class="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white/50"
                                placeholder="••••••••">
                            <button type="button" onclick="toggleModalPassword()" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg id="modalEyeIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                </svg>
                                <svg id="modalEyeOffIcon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500">
                            <span class="text-sm text-gray-600">จดจำฉัน</span>
                        </label>
                        <a href="#" class="text-sm text-blue-500 hover:text-blue-600">ลืมรหัสผ่าน?</a>
                    </div>
                    
                    <button type="submit" class="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl transition-all duration-200">
                        เข้าสู่ระบบ
                    </button>
                </form>
                
                <!-- Divider -->
                <div class="flex items-center gap-4 my-5">
                    <div class="flex-1 h-px bg-gray-300"></div>
                    <span class="text-gray-500 text-sm">หรือ</span>
                    <div class="flex-1 h-px bg-gray-300"></div>
                </div>
                
                <!-- Microsoft Sign In -->
                <button onclick="signInWithMicrosoft()" 
                    class="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-200 border border-gray-300 flex items-center justify-center gap-3">
                    <svg class="w-5 h-5" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="9" height="9" fill="#f25022"/>
                        <rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
                        <rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
                        <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
                    </svg>
                    เข้าสู่ระบบด้วย Microsoft
                </button>
                

                <!-- Messages -->
                <div id="modalErrorMessage" class="hidden mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center"></div>
                <div id="modalSuccessMessage" class="hidden mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm text-center"></div>
            </div>
        </div>
    </div>
`;
    }

    // Toggle mobile menu function
    window.toggleMobileMenu = function () {
        const dropdownMenu = document.getElementById('dropdownMenu');
        const hamburgerIcon = document.getElementById('hamburgerIcon');
        const closeIcon = document.getElementById('closeIcon');

        if (!dropdownMenu) return;

        dropdownMenu.classList.toggle('hidden');

        // Toggle icons
        if (dropdownMenu.classList.contains('hidden')) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    };

    // Toggle submenu function
    window.toggleSubmenu = function (submenuId, arrowId) {
        const submenu = document.getElementById(submenuId);
        const arrow = document.getElementById(arrowId);
        if (submenu && arrow) {
            submenu.classList.toggle('hidden');
            arrow.classList.toggle('rotate-180');
        }
    };

    // Login Modal Functions
    window.openLoginModal = function () {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeLoginModal = function () {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
            // Reset form and messages
            const form = document.getElementById('modalLoginForm');
            const errorMsg = document.getElementById('modalErrorMessage');
            const successMsg = document.getElementById('modalSuccessMessage');
            if (form) form.reset();
            if (errorMsg) errorMsg.classList.add('hidden');
            if (successMsg) successMsg.classList.add('hidden');
        }
    };

    window.toggleModalPassword = function () {
        const passwordInput = document.getElementById('modalPassword');
        const eyeIcon = document.getElementById('modalEyeIcon');
        const eyeOffIcon = document.getElementById('modalEyeOffIcon');

        if (passwordInput && eyeIcon && eyeOffIcon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.classList.add('hidden');
                eyeOffIcon.classList.remove('hidden');
            } else {
                passwordInput.type = 'password';
                eyeIcon.classList.remove('hidden');
                eyeOffIcon.classList.add('hidden');
            }
        }
    };

    // MSAL Configuration for Microsoft Login
    let msalInstance = null;

    function initMSAL() {
        if (typeof msal === 'undefined') {
            console.log('MSAL not loaded yet');
            return;
        }

        // Use a fixed redirect URI on production (must match Azure App Registration)
        // On localhost, use current page so any local page can handle the redirect
        const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
        const msalConfig = {
            auth: {
                clientId: "478683b2-7ba3-4fee-98b7-02c15ae1b798",
                authority: "https://login.microsoftonline.com/b8ae9d92-ae64-4dfc-8861-6b09242355ae",
                redirectUri: isLocalhost
                    ? window.location.origin + window.location.pathname
                    : 'https://main.d4m7qyq17nw5s.amplifyapp.com/page/home/main/pam.html'
            },
            cache: {
                cacheLocation: "sessionStorage",
                storeAuthStateInCookie: false
            }
        };

        msalInstance = new msal.PublicClientApplication(msalConfig);

        // Handle redirect response
        msalInstance.handleRedirectPromise().then(response => {
            if (response) {
                handleMSLoginSuccess(response.account);
            }
        }).catch(error => {
            console.error("Redirect error:", error);
        });
    }

    window.signInWithMicrosoft = async function () {
        // ── Path A: Supabase Auth OAuth (recommended — enables RLS) ──
        // Wait briefly for supabaseClient if not yet ready (mobile may be slow to init)
        if (!window.supabaseClient) {
            await new Promise(r => setTimeout(r, 800));
        }
        if (window.supabaseClient) {
            const { error } = await window.supabaseClient.auth.signInWithOAuth({
                provider: 'azure',
                options: {
                    scopes: 'openid profile email',
                    redirectTo: window.location.origin + '/page/portal/auth-callback.html'
                }
            });
            if (error) showModalError('เกิดข้อผิดพลาด: ' + error.message);
            // page will redirect to Azure → back to auth-callback.html
            return;
        }

        // ── Path B: fallback MSAL (if supabaseClient not available) ──
        if (!msalInstance) {
            showModalError('กรุณารอสักครู่ กำลังโหลด...');
            return;
        }
        const loginRequest = { scopes: ['openid', 'profile', 'email'] };

        // On mobile browsers, popup is blocked — use redirect directly
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
            msalInstance.loginRedirect(loginRequest);
            return;
        }

        try {
            const response = await msalInstance.loginPopup(loginRequest);
            handleMSLoginSuccess(response.account);
        } catch (error) {
            console.error('Login error:', error);
            // popup blocked OR hash error on some mobile browsers → fall back to redirect
            const useRedirect = error.errorCode === 'popup_window_error' ||
                error.errorCode === 'hash_does_not_contain_known_properties';
            if (useRedirect) {
                msalInstance.loginRedirect(loginRequest);
            } else {
                showModalError('เกิดข้อผิดพลาด: ' + error.message);
            }
        }
    };



    async function handleMSLoginSuccess(account) {
        // 1) Save to sessionStorage (for immediate UI use)
        sessionStorage.setItem('user', JSON.stringify({
            name: account.name,
            email: account.username,
            id: account.localAccountId
        }));

        showModalSuccess('ยินดีต้อนรับ ' + account.name + '!');

        // 2) Upsert into Supabase portal_users & check approval
        let approvalStatus = 'pending';
        if (window.supabaseClient) {
            try {
                // upsert: insert or update last_login
                const { error: upsertErr } = await window.supabaseClient
                    .from('portal_users')
                    .upsert({
                        email: account.username,
                        name: account.name,
                        ms_id: account.localAccountId,
                        last_login: new Date().toISOString()
                    }, { onConflict: 'email', ignoreDuplicates: false });

                if (upsertErr) console.warn('⚠️ upsert error:', upsertErr.message);

                // fetch current status
                const { data, error: fetchErr } = await window.supabaseClient
                    .from('portal_users')
                    .select('status')
                    .eq('email', account.username)
                    .single();

                if (!fetchErr && data) approvalStatus = data.status;
            } catch (e) {
                console.warn('⚠️ Supabase error:', e);
            }
        }

        // 3) Redirect based on status
        setTimeout(() => {
            closeLoginModal();
            if (approvalStatus === 'approved') {
                window.location.href = getBasePath() + 'page/portal/index.html';
            } else {
                // pending or rejected — go to waiting page
                window.location.href = getBasePath() + 'page/portal/pending.html';
            }
        }, 1500);
    }

    function showModalError(message) {
        const errorDiv = document.getElementById('modalErrorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        }
    }

    function showModalSuccess(message) {
        const successDiv = document.getElementById('modalSuccessMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.classList.remove('hidden');
        }
    }

    // Load MSAL script dynamically
    function loadMSAL() {
        if (typeof msal !== 'undefined') {
            initMSAL();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://alcdn.msauth.net/browser/2.38.0/js/msal-browser.min.js';
        script.onload = initMSAL;
        document.head.appendChild(script);
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        loadMSAL();

        // Handle modal form submit
        setTimeout(() => {
            const form = document.getElementById('modalLoginForm');
            if (form) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();

                    const email = document.getElementById('modalEmail').value;
                    const password = document.getElementById('modalPassword').value;

                    // ✅ Test credentials — localhost + Amplify preview (not for final production)
                    const IS_DEV = ['localhost', '127.0.0.1', 'main.d4m7qyq17nw5s.amplifyapp.com']
                        .includes(window.location.hostname);
                    if (IS_DEV && email === 'test' && password === '1234') {
                        sessionStorage.setItem('user', JSON.stringify({
                            name: 'Test Admin',
                            email: 'admin@pattayaaviation.com',
                            id: 'test-user-local'
                        }));

                        // Sign in Supabase ด้วยเพื่อให้ RLS ทำงาน (Settings → Approval tab)
                        if (window.supabaseClient) {
                            window.supabaseClient.auth.signInWithPassword({
                                email: 'admin@pattayaaviation.com',
                                password: 'PAMadmin2024!'
                            }).catch(() => {
                                // ถ้า Supabase login ล้มเหลว ก็ยังเข้าได้ปกติ
                                console.warn('Supabase admin session unavailable');
                            });
                        }

                        showModalSuccess('ยินดีต้อนรับ Test Admin!');

                        setTimeout(() => {
                            closeLoginModal();
                            window.location.href = getBasePath() + 'page/portal/index.html';
                        }, 1500);
                    } else {
                        showModalError("กรุณาใช้ปุ่ม 'เข้าสู่ระบบด้วย Microsoft'");
                    }
                });
            }
        }, 500);
    });

    // Main render function
    window.renderNavbar = function (options = {}) {
        const container = document.getElementById('navbar-container');
        if (!container) {
            console.error('Navbar container not found. Please add <div id="navbar-container"></div> to your HTML.');
            return;
        }

        const basePath = options.basePath || getBasePath();
        container.innerHTML = generateNavbarHTML(basePath);

        // Check if this is a detail page (not a home page)
        const currentPath = window.location.pathname;
        const isDetailPage = (currentPath.includes('complaint.html') ||
            currentPath.includes('compliment.html') ||
            currentPath.includes('suggestion.html') ||
            currentPath.includes('track.html') ||
            currentPath.includes('calculator.html') ||
            currentPath.includes('ly01.html'));

        if (isDetailPage) {
            // Set page title
            const titleElement = document.getElementById('navbarPageTitle');
            if (titleElement) {
                titleElement.textContent = container.dataset.pageTitle || document.title.split(' - ')[0];
            }

            // Set page subtitle
            const subtitleElement = document.getElementById('navbarPageSubtitle');
            if (subtitleElement && container.dataset.pageSubtitle) {
                subtitleElement.textContent = container.dataset.pageSubtitle;
            }
        }
    };

    // Auto-render if container exists when script loads
    document.addEventListener('DOMContentLoaded', function () {
        const container = document.getElementById('navbar-container');
        if (container && !container.innerHTML.trim()) {
            window.renderNavbar();
        }
    });

})();
