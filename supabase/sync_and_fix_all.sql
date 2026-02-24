-- ============================================================
-- sync_and_fix_all.sql
-- รัน SQL นี้ใน Supabase → SQL Editor
-- ทำทุกอย่างในครั้งเดียว
-- ============================================================

-- STEP 1: สร้าง RPC function (create or replace = ปลอดภัย)
create or replace function public.register_pending_user(
    p_email  text,
    p_name   text default null
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
    v_record portal_users;
begin
    insert into public.portal_users (
        email, name, status, created_at, last_login
    )
    values (
        p_email,
        coalesce(p_name, p_email),
        'pending',
        now(),
        now()
    )
    on conflict (email) do update
        set last_login = now()
    returning * into v_record;

    return json_build_object(
        'email',  v_record.email,
        'status', v_record.status
    );
end;
$$;

grant execute on function public.register_pending_user to anon, authenticated;

-- ============================================================
-- STEP 2: ดูว่าใครอยู่ใน auth.users บ้าง (ใครเคย login)
-- ============================================================
select
    au.email,
    au.raw_user_meta_data->>'full_name'  as name,
    au.created_at                         as first_signup,
    au.last_sign_in_at,
    pu.status                             as portal_status
from auth.users au
left join public.portal_users pu on pu.email = au.email
where au.email like '%@pattayaaviation.com'
order by au.last_sign_in_at desc nulls last;

-- ============================================================
-- STEP 3: Sync ทุกคนใน auth.users เข้า portal_users (pending)
--         ถ้ามีแล้วก็แค่ update last_login ไม่เขียนทับ status
-- ============================================================
insert into public.portal_users (email, name, status, created_at, last_login)
select
    au.email,
    coalesce(au.raw_user_meta_data->>'full_name', au.email),
    'pending',
    au.created_at,
    coalesce(au.last_sign_in_at, au.created_at)
from auth.users au
where au.email like '%@pattayaaviation.com'
on conflict (email) do update
    set last_login = excluded.last_login;

-- ============================================================
-- STEP 4: ดูผลลัพธ์ใน portal_users ทั้งหมด
-- ============================================================
select email, name, status, created_at, last_login
from public.portal_users
order by last_login desc;
