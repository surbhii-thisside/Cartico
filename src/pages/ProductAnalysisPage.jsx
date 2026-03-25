import { useState, useEffect, useRef } from "react";
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, Zap, Star, MapPin, MessageSquare,
  TrendingDown, Leaf, FlaskConical, ChevronRight, ThumbsUp,
  Users, BadgeCheck, ArrowLeft, Sparkles, AlertCircle,
} from "lucide-react";
import "../analysis.css";

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — mirrors a MongoDB product document. Replace with API call.
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_PRODUCT = {
  _id: "prod_maggi_001",
  name: "Maggi 2-Minute Noodles",
  brand: "Nestlé",
  category: "Instant Food",
  emoji: "🍜",
  mrpSticker: 15,      // printed on pack
  mrpActual:  13,      // registered MRP
  trustScore: 58,
  healthScore: 5.5,
  ingredients: {
    bad:  ["MSG (E621)", "Palm Oil", "Maida (Refined Flour)", "Excess Sodium"],
    good: ["Wheat Extract", "Mixed Herbs", "Iron (Fortified)", "Iodised Salt"],
  },
  alternative: {
    name: "Yippee! Noodles", brand: "ITC", savings: 2,
    healthScore: 6.2, emoji: "🍝",
  },
  reviews: {
    cities: ["Delhi", "Mumbai", "Bangalore", "Hyderabad"],
    aiVerdict: {
      "All India": "People in Delhi say this batch is fresh — bought within 3 months of mfg.",
      Delhi:       "People in Delhi say this batch is fresh — bought within 3 months of mfg.",
      Mumbai:      "Mumbai users report the spice packet is weaker than usual lately.",
      Bangalore:   "Bangalore users love the taste but flag the high sodium.",
      Hyderabad:   "Mostly positive — value-for-money rating 4/5 from Hyderabad buyers.",
    },
    items: [
      { id:1, user:"Priya S.",   city:"Delhi",     stars:4, text:"Tastes great! Found it at MRP, no overcharging. Fresh batch.", verified:true  },
      { id:2, user:"Rahul M.",   city:"Mumbai",    stars:3, text:"Spice sachet seems thinner lately. But overall still love it.", verified:false },
      { id:3, user:"Ananya K.",  city:"Bangalore", stars:3, text:"Good taste but MSG content worries me. Wish there was a healthier version.", verified:true  },
      { id:4, user:"Vikram T.",  city:"Delhi",     stars:5, text:"Always buy from DMart. Never had an issue with pricing or quality!", verified:true  },
      { id:5, user:"Sneha R.",   city:"Hyderabad", stars:4, text:"Kids love it. Quick to make. Price is right.", verified:false },
    ],
  },
};

const MOCK_HISTORY = [
  { id: "h1", name: "Amul Taaza Milk", emoji: "🥛", score: 95, color: "#10b981" },
  { id: "h2", name: "Dove Body Lotion", emoji: "🧴", score: 72, color: "#f59e0b" },
  { id: "h3", name: "Lays Classic Chips", emoji: "🥔", score: 45, color: "#ef4444" },
];

// ─── Animation variants ───────────────────────────────────────────────────────
const container = { hidden:{}, visible:{ transition:{ staggerChildren:0.1 } } };
const slideUp = {
  hidden:  { opacity:0, y:30 },
  visible: { opacity:1, y:0, transition:{ duration:0.5, ease:"easeOut" } },
};

// ─── Skeleton Screen ──────────────────────────────────────────────────────────
function SkeletonScreen() {
  return (
    <div className="ap-skel">
      <div className="skel-row">
        <div className="skel-box" style={{ width:64, height:64, flexShrink:0 }} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
          <div className="skel-box" style={{ height:20, width:"60%" }} />
          <div className="skel-box" style={{ height:14, width:"40%" }} />
        </div>
        <div className="skel-box" style={{ width:100, height:100, borderRadius:"50%", flexShrink:0 }} />
      </div>
      {[120, 160, 110, 200].map((h,i) => (
        <div key={i} className="skel-box" style={{ height:h, width:"100%", borderRadius:18 }} />
      ))}
    </div>
  );
}

// ─── Trust Gauge (SVG) ────────────────────────────────────────────────────────
function TrustGauge({ score }) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once:true, amount:0.5 });
  const radius = 44, stroke = 7;
  const circ = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circ);

  useEffect(() => {
    if (!inView) return;
    const target = circ - (score / 100) * circ;
    let raf;
    const start = performance.now();
    const dur   = 1400;
    const tick  = (now) => {
      const t   = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setOffset(circ - (circ - target) * ease);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, score, circ]);

  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  const label = score >= 75 ? "Trusted" : score >= 50 ? "Moderate" : "At Risk";

  return (
    <div ref={ref} className="ap-gauge-wrap">
      <svg width="110" height="110" style={{ transform:"rotate(-90deg)" }}>
        <circle cx="55" cy="55" r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
        <circle cx="55" cy="55" r={radius} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ filter:`drop-shadow(0 0 6px ${color}88)`, transition:"stroke 0.3s" }} />
      </svg>
      <div className="ap-gauge-labels">
        <span className="ap-gauge-num" style={{ color }}>{score}</span>
        <span className="ap-gauge-tag">{label}</span>
      </div>
    </div>
  );
}

// ─── Stars ────────────────────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div className="ap-stars">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={11}
          className={i <= count ? "star-on" : "star-off"}
          fill={i <= count ? "currentColor" : "none"} />
      ))}
    </div>
  );
}

// ─── History Card ─────────────────────────────────────────────────────────────
function HistoryCard({ item }) {
  return (
    <motion.div className="ap-hist-card" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
      <div className="ap-hist-emoji">{item.emoji}</div>
      <div className="ap-hist-info">
        <p className="ap-hist-name">{item.name}</p>
        <div className="ap-hist-meta">
          <div className="ap-hist-dot" style={{ background: item.color }} />
          Trust Score: {item.score}
        </div>
      </div>
      <ChevronRight size={14} className="ap-hist-arrow" />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductAnalysisPage({ onBack }) {
  const [loading,    setLoading]    = useState(true);
  const [product,    setProduct]    = useState(null);
  const [cityFilter, setCityFilter] = useState("All India");

  // Simulated API fetch — replace with:
  // const res = await fetch(`http://localhost:5000/api/products/${productId}`);
  // const data = await res.json(); setProduct(data); setLoading(false);
  useEffect(() => {
    const t = setTimeout(() => { setProduct(MOCK_PRODUCT); setLoading(false); }, 1600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <div className="ap-page"><SkeletonScreen /></div>;

  const isFraud = product.mrpSticker > product.mrpActual;
  const filteredReviews = product.reviews.items.filter(
    r => cityFilter === "All India" || r.city === cityFilter
  );
  const verdict = product.reviews.aiVerdict[cityFilter] ?? product.reviews.aiVerdict["All India"];
  const goodCount = filteredReviews.filter(r => r.stars >= 4).length;
  const midCount  = filteredReviews.filter(r => r.stars === 3).length;
  const total     = Math.max(filteredReviews.length, 1);

  return (
    <div className="ap-page">
      {/* ── Sticky back bar ── */}
      <div className="ap-bar">
        <motion.button className="ap-back" onClick={onBack} whileTap={{ scale:0.95 }}>
          <ArrowLeft size={14} /> Back
        </motion.button>
        <span className="ap-bar-title">Product Analysis</span>
        <div className="ap-bar-spacer" />
      </div>

      {/* ── Staggered content ── */}
      <motion.div className="ap-body" variants={container} initial="hidden" animate="visible">

        {/* ── SECTION 1 · IDENTITY ── */}
        <motion.div variants={slideUp} className="ap-card">
          <div className="ap-identity">
            <div style={{ flex:1, minWidth:0 }}>
              <div className="ap-emoji-box" style={{ marginBottom:12 }}>{product.emoji}</div>
              <h1 className="ap-prod-name">{product.name}</h1>
              <p className="ap-prod-brand">{product.brand} · {product.category}</p>
              <span className="ap-mrp-badge">MRP ₹{product.mrpActual}</span>
            </div>
            <TrustGauge score={product.trustScore} />
          </div>
        </motion.div>

        {/* ── SECTION 2A · FAKE PRICE DETECTOR ── */}
        <motion.div variants={slideUp}>
          <div className="ap-label lbl-red" style={{ marginBottom:10 }}>
            <AlertCircle size={13} strokeWidth={2.5} />
            Fake Price Detector
          </div>
          <motion.div
            className={`ap-card ap-price-card ${isFraud ? "fraud" : "ok"}`}
            whileHover={{ y:-3 }} transition={{ duration:0.2 }}>
            {isFraud && (
              <div className="ap-pulse">
                <div className="ap-pulse-ring" />
                <div className="ap-pulse-dot" />
              </div>
            )}
            <div className="ap-price-row">
              <div className="ap-price-col">
                <span className="ap-price-tiny">Sticker Price</span>
                <span className={`ap-price-num ${isFraud ? "price-strike" : ""}`}>
                  ₹{product.mrpSticker}
                </span>
              </div>
              <span className="price-arrow">→</span>
              <div className="ap-price-col" style={{ textAlign:"right" }}>
                <span className="ap-price-tiny">Actual MRP</span>
                <span className="ap-price-num price-ok">₹{product.mrpActual}</span>
              </div>
            </div>
            {isFraud ? (
              <div className="ap-price-verdict verdict-fraud">
                <AlertTriangle size={13} />
                Price inflated by ₹{product.mrpSticker - product.mrpActual}
                {" "}(+{(((product.mrpSticker - product.mrpActual)/product.mrpActual)*100).toFixed(1)}% above MRP)
              </div>
            ) : (
              <div className="ap-price-verdict verdict-ok">
                <ShieldCheck size={13} /> Price looks correct — no tampering detected
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* ── SECTION 2B · HEALTH SCORE ── */}
        <motion.div variants={slideUp}>
          <div className="ap-label lbl-am" style={{ marginBottom:10 }}>
            <FlaskConical size={13} strokeWidth={2.5} /> Health Score
          </div>
          <motion.div className="ap-card" whileHover={{ y:-3 }} transition={{ duration:0.2 }}>
            <div className="ap-health-header">
              <span className="ap-health-num">
                {product.healthScore}<span>/10</span>
              </span>
              <div className="ap-bar-track">
                <motion.div
                  className="ap-bar-fill"
                  initial={{ width:0 }}
                  whileInView={{ width:`${product.healthScore * 10}%` }}
                  viewport={{ once:true }}
                  transition={{ duration:1, ease:"easeOut", delay:0.2 }}
                />
              </div>
            </div>
            <div className="ap-ing-grid">
              {/* Bad */}
              <div>
                <div className="ap-ing-group-label ing-bad">
                  <AlertTriangle size={10} /> Watch Out
                </div>
                {product.ingredients.bad.map(ing => (
                  <div key={ing} className="ap-ing-pill bad">
                    <span className="mark">✕</span> {ing}
                  </div>
                ))}
              </div>
              {/* Good */}
              <div>
                <div className="ap-ing-group-label ing-good">
                  <Leaf size={10} /> Good Stuff
                </div>
                {product.ingredients.good.map(ing => (
                  <div key={ing} className="ap-ing-pill good">
                    <span className="mark">✓</span> {ing}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── SECTION 2C · SMART ALTERNATIVE ── */}
        <motion.div variants={slideUp}>
          <div className="ap-label lbl-vio" style={{ marginBottom:10 }}>
            <TrendingDown size={13} strokeWidth={2.5} /> Smart Alternative
          </div>
          <motion.div className="ap-card ap-alt-card" whileHover={{ y:-4 }} transition={{ duration:0.2 }}>
            <div className="ap-alt-inner">
              <div className="ap-alt-emoji">{product.alternative.emoji}</div>
              <div className="ap-alt-info">
                <p className="ap-alt-sub">Same taste, better value</p>
                <p className="ap-alt-name">{product.alternative.name}</p>
                <p className="ap-alt-brand">{product.alternative.brand}</p>
              </div>
              <div className="ap-alt-right">
                <p className="ap-alt-saving">₹{product.alternative.savings} cheaper</p>
                <p className="ap-alt-hs">Health {product.alternative.healthScore}/10</p>
              </div>
              <ChevronRight size={15} style={{ color:"rgba(255,255,255,0.2)", flexShrink:0 }} />
            </div>
          </motion.div>
        </motion.div>

        {/* ── SECTION 3 · COMMUNITY REVIEWS ── */}
        <motion.div variants={slideUp}>
          <div className="ap-label lbl-blue" style={{ marginBottom:14 }}>
            <Users size={13} strokeWidth={2.5} /> Community Reviews
          </div>

          {/* City filter */}
          <div className="ap-city-row">
            {["All India", ...product.reviews.cities].map(city => (
              <motion.button key={city}
                whileTap={{ scale:0.95 }}
                onClick={() => setCityFilter(city)}
                className={`ap-city-btn ${cityFilter === city ? "active" : "inactive"}`}>
                {city !== "All India" && <MapPin size={9} />}
                {city}
              </motion.button>
            ))}
          </div>

          {/* AI Verdict */}
          <AnimatePresence mode="wait">
            <motion.div key={cityFilter} className="ap-verdict"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.3 }}>
              <div className="ap-verdict-icon">
                <Sparkles size={13} style={{ color:"#7ab8ff" }} />
              </div>
              <div>
                <p className="ap-verdict-label">AI Verdict · {cityFilter}</p>
                <p className="ap-verdict-text">{verdict}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sentiment bar */}
          <div className="ap-sentiment-row">
            <div className="ap-sent-bar">
              <div className="ap-sent-em"  style={{ width:`${(goodCount/total)*100}%`, minWidth:goodCount?4:0 }} />
              <div className="ap-sent-am"  style={{ width:`${(midCount/total)*100}%` }} />
              <div className="ap-sent-red" />
            </div>
            <span className="ap-sent-count">
              {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Review cards */}
          <AnimatePresence>
            {filteredReviews.map((r, i) => (
              <motion.div key={r.id} className="ap-review"
                style={{ marginBottom:10 }}
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                exit={{ opacity:0, y:-10 }}
                transition={{ duration:0.35, delay:i * 0.06 }}>
                <div className="ap-review-top">
                  <div>
                    <div className="ap-review-user">
                      {r.user}
                      {r.verified && <BadgeCheck size={13} className="ap-verified" />}
                    </div>
                    <div className="ap-review-meta">
                      <Stars count={r.stars} />
                      <span className="ap-review-city"><MapPin size={9} />{r.city}</span>
                    </div>
                  </div>
                  <ThumbsUp size={14} className="ap-thumb" />
                </div>
                <p className="ap-review-text">{r.text}</p>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredReviews.length === 0 && (
            <motion.div className="ap-empty" initial={{ opacity:0 }} animate={{ opacity:1 }}>
              <MessageSquare size={28} style={{ opacity:0.3 }} />
              No reviews yet for {cityFilter}
            </motion.div>
          )}
        </motion.div>

        {/* ── SECTION 4 · SCAN HISTORY ── */}
        <motion.div variants={slideUp}>
          <div className="ap-label lbl-em" style={{ marginBottom: 14 }}>
            <BadgeCheck size={13} strokeWidth={2.5} /> Scan History
          </div>
          <div className="ap-hist-list">
            {MOCK_HISTORY.map(item => (
              <HistoryCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div variants={slideUp}>
          <motion.button className="ap-cta" onClick={onBack}
            whileTap={{ scale:0.95 }} whileHover={{ y:-2 }}>
            <Zap size={17} /> Scan Another Product
          </motion.button>
        </motion.div>

      </motion.div>
    </div>
  );
}
