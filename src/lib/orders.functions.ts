import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const itemSchema = z.object({
  productId: z.string().max(200).optional(),
  productName: z.string().min(1).max(300),
  image: z.string().max(1000).default(""),
  size: z.string().max(50).default(""),
  color: z.string().max(100).default(""),
  unitPrice: z.number().min(0),
  quantity: z.number().int().min(1).max(99),
});

const orderSchema = z.object({
  customerName: z.string().trim().min(2).max(120),
  customerEmail: z.string().trim().email().max(255).optional().or(z.literal("")),
  customerPhone: z.string().trim().min(6).max(30),
  shippingAddress: z.string().trim().min(3).max(500),
  city: z.string().trim().max(120).default(""),
  district: z.string().trim().max(120).default(""),
  notes: z.string().trim().max(1000).default(""),
  currency: z.string().max(5).default("$"),
  userId: z.string().uuid().optional().or(z.literal("")),
  discountCode: z.string().trim().max(60).default(""),
  paymentMethod: z.string().trim().max(60).default("cod"),
  paymentTxnId: z.string().trim().max(120).default(""),
  items: z.array(itemSchema).min(1).max(50),
});

const normalizePhone = (p: string) => p.replace(/[^\d]/g, "").slice(-11);

type Admin = Awaited<typeof import("@/integrations/supabase/client.server")>["supabaseAdmin"];

async function resolveShipping(admin: Admin, district: string, subtotal: number) {
  if (!district) return { charge: 0, eta: "" };
  const { data } = await admin
    .from("delivery_zones")
    .select("charge, free_threshold, eta")
    .eq("district", district)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  if (!data) return { charge: 0, eta: "" };
  const threshold = data.free_threshold == null ? null : Number(data.free_threshold);
  const charge = threshold != null && subtotal >= threshold ? 0 : Number(data.charge);
  return { charge, eta: data.eta ?? "" };
}

async function resolveDiscount(admin: Admin, code: string, subtotal: number) {
  if (!code) return { amount: 0, id: null as string | null, error: "" };
  const { data } = await admin
    .from("discounts")
    .select("*")
    .ilike("code", code)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!data) return { amount: 0, id: null, error: "Promo code not found." };
  const now = Date.now();
  if (data.starts_at && new Date(data.starts_at).getTime() > now)
    return { amount: 0, id: null, error: "This promo code isn't active yet." };
  if (data.ends_at && new Date(data.ends_at).getTime() < now)
    return { amount: 0, id: null, error: "This promo code has expired." };
  if (data.min_order && subtotal < Number(data.min_order))
    return { amount: 0, id: null, error: `Minimum order for this code is ${Number(data.min_order)}.` };
  if (data.usage_limit && (data.used_count ?? 0) >= data.usage_limit)
    return { amount: 0, id: null, error: "This promo code has reached its usage limit." };

  let amount =
    data.discount_type === "percent" ? (subtotal * Number(data.value)) / 100 : Number(data.value);
  if (data.max_discount) amount = Math.min(amount, Number(data.max_discount));
  amount = Math.min(Math.round(amount * 100) / 100, subtotal);

  return { amount, id: data.id as string, error: "" };
}

/** Public quote: delivery charge + promo validation before placing an order. */
export const quoteCheckout = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({
        district: z.string().trim().max(120).default(""),
        discountCode: z.string().trim().max(60).default(""),
        subtotal: z.number().min(0),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const shipping = await resolveShipping(supabaseAdmin, data.district, data.subtotal);
    const discount = await resolveDiscount(supabaseAdmin, data.discountCode, data.subtotal);
    return {
      shipping: shipping.charge,
      eta: shipping.eta,
      discount: discount.amount,
      discountError: discount.error,
      total: Math.max(0, data.subtotal - discount.amount) + shipping.charge,
    };
  });

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const subtotal = data.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shipping = await resolveShipping(supabaseAdmin, data.district, subtotal);
    const discount = await resolveDiscount(supabaseAdmin, data.discountCode, subtotal);
    if (data.discountCode && discount.error) throw new Error(discount.error);

    const total = Math.max(0, subtotal - discount.amount) + shipping.charge;
    const stamp = Date.now().toString().slice(-7);
    const orderNumber = `URB-${stamp}${Math.floor(Math.random() * 90 + 10)}`;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        invoice_number: `INV-${stamp}`,
        channel: "online",
        user_id: data.userId ? data.userId : null,
        customer_name: data.customerName,
        customer_email: data.customerEmail || null,
        customer_phone: normalizePhone(data.customerPhone),
        shipping_address: data.shippingAddress,
        city: data.city,
        district: data.district,
        notes: data.notes,
        subtotal,
        shipping: shipping.charge,
        discount_code: data.discountCode || "",
        discount_amount: discount.amount,
        payment_method: data.paymentMethod,
        payment_status: data.paymentMethod === "cod" ? "unpaid" : "pending",
        payment_txn_id: data.paymentTxnId,
        total,
        currency: data.currency,
        status: "pending",
      })
      .select()
      .single();

    if (error || !order) throw new Error(error?.message ?? "Could not place order");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      data.items.map((i) => ({
        order_id: order.id,
        product_id: i.productId ?? null,
        product_name: i.productName,
        image: i.image,
        size: i.size,
        color: i.color,
        unit_price: i.unitPrice,
        quantity: i.quantity,
      })),
    );
    if (itemsError) throw new Error(itemsError.message);

    // Deduct stock for matching variants and log the movement.
    for (const i of data.items) {
      if (!i.productId) continue;
      const { data: variant } = await supabaseAdmin
        .from("product_variants")
        .select("id, stock")
        .eq("product_id", i.productId)
        .eq("size", i.size)
        .eq("color", i.color)
        .limit(1)
        .maybeSingle();
      if (!variant) continue;
      await supabaseAdmin
        .from("product_variants")
        .update({ stock: Math.max(0, (variant.stock ?? 0) - i.quantity) })
        .eq("id", variant.id);
      await supabaseAdmin.from("stock_movements").insert({
        variant_id: variant.id,
        product_id: i.productId,
        delta: -i.quantity,
        reason: "sale",
        note: `Order ${orderNumber}`,
      });
    }

    if (discount.id) {
      await supabaseAdmin.from("discount_redemptions").insert({
        discount_id: discount.id,
        order_id: order.id,
        user_id: data.userId ? data.userId : null,
        phone: normalizePhone(data.customerPhone),
        amount: discount.amount,
      });
      const { data: d } = await supabaseAdmin
        .from("discounts")
        .select("used_count")
        .eq("id", discount.id)
        .maybeSingle();
      await supabaseAdmin
        .from("discounts")
        .update({ used_count: (d?.used_count ?? 0) + 1 })
        .eq("id", discount.id);
    }

    await supabaseAdmin.from("order_events").insert({
      order_id: order.id,
      status: "pending",
      note: "Order received and awaiting confirmation.",
    });

    return { orderNumber, total, currency: data.currency };
  });

export const trackOrders = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ phone: z.string().trim().min(6).max(30) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const phone = normalizePhone(data.phone);

    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, status, total, currency, created_at, city, district, payment_method, payment_status")
      .eq("customer_phone", phone)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    if (!orders?.length) return { orders: [] };

    const ids = orders.map((o) => o.id);
    const [{ data: items }, { data: events }] = await Promise.all([
      supabaseAdmin.from("order_items").select("*").in("order_id", ids),
      supabaseAdmin
        .from("order_events")
        .select("*")
        .in("order_id", ids)
        .order("created_at", { ascending: true }),
    ]);

    return {
      orders: orders.map((o) => ({
        ...o,
        items: (items ?? []).filter((i) => i.order_id === o.id),
        events: (events ?? []).filter((e) => e.order_id === o.id),
      })),
    };
  });
