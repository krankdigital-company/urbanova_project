import { supabase } from "@/integrations/supabase/client";

const requestPaymentAdmin = async (method: "GET" | "POST" | "DELETE", body?: unknown) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your admin session has expired. Please sign in again.");

  const response = await fetch("/api/admin/payment-methods", {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = (await response.json().catch(() => ({}))) as {
    error?: string;
    [key: string]: unknown;
  };
  if (!response.ok) throw new Error(result.error || "Payment request failed");
  return result;
};

export const listPaymentMethodsAdmin = async () => {
  const result = await requestPaymentAdmin("GET");
  return Array.isArray(result) ? result : [];
};

export const savePaymentMethodAdmin = async (payload: Record<string, unknown>) => {
  await requestPaymentAdmin("POST", payload);
};

export const deletePaymentMethodAdmin = async (id: string) => {
  await requestPaymentAdmin("DELETE", { id });
};
