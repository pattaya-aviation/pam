-- ============================================================
-- เปิด Realtime สำหรับ portal_users
-- รัน SQL นี้ใน Supabase → SQL Editor
-- ============================================================

-- เพิ่ม portal_users เข้า supabase_realtime publication
alter publication supabase_realtime add table portal_users;

-- ตรวจสอบว่าเปิดแล้ว:
-- select * from pg_publication_tables where pubname = 'supabase_realtime';
