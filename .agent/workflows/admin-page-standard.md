---
description: Standard layout for admin sub-pages (header + floating icons + underline tabs)
---

# Admin Page Standard Layout

โครงสร้างมาตรฐานสำหรับทุกหน้า admin sub-page

```
                                                    (🔍) (🔔●)   ← fixed top-4 right-4
Page Title
Page subtitle

Tab1    Tab2    Tab3    Tab4    Tab5
─────────────────────────────────────               ← underline tab bar

[Content Area]
```

## 1. Floating Icons (Search + Bell)

ตำแหน่ง `fixed top-4 right-4 z-50` ขนาด `w-14 h-14` พื้นหลังกระจกฝ้า

ๆๅ
ๅ    <div class="flex items-center gap-3">
        <button onclick="handleSearch()" class="flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
        </button>
        <button onclick="toggleNotifPanel()" class="flex items-center justify-center w-14 h-14 bg-white/80 backdrop-blur-xl rounded-full border border-gray-200 hover:bg-gray-50 transition-colors relative">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span id="notifDot" class="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full" style="display:none;"></span>
        </button>
    </div>
</div>
```

## 2. Header

```html
<div class="mb-4">
    <h1 class="text-xl font-bold text-gray-900">[Page Title]</h1>
    <p class="text-sm text-gray-500 mt-0.5">[Page subtitle]</p>
</div>
```

## 3. Underline Tab Bar

```css
.tab-bar {
    display: flex; align-items: center; gap: 0;
    border-bottom: 2px solid #e5e7eb;
    width: 100%; margin-bottom: 20px;
}
.tab-btn {
    padding: 10px 20px; border: none; border-bottom: 2px solid transparent;
    margin-bottom: -2px; font-size: 0.8125rem; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
    background: transparent; color: #6b7280; white-space: nowrap;
}
.tab-btn:hover { color: #111827; }
.tab-btn.active { color: #2563eb; border-bottom-color: #2563eb; font-weight: 600; }
```

```html
<div class="tab-bar" style="margin-bottom:16px">
    <button class="tab-btn active" id="tabXxx" onclick="switchTab('xxx')">Tab 1</button>
    <button class="tab-btn" id="tabYyy" onclick="switchTab('yyy')">Tab 2</button>
</div>
```

```javascript
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    const btnId = 'tab' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
    const contentId = 'content' + tabName.charAt(0).toUpperCase() + tabName.slice(1);
    document.getElementById(btnId).classList.add('active');
    document.getElementById(contentId).classList.remove('hidden');
}
```

## Reference

- Admin Portal Home: `page/admin_portal/index.html`
- VFC Admin (ตัวอย่างเต็ม): `page/admin_portal/vfc-admin/index.html`