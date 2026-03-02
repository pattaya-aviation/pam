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
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>',
        iconColor: '#3b82f6',
        iconBg: 'rgba(59, 130, 246, 0.1)'
    },
    {
        id: 'vfc',
        href: adminNavBasePath + 'vfc/index.html',
        label: 'Voice for Change',
        hoverWidth: '195px',
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>',
        iconColor: '#6366f1',
        iconBg: 'rgba(99, 102, 241, 0.1)'
    },
    {
        id: 'tax',
        href: adminNavBasePath + 'tax/index.html',
        label: 'Tax System',
        hoverWidth: '155px',
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.1)'
    },
    {
        id: 'settings',
        href: adminNavBasePath + 'settings/index.html',
        label: 'ตั้งค่าระบบ',
        hoverWidth: '160px',
        icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.1)'
    }
];

// Capture script base path at parse time (document.currentScript is null in event handlers)
const _adminNavScriptBase = (function () {
    if (document.currentScript && document.currentScript.src) {
        return document.currentScript.src.replace(/components\/admin-nav\.js.*$/, '');
    }
    return '';
})();

// Inject admin nav CSS via <link> tag
function injectAdminNavStyles() {
    if (!document.getElementById('admin-nav-styles')) {
        const link = document.createElement('link');
        link.id = 'admin-nav-styles';
        link.rel = 'stylesheet';
        link.href = _adminNavScriptBase
            ? _adminNavScriptBase + 'css/admin-nav.css'
            : adminNavBasePath + '../function/portal/css/admin-nav.css';
        document.head.appendChild(link);
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
        const iconStyle = isActive ? 'color:white' : 'color:' + item.iconColor;
        html += '<a href="' + item.href + '" class="menu-item ' + (isActive ? 'active' : '') + '" style="--hover-width: ' + item.hoverWidth + '">' +
            '<div class="icon-wrapper"><span style="display:flex;' + iconStyle + '">' + item.icon + '</span></div>' +
            '<span class="menu-text ' + (isActive ? 'text-white font-medium' : 'text-gray-700') + '">' + item.label + '</span>' +
            '</a>';
    });
    html += '<div class="menu-divider"></div>' +
        '<button onclick="logout()" class="menu-item" style="--hover-width: 165px">' +
        '<div class="icon-wrapper"><svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></div>' +
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

// Render mobile menu — floating pill style matching home navbar
function renderMobileMenu(currentPage) {
    const user = getAdminUser();
    const name = getUserDisplayName(user);
    const email = getUserEmail(user);

    const pageTitles = {
        home: 'Admin Portal',
        vfc: 'Voice for Change',
        tax: 'Tax System',
        settings: 'ตั้งค่าระบบ'
    };
    const pageTitle = pageTitles[currentPage] || 'Admin Portal';

    let menuItems = '';
    adminMenuItems.forEach(function (item) {
        const isActive = currentPage === item.id;
        const activeBg = isActive ? '#eff6ff' : 'transparent';
        const activeClr = isActive ? '#1d4ed8' : '#374151';
        const iconClr = isActive ? '#3b82f6' : '#6b7280';
        menuItems +=
            '<a href="' + item.href + '" style="display:flex;align-items:center;gap:12px;padding:11px 16px;' +
            'background:' + activeBg + ';font-weight:' + (isActive ? '600' : '400') + ';' +
            'text-decoration:none;color:' + activeClr + ';transition:background 0.15s"' +
            ' onmouseover="this.style.background=\'#f9fafb\'" onmouseout="this.style.background=\'' + activeBg + '\'">' +
            '<span style="color:' + iconClr + ';flex-shrink:0;display:flex">' +
            item.icon.replace(/w-6 h-6/g, 'w-5 h-5') + '</span>' +
            '<span style="font-size:0.875rem">' + item.label + '</span>' +
            '</a>';
    });

    return (
        '<div class="admin-mobile-nav" style="position:fixed;top:16px;left:50%;transform:translateX(-50%);' +
        'width:calc(100% - 2rem);max-width:420px;z-index:50">' +

        // ── Pill ─────────────────────────────────────────────────────
        '<div class="admin-mobile-pill" onclick="toggleAdminMobileMenu()">' +

        // Left: logo (same as home navbar)
        '<img src="' + adminNavBasePath + '../function/shared/logo/Pattaya Aviation.png" ' +
        'alt="Pattaya Aviation" style="height:28px;object-fit:contain;flex-shrink:0;margin-left:2px">' +

        // Right: hamburger icon
        '<div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;' +
        'border-radius:50%;background:rgba(255,255,255,0.6);flex-shrink:0">' +
        '<svg width="18" height="18" fill="none" stroke="#374151" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/>' +
        '</svg></div>' +

        '</div>' + // end pill

        // ── Dropdown ─────────────────────────────────────────────────
        '<div id="adminMobileMenu" class="admin-mobile-dropdown hidden">' +

        // User header
        '<div style="display:flex;align-items:center;gap:12px;padding:14px 16px 12px;border-bottom:1px solid rgba(229,231,235,0.6)">' +
        '<div class="pill-avatar" style="width:40px;height:40px;flex-shrink:0;background:linear-gradient(135deg,#3b82f6,#2563eb)">' +
        getUserAvatarHTML() + '</div>' +
        '<div style="min-width:0;flex:1">' +
        '<div style="font-size:0.875rem;font-weight:700;color:#111827;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + name + '</div>' +
        '<div style="font-size:0.72rem;color:#6b7280;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:1px">' + email + '</div>' +
        '</div></div>' +

        // Nav items
        '<nav style="padding:6px 0">' + menuItems + '</nav>' +

        // Logout
        '<div style="border-top:1px solid rgba(229,231,235,0.6);padding:4px 0">' +
        '<button onclick="logout()" style="display:flex;align-items:center;gap:12px;padding:11px 16px;width:100%;' +
        'border:none;background:transparent;cursor:pointer;font-size:0.875rem;color:#9ca3af;text-align:left;transition:background 0.15s,color 0.15s"' +
        ' onmouseover="this.style.background=\'#fef2f2\';this.style.color=\'#ef4444\'"' +
        ' onmouseout="this.style.background=\'transparent\';this.style.color=\'#9ca3af\'">' +
        '<svg style="flex-shrink:0" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>' +
        '</svg>ออกจากระบบ' +
        '</button></div>' +

        '</div>' + // end dropdown
        '</div>'   // end wrapper
    );
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
