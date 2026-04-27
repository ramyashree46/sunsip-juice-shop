import React, { useEffect, useMemo, useState } from 'react';
import {
  ShoppingCart, User, Menu as MenuIcon, MapPin, Phone, Mail, Star,
  Plus, Minus, X, ArrowRight, LogIn, LogOut, CheckCircle2, Sparkles,
  Sun, Snowflake, Lock, Eye, EyeOff, Send, Trash2, Inbox, Download,
  Instagram, Facebook, Twitter, Heart, Search, Flame, Droplet,
} from 'lucide-react';

// ── AI image helper (Pollinations.ai · turbo model · ~1-2s real-time) ────
const QUALITY_SUFFIX = ', professional food photography, hyperrealistic, vibrant colors, sharp focus, mouth-watering, no text, no watermark';
const aiImg = (prompt, seed = 1, w = 768, h = 768) =>
  `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + QUALITY_SUFFIX)}?width=${w}&height=${h}&nologo=true&model=turbo&seed=${seed}`;

const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');

// ── Data ──────────────────────────────────────────────────────────────────
const JUICES = [
  { id: 'j1',  name: 'Mango Madness',     price: 180, fruit: '🥭', tint: 'from-yellow-300 to-orange-500',  desc: 'Alphonso pulp, ice, lime, hint of cardamom.',           prompt: 'tall crystal glass of fresh alphonso mango juice topped with mango chunks and mint leaves, ice cubes, dripping condensation, golden hour sunlight, rustic wooden table, lush mango fruits in background' },
  { id: 'j2',  name: 'Watermelon Cooler', price: 150, fruit: '🍉', tint: 'from-pink-300 to-rose-500',      desc: 'Chilled watermelon, mint, rock salt, sparkling.',        prompt: 'elegant tall glass of vibrant pink watermelon juice with watermelon slice on rim, mint leaves, ice, sparkling water bubbles, beach picnic background blurred bokeh, summer sun' },
  { id: 'j3',  name: 'Pineapple Punch',   price: 170, fruit: '🍍', tint: 'from-yellow-200 to-amber-400',   desc: 'Golden pineapple, ginger zing, basil seeds.',            prompt: 'mason jar of golden pineapple juice with pineapple wedge garnish, basil seeds, fresh ginger, ice cubes, tropical hawaiian background, palm leaves blurred' },
  { id: 'j4',  name: 'Strawberry Bliss',  price: 200, fruit: '🍓', tint: 'from-rose-200 to-red-500',       desc: 'Hand-pressed strawberries, honey, oat milk.',            prompt: 'creamy strawberry milkshake in vintage tall glass with whole fresh strawberries on top, whipped cream, strawberry drizzle, dreamy pink bokeh background' },
  { id: 'j5',  name: 'Lychee Sparkle',    price: 220, fruit: '🥂', tint: 'from-rose-100 to-pink-300',      desc: 'Lychee, rose, soda — like summer in a glass.',           prompt: 'elegant champagne flute of clear pink lychee rose soda with floating rose petals, fresh lychee fruits, fizzy bubbles, romantic candlelit fine dining backdrop' },
  { id: 'j6',  name: 'Orange Sunrise',    price: 140, fruit: '🍊', tint: 'from-orange-200 to-orange-500',  desc: 'Fresh-squeezed Nagpur oranges, no sugar.',               prompt: 'tall glass of freshly squeezed orange juice with orange slices and ice, morning sunlight streaming through window, breakfast table with toast and fresh oranges' },
  { id: 'j7',  name: 'Coconut Water',     price: 120, fruit: '🥥', tint: 'from-stone-100 to-amber-200',    desc: 'Tender coconut, scooped malai, lime.',                   prompt: 'fresh young green coconut cracked open with bamboo straw, creamy white malai pieces inside, tropical beach sand background, palm leaves, golden afternoon light' },
  { id: 'j8',  name: 'Pomegranate Power', price: 190, fruit: '🍷', tint: 'from-red-300 to-red-700',        desc: 'Anaar arils crushed slow, beet boost.',                  prompt: 'elegant crystal glass of deep ruby red pomegranate juice with scattered pomegranate seeds, dark moody dramatic lighting, luxurious marble surface' },
  { id: 'j9',  name: 'Kiwi Crush',        price: 180, fruit: '🥝', tint: 'from-lime-200 to-green-500',     desc: 'Two kiwis, ginger, apple, spinach.',                     prompt: 'mason jar of vibrant green kiwi smoothie with kiwi slices on rim and chia seeds, healthy lifestyle aesthetic, bright fresh herbs and apple slices around, instagram-worthy flat lay' },
  { id: 'j10', name: 'Guava Glow',        price: 130, fruit: '🍐', tint: 'from-lime-100 to-emerald-300',   desc: 'Pink guava, chaat masala, rock salt.',                   prompt: 'pink guava juice in traditional indian clay cup with chaat masala rim, sliced pink guava on side, vibrant pink color, candid indian street food photography' },
  { id: 'j11', name: 'Mixed Berry Boost', price: 230, fruit: '🫐', tint: 'from-fuchsia-300 to-purple-600', desc: 'Blueberry, blackberry, raspberry, banana.',              prompt: 'deep purple acai berry smoothie bowl topped with blueberries raspberries blackberries banana slices and granola, top-down overhead shot, healthy breakfast styling' },
  { id: 'j12', name: 'Sugarcane Splash',  price: 100, fruit: '🌾', tint: 'from-green-200 to-emerald-500',  desc: 'Pressed-to-order, ginger and lime.',                     prompt: 'tall steel tumbler of fresh green sugarcane juice with crushed ice and lime wedge, indian street vendor sugarcane press blurred in background, condensation droplets, candid documentary' },
];

const ICECREAMS = [
  { id: 'i1', name: 'Mango Sorbet',     price: 150, fruit: '🍨', tint: 'from-yellow-200 to-orange-400',   desc: 'Dairy-free Alphonso sorbet, real fruit chunks.',  prompt: 'two perfect scoops of vibrant orange mango sorbet in elegant crystal coupe with fresh mango chunks and mint leaf garnish, dripping condensation, summer dessert styling' },
  { id: 'i2', name: 'Strawberry Scoop', price: 140, fruit: '🍓', tint: 'from-rose-200 to-pink-500',       desc: 'Slow-churned, with whole berries.',               prompt: 'double scoop of pink strawberry ice cream in vintage waffle cone bowl with fresh whole strawberries scattered, dreamy soft pink dessert backdrop' },
  { id: 'i3', name: 'Vanilla Bean',     price: 130, fruit: '🍦', tint: 'from-amber-100 to-amber-300',     desc: 'Madagascar vanilla, double cream.',               prompt: 'classic creamy vanilla bean ice cream scoop with visible vanilla bean specks, vanilla pod garnish, elegant porcelain bowl, minimalist soft natural lighting' },
  { id: 'i4', name: 'Coconut Cream',    price: 150, fruit: '🥥', tint: 'from-stone-100 to-stone-300',     desc: 'Coconut milk, toasted flakes on top.',            prompt: 'creamy coconut ice cream scoop served in real coconut shell with toasted coconut flakes on top, tropical beach aesthetic, palm leaf shadows' },
  { id: 'i5', name: 'Pistachio Kulfi',  price: 160, fruit: '🥜', tint: 'from-lime-100 to-emerald-300',    desc: 'Slow-cooked milk, pistachio shavings.',           prompt: 'traditional indian pistachio kulfi on wooden stick coated with crushed pistachios, pale green color, rustic terracotta plate, warm golden lighting' },
  { id: 'i6', name: 'Chocolate Fudge',  price: 160, fruit: '🍫', tint: 'from-amber-700 to-amber-900',     desc: 'Dark chocolate, fudge ribbon, sea salt.',         prompt: 'rich dark chocolate fudge ice cream scoop with hot chocolate sauce dripping down, chocolate shavings, sea salt flakes, decadent dessert dramatic moody lighting' },
];

const ALL_ITEMS = [...JUICES, ...ICECREAMS];

const ADMIN_PASSWORD = 'admin123';

// ── Tiny localStorage hook ────────────────────────────────────────────────
const useLS = (key, initial) => {
  const [val, setVal] = useState(() => {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; }
    catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
};

// ── Reusable: AI-rendered visual with emoji fallback ──────────────────────
const ItemVisual = ({ item, large = false }) => (
  <>
    <div
      className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
      style={{ fontSize: large ? '170px' : '100px', filter: 'drop-shadow(0 18px 32px rgba(0,0,0,0.25))' }}
      aria-hidden
    >
      {item.fruit}
    </div>
    <img
      src={aiImg(item.prompt + ', no text, no watermark', parseInt(item.id.replace(/\D/g, ''), 10) || 1, 700, 700)}
      alt={item.name}
      loading="lazy"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
      className="absolute inset-0 w-full h-full object-cover sun-img-in transition-transform duration-700 group-hover:scale-105"
    />
  </>
);

// ── Floating background fruits ─────────────────────────────────────────────
const FloatingFruits = () => {
  const fruits = ['🍓','🍊','🥭','🍉','🍍','🥝','🍋','🍒','🥥','🫐','🍇','🍑'];
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {fruits.map((f, i) => {
        const left = (i * 8.3) % 100;
        const delay = (i * 0.8) % 7;
        const size = 24 + (i % 4) * 10;
        const dur = 7 + (i % 5);
        return (
          <span
            key={i}
            className="absolute opacity-70"
            style={{
              left: `${left}%`,
              bottom: '-60px',
              fontSize: `${size}px`,
              animation: `sun-bubble ${dur}s linear ${delay}s infinite`,
            }}
          >{f}</span>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────
export default function Sunsip() {
  // Pages: home, login, adminLogin, menu, admin
  const [page, setPage] = useState('home');
  const [pageKey, setPageKey] = useState(0);
  useEffect(() => { setPageKey(k => k + 1); window.scrollTo(0, 0); }, [page]);

  // ── Persistent state ──
  const [customers, setCustomers] = useLS('sunsip_customers', []);
  const [orders, setOrders]       = useLS('sunsip_orders', []);
  const [cart, setCart]           = useLS('sunsip_cart', []);
  const [session, setSession]     = useLS('sunsip_session', null);   // {name,email}
  const [adminAuth, setAdminAuth] = useLS('sunsip_admin', false);

  // ── UI state ──
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');

  // ── Auth state ──
  const [loginForm, setLoginForm] = useState({ name:'', email:'', phone:'', password:'' });
  const [isSignup, setIsSignup] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [authMsg, setAuthMsg] = useState('');

  const [adminPwd, setAdminPwd] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  // ── Checkout form ──
  const [checkout, setCheckout] = useState({ name:'', email:'', phone:'', address:'' });
  const [checkoutDone, setCheckoutDone] = useState(null); // order

  // ── Helpers ──
  const cartItems = useMemo(() => cart.map(c => {
    const item = ALL_ITEMS.find(i => i.id === c.id);
    return item ? { ...item, qty: c.qty } : null;
  }).filter(Boolean), [cart]);
  const cartCount = cartItems.reduce((s,i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s,i) => s + i.price * i.qty, 0);

  const goTo = (p) => setPage(p);

  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(c => c.id === item.id);
      if (ex) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: item.id, qty: 1 }];
    });
    setShowCart(true);
  };
  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
      .filter(c => c.qty > 0));
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  // ── Auth handlers ──
  const handleAuth = () => {
    setAuthMsg('');
    if (isSignup) {
      const { name, email, phone, password } = loginForm;
      if (!name || !email || !phone || !password) { setAuthMsg('Fill all fields to sign up.'); return; }
      if (customers.some(c => c.email.toLowerCase() === email.toLowerCase())) {
        setAuthMsg('That email is already registered. Try signing in.'); return;
      }
      const customer = { name, email, phone, password, ts: new Date().toISOString() };
      setCustomers(prev => [customer, ...prev]);
      setSession({ name, email });
      setLoginForm({ name:'', email:'', phone:'', password:'' });
      goTo('menu');
    } else {
      const { email, password } = loginForm;
      const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
      if (!found) { setAuthMsg('Email or password not matching. New here? Create an account.'); return; }
      setSession({ name: found.name, email: found.email });
      setLoginForm({ name:'', email:'', phone:'', password:'' });
      goTo('menu');
    }
  };

  const handleAdminLogin = () => {
    setAdminMsg('');
    if (adminPwd === ADMIN_PASSWORD) {
      setAdminAuth(true); setAdminPwd(''); goTo('admin');
    } else {
      setAdminMsg('Wrong password. Hint for the demo: admin123');
    }
  };

  // ── Checkout ──
  const placeOrder = () => {
    const { name, email, phone, address } = checkout;
    if (!name || !email || !phone || !address || cartItems.length === 0) return;
    const order = {
      id: 'O' + Date.now(),
      ts: new Date().toISOString(),
      customer: { name, email, phone, address },
      items: cartItems.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      total: cartTotal,
    };
    setOrders(prev => [order, ...prev]);
    setCart([]);
    setCheckoutDone(order);
    setShowCart(false);
  };

  // ─────────────────────── Shared shell ───────────────────────
  const Nav = () => (
    <nav className="sticky top-0 z-40 bg-orange-50/90 backdrop-blur border-b border-orange-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => goTo('home')} className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition">
            <Sun size={20}/>
          </div>
          <div className="leading-tight">
            <div className="font-serif text-xl text-orange-700 tracking-tight">Sunsip</div>
            <div className="uppercase tracking-widest text-orange-400" style={{fontSize:'9px'}}>fresh squeezed sunshine</div>
          </div>
        </button>
        <div className="hidden md:flex items-center gap-7 text-sm">
          {[
            { id:'home', label:'Home' },
            { id:'menu', label:'Menu' },
          ].map(p => (
            <button key={p.id} onClick={()=>goTo(p.id)}
              className={`uppercase tracking-widest text-xs font-semibold transition ${page===p.id ? 'text-orange-600' : 'text-stone-700 hover:text-orange-500'}`}>
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center">
                {session.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-stone-700 font-medium">Hi, {session.name}</span>
              <button onClick={()=>{ setSession(null); goTo('home'); }} className="text-stone-500 hover:text-orange-600 ml-1" title="Sign out">
                <LogOut size={14}/>
              </button>
            </div>
          ) : (
            <button onClick={()=>goTo('login')} className="hidden sm:flex items-center gap-2 text-sm text-stone-700 hover:text-orange-600">
              <LogIn size={16}/> Sign in
            </button>
          )}
          <button onClick={()=>setShowCart(true)} className="relative p-2 hover:bg-orange-100 rounded-full transition">
            <ShoppingCart size={20} className="text-orange-700"/>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-600 text-white font-bold w-5 h-5 rounded-full flex items-center justify-center sun-zoom" style={{fontSize:'10px'}}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );

  const Marquee = () => {
    const text = '☀️ Summer special · Buy 2 juices get 1 ice-cream · Free delivery over ₹500 · Fresh from this morning · Cold-pressed daily · ';
    return (
      <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-amber-500 text-white py-2 overflow-hidden">
        <div className="flex sun-marquee whitespace-nowrap font-medium text-sm">
          <div className="px-4">{text.repeat(3)}</div>
          <div className="px-4">{text.repeat(3)}</div>
        </div>
      </div>
    );
  };

  const Footer = () => (
    <footer className="bg-orange-950 text-orange-50 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="font-serif text-2xl mb-2">Sunsip</div>
          <p className="text-sm text-orange-200 leading-relaxed">Fresh squeezed sunshine, served chilled. Real fruits, no concentrate, no shortcuts.</p>
          <div className="flex gap-3 mt-4">
            <Instagram size={18} className="hover:text-amber-300 cursor-pointer"/>
            <Facebook size={18} className="hover:text-amber-300 cursor-pointer"/>
            <Twitter size={18} className="hover:text-amber-300 cursor-pointer"/>
          </div>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-amber-300 mb-3">Visit</h4>
          <ul className="space-y-1.5 text-sm text-orange-200">
            <li className="flex items-center gap-2"><MapPin size={14}/> 12, Lavelle Road, Bengaluru</li>
            <li className="flex items-center gap-2"><Phone size={14}/> +91 80 1234 5678</li>
            <li className="flex items-center gap-2"><Mail size={14}/> hello@sunsip.in</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-amber-300 mb-3">Hours</h4>
          <ul className="space-y-1.5 text-sm text-orange-200">
            <li>Mon – Sat · 8 am – 10 pm</li>
            <li>Sunday · 9 am – 9 pm</li>
            <li>Summer hours · open later</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs uppercase tracking-widest text-amber-300 mb-3">Studio</h4>
          <ul className="space-y-1.5 text-sm text-orange-200">
            <li><button onClick={()=>goTo('adminLogin')} className="hover:text-amber-300 inline-flex items-center gap-1"><Lock size={12}/> Admin login</button></li>
            <li>Built with React + AI imagery</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-orange-900 py-3 text-center text-xs text-orange-300">
        © {new Date().getFullYear()} Sunsip · Squeezed with care.
      </div>
    </footer>
  );

  // ─────────────────────── Cart drawer ───────────────────────
  const CartDrawer = () => (
    <>
      {showCart && <div className="fixed inset-0 bg-black/40 z-50 sun-zoom" onClick={()=>setShowCart(false)}/>}
      <aside className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl transition-transform duration-500 ${showCart ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        <div className="flex items-center justify-between p-5 border-b border-orange-100">
          <h3 className="font-serif text-xl text-orange-700 flex items-center gap-2"><ShoppingCart size={18}/> Your basket</h3>
          <button onClick={()=>setShowCart(false)} className="p-1 hover:bg-orange-50 rounded-full"><X size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 text-stone-500">
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-30"/>
              <p className="text-sm">Your basket is empty.</p>
              <button onClick={()=>{setShowCart(false); goTo('menu');}} className="mt-3 text-orange-600 text-sm underline">Browse the menu</button>
            </div>
          ) : cartItems.map(item => (
            <div key={item.id} className="flex gap-3 bg-orange-50 p-3 rounded-xl">
              <div className={`relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br ${item.tint} flex items-center justify-center text-3xl`}>
                {item.fruit}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-stone-800 truncate">{item.name}</div>
                <div className="text-xs text-stone-500">{inr(item.price)} each</div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center bg-white border border-orange-200 rounded-full">
                    <button onClick={()=>updateQty(item.id, -1)} className="px-2 py-0.5 hover:bg-orange-100 rounded-l-full"><Minus size={12}/></button>
                    <span className="px-2 text-xs font-bold">{item.qty}</span>
                    <button onClick={()=>updateQty(item.id, +1)} className="px-2 py-0.5 hover:bg-orange-100 rounded-r-full"><Plus size={12}/></button>
                  </div>
                  <button onClick={()=>removeFromCart(item.id)} className="text-stone-400 hover:text-red-500"><Trash2 size={14}/></button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-orange-700">{inr(item.price * item.qty)}</div>
              </div>
            </div>
          ))}
        </div>
        {cartItems.length > 0 && (
          <div className="border-t border-orange-100 p-5 bg-orange-50">
            <div className="flex justify-between mb-1 text-sm"><span className="text-stone-600">Subtotal</span><span className="font-semibold">{inr(cartTotal)}</span></div>
            <div className="flex justify-between mb-3 text-xs text-stone-500"><span>Free delivery over ₹500</span><span>{cartTotal >= 500 ? '✓ Eligible' : `₹${500 - cartTotal} to go`}</span></div>
            <button
              onClick={()=>{ setShowCart(false); setShowCheckout(true); setCheckout(c => ({ ...c, name: session?.name || c.name, email: session?.email || c.email })); }}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-full font-semibold tracking-wide hover:opacity-90 transition flex items-center justify-center gap-2 sun-pulse">
              Checkout · {inr(cartTotal)} <ArrowRight size={16}/>
            </button>
          </div>
        )}
      </aside>
    </>
  );

  // ─────────────────────── Checkout modal ───────────────────────
  const CheckoutModal = () => {
    if (!showCheckout && !checkoutDone) return null;
    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 sun-zoom">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
          {checkoutDone ? (
            <div className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center sun-pulse">
                <CheckCircle2 size={48} className="text-emerald-600"/>
              </div>
              <h2 className="font-serif text-3xl text-orange-700 mb-2">Order placed!</h2>
              <p className="text-stone-600 mb-1">Order <span className="font-mono text-stone-800">{checkoutDone.id}</span></p>
              <p className="text-stone-600 mb-4">A receipt has been saved for <span className="text-orange-700 font-medium">{checkoutDone.customer.email}</span> · we'll call <span className="text-orange-700 font-medium">{checkoutDone.customer.phone}</span> for delivery.</p>
              <div className="bg-orange-50 rounded-xl p-3 text-left text-sm mb-4">
                {checkoutDone.items.map(i => (
                  <div key={i.id} className="flex justify-between">
                    <span>{i.qty} × {i.name}</span><span>{inr(i.price * i.qty)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-orange-200 mt-2 pt-2 font-bold text-orange-700">
                  <span>Total</span><span>{inr(checkoutDone.total)}</span>
                </div>
              </div>
              <button onClick={()=>{ setCheckoutDone(null); setShowCheckout(false); setCheckout({ name:'', email:'', phone:'', address:'' }); }}
                className="bg-orange-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-700 transition">
                Done
              </button>
            </div>
          ) : (
            <div className="p-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-2xl text-orange-700">Almost there</h2>
                <button onClick={()=>setShowCheckout(false)} className="p-1 hover:bg-orange-50 rounded-full"><X size={18}/></button>
              </div>
              <p className="text-sm text-stone-500 mb-4">We need a few details to deliver your sunshine. Saved securely on this device.</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Full name</label>
                  <input value={checkout.name} onChange={e=>setCheckout({...checkout, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="Joy Kumar"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Email</label>
                  <input type="email" value={checkout.email} onChange={e=>setCheckout({...checkout, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="you@email.com"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Contact number</label>
                  <input type="tel" value={checkout.phone} onChange={e=>setCheckout({...checkout, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="+91 98765 43210"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Delivery address</label>
                  <textarea value={checkout.address} onChange={e=>setCheckout({...checkout, address: e.target.value})}
                    rows={2} className="w-full px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500 resize-none" placeholder="Flat / street / area / city"/>
                </div>
                <button onClick={placeOrder}
                  disabled={!(checkout.name && checkout.email && checkout.phone && checkout.address)}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition flex items-center justify-center gap-2">
                  Place order · {inr(cartTotal)} <ArrowRight size={16}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─────────────────────── PAGE 1 · Home ───────────────────────
  const Home = () => (
    <div key={pageKey} className="min-h-screen bg-orange-50 relative overflow-hidden">
      <Nav/>
      <Marquee/>

      {/* Hero */}
      <section className="relative pt-10 pb-20">
        {/* Decorative blobs */}
        <div className="absolute -top-10 -left-20 w-96 h-96 bg-orange-300/40 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute top-40 -right-20 w-[500px] h-[500px] bg-pink-300/30 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-1/2 w-[600px] h-64 bg-amber-300/40 rounded-full blur-3xl pointer-events-none"/>
        <FloatingFruits/>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left copy */}
          <div className="lg:col-span-6 sun-in">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-orange-200 rounded-full px-4 py-1.5 mb-6 shadow-sm">
              <Sparkles size={12} className="text-orange-600"/>
              <span className="text-xs uppercase tracking-widest text-stone-700">Summer Menu · 2026</span>
            </div>
            <h1 className="font-serif text-6xl md:text-8xl text-orange-700 leading-[0.95] mb-5">
              Sip the <span className="italic text-pink-600">sun.</span><br/>
              <span className="text-amber-500">Cold-pressed daily.</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-700 max-w-md mb-8">
              Fresh fruit juices, smoothies, and slow-churned ice creams — squeezed and scooped to order, delivered cold to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={()=>goTo('menu')} className="group bg-gradient-to-r from-orange-500 to-pink-500 text-white px-7 py-3.5 rounded-full font-semibold tracking-wide flex items-center gap-2 hover:opacity-90 transition shadow-lg sun-pulse">
                See the menu <ArrowRight size={18} className="transition-transform group-hover:translate-x-1"/>
              </button>
              <button onClick={()=>goTo(session ? 'menu' : 'login')} className="bg-white border border-orange-200 text-orange-700 px-7 py-3.5 rounded-full font-semibold hover:bg-orange-100 transition">
                {session ? `Hi ${session.name}` : 'Sign in'}
              </button>
            </div>
            <div className="mt-10 flex gap-8">
              <div><div className="font-serif text-3xl text-orange-700">12</div><div className="text-xs uppercase tracking-wider text-stone-500">Summer juices</div></div>
              <div><div className="font-serif text-3xl text-orange-700">6</div><div className="text-xs uppercase tracking-wider text-stone-500">Ice creams</div></div>
              <div><div className="font-serif text-3xl text-orange-700">100%</div><div className="text-xs uppercase tracking-wider text-stone-500">Real fruit</div></div>
            </div>
          </div>

          {/* Right collage — AI visuals */}
          <div className="lg:col-span-6 relative" style={{height:'520px'}}>
            <div className="absolute top-0 right-6 w-56 h-72 rounded-3xl shadow-2xl overflow-hidden bg-orange-200 sun-float-slow" style={{'--r':'4deg', transform:'rotate(4deg)'}}>
              <img src={aiImg('a tall elegant glass of vibrant golden mango juice topped with alphonso mango chunks and mint leaves, dripping condensation, ice cubes, fresh mango slices on side, golden hour sunlight, lush tropical setting, summer cold drink', 11, 768, 1024)} alt="Mango"
                className="w-full h-full object-cover sun-img-in" loading="lazy" onError={e=>e.currentTarget.style.display='none'}/>
              <div className="absolute bottom-2 left-2 bg-white/90 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1"><Sparkles size={9}/> AI</div>
            </div>
            <div className="absolute top-12 left-0 w-52 h-64 rounded-3xl shadow-2xl overflow-hidden bg-pink-200 sun-float" style={{'--r':'-7deg', transform:'rotate(-7deg)'}}>
              <img src={aiImg('elegant tall glass of vibrant pink strawberry watermelon smoothie with whole strawberries and watermelon wedge garnish, whipped cream peak, mint leaves, dreamy pink bokeh background, summer aesthetic', 22, 768, 1024)} alt="Berry"
                className="w-full h-full object-cover sun-img-in" loading="lazy" onError={e=>e.currentTarget.style.display='none'}/>
              <div className="absolute bottom-2 left-2 bg-white/90 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1"><Sparkles size={9}/> AI</div>
            </div>
            <div className="absolute bottom-8 right-24 w-60 h-60 rounded-3xl shadow-2xl overflow-hidden bg-amber-200 sun-float-fast" style={{'--r':'8deg', transform:'rotate(8deg)'}}>
              <img src={aiImg('two perfect scoops of vibrant orange mango sorbet ice cream in elegant crystal coupe glass, fresh mango chunks on top, mint leaf garnish, dripping condensation, dreamy summer dessert backdrop, golden warm lighting', 33, 768, 768)} alt="Ice"
                className="w-full h-full object-cover sun-img-in" loading="lazy" onError={e=>e.currentTarget.style.display='none'}/>
              <div className="absolute bottom-2 left-2 bg-white/90 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1"><Sparkles size={9}/> AI</div>
            </div>
            <div className="absolute bottom-0 left-12 w-48 h-48 rounded-3xl shadow-2xl overflow-hidden bg-lime-200 sun-float" style={{'--r':'14deg', transform:'rotate(14deg)'}}>
              <img src={aiImg('vibrant green kiwi smoothie in mason jar with kiwi slices on rim and chia seeds, fresh herbs, healthy lifestyle aesthetic, bright airy kitchen background, instagram worthy', 44, 768, 768)} alt="Kiwi"
                className="w-full h-full object-cover sun-img-in" loading="lazy" onError={e=>e.currentTarget.style.display='none'}/>
              <div className="absolute bottom-2 left-2 bg-white/90 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1"><Sparkles size={9}/> AI</div>
            </div>
            {/* Spinning sun ray */}
            <div className="absolute top-44 left-44 w-28 h-28 rounded-full sun-spin-slow pointer-events-none"
              style={{ background: 'conic-gradient(from 0deg, rgba(251,191,36,0.6), transparent 30%, rgba(251,146,60,0.5) 60%, transparent 90%)', filter:'blur(2px)'}}/>
            <div className="absolute top-52 left-52 bg-white/90 backdrop-blur px-3 py-2 rounded-2xl shadow-lg flex items-center gap-2 sun-pulse z-10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"/>
              <div className="text-xs">
                <div className="font-bold text-orange-700">142 sipping</div>
                <div className="text-stone-500">right now</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Sunsip */}
      <section className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-5">
          {[
            { icon:<Droplet size={18}/>, t:'Cold-pressed', d:'Slow press preserves nutrients.' },
            { icon:<Sun size={18}/>,     t:'Real fruit',   d:'No concentrate. No syrup.' },
            { icon:<Snowflake size={18}/>, t:'Always cold', d:'Insulated bottles, fast delivery.' },
            { icon:<Heart size={18}/>,   t:'Made with love', d:'Small batches, every day.' },
          ].map((f,i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-orange-100 sun-card-hover sun-in" style={{animationDelay:`${i*80}ms`}}>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 text-white rounded-full flex items-center justify-center mb-3">{f.icon}</div>
              <div className="font-serif text-lg text-orange-700 mb-1">{f.t}</div>
              <div className="text-sm text-stone-600">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured items preview */}
      <section className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-orange-600 mb-1">Today's pick</div>
            <h2 className="font-serif text-4xl text-orange-700">Squeezed this morning.</h2>
          </div>
          <button onClick={()=>goTo('menu')} className="text-orange-600 font-semibold hover:underline flex items-center gap-1">
            See full menu <ArrowRight size={16}/>
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {JUICES.slice(0, 4).map((p, i) => (
            <ItemCard key={p.id} item={p} delay={i*70}/>
          ))}
        </div>
      </section>

      <Footer/>
    </div>
  );

  // ─────────────────────── ItemCard ───────────────────────
  const ItemCard = ({ item, delay = 0, kind }) => (
    <div className="group bg-white rounded-2xl overflow-hidden border border-orange-100 sun-card-hover sun-in" style={{ animationDelay: `${delay}ms` }}>
      <div className={`relative aspect-square overflow-hidden bg-gradient-to-br ${item.tint}`}>
        <ItemVisual item={item}/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"/>
        <div className="absolute top-3 left-3 z-10 bg-white/90 text-orange-700 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full flex items-center gap-1">
          <Sparkles size={9}/> AI
        </div>
        {kind && (
          <div className={`absolute top-3 right-3 z-10 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${kind === 'ice' ? 'bg-sky-100 text-sky-700' : 'bg-rose-100 text-rose-700'}`}>
            {kind === 'ice' ? <span className="flex items-center gap-1"><Snowflake size={9}/> Ice cream</span> : <span className="flex items-center gap-1"><Flame size={9}/> Juice</span>}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-orange-700 truncate">{item.name}</h3>
        <p className="text-xs text-stone-500 line-clamp-2 h-8 mt-0.5">{item.desc}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="font-serif text-xl text-stone-800 font-bold">{inr(item.price)}</div>
          <button onClick={() => addToCart(item)}
            className="group/btn bg-orange-600 text-white px-3 py-2 rounded-full text-xs font-bold tracking-wide hover:bg-orange-700 transition flex items-center gap-1.5">
            <Plus size={12}/> Add
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────── PAGE 2 · Menu ───────────────────────
  const MenuPage = () => {
    const list = useMemo(() => {
      const base = tab === 'juice' ? JUICES : tab === 'ice' ? ICECREAMS : ALL_ITEMS;
      const q = search.trim().toLowerCase();
      return q ? base.filter(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) : base;
    }, [tab, search]);

    return (
      <div key={pageKey} className="min-h-screen bg-orange-50">
        <Nav/>
        <Marquee/>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-10 sun-in">
            <div className="text-xs uppercase tracking-widest text-orange-600 mb-2">Menu</div>
            <h1 className="font-serif text-5xl md:text-6xl text-orange-700">Pick your <em className="text-pink-600">happy</em>.</h1>
            <p className="text-stone-600 mt-3 max-w-xl mx-auto">Twelve summer juices and six slow-churned ice creams. Real fruit, real chill.</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 sun-in">
            {[
              { id:'all',   label:'Everything' },
              { id:'juice', label:'Juices', icon:<Flame size={12}/> },
              { id:'ice',   label:'Ice cream', icon:<Snowflake size={12}/> },
            ].map(t => (
              <button key={t.id} onClick={()=>setTab(t.id)}
                className={`px-5 py-2 text-xs uppercase tracking-widest rounded-full border-2 font-semibold transition flex items-center gap-1.5 ${tab===t.id ? 'bg-orange-600 text-white border-orange-600 shadow-md' : 'bg-white text-stone-700 border-orange-200 hover:border-orange-500'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-10 relative sun-in">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search mango, kiwi, kulfi..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-orange-200 rounded-full focus:outline-none focus:border-orange-500"/>
          </div>

          {list.length === 0 ? (
            <div className="text-center text-stone-500 py-16">No matches for "{search}". Try a different fruit.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {list.map((p, i) => (
                <ItemCard key={p.id} item={p} delay={i*40} kind={ICECREAMS.includes(p) ? 'ice' : 'juice'}/>
              ))}
            </div>
          )}
        </div>
        <Footer/>
      </div>
    );
  };

  // ─────────────────────── PAGE 3 · Customer Login ───────────────────────
  const Login = () => (
    <div key={pageKey} className="min-h-screen grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="hidden lg:flex relative sun-grad-bg p-12 flex-col justify-between overflow-hidden text-white">
        <FloatingFruits/>
        <button onClick={()=>goTo('home')} className="relative z-10 self-start text-sm hover:underline flex items-center gap-1">← Back home</button>
        <div className="relative z-10">
          <h2 className="font-serif text-6xl leading-[1] mb-4">Sip the<br/><em>sunshine.</em></h2>
          <p className="text-white/90 max-w-sm">Sign in or join Sunsip — we'll keep your favourites and deliver them cold.</p>
        </div>
        <div className="relative z-10 flex gap-3">
          {['🥭','🍓','🍉','🥥','🍍'].map((e,i) => (
            <div key={i} className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-2xl sun-float" style={{ animationDelay: `${i*0.3}s` }}>{e}</div>
          ))}
        </div>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md sun-in">
          <button onClick={()=>goTo('home')} className="text-sm text-stone-500 hover:text-orange-600 mb-6 flex items-center gap-1">← Back</button>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white"><Sun size={18}/></div>
            <span className="font-serif text-2xl text-orange-700">Sunsip</span>
          </div>
          <h1 className="font-serif text-4xl text-orange-700 mb-2">{isSignup ? 'Join the bar' : 'Welcome back'}</h1>
          <p className="text-stone-500 mb-7">{isSignup ? 'Two minutes. Then juices.' : 'Sign in to order and track favourites.'}</p>

          <div className="space-y-3.5">
            {isSignup && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Full name</label>
                  <input value={loginForm.name} onChange={e=>setLoginForm({...loginForm, name:e.target.value})}
                    className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="Joy Kumar"/>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Contact number</label>
                  <input type="tel" value={loginForm.phone} onChange={e=>setLoginForm({...loginForm, phone:e.target.value})}
                    className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="+91 98765 43210"/>
                </div>
              </>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Email</label>
              <input type="email" value={loginForm.email} onChange={e=>setLoginForm({...loginForm, email:e.target.value})}
                className="w-full px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="you@email.com"/>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={loginForm.password} onChange={e=>setLoginForm({...loginForm, password:e.target.value})}
                  className="w-full px-4 py-3 pr-12 bg-orange-50 border border-orange-200 rounded-xl focus:outline-none focus:border-orange-500" placeholder="••••••••"/>
                <button onClick={()=>setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {authMsg && <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{authMsg}</div>}

            <button onClick={handleAuth}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
              {isSignup ? 'Create account' : 'Sign in'} <ArrowRight size={16}/>
            </button>

            <p className="text-center text-sm text-stone-500 pt-2">
              {isSignup ? 'Already have an account? ' : 'New to Sunsip? '}
              <button onClick={()=>{ setIsSignup(!isSignup); setAuthMsg(''); }} className="text-orange-600 font-semibold hover:underline">
                {isSignup ? 'Sign in' : 'Create one'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // ─────────────────────── PAGE 4 · Admin Login ───────────────────────
  const AdminLogin = () => (
    <div key={pageKey} className="min-h-screen flex items-center justify-center bg-stone-950 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-orange-700/30 rounded-full blur-3xl"/>
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-700/30 rounded-full blur-3xl"/>
      <FloatingFruits/>
      <div className="relative w-full max-w-md mx-6 bg-stone-900/90 backdrop-blur border border-stone-800 rounded-3xl p-8 sun-in">
        <button onClick={()=>goTo('home')} className="text-sm text-stone-500 hover:text-amber-400 mb-6 flex items-center gap-1">← Back home</button>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center"><Lock size={18}/></div>
          <span className="font-serif text-2xl text-amber-400">Studio</span>
        </div>
        <h1 className="font-serif text-3xl text-amber-400 mb-1">Admin sign in</h1>
        <p className="text-stone-400 mb-6 text-sm">Restricted to staff. Demo password: <code className="text-amber-300">admin123</code></p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-1">Password</label>
            <input type="password" value={adminPwd} onChange={e=>setAdminPwd(e.target.value)}
              onKeyDown={e=>e.key==='Enter' && handleAdminLogin()}
              className="w-full px-4 py-3 bg-stone-950 border border-stone-700 rounded-xl text-amber-100 focus:outline-none focus:border-amber-400" placeholder="••••••••"/>
          </div>
          {adminMsg && <div className="text-sm text-red-400 bg-red-950/50 border border-red-900 rounded-xl px-3 py-2">{adminMsg}</div>}
          <button onClick={handleAdminLogin}
            className="w-full bg-amber-400 text-stone-950 py-3 rounded-xl font-bold hover:bg-amber-300 transition flex items-center justify-center gap-2">
            Enter studio <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );

  // ─────────────────────── PAGE 5 · Admin Dashboard ───────────────────────
  const Admin = () => {
    if (!adminAuth) {
      return (
        <div key={pageKey} className="min-h-screen flex items-center justify-center text-center bg-stone-950 text-stone-300 p-6">
          <div>
            <Lock size={40} className="mx-auto mb-3 text-stone-500"/>
            <p>You need to sign in as admin first.</p>
            <button onClick={()=>goTo('adminLogin')} className="mt-4 bg-amber-400 text-stone-950 px-5 py-2 rounded-full font-bold">Admin login</button>
          </div>
        </div>
      );
    }

    const exportJSON = (data, name) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `sunsip-${name}-${new Date().toISOString().slice(0,10)}.json`;
      a.click(); URL.revokeObjectURL(url);
    };

    const totalRevenue = orders.reduce((s,o) => s + o.total, 0);

    return (
      <div key={pageKey} className="min-h-screen bg-stone-950 text-stone-200">
        <header className="sticky top-0 z-30 bg-stone-950/95 backdrop-blur border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center"><Lock size={16}/></div>
              <div>
                <div className="font-serif text-xl text-amber-400">Sunsip · Studio</div>
                <div className="uppercase tracking-widest text-stone-500" style={{fontSize:'10px'}}>internal dashboard</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={()=>goTo('home')} className="text-sm text-stone-300 hover:text-amber-400">View site →</button>
              <button onClick={()=>{ setAdminAuth(false); goTo('home'); }}
                className="ml-2 bg-stone-900 border border-stone-700 text-stone-300 px-3 py-1.5 rounded-full text-xs hover:border-amber-400 transition flex items-center gap-1">
                <LogOut size={12}/> Sign out
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sun-in">
            {[
              { label:'Customers', value:customers.length, sub:'signed up', icon:<User size={18}/> },
              { label:'Orders', value:orders.length, sub:'placed', icon:<Inbox size={18}/> },
              { label:'Revenue', value:inr(totalRevenue), sub:'all time', icon:<Star size={18}/> },
              { label:'Items', value:ALL_ITEMS.length, sub:'in catalog', icon:<Sparkles size={18}/> },
            ].map((s, i) => (
              <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-2 text-amber-400">{s.icon}<div className="text-xs uppercase tracking-widest">{s.label}</div></div>
                <div className="font-serif text-3xl text-amber-300">{s.value}</div>
                <div className="text-xs text-stone-500 mt-1">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Orders */}
          <section className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sun-in">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-serif text-2xl text-amber-400 flex items-center gap-2"><Inbox size={20}/> Orders</h2>
              <div className="flex gap-2">
                <button onClick={()=>exportJSON(orders, 'orders')} disabled={!orders.length}
                  className="bg-stone-950 border border-stone-700 text-amber-300 px-3 py-1.5 rounded-full text-xs hover:border-amber-400 disabled:opacity-40 flex items-center gap-1">
                  <Download size={12}/> Export
                </button>
                <button onClick={()=>{ if (window.confirm('Clear all orders?')) setOrders([]); }} disabled={!orders.length}
                  className="bg-stone-950 border border-stone-700 text-red-400 px-3 py-1.5 rounded-full text-xs hover:border-red-400 disabled:opacity-40 flex items-center gap-1">
                  <Trash2 size={12}/> Clear
                </button>
              </div>
            </div>
            {orders.length === 0 ? (
              <p className="text-stone-500 text-sm py-6 text-center">No orders yet. Place one through the menu to see it here.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-widest text-stone-500 border-b border-stone-800">
                      <th className="py-3 pr-4">When</th>
                      <th className="py-3 pr-4">Order</th>
                      <th className="py-3 pr-4">Customer</th>
                      <th className="py-3 pr-4">Email · Phone</th>
                      <th className="py-3 pr-4">Items</th>
                      <th className="py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(o => (
                      <tr key={o.id} className="border-b border-stone-800/70 align-top">
                        <td className="py-3 pr-4 text-stone-400 text-xs whitespace-nowrap">{new Date(o.ts).toLocaleString()}</td>
                        <td className="py-3 pr-4 font-mono text-xs text-amber-300">{o.id}</td>
                        <td className="py-3 pr-4">
                          <div className="font-semibold">{o.customer.name}</div>
                          <div className="text-stone-500 text-xs">{o.customer.address}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <a href={`mailto:${o.customer.email}`} className="block text-stone-200 hover:text-amber-400 text-xs">{o.customer.email}</a>
                          <a href={`tel:${o.customer.phone}`} className="block text-stone-400 hover:text-amber-400 text-xs">{o.customer.phone}</a>
                        </td>
                        <td className="py-3 pr-4 text-xs text-stone-300">
                          {o.items.map(i => <div key={i.id}>{i.qty} × {i.name}</div>)}
                        </td>
                        <td className="py-3 text-right font-bold text-amber-300 whitespace-nowrap">{inr(o.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Customers */}
          <section className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sun-in">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="font-serif text-2xl text-amber-400 flex items-center gap-2"><User size={20}/> Customers</h2>
              <div className="flex gap-2">
                <button onClick={()=>exportJSON(customers.map(({password, ...c}) => c), 'customers')} disabled={!customers.length}
                  className="bg-stone-950 border border-stone-700 text-amber-300 px-3 py-1.5 rounded-full text-xs hover:border-amber-400 disabled:opacity-40 flex items-center gap-1">
                  <Download size={12}/> Export
                </button>
                <button onClick={()=>{ if (window.confirm('Delete all customer accounts?')) setCustomers([]); }} disabled={!customers.length}
                  className="bg-stone-950 border border-stone-700 text-red-400 px-3 py-1.5 rounded-full text-xs hover:border-red-400 disabled:opacity-40 flex items-center gap-1">
                  <Trash2 size={12}/> Clear
                </button>
              </div>
            </div>
            {customers.length === 0 ? (
              <p className="text-stone-500 text-sm py-6 text-center">No customers yet. Create an account from the sign-in page.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {customers.map((c, i) => (
                  <div key={i} className="bg-stone-950 border border-stone-800 rounded-2xl p-4 flex items-start gap-3 sun-in" style={{animationDelay:`${i*50}ms`}}>
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-stone-950 font-bold flex items-center justify-center shrink-0">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-lg text-amber-300 leading-tight">{c.name}</div>
                      <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1.5">Joined {new Date(c.ts).toLocaleDateString()}</div>
                      <a href={`mailto:${c.email}`} className="block text-stone-200 hover:text-amber-400 text-xs flex items-center gap-1.5"><Mail size={11}/> {c.email}</a>
                      <a href={`tel:${c.phone}`} className="block text-stone-400 hover:text-amber-400 text-xs flex items-center gap-1.5"><Phone size={11}/> {c.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  };

  // ─────────────────────── Router ───────────────────────
  const view = {
    home: <Home/>,
    menu: <MenuPage/>,
    login: <Login/>,
    adminLogin: <AdminLogin/>,
    admin: <Admin/>,
  }[page];

  return (
    <div className="font-sans text-stone-800">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif { font-family: 'Fraunces', Georgia, serif !important; }
        .font-sans  { font-family: 'Inter', system-ui, sans-serif !important; }
      `}</style>
      {view}
      <CartDrawer/>
      <CheckoutModal/>
    </div>
  );
}
