# PA System

> 📁 Project: `c:\dev\pa-system`  
> 🗓️ Last updated: 21 กุมภาพันธ์ 2569

ระบบ Internal Web Portal ของ Pattaya Aviation ประกอบด้วยระบบย่อย 3 ระบบ:
- **VFC** (Voice for Change) — รับ complaint / compliment / suggestion จากพนักงาน
- **Tax** — คำนวณภาษีและจัดการเอกสาร
- **Admin Portal** — จัดการข้อมูลจากระบบย่อยทั้งหมด

---

## 📁 โครงสร้างโปรเจกต์

```
pa-system/
├── .agent/
│   └── workflows/               ← AI agent workflows
│       └── admin-page-standard.md
│
├── function/                    ← Shared JS / CSS components
│   ├── portal/
│   │   ├── components/
│   │   │   └── admin-nav.js     ← Admin navbar (auth, routing, logout)
│   │   └── css/
│   │       ├── admin-base.css   ← Admin-wide base styles
│   │       └── vfc.css          ← VFC Admin page styles (extracted)
│   ├── shared/
│   │   ├── css/fonts.css
│   │   ├── js/supabase-config.js  ← Supabase client (shared ทุกหน้า)
│   │   └── logo/Pattaya Aviation.png
│   └── home/
│       ├── components/
│       │   ├── navbar.js        ← User navbar (login modal, routing)
│       │   └── vfc-form.js      ← VFC form logic (shared ทุก form)
│       └── css/
│           ├── user-base.css    ← User portal base styles + gradient themes
│           └── vfc-form.css     ← VFC form styles
│
└── page/
    ├── home/                    ← User-facing pages
    │   ├── main/
    │   │   └── pam.html         ← หน้าแรก (landing page)
    │   ├── vfc/
    │   │   ├── vfc-home.html    ← VFC landing page
    │   │   ├── complaint.html   ← แบบฟอร์มร้องเรียน
    │   │   ├── compliment.html  ← แบบฟอร์มชมเชย
    │   │   ├── suggestion.html  ← แบบฟอร์มเสนอแนะ
    │   │   └── track.html       ← ติดตามสถานะ
    │   └── tax/
    │       ├── tax.html         ← Tax system landing page
    │       └── tax-calculator.html ← คำนวณภาษี
    └── portal/                  ← Admin-only pages
        ├── index.html           ← Admin portal entry (auth gate)
        ├── vfc/
        │   └── index.html       ← VFC Admin dashboard
        └── settings/
            └── index.html       ← Admin settings
```

---

## 🔧 Dependencies (CDN)

| Library | ใช้ใน | วัตถุประสงค์ |
|---|---|---|
| Tailwind CSS v3 | ทุกหน้า | Utility CSS |
| Font Awesome 6 | ทุกหน้า | Icons |
| Supabase JS v2 | ทุกหน้าที่ดึงข้อมูล | Database client |
| Choices.js | VFC forms | Dropdown component |

---

## 🗂️ Component Map

### `function/shared/js/supabase-config.js`
- Initialize `window.supabaseClient` จาก URL + ANON_KEY
- แสดง error banner สีแดงที่บนสุดหน้าถ้า init ล้มเหลว
- Validate ว่า key เป็น JWT format (3 ส่วนคั่นด้วย `.`) ก่อน init

### `function/admin/components/admin-nav.js`
- Render sidebar navigation สำหรับ Admin Portal ทุกหน้า
- คำนวณ `adminNavBasePath` อัตโนมัติจาก folder depth
- จัดการ `logout()` — ลบ session และ redirect ไป `page/userpage/main/pam.html`
- **เป็น single source of truth สำหรับ admin logout** — ห้ามนิยาม `logout()` ซ้ำในไฟล์อื่น

### `function/user/components/navbar.js`
- Render top navbar สำหรับ user portal ทุกหน้า
- จัดการ login modal (Microsoft SSO + test login)
- Export `window.toggleMobileMenu`, `window.toggleSubmenu` สำหรับ inline onclick
- **ห้ามนิยาม `toggleMobileMenu()` ซ้ำในหน้า HTML** (เคยซ้ำใน `tax-home.html` แก้แล้ว)

### `function/user/components/vfc-form.js`
- Shared logic สำหรับ VFC forms ทั้ง 3 (complaint/compliment/suggestion)
- `init(options)` — entry point, ตั้งค่า dropdown groups และ form submit handler
- `getSections(station, department)` — ดึง sections จาก Supabase พร้อม generic fallback
- `generateTrackingNumber(prefix)` — สร้างเลขติดตาม
- Form ต้องมี `id="vfcForm"` เพื่อให้ `getElementById('vfcForm')` ทำงานถูกต้อง

---

## 🎨 Background Gradient Themes

หน้า user portal ใช้ CSS gradient แทนรูปภาพ Wallpaper — กำหนดใน `user-base.css`:

| Class | ใช้ใน | สี |
|---|---|---|
| `.bg-wrapper` (default) | `vfc-home.html`, `tax-home.html` | Blue → Purple |
| `.bg-complaint` | `complaint.html` | Red → Orange |
| `.bg-compliment` | `compliment.html` | Green → Teal |
| `.bg-suggestion` | `suggestion.html` | Blue → Indigo |
| `.bg-track` | `track.html` | Purple → Pink |
| `.bg-tax` | `tax-calculator.html`, `pa-ly01.html` | Teal → Indigo |

**วิธีใช้:**
```html
<div class="bg-wrapper bg-complaint"></div>
```

---

## 🔐 Authentication Flow

```
ผู้ใช้เปิด page/userpage/main/pam.html
    → คลิก Login (navbar.js แสดง modal)
    → Login สำเร็จ (Microsoft SSO หรือ test: test/1234)
    → sessionStorage.setItem('user', JSON.stringify({...}))
    → redirect → page/adminpage/index.html
        → ตรวจ sessionStorage (admin-nav.js)
        → ไม่มี session → redirect กลับ page/userpage/main/pam.html
        → มี session → แสดง Admin Portal
```

> ⚠️ **Security Note:** Test credentials `test/1234` ยังอยู่ใน `navbar.js` — ควรลบออกก่อน deploy production  
> ดู: `function/user/components/navbar.js` บรรทัดที่มี `email === 'test'`

---

## 🛡️ Security Notes

| รายการ | สถานะ | รายละเอียด |
|---|---|---|
| XSS ใน `track.html` | ✅ แก้แล้ว | ใช้ `esc()` sanitize ข้อมูลจาก DB ก่อน innerHTML |
| Test credentials | ⚠️ ยังอยู่ | `navbar.js` — ลบออกก่อน production |
| Supabase key validation | ✅ แก้แล้ว | `supabase-config.js` ตรวจ JWT format ก่อน init |

---

## 📝 Refactor Log (2569-02-21)

### ไฟล์ที่แก้ไขหลักๆ

| ไฟล์ | สิ่งที่ทำ |
|---|---|
| `function/user/css/user-base.css` | เพิ่ม gradient themes 6 แบบ แทน wallpaper image |
| `function/admin/css/vfc-admin.css` | **ใหม่** — Extract CSS จาก `vfc-admin/index.html` (977 บรรทัด) |
| `function/shared/js/supabase-config.js` | เพิ่ม JWT validation + error banner |
| `function/user/components/vfc-form.js` | แก้ `getSections()` generic fallback, form ID selector |
| `page/vfc/*.html` | ลบ wallpaper CSS เสีย, เพิ่ม `id="vfcForm"`, gradient class |
| `page/tax/*.html` | ลบ wallpaper CSS เสีย, เพิ่ม `.bg-tax` class |
| `page/admin_portal/vfc-admin/index.html` | ลด 2824 → 1930 บรรทัด (CSS ย้ายออก) |
| `page/tax/tax-home.html` | ลบ `toggleMobileMenu()` ซ้ำ (navbar.js จัดการแล้ว) |
| `function/portal/css/vfc.css` | **UI** — Deck card: scrollbar ย้ายเข้าใน body text, ปุ่ม action ใหญ่ขึ้น (34→44px) |

### โครงสร้างที่เปลี่ยน

| ก่อน | หลัง | เหตุผล |
|---|---|---|
| `page/home/` | `page/userpage/home/` | Group user pages ใต้ `userpage/` folder |
| `page/vfc/` | `page/userpage/vfc/` | เหตุผลเดียวกัน |
| `page/tax/` | `page/userpage/tax/` | เหตุผลเดียวกัน |
| `page/admin_portal/` | `page/adminpage/` | Rename ให้สั้น + ชัดขึ้น |
| `dont'use/` (root) | ลบทิ้ง | Apostrophe ในชื่อ folder + เป็น archive เก่า |
| `page/admin_portal/don't use/` | ลบทิ้ง | เหตุผลเดียวกัน |
| `function/admin/components/vfc-admin.js` | ลบทิ้ง | Dead code — ไม่ถูก include ในหน้าไหนเลย |

---

## 🚀 ขั้นตอนต่อไป (TODO)

- [ ] ลบ Test credentials ออกจาก `navbar.js` ก่อน deploy
- [ ] พัฒนา Tax Admin (`page/admin_portal/tax-admin/index.html`) ให้ครบฟังก์ชัน
- [ ] Extract Personal Info Card HTML จาก VFC forms 3 ไฟล์เป็น component ใน `vfc-form.js`
