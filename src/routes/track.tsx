import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { trackOrders } from "@/lib/orders.functions";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track Your Order — Urbanova" },
      {
        name: "description",
        content:
          "Enter the mobile number used at checkout to see live status and delivery updates for every Urbanova order.",
      },
      { property: "og:title", content: "Track Your Order — Urbanova" },
      { property: "og:description", content: "Live order status and delivery updates by mobile number." },
    ],
  }),
  component: TrackPage,
});

const STEPS = ["pending", "confirmed", "packed", "shipped", "delivered"];

function TrackPage() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await trackOrders({ data: { phone } });
      setOrders(res.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not look up orders");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-[#121316] px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="text-xs font-grotesk font-bold uppercase tracking-widest text-neutral-500 hover:text-black">
          ← Back to store
        </Link>
        <h1 className="font-syne text-4xl sm:text-5xl font-extrabold uppercase tracking-tight mt-6">Track Order</h1>
        <p className="text-xs font-grotesk uppercase tracking-wider text-neutral-500 mt-2 mb-8">
          Use the mobile number you entered at checkout
        </p>

        <form onSubmit={search} className="flex flex-col sm:flex-row gap-3 mb-10">
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Mobile number"
            maxLength={30}
            className="flex-1 px-4 py-3 rounded-xl bg-neutral-100 border border-black/10 text-sm outline-none focus:border-black"
          />
          <button
            disabled={busy}
            className="px-8 py-3.5 bg-black text-white font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl disabled:opacity-50"
          >
            {busy ? "Searching..." : "Track"}
          </button>
        </form>

        {error && <p className="text-xs text-rose-500 font-grotesk uppercase tracking-wider">{error}</p>}
        {orders && orders.length === 0 && (
          <p className="text-sm text-neutral-500">No orders found for that mobile number.</p>
        )}

        <div className="space-y-5">
          {orders?.map((o) => {
            const stepIdx = STEPS.indexOf(o.status);
            return (
              <div key={o.id} className="rounded-2xl border border-black/10 bg-white p-6">
                <div className="flex flex-wrap justify-between gap-3 items-center">
                  <div>
                    <p className="font-grotesk font-extrabold text-sm uppercase tracking-widest">{o.order_number}</p>
                    <p className="text-[11px] text-neutral-500 mt-1">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-black text-white text-[11px] font-grotesk font-extrabold uppercase tracking-widest">
                    {o.status}
                  </span>
                </div>

                {o.status !== "cancelled" && (
                  <div className="mt-6 flex items-center">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex-1 flex items-center last:flex-none">
                        <div className="flex flex-col items-center">
                          <div className={`w-3 h-3 rounded-full ${i <= stepIdx ? "bg-emerald-500" : "bg-neutral-300"}`} />
                          <span className="text-[9px] font-grotesk uppercase tracking-widest mt-2 text-neutral-500">{s}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 ${i < stepIdx ? "bg-emerald-500" : "bg-neutral-200"}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  {o.items.map((it: any) => (
                    <div key={it.id} className="flex justify-between text-xs text-neutral-600">
                      <span>{it.product_name} · {it.size} / {it.color} × {it.quantity}</span>
                      <span>{o.currency}{Number(it.unit_price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {o.events?.length > 0 && (
                  <ul className="mt-5 pt-4 border-t border-black/10 space-y-1.5">
                    {o.events.map((ev: any) => (
                      <li key={ev.id} className="text-[11px] text-neutral-500">
                        <span className="font-grotesk font-bold uppercase tracking-widest text-neutral-700">{ev.status}</span>
                        {ev.note ? ` — ${ev.note}` : ""} · {new Date(ev.created_at).toLocaleString()}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
