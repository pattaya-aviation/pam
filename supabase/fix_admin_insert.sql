-- ============================================================
-- fix_admin_insert.sql
-- รัน SQL นี้ใน Supabase → SQL Editor
-- แก้ปัญหา: Admin ไม่สามารถ insert/upsert record ของ user อื่นได้
-- ============================================================

-- ลบ policies เดิมที่ซ้ำซ้อน
drop policy if exists "user: insert own record"    on portal_users;
drop policy if exists "admin: update any record"   on portal_users;

-- 1) user insert record ของตัวเองได้ (ครั้งแรก login)
create policy "user: insert own record"
    on portal_users for insert
    to authenticated
    with check ( auth.email() = email );

-- 2) admin (approved) INSERT record ของคนอื่นได้
--    ใช้สำหรับกรณี manual add user จากหน้า settings
create policy "admin: insert any record"
    on portal_users for insert
    to authenticated
    with check (
        exists (
            select 1 from portal_users self
            where self.email  = auth.email()
              and self.status = 'approved'
        )
    );

-- 3) admin (approved) UPDATE record ของคนอื่นได้
create policy "admin: update any record"
    on portal_users for update
    to authenticated
    using (
        exists (
            select 1 from portal_users self
            where self.email  = auth.email()
              and self.status = 'approved'
        )
    );

-- ตรวจสอบ policies ทั้งหมด:
-- select policyname, cmd from pg_policies where tablename = 'portal_users' order by cmd, policyname;
