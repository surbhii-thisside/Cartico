/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, XCircle, ShoppingCart, Star, Zap, Info } from "lucide-react";
import "../compare.css";

const MOCK_DATA = {
  product1: {
    emoji: "🧴",
    brand: "Unilever",
    model: "Dove Deep Moisture 500ml",
    score: 8.5,
    price: 299,
    buyLink: "https://amazon.in",
    pros: ["Sulphate-free formula", "Dermatologist recommended", "Provides 24hr moisture"],
    cons: ["Slightly more expensive", "Plastic packaging", "Scent is strong for some"],
    bestFor: "Dry & Sensitive Skin",
    specs: [
      { key: "rating", label: "User Rating", val: 4.8, display: "4.8 ★", type: "higher" },
      { key: "weight", label: "Item Weight", val: 500, display: "500 ml", type: "tie" },
      { key: "warranty", label: "Shelf Life", val: 24, display: "24 months", type: "higher" },
      { key: "chemical", label: "Harsh Chemicals", val: 0, display: "Zero (Safe)", type: "lower" },
    ]
  },
  product2: {
    emoji: "🌿",
    brand: "Nivea",
    model: "Nivea Nourishing Body Milk 500ml",
    score: 7.2,
    price: 249,
    buyLink: "https://amazon.in",
    pros: ["Almond oil enriched", "Very affordable", "Classic trusted scent"],
    cons: ["Contains some parabens", "Can feel sticky in summer", "Not fully vegan"],
    bestFor: "Normal Skin Types",
    specs: [
      { key: "rating", label: "User Rating", val: 4.5, display: "4.5 ★", type: "higher" },
      { key: "weight", label: "Item Weight", val: 500, display: "500 ml", type: "tie" },
      { key: "warranty", label: "Shelf Life", val: 36, display: "36 months", type: "higher" },
      { key: "chemical", label: "Harsh Chemicals", val: 2, display: "2 flagged", type: "lower" },
    ]
  }
};

// eslint-disable-next-line react/prop-types
export default function ComparePage({ onBack }) {
  const p1 = MOCK_DATA.product1;
  const p2 = MOCK_DATA.product2;

  const anim = {
    hidden: { opacity: 0, y: 30 },
    show: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    })
  };

  // Helper to determine winner class
  const getWinnerClass = (val1, val2, type, position) => {
    if (type === "tie") return "cmp-spec-tie";
    if (val1 === val2) return "cmp-spec-tie";
    
    const p1Wins = type === "higher" ? val1 > val2 : val1 < val2;
    
    if (position === 1) return p1Wins ? "cmp-spec-winner" : "cmp-spec-loser";
    return p1Wins ? "cmp-spec-loser" : "cmp-spec-winner";
  };

  return (
    <div className="cmp-page">
      <div className="cmp-container">
        
        {/* Top Bar */}
        <div className="cmp-top-bar">
          <button className="cmp-back" onClick={onBack}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="cmp-title">Compare</div>
          <div style={{ width: 80 }}></div> {/* Spacer for centering */}
        </div>

        {/* --- DESKTOP VIEW --- */}
        <div className="cmp-desktop-view">
          {/* Sticky Header Row */}
        <motion.div 
          className="cmp-sticky-header"
          initial="hidden" animate="show" custom={0} variants={anim}
        >
          <div className="cmp-product-grid">
            {/* Slot 1 */}
            <div className="cmp-header-slot">
              <div className="cmp-image-wrap cmp-sapphire-glow">{p1.emoji}</div>
              <div className="cmp-brand">{p1.brand}</div>
              <div className="cmp-model">{p1.model}</div>
              <div className="cmp-score-tag"><Zap size={14} /> Cartico Score: {p1.score}/10</div>
              <div className="cmp-price-row">
                <span className="cmp-price">₹{p1.price}</span>
                <button className="cmp-buy-btn" onClick={() => window.open(p1.buyLink, '_blank')}>
                  <ShoppingCart size={14} /> Buy Now
                </button>
              </div>
            </div>

            {/* Slot 2 */}
            <div className="cmp-header-slot">
              <div className="cmp-image-wrap cmp-forest-glow">{p2.emoji}</div>
              <div className="cmp-brand">{p2.brand}</div>
              <div className="cmp-model">{p2.model}</div>
              <div className="cmp-score-tag"><Zap size={14} /> Cartico Score: {p2.score}/10</div>
              <div className="cmp-price-row">
                <span className="cmp-price">₹{p2.price}</span>
                <button className="cmp-buy-btn" onClick={() => window.open(p2.buyLink, '_blank')}>
                  <ShoppingCart size={14} /> Buy Now
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Summary Section */}
        <motion.div initial="hidden" animate="show" custom={1} variants={anim}>
          <div className="cmp-section-title">Analysis Summary</div>
          <div className="cmp-summary-grid">
            
            {/* Summary Product 1 */}
            <div className="cmp-summary-card">
              <div className="cmp-best-for">
                <div className="cmp-best-for-lbl">Best For</div>
                <div className="cmp-best-for-val">{p1.bestFor}</div>
              </div>
              <div className="cmp-list">
                <div className="cmp-list-title cmp-pro-title"><CheckCircle2 size={16} /> Top 3 Pros</div>
                {p1.pros.map((pro, idx) => (
                  <div key={idx} className="cmp-li">
                    <CheckCircle2 size={14} color="var(--cmp-win)" className="cmp-li-icon" /> {pro}
                  </div>
                ))}
              </div>
              <div className="cmp-list" style={{ marginBottom: 0 }}>
                <div className="cmp-list-title cmp-con-title"><XCircle size={16} /> Top 3 Cons</div>
                {p1.cons.map((con, idx) => (
                  <div key={idx} className="cmp-li">
                    <XCircle size={14} color="var(--cmp-lose)" className="cmp-li-icon" /> {con}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Product 2 */}
            <div className="cmp-summary-card">
              <div className="cmp-best-for">
                <div className="cmp-best-for-lbl">Best For</div>
                <div className="cmp-best-for-val">{p2.bestFor}</div>
              </div>
              <div className="cmp-list">
                <div className="cmp-list-title cmp-pro-title"><CheckCircle2 size={16} /> Top 3 Pros</div>
                {p2.pros.map((pro, idx) => (
                  <div key={idx} className="cmp-li">
                    <CheckCircle2 size={14} color="var(--cmp-win)" className="cmp-li-icon" /> {pro}
                  </div>
                ))}
              </div>
              <div className="cmp-list" style={{ marginBottom: 0 }}>
                <div className="cmp-list-title cmp-con-title"><XCircle size={16} /> Top 3 Cons</div>
                {p2.cons.map((con, idx) => (
                  <div key={idx} className="cmp-li">
                    <XCircle size={14} color="var(--cmp-lose)" className="cmp-li-icon" /> {con}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Specs Table */}
        <motion.div initial="hidden" animate="show" custom={2} variants={anim}>
          <div className="cmp-section-title">Technical Specifications</div>
          <div className="cmp-specs-table">
            {p1.specs.map((spec1, idx) => {
              const spec2 = p2.specs.find(s => s.label === spec1.label);
              
              const p1Class = getWinnerClass(spec1.val, spec2.val, spec1.type, 1);
              const p2Class = getWinnerClass(spec1.val, spec2.val, spec1.type, 2);

              return (
                <div className="cmp-spec-row" key={idx}>
                  <div className="cmp-spec-label"><Info size={14} style={{ marginRight: 6, opacity: 0.5, verticalAlign: 'text-bottom' }}/> {spec1.label}</div>
                  <div className={`cmp-spec-val ${p1Class}`}>
                    <div className="cmp-spec-badge">{spec1.display}</div>
                  </div>
                  <div className={`cmp-spec-val ${p2Class}`}>
                    <div className="cmp-spec-badge">{spec2.display}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
        </div> {/* End Desktop View */}

        {/* --- MOBILE VIEW --- */}
        <div className="cmp-mobile-view">
          {[p1, p2].map((p, pIndex) => (
            <div className="cmp-mobile-product" key={pIndex}>
              {/* Header */}
              <div className="cmp-header-slot">
                <div className={`cmp-image-wrap ${pIndex === 0 ? 'cmp-sapphire-glow' : 'cmp-forest-glow'}`}>{p.emoji}</div>
                <div className="cmp-brand">{p.brand}</div>
                <div className="cmp-model">{p.model}</div>
                <div className="cmp-score-tag"><Zap size={14} /> Cartico Score: {p.score}/10</div>
                <div className="cmp-price-row">
                  <span className="cmp-price">₹{p.price}</span>
                  <button className="cmp-buy-btn" onClick={() => window.open(p.buyLink, '_blank')}>
                    <ShoppingCart size={14} /> Buy Now
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="cmp-summary-card">
                <div className="cmp-best-for">
                  <div className="cmp-best-for-lbl">Best For</div>
                  <div className="cmp-best-for-val">{p.bestFor}</div>
                </div>
                <div className="cmp-list">
                  <div className="cmp-list-title cmp-pro-title"><CheckCircle2 size={16} /> Top 3 Pros</div>
                  {p.pros.map((pro, idx) => (
                    <div key={idx} className="cmp-li">
                      <CheckCircle2 size={14} color="var(--cmp-win)" className="cmp-li-icon" /> {pro}
                    </div>
                  ))}
                </div>
                <div className="cmp-list" style={{ marginBottom: 0 }}>
                  <div className="cmp-list-title cmp-con-title"><XCircle size={16} /> Top 3 Cons</div>
                  {p.cons.map((con, idx) => (
                    <div key={idx} className="cmp-li">
                      <XCircle size={14} color="var(--cmp-lose)" className="cmp-li-icon" /> {con}
                    </div>
                  ))}
                </div>
              </div>

              {/* Specs */}
              <div className="cmp-specs-table">
                {p.specs.map((spec, idx) => {
                  return (
                    <div className="cmp-spec-row cmp-spec-row-mobile" key={idx}>
                      <div className="cmp-spec-label"><Info size={14} style={{ marginRight: 6, opacity: 0.5, verticalAlign: 'text-bottom' }}/> {spec.label}</div>
                      <div className="cmp-spec-val">
                        <div className="cmp-spec-badge">{spec.display}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {pIndex === 0 && <div className="cmp-vs-divider">VS</div>}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
