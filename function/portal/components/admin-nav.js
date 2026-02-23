/**
 * Admin Navigation Component
 * Renders floating menu for desktop and mobile dropdown menu
 * Usage: Include this script and call renderAdminNav('containerId', 'currentPage')
 */

// Detect basePath: if inside a subfolder of portal, prefix '../'
// Supports both /portal/ (local dev) and /admin_portal/ (AWS Amplify legacy path)
const adminNavBasePath = (function () {
    const path = window.location.pathname;
    // Match either /portal/subfolder/ or /admin_portal/subfolder/
    const adminPortalMatch = path.match(/\/(?:admin_portal|portal)\/([^/]+)\//);
    if (adminPortalMatch) {
        return '../'; // We're in a subfolder, go up one level
    }
    return ''; // We're directly in the portal root
})();

// ── User helpers ──
function getAdminUser() {
    try { return JSON.parse(sessionStorage.getItem('user') || '{}'); } catch (e) { return {}; }
}
function getUserAvatarHTML() {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="opacity:0.85"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>';
}
function getUserDisplayName(user) {
    return user.name || user.email || 'ผู้ใช้';
}
function getUserEmail(user) {
    return user.email || '';
}

// Menu items configuration
const adminMenuItems = [
    {
        id: 'home',
        href: adminNavBasePath + 'index.html',
        label: 'หน้าหลัก',
        hoverWidth: '140px',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
        iconColor: 'text-gray-900'
    },
    {
        id: 'vfc',
        href: adminNavBasePath + 'vfc/index.html',
        label: 'Voice for Change',
        hoverWidth: '195px',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>',
        iconColor: 'text-gray-900'
    },
    {
        id: 'tax',
        href: adminNavBasePath + 'tax/index.html',
        label: 'Tax System',
        hoverWidth: '155px',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
        iconColor: 'text-gray-900'
    },
    {
        id: 'settings',
        href: adminNavBasePath + 'settings/index.html',
        label: 'ตั้งค่าระบบ',
        hoverWidth: '160px',
        icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
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
    @media (min-width: 1024px) {
        .floating-menu { display: flex; }
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
        background: #3b82f6;
        border-color: #3b82f6;
        box-shadow: 0 4px 15px -3px rgba(59, 130, 246, 0.3);
    }
    .menu-item.active:hover {
        box-shadow: 0 8px 25px -5px rgba(59, 130, 246, 0.35);
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
    /* Mobile menu - show only on mobile */
    .admin-mobile-nav { display: block; }
    @media (min-width: 1024px) {
        .admin-mobile-nav { display: none; }
    }

    /* ── Profile Pill (desktop top-right) ── */
    .admin-profile-pill { display: none; }
    @media (min-width: 1024px) {
        .admin-profile-pill {
            display: flex;
            align-items: center;
            gap: 10px;
            position: fixed;
            top: 16px;
            right: 16px;
            z-index: 50;
            background: rgba(255,255,255,0.88);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(229,231,235,0.85);
            border-radius: 9999px;
            padding: 6px 14px 6px 6px;
            box-shadow: 0 4px 15px -3px rgba(0,0,0,0.08);
            cursor: default;
            transition: box-shadow 0.2s, background 0.2s;
        }
        .admin-profile-pill:hover {
            box-shadow: 0 8px 25px -5px rgba(0,0,0,0.13);
            background: rgba(255,255,255,0.98);
        }
        .admin-profile-pill:hover .pill-email {
            max-height: 18px;
            opacity: 1;
            margin-top: 1px;
        }
        .admin-profile-pill:hover .pill-logout {
            opacity: 1;
            pointer-events: auto;
        }
    }
    .pill-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #9ca3af;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 700;
        font-size: 0.8rem;
        flex-shrink: 0;
        letter-spacing: 0.02em;
        user-select: none;
    }
    .pill-info {
        display: flex;
        flex-direction: column;
        min-width: 0;
    }
    .pill-name {
        font-size: 0.8125rem;
        font-weight: 600;
        color: #111827;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
        line-height: 1.3;
    }
    .pill-email {
        font-size: 0.695rem;
        color: #6b7280;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 180px;
        max-height: 0;
        opacity: 0;
        transition: max-height 0.22s ease, opacity 0.22s ease, margin-top 0.22s ease;
        line-height: 1.3;
    }
    .pill-logout {
        margin-left: 6px;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #9ca3af;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s, background 0.15s, color 0.15s;
        flex-shrink: 0;
    }
    .pill-logout:hover {
        background: #fee2e2;
        color: #ef4444;
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

// Render desktop floating menu (left side)
function renderDesktopMenu(currentPage) {
    let html = '';
    adminMenuItems.forEach(function (item) {
        const isActive = currentPage === item.id;
        html += '<a href="' + item.href + '" class="menu-item ' + (isActive ? 'active' : '') + '" style="--hover-width: ' + item.hoverWidth + '">' +
            '<div class="icon-wrapper"><span class="' + (isActive ? 'text-white' : 'text-blue-500') + '">' + item.icon + '</span></div>' +
            '<span class="menu-text ' + (isActive ? 'text-white font-medium' : 'text-gray-700') + '">' + item.label + '</span>' +
            '</a>';
    });
    html += '<div class="menu-divider"></div>' +
        '<button onclick="logout()" class="menu-item" style="--hover-width: 165px">' +
        '<div class="icon-wrapper"><svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></div>' +
        '<span class="menu-text text-gray-500">ออกจากระบบ</span>' +
        '</button>';
    return '<nav class="floating-menu fixed top-4 left-4 z-40">' + html + '</nav>';
}

// Render desktop profile pill (top-right)
function renderProfilePill() {
    const user = getAdminUser();
    const name = getUserDisplayName(user);
    const email = getUserEmail(user);
    return '<div class="admin-profile-pill">' +
        '<div class="pill-avatar">' + getUserAvatarHTML() + '</div>' +
        '<div class="pill-info">' +
        '<span class="pill-name">' + name + '</span>' +
        '<span class="pill-email">' + email + '</span>' +
        '</div>' +
        '</div>';
}

// Render mobile menu
function renderMobileMenu(currentPage) {
    const user = getAdminUser();
    const name = getUserDisplayName(user);
    const email = getUserEmail(user);
    const firstName = (user.name || '').split(' ')[0] || name;

    let menuItems = '';
    adminMenuItems.forEach(function (item) {
        const isActive = currentPage === item.id;
        menuItems += '<a href="' + item.href + '" class="flex items-center gap-3 px-4 py-3 ' +
            (isActive ? 'bg-gray-100 text-gray-900 font-medium' : 'hover:bg-gray-50 text-gray-700') + '">' +
            '<span class="' + (isActive ? 'text-blue-500' : item.iconColor) + ' w-5 h-5">' + item.icon.replace(/w-6 h-6/g, 'w-5 h-5') + '</span>' +
            item.label + '</a>';
    });

    return '<div class="admin-mobile-nav fixed top-4 right-4 z-50">' +
        // Hamburger button (original style)
        '<button onclick="toggleAdminMobileMenu()" class="flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200 hover:bg-gray-50 transition-colors shadow-lg">' +
        '<svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>' +
        '</button>' +
        // Dropdown
        '<div id="adminMobileMenu" class="hidden absolute top-14 right-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl overflow-hidden" style="backdrop-filter:blur(20px)">' +
        // User info header
        '<div style="display:flex;align-items:center;gap:12px;padding:16px 16px 14px;border-bottom:1px solid #f3f4f6">' +
        '<div class="pill-avatar" style="width:44px;height:44px;flex-shrink:0">' + getUserAvatarHTML() + '</div>' +
        '<div style="min-width:0;flex:1">' +
        '<div style="font-size:0.875rem;font-weight:700;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + name + '</div>' +
        '<div style="font-size:0.72rem;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px">' + email + '</div>' +
        '</div>' +
        '</div>' +
        '<nav class="py-2">' +
        menuItems +
        '<div class="border-t border-gray-100 my-2"></div>' +
        '<button onclick="logout()" class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-500 w-full text-left">' +
        '<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>' +
        'ออกจากระบบ' +
        '</button>' +
        '</nav>' +
        '</div>' +
        '</div>';
}

// Global logout function — works from any admin page
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = adminNavBasePath + '../home/main/pam.html';
}

// Main render function
function renderAdminNav(containerId, currentPage) {
    currentPage = currentPage || 'home';
    injectAdminNavStyles();
    const container = document.getElementById(containerId);
    const html = renderDesktopMenu(currentPage) + renderProfilePill() + renderMobileMenu(currentPage);
    if (container) {
        container.innerHTML = html;
    } else {
        document.body.insertAdjacentHTML('afterbegin', html);
    }
}

// ── Theme Auto-Load ──
(function () {
    const saved = localStorage.getItem('admin-theme');
    if (saved && saved !== 'light') {
        document.documentElement.className = saved;
    }
})();

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', function () {
    const navContainer = document.querySelector('[data-admin-nav]');
    if (navContainer) {
        const currentPage = navContainer.dataset.adminNav || 'home';
        renderAdminNav(navContainer.id, currentPage);
    }
    const savedTheme = localStorage.getItem('admin-theme');
    if (savedTheme && savedTheme !== 'light') {
        document.body.classList.remove('dark-grey', 'dark-navy');
        document.body.classList.add(savedTheme);
    }
});
