import { useState, useEffect, useRef } from "react";
import "./App.css";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { Menu, X } from "lucide-react";
import ScannerPage from "./pages/ScannerPage";
import ProductAnalysisPage from "./pages/ProductAnalysisPage";
import DashboardPage from "./pages/DashboardPage";
import ComparePage from "./pages/ComparePage";
import AuthPage from "./pages/AuthPage";
import CoalesceParticles from "./components/CoalesceParticles";
import DataStreamBg from "./components/DataStreamBg";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const MKT_ITEMS = [
  {t:'price',text:'₹ 285',r:true},{t:'price',text:'₹ 249'},{t:'price',text:'₹ 99',r:true},
  {t:'price',text:'₹ 79'},{t:'price',text:'MRP ₹ 150'},{t:'price',text:'₹ 399',r:true},
  {t:'badge',text:'✓ Genuine Product',g:true},{t:'badge',text:'⚠ Price Inflated',r:true},
  {t:'badge',text:'Best Value',y:true},{t:'badge',text:'✓ Fresh Stock',g:true},
  {t:'badge',text:'AI Verified'},{t:'badge',text:'Save 28%',y:true},
  {t:'badge',text:'⚠ Expiry Near',r:true},{t:'badge',text:'✓ Safe to Buy',g:true},
  {t:'badge',text:'Fraud Detected',r:true},{t:'badge',text:'Scan Complete',g:true},
  {t:'save',text:'You Save ₹ 36'},{t:'save',text:'Save ₹ 120 Online'},
  {t:'save',text:'Best Value: 500g'},{t:'save',text:'₹ 840 Saved'},
  {t:'rupee',text:'₹'},{t:'rupee',text:'₹'},{t:'rupee',text:'₹'},
  {t:'pct',text:'14%'},{t:'pct',text:'28%'},{t:'pct',text:'OFF'},
  {t:'icon',text:'🛒'},{t:'icon',text:'🏷️'},{t:'icon',text:'📦'},
  {t:'icon',text:'🧾'},{t:'icon',text:'💰'},{t:'icon',text:'🔍'},
  {t:'icon',text:'✅'},{t:'icon',text:'⚠️'},{t:'icon',text:'🤖'},
  {t:'bar'},{t:'bar'},{t:'bar'},
];

const PRODUCTS = [
  {emoji:'🧴',name:'Dove Body Lotion',brand:'Unilever · 200ml',mrp:'₹285',finding:'Save ₹36',status:'⚠ Price Fraud',color:'red'},
  {emoji:'🍜',name:'Maggi Noodles',brand:'Nestle · 100g',mrp:'₹15',finding:'Health: 5/10',status:'✓ Genuine',color:'green'},
  {emoji:'🥛',name:'Amul Taaza Milk',brand:'GCMMF · 1L',mrp:'₹28',finding:'18 months left',status:'✓ Fresh Stock',color:'green'},
  {emoji:'🧃',name:'Tropicana Juice',brand:'PepsiCo · 1L',mrp:'₹89',finding:'Real Juice ₹65',status:'↑ Better Alt',color:'yellow'},
  {emoji:'💊',name:'Crocin 650mg',brand:'Haleon · 10 tabs',mrp:'₹32',finding:'Genuine batch',status:'✓ Verified',color:'blue'},
  {emoji:'🧈',name:'Amul Butter',brand:'GCMMF · 500g',mrp:'₹55',finding:'Avoid buying!',status:'⚠ Expiry Near',color:'red'},
  {emoji:'🍪',name:'Parle-G',brand:'Parle · 100g',mrp:'₹10',finding:'Health: 6/10',status:'✓ Safe',color:'green'},
  {emoji:'🌿',name:'Dabur Honey',brand:'Dabur · 500g',mrp:'₹199',finding:'Save ₹24 online',status:'⚠ Overpriced',color:'yellow'},
];

const FLIP_CARDS = [
  {icon:'🔍',cl:'g',title:'Fake Price Detector',front:'Scan any product barcode',back:'Compares printed MRP vs actual registered price — flags every overcharge with exact ₹ amount',badge:'🔥 Must Have',fb:'hot'},
  {icon:'📅',cl:'b',title:'Expiry Scanner',front:'Never buy expired products',back:'Extracts exact expiry dates — shows days remaining with green/yellow/red freshness status',badge:'🔥 Must Have',fb:'hot'},
  {icon:'🤖',cl:'p',title:'AI Alternatives',front:'AI suggests better options',back:'Recommends cheaper, healthier alternatives with full price and health score comparison',badge:'⭐ Unique',fb:'uniq'},
  {icon:'📦',cl:'pk',title:'Bulk Buy Savings',front:'Which pack size saves most?',back:'Compares 100g vs 500g vs 1kg — shows exact cost per gram and highlights best value pack',badge:'⭐ Unique',fb:'uniq'},
  {icon:'🧪',cl:'g',title:'Health Score',front:'Know what you are eating',back:'Reads ingredient list and scores product out of 10 — harmful additives flagged in red',badge:'⭐ Unique',fb:'uniq'},
  {icon:'🌐',cl:'b',title:'Online Prices',front:'Are you overpaying offline?',back:'Live prices from Amazon, Flipkart and Blinkit shown instantly — see exactly how much you save',badge:'✨ New',fb:'nw'},
];

const SLIDES = [
  {title:'🔍 Price Fraud Detected',prod:'Dove Body Lotion 200ml',type:'price'},
  {title:'📅 Expiry Status',prod:'Amul Taaza Milk 1L',type:'expiry'},
  {title:'🧪 Health Score',prod:'Maggi 2-Minute Noodles',type:'health'},
  {title:'📦 Bulk Buy Savings',prod:'Tata Salt',type:'bulk'},
  {title:'🌐 Online Price Compare',prod:'Dove Soap 3-Pack',type:'online'},
];

/* ─────────────────────────────────────────────────────────────
   PAGE TRANSITION — blur out / slide lock
───────────────────────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, filter: "blur(16px)", x: 40, scale: 0.97 },
  animate: {
    opacity: 1, filter: "blur(0px)", x: 0, scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, filter: "blur(16px)", x: -40, scale: 0.97,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

/* ─────────────────────────────────────────────────────────────
   MIST REVEAL — "Born of Nature" scroll component
   Uses native IntersectionObserver + useAnimation for reliability
   blur(22px)→0, scale(0.82)→1, opacity(0)→1, y(28)→0
───────────────────────────────────────────────────────────── */
function MistReveal({ children, delay = 0, className = '', style = {}, as = 'div' }) {
  const ref = useRef(null);
  const controls = useAnimation();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
            y: 0,
            transition: {
              duration: 0.92,
              delay,
              ease: [0.16, 1, 0.3, 1],
            },
          });
          observer.unobserve(el); // once only
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [controls, delay]);

  const Tag = as === 'h2' ? motion.h2 : as === 'p' ? motion.p : motion.div;

  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, filter: 'blur(22px)', scale: 0.82, y: 28 }}
      animate={controls}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────────
   MARKETING BG (Home only)
───────────────────────────────────────────────────────────── */
function MarketingBg() {
  const bgRef = useRef(null);
  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    function buildEl(p) {
      let el;
      if (p.t === 'bar') {
        el = document.createElement('div');
        el.className = 'mkt-barcode';
        [26,18,32,16,28,22,30,14,26,24,20,34,18,28,22,32].forEach(h => {
          const s = document.createElement('span');
          s.style.height = h + 'px';
          el.appendChild(s);
        });
      } else {
        el = document.createElement('div');
        if (p.t === 'price') el.className = 'mkt-price' + (p.r ? ' red' : '');
        else if (p.t === 'badge') el.className = 'mkt-badge' + (p.r ? ' red' : p.y ? ' yellow' : p.g ? ' green' : '');
        else if (p.t === 'save')  el.className = 'mkt-save';
        else if (p.t === 'rupee') el.className = 'mkt-rupee';
        else if (p.t === 'pct')   el.className = 'mkt-pct';
        else if (p.t === 'icon')  el.className = 'mkt-icon';
        el.textContent = p.text || '';
      }
      return el;
    }

    for (let i = 0; i < 70; i++) {
      const wrap = document.createElement('div');
      wrap.className = 'mkt-item';
      const p = MKT_ITEMS[i % MKT_ITEMS.length];
      wrap.appendChild(buildEl(p));
      const x   = Math.random() * 97;
      const dur  = 12 + Math.random() * 16;
      const delay = -(Math.random() * dur);
      wrap.style.cssText = `left:${x}%;bottom:-100px;animation:floatUp ${dur}s ${delay}s linear infinite;`;
      bg.appendChild(wrap);
    }
  }, []);

  return <div id="mkt-bg" ref={bgRef} />;
}

/* ─────────────────────────────────────────────────────────────
   COUNTER
───────────────────────────────────────────────────────────── */
function Counter({ target, prefix = '', suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / (2000 / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────────
   3D TILT CARD
───────────────────────────────────────────────────────────── */
function TiltCard({ p }) {
  const cardRef = useRef(null);
  const handleMove = e => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left, y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -12, rotY = ((x - cx) / cx) * 12;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
    const glare = card.querySelector('.tc-glare');
    glare.style.background = `radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255,255,255,0.1) 0%, transparent 60%)`;
  };
  const handleLeave = () => {
    const card = cardRef.current;
    card.style.transition = 'transform 0.5s ease, box-shadow 0.3s ease';
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
  };
  const handleEnter = () => { cardRef.current.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease'; };
  return (
    <div ref={cardRef} className={`tilt-card tc-${p.color}`}
      onMouseMove={handleMove} onMouseLeave={handleLeave} onMouseEnter={handleEnter}>
      <div className="tc-glare" />
      <div className="tc-scan" />
      <div className="tc-emoji">{p.emoji}</div>
      <div className="tc-name">{p.name}</div>
      <div className="tc-brand">{p.brand}</div>
      <div className="tc-divider" />
      <div className="tc-row"><span className="tc-lbl">MRP</span><span className="tc-val">{p.mrp}</span></div>
      <div className="tc-row"><span className="tc-lbl">Cartico</span><span className="tc-val" style={{color:'var(--green)',fontSize:11}}>{p.finding}</span></div>
      <div className={`tc-status tcs-${p.color}`}>{p.status}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FLIP CARD
───────────────────────────────────────────────────────────── */
function FlipCard({ card }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`flip-wrap${flipped ? ' flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
      <div className="flip-inner">
        <div className="flip-front">
          <div className={`fi ${card.cl}`}>{card.icon}</div>
          <h3>{card.title}</h3>
          <p>{card.front}</p>
          <span className={`fb ${card.fb}`}>{card.badge}</span>
          <div className="flip-hint">Click to reveal →</div>
        </div>
        <div className="flip-back">
          <div className="flip-back-icon">{card.icon}</div>
          <h3>{card.title}</h3>
          <p>{card.back}</p>
          <div className="flip-hint">Click to flip back ↩</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SLIDE CONTENT
───────────────────────────────────────────────────────────── */
function SlideContent({ type }) {
  if (type === 'price') return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12}}>
        <span style={{fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#ff6b85',textDecoration:'line-through',opacity:.7}}>₹285</span>
        <span style={{color:'rgba(255,255,255,.3)'}}>→</span>
        <span style={{fontFamily:'Syne,sans-serif',fontSize:28,fontWeight:800,color:'#00ffaa'}}>₹249</span>
      </div>
      <div className="slide-alert">🚨 Sticker overpriced by ₹36 — 14.5% above actual MRP</div>
    </div>
  );
  if (type === 'expiry') return (
    <div>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:700,color:'#00ffaa',marginBottom:8}}>✓ Fresh · Oct 2026</div>
      <div style={{fontSize:12,color:'rgba(255,255,255,.35)',marginBottom:10}}>18 months remaining · Mfg: Apr 2025</div>
      <div className="slide-ok">✓ Completely safe to consume</div>
    </div>
  );
  if (type === 'health') return (
    <div>
      <div style={{fontFamily:'Syne,sans-serif',fontSize:32,fontWeight:800,color:'#ffd166',marginBottom:8}}>5.5 / 10</div>
      <div className="hb" style={{marginBottom:12}}><div className="hf" style={{width:'55%'}}/></div>
      <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
        {['MSG ⚠','Maida ⚠','Palm Oil ⚠','Salt ✓','Wheat ✓'].map(t => (
          <span key={t} style={{fontSize:11,padding:'3px 8px',borderRadius:20,background:t.includes('⚠')?'rgba(255,79,109,.1)':'rgba(0,255,170,.07)',color:t.includes('⚠')?'#ff7a92':'#60ffcc',border:`1px solid ${t.includes('⚠')?'rgba(255,79,109,.2)':'rgba(0,255,170,.15)'}`}}>{t}</span>
        ))}
      </div>
    </div>
  );
  if (type === 'bulk') return (
    <div style={{display:'flex',gap:10}}>
      {[{s:'500g',p:'₹22',b:false},{s:'1kg',p:'₹38',b:true},{s:'2kg',p:'₹72',b:false}].map(x => (
        <div key={x.s} style={{flex:1,background:x.b?'rgba(0,255,170,.07)':'rgba(255,255,255,.03)',border:`1px solid ${x.b?'rgba(0,255,170,.25)':'rgba(255,255,255,.07)'}`,borderRadius:12,padding:'14px 8px',textAlign:'center'}}>
          <div style={{fontSize:12,color:'rgba(255,255,255,.4)',marginBottom:5}}>{x.s}</div>
          <div style={{fontFamily:'Syne,sans-serif',fontSize:22,fontWeight:800,color:x.b?'#00ffaa':'#fff'}}>{x.p}</div>
          {x.b && <div style={{fontSize:9,color:'#00ffaa',fontWeight:700,marginTop:5}}>BEST VALUE</div>}
        </div>
      ))}
    </div>
  );
  if (type === 'online') return (
    <div style={{display:'flex',flexDirection:'column',gap:7}}>
      {[{s:'Amazon',p:'₹89',sv:'Save ₹21',bad:false},{s:'Flipkart',p:'₹85',sv:'Save ₹25',bad:false},{s:'Blinkit',p:'₹95',sv:'Save ₹15',bad:false},{s:'Local Shop',p:'₹110',sv:'Overpriced!',bad:true}].map(r => (
        <div key={r.s} style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(255,255,255,.03)',borderRadius:10,padding:'8px 12px',border:'1px solid rgba(255,255,255,.06)'}}>
          <span style={{fontSize:13,color:'rgba(255,255,255,.5)'}}>{r.s}</span>
          <span style={{fontWeight:700,fontSize:14}}>{r.p}</span>
          <span style={{fontSize:11,color:r.bad?'#ff7a92':'#00ffaa',fontWeight:600}}>{r.sv}</span>
        </div>
      ))}
    </div>
  );
  return null;
}

/* ─────────────────────────────────────────────────────────────
   RESULT SLIDER
───────────────────────────────────────────────────────────── */
function ResultSlider() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % SLIDES.length), 3000);
    return () => clearInterval(t);
  }, []);
  const go = n => setActive((n + SLIDES.length) % SLIDES.length);
  return (
    <div className="slider-wrap">
      <div className="slider-dots">
        {SLIDES.map((_, i) => (
          <div key={i} className={`slider-dot${active === i ? ' active' : ''}`} onClick={() => setActive(i)} />
        ))}
      </div>
      <div className="slider-track" style={{transform:`translateX(-${active * 100}%)`}}>
        {SLIDES.map((s, i) => (
          <div key={i} className="slider-slide">
            <div className="slide-header">
              <div className="slide-title">{s.title}</div>
              <div className="slide-product">{s.prod}</div>
            </div>
            <div className="slide-content"><SlideContent type={s.type} /></div>
          </div>
        ))}
      </div>
      <div className="slider-arrows">
        <button className="sl-arrow" onClick={() => go(active - 1)}>←</button>
        <span style={{color:'rgba(255,255,255,0.3)',fontSize:12}}>{active + 1} / {SLIDES.length}</span>
        <button className="sl-arrow" onClick={() => go(active + 1)}>→</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NAVBAR — Orbitron, gap: 4rem spread
───────────────────────────────────────────────────────────── */
function Navbar({ activeTab, setActiveTab, isLoggedIn }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav>
      <div className="logo" onClick={() => handleNavClick('Home')} style={{ cursor: 'pointer' }}>Cartico</div>
      
      <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={24} color="#fff" /> : <Menu size={24} color="#fff" />}
      </button>

      <div className={`nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="nav-links">
          {['Home', 'Scanner', 'Results', 'Compare', 'Dashboard'].map(tab => (
            <a
              key={tab}
              className={`nav-link${activeTab === tab ? ' active' : ''}`}
              onClick={() => handleNavClick(tab)}
            >
              {tab}
            </a>
          ))}
        </div>
        <div className="nav-actions" style={{ display: 'flex', gap: 16, alignItems: 'center', flexShrink: 0 }}>
          {!isLoggedIn ? (
            <button className="nav-cta" onClick={() => handleNavClick('Auth')}>Login / Join</button>
          ) : (
            <>
              <button className="nav-cta" onClick={() => handleNavClick('Scanner')}>⊡ Scan Now</button>
              <div 
                className="nav-avatar" 
                onClick={() => handleNavClick('Dashboard')}
                style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--green), var(--blue))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', cursor: 'pointer', border: '2px solid rgba(255,255,255,0.1)', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,255,170,0.2)' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                C
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────
   HOME — Born of Nature scroll experience
   Each section wrapped in <MistReveal> for guaranteed blur→clear
───────────────────────────────────────────────────────────── */
function Home({ setActiveTab }) {
  const [scanMode, setScanMode] = useState('QR Code');

  return (
    <>
      {/* ── HERO (on-load animations, no scroll needed) ── */}
      <div className="hero">
        <div className="hero-left">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="pulse" /> AI-Powered Product Intelligence
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(18px)', y: 30, scale: 0.92 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            Brands Have<br /><span className="g">Secrets,</span><br />Cartico Has<br />Answers
          </motion.h1>

          <motion.div
            className="hero-btns"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <button className="btn-main" onClick={() => setActiveTab('Scanner')}>⊡ Start Scanning →</button>
            <button className="btn-ghost">See How It Works</button>
          </motion.div>
        </div>

        <motion.div
          className="hero-right"
          initial={{ opacity: 0, filter: 'blur(22px)', x: 50, scale: 0.90 }}
          animate={{ opacity: 1, filter: 'blur(0px)', x: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="scanner-glass">
            <div className="scan-frame">
              <div className="sc tl"/><div className="sc tr"/>
              <div className="sc bl"/><div className="sc br"/>
              <div className="scan-line"/>
              <div className="scan-inner">⊡</div>
            </div>
            <div className="scan-lbl">Point camera at any product barcode or QR</div>
            <div className="scan-modes">
              {['QR Code', 'Barcode', 'Upload'].map(m => (
                <div key={m} className={`sm${scanMode === m ? ' active' : ''}`} onClick={() => setScanMode(m)}>{m}</div>
              ))}
            </div>
            <div className="stats-row">
              <div className="si"><div className="sv">6+</div><div className="sl">Checks Per Scan</div></div>
              <div className="si"><div className="sv">AI</div><div className="sl">Powered</div></div>
              <div className="si"><div className="sv">Free</div><div className="sl">Always</div></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SCROLL SECTIONS — all wrapped in MistReveal
          blur(22px)→0, scale(0.82)→1, opacity(0)→1
      ══════════════════════════════════════════════════════ */}

      {/* ── Section 1: See Cartico in Action ── */}
      <MistReveal className="section">
        <div className="sh">
          <MistReveal as="div" delay={0.06}><div className="stag">Real Scan Results</div></MistReveal>
          <MistReveal as="h2" delay={0.14}>See Cartico in Action</MistReveal>
          <MistReveal as="p" delay={0.20}>Hover over any product card to see what Cartico reveals</MistReveal>
        </div>
        <div className="tilt-grid">
          {PRODUCTS.map((p, i) => (
            <MistReveal key={i} delay={i * 0.06}>
              <TiltCard p={p} />
            </MistReveal>
          ))}
        </div>
      </MistReveal>

      {/* ── Section 2: Counters ── */}
      <div className="counters-section">
        <div className="counter-grid">
          {[
            {label:'Products Scanned',target:12,suffix:'+',icon:'📱'},
            {label:'Frauds Detected',target:3,suffix:'+',icon:'🚨'},
            {label:'Money Saved',target:450,prefix:'₹',suffix:'+',icon:'💰'},
            {label:'Cities Active',target:2,suffix:'+',icon:'🏙️', sublabel:'(Faridabad & Delhi)'},
          ].map((c, i) => (
            <MistReveal key={c.label} delay={i * 0.10}>
              <div className="counter-card">
                <div className="counter-icon">{c.icon}</div>
                <div className="counter-num"><Counter target={c.target} prefix={c.prefix || ''} suffix={c.suffix} /></div>
                <div className="counter-lbl">{c.label}</div>
                {c.sublabel && <div className="counter-sublbl">{c.sublabel}</div>}
              </div>
            </MistReveal>
          ))}
        </div>
      </div>

      {/* ── Section 3: How Cartico Works ── */}
      <MistReveal className="section">
        <div className="sh">
          <MistReveal delay={0.06}><div className="stag">Simple Process</div></MistReveal>
          <MistReveal as="h2" delay={0.14}>How Cartico Works</MistReveal>
          <MistReveal as="p" delay={0.20}>Three steps. Zero guesswork. Full transparency.</MistReveal>
        </div>
        <div className="steps">
          {[
            {n:1,icon:'📱',glow:'green',title:'Scan the Product',desc:'Point your camera at any QR or barcode, or search by product name'},
            {n:2,icon:'🤖',glow:'blue',title:'Cartico Analyzes',desc:'AI checks price, expiry, health score and finds better alternatives instantly'},
            {n:3,icon:'✅',glow:'purple',title:'Shop with Truth',desc:'Make informed choices — never overpay or buy unsafe products again'},
          ].map((s, i) => (
            <MistReveal key={s.n} delay={i * 0.14}>
              <div className="step">
                <div className={`step-icon-wrap step-glow-${s.glow}`}>
                  <div className="step-icon">{s.icon}</div>
                </div>
                <div className="step-n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </MistReveal>
          ))}
        </div>
      </MistReveal>

      {/* ── Section 4: Flip Cards ── */}
      <MistReveal className="section">
        <div className="sh">
          <MistReveal delay={0.06}><div className="stag">What We Reveal</div></MistReveal>
          <MistReveal as="h2" delay={0.14}>Every Secret, Uncovered</MistReveal>
          <MistReveal as="p" delay={0.20}>Click any card to reveal what Cartico detects!</MistReveal>
        </div>
        <div className="feat-grid">
          {FLIP_CARDS.map((card, i) => (
            <MistReveal key={i} delay={i * 0.08}>
              <FlipCard card={card} />
            </MistReveal>
          ))}
        </div>
      </MistReveal>

      {/* ── Section 5: Result Slider ── */}
      <MistReveal className="section">
        <div className="sh">
          <MistReveal delay={0.06}><div className="stag">Live Preview</div></MistReveal>
          <MistReveal as="h2" delay={0.14}>What Cartico Reveals</MistReveal>
          <MistReveal as="p" delay={0.20}>Real scan results — slide through to explore each feature.</MistReveal>
        </div>
        <ResultSlider />
      </MistReveal>

      <footer>
        <div className="footer-logo">Cartico</div>
        <p>Brands Have Secrets, Cartico Has Answers &nbsp;·&nbsp; Made in India 🇮🇳</p>
      </footer>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   COMING SOON — per-page themed
───────────────────────────────────────────────────────────── */
function ComingSoon({ name }) {
  const isCompare   = name === 'Compare';
  const isDashboard = name === 'Dashboard';

  const accentColor    = isCompare ? '#6eb3ff' : isDashboard ? '#fbbf24' : '#00ffaa';
  const accentColorSub = isCompare ? '#10b981'  : isDashboard ? '#f97316' : '#4d9fff';
  const icon = isCompare ? '⚖️' : isDashboard ? '📊' : '🚧';

  const features = isCompare
    ? ['Side-by-side product comparison', 'Price & health score matrix', 'AI winner recommendation', 'Ingredient diff viewer']
    : isDashboard
    ? ['Scan history & trends', 'Money saved over time', 'Health score analytics', 'Fraud detection report']
    : [];

  return (
    <div className={`coming-soon ${isCompare ? 'page-compare' : isDashboard ? 'page-dashboard' : ''}`}>
      {isCompare && <div className="compare-lines" />}

      <motion.div
        style={{ fontSize: 72, filter: `drop-shadow(0 0 40px ${accentColor}55)` }}
        animate={{ scale: [1, 1.06, 1], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>

      <motion.h2
        style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 28, fontWeight: 700,
          letterSpacing: '0.15rem', textAlign: 'center',
          background: `linear-gradient(135deg, ${accentColor}, ${accentColorSub})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}
        initial={{ opacity: 0, filter: 'blur(14px)', y: 20 }}
        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      >
        {name}
      </motion.h2>

      <motion.p
        style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, textAlign: 'center', fontFamily: 'Plus Jakarta Sans, sans-serif' }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
      >
        Coming in the next build — stay tuned!
      </motion.p>

      {features.length > 0 && (
        <motion.div
          style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8, maxWidth: 360, width: '100%' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${accentColor}22`,
                borderRadius: 12, padding: '10px 16px',
                fontSize: 13, color: 'rgba(255,255,255,0.55)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.07 }}
            >
              <span style={{ color: accentColor, fontSize: 16 }}>◆</span> {f}
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.span
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '8px 20px', borderRadius: 30, fontSize: 12, fontWeight: 600,
          fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.05rem',
          border: `1px solid ${accentColor}44`,
          background: `${accentColor}11`,
          color: accentColor,
          marginTop: 8,
        }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <span style={{ color: accentColor }}>●</span>
        {isCompare ? 'Sapphire · Forest Edition' : isDashboard ? 'Carbon · Amber Edition' : ''}
      </motion.span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ROOT APP — AnimatePresence blur-slide page transitions
───────────────────────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Custom cursor
  useEffect(() => {
    const cur = document.getElementById('cursor');
    const trl = document.getElementById('cursor-trail');
    let mx = 0, my = 0, tx = 0, ty = 0;
    const move = e => {
      mx = e.clientX; my = e.clientY;
      if (cur) cur.style.transform = `translate(${mx - 5}px,${my - 5}px)`;
    };
    document.addEventListener('mousemove', move);
    const interval = setInterval(() => {
      tx += (mx - tx) * 0.14; ty += (my - ty) * 0.14;
      if (trl) trl.style.transform = `translate(${tx - 17}px,${ty - 17}px)`;
    }, 16);
    return () => { document.removeEventListener('mousemove', move); clearInterval(interval); };
  }, []);

  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />

      <div className="content">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} isLoggedIn={isLoggedIn} />

        {/* Global Backgrounds wrapper — decoupled from page transitions so position: fixed works */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
          <AnimatePresence>
            {activeTab === 'Home' && (
              <motion.div key="bg-home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <MarketingBg />
              </motion.div>
            )}
            {activeTab === 'Results' && (
              <motion.div key="bg-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                <DataStreamBg />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'Home' && (
            <motion.div key="home" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Home setActiveTab={setActiveTab} />
            </motion.div>
          )}

          {activeTab === 'Scanner' && (
            <motion.div key="scanner" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ScannerPage onBack={() => setActiveTab('Home')} />
            </motion.div>
          )}

          {activeTab === 'Results' && (
            <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ProductAnalysisPage onBack={() => setActiveTab('Home')} />
            </motion.div>
          )}

          {activeTab === 'Compare' && (
            <motion.div key="compare" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ComparePage onBack={() => setActiveTab('Home')} />
            </motion.div>
          )}

          {activeTab === 'Dashboard' && (
            <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <DashboardPage onBack={() => setActiveTab('Home')} />
            </motion.div>
          )}

          {activeTab === 'Auth' && (
            <motion.div key="auth" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <AuthPage onLogin={() => { setIsLoggedIn(true); setActiveTab('Home'); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
