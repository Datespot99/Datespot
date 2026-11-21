import React, { useState, useEffect, useRef } from 'react';
import { SHEET_URL, SlotsProvider, useSlots, waitForScreenshotReceipt } from './slots';

import { motion, AnimatePresence } from 'motion/react';
import {
  Play, Pause, Users, X, Star, Mic, Upload, CheckCircle, Loader2,
  MessageCircle, ArrowRight, Sparkles, Flame, Copy,
  ExternalLink, Phone, MapPin, Shield, Zap,
  Heart, Camera, UserCheck, Tv2, BellRing,
  Lock, Headphones, ChevronDown,
  CreditCard, Send, Sun, Moon,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';
import chatAvatar   from '../imports/photo_1_2026-09-07_13-39-47.jpg';
import galleryImg1  from '../imports/Screenshot_2026_08_10_21_56_20_91_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg2  from '../imports/Screenshot_2026_08_10_21_56_34_83_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg3  from '../imports/Screenshot_2026_08_10_21_57_02_74_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg4  from '../imports/Screenshot_2026_08_10_22_02_08_82_948cd9899890cbd5c2798760b2b95377.jpg';
import galleryImg5  from '../imports/shrutiofficial33742026_07_30_18_12_09480ecd4d_c145_474a_9f72_efe03c792136.jpg';
import galleryImg6  from '../imports/RDT_20260727_235755726733947940243856.jpg';
import adminPhoto   from '../imports/photo_2_2026-09-07_13-39-48.jpg';
import proofPayment from '../imports/Screenshot_20260709_004939_PhonePe.jpg';
import proofReview1 from '../imports/Screenshot_2024-09-29-20-43-34-268_com.facebook.katana.jpg';
import proofReview2 from '../imports/Screenshot_2024_10_16_12_09_16_54_f598e1360c96b5a5aa16536c303cff92.jpg';
import proofReview3 from '../imports/Screenshot_2025_02_04_11_05_01_43_f598e1360c96b5a5aa16536c303cff92.jpg';
import faq4Audio from '../imports/faq4-bangalore-girls.mp3.mp3';
import faq5Audio from '../imports/faq5-how-to-join.mp3.mp3';

const B1        = '#1944F1';
const B2        = '#0F2DBB';
const ACCENT    = '#FFD700';
const HERO_GRAD = B1;

// Shared one-time price for desktop, mobile and UPI payments.
const PRICING = {
  desktop: { amount: '499' },
  mobile:  { amount: '499' },
} as const;
type PricingDevice = keyof typeof PRICING;
const formatPrice = (value: string) => `₹${Number(value).toLocaleString('en-IN')}`;

// ─── Theme system ─────────────────────────────────────────────────────────────
const DARK_THEME = {
  PAGE_BG:  '#000000',
  DARK:     '#F5F3F3',
  MUTED:    '#7A88AA',
  CARD_BG:  '#0D0D0D',
  BORDER:   'rgba(255,255,255,0.07)',
  QUOTE:    '#C0C8E8',
  DOT_BG: '#000000',
};
const LIGHT_THEME = {
  PAGE_BG:  '#F5F3F3',
  DARK:     '#08122A',
  MUTED:    '#5A6899',
  CARD_BG:  '#FFFFFF',
  BORDER:   'rgba(25,68,241,0.12)',
  QUOTE:    '#1A2A60',
  DOT_BG: '#F5F3F3',
};
type TTheme = typeof DARK_THEME & { isDark: boolean };
const ThemeCtx = React.createContext<{ theme: TTheme; toggle: () => void }>({
  theme: { ...DARK_THEME, isDark: true }, toggle: () => {},
});
const useT = (): TTheme => React.useContext(ThemeCtx).theme;
// Dot-grid page background (white dots on dark, blue dots on light)
const dotGridStyle = (T: TTheme): React.CSSProperties => ({
  backgroundColor: T.DOT_BG,
  backgroundImage: `radial-gradient(${T.isDark ? 'rgba(255,255,255,0.14)' : 'rgba(25,68,241,0.20)'} 1px, transparent 1.2px)`,
  backgroundSize: '24px 24px',
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const isNight = () => { const h = new Date().getHours(); return h < 6 || h >= 20; };
  const [isDark, setIsDark] = useState(() => {
    const s = localStorage.getItem('ds_theme');
    return s ? s === 'dark' : isNight();
  });
  const toggle = () => setIsDark(p => {
    localStorage.setItem('ds_theme', !p ? 'dark' : 'light');
    return !p;
  });
  const theme = { ...(isDark ? DARK_THEME : LIGHT_THEME), isDark };
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

function ThemeToggle() {
  const { theme, toggle } = React.useContext(ThemeCtx);
  return (
    <motion.button
      onClick={toggle} whileTap={{ scale: 0.9 }}
      className="fixed top-3 right-3 z-50 w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
      style={{ background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(25,68,241,0.06)', border: `1px solid ${theme.isDark ? 'rgba(255,255,255,0.12)' : 'rgba(25,68,241,0.2)'}` }}>
      {theme.isDark
        ? <Sun className="w-4 h-4" style={{ color: '#FFD700' }} />
        : <Moon className="w-4 h-4" style={{ color: '#1944F1' }} />}
    </motion.button>
  );
}

const PAGE_BG = DARK_THEME.PAGE_BG;
const DARK    = DARK_THEME.DARK;
const MUTED   = DARK_THEME.MUTED;
const CARD_BG = DARK_THEME.CARD_BG;
const DOT_BG  = DARK_THEME.DOT_BG;

const FEAT: { icon: React.ElementType; title: string; desc: string; badge?: string; c1: string; c2: string }[] = [
  { icon: MessageCircle, title: 'Group Chat',         desc: 'Daily active members',        c1: '#3B82F6', c2: '#06B6D4' },
  { icon: Phone,         title: 'Voice Calls',        desc: 'Talk before you meet',        c1: '#FF6B6B', c2: '#FF8E53' },
  { icon: MapPin,        title: 'Direct Meets',       desc: 'Arrange real-life meetups',   c1: '#10B981', c2: '#34D399' },
  { icon: Flame,         title: '18+ Exclusive',      desc: 'Photos, videos & more',       c1: '#EF4444', c2: '#F97316', badge: '18+' },
];

const IMAGES   = ['/group-preview-1.webp', '/group-preview-2.webp', '/group-preview-3.webp', '/group-preview-4.webp'];
const VIDEOS   = ['https://player.vimeo.com/video/1182421154', 'https://player.vimeo.com/video/1182421156'];
const QUESTIONS = ['Is this genuine?', 'How much is entry fee?', 'Refunds available?', 'Genuine Bangalore girls?', 'How to join?'];
const AUDIO_FILES = [null, null, null, faq4Audio, faq5Audio];
const REVIEWS = [
  { name: 'Rahul M.',       area: 'Koramangala', text: 'Way better than any dating app I have tried. Met two amazing women so far, both real and verified.' },
  { name: 'Vikram Shetty.', area: 'Indiranagar',  text: 'Finally ondhu genuine group sikthu. Admin is very responsive and the crowd is legit. Genuinely recommend.' },
  { name: 'Karan D.',       area: 'HSR Layout',   text: 'Real girls, real chats. Nothing like the fake bots on Tinder or Bumble. Worth every rupee.' },
  { name: 'Aditya P.',      area: 'Whitefield',   text: "Was skeptical at first but it's 100% worth it. The voice call feature is a great way to vibe before meeting." },
  { name: 'Rohan Gowda.',   area: 'JP Nagar',     text: 'Already arranged a meet within my first week. Active group, daily new faces. Super recommend bro.' },
  { name: 'Suresh Naik.',   area: 'Marathahalli', text: 'Met my current girlfriend here lol. Very organised, zero spam and the admin actually screens people.' },
  { name: 'Arjun K.',       area: 'Jayanagar',    text: 'The group is always active, quality women from Bangalore.' },
  { name: 'Dev Menon.',     area: 'BTM Layout',   text: 'Three meets in two months. The vibe here is very different from regular apps — feels real and personal.' },
  { name: 'Sagar R.',       area: 'Electronic City', text: 'Legit group. Admin does proper verification so you know everyone is genuine. No nonsense.' },
  { name: 'Nikhil T.',      area: 'Yelahanka',    text: 'Joined on a friend\'s suggestion and I\'m glad I did. Active daily, good conversations and easy to arrange meets.' },
];

// ─── Diwali ornaments ─────────────────────────────────────────────
function Diya({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2c2 2.6 2.6 4.4 0 6.6C9.4 6.4 10 4.6 12 2z" fill="#FF9F1C" />
      <path d="M12 4.6c.9 1.2 1.1 2 0 3-1.1-1-.9-1.8 0-3z" fill="#FFD700" />
      <path d="M2.5 13h19c0 4.2-4 7.5-9.5 7.5S2.5 17.2 2.5 13z" fill="#D9480F" />
      <rect x="2.5" y="11.6" width="19" height="2" rx="1" fill="#F59E0B" />
    </svg>
  );
}

function DiwaliOrnaments() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden="true">
      <Diya />
      <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
      <Diya size={26} />
      <Sparkles className="w-3.5 h-3.5" style={{ color: '#FFD700' }} />
      <Diya />
    </div>
  );
}

// ─── Glassmorphic blob ────────────────────────────────────────────────────────
function GlassBlob({ size, top, left, right, bottom, rotate = 0, rx = '62% 38% 70% 30% / 45% 55% 45% 55%' }: {
  size: number; top?: string | number; left?: string | number;
  right?: string | number; bottom?: string | number; rotate?: number; rx?: string;
}) {
  return (
    <div style={{
      position: 'absolute', width: size, height: size, top, left, right, bottom,
      background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
      border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: rx,
      transform: `rotate(${rotate}deg)`, pointerEvents: 'none',
    }} />
  );
}

// ─── Group Preview Slider ─────────────────────────────────────────────────────
type PreviewCategory = 'Group' | 'Girls' | 'Direct Meets' | 'Reviews';
const PREVIEW_CATEGORIES: PreviewCategory[] = ['Group', 'Girls', 'Direct Meets', 'Reviews'];
// Add category-specific images here as the new gallery assets are supplied.
const PREVIEW_IMAGES: Record<PreviewCategory, string[]> = {
  Group: IMAGES,
  Girls: [],
  'Direct Meets': [],
  Reviews: [],
};

function GroupPreviewSlider({ mobile = false }: { mobile?: boolean }) {
  const [category, setCategory] = useState<PreviewCategory>('Group');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const T = useT();
  const images = PREVIEW_IMAGES[category];
  const selectCategory = (next: PreviewCategory) => {
    setCategory(next);
    setCurrent(0);
    setDirection(1);
  };
  const nav = (step: number) => {
    if (!images.length) return;
    setDirection(step);
    setCurrent(i => (i + step + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setCurrent(i => (i + 1) % images.length);
    }, 3500);
    return () => window.clearInterval(id);
  }, [category, images.length]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? '65%' : '-65%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? '-65%' : '65%', opacity: 0 }),
  };
  const tabIcons = { Group: Users, Girls: Heart, 'Direct Meets': MapPin, Reviews: Star };
  return (
    <section className={mobile ? 'py-6' : 'py-3'}>
      <div className={mobile ? 'w-full' : 'max-w-5xl mx-auto'}>
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="min-w-0">
            <h2 className={mobile ? 'font-extrabold text-xl' : 'font-extrabold text-3xl'} style={{ color: T.DARK, letterSpacing: '-0.03em' }}>
              <Users className="w-5 h-5 inline-block align-middle mr-1.5" style={{ color: B1 }} /> Group Preview
            </h2>
            <p className="text-xs font-medium mt-1 ml-7" style={{ color: T.MUTED }}>See what's inside the group</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-black mr-1" style={{ color: B1 }}>{images.length ? current + 1 : 0} / {images.length}</span>
            <button type="button" aria-label="Previous preview" disabled={!images.length} onClick={() => nav(-1)}
              className="w-8 h-8 rounded-full border flex items-center justify-center disabled:opacity-35" style={{ borderColor: B1, color: B1 }}>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>
            <button type="button" aria-label="Next preview" disabled={!images.length} onClick={() => nav(1)}
              className="w-8 h-8 rounded-full text-white flex items-center justify-center disabled:opacity-35" style={{ background: B1 }}>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center" style={{ minHeight: mobile ? 325 : 375 }}>
          {images.length ? (
            <div className="relative w-full flex items-center justify-center" style={{ height: mobile ? 325 : 375 }}>
              <div className="absolute w-[80%] max-w-[460px] h-[78%] rounded-full blur-3xl opacity-10" style={{ background: B1 }} />
              {images.map((src, i) => {
                // One card per image, distributed behind the selected centre image.
                const forward = (i - current + images.length) % images.length;
                const offset = forward > Math.floor(images.length / 2) ? forward - images.length : forward;
                if (offset === 0) return null;
                const distance = Math.abs(offset);
                return (
                  <button type="button" key={category + i} onClick={() => {
                      setDirection(offset > 0 ? 1 : -1);
                      setCurrent(i);
                    }} aria-label={`Show ${category} preview ${i + 1}`}
                    className="absolute overflow-hidden rounded-[18px] shadow-lg"
                    style={{ height: mobile ? 250 : 280, width: mobile ? 150 : 176,
                      left: '50%', top: '50%', zIndex: 3 - distance,
                      transform: `translate(-50%, -50%) translateX(${offset * (mobile ? 48 : 67)}px) rotate(${offset * 7}deg) scale(${1 - distance * .08})`,
                      transition: 'transform .4s ease, opacity .35s ease',
                      opacity: distance > 1 ? .70 : .92,
                      border: '1.5px solid rgba(100,116,139,.3)', background: '#fff' }}>
                    <img src={src} alt="" className="block w-full h-full object-cover" />
                  </button>
                );
              })}
              <div className="relative overflow-hidden rounded-[20px] shadow-2xl" style={{
                height: mobile ? 295 : 326, width: mobile ? 180 : 202,
                border: `2.5px solid ${B1}`, zIndex: 5, background: '#fff',
              }}>
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img key={category + current} src={images[current]}
                    alt={`${category} preview ${current + 1}`}
                    custom={direction} variants={variants} initial="enter" animate="center" exit="exit"
                    transition={{ duration: .32 }}
                    className="absolute inset-0 w-full h-full object-cover" />
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="text-center px-6 py-8 rounded-2xl border border-dashed max-w-sm"
              style={{ borderColor: `${B1}55`, color: T.MUTED }}>
              <Sparkles className="w-8 h-8 mx-auto mb-3" style={{ color: B1 }} />
              <p className="font-bold" style={{ color: T.DARK }}>{category} gallery coming soon</p>
              <p className="text-xs mt-1">Photos for this section will be added shortly.</p>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-1" aria-label="Image position">
            {images.map((_, i) => (
              <button key={i} type="button" onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                aria-label={`Show ${category} image ${i + 1}`} aria-current={i === current ? 'true' : undefined}
                className="rounded-full transition-all duration-300"
                style={{ width: i === current ? 18 : 6, height: 6,
                  background: i === current ? B1 : (T.isDark ? '#47547D' : '#C5D2F9') }} />
            ))}
          </div>
        )}

        <div role="tablist" aria-label="Preview categories"
          className="grid grid-cols-4 gap-1.5 sm:gap-3 mt-5">
          {PREVIEW_CATEGORIES.map(item => {
            const Icon = tabIcons[item];
            const active = category === item;
            return <button key={item} type="button" role="tab" aria-selected={active}
              onClick={() => selectCategory(item)}
              className="flex items-center justify-center gap-1 rounded-xl py-2.5 px-1 sm:px-3 font-extrabold whitespace-nowrap transition-colors"
              style={{ fontSize: mobile ? 'clamp(9px, 2.6vw, 12px)' : 14,
                background: active ? B1 : T.CARD_BG, color: active ? '#fff' : T.DARK,
                border: `1px solid ${active ? B1 : 'rgba(25,68,241,.2)'}` }}>
              <Icon className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
              {item}
            </button>;
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
function StatsRow({ onJoin }: { onJoin: () => void }) {
  const [idx, setIdx] = useState(0);
  const items = [
    { value: '100+', label: 'Members', icon: Users, c1: B1, c2: B2 },
    { value: 'Daily', label: 'Active', icon: Zap, c1: '#10B981', c2: '#34D399' },
    { value: '100%', label: 'Verified', icon: Shield, c1: '#8B5CF6', c2: '#C084FC' },
    { value: '18+', label: 'Content', icon: Flame, c1: '#EF4444', c2: '#F97316' },
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % items.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    null
  );
}

// Member photo gallery — photos supplied by the Datespot team.
const MEMBER_PHOTOS = [
  "/356808247_2019454628401768_4031109463594714357_n.jpg",
  "/468028788_1932965163850195_1586026386361468904_n.jpg",
  "/703844530_122099136147329700_7299003614957604277_n.jpg",
  "/783510658_122123138145123723_4475087462369270598_n.jpg",
  "/796996411_4330493380430715_8968024873129364303_n.jpg",
  "/893114966_122269297298266719_4219188307620275945_n.jpg"
] as const;

function ReviewsStrip() {
  const T = useT();
  const [current, setCurrent] = useState(0);
  const touchX = useRef<number | null>(null);
  const total = MEMBER_PHOTOS.length;
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setCurrent(i => (i + 1) % total), 4300);
    return () => window.clearInterval(timer);
  }, [total]);
  const move = (offset: number) => setCurrent(i => (i + offset + total) % total);
  const review = REVIEWS[current];
  return (
    <section className="py-5" aria-labelledby="member-reviews-heading">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 id="member-reviews-heading" className="text-xl font-extrabold" style={{ color: T.DARK }}>What Members Say</h2>
          <p className="text-[11px] mt-0.5 font-medium" style={{ color: T.MUTED }}>Reviews from Bangalore</p>
        </div>
        <span className="text-[11px] font-bold" style={{ color: B1 }}>{current + 1} / {total}</span>
      </div>
      <div className="relative rounded-2xl p-4 shadow-sm overflow-hidden"
        style={{ background: T.CARD_BG, border: `1px solid ${B1}33` }}
        onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; if (Math.abs(dx) > 45) move(dx < 0 ? 1 : -1); touchX.current = null; }}>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -22 }} transition={{ duration: .26 }}>
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }, (_, j) => <Star key={j} className="w-3.5 h-3.5 fill-current" style={{ color: '#F59E0B' }} />)}
            </div>
            <p className="text-sm leading-relaxed font-medium mb-4 pr-1" style={{ color: T.QUOTE }}>&ldquo;{review.text}&rdquo;</p>
            <div className="flex items-center gap-3">
              <img src={MEMBER_PHOTOS[current]} alt="Reviewer profile" loading="lazy"
                className="w-11 h-11 rounded-full object-cover object-center shrink-0"
                style={{ border: `2px solid ${B1}40` }} />
              <div>
                <div className="text-sm font-extrabold" style={{ color: T.DARK }}>{review.name}</div>
                <div className="text-[11px] flex items-center gap-1" style={{ color: T.MUTED }}>
                  <MapPin className="w-3 h-3" />{review.area}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(25,68,241,.12)' }}>
          <button type="button" onClick={() => move(-1)} aria-label="Previous review"
            className="text-xs font-bold px-2 py-1" style={{ color: B1 }}>‹ Previous</button>
          <div className="flex items-center gap-1.5">
            {MEMBER_PHOTOS.map((_, i) => <button type="button" key={i} onClick={() => setCurrent(i)}
              aria-label={`Review ${i + 1}`} className="h-1.5 rounded-full transition-all"
              style={{ width: i === current ? 19 : 6, background: i === current ? B1 : '#B9C8E8' }} />)}
          </div>
          <button type="button" onClick={() => move(1)} aria-label="Next review"
            className="text-xs font-bold px-2 py-1" style={{ color: B1 }}>Next ›</button>
        </div>
      </div>
    </section>
  );
}

// ─── Animated Stats ───────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        setVal(Math.round(t * target));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

function StatsSection() {
  const T = useT();
  const s1 = useCountUp(548); const s2 = useCountUp(467); const s3 = useCountUp(1000); const s4 = useCountUp(95);
  const stats = [
    { ref: s1.ref, val: s1.val, suffix: '+', label: 'Members', c1: B1, c2: '#FF6B35' },
    { ref: s2.ref, val: s2.val, suffix: '',  label: 'Online Today', c1: '#10B981', c2: '#34D399' },
    { ref: s3.ref, val: s3.val, suffix: '+', label: 'Successful Joins', c1: '#EC4899', c2: '#FF1F4B' },
    { ref: s4.ref, val: s4.val, suffix: '%', label: 'Positive Reviews', c1: '#F59E0B', c2: '#FCD34D' },
  ];
  return (
    <section className="py-5">
      <div className="grid grid-cols-2 gap-2.5">
        {stats.map((s, i) => (
          null
        ))}
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorks({ onJoin }: { onJoin: () => void }) {
  const T = useT();
  const steps = [
    { icon: CreditCard, label: 'Pay Entry Fee', desc: `One-time ${formatPrice(PRICING.mobile.amount)} payment via UPI`, c1: B1, c2: '#FF6B35' },
    { icon: Send,       label: 'Join Datespot', desc: 'Receive the Telegram group link instantly', c1: '#10B981', c2: '#34D399' },
    { icon: Heart,      label: 'Start Dating',  desc: 'Chat, call & meet verified women', c1: '#EC4899', c2: '#F97316' },
  ];
  return (
    <section className="py-5">
      <div className="mb-4">
        <h2 className="font-extrabold text-xl" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>How It Works</h2>
        <p className="text-xs font-semibold mt-0.5" style={{ color: T.MUTED }}>3 simple steps</p>
      </div>
      <div className="relative">
        <div className="absolute left-[22px] top-6 bottom-6 w-[2px] opacity-20 rounded-full" style={{ background: HERO_GRAD }} />
        <div className="flex flex-col gap-3">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 rounded-2xl px-4 py-3.5 relative"
                style={{ background: T.CARD_BG, border: `1px solid ${T.BORDER}`, boxShadow: T.isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${st.c1}` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color: T.DARK }}>{st.label}</div>
                  <div className="text-[11px] font-medium mt-0.5" style={{ color: T.MUTED }}>{st.desc}</div>
                </div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${st.c1}18`, color: st.c1 }}>
                  Step {i + 1}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Why Trust ────────────────────────────────────────────────────────────────
function WhyTrust() {
  const T = useT();
  const cards = [
    { icon: UserCheck,  title: 'Manual Profile Verification', desc: 'Every member is verified by admin before getting access.', c1: B1, c2: '#FF6B35' },
    { icon: Users,      title: 'Active Bangalore Community',  desc: '548+ real members from Bangalore, active daily.', c1: '#10B981', c2: '#34D399' },
    { icon: Shield,     title: 'No Fake Profiles Policy',     desc: 'Instant removal of any fake or spam profiles.', c1: '#8B5CF6', c2: '#C084FC' },
    { icon: Headphones, title: 'Direct Admin Support',        desc: 'Get help from Subhash directly, fast response guaranteed.', c1: '#EC4899', c2: '#F97316' },
  ];
  return (
    null
  );
}

// ─── Meet the Admin ───────────────────────────────────────────────────────────
function MeetAdmin() {
  const T = useT();
  const badges = ['5+ Years Community Experience', 'Personally Verified Members', 'Fast Support'];
  return (
    null
  );
}

// ─── Trust Proof ──────────────────────────────────────────────────────────────
function TrustProof() {
  const T = useT();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const dragStart = useRef(0);

  const proofCards = [
    { img: proofReview1, label: 'Member Review',     emoji: '⭐', color: '#F59E0B',
      review: REVIEWS[2] },
    { img: proofReview2, label: 'Community Active',  emoji: '💬', color: B1,
      review: REVIEWS[4] },
    { img: proofReview3, label: 'Real Testimonial',  emoji: '🔥', color: '#EC4899',
      review: REVIEWS[6] },
  ];

  useEffect(() => {
    const t = setInterval(() => { setDirection(1); setCurrent(p => (p + 1) % proofCards.length); }, 3800);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number, d: number) => { setDirection(d); setCurrent(i); };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? '55%' : '-55%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? '-55%' : '55%', opacity: 0 }),
  };

  const c = proofCards[current];
  const r = c.review;

  return (
    <section className="py-3">
      <div className="flex items-center justify-between mb-3">
        <div className="border-l-[3px] pl-3" style={{ borderColor: B1 }}>
          <h2 className="font-extrabold text-lg" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>Proof It Works</h2>
          <p className="text-[11px] font-semibold mt-0.5" style={{ color: T.MUTED }}>Real activity, real results</p>
        </div>
        <span className="text-xs font-extrabold px-3 py-1.5 rounded-full" style={{ color: B1, background: T.isDark ? 'rgba(90,70,255,.16)' : '#EEECFF' }}>
          {current + 1} / {proofCards.length}
        </span>
      </div>

      <div className="relative select-none"
        onTouchStart={e => { dragStart.current = e.touches[0].clientX; }}
        onTouchEnd={e => { const dx = dragStart.current - e.changedTouches[0].clientX; if (Math.abs(dx) > 40) dx > 0 ? goTo((current + 1) % proofCards.length, 1) : goTo((current - 1 + proofCards.length) % proofCards.length, -1); }}>
        <AnimatePresence custom={direction} mode="wait">
          <motion.div key={current} custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="w-full min-h-[205px] sm:min-h-[230px] rounded-2xl overflow-hidden flex items-center gap-3 sm:gap-6 p-3 sm:p-5"
            style={{ background: T.CARD_BG, border: '1px solid rgba(105,86,244,.18)', boxShadow: T.isDark ? 'none' : '0 4px 18px rgba(50,40,120,.06)' }}>

            {/* Screenshot spotlight: original evidence, without a phone frame or crop. */}
            <div className="w-[47%] sm:w-[49%] h-[170px] sm:h-[195px] shrink-0 flex items-center justify-center rounded-2xl p-1.5 sm:p-2"
              style={{ background: T.isDark ? 'rgba(255,255,255,.05)' : '#FAF9FF', border: '1px solid rgba(105,86,244,.13)' }}>
              <img src={c.img} alt={c.label} loading="lazy"
                className="block w-full h-full object-contain rounded-xl"
                style={{ filter: 'drop-shadow(0 4px 10px rgba(30,20,90,.10))' }} />
            </div>

            <div className="min-w-0 flex-1 py-1">
              <div className="flex gap-0.5 mb-2" aria-label="5 out of 5 stars">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" style={{ color: '#F59E0B' }} />)}
              </div>
              <p className="text-[12px] sm:text-sm leading-relaxed font-semibold mb-3" style={{ color: T.QUOTE }}>"{r.text}"</p>
              <p className="text-[11px] sm:text-xs font-bold" style={{ color: T.MUTED }}>— {r.name}</p>
              <span className="text-[9px] font-semibold inline-block mt-1.5" style={{ color: B1 }}>{c.emoji} {c.label}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center gap-2 mt-3" aria-label="Select testimonial">
        {proofCards.map((_, i) => (
          <button key={i} onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Show proof ${i + 1}`} aria-current={i === current ? 'true' : undefined}
            className="rounded-full transition-all duration-300 p-1"
          ><span className="block rounded-full" style={{ width: 7, height: 7, background: i === current ? B1 : (T.isDark ? 'rgba(255,255,255,0.3)' : '#B9B9CE') }} /></button>
        ))}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

// Member-attributed FAQ responses supplied by the Datespot team.
const MEMBER_FAQ = [
  {
    "q": "Is Datespot genuine?",
    "a": "Yes it's genuine using it since last one year & met many beautiful women",
    "by": "Lohith gowda"
  },
  {
    "q": "Can I speak to someone before joining?",
    "a": "You can speak with admins before joining, but they won't directly let you speak with girls before joining",
    "by": "Mohan Kumar"
  },
  {
    "q": "How does joining works?",
    "a": "Pay entry fee and upload screenshot it will automatically redirects you to telegram. Pay madbekadre tension aguthe madidmale maja baruthe adu bare vishya :)",
    "by": "Rajesh"
  },
  {
    "q": "Are members verified?",
    "a": "Yep everyone are real girls that's the best part of this group",
    "by": "Arun aru"
  },
  {
    "q": "Is the membership fee refundable?",
    "a": "No i seen that they refund only in group services money, entry fee is non refundable",
    "by": "Kalyan Shetty"
  },
  {
    "q": "Is this worth trying? Can i get dating or even more then that?",
    "a": "Deffiently Worth varma worth!!, this is more then dating and you will realise once you joined.",
    "by": "Rajesh"
  }
];
function FAQ() {
  const T = useT();
  const [open, setOpen] = useState<number | null>(null);
  const items = MEMBER_FAQ;

  return (
    <section className="py-3" aria-labelledby="trust-faq-heading">
      <div className="mb-2">
        <h2 id="trust-faq-heading" className="text-base font-extrabold" style={{ color: T.DARK }}>Frequently Asked Questions</h2>
        <p className="text-[10px] mt-0.5 font-bold" style={{ color: T.MUTED }}>Answered by our Group members</p>
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ background: T.CARD_BG, border: '1px solid rgba(25,68,241,.18)' }}>
        {items.map((item, i) => (
          <div key={item.q} style={{ borderBottom: i === items.length - 1 ? 'none' : '1px solid rgba(125,130,170,.14)' }}>
            <button type="button" className="w-full flex items-center justify-between gap-2 text-left px-3.5 py-2.5"
              aria-expanded={open === i} aria-controls={`trust-faq-answer-${i}`}
              onClick={() => setOpen(open === i ? null : i)}>
              <span className="text-[11.5px] sm:text-sm font-bold" style={{ color: T.DARK }}>{item.q}</span>
              <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} style={{ color: B1 }} />
            </button>
            {open === i && (
              <div id={`trust-faq-answer-${i}`} className="px-3.5 pb-3 text-[11px] sm:text-xs leading-relaxed" style={{ color: T.MUTED }}>
                <p className="italic">&ldquo;{item.a}&rdquo;</p>
                <p className="font-extrabold mt-1.5" style={{ color: B1 }}>~ {item.by}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div id="telegram-support" className="mt-2.5 rounded-2xl px-3.5 py-3 flex flex-col gap-2.5"
        style={{ background: T.isDark ? 'rgba(25,68,241,.10)' : '#F1F4FF', border: '1px solid rgba(25,68,241,.16)' }}>
        <div>
          <p className="text-[12px] font-extrabold" style={{ color: T.DARK }}>Need help before joining?</p>
          <p className="text-[10px] mt-0.5" style={{ color: T.MUTED }}>Message @subhash8055g on Telegram</p>
        </div>
        <a href="https://t.me/subhash8055g" target="_blank" rel="noopener noreferrer"
          aria-label="Chat with Datespot support on Telegram before joining"
          className="group inline-flex flex-nowrap items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-white text-[12px] font-extrabold w-full whitespace-nowrap shadow-md transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(110deg, #149DDD 0%, #1944F1 90%)', boxShadow: '0 4px 12px rgba(25,68,241,.18)' }}>
          <Send className="w-4 h-4 shrink-0" />
          <span>Chat on Telegram</span>
          <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}

// A tiny, theme-aware status below the primary CTA (no progress bar).
function SlotsCounter() {
  const T = useT();
  const { slots } = useSlots();
  return (
    <div role="status" aria-live="polite"
      className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold leading-4"
      style={{
        color: T.DARK,
        background: T.isDark ? 'rgba(25,68,241,0.10)' : 'rgba(25,68,241,0.06)',
        border: '1px solid rgba(25,68,241,0.24)',
      }}>
      <span className="w-1.5 h-1.5 shrink-0 rounded-full" style={{ background: B1 }} />
      <strong className="font-extrabold" style={{ color: B1 }}>{slots}</strong>
      <span>{slots === 0 ? 'slots left' : 'only slots left'}</span>
    </div>
  );
}

// ─── Sticky CTA ───────────────────────────────────────────────────────────────
function StickyCTA({ onJoin }: { onJoin: () => void }) {
  const T = useT();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const support = document.getElementById('telegram-support');
      const rect = support?.getBoundingClientRect();
      // Hide the sticky join CTA while the Telegram support card is on screen.
      const supportVisible = !!rect && rect.top < window.innerHeight - 90 && rect.bottom > 0;
      setVisible(window.scrollY > 300 && !supportVisible);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-2"
          style={{ background: T.isDark ? '#000000' : '#F5F3F3' }}>
          <motion.button
            onClick={onJoin}
            whileTap={{ scale: 0.97 }}
            className="relative w-full max-w-md mx-auto block rounded-2xl overflow-hidden"
            style={{ background: HERO_GRAD, boxShadow: `0 6px 28px ${B1}60` }}>
            {/* Shimmer sweep */}
            <motion.div className="absolute inset-0 pointer-events-none"
              animate={{ x: ['-100%', '160%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.4, ease: 'easeInOut' }}
              style={{ background: 'rgba(255,255,255,0.14)', width: '60%' }} />
            <div className="relative flex items-center justify-center gap-2 py-3.5 px-3 whitespace-nowrap">
              <span className="font-extrabold text-white text-[clamp(11px,3.3vw,15px)] tracking-tight shrink-0">Try Now for just {formatPrice(PRICING.mobile.amount)}</span>
              <ArrowRight className="w-4 h-4 text-white shrink-0" />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
function MobileApp() {
  const T = useT();
  const [showPayment, setShowPayment] = useState(false);
  const [showChat,    setShowChat]    = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'demo'>('full');
  const constraintsRef = useRef<HTMLDivElement>(null);

  const handleJoin = (type: 'full' | 'demo') => {
    setPaymentType(type);
    setShowPayment(true);
  };

  return (
    <div ref={constraintsRef} className="min-h-screen w-full relative overflow-x-hidden"
      style={{ ...dotGridStyle(T), fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <ThemeToggle />

      {/* Urgency Banner */}

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4">

        {/* Stats */}
        <StatsSection />

        {/* Gallery */}
        <GroupPreviewSlider mobile />

        {/* Final CTA */}
        <section className="pt-2 pb-8">
          <div className="rounded-3xl overflow-hidden" style={{ background: T.CARD_BG, border: '1px solid rgba(25,68,241,0.22)', boxShadow: `0 0 40px ${B1}15` }}>
            <div className="h-[3px]" style={{ background: HERO_GRAD }} />
            <div className="px-5 py-5 flex flex-col items-center text-center gap-4">


              {/* Price */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold" style={{ color: T.MUTED }}>Try Now for just</span>
                <div className="flex items-baseline gap-2 justify-center">
                <span className="font-black text-4xl leading-none" style={{ color: B1 }}>{formatPrice(PRICING.mobile.amount)}</span>
                </div>
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => handleJoin('full')}
                className="w-full rounded-xl font-black text-white flex items-center justify-center gap-2 relative overflow-hidden"
                style={{ background: HERO_GRAD, boxShadow: `0 6px 24px ${B1}50`, padding: '14px 20px' }}>
                <motion.div className="absolute inset-0"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' }}
                  style={{ background: 'rgba(255,255,255,0.12)' }} />
                <span className="text-sm tracking-tight relative z-10">Join Datespot Now</span>
                <ArrowRight className="w-4 h-4 relative z-10" />
              </motion.button>

              <div className="-mt-1"><SlotsCounter /></div>
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-5">
          <div className="mb-4">
            <h2 className="font-extrabold text-xl" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>What You Get</h2>
            <p className="text-xs font-semibold mt-0.5" style={{ color: T.MUTED }}>Everything inside the group</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {FEAT.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3.5 rounded-2xl px-4 py-3 relative"
                  style={{ background: T.CARD_BG, border: `1px solid ${f.c1}22`, boxShadow: T.isDark ? 'none' : '0 1px 6px rgba(0,0,0,0.05)' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${f.c1}` }}>
                    <Icon className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-[13px]" style={{ color: T.DARK }}>{f.title}</div>
                    <div className="text-[11px] font-medium mt-0.5" style={{ color: T.MUTED }}>{f.desc}</div>
                  </div>
                  {f.badge && (
                    <span className="text-[8px] font-black px-2 py-0.5 rounded-full shrink-0"
                      style={{ background: `${f.c1}22`, color: f.c1, border: `1px solid ${f.c1}40` }}>
                      {f.badge}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Why Trust */}
        <WhyTrust />

        {/* Meet Admin */}
        <MeetAdmin />

        {/* Reviews slider */}
        <ReviewsStrip />

        {/* FAQ */}
        <FAQ />

      </div>

      {/* Sticky CTA */}
      <StickyCTA onJoin={() => handleJoin('full')} />

      <AnimatePresence>
        {showPayment && <PaymentModal onClose={() => setShowPayment(false)} paymentType={paymentType} device="mobile" />}
        {showChat    && <ChatOverlay onClose={() => setShowChat(false)} onOpenPayment={() => handleJoin('full')} />}
      </AnimatePresence>

      <Toaster position="top-center" toastOptions={{
        style: { background: T.CARD_BG, color: T.DARK, borderRadius: '14px', fontSize: '13px', fontWeight: '700', border: `1px solid ${B1}4D`, boxShadow: `0 8px 24px ${B1}40` },
      }} />
    </div>
  );
}

// Founder-script onboarding: the six photos are served from public/intro/.
const INTRO_SCENES = [
  {
    image: '/i__nikki_1715514894_3366305381556228883_3585902640.jpg',
    title: 'Tired of dating apps & scams online?',
    detail: '',
    emoji: '💔',
    duration: 3200,
  },
  {
    image: '/keerthiradha5996_1695995507_3202564893683506522_10375669288.jpg',
    title: "It's too difficult to find real dating, isn't it?",
    detail: '',
    emoji: '💬',
    duration: 3600,
  },
  {
    image: '/im_r.u.p.a._goli.__1659930973_2900033653183041738_3927231853.jpg',
    title: "That's why we started Datespot.",
    detail: "No fake profiles, no time-waste, and mainly it's safe & secure!",
    emoji: '🛡️',
    duration: 4700,
  },
  {
    image: '/tanvika_annareddy_1717421495_3382299111645432410_3571364442.jpg',
    title: 'Nam state bagge namge thane gothu :)',
    detail: '',
    emoji: '💛',
    duration: 3400,
  },
  {
    image: '/kalpani_akarsha_1759460034_3734943935123587451_48838473030.jpg',
    title: "So if you're searching for a safe & genuine place where you can get A to Z dating services —",
    detail: '',
    emoji: '💞',
    duration: 4700,
  },
  {
    image: '/akshata_shetty_30_1739801346_3570034902841689910_1513149867.jpg',
    title: 'Banni Nam group join agi!',
    detail: '',
    emoji: '🚀',
    duration: 0,
  },
] as const;

function DatespotIntro({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const [photoFailed, setPhotoFailed] = useState(false);
  const finish = () => {
    localStorage.setItem('ds_intro_seen', '1');
    onFinish();
  };
  useEffect(() => {
    if (step === INTRO_SCENES.length - 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => setStep(i => Math.min(i + 1, INTRO_SCENES.length - 1)), INTRO_SCENES[step].duration);
    return () => window.clearTimeout(timer);
  }, [step]);
  useEffect(() => { setPhotoFailed(false); }, [step]);

  const scene = INTRO_SCENES[step];
  const last = step === INTRO_SCENES.length - 1;
  return (
    <main className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto px-3 py-3 md:px-8 md:py-6"
      style={{ background: 'radial-gradient(circle at 50% 20%, #E7EFFF, #FFFFFF 70%)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(#AFC3F7 1px, transparent 1px)', backgroundSize: '23px 23px' }} />
      <motion.section
        initial={{ opacity: 0, y: 16, scale: .98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: .45 }}
        className="relative w-full max-w-[415px] md:max-w-[790px] rounded-[24px] bg-white border border-[#DDE6FF] shadow-[0_16px_65px_rgba(25,68,241,.13)] overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-4 pb-2 md:px-7 md:pt-5">
          <span className="text-[#1944F1] text-lg font-extrabold tracking-tight">Datespot 💙</span>
          <button type="button" onClick={finish}
            className="px-3 py-1.5 text-xs font-bold text-[#64748B] rounded-lg hover:bg-[#EEF3FF]">Skip</button>
        </div>
        <div className="flex gap-1.5 px-5 pb-3 md:px-7" aria-label={`Scene ${step + 1} of ${INTRO_SCENES.length}`}>
          {INTRO_SCENES.map((item, i) => (
            <button key={i} type="button" className="h-1.5 flex-1 rounded-full overflow-hidden bg-[#DDE5F6]"
              onClick={() => setStep(i)} aria-label={`Go to scene ${i + 1}`}>
              {i < step ? <span className="block h-full w-full bg-[#1944F1]" /> :
                i === step ? <motion.span className="block h-full bg-[#1944F1]" key={step}
                  initial={{ width: '0%' }} animate={{ width: '100%' }}
                  transition={{ duration: item.duration ? item.duration / 1000 : .5, ease: 'linear' }} /> : null}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 35 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -35 }} transition={{ duration: .38, ease: 'easeOut' }}
            className="px-4 pb-4 md:px-7 md:pb-7 grid md:grid-cols-[320px_minmax(0,1fr)] gap-4 md:gap-7 items-center">
            <div className="relative rounded-[19px] overflow-hidden w-full h-[32dvh] min-h-[190px] max-h-[290px] md:h-[385px] md:max-h-none bg-gradient-to-br from-[#DAE5FF] to-[#F3F7FF]">
              <div className="absolute inset-0 flex justify-center items-center text-7xl" aria-hidden="true">{scene.emoji}</div>
              {!photoFailed && (
                <motion.img src={scene.image} alt="Datespot onboarding visual"
                  onError={() => setPhotoFailed(true)}
                  className="relative z-10 w-full h-full object-cover object-[center_25%]"
                  initial={{ scale: 1.04 }} animate={{ scale: 1.0 }}
                  transition={{ duration: 3.5, ease: 'easeOut' }} />
              )}
              <div className="absolute z-20 bottom-0 inset-x-0 h-14 pointer-events-none bg-gradient-to-t from-[#0D2B80]/25 to-transparent" />
            </div>
            <div className="text-center md:text-left flex flex-col justify-center md:min-h-[290px]">
              <motion.h1 className="text-[21px] sm:text-2xl md:text-[31px] font-black tracking-tight leading-[1.18] text-[#0E1B3B]"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .13, duration: .4 }}>{scene.title}</motion.h1>
              {scene.detail && (
                <motion.p className="mt-2.5 md:mt-4 text-sm md:text-lg leading-relaxed font-semibold text-[#1944F1]"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .3, duration: .4 }}>{scene.detail}</motion.p>
              )}
              <button type="button"
                onClick={() => last ? finish() : setStep(i => Math.min(i + 1, INTRO_SCENES.length - 1))}
                className="w-full md:w-auto md:self-start rounded-xl px-7 py-3 mt-4 md:mt-7 bg-[#1944F1] text-white font-extrabold text-sm flex items-center justify-center gap-2 active:scale-[.98] transition-transform shadow-[0_6px_20px_rgba(25,68,241,.22)]">
                {last ? 'Try Now' : 'Next'} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.section>
    </main>
  );
}

export default function App() {
  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const [showIntro, setShowIntro] = useState(true);
  return (
    <ThemeProvider>
      <SlotsProvider>
        {showIntro ? <DatespotIntro onFinish={() => setShowIntro(false)} /> : (isMobile
          ? <MobileApp />
          : <DesktopWrapper />)}
      </SlotsProvider>
    </ThemeProvider>
  );
}

function DesktopWrapper() {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentType, setPaymentType] = useState<'full' | 'demo'>('full');
  const handleJoin = (type: 'full' | 'demo') => {
    setPaymentType(type);
    setShowPayment(true);
  };
  return (
    <>
      <DesktopVersion onOpenPayment={handleJoin} showPayment={showPayment} onClosePayment={() => setShowPayment(false)} paymentType={paymentType} />
    </>
  );
}


/* Desktop-only hero. The mobile screen is rendered by MobileApp and is not affected. */
function DesktopHero() {
  const T = useT();
  const [category, setCategory] = useState<PreviewCategory>('Group');
  const images = PREVIEW_IMAGES[category];

  return (
    <section className="relative max-w-7xl mx-auto px-8 lg:px-12 xl:pl-[205px] pt-12 lg:pt-16 pb-5">
      <div className="grid grid-cols-2 gap-6 lg:gap-12 xl:gap-16 items-center">
        {/* Desktop-only Karnataka outline; red/yellow are used only on the border. */}
        <div className="hidden xl:flex items-center justify-center absolute left-[10px] top-[75px] w-[175px] h-[330px] pointer-events-none" aria-hidden="true">
          <svg viewBox="0 0 270 440" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="karnatakaBorder" x1="110" y1="0" x2="130" y2="440" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#F7D000" />
                <stop offset="52%" stopColor="#F7D000" />
                <stop offset="53%" stopColor="#E31B23" />
                <stop offset="100%" stopColor="#E31B23" />
              </linearGradient>
            </defs>
            <path d="M183 12 L192 24 L188 39 L202 47 L198 60 L206 74 L195 87 L199 104 L187 114 L190 131 L179 141 L181 158 L170 170 L174 189 L163 204 L170 219 L163 233 L172 250 L189 246 L203 257 L216 254 L227 269 L241 270 L248 287 L237 303 L224 309 L219 326 L202 332 L193 348 L176 351 L168 371 L149 379 L142 398 L121 405 L113 420 L94 414 L82 398 L65 391 L57 374 L43 369 L38 347 L27 335 L31 318 L21 301 L26 285 L19 269 L27 251 L18 235 L27 217 L24 199 L33 182 L28 165 L40 151 L37 134 L51 124 L48 110 L65 99 L76 102 L89 89 L105 94 L116 81 L134 79 L142 64 L158 61 L164 44 L176 40 L173 26 Z"
              stroke="url(#karnatakaBorder)" strokeWidth="5.5" strokeLinejoin="round" strokeLinecap="round" />
            <path d="M122 225c-14 0-25 11-25 25 0 19 25 43 25 43s25-24 25-43c0-14-11-25-25-25Z" fill="#6D28D9"/>
            <circle cx="122" cy="250" r="8" fill="white"/>
            <text x="122" y="322" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="700">Karnataka</text>
          </svg>
        </div>
        <div className="min-w-0">
          <div className="inline-flex items-center rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-widest mb-7"
            style={{ color: B1, background: T.isDark ? 'rgba(25,68,241,.13)' : '#FFFFFF', border: '1px solid rgba(25,68,241,.22)' }}>
            Datespot · Bangalore
          </div>
          <h1 className="font-black leading-[1.1] mb-7"
            style={{ color: T.DARK, fontSize: 'clamp(36px,4.1vw,60px)', letterSpacing: '-0.05em' }}>
            Meet people. <span style={{ color: B1 }}>Make connections.</span>
          </h1>
          <p className="text-base lg:text-lg leading-relaxed max-w-lg mb-8" style={{ color: T.MUTED }}>
            Discover a Telegram community with group chats, voice calls and opportunities to meet in person.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
            {[
              { label: 'Group chats', icon: Users },
              { label: 'Voice calls', icon: Mic },
              { label: 'Direct meets', icon: MapPin },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-2.5 text-xs lg:text-sm font-bold"
                  style={{ color: T.DARK }}>
                  <span className="w-9 h-9 rounded-xl inline-flex items-center justify-center"
                    style={{ background: T.isDark ? 'rgba(25,68,241,.22)' : '#E8EEFF' }}>
                    <Icon className="w-4 h-4" style={{ color: B1 }} />
                  </span>
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Use the original layered mobile mockup on desktop as well. */}
        <div className="min-w-0">
          <GroupPreviewSlider />
        </div>
      </div>
    </section>
  );
}

/* Desktop-only FAQ, deliberately separate from the mobile FAQ component. */
function DesktopFAQ() {
  const T = useT();
  const [open, setOpen] = useState<number | null>(0);
  const items = MEMBER_FAQ;
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold mb-2" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>Frequently Asked Questions</h2>
        <p className="text-base font-medium" style={{ color: T.MUTED }}>Answered by our Group members</p>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={item.q} className="rounded-2xl overflow-hidden"
            style={{ background: T.CARD_BG, border: '1px solid ' + (open === i ? B1 + '66' : T.BORDER) }}>
            <button type="button" className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left"
              aria-expanded={open === i} aria-controls={'desktop-faq-answer-' + i}
              onClick={() => setOpen(prev => prev === i ? null : i)}>
              <span className="font-bold text-base" style={{ color: T.DARK }}>{item.q}</span>
              <ChevronDown className={'w-5 h-5 shrink-0 transition-transform ' + (open === i ? 'rotate-180' : '')}
                style={{ color: B1 }} />
            </button>
            {open === i && (
              <div id={'desktop-faq-answer-' + i} className="px-6 pb-5 -mt-1 text-sm leading-relaxed"
                style={{ color: T.MUTED }}>
                <p className="italic">&ldquo;{item.a}&rdquo;</p>
                <p className="font-extrabold mt-2" style={{ color: B1 }}>~ {item.by}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Desktop Version ──────────────────────────────────────────────────────────
function DesktopVersion({ onOpenPayment, showPayment, onClosePayment, paymentType }: {
  onOpenPayment: (type: 'full' | 'demo') => void;
  showPayment: boolean; onClosePayment: () => void; paymentType: 'full' | 'demo';
}) {
  const T = useT();
  return (
    <div className="min-h-screen w-full relative" style={{ ...dotGridStyle(T), fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <ThemeToggle />
      <DesktopHero />

      {/* Desktop-only join CTA, with no sale or discount promotion. */}
      <section className="relative max-w-7xl mx-auto px-8 pt-10 pb-16 text-center isolate">
        <div aria-hidden="true" className="pointer-events-none absolute -z-10 rounded-[50%]"
          style={{ width: '92%', height: 230, left: '4%', top: 115,
            background: T.isDark ? 'rgba(25,68,241,.075)' : 'rgba(25,68,241,.045)' }} />
        <h2 className="font-black text-4xl mb-2" style={{ color: T.DARK, letterSpacing: '-0.04em' }}>Ready to Join?</h2>
        <div className="flex items-baseline gap-3 justify-center mb-5">
          <span className="font-black text-5xl leading-none" style={{ color: B1 }}>{formatPrice(PRICING.desktop.amount)}</span>
        </div>
        <button type="button" onClick={() => onOpenPayment('full')}
          className="w-full max-w-[360px] rounded-2xl font-extrabold text-white text-base inline-flex items-center justify-center gap-3 px-10 py-4 transition-transform hover:scale-[1.02] active:scale-[.98]"
          style={{ background: B1, boxShadow: '0 8px 22px rgba(25,68,241,.18)' }}>
          Join Datespot Now <ArrowRight className="w-5 h-5" />
        </button>
        <div className="mt-3"><SlotsCounter /></div>
      </section>

      {/* What You Get — row list */}
      <section className="max-w-5xl mx-auto px-8 pb-12">
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-4xl mb-2" style={{ color: T.DARK, letterSpacing: '-0.04em' }}>What You Get</h2>
          <p className="text-lg font-medium" style={{ color: T.MUTED }}>Everything inside the group, from day one</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {FEAT.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl px-5 py-4"
                style={{ background: T.CARD_BG, border: `1px solid ${f.c1}22`, boxShadow: T.isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.05)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${f.c1}` }}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color: T.DARK }}>{f.title}</div>
                  <div className="text-xs font-medium mt-0.5" style={{ color: T.MUTED }}>{f.desc}</div>
                </div>
                {f.badge && (
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${f.c1}22`, color: f.c1, border: `1px solid ${f.c1}40` }}>
                    {f.badge}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Admin + Why Trust side by side */}
      <section className="max-w-5xl mx-auto px-8 pb-12 grid grid-cols-2 gap-8">
        <MeetAdmin />
        <WhyTrust />
      </section>

      {/* Proof It Works */}
      <section className="max-w-3xl mx-auto px-8 pb-12">
        <TrustProof />
      </section>

      {/* Reviews grid — original review text with the new member-photo avatars. */}
      <section className="max-w-5xl mx-auto px-8 pb-12">
        <div className="text-center mb-8">
          <h2 className="font-extrabold text-3xl mb-1" style={{ color: T.DARK, letterSpacing: '-0.03em' }}>What Members Say</h2>
          <p className="text-base font-medium" style={{ color: T.MUTED }}>Real reviews from Bangalore</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {REVIEWS.slice(0, MEMBER_PHOTOS.length).map((review, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{ background: T.CARD_BG, border: `1.5px solid ${B1}18`, boxShadow: T.isDark ? 'none' : '0 1px 8px rgba(0,0,0,0.06)' }}>
              <div className="absolute top-0 left-0 w-1 h-full rounded-l-2xl" style={{ background: B1 }} />
              <div className="flex gap-0.5 mb-2 ml-1">
                {Array.from({ length: 5 }, (_, j) => <Star key={j} className="w-2.5 h-2.5 fill-current" style={{ color: '#F59E0B' }} />)}
              </div>
              <p className="text-sm leading-relaxed mb-3 font-medium ml-1" style={{ color: T.QUOTE }}>&ldquo;{review.text}&rdquo;</p>
              <div className="flex items-center gap-2 ml-1">
                <img src={MEMBER_PHOTOS[i]} alt="Reviewer profile" loading="lazy"
                  className="w-9 h-9 rounded-full object-cover object-center shrink-0"
                  style={{ border: `2px solid ${B1}40` }} />
                <div>
                  <div className="font-bold text-xs" style={{ color: T.DARK }}>{review.name}</div>
                  <div className="text-[10px] font-semibold flex items-center gap-0.5" style={{ color: T.MUTED }}>
                    <MapPin className="w-2.5 h-2.5" />{review.area}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-8 pb-12">
        <DesktopFAQ />
      </section>

      {/* Desktop Telegram support — same admin contact as mobile */}
      <section className="max-w-3xl mx-auto px-8 pb-12">
        <div className="rounded-2xl px-6 py-6 flex items-center justify-between gap-6"
          style={{ background: T.isDark ? 'rgba(25,68,241,.10)' : '#F1F4FF', border: '1px solid rgba(25,68,241,.16)' }}>
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: T.DARK }}>Need help before joining?</h2>
            <p className="text-sm mt-1" style={{ color: T.MUTED }}>Contact @subhash8055g directly on Telegram</p>
          </div>
          <a href="https://t.me/subhash8055g" target="_blank" rel="noopener noreferrer"
            aria-label="Contact Datespot support on Telegram"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-white text-sm font-extrabold transition-transform hover:scale-[1.03] active:scale-[.98]"
            style={{ background: 'linear-gradient(110deg, #149DDD 0%, #1944F1 90%)', boxShadow: '0 4px 12px rgba(25,68,241,.18)' }}>
            <Send className="w-4 h-4" /> Contact on Telegram
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-8 text-center" style={{ borderTop: `1px solid rgba(25,68,241,0.2)` }}>
        <p className="text-sm font-semibold" style={{ color: T.MUTED }}>
          © 2026 Datespot Bangalore · One-time payment · Lifetime access · No hidden fees
        </p>
      </footer>

      <AnimatePresence>
        {showPayment && <PaymentModal onClose={onClosePayment} paymentType={paymentType} device="desktop" />}
      </AnimatePresence>
      <Toaster position="top-center" toastOptions={{
        style: { background: T.CARD_BG, color: T.DARK, borderRadius: '14px', fontSize: '14px', fontWeight: '700', border: `1px solid ${B1}30`, boxShadow: `0 8px 24px ${B1}40` },
      }} />
    </div>
  );
}

// ─── Chat Overlay ─────────────────────────────────────────────────────────────
type Message = { id: string; sender: 'bot' | 'user'; type: 'text' | 'audio' | 'button'; content: string; time: string; audioSrc?: string; };

function ChatOverlay({ onClose, onOpenPayment }: { onClose: () => void; onOpenPayment: () => void }) {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1', sender: 'bot', type: 'text',
    content: "Hi! I'm Komal. Tap a question to hear my answer!",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const handleAsk = (q: string, index: number) => {
    const t = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', type: 'text', content: q, time: t }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const msgs: Message[] = [{ id: (Date.now() + 1).toString(), sender: 'bot', type: 'audio', content: '',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), audioSrc: AUDIO_FILES[index] ?? undefined }];
      if (q === 'How to join?') msgs.push({ id: (Date.now() + 2).toString(), sender: 'bot', type: 'button', content: 'Join now',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      setMessages(prev => [...prev, ...msgs]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md mx-auto h-[82vh] rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
        style={{ background: CARD_BG }}>
        <div className="p-3.5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(25,68,241,0.15)', background: PAGE_BG }}>
          <div className="relative">
            <img src={chatAvatar} alt="Komal" className="w-10 h-10 rounded-full object-cover border-2" style={{ borderColor: B1 }} />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm" style={{ color: DARK }}>Komal</div>
            <div className="text-[10px] font-semibold" style={{ color: B1 }}>Admin · Online now</div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full" style={{ background: 'rgba(25,68,241,0.07)' }}>
            <X className="w-4 h-4" style={{ color: MUTED }} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2.5" style={{ background: PAGE_BG }}>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.sender === 'bot' && msg.type !== 'button' && (
                <img src={chatAvatar} alt="Komal" className="w-6 h-6 rounded-full object-cover shrink-0 mt-1" />
              )}
              <div className={`max-w-[78%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.type === 'button' ? (
                  <button onClick={() => { toast.success('Opening payment...'); onClose(); setTimeout(() => onOpenPayment(), 300); }}
                    className="px-5 py-2.5 rounded-2xl text-white font-bold text-xs active:scale-95 transition-transform shadow-md"
                    style={{ background: HERO_GRAD }}>
                    Try Now for just {formatPrice(PRICING.mobile.amount)}
                  </button>
                ) : (
                  <div className="px-3.5 py-2.5 text-xs shadow-sm"
                    style={msg.sender === 'user'
                      ? { background: HERO_GRAD, color: 'white', borderRadius: '18px 18px 4px 18px' }
                      : { background: '#050A1A', color: DARK, border: '1px solid rgba(25,68,241,0.2)', borderRadius: '18px 18px 18px 4px' }}>
                    {msg.type === 'text' ? <p>{msg.content}</p> : <VoiceMessageBubble audioSrc={msg.audioSrc} isUser={msg.sender === 'user'} />}
                    <div className="text-[8px] mt-1 opacity-40">{msg.time}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2">
              <img src={chatAvatar} alt="Komal" className="w-6 h-6 rounded-full object-cover shrink-0" />
              <div className="px-3.5 py-2.5 rounded-2xl flex gap-0.5 shadow-sm" style={{ background: '#050A1A', border: '1px solid rgba(25,68,241,0.2)' }}>
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: B1 }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4" style={{ background: CARD_BG, borderTop: '1px solid rgba(25,68,241,0.15)' }}>
          <p className="text-[9px] font-bold mb-2.5 text-center uppercase tracking-widest" style={{ color: MUTED }}>Tap to ask</p>
          <div className="space-y-1.5">
            {QUESTIONS.map((q, i) => (
              <button key={i} onClick={() => handleAsk(q, i)}
                className="w-full px-3.5 py-2.5 rounded-xl text-left text-xs font-semibold transition-all active:scale-[0.98]"
                style={{ background: '#050A1A', border: '1.5px solid rgba(25,68,241,0.2)', color: DARK }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Voice Message Bubble ─────────────────────────────────────────────────────
function VoiceMessageBubble({ audioSrc, isUser }: { audioSrc?: string; isUser?: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration);
    const onEnd  = () => setIsPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onMeta); audio.removeEventListener('ended', onEnd); };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); } else { audio.play(); toast.success('Playing...'); }
    setIsPlaying(!isPlaying);
  };

  const fmt = (t: number) => (!t || isNaN(t)) ? '0:00' : `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const waveColor = isUser ? 'rgba(255,255,255,0.9)' : B1;
  const waveFade  = isUser ? 'rgba(255,255,255,0.3)' : `${B1}30`;

  return (
    <div className="flex items-center gap-2 min-w-[155px]">
      <audio ref={audioRef} src={audioSrc} preload="metadata" />
      <button onClick={toggle} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0"
        style={{ background: isUser ? 'rgba(255,255,255,0.25)' : `${B1}18` }}>
        {isPlaying
          ? <Pause className="w-3.5 h-3.5 fill-current" style={{ color: isUser ? 'white' : B1 }} />
          : <Play  className="w-3.5 h-3.5 fill-current ml-0.5" style={{ color: isUser ? 'white' : B1 }} />}
      </button>
      <div className="flex-1">
        <div className="flex items-center gap-0.5 h-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-0.5 rounded-full transition-all"
              style={{ height: `${Math.max(20, i % 3 === 0 ? 55 : i % 2 === 0 ? 80 : 35)}%`, background: (i / 16) * 100 <= progress ? waveColor : waveFade }} />
          ))}
        </div>
        <span className="text-[8px] font-mono mt-0.5 block opacity-50">{fmt(isPlaying ? currentTime : duration)}</span>
      </div>
      <Mic className="w-3 h-3 opacity-35 shrink-0" style={{ color: isUser ? 'white' : B1 }} />
    </div>
  );
}

// ─── Payment Modal ────────────────────────────────────────────────────────────
type UploadState = 'idle' | 'verifying' | 'details' | 'saving' | 'success';

function PaymentModal({ onClose, paymentType, device }: { onClose: () => void; paymentType: 'full' | 'demo'; device: PricingDevice }) {
  const { isLive, refresh, setConfirmedSlots } = useSlots();
  const UPI_ID        = 'BHARATPE2R0S0C1D6V46619@unitype';
  const { amount: AMOUNT } = PRICING[device];
  const TELEGRAM_LINK = 'https://t.me/+CgjgUjhztc1lNDdl';
  // Google Apps Script endpoint for post-screenshot name and phone submission.
  const LEADS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbztOjvcCS6DkHxQvYadZQhStbwwXTYwQICgONaFxrpPqAvoP4_WpLuzmwz4thTSoqRAug/exec';
  const upiUrl        = `upi://pay?pa=${UPI_ID}&pn=Datespot&am=${AMOUNT}&cu=INR`;

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadError, setLeadError] = useState('');
  const [tab, setTab] = useState<'qr' | 'upi'>('qr');
  // A compact one-minute countdown, without implying the payment price expires.
  const [secondsLeft, setSecondsLeft] = useState(60);
  useEffect(() => {
    if (uploadState !== 'idle' || secondsLeft === 0) return;
    const id = window.setTimeout(() => setSecondsLeft(value => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft, uploadState]);
  const countdown = `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image screenshot.');
      return;
    }
    // The screenshot is inspected locally only; it is not uploaded, stored or verified as payment.
    setUploadState('verifying');
    try {
      await createImageBitmap(file).then(bitmap => bitmap.close());
      setLeadError('');
      setUploadState('details');
    } catch {
      setUploadState('idle');
      toast.error('Could not read this image. Please choose another screenshot.');
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = leadName.trim();
    const phone = leadPhone.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (name.length < 2) { setLeadError('Enter your name.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone)) { setLeadError('Enter a valid 10-digit Indian mobile number.'); return; }
    if (!LEADS_WEB_APP_URL) {
      setLeadError('Registration is temporarily unavailable. Please contact Telegram support.');
      return;
    }
    setLeadError('');
    setUploadState('saving');
    try {
      const params = new URLSearchParams({
        name, phone, amount: AMOUNT,
        source: device, screenshotSelected: 'Yes',
      });
      // Apps Script web apps require an opaque no-cors POST from the browser.
      // A completed fetch does not confirm the sheet write or payment.
      await fetch(LEADS_WEB_APP_URL, { method: 'POST', mode: 'no-cors', body: params });
      setUploadState('success');
      window.setTimeout(() => window.location.assign(TELEGRAM_LINK), 900);
    } catch {
      setUploadState('details');
      setLeadError('Could not submit your details. Please check your connection and retry.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={uploadState === 'idle' ? onClose : undefined} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md max-h-[88dvh] overflow-y-auto rounded-2xl shadow-2xl bg-white">
        {uploadState === 'idle' && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full z-20 hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}

        {/* Header */}
        <div className="px-4 pt-3 pb-2 flex items-center gap-2.5">
          <img src="/datespot-logo.svg" alt="Datespot logo"
            className="w-8 h-8 rounded-lg shrink-0 object-cover" />
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-none text-gray-900">Join Datespot</div>
            <div className="text-[10px] mt-0.5 font-medium text-gray-400">Lifetime access · Telegram</div>
          </div>
          <div className="text-right shrink-0 mr-7">
            <div className="font-extrabold text-2xl leading-none" style={{ color: B1 }}>{formatPrice(AMOUNT)}</div>
          </div>
        </div>

        <div className="px-4 pb-3">
          {uploadState === 'idle' && (
            <>
              {/* Neutral payment details; no discount or sale expiry claims. */}
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl mb-2" style={{ background: '#EEF2FF', border: '1px solid #D6DFFF' }}>
                <div className="flex items-center gap-2 min-w-0">
                  <CreditCard className="w-3.5 h-3.5 shrink-0" style={{ color: B1 }} />
                  <p className="text-[10px] font-black uppercase tracking-wide" style={{ color: B1 }}>Secure UPI Payment</p>
                </div>
                <span aria-label={`Countdown ${countdown}`} role="timer"
                  className="text-[12px] font-extrabold tabular-nums rounded-md px-2 py-1 shrink-0"
                  style={{ background: '#FFFFFF', border: '1px solid #D6DFFF', color: '#475569' }}>{countdown}</span>
              </div>
              <div className="flex rounded-xl p-1 mb-2" style={{ background: '#F1F4FA' }}>
                {(['qr', 'upi'] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold transition-all"
                    style={tab === t ? { background: B1, color: '#FFFFFF' } : { background: 'transparent', color: '#64748B' }}>
                    {t === 'qr' ? 'Scan QR' : 'UPI ID'}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {tab === 'qr' ? (
                  <motion.div key="qr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="rounded-xl p-2 mb-1 flex items-center justify-center" style={{ background: '#F8FAFC' }}>
                      <QRCodeSVG value={upiUrl} size={132} level="H" />
                    </div>
                    <p className="text-center text-[10px] mb-1 font-medium" style={{ color: "#475569" }}>Scan with any UPI app</p>
                  </motion.div>
                ) : (
                  <motion.div key="upi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-3">
                    <div className="rounded-2xl p-4 mb-2" style={{ background: '#F8FAFC' }}>
                      <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: "#475569" }}>UPI ID</p>
                      <p className="font-mono text-sm font-bold break-all mb-4 text-gray-800">{UPI_ID}</p>
                      <div className="flex gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(UPI_ID); toast.success('Copied!'); }}
                          className="flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                          style={{ border: `1.5px solid ${B1}`, color: B1, background: 'white' }}>
                          <Copy className="w-3.5 h-3.5" /> Copy
                        </button>
                        <a href={upiUrl}
                          className="flex-1 py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
                          style={{ background: HERO_GRAD }}
                          onClick={() => toast.success('Opening UPI app...')}>
                          <ExternalLink className="w-3.5 h-3.5" /> Pay
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* UPI apps accepted: reference image */}
              <div className="rounded-lg px-2 py-1 mb-1 max-w-[170px] mx-auto" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <img
                  src="/upi-apps-accepted.webp"
                  alt="UPI, Paytm, Google Pay and PhonePe accepted"
                  className="block w-full h-auto max-h-[48px] object-contain mx-auto rounded-md"
                  loading="lazy"
                />
              </div>

              <div className="pt-2 mt-1" style={{ borderTop: `1px solid ${B1}12` }}>
                <p className="text-center text-[10px] mb-2 font-medium" style={{ color: '#475569' }}>Select your payment screenshot to continue. Payment will be reviewed separately.</p>
                <input type="file" id="ss-upload" className="hidden" accept="image/*" onChange={handleFileChange} />
                <label htmlFor="ss-upload"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-white font-bold text-sm cursor-pointer active:scale-95 transition-transform"
                  style={{ background: B1 }}>
                  <Upload className="w-4 h-4" /> Select Payment Screenshot
                </label>
              </div>
            </>
          )}

          {uploadState === 'verifying' && (
            <div className="text-center py-8" role="status">
              <Loader2 className="w-9 h-9 animate-spin mx-auto mb-3" style={{ color: B1 }} />
              <p className="font-bold text-gray-900">Checking screenshot...</p>
              <p className="text-xs text-gray-500 mt-1">Next, enter your name and mobile number</p>
            </div>
          )}
          {uploadState === 'details' && (
            <form className="py-5 space-y-4" onSubmit={handleLeadSubmit}>
              <div className="text-center">
                <CheckCircle className="w-9 h-9 mx-auto mb-2" style={{ color: B1 }} />
                <h2 className="text-lg font-extrabold text-gray-900">One last step</h2>
                <p className="text-xs text-gray-500 mt-1">Screenshot selected. Enter your details to continue to Telegram.</p>
              </div>
              <div>
                <label htmlFor="post-payment-name" className="block text-xs font-bold text-gray-700 mb-1.5">Your name</label>
                <input id="post-payment-name" type="text" autoComplete="name" required maxLength={80}
                  value={leadName} onChange={e => setLeadName(e.target.value)}
                  placeholder="Enter your name" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-blue-500" />
              </div>
              <div>
                <label htmlFor="post-payment-phone" className="block text-xs font-bold text-gray-700 mb-1.5">Mobile number</label>
                <div className="flex items-center rounded-xl border border-gray-300 overflow-hidden focus-within:border-blue-500">
                  <span className="px-3 py-3 bg-gray-50 text-sm font-bold text-gray-600 border-r border-gray-200">+91</span>
                  <input id="post-payment-phone" type="tel" autoComplete="tel-national" inputMode="numeric" required
                    maxLength={10} value={leadPhone} onChange={e => setLeadPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit mobile number" className="flex-1 min-w-0 px-3 py-3 text-sm text-gray-900 outline-none" />
                </div>
              </div>
              {leadError && <p role="alert" className="text-xs text-red-600 font-semibold">{leadError}</p>}
              <button type="submit" className="w-full py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2" style={{ background: B1 }}>
                Continue to Telegram <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-center text-gray-500">Your details will be submitted for group access. Payment is not automatically verified. The screenshot is not stored.</p>
              {!LEADS_WEB_APP_URL && <a className="block text-center text-xs font-bold" style={{ color: B1 }} href="https://t.me/subhash8055g" target="_blank" rel="noopener noreferrer">Contact Telegram support</a>}
            </form>
          )}
          {uploadState === 'saving' && (
            <div className="text-center py-8" role="status">
              <Loader2 className="w-9 h-9 animate-spin mx-auto mb-3" style={{ color: B1 }} />
              <p className="font-bold text-gray-900">Submitting your details...</p>
              <p className="text-xs text-gray-500 mt-1">Please don't close this page</p>
            </div>
          )}
          {uploadState === 'success' && (
            <div className="text-center py-7" role="status">
              <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: B1 }} />
              <p className="font-bold text-gray-900">Details sent. Opening Telegram...</p>
              <p className="text-xs text-gray-500 mt-1 mb-4">If Telegram doesn't open, use the button below.</p>
              <a href={TELEGRAM_LINK} className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-bold text-sm" style={{ background: B1 }}>
                <Send className="w-4 h-4" /> Open Telegram Group <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[10px] text-gray-500 mt-3">Screenshot is not uploaded or stored. Submission and payment are not independently verified.</p>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
