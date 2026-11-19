-- RLS policies use these SECURITY DEFINER helpers for authenticated writes.
-- Restore execution for authenticated users so admin-managed tables can be updated.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_manager(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
