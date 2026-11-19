revoke execute on function public.is_staff(uuid) from anon, public;
revoke execute on function public.is_manager(uuid) from anon, public;
grant execute on function public.is_staff(uuid) to authenticated, service_role;
grant execute on function public.is_manager(uuid) to authenticated, service_role;