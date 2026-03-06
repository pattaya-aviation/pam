# 🛩️ PAM — Pattaya Aviation System Management

> ระบบบริหารจัดการภายในของ Pattaya Aviation Co., Ltd.  
> เวอร์ชัน Static HTML + Supabase Backend | อัปเดตล่าสุด: 6 มีนาคม 2569

---

## 📋 สารบัญ

- [ภาพรวมระบบ](#-ภาพรวมระบบ)
- [โครงสร้างโปรเจกต์](#-โครงสร้างโปรเจกต์)
- [เทคโนโลยีที่ใช้](#-เทคโนโลยีที่ใช้)
- [โมดูลหลัก](#-โมดูลหลัก)
- [ข้อดีของระบบ](#-ข้อดีของระบบ--strengths)
- [ฐานข้อมูล](#-ฐานข้อมูล-supabase)
- [การติดตั้งและรัน](#-การติดตั้งและรัน)

---

## 🔭 ภาพรวมระบบ

PAM เป็นระบบเว็บภายในองค์กรสำหรับ Pattaya Aviation ประกอบด้วย **3 ส่วนหลัก**:

| ส่วน | คำอธิบาย | สถานะ |
|------|----------|-------|
| **Voice for Change (VFC)** | ระบบรับข้อร้องเรียน / ข้อเสนอแนะ / ชมเชย พร้อมติดตามสถานะ | ✅ ใช้งานได้ |
| **Tax System** | เครื่องมือคำนวณภาษีเงินได้บุคคลธรรมดา + แบบ ล.ย.01 | ✅ ใช้งานได้ |
| **Admin Portal** | แดชบอร์ดจัดการข้อมูล VFC, ตั้งค่าผู้ใช้, ธีม, อนุมัติ ID | ✅ ใช้งานได้ |

ระบบแบ่งเป็น **2 ฝั่ง** ชัดเจน:
- **User Portal** — หน้าที่พนักงานทั่วไปเข้าใช้ (ไม่ต้อง login)
- **Admin Portal** — หน้าจัดการสำหรับแอดมิน (ต้อง login ด้วย Microsoft Entra ID หรือ test user)

---

## 📁 โครงสร้างโปรเจกต์

```
PAM/
├── .agents/workflows/              # Workflow guides
│   └── admin-page-standard.md      # Standard admin page layout guide
│
├── function/                        # ฟังก์ชันและ Components
│   ├── shared/                      # ใช้ทั้ง User + Admin
│   │   ├── css/fonts.css            # Noto Sans Thai + Noto Sans, ซ่อน scrollbar
│   │   ├── js/supabase-config.js    # Supabase client initialization
│   │   └── logo/                    # โลโก้บริษัท (P_0.png, Pattaya Aviation.png)
│   ├── home/                        # เฉพาะ User Portal (Home)
│   │   ├── components/
│   │   │   ├── navbar.js            # Navbar component (Desktop pill + Mobile hamburger)
│   │   │   └── vfc-form.js          # VFC form logic + validation + file upload
│   │   └── css/
│   │       ├── pam.css              # Home page styles
│   │       ├── user-base.css        # Base styles (bg-wrapper, fullscreen)
│   │       └── vfc-form.css         # Choices.js override + form z-index
│   └── portal/                      # เฉพาะ Admin Portal
│       ├── components/
│       │   └── admin-nav.js         # Floating sidebar + mobile nav + theme loader
│       └── css/
│           ├── admin-base.css       # Dark mode CSS vars + shared overrides
│           ├── admin-nav.css        # Sidebar + profile pill + mobile nav
│           ├── admin-page.css       # Body reset + admin-content + header + pill tabs
│           ├── vfc-cards.css        # Inbox card styles (ic-*)
│           ├── vfc-dashboard.css    # Dashboard charts/stats
│           ├── vfc-deck.css         # Deck card view (swipeable)
│           ├── vfc-kanban.css       # Kanban board
│           ├── vfc-modal.css        # Detail modal + tab bar + dock
│           └── vfc-table.css        # Data table + pagination
│
├── page/                            # หน้าเว็บทั้งหมด (HTML)
│   ├── home/                        # User-facing pages
│   │   ├── main/pam.html            # หน้าแรกของระบบ
│   │   ├── vfc/                     # Voice for Change forms
│   │   │   ├── vfc.html             # เมนูหลัก VFC
│   │   │   ├── complaint.html       # ฟอร์มร้องเรียน
│   │   │   ├── suggestion.html      # ฟอร์มข้อเสนอแนะ
│   │   │   ├── compliment.html      # ฟอร์มชมเชย
│   │   │   └── track.html           # ติดตามสถานะ
│   │   └── tax/                     # Tax System
│   │       ├── tax.html             # เมนูหลักภาษี
│   │       ├── calculator.html      # เครื่องคำนวณภาษี
│   │       └── ly01.html            # ฟอร์ม ล.ย.01
│   └── portal/                      # Admin Portal pages
│       ├── index.html               # Login redirect
│       ├── auth-callback.html       # Microsoft auth callback
│       ├── pending.html             # Pending approval page
│       ├── vfc/index.html           # VFC Admin (Inbox/Cards/Board/Table/Dashboard)
│       └── settings/index.html      # Settings (ID/สิทธิ์, ผู้ใช้งาน, ธีม, การแจ้งเตือน)
│
├── supabase/                        # SQL migration scripts
│   ├── portal_users.sql             # portal_users table schema
│   ├── add_admin_rls.sql            # Row Level Security policies
│   └── add_permissions_column.sql   # Permissions JSONB column
│
├── deploy/                          # Deployment scripts
│   ├── deploy.ps1                   # PowerShell deploy script
│   ├── pam.nginx.conf               # Nginx config
│   └── setup-ec2.sh                 # EC2 setup script
│
├── _redirects.json                  # URL redirects for hosting
├── amplify.yml                      # AWS Amplify build config
└── pam-key.pem                      # SSH key (deploy only)
```

---

## 🛠 เทคโนโลยีที่ใช้

| เทคโนโลยี | การใช้งาน |
|-----------|----------|
| **HTML5** | โครงสร้างหน้า (Static HTML — ไม่มี Build Tool) |
| **Tailwind CSS (CDN)** | สไตล์หลัก (utility-first) |
| **Vanilla CSS** | Custom styles (admin-base, admin-page, vfc-*.css) |
| **JavaScript (Vanilla)** | Logic ทั้งหมด (ไม่ใช้ Framework) |
| **Supabase** | Backend-as-a-Service (DB + Auth + Storage) |
| **Choices.js** | Searchable dropdown (cascade: สถานี → ฝ่าย → แผนก) |
| **Google Fonts (Noto Sans Thai)** | ฟอนต์หลักทั้งระบบ |
| **MSAL.js** | Microsoft Entra ID authentication (Admin) |
| **QR Code API** | สร้าง + อ่าน QR Code สำหรับ tracking |

---

## 📦 โมดูลหลัก

### 1. 🎤 Voice for Change (VFC)

**ฝั่ง User:**
- ฟอร์ม 3 ประเภท: **ร้องเรียน**, **ข้อเสนอแนะ**, **ชมเชย**
- Form Validation — ตรวจสอบ subject, category, detail ก่อนส่ง
- File Upload — อัปโหลดไฟล์ไปยัง Supabase Storage
- Loading State — spinner ระหว่างส่ง ป้องกัน double-submit
- รองรับ **ไม่ระบุตัวตน** (anonymous toggle)
- Cascade dropdown: สถานี → ฝ่าย → แผนก (ดึงจาก Supabase)
- Tracking Number (VFC-XXXXXXXX) + QR Code
- หน้า **ติดตามสถานะ** — ค้นหาด้วย tracking number หรือ QR Code

**ฝั่ง Admin:**
- เชื่อมข้อมูลจริงจาก Supabase (`vfc_submissions` table)
- **6 แท็บ**: การ์ด (Deck), กระดาน (Kanban), รายการ (Table), ปฏิทิน, ถังขยะ, ตั้งค่า
- Multi-window modal — เปิดหลายข้อความพร้อมกัน + minimize ได้
- Minimized dock — FAB circle พร้อม badge แสดงจำนวนรายการที่ย่อไว้
- Admin Response — ตอบกลับ + เปลี่ยนสถานะ pending → in_progress → done
- Dashboard — สรุปสถิติ + กราฟ

### 2. 💰 Tax System

- **คำนวณภาษี** — รายได้, หักค่าใช้จ่าย, ลดหย่อน, ประกัน, กองทุน, บ้าน, เงินบริจาค
- **แบบ ล.ย.01** — ฟอร์มแจ้งรายการหักลดหย่อน

### 3. ⚙️ Admin Portal

- **Authentication** — Microsoft Entra ID (MSAL.js) + Test user (development)
- **Floating Sidebar Nav** — เมนูลอยซ้ายมือแบบ macOS Dock
- **Settings Page** — 4 แท็บ:
  - 🛡️ **ID / สิทธิ์** — อนุมัติ/ปฏิเสธ user จาก Microsoft auth, ตารางผู้ใช้ทั้งหมด
  - 🔐 **ผู้ใช้งาน** — กำหนด permission ว่า user เข้าดูหน้า/แท็บไหนได้บ้าง
  - 🎨 **ธีม** — Toggle 3 โหมด: สว่าง / มืด / ตามระบบ
  - 🔔 **การแจ้งเตือน** — (จะเพิ่มในอนาคต)
- **Dark Mode** — 3 โหมด (Light, Dark Grey, System) persist ผ่าน localStorage
- **Tab Permissions** — ซ่อน/แสดง tab ตาม `portal_users.permissions` (JSONB)

---

## ✅ ข้อดีของระบบ — Strengths

### 🎨 UI/UX Design
- ดีไซน์ **Glassmorphism** (backdrop-blur + semi-transparent) ทั้งระบบ
- การ์ดมุมโค้งใหญ่ (`rounded-[2rem]`, `rounded-[2.5rem]`) modern
- **Responsive Design** — รองรับทั้ง Desktop + Mobile + Tablet
- **Deck card view** — swipeable card stack สำหรับ VFC

### 🧩 Component Architecture
- **Navbar** (`navbar.js`) — reusable ทุกหน้า User
- **VFC Form** (`vfc-form.js`) — shared logic สำหรับ 3 ฟอร์ม
- **Admin Nav** (`admin-nav.js`) — sidebar + theme loader + mobile nav
- **Admin Page Standard** — workflow guide สำหรับสร้างหน้า admin ใหม่

### 🔗 Supabase Integration
- Centralized config (`supabase-config.js`)
- Cache mechanism สำหรับ Organization data
- Error handling ครบ

### 🔐 Authentication
- Microsoft Entra ID (production) + Test user (development)
- Session-based auth
- Auth guard ทุกหน้า admin
- User approval flow (pending → approved → rejected)

### 🌙 Dark Mode
- 3 โหมด: Light, Dark Grey, System (auto-detect OS)
- Apply ก่อน DOMContentLoaded (ไม่มี white flash)
- Listen OS `prefers-color-scheme` change event

### 📱 Mobile Experience
- Navbar แยก Desktop (floating pill) vs Mobile (hamburger)
- File upload + camera capture บน mobile
- QR Code scan จากรูปภาพ

---

## 🗄️ ฐานข้อมูล (Supabase)

### Tables:

| Table | คำอธิบาย | ใช้ใน |
|-------|----------|-------|
| `stations` | รายชื่อสถานี | VFC Form dropdowns |
| `departments` | รายชื่อฝ่าย | VFC Form dropdowns |
| `sections` | รายชื่อแผนก | VFC Form dropdowns |
| `vfc_submissions` | ข้อมูลจากฟอร์ม VFC | VFC Submit + Track + Admin |
| `portal_users` | ผู้ใช้ Admin Portal | Login + settings + permissions |

### VFC Submissions Schema:

```sql
tracking_number      : text         -- VFC-XXXXXXXX
type                 : text         -- complaint / compliment / suggestion
subject              : text
category             : text
is_anonymous         : boolean
reporter_name        : text
reporter_employee_id : text
reporter_station     : text
reporter_department  : text
reporter_section     : text
detail_station       : text
detail_department    : text
detail_section       : text
detail_text          : text
fix_text             : text
attachments          : jsonb        -- [{ name, url, size, type }]
status               : text         -- pending / in_progress / done
admin_response       : text         -- คำตอบจาก Admin
created_at           : timestamptz
```

### Portal Users Schema:

```sql
email                : text         -- Microsoft email
name                 : text         -- Display name
ms_id                : text         -- Microsoft user ID
status               : text         -- pending / approved / rejected
permissions          : jsonb        -- { inbox: true, cards: false, ... }
last_login           : timestamptz
created_at           : timestamptz
```

---

## 🚀 การติดตั้งและรัน

### Prerequisites
- เว็บเบราว์เซอร์ที่รองรับ ES6+ (Chrome, Firefox, Safari, Edge)
- ไม่ต้องติดตั้ง Node.js หรือ build tools

### วิธีรัน
1. เปิดไฟล์ `page/home/main/pam.html` ด้วยเว็บเบราว์เซอร์
2. หรือใช้ Local Server:
   ```bash
   # VS Code — ติดตั้ง Live Server extension
   # Python
   python -m http.server 8080
   # Node.js
   npx serve .
   ```

### Supabase Setup
1. สร้าง Storage Bucket ชื่อ `vfc-attachments` (public read)
2. รัน SQL scripts ใน `supabase/` folder:
   - `portal_users.sql` — สร้างตาราง portal_users
   - `add_admin_rls.sql` — ตั้ง Row Level Security
   - `add_permissions_column.sql` — เพิ่มคอลัมน์ permissions

### Admin Portal
1. คลิก **"เข้าสู่ระบบ"** ที่ Navbar
2. ใช้ Microsoft account (@pattayaaviation.com) หรือ Test user:
   - Email: `test` / Password: `1234`

---

## 📊 สรุปสถิติโค้ด

| รายการ | จำนวน |
|--------|-------|
| ไฟล์ HTML | 14 ไฟล์ |
| ไฟล์ JavaScript | 4 ไฟล์ |
| ไฟล์ CSS | 13 ไฟล์ |
| SQL Scripts | 3 ไฟล์ |

---

## 📝 Changelog

### v1.2 — 6 มี.ค. 2569
- ✅ เพิ่มหน้า Settings 4 แท็บ (ID/สิทธิ์, ผู้ใช้งาน, ธีม, การแจ้งเตือน)
- ✅ อนุมัติ/ปฏิเสธ user จาก Microsoft auth
- ✅ จำกัด permission ต่อ user ว่าเข้าดูหน้า/แท็บไหนได้
- ✅ Theme toggle 3 โหมด: สว่าง / มืด / ตามระบบ (OS auto-detect)
- ✅ เปลี่ยนฟอนต์ทั้งระบบเป็น Noto Sans Thai + Noto Sans
- ✅ แก้ dark mode: สีพื้นหลัง sidebar ตรงกับ content, pending cards, badges
- ✅ Minimized dock เปลี่ยนเป็น FAB circle + badge count
- ✅ Admin page standard workflow (`.agents/workflows/admin-page-standard.md`)
- ✅ Hamburger dropdown แสดงเฉพาะหน้า backend (ไม่มีหน้าแรก)
- ✅ ลบไฟล์ไม่จำเป็น: `vfc-layout.css`, `_trim2.ps1`, empty `portal/js/`, `.agent/` duplicate
- ✅ เพิ่ม SQL scripts: `portal_users.sql`, `add_admin_rls.sql`, `add_permissions_column.sql`

### v1.1 — 20 ก.พ. 2569
- ✅ เพิ่ม Form Validation ใน VFC
- ✅ เพิ่ม File Upload ไปยัง Supabase Storage
- ✅ เพิ่ม Loading State ป้องกัน double-submit
- ✅ เชื่อม Admin VFC กับข้อมูลจริงจาก Supabase
- ✅ เพิ่มฟังก์ชัน Admin Response + Status Update
- ✅ รวม Supabase config เป็น project เดียว
- ✅ ลบฟังก์ชันซ้ำซ้อน
- ✅ เพิ่ม meta description + aria-label ทุกหน้า

### v1.0 — Initial Release
- Voice for Change (VFC) — User + Admin
- Tax System — Calculator + ล.ย.01
- Admin Portal — Settings + Dark Mode

---

> 📝 อัปเดตล่าสุด: 6 มีนาคม 2569
