import React, { useEffect, useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Loader2, Crosshair } from 'lucide-react';
import type { CartItem } from '../types';
import { formatPrice } from '../utils/currency';
import { createOrder, quoteCheckout } from '../lib/orders.functions';
import { getPaymentInstructions } from '../lib/payment-instructions.functions';
import { useAuth } from '../lib/auth';
import { useSiteContent } from '../lib/content';

interface CheckoutViewProps {
  cartItems: CartItem[];
  selectedCurrency: string;
  onBack: () => void;
  onPlaced: () => void;
}

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-neutral-100 dark:bg-white/5 border border-black/10 dark:border-white/10 text-sm font-sans text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors';

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  cartItems,
  selectedCurrency,
  onBack,
  onPlaced
}) => {
  const { user } = useAuth();
  const { deliveryZones, paymentMethods } = useSiteContent();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderNumber: string } | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [quote, setQuote] = useState({ shipping: 0, eta: '', discount: 0, discountError: '' });
  const [payInfo, setPayInfo] = useState({ key: '', instructions: '', accountNumber: '' });
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: user?.email ?? '',
    customerPhone: '',
    shippingAddress: '',
    city: '',
    district: '',
    notes: '',
    discountCode: '',
    paymentMethod: 'cod',
    paymentTxnId: ''
  });

  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const total = Math.max(0, subtotal - quote.discount) + quote.shipping;
  const activeMethod = paymentMethods.find((m) => m.key === form.paymentMethod);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    if (!subtotal) return;
    let active = true;
    const t = setTimeout(async () => {
      try {
        const res = await quoteCheckout({
          data: { district: form.district, discountCode: form.discountCode, subtotal }
        });
        if (active) setQuote({ shipping: res.shipping, eta: res.eta, discount: res.discount, discountError: res.discountError });
      } catch {
        /* keep previous quote */
      }
    }, 350);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [form.district, form.discountCode, subtotal]);

  useEffect(() => {
    const key = form.paymentMethod;
    if (!key) return;
    let active = true;
    (async () => {
      try {
        const res = await getPaymentInstructions({ data: { key } });
        if (active) setPayInfo(res);
      } catch {
        if (active) setPayInfo({ key, instructions: '', accountNumber: '' });
      }
    })();
    return () => {
      active = false;
    };
  }, [form.paymentMethod]);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`
          );
          const j = await r.json();
          const a = j.address ?? {};
          const city = a.city || a.town || a.village || a.suburb || '';
          const districtRaw = (a.state_district || a.county || a.city || '').replace(/ District$/i, '');
          const match = deliveryZones.find((z) => z.district.toLowerCase() === String(districtRaw).toLowerCase());
          setForm((p) => ({
            ...p,
            city: city || p.city,
            district: match ? match.district : p.district,
            shippingAddress: p.shippingAddress || (j.display_name ?? '')
          }));
        } catch {
          /* ignore lookup failures */
        } finally {
          setDetecting(false);
        }
      },
      () => setDetecting(false),
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await createOrder({
        data: {
          ...form,
          currency: selectedCurrency,
          userId: user?.id ?? '',
          items: cartItems.map((i) => ({
            productId: i.product.id,
            productName: i.product.name,
            image: i.product.images[0] ?? '',
            size: i.selectedSize,
            color: i.selectedColor.name,
            unitPrice: i.product.price,
            quantity: i.quantity
          }))
        }
      });
      setPlaced({ orderNumber: res.orderNumber });
      onPlaced();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };


  if (placed) {
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500 mb-6" />
        <h1 className="font-syne text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-black dark:text-white">
          Order Confirmed
        </h1>
        <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400 font-sans">
          Your order number is{' '}
          <span className="font-grotesk font-extrabold text-black dark:text-white">
            {placed.orderNumber}
          </span>
          . Track it anytime using your mobile number.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href="/track"
            className="px-6 py-3.5 bg-black text-white dark:bg-white dark:text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl"
          >
            Track My Order
          </a>
          <button
            onClick={onBack}
            className="px-6 py-3.5 border border-black/15 dark:border-white/15 font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl text-black dark:text-white"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-grotesk font-bold uppercase tracking-wider text-neutral-500 hover:text-black dark:hover:text-white mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="font-syne text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white mb-2">
        Checkout
      </h1>
      <p className="text-xs font-grotesk text-neutral-500 uppercase tracking-wider mb-10 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        Guest checkout — no account required
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
          <input required className={inputClass} placeholder="Full name" value={form.customerName} onChange={set('customerName')} maxLength={120} />
          <input required className={inputClass} placeholder="Mobile number (used for order tracking)" value={form.customerPhone} onChange={set('customerPhone')} maxLength={30} />
          <input type="email" className={inputClass} placeholder="Email (optional)" value={form.customerEmail} onChange={set('customerEmail')} maxLength={255} />
          <input required className={inputClass} placeholder="Shipping address" value={form.shippingAddress} onChange={set('shippingAddress')} maxLength={500} />
          <div className="flex gap-3">
            <input className={inputClass} placeholder="City" value={form.city} onChange={set('city')} maxLength={120} />
            <button
              type="button"
              onClick={detectLocation}
              className="shrink-0 px-4 rounded-xl border border-black/10 dark:border-white/10 text-[11px] font-grotesk font-extrabold uppercase tracking-widest flex items-center gap-2"
            >
              {detecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crosshair className="w-3.5 h-3.5" />}
              Detect
            </button>
          </div>

          <select className={inputClass} value={form.district} onChange={set('district')} required>
            <option value="">Select delivery district</option>
            {deliveryZones.map((z) => (
              <option key={z.id} value={z.district}>
                {z.district}{z.area ? ` — ${z.area}` : ''}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <input
              className={inputClass}
              placeholder="Promo code (optional)"
              value={form.discountCode}
              onChange={set('discountCode')}
              maxLength={60}
            />
          </div>
          {form.discountCode && quote.discountError && (
            <p className="text-[11px] font-grotesk text-rose-500 uppercase tracking-wider">{quote.discountError}</p>
          )}

          <div className="space-y-2">
            <p className="text-[10px] font-grotesk font-extrabold uppercase tracking-widest text-neutral-500">Payment method</p>
            {paymentMethods.map((m) => (
              <label
                key={m.id}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${
                  form.paymentMethod === m.key
                    ? 'border-black dark:border-white bg-neutral-100 dark:bg-white/10'
                    : 'border-black/10 dark:border-white/10'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.key}
                  checked={form.paymentMethod === m.key}
                  onChange={set('paymentMethod')}
                  className="mt-1"
                />
                <span>
                  <span className="block text-xs font-grotesk font-extrabold uppercase tracking-wider">{m.label}</span>
                  {m.description && <span className="block text-[11px] text-neutral-500 mt-0.5">{m.description}</span>}
                  {form.paymentMethod === m.key && payInfo.key === m.key && (payInfo.instructions || payInfo.accountNumber) && (
                    <span className="block text-[11px] text-neutral-500 mt-1">
                      {payInfo.instructions}{' '}
                      {payInfo.accountNumber && <b className="text-black dark:text-white">{payInfo.accountNumber}</b>}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </div>

          {activeMethod?.requiresTxnId && (
            <input
              required
              className={inputClass}
              placeholder="Transaction ID"
              value={form.paymentTxnId}
              onChange={set('paymentTxnId')}
              maxLength={120}
            />
          )}

          <textarea className={inputClass} placeholder="Order notes (optional)" rows={3} value={form.notes} onChange={set('notes')} maxLength={1000} />


          {error && <p className="text-xs font-grotesk text-rose-500 uppercase tracking-wider">{error}</p>}

          <button
            type="submit"
            disabled={submitting || cartItems.length === 0}
            className="w-full py-4 bg-black text-white dark:bg-white dark:text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-6 space-y-4">
            <h2 className="font-grotesk text-xs font-extrabold uppercase tracking-widest text-neutral-500">
              Order Summary
            </h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <img src={item.product.images[0]} alt={item.product.name} className="w-14 h-16 object-cover rounded-lg" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-sans font-semibold text-black dark:text-white truncate">{item.product.name}</p>
                  <p className="text-[11px] text-neutral-500">{item.selectedSize} / {item.selectedColor.name} × {item.quantity}</p>
                </div>
                <span className="text-xs font-grotesk font-bold text-black dark:text-white">
                  {formatPrice(item.product.price * item.quantity, selectedCurrency)}
                </span>
              </div>
            ))}
            <div className="pt-4 border-t border-black/10 dark:border-white/10 space-y-2 text-xs font-grotesk text-neutral-500">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal, selectedCurrency)}</span></div>
              {quote.discount > 0 && (
                <div className="flex justify-between text-emerald-600"><span>Discount</span><span>−{formatPrice(quote.discount, selectedCurrency)}</span></div>
              )}
              <div className="flex justify-between">
                <span>Delivery{quote.eta ? ` (${quote.eta})` : ''}</span>
                <span>{quote.shipping ? formatPrice(quote.shipping, selectedCurrency) : 'Free'}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-black dark:text-white pt-2 border-t border-black/10 dark:border-white/10">
                <span>Total</span>
                <span>{formatPrice(total, selectedCurrency)}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
