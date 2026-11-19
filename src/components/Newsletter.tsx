import React, { useState } from 'react';
import { Mail, ArrowRight, Check, Copy } from 'lucide-react';

interface NewsletterProps {
  onShowToast: (title: string, subtitle?: string, type?: 'bag' | 'wishlist' | 'promo' | 'info') => void;
}

export const Newsletter: React.FC<NewsletterProps> = ({ onShowToast }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
    onShowToast('VIP ACCESS UNLOCKED', 'Use promo code URBANOVA15 for 15% off your first order.', 'promo');
  };

  const copyCode = () => {
    navigator.clipboard.writeText('URBANOVA15');
    setCopied(true);
    onShowToast('COPIED TO CLIPBOARD', 'Promo code URBANOVA15 ready to paste at checkout.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-[#121316] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 border border-white/10 text-xs font-grotesk font-extrabold tracking-widest uppercase mb-4">
            <span>JOIN THE URBAN LAB</span>
          </div>

          <h2 className="font-syne text-3xl sm:text-5xl font-extrabold tracking-tight uppercase leading-tight mb-3">
            15% Off Your First Circular Order
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed mb-8">
            Subscribe to receive private collection drops, sustainable material whitepapers, and exclusive lookbook invitations directly to your inbox.
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white/10 text-white placeholder-neutral-400 rounded-xl text-xs font-grotesk font-medium focus:outline-none focus:ring-2 focus:ring-white border border-white/10"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-white text-black font-grotesk font-extrabold text-xs tracking-widest uppercase rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shrink-0"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 inline-flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-emerald-400 font-grotesk font-bold text-xs uppercase tracking-wider">
                <Check className="w-4 h-4" />
                <span>WELCOME TO URBANOVA</span>
              </div>
              <p className="text-xs text-neutral-300">
                Your 15% discount code is active:
              </p>
              <div className="flex items-center gap-2 bg-black/60 px-4 py-2 rounded-xl border border-white/20 font-mono text-sm font-bold text-amber-300">
                <span>URBANOVA15</span>
                <button
                  onClick={copyCode}
                  className="p-1 text-white hover:text-amber-300 transition-colors"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <p className="text-[10px] text-neutral-400 font-grotesk mt-4">
            No spam. Unsubscribe anytime. By entering your email you agree to our privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
};
