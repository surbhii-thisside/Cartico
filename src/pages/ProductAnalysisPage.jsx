import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Zap, Sparkles, AlertCircle, FlaskConical,
  TrendingDown, Users, BadgeCheck, ScanSearch,
} from "lucide-react";
import "../analysis.css";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Coming Soon placeholder card ─────────────────────────────────────────────
function ComingSoon({ icon: Icon, label, note }) {
  return (
    <motion.div variants={slideUp}>
      <div className="ap-label lbl-blue" style={{ marginBottom: 10 }}>
        <Icon size={13} strokeWidth={2.5} /> {label}
      </div>
      <motion.div className="ap-card" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}
        style={{ textAlign: "center", padding: "28px 16px", opacity: 0.7 }}>
        <Sparkles size={22} style={{ opacity: 0.4, marginBottom: 8 }} />
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>{note}</p>
        <span style={{
          display: "inline-block", marginTop: 10, fontSize: 10, fontWeight: 700,
          padding: "4px 12px", borderRadius: 20, background: "rgba(77,159,255,0.1)",
          color: "#7ab8ff", border: "1px solid rgba(77,159,255,0.2)",
        }}>Coming Soon</span>
      </motion.div>
    </motion.div>
  );
}

// ─── Empty state (no product scanned yet) ─────────────────────────────────────
function EmptyState({ onBack }) {
  return (
    <div className="ap-page page-results">
      <div className="ap-bar">
        <motion.button className="ap-back" onClick={onBack} whileTap={{ scale: 0.95 }}>
          <ArrowLeft size={14} /> Back
        </motion.button>
        <span className="ap-bar-title">Product Analysis</span>
        <div className="ap-bar-spacer" />
      </div>
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <ScanSearch size={36} style={{ opacity: 0.3, marginBottom: 12 }} />
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
          No product scanned yet. Go to Scanner and search a barcode first.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function ProductAnalysisPage({ onBack, product }) {
  if (!product) return <EmptyState onBack={onBack} />;

  const gradeColor = {
    a: "#10b981", b: "#84cc16", c: "#f59e0b", d: "#f97316", e: "#ef4444",
  }[product.nutritionGrade?.toLowerCase()] || "#7ab8ff";

  return (
    <div className="ap-page page-results" style={{ position: "relative" }}>
      <div style={{ position: "relative", zIndex: 1 }}>

        <div className="ap-bar">
          <motion.button className="ap-back" onClick={onBack} whileTap={{ scale: 0.95 }}>
            <ArrowLeft size={14} /> Back
          </motion.button>
          <span className="ap-bar-title">Product Analysis</span>
          <div className="ap-bar-spacer" />
        </div>

        <motion.div className="ap-body" variants={container} initial="hidden" animate="visible">

          {/* ── IDENTITY (real data) ── */}
          <motion.div variants={slideUp} className="ap-card">
            <div className="ap-identity">
              <div style={{ flex: 1, minWidth: 0 }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name}
                    style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12, marginBottom: 12, background: "rgba(255,255,255,0.04)" }} />
                ) : (
                  <div className="ap-emoji-box" style={{ marginBottom: 12 }}>📦</div>
                )}
                <h1 className="ap-prod-name">{product.name}</h1>
                <p className="ap-prod-brand">{product.brand} · {product.category}</p>
                {product.quantity && product.quantity !== "N/A" && (
                  <p className="ap-prod-brand" style={{ marginTop: 2 }}>{product.quantity}</p>
                )}
              </div>
              {product.nutritionGrade && product.nutritionGrade !== "N/A" && (
                <div style={{ textAlign: "center" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    border: `2px solid ${gradeColor}`, color: gradeColor,
                    fontFamily: "Orbitron, sans-serif", fontSize: 22, fontWeight: 700,
                  }}>
                    {product.nutritionGrade.toUpperCase()}
                  </div>
                  <p style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>Nutri-Score</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── INGREDIENTS (real data, raw text) ── */}
          {product.ingredients && product.ingredients !== "Not available" && (
            <motion.div variants={slideUp}>
              <div className="ap-label lbl-am" style={{ marginBottom: 10 }}>
                <FlaskConical size={13} strokeWidth={2.5} /> Ingredients
              </div>
              <motion.div className="ap-card" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  {product.ingredients}
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* ── NOT-YET-BUILT FEATURES ── */}
          <ComingSoon icon={AlertCircle} label="Fake Price Detector"
            note="MRP fraud detection is being built — hang tight!" />

          <ComingSoon icon={FlaskConical} label="Health Score"
            note="AI-powered ingredient scoring is on the way." />

          <ComingSoon icon={TrendingDown} label="Smart Alternative"
            note="Cheaper/healthier product suggestions coming soon." />

          <ComingSoon icon={Users} label="Community Reviews"
            note="Real user reviews for this product will appear here." />

          <ComingSoon icon={BadgeCheck} label="Scan History"
            note="Your past scans will show up here once connected." />

          {/* ── CTA ── */}
          <motion.div variants={slideUp}>
            <motion.button className="ap-cta" onClick={onBack}
              whileTap={{ scale: 0.95 }} whileHover={{ y: -2 }}>
              <Zap size={17} /> Scan Another Product
            </motion.button>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}