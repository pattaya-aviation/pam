/**
 * Pill Dropdown Menu Component
 * Auto-renders hamburger dropdown menu for mobile navigation
 * 
 * Usage: Include this script in any admin page.
 * It reads `adminNavBasePath` (from admin-nav.js) to build correct links.
 * Place a <div id="pillDropdownContainer"></div> where the hamburger should appear.
 * Or call renderPillDropdown(targetElement) manually.
 */

(function () {
    // Menu items — single source of truth
    const pillMenuItems = [
        {
            href: 'index.html',
            label: 'ภาพรวม',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />'
        },
        {
            href: 'vfc/index.html',
            label: 'Voice for Change',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />'
        },
        {
            href: 'settings/index.html',
            label: 'ตั้งค่า',
            icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />'
        }
    ];

    // Build base path using the same logic as admin-nav.js
    const _pillBase = (function () {
        const path = window.location.pathname;
        const match = path.match(/\/(?:admin_portal|portal)\/([^/]+)\//);
        return match ? '../' : '';
    })();

    function _svg(inner) {
        return '<svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">' + inner + '</svg>';
    }

    /**
     * Render the pill-hamburger-wrap HTML into a target element.
     * @param {HTMLElement} target — element to insert into (replaces innerHTML)
     * @param {object} [opts] — options
     * @param {boolean} [opts.noTabs] — if true, adds margin-left:auto (for no-tabs pages)
     */
    window.renderPillDropdown = function (target, opts) {
        if (!target) return;
        var noTabs = opts && opts.noTabs;
        // Apply margin-left:auto on the container itself (flex child of .admin-tabs-row)
        if (noTabs) target.style.marginLeft = 'auto';

        var h = '<div class="pill-hamburger-wrap">';
        h += '<button class="pill-hamburger" onclick="togglePillMenu()" aria-label="เมนู">';
        h += _svg('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16" />');
        h += '</button>';
        h += '<div class="pill-dropdown hidden" id="pillDropdown">';

        pillMenuItems.forEach(function (item) {
            h += '<a href="' + _pillBase + item.href + '" class="pill-dropdown-item">';
            h += _svg(item.icon);
            h += item.label + '</a>';
        });

        h += '<div class="pill-dropdown-divider"></div>';
        h += '<button onclick="logout()" class="pill-dropdown-item pill-dropdown-logout">';
        h += _svg('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />');
        h += 'ออกจากระบบ</button>';
        h += '</div></div>';

        target.innerHTML = h;
    };

    // Toggle + close-on-outside-click
    window.togglePillMenu = function () {
        var dd = document.getElementById('pillDropdown');
        if (dd) dd.classList.toggle('hidden');
    };

    document.addEventListener('click', function (e) {
        var wrap = document.querySelector('.pill-hamburger-wrap');
        var dd = document.getElementById('pillDropdown');
        if (wrap && dd && !wrap.contains(e.target)) dd.classList.add('hidden');
    });

    // Auto-render if container exists
    document.addEventListener('DOMContentLoaded', function () {
        var c = document.getElementById('pillDropdownContainer');
        if (c) {
            var noTabs = c.hasAttribute('data-no-tabs');
            renderPillDropdown(c, { noTabs: noTabs });
        }
    });
})();
