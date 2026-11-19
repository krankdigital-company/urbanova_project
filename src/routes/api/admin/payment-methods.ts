import { createClient } from "@supabase/supabase-js";
import { createFileRoute } from "@tanstack/react-router";

const paymentFields = [
  "id",
  "key",
  "label",
  "description",
  "integration_mode",
  "instructions",
  "account_number",
  "merchant_id",
  "store_id",
  "store_password",
  "app_key",
  "app_secret",
  "api_username",
  "api_password",
  "api_base_url",
  "success_url",
  "fail_url",
  "cancel_url",
  "ipn_url",
  "requires_txn_id",
  "is_enabled",
  "sort_order",
] as const;

const getAdminClient = async (request: Request) => {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) throw new Response("Unauthorized", { status: 401 });

  const supabase = createClient(
    process.env["SUPABASE_URL"] ?? "",
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) throw new Response("Unauthorized", { status: 401 });

  const admin = createClient(
    process.env["SUPABASE_URL"] ?? "",
    process.env["SUPABASE_SERVICE_ROLE_KEY"] ?? "",
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
  const { data: role } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .in("role", ["admin", "manager", "moderator", "editor"])
    .maybeSingle();
  if (!role) throw new Response("Forbidden", { status: 403 });

  return admin;
};

export const Route = createFileRoute("/api/admin/payment-methods")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const admin = await getAdminClient(request);
        const { data, error } = await admin
          .from("payment_methods")
          .select(paymentFields.join(", "))
          .order("sort_order", { ascending: true });
        if (error) return Response.json({ error: error.message }, { status: 500 });
        return Response.json(data ?? []);
      },
      POST: async ({ request }) => {
        const admin = await getAdminClient(request);
        const body = await request.json();
        const payload = Object.fromEntries(
          paymentFields.filter((field) => field in body).map((field) => [field, body[field]]),
        );
        const { data, error } = await admin
          .from("payment_methods")
          .upsert(payload)
          .select(paymentFields.join(", "))
          .single();
        if (error) return Response.json({ error: error.message }, { status: 400 });
        return Response.json(data);
      },
      DELETE: async ({ request }) => {
        const admin = await getAdminClient(request);
        const { id } = await request.json();
        const { error } = await admin.from("payment_methods").delete().eq("id", id);
        if (error) return Response.json({ error: error.message }, { status: 400 });
        return Response.json({ ok: true });
      },
    },
  },
});
