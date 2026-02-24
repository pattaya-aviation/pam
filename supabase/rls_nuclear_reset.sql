-- ============================================================
-- NUCLEAR RESET: ล้าง policies ทั้งหมด แล้วตั้งใหม่อย่างถูกต้อง
-- รัน SQL นี้ใน Supabase → SQL Editor
-- ============================================================

-- Step 1: ลบ policies ทั้งหมดที่อาจมีชื่อซ้ำหรือขัดแย้งกัน
do $$
declare
    r record;
begin
    for r in (
        select policyname
        from pg_policies
        where tablename = 'portal_users'
    ) loop
        execute format('drop policy if exists %I on portal_users', r.policyname);
    end loop;
end;
$$;

-- Step 2: ตรวจสอบก่อนว่าลบหมดหรือยัง
-- select policyname from pg_policies where tablename = 'portal_users';

-- Step 3: สร้าง policies ใหม่ที่ถูกต้องทั้งหมด

-- [A] ทุกคนที่ authenticated อ่านได้ทุก row
create policy "select_all_authenticated"
    on portal_users for select
    to authenticated
    using (true);

-- [B] user INSERT record ของตัวเองได้ (auth-callback ครั้งแรก)
create policy "insert_own_record"
    on portal_users for insert
    to authenticated
    with check ( auth.email() = email );

-- [C] admin (approved user) INSERT record ของคนอื่นได้
--     ใช้สำหรับปุ่ม "เพิ่มผู้ใช้" ใน settings
create policy "admin_insert_any"
    on portal_users for insert
    to authenticated
    with check (
        exists (
            select 1
            from portal_users
            where email  = auth.email()
              and status = 'approved'
        )
    );

-- [D] user UPDATE last_login ของตัวเองได้ (login ซ้ำ)
create policy "update_own_login"
    on portal_users for update
    to authenticated
    using  ( auth.email() = email )
    with check (
        -- ห้ามแก้ status ด้วยตัวเอง
        status = (select status from portal_users where email = auth.email())
    );

-- [E] admin UPDATE record ของทุกคนได้ (อนุมัติ / เพิกถอน / แก้ permissions)
create policy "admin_update_any"
    on portal_users for update
    to authenticated
    using (
        exists (
            select 1
            from portal_users
            where email  = auth.email()
              and status = 'approved'
        )
    );

-- [F] BONUS: ถ้า Supabase session ไม่ fully ready ตอน callback
--     ให้ anon INSERT pending record ได้ (fallback)
create policy "anon_insert_pending"
    on portal_users for insert
    to anon
    with check ( status = 'pending' );

-- ============================================================
-- ตรวจสอบผลลัพธ์
-- ============================================================
select policyname, cmd, roles
from pg_policies
where tablename = 'portal_users'
order by cmd, policyname;
