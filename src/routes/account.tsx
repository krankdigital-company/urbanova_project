import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Orders — Urbanova" },
      { name: "description", content: "Review your Urbanova order history and delivery status." },
      { property: "og:title", content: "My Orders — Urbanova" },
      { property: "og:description", content: "Review your Urbanova order history and delivery status." },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const { data: orders } = useQuery({
    queryKey: ["my-orders", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), order_events(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#121316] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-xs font-grotesk font-bold uppercase tracking-widest text-neutral-500 hover:text-black">
          ← Back to store
        </Link>

        <div className="flex flex-wrap items-end justify-between gap-4 mt-6 mb-10">
          <div>
            <h1 className="font-syne text-4xl font-extrabold uppercase tracking-tight">My Orders</h1>
            <p className="text-xs font-grotesk uppercase tracking-wider text-neutral-500 mt-2">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2.5 border border-black/15 rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest">
                Admin
              </Link>
            )}
            <button onClick={() => signOut().then(() => navigate({ to: "/" }))} className="px-4 py-2.5 border border-black/15 rounded-xl text-xs font-grotesk font-extrabold uppercase tracking-widest">
              Sign out
            </button>
          </div>
        </div>

        {!orders?.length && (
          <p className="text-sm text-neutral-500 font-sans">
            No orders yet. Orders placed as a guest can be found on the{" "}
            <Link to="/track" className="underline">tracking page</Link>.
          </p>
        )}

        <div className="space-y-4">
          {orders?.map((o: any) => (
            <div key={o.id} className="rounded-2xl border border-black/10 p-6 bg-white">
              <div className="flex flex-wrap justify-between gap-3 items-center">
                <div>
                  <p className="font-grotesk font-extrabold text-sm uppercase tracking-widest">{o.order_number}</p>
                  <p className="text-[11px] text-neutral-500 mt-1">{new Date(o.created_at).toLocaleString()}</p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-grotesk font-extrabold uppercase tracking-widest">
                  {o.status}
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {o.order_items?.map((it: any) => (
                  <div key={it.id} className="flex justify-between text-xs text-neutral-600">
                    <span>{it.product_name} · {it.size} / {it.color} × {it.quantity}</span>
                    <span>{o.currency}{Number(it.unit_price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-black/10 flex justify-between text-sm font-grotesk font-extrabold">
                <span>Total</span>
                <span>{o.currency}{Number(o.total).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
