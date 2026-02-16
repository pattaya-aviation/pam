/**
 * Admin Navigation Component
 * Renders floating menu for desktop and mobile dropdown menu
 * Usage: Include this script and call renderAdminNav('containerId', 'currentPage')
 */

// Detect basePath: if inside a subfolder of admin_portal, prefix '../'
const adminNavBasePath = (function() {
    const path = window.location.pathname;
    // Check if we're inside a subfolder like /vfc-admin/index.html
    const adminPortalMatch = path.match(/\/admin_portal\/([^/]+)\//);
    if (adminPortalMatch) {
        return '../'; // We're in a subfolder, go up one level
    }
    return ''; // We're directly in admin_portal/
})();

// Menu items configuration
const adminMenuItems = [
    {
        id: 'home',
        href: adminNavBasePath + 'index.html',
        label: 'หน้าหลัก',
        hoverWidth: '140px',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>`,
        iconColor: 'text-gray-900'
    },
    {
        id: 'vfc',
        href: adminNavBasePath + 'vfc-admin/index.html',
        label: 'Voice for Change',
        hoverWidth: '195px',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
        </svg>`,
        iconColor: 'text-gray-900'
    },
    {
        id: 'tax',
        href: adminNavBasePath + 'tax-admin.html',
        label: 'Tax System',
        hoverWidth: '155px',
        icon: `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
        </svg>`,
        iconColor: 'text-gray-900'
    }
];

// CSS styles for admin navigation
const adminNavStyles = `
    /* Floating menu items - hidden on mobile by default */
    .floating-menu {
        display: none;
        flex-direction: column;
        gap: 8px;
    }
    
    /* Show floating menu only on desktop (1024px and up) */
    @media (min-width: 1024px) {
        .floating-menu {
            display: flex;
        }
    }
    
    .menu-item {
        display: flex;
        align-items: center;
        width: 56px;
        height: 56px;
        padding: 0;
        border-radius: 9999px;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(229, 231, 235, 0.8);
        box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.3s ease,
                    background-color 0.2s ease,
                    padding 0.3s ease;
        cursor: pointer;
        text-decoration: none;
        --hover-width: 180px;
    }
    .menu-item:hover {
        width: var(--hover-width);
        padding-right: 16px;
        box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.12);
    }
    .menu-item.active {
        background: rgba(243, 244, 246, 0.9);
    }
    .menu-item .icon-wrapper {
        width: 56px;
        height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }
    .menu-item .menu-text {
        white-space: nowrap;
        opacity: 0;
        transform: translateX(-10px);
        transition: opacity 0.2s ease-out, transform 0.2s ease-out;
        padding-right: 16px;
    }
    .menu-item:hover .menu-text {
        opacity: 1;
        transform: translateX(0);
        transition-delay: 0.15s;
    }
    .menu-divider {
        width: 40px;
        height: 1px;
        background: rgba(229, 231, 235, 0.8);
        margin: 4px auto;
    }
    
    /* Mobile menu button - show only on mobile */
    .admin-mobile-nav {
        display: block;
    }
    @media (min-width: 1024px) {
        .admin-mobile-nav {
            display: none;
        }
    }
`;

// Inject styles
function injectAdminNavStyles() {
    if (!document.getElementById('admin-nav-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'admin-nav-styles';
        styleSheet.textContent = adminNavStyles;
        document.head.appendChild(styleSheet);
    }
}

// Toggle mobile menu
function toggleAdminMobileMenu() {
    const mobileMenu = document.getElementById('adminMobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Render desktop floating menu
function renderDesktopMenu(currentPage) {
    let html = '';
    
    adminMenuItems.forEach(item => {
        const isActive = currentPage === item.id;
        html += `
            <a href="${item.href}" class="menu-item ${isActive ? 'active' : ''}" style="--hover-width: ${item.hoverWidth}">
                <div class="icon-wrapper">
                <span class="${isActive ? 'text-blue-500' : item.iconColor}">${item.icon}</span>
                </div>
                <span class="menu-text ${isActive ? 'text-gray-900 font-medium' : 'text-gray-700'}">${item.label}</span>
            </a>
        `;
    });
    
    // Add divider and logout
    html += `
        <div class="menu-divider"></div>
        <button onclick="logout()" class="menu-item" style="--hover-width: 165px">
            <div class="icon-wrapper">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
            </div>
            <span class="menu-text text-gray-500">ออกจากระบบ</span>
        </button>
    `;
    
    return `<nav class="floating-menu fixed top-4 left-4 z-40">${html}</nav>`;
}

// Render mobile menu
function renderMobileMenu(currentPage) {
    let menuItems = '';
    
    adminMenuItems.forEach(item => {
        const isActive = currentPage === item.id;
        menuItems += `
            <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 ${isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'hover:bg-gray-50 text-gray-700'}">
                <span class="${isActive ? 'text-blue-500' : item.iconColor} w-5 h-5">${item.icon.replace('w-6 h-6', 'w-5 h-5')}</span>
                ${item.label}
            </a>
        `;
    });
    
    return `
        <div class="admin-mobile-nav fixed top-4 left-4 z-50">
            <button onclick="toggleAdminMobileMenu()" class="flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                <svg class="w-6 h-6 text-gray-700 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
            <div id="adminMobileMenu" class="hidden absolute top-16 left-0 w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                <nav class="py-2">
                    ${menuItems}
                    <div class="border-t border-gray-100 my-2"></div>
                    <button onclick="logout()" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-500 w-full text-left">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        ออกจากระบบ
                    </button>
                </nav>
            </div>
        </div>
    `;
}

// Main render function
function renderAdminNav(containerId, currentPage = 'home') {
    injectAdminNavStyles();
    
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = renderDesktopMenu(currentPage) + renderMobileMenu(currentPage);
    } else {
        // If no container, insert at beginning of body
        document.body.insertAdjacentHTML('afterbegin', renderDesktopMenu(currentPage) + renderMobileMenu(currentPage));
    }
}

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('[data-admin-nav]');
    if (navContainer) {
        const currentPage = navContainer.dataset.adminNav || 'home';
        renderAdminNav(navContainer.id, currentPage);
    }
});
