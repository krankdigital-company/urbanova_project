import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const schema = z.object({ key: z.string().min(1).max(40) });
const paymentMethodSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1).max(40),
  label: z.string().max(120),
  description: z.string().max(500),
  instructions: z.string().max(2000),
  account_number: z.string().max(120),
  requires_txn_id: z.boolean(),
  is_enabled: z.boolean(),
  sort_order: z.number().int(),
});

const assertPaymentAdmin = async (userId: string) => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: roles } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  const allowed = (roles ?? []).some((r: { role: string }) =>
    ["admin", "manager", "moderator", "editor"].includes(r.role),
  );
  if (!allowed) throw new Response("Forbidden", { status: 403 });
  return supabaseAdmin;
};

/**
 * Returns the payment instructions + merchant account number for ONE selected
 * payment method. Account numbers are not readable through the public Data API
 * (column-level grants), so they are only released here, one method at a time,
 * at the checkout payment step.
 */
export const getPaymentInstructions = createServerFn({ method: "GET" })
  .inputValidator((data) => schema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("payment_methods")
      .select("key, instructions, account_number")
      .eq("key", data.key)
      .eq("is_enabled", true)
      .maybeSingle();

    if (error || !row) return { key: data.key, instructions: "", accountNumber: "" };

    return {
      key: row.key,
      instructions: row.instructions ?? "",
      accountNumber: row.account_number ?? "",
    };
  });

/**
 * Staff-only listing of payment methods including the sensitive
 * account_number / instructions columns (not readable via the Data API).
 */
export const listPaymentMethodsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const supabaseAdmin = await assertPaymentAdmin(context.userId);

    const { data, error } = await supabaseAdmin
      .from("payment_methods")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return data ?? [];
  });

export const savePaymentMethodAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => paymentMethodSchema.parse(data))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertPaymentAdmin(context.userId);
    const { error } = await supabaseAdmin.from("payment_methods").upsert(data);
    if (error) throw error;
    return { ok: true };
  });

export const deletePaymentMethodAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = await assertPaymentAdmin(context.userId);
    const { error } = await supabaseAdmin.from("payment_methods").delete().eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });
