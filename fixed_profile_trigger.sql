-- Function to create a profile automatically when a user signs up
-- This trigger must be run in your Supabase SQL Editor

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    name, 
    role, 
    user_type,
    phone, 
    hourly_rate, 
    email_verified,
    updated_at
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    coalesce(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'hourly_rate')::numeric,
    false,
    now()
  );
  return new;
end;
$$;

-- Trigger to call the function after a new user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
