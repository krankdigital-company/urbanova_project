import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ThemeMode, CartItem, Product } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "@tanstack/react-router";
import { DynamicLink } from "./DynamicLink";
import { useSiteContent } from "../lib/content";

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  cartItems: CartItem[];
  wishlist: Product[];
  onOpenBag: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  selectedCurrency: string;
  onChangeCurrency: (curr: string) => void;
}

const FALLBACK_ANNOUNCEMENTS = [
  "COMPLIMENTARY EXPRESS SHIPPING ACROSS BANGLADESH ON ORDERS OVER ৳ 15,000",
  "100% GOTS ORGANIC & RECYCLED MATERIALS — ZERO SYNTHETIC PIGMENTS",
  "NEW ARCHITECTURAL FALL DROP NOW LIVE — EXPLORE LOOKBOOK '26",
];

const CURRENCIES = ["৳ BDT", "$ USD", "€ EUR", "£ GBP", "¥ JPY"];

const FALLBACK_MENU = [
  { id: "f1", label: "Shop", href: "/shop", parentId: null as string | null },
  { id: "f2", label: "Collections", href: "/collections", parentId: null as string | null },
  { id: "f3", label: "Lookbook", href: "/lookbook", parentId: null as string | null },
  { id: "f4", label: "Sustainability", href: "/sustainability", parentId: null as string | null },
];

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  cartItems,
  wishlist,
  onOpenBag,
  onOpenWishlist,
  onOpenSearch,
  selectedCurrency,
  onChangeCurrency,
}) => {
  const { menus, settings, categories } = useSiteContent();
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenId, setMobileOpenId] = useState<string | null>(null);

  const announcements =
    Array.isArray(settings.announcements) && settings.announcements.length
      ? settings.announcements
      : FALLBACK_ANNOUNCEMENTS;

  const headerMenu = menus.filter((m) => m.location === "header");
  const topItems = headerMenu.filter((m) => !m.parentId);
  const items = topItems.length ? topItems : FALLBACK_MENU;
  const childrenOf = (id: string) => headerMenu.filter((m) => m.parentId === id);
  const shopCategoryItems = categories.map((category) => ({
    id: `category-${category.id}`,
    label: category.name,
    href: `/shop?category=${encodeURIComponent(category.slug)}`,
  }));

  const brand = (settings.brand as string) || "URBANOVA";
  const tagline = (settings.tagline as string) || "SUSTAINABLE MENSWEAR";
  const logo = (settings.logo_url as string) || "";

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    let ticking = false;
    const evaluate = () => {
      ticking = false;
      const y = window.scrollY;
      // hysteresis: collapse past 80px, expand again below 30px — avoids jitter
      setIsScrolled((prev) => (prev ? y > 12 : y > 140));
    };
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(evaluate);
    };
    evaluate();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 isolate w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div
        className={`bg-[#121316] dark:bg-[#08090A] text-white text-[10px] sm:text-xs tracking-widest font-grotesk font-medium px-4 border-b border-white/10 overflow-hidden transition-all duration-300 ${isScrolled ? "max-h-0 py-0 opacity-0 border-b-0" : "max-h-12 py-2 opacity-100"}`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center gap-2 text-neutral-400">
            <span>100% Sustainable Craftsmanship</span>
          </div>

          <div className="w-full md:w-auto text-center overflow-hidden h-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={announcementIdx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="inline-block text-neutral-200 uppercase font-medium truncate"
              >
                {announcements[announcementIdx]}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="hidden md:flex items-center gap-4 text-neutral-400">
            <Link to="/sustainability" className="hover:text-white transition-colors">
              Eco-Impact Report
            </Link>
            <span className="text-neutral-600">|</span>
            <Link to="/track" className="hover:text-white transition-colors">
              Track Order
            </Link>
            <span className="text-neutral-600">|</span>
            <Link to="/account" className="hover:text-white transition-colors">
              My Account
            </Link>
            <span className="text-neutral-600">|</span>
            <Link
              to="/lookbook"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              Lookbook
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 border-b ${
          isScrolled
            ? "bg-[#FAF9F6]/95 dark:bg-[#0D0E10]/95 backdrop-blur-md shadow-md py-3.5 border-black/10 dark:border-white/10"
            : "bg-[#FAF9F6] dark:bg-[#0D0E10] py-5 border-black/5 dark:border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-[auto_1fr_auto] lg:grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-1 sm:gap-x-4">
          {/* Left: mobile menu button + desktop nav */}
          <div className="flex items-center justify-start min-w-0 lg:contents">
            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={onOpenSearch}
                className={`p-2 rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 ${
                  isScrolled
                    ? "w-0 opacity-0 pointer-events-none overflow-hidden p-0"
                    : "opacity-100"
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Desktop Nav Links */}
            <div
              className={`hidden lg:flex lg:col-start-1 lg:col-end-4 lg:row-start-2 justify-center flex-wrap items-center gap-6 xl:gap-8 ${isScrolled ? "pt-0" : "pt-2"} text-[11px] xl:text-xs font-grotesk tracking-wider uppercase font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap`}
            >
              {items.map((item) => {
                const kids =
                  item.label.toLowerCase() === "shop" ? shopCategoryItems : childrenOf(item.id);
                if (!kids.length) {
                  return (
                    <DynamicLink
                      key={item.id}
                      href={item.href}
                      className="hover:text-black dark:hover:text-white transition-colors relative group py-1"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
                    </DynamicLink>
                  );
                }
                return (
                  <div
                    key={item.id}
                    className="relative py-1"
                    onMouseEnter={() => setOpenDropdown(item.id)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                      className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1.5 py-1 text-xs font-grotesk font-bold uppercase tracking-wider group"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === item.id ? "rotate-180 text-emerald-500" : "text-neutral-400"}`}
                      />
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full" />
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1.5 w-60 bg-white/95 dark:bg-[#141518]/95 border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden backdrop-blur-xl"
                        >
                          <div className="px-4 py-2 border-b border-black/5 dark:border-white/5 text-[10px] font-grotesk font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase flex items-center justify-between">
                            <span>{item.label}</span>
                            <span className="text-[9px] text-neutral-400">SELECT</span>
                          </div>
                          <div className="py-1">
                            {kids.map((cat) => (
                              <DynamicLink
                                key={cat.id}
                                href={cat.href}
                                onClick={() => setOpenDropdown(null)}
                                className="w-full text-left px-4 py-2.5 text-xs font-grotesk font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 hover:text-black dark:hover:text-white transition-colors flex items-center justify-between group/item"
                              >
                                <span>{cat.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-emerald-500 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                              </DynamicLink>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Brand Logo — centered */}
          <div
            className={`text-left lg:text-center justify-self-start lg:justify-self-center lg:col-start-2 lg:row-start-1 overflow-hidden transition-all duration-300 ease-out will-change-[max-height,opacity] ${
              isScrolled
                ? "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
                : "max-h-28 opacity-100 translate-y-0"
            }`}
          >
            <Link to="/" className="group inline-flex flex-col items-start lg:items-center">
              {logo ? (
                <img src={logo} alt={brand} className="h-11 sm:h-12 w-auto object-contain" />
              ) : (
                <>
                  <span className="font-syne text-2xl sm:text-3xl font-extrabold tracking-tighter text-black dark:text-white uppercase leading-none group-hover:tracking-tight transition-all duration-300">
                    {brand}
                  </span>
                  <span className="text-[9px] font-grotesk tracking-[0.25em] text-neutral-500 dark:text-neutral-400 font-semibold uppercase mt-0.5">
                    {tagline}
                  </span>
                </>
              )}
            </Link>
          </div>

          {/* Right Action Tools */}
          <div
            className={`flex items-center justify-end gap-1.5 sm:gap-3 lg:col-start-3 lg:row-start-1 overflow-hidden transition-all duration-300 ease-out will-change-[max-height,opacity] ${
              isScrolled
                ? "max-h-0 opacity-0 -translate-y-1 pointer-events-none"
                : "max-h-24 opacity-100 translate-y-0"
            }`}
          >
            <button
              onClick={onOpenSearch}
              className={`${isScrolled ? "hidden" : "hidden lg:flex"} items-center gap-2 px-3 py-1.5 rounded-full text-xs font-grotesk font-medium text-neutral-600 dark:text-neutral-400 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors border border-black/5 dark:border-white/5`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search products...</span>
            </button>

            <button
              onClick={onOpenWishlist}
              className={`relative p-2.5 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${isScrolled ? "hidden sm:block" : ""}`}
              aria-label="Wishlist"
            >
              <Heart
                className={`w-5 h-5 ${wishlist.length > 0 ? "fill-black dark:fill-white text-black dark:text-white" : ""}`}
              />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center font-grotesk">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              onClick={onOpenBag}
              className="relative flex items-center gap-2 p-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity shadow-sm"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-xs font-bold font-grotesk px-0.5">{totalCartCount}</span>
            </button>

            <button
              onClick={onToggleTheme}
              className={`p-2.5 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/5 transition-colors border border-black/10 dark:border-white/10 ${isScrolled ? "hidden lg:block" : ""}`}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#FAF9F6] dark:bg-[#0D0E10] text-black dark:text-white z-50 p-6 flex flex-col justify-between overflow-y-auto lg:hidden border-r border-black/10 dark:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-black/10 dark:border-white/10">
                  <div className="flex flex-col">
                    <span className="font-syne text-xl font-extrabold uppercase tracking-tight">
                      {brand}
                    </span>
                    <span className="text-[9px] font-grotesk tracking-widest text-neutral-500 font-semibold uppercase">
                      {tagline}
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="py-6 flex flex-col gap-3 font-grotesk text-sm font-bold uppercase tracking-wider">
                  {items.map((item) => {
                    const kids =
                      item.label.toLowerCase() === "shop" ? shopCategoryItems : childrenOf(item.id);
                    if (!kids.length) {
                      return (
                        <DynamicLink
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between py-2 text-left hover:text-neutral-500 transition-colors"
                        >
                          <span>{item.label}</span>
                          <ChevronRight className="w-4 h-4 text-neutral-400" />
                        </DynamicLink>
                      );
                    }
                    return (
                      <div key={item.id}>
                        <button
                          onClick={() => setMobileOpenId(mobileOpenId === item.id ? null : item.id)}
                          className="w-full flex items-center justify-between py-2 text-left hover:text-neutral-500 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span>{item.label}</span>
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${mobileOpenId === item.id ? "rotate-180 text-emerald-500" : ""}`}
                          />
                        </button>

                        <AnimatePresence>
                          {mobileOpenId === item.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 border-l-2 border-emerald-500/40 my-2 flex flex-col gap-2 overflow-hidden"
                            >
                              {kids.map((cat) => (
                                <DynamicLink
                                  key={cat.id}
                                  href={cat.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="py-1 text-xs text-neutral-600 dark:text-neutral-300 hover:text-emerald-500 text-left transition-colors font-semibold normal-case flex items-center justify-between"
                                >
                                  <span>{cat.label}</span>
                                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                                </DynamicLink>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-grotesk font-semibold text-neutral-500 uppercase">
                    Currency
                  </span>
                  <div className="flex gap-2">
                    {CURRENCIES.map((c) => {
                      const sym = c.split(" ")[0]!;
                      return (
                        <button
                          key={c}
                          onClick={() => onChangeCurrency(sym)}
                          className={`text-xs px-2 py-1 rounded font-grotesk font-bold ${
                            selectedCurrency === sym
                              ? "bg-black text-white dark:bg-white dark:text-black"
                              : "bg-black/5 dark:bg-white/10 text-neutral-600 dark:text-neutral-300"
                          }`}
                        >
                          {sym}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-grotesk font-semibold text-neutral-500 uppercase">
                    Theme
                  </span>
                  <button
                    onClick={onToggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-grotesk font-bold"
                  >
                    {theme === "dark" ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                    )}
                    <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
