---
description: Standard layout for admin sub-pages (header + floating icons + floating pill tabs + hamburger dropdown)
---

# Admin Page Standard Layout

มาตรฐานโครงสร้างหน้า admin ประกอบด้วย:
- **Body resets** — margin, overflow, height
- **Admin-content** — main content area (desktop sidebar offset, mobile full width)
- **Floating icons** — admin-nav sidebar (desktop) / hamburger (mobile)
- **Floating pill tabs** — horizontal capsule tabs with active pill highlight
- **Pill hamburger + dropdown** — mobile-only hamburger inside tab row with dropdown menu (backend pages only)
- **Dark mode** — 3 โหมด: สว่าง / มืด / ตามระบบ (OS auto-detect)
- **Font** — Noto Sans Thai + Noto Sans (Google Fonts)

## Required CSS/JS Files

ทุกหน้า admin ต้องโหลดไฟล์เหล่านี้:

```html
<link rel="stylesheet" href="../../../function/shared/css/fonts.css" />       <!-- Noto Sans Thai -->
<link rel="stylesheet" href="../../../function/portal/css/admin-base.css" />   <!-- Dark mode vars + shared overrides -->
<link rel="stylesheet" href="../../../function/portal/css/admin-nav.css" />    <!-- Sidebar + pill nav styles -->
<link rel="stylesheet" href="../../../function/portal/css/admin-page.css" />   <!-- Body + layout + header + tabs -->
<script src="../../../function/shared/js/supabase-config.js"></script>          <!-- Supabase client -->
<script src="../../../function/portal/components/admin-nav.js"></script>        <!-- Sidebar + theme loader -->
<script src="../../../function/portal/components/pill-dropdown.js"></script>    <!-- Hamburger dropdown (auto-render) -->
```

## HTML Structure

```html
<!doctype html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Title — PAM Admin</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="../../../function/shared/css/fonts.css" />
  <link rel="stylesheet" href="../../../function/portal/css/admin-base.css" />
  <link rel="stylesheet" href="../../../function/portal/css/admin-nav.css" />
  <script src="../../../function/shared/js/supabase-config.js"></script>
  <script src="../../../function/portal/components/admin-nav.js"></script>
  <link rel="stylesheet" href="../../../function/portal/css/admin-page.css">
</head>

<body>
  <!-- Admin Navigation (sidebar auto-renders) -->
  <div id="adminNavContainer" data-admin-nav="PAGE_ID"></div>

  <!-- Main Content -->
  <div class="admin-content">

    <!-- Floating Pill Tabs + Hamburger -->
    <div class="admin-tabs-row">
      <div class="admin-tabs" id="navbarTabBar">
        <button class="admin-tab active" id="tabXxx" onclick="switchTab('xxx')">
          <svg>...</svg>
          Tab Label
        </button>
        <!-- More tabs... -->
      </div>
      <!-- Hamburger menu (mobile only) -->
      <div class="pill-hamburger-wrap">
        <button class="pill-hamburger" onclick="togglePillMenu()" aria-label="เมนู">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
        <div class="pill-dropdown hidden" id="pillDropdown">
          <a href="../vfc/index.html" class="pill-dropdown-item">
            <svg>...</svg> Voice for Change
          </a>
          <a href="../settings/index.html" class="pill-dropdown-item">
            <svg>...</svg> ตั้งค่า
          </a>
          <div class="pill-dropdown-divider"></div>
          <button onclick="logout()" class="pill-dropdown-item pill-dropdown-logout">
            <svg>...</svg> ออกจากระบบ
          </button>
        </div>
      </div>
    </div>

    <script>
      function togglePillMenu() {
        document.getElementById('pillDropdown').classList.toggle('hidden');
      }
      document.addEventListener('click', function(e) {
        const wrap = document.querySelector('.pill-hamburger-wrap');
        const dd = document.getElementById('pillDropdown');
        if (wrap && dd && !wrap.contains(e.target)) dd.classList.add('hidden');
      });
    </script>

    <!-- Tab Contents -->
    <div id="contentXxx" class="tab-content"><!-- Active tab --></div>
    <div id="contentYyy" class="tab-content hidden"><!-- Hidden tab --></div>

  </div><!-- /admin-content -->
</body>
</html>
```

## No-Tabs Variant (Hamburger Only)

ถ้าหน้านั้น **ไม่มี tab** (เช่น หน้า Admin Portal home) ให้ตัด `.admin-tabs` ออก เหลือแค่ hamburger:

```html
<div class="admin-content">
  <!-- Hamburger menu only (no pill tabs) -->
  <div class="admin-tabs-row">
    <!-- ⚠️ ต้องใส่ margin-left:auto เพื่อดัน hamburger ไปฝั่งขวา -->
    <div class="pill-hamburger-wrap" style="margin-left:auto">
      <button class="pill-hamburger" onclick="togglePillMenu()" aria-label="เมนู">...</button>
      <div class="pill-dropdown hidden" id="pillDropdown">
        <!-- menu items -->
      </div>
    </div>
  </div>

  <!-- Page content -->
  <div>...</div>
</div>
```

> **กฎ:** ถ้ามี tab เดียวหรือไม่มี tab เลย → ไม่ต้องใส่ `.admin-tabs` → แสดงแค่ hamburger menu + ต้องใส่ `style="margin-left:auto"` ให้ hamburger อยู่ฝั่งขวา

## Key CSS Classes

| Class | หน้าที่ |
|-------|---------|
| `.admin-content` | Main content area (desktop: margin-left 80px, mobile: full width) |
| `.admin-tabs-row` | Flex wrapper สำหรับ pill tabs + hamburger |
| `.admin-tabs` | Floating pill container (gray bg, border-radius 9999px) |
| `.admin-tab` | Individual tab pill button |
| `.admin-tab.active` | Active tab (white bg + shadow) |
| `.tab-badge` | Badge inside tab (e.g. count) |
| `.pill-hamburger-wrap` | Hamburger wrapper (mobile only) |
| `.pill-hamburger` | Circle hamburger button (mobile only) |
| `.pill-dropdown` | Dropdown menu from hamburger |
| `.pill-dropdown-item` | Dropdown menu item |
| `.pill-dropdown-logout` | Logout item (red on hover) |
| `.settings-card` | Card container with h3 + .desc (settings pages) |

## Tab Switching JS

```javascript
function switchTab(tabName) {
  document.querySelectorAll('.admin-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));

  const btnId = 'tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
  const contentId = 'content' + tabName.charAt(0).toUpperCase() + tabName.slice(1);

  document.getElementById(btnId).classList.add('active');
  const el = document.getElementById(contentId);
  el.classList.remove('hidden');
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = 'contentFadeIn 0.35s ease-out';
}
```

## Theme System

3 โหมด (เก็บใน `localStorage` key `admin-theme`):
- `light` — ค่าเริ่มต้น ไม่ add class
- `dark-grey` — add `body.dark-grey`
- `system` — อ่าน `prefers-color-scheme: dark` จาก OS แล้วเลือก light หรือ dark-grey อัตโนมัติ

Theme ถูก apply ก่อน DOMContentLoaded ผ่าน `admin-nav.js` เพื่อไม่มี white flash

## Naming Convention

- Tab button IDs: `tab{Name}` (e.g. `tabInbox`, `tabCards`)
- Content div IDs: `content{Name}` (e.g. `contentInbox`, `contentCards`)
- CSS class: `.admin-tab` (NOT `.tab-btn`)
- Tabs row wrapper: `.admin-tabs-row`
- Hamburger wrapper: `.pill-hamburger-wrap`
- Dropdown contains **only backend pages** (VFC + ตั้งค่า + ออกจากระบบ)

## Dropdown Menu Standard

Hamburger dropdown แสดง **เฉพาะหน้า backend**:
1. 🏠 ภาพรวม (`../index.html`)
2. 📢 Voice for Change (`../vfc/index.html`)
3. ⚙️ ตั้งค่า (`../settings/index.html`)
4. ─── divider ───
5. 🚪 ออกจากระบบ

> **ห้ามใส่** ลิงก์ไปหน้า User (pam.html) ใน dropdown

## File Organization

```
function/portal/
├── components/
│   └── admin-nav.js        # Sidebar + mobile nav + theme auto-load
├── css/
│   ├── admin-base.css       # Dark mode CSS vars + shared overrides
│   ├── admin-nav.css        # Sidebar + profile pill + mobile nav styles
│   └── admin-page.css       # Body reset + admin-content + header + pill tabs
```

## Reference Pages

- [portal/index.html](file:///c:/dev/PAM/page/portal/index.html) — No-tabs variant (hamburger only)
- [vfc/index.html](file:///c:/dev/PAM/page/portal/vfc/index.html) — Multi-tab variant
- [settings/index.html](file:///c:/dev/PAM/page/portal/settings/index.html) — Multi-tab variant
- [admin-page.css](file:///c:/dev/PAM/function/portal/css/admin-page.css)
