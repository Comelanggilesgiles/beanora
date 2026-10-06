import { useEffect, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, ArrowUp, ArrowUpRight, Check, Coffee, Heart, Home, Menu, Play, ShoppingBag, UserRound, X } from 'lucide-react';
import { drinks, formatPrice, readSavedCart, type CartItem, type Drink } from './data';
import Modal from './components/Modal';
import { BagDrawer, DrinkModal } from './components/Ordering';
import ReservationForm from './components/ReservationForm';

const filmUrl = 'https://videos.pexels.com/video-files/2849935/2849935-uhd_3840_2160_24fps.mp4';
const filmPoster = 'https://images.pexels.com/photos/9050554/pexels-photo-9050554.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200';

function Brand({ footer = false }: { footer?: boolean }) {
  return <a className={`wordmark ${footer ? 'footer-wordmark' : ''}`} href="#home" aria-label="Beanora home">
    <svg viewBox="0 0 34 38" fill="none" aria-hidden="true">
      <path d="M16 31C6 29 2 20 7 14c5-6 13-4 15 3 2 6-1 11-6 14Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 12c-5 5 4 9-1 18M17 12C16 5 22 2 29 3c0 7-4 12-12 9ZM18 11l8-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
    <span>Beanora<span className="wordmark-dot">.</span></span>
  </a>;
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduced ? 0 : 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function DrinkArtwork({ drink }: { drink: Drink }) {
  return <div className={`drink-artwork tone-${drink.tone}`}>
    <div className="drink-color-shape" />
    <svg className="drink-doodles" viewBox="0 0 300 300" fill="none" aria-hidden="true">
      <ellipse cx="150" cy="150" rx="111" ry="116" transform="rotate(-16 150 150)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="565 140" strokeLinecap="round" />
      <path d="M52 228c-28-33-28-87-5-117M111 42c-18 6-31 14-40 25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M42 157c-11-13-19 0-6 8l8 5 5-10c7-15-5-17-7-3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M253 69c-4-16 1-23 5-20s-1 14-5 20Zm9 8c6-15 14-17 15-12s-9 10-15 12Zm5 12c12-8 20-5 18-1s-12 3-18 1Z" fill="currentColor" />
      <path d="m45 188-7 9m17-5-2 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
    <img className="drink-image" src={drink.image} alt={drink.name} width={300} height={300} loading="lazy" />
  </div>;
}

function PhonePreview() {
  const reduced = useReducedMotion();
  return <div className="phone-composition" aria-hidden="true">
    <svg className="phone-botanical" viewBox="0 0 380 450" fill="none">
      <path d="M83 357C51 285 83 195 143 131M286 353c36-106 11-181-25-224" stroke="#7e6545" strokeWidth="2" />
      <path d="M90 249C29 229 37 184 37 184c53-2 66 33 53 65Z" fill="#526840" />
      <path d="M91 218c-17-46-1-78 17-86 22 30 22 62-17 86Z" fill="#2d492c" />
      <path d="M104 184c11-44 36-57 67-53-3 39-31 51-67 53Z" fill="#6c7a4d" />
      <path d="M80 291c-42-6-66-26-64-51 46-7 67 15 64 51Z" fill="#3e5836" />
      <path d="M286 249c40-35 66-24 79-9-21 31-48 30-79 9Z" fill="#3c5533" />
      <path d="M284 208c-4-48 15-76 38-81 16 33 10 61-38 81Z" fill="#63754b" />
      <path d="M284 170c-35-11-51-35-44-57 38-1 52 22 44 57Z" fill="#304b2e" />
      <path d="m83 249-39-53m48 22 15-73m-3 39 54-44M78 289l-50-38m259-4 65-5m-68-34 35-69m-34 31-39-47" stroke="#a9af78" strokeWidth="1" opacity=".65" />
      <ellipse cx="65" cy="328" rx="12" ry="8" transform="rotate(-37 65 328)" fill="#785035" /><path d="m58 333 14-11" stroke="#3c271c" strokeWidth="2" />
      <ellipse cx="302" cy="318" rx="12" ry="8" transform="rotate(27 302 318)" fill="#825436" /><path d="m292 314 21 8" stroke="#3c271c" strokeWidth="2" />
      <ellipse cx="297" cy="383" rx="11" ry="8" transform="rotate(-32 297 383)" fill="#69452f" /><path d="m289 388 15-10" stroke="#35251b" strokeWidth="2" />
    </svg>
    <motion.div className="phone-float" animate={reduced ? {} : { y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
      <div className="phone">
        <div className="phone-status"><span>9:41</span><span className="phone-signal">||| <span /></span></div>
        <div className="phone-island" />
        <div className="phone-brand">Beanora<span>.</span></div>
        <div className="phone-hero">
          <span className="phone-eyebrow">A LITTLE MOMENT</span>
          <div>Good Coffee.<br /><em>Better Days.</em></div>
          <span className="phone-mini-button">Find your favorite <ArrowRight size={8} /></span>
        </div>
        <div className="phone-menu"><h4>Made for you.</h4><div className="phone-drinks">{drinks.slice(0, 2).map((drink) => <div key={drink.id}><img src={drink.image} alt="" width={72} height={70} /><strong>{drink.name}</strong><span>{formatPrice(drink.price)}</span></div>)}</div></div>
        <div className="phone-nav"><span><Home size={13} />Home</span><span><Coffee size={13} />Menu</span><span><Heart size={13} />Favorites</span><span><UserRound size={13} />You</span></div>
      </div>
    </motion.div>
  </div>;
}

export default function App() {
  const reduced = useReducedMotion();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(readSavedCart);
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [storyOpen, setStoryOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [showTop, setShowTop] = useState(false);
  const bagCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const rise = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } };

  useEffect(() => {
    try { localStorage.setItem('beanora-bag', JSON.stringify(cart)); } catch { /* The bag remains usable without local storage. */ }
  }, [cart]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileMenu) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenu(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [mobileMenu]);

  function addToBag(item: CartItem) {
    setCart((previous) => {
      const existing = previous.find((entry) => entry.id === item.id);
      if (!existing) return [...previous, item];
      return previous.map((entry) => entry.id === item.id ? { ...entry, quantity: Math.min(99, entry.quantity + item.quantity) } : entry);
    });
    setSelectedDrink(null);
    setToast(`${drinks.find((drink) => drink.id === item.drinkId)?.name} added to your bag`);
  }

  function exploreMenu() {
    setBagOpen(false);
    setMobileMenu(false);
    document.getElementById('menu')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' });
  }

  return <div className="site-shell">
    <a className="skip-link" href="#menu">Skip to the menu</a>
    <header className="site-header">
      <div className="nav-container">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#menu">Our menu</a><a href="#story">Our story</a><a href="#visit">Your cozy spot</a></nav>
        <div className="header-actions">
          <button className="bag-button icon-button" onClick={() => setBagOpen(true)} aria-label={`Open coffee bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}><ShoppingBag size={20} strokeWidth={1.5} />{bagCount > 0 && <span className="bag-count">{bagCount}</span>}</button>
          <a className="button button-outline nav-book" href="#visit">Book a table <ArrowUpRight size={15} /></a>
          <button className="mobile-toggle icon-button" aria-label={mobileMenu ? 'Close navigation' : 'Open navigation'} aria-expanded={mobileMenu} aria-controls="mobile-navigation" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      <AnimatePresence>{mobileMenu && <motion.nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: reduced ? 0 : 0.2 }}>
        <a href="#menu" onClick={() => setMobileMenu(false)}>Our menu <ArrowUpRight size={17} /></a><a href="#story" onClick={() => setMobileMenu(false)}>Our story <ArrowUpRight size={17} /></a><a href="#visit" onClick={() => setMobileMenu(false)}>Book your cozy spot <ArrowUpRight size={17} /></a>
      </motion.nav>}</AnimatePresence>
    </header>

    <main>
      <section className="hero" id="home" aria-labelledby="hero-title">
        <motion.img className="hero-image" src="/images/coffee-hero.jpg" alt="A creamy leaf-art latte on a walnut board, surrounded by fresh coffee leaves and roasted beans" width={1536} height={1024} fetchPriority="high" initial={reduced ? false : { scale: 1.035 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: 'easeOut' }} />
        <div className="hero-shade" />
        <div className="hero-inner">
          <motion.div className="hero-copy" initial={reduced ? false : 'hidden'} animate="visible" variants={{ visible: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } } }}>
            <motion.p className="hero-kicker" variants={rise}>PREMIUM COFFEE & A LITTLE MORE</motion.p>
            <motion.h1 className="hero-brand" id="hero-title" variants={rise}>Beanora<span>.</span></motion.h1>
            <motion.h2 className="hero-headline" variants={rise}>Good Coffee Brings<span className="script-line"><i aria-hidden="true" /><em className="script">Better Days.</em><i aria-hidden="true" /></span></motion.h2>
            <motion.p className="hero-description" variants={rise}>More than a cup. A moment to slow down.<br />Fresh brews, cozy corners, and a place to be yourself.</motion.p>
            <motion.div className="hero-cta" variants={rise}><a className="button button-green" href="#menu">Explore the menu <ArrowRight size={16} /></a><a className="hero-story-link" href="#story">Meet Beanora <ArrowUpRight size={15} /></a></motion.div>
          </motion.div>
        </div>
      </section>

      <section className="section-menu section-container" id="menu" aria-labelledby="menu-title">
        <Reveal className="section-heading"><p className="eyebrow">A FEW LOCAL FAVORITES</p><h2 id="menu-title"><span className="heading-stroke" aria-hidden="true" />Our Signature Drinks<span className="heading-stroke" aria-hidden="true" /></h2><p>Made with good beans. Served with a little love.</p></Reveal>
        <div className="drink-grid">
          {drinks.map((drink, index) => <motion.article className="drink-card" key={drink.id} initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduced ? 0 : 0.65, delay: index * 0.09 }}>
            <DrinkArtwork drink={drink} />
            <h3>{drink.name}</h3><p className="drink-description">{drink.description}</p><p className="drink-price">{formatPrice(drink.price)}</p>
            <button className="button button-green drink-order" onClick={() => setSelectedDrink(drink)}>Order my favorite <ArrowUpRight size={14} /></button>
          </motion.article>)}
        </div>
      </section>

      <section className="section-story" id="story" aria-labelledby="story-title">
        <Reveal className="story-banner">
          <img className="story-image" src="/images/coffee-story.jpg" alt="Swirls of coffee and cream in an iced latte, with roasted beans and soft linen" width={1536} height={1024} loading="lazy" />
          <div className="story-shade" />
          <div className="story-copy"><p className="eyebrow">OUR STORY</p><h2 id="story-title">More Than Coffee,<br />It's a Lifestyle.</h2><p>Beanora began with a simple idea: great coffee makes everyday moments feel special. The finest beans, a little care, and a space that feels like home.</p><button className="button button-green" onClick={() => setStoryOpen(true)}>A little about us <ArrowRight size={15} /></button></div>
          <svg className="story-line-art" viewBox="0 0 180 110" fill="none" aria-hidden="true"><path d="M-20 38C108-2 171 62 164 135M-19 55c96-17 126 30 123 73" stroke="currentColor" strokeWidth="1.8" /></svg>
        </Reveal>
      </section>

      <section className="section-order section-container" aria-labelledby="order-title">
        <Reveal className="order-phone-wrap"><PhonePreview /></Reveal>
        <Reveal className="order-ahead-copy" delay={0.1}><p className="eyebrow">YOUR DAILY RITUAL, MADE EASIER</p><h2 id="order-title">Order Your Favorite Coffee<span className="script-line"><i aria-hidden="true" /><em className="script">Anytime.</em><i aria-hidden="true" /></span></h2><p>Busy morning or slow afternoon, your favorite cup is only a few taps away. Order ahead, skip the queue, and make a little more time for you.</p><button className="button button-green" onClick={exploreMenu}>Order for pickup <ArrowRight size={16} /></button><span className="order-ahead-note">Same lovely coffee. A little less waiting.</span></Reveal>
      </section>

      <section className="section-visit" id="visit" aria-labelledby="visit-title">
        <svg className="visit-wave" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 43C99 6 163 70 281 36S449 20 579 65s212 39 338-7S1090 9 1223 43s157 20 217-4v61H0Z" fill="currentColor" /><path d="M0 35C99 8 163 63 281 27S449 17 579 56s212 40 338-4S1090 3 1223 35s157 20 217-4" fill="none" stroke="currentColor" strokeWidth="3" /><path d="m39 24 50 1m113 23 35-4m100-32 43-1m443 48 44-9m137-35 60-7m150 16 44 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <div className="visit-inner section-container">
          <Reveal className="visit-copy"><p className="eyebrow">THERE'S A SEAT WITH YOUR NAME ON IT</p><h2 id="visit-title">Book Your Cozy Spot</h2><p className="visit-description">Good coffee. Good company. Stay a little longer.</p><ReservationForm /></Reveal>
          <Reveal className="visit-film" delay={0.15}><button className="film-preview" onClick={() => { setVideoError(false); setVideoOpen(true); }} aria-label="Play The art of a good cup, a behind-the-scenes coffee film"><img src={filmPoster} alt="A barista carefully preparing a portafilter with freshly ground coffee" width={1200} height={627} loading="lazy" /><span className="film-gradient" /><span className="film-play"><Play size={24} fill="currentColor" strokeWidth={1.4} /></span><span className="film-caption"><span className="eyebrow">FROM BEAN TO BETTER DAY</span><strong>The art of a good cup.</strong><span>Take a little look behind the counter <ArrowUpRight size={14} /></span></span></button></Reveal>
        </div>
        <footer className="site-footer section-container"><div className="footer-top"><Brand footer /><p>Fresh brews. Friendly faces. Better days.</p><nav aria-label="Footer navigation"><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#visit">Reserve a table</a></nav></div><div className="footer-bottom"><span>&copy; {new Date().getFullYear()} Beanora. Crafted with care.</span><span>A little moment. A better day.</span></div></footer>
      </section>
    </main>

    <AnimatePresence>
      {selectedDrink && <DrinkModal key={`drink-${selectedDrink.id}`} drink={selectedDrink} onClose={() => setSelectedDrink(null)} onAdd={addToBag} />}
      {bagOpen && <BagDrawer key="bag" items={cart} onClose={() => setBagOpen(false)} onQuantity={(id, quantity) => setCart((previous) => previous.flatMap((item) => item.id === id ? quantity > 0 ? [{ ...item, quantity: Math.min(quantity, 99) }] : [] : [item]))} onRemove={(id) => setCart((previous) => previous.filter((item) => item.id !== id))} onClear={() => setCart([])} onExplore={exploreMenu} />}
      {storyOpen && <Modal key="story" title="Coffee, with a little more heart." onClose={() => setStoryOpen(false)}><div className="full-story"><p className="eyebrow">WELCOME TO BEANORA</p><p>We believe the best part of a day is often the smallest. That first sip of coffee. A familiar face. A corner of the world where there's no hurry to leave.</p><p>That's the idea behind Beanora. We take our time choosing rich, characterful beans, crafting every drink, and making our space feel like your space.</p><h3>Good beans. Good people. Good days.</h3><p>Whether you're catching up with a friend, finding a quiet moment, or just passing through, there's always room for you here.</p><a className="button button-green" href="#visit" onClick={() => setStoryOpen(false)}>Find your cozy spot <ArrowRight size={16} /></a></div></Modal>}
      {videoOpen && <Modal key="film" title="The art of a good cup." onClose={() => setVideoOpen(false)} wide><div className="video-player">{videoError ? <div className="video-fallback"><Coffee size={38} /><p>The film couldn't load in this browser.</p><a className="button button-green" href={filmUrl} target="_blank" rel="noreferrer">Open the film <ArrowUpRight size={16} /></a></div> : <video controls autoPlay playsInline preload="metadata" poster={filmPoster} aria-label="Silent film of a barista preparing an espresso portafilter" onError={() => setVideoError(true)}><source src={filmUrl} type="video/mp4" />Your browser does not support this video.</video>}</div><p className="film-credit">Every good cup starts with a little care. <span>Film by <a href="https://www.pexels.com/video/2849935/" target="_blank" rel="noreferrer">K on Pexels</a>.</span></p></Modal>}
    </AnimatePresence>

    <AnimatePresence>{toast && <motion.div className="bag-toast" role="status" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: reduced ? 0 : 0.25 }}><span className="toast-check"><Check size={17} /></span><span>{toast}</span><button onClick={() => { setToast(null); setBagOpen(true); }}>View bag <ArrowRight size={14} /></button><button className="toast-dismiss" aria-label="Dismiss notification" onClick={() => setToast(null)}><X size={15} /></button></motion.div>}</AnimatePresence>
    <AnimatePresence>{showTop && <motion.button className="back-to-top" aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><ArrowUp size={19} /></motion.button>}</AnimatePresence>
  </div>;
}
