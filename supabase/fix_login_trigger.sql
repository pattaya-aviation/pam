-- ============================================================
-- fix_login_trigger.sql
-- แก้ UPDATE trigger ให้ upsert (insert ถ้าไม่มี, update ถ้ามีแล้ว)
-- รองรับทั้ง user ใหม่และ user เก่าที่ยังไม่มี record ใน portal_users
-- รัน SQL นี้ใน Supabase → SQL Editor
-- ============================================================

create or replace function public.handle_auth_user_login()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    -- ยิงเมื่อมีการ sign in (last_sign_in_at เปลี่ยน)
    if new.last_sign_in_at is distinct from old.last_sign_in_at
       and new.email like '%@pattayaaviation.com'
    then
        -- upsert: สร้างใหม่ถ้าไม่มี / update last_login ถ้ามีแล้ว
        insert into public.portal_users (
            email,
            name,
            ms_id,
            status,
            created_at,
            last_login
        )
        values (
            new.email,
            coalesce(new.raw_user_meta_data->>'full_name', new.email),
            coalesce(new.raw_user_meta_data->>'provider_id', ''),
            'pending',
            now(),
            new.last_sign_in_at
        )
        on conflict (email) do update
            set last_login = new.last_sign_in_at;
            -- ไม่ override status ที่ admin ตั้งไว้แล้ว
    end if;

    return new;
end;
$$;

-- Recreate trigger
drop trigger if exists on_auth_user_login on auth.users;

create trigger on_auth_user_login
    after update on auth.users
    for each row
    execute function public.handle_auth_user_login();
