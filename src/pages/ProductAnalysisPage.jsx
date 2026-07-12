import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Zap, Sparkles, AlertCircle, FlaskConical,
  TrendingDown, Users, BadgeCheck, ScanSearch, HeartPulse,
} from "lucide-react";
import "../analysis.css";
import API from "../api";

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Health Score keyword logic ────────────────────────────────────────────
// Simple keyword-based scoring, NOT real AI — matches project plan.
const BAD_INGREDIENTS = [
  { id: "msg", keywords: ["msg", "monosodium glutamate"], label: "MSG", explain: "Flavor enhancer that can trigger headaches or sensitivity reactions in some people.", weight: 1.5 },
  { id: "palm_oil", keywords: ["palm oil"], label: "Palm Oil", explain: "High in saturated fat; linked to cholesterol concerns and environmental impact.", weight: 1 },
  { id: "maida", keywords: ["maida", "refined flour"], label: "Refined Flour (Maida)", explain: "Stripped of fiber and nutrients during processing; spikes blood sugar quickly.", weight: 1 },
  { id: "hfcs", keywords: ["high fructose corn syrup"], label: "High Fructose Corn Syrup", explain: "Linked to obesity, fatty liver, and metabolic issues with regular consumption.", weight: 1.5 },
  { id: "trans_fat", keywords: ["hydrogenated", "trans fat"], label: "Trans Fat / Hydrogenated Oil", explain: "Raises bad cholesterol (LDL) and increases heart disease risk.", weight: 2 },
  { id: "artificial_color", keywords: ["artificial color", "artificial colour"], label: "Artificial Color", explain: "Some synthetic dyes have been linked to hyperactivity, especially in children.", weight: 1 },
  { id: "artificial_flavor", keywords: ["artificial flavor", "artificial flavour"], label: "Artificial Flavor", explain: "Synthetic flavoring compound with no nutritional value.", weight: 0.5 },
  { id: "sodium_benzoate", keywords: ["sodium benzoate"], label: "Sodium Benzoate", explain: "Preservative that can form benzene (a known carcinogen) when combined with vitamin C.", weight: 1 },
  { id: "aspartame", keywords: ["aspartame"], label: "Aspartame", explain: "Artificial sweetener with long-debated, still-controversial long-term health effects.", weight: 1 },
  { id: "preservative", keywords: ["preservative"], label: "Preservatives", explain: "Extends shelf life but generally signals a more processed product.", weight: 0.5 },
  { id: "sodium_nitrite", keywords: ["sodium nitrite"], label: "Sodium Nitrite", explain: "Common in processed meats; linked to increased cancer risk with regular intake.", weight: 1.5 },
  { id: "added_sugar", keywords: ["sugar", "corn syrup", "glucose syrup", "fructose"], label: "Added Sugar", explain: "Excess added sugar contributes to weight gain, diabetes risk, and tooth decay.", weight: 1 },
];

const GOOD_INGREDIENTS = [
  { id: "whole_grain", keywords: ["whole wheat", "whole grain"], label: "Whole Grain", explain: "Retains fiber and nutrients that refined grains lose in processing.", weight: 1 },
  { id: "fiber", keywords: ["fiber", "fibre"], label: "Fiber", explain: "Aids digestion and helps keep blood sugar levels steady.", weight: 1 },
  { id: "protein", keywords: ["protein"], label: "Protein", explain: "Supports muscle repair and helps you feel full longer.", weight: 1 },
  { id: "vitamin", keywords: ["vitamin"], label: "Vitamins", explain: "Essential micronutrients that support overall body function.", weight: 0.8 },
  { id: "iron", keywords: ["iron"], label: "Iron", explain: "Important for healthy blood and maintaining energy levels.", weight: 0.8 },
  { id: "calcium", keywords: ["calcium"], label: "Calcium", explain: "Supports bone and teeth health.", weight: 0.8 },
  { id: "oats", keywords: ["oats"], label: "Oats", explain: "Whole grain with good fiber content and slow-release energy.", weight: 1 },
  { id: "herbs", keywords: ["herbs"], label: "Herbs", explain: "Natural flavoring, generally free of synthetic additives.", weight: 0.5 },
  { id: "natural", keywords: ["natural"], label: "Natural Ingredients", explain: "Suggests fewer synthetic additives (though labeling standards vary).", weight: 0.3 },
  { id: "millet", keywords: ["millet"], label: "Millet", explain: "Nutrient-dense whole grain and a good fiber source.", weight: 1 },
  { id: "probiotic", keywords: ["probiotic"], label: "Probiotics", explain: "Supports gut health and digestion.", weight: 1 },
];

function computeHealthScore(text) {
  const lower = text.toLowerCase();

  const badMatches = BAD_INGREDIENTS.filter((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  );
  const goodMatches = GOOD_INGREDIENTS.filter((item) =>
    item.keywords.some((kw) => lower.includes(kw))
  );

  const badWeight = badMatches.reduce((sum, item) => sum + item.weight, 0);
  const goodWeight = goodMatches.reduce((sum, item) => sum + item.weight, 0);

  let score = 6 - badWeight + goodWeight;
  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

  let rating = "Poor";
  if (score >= 8) rating = "Excellent";
  else if (score >= 6) rating = "Good";
  else if (score >= 4) rating = "Moderate";

  return { score, rating, badMatches, goodMatches };
}

// ─── Health Score card (real, computed, with full table) ──────────────────
function HealthScoreCard({ ingredientsText }) {
  if (!ingredientsText || ingredientsText === "Not available") {
    return (
      <motion.div variants={slideUp}>
        <div className="ap-label lbl-blue" style={{ marginBottom: 10 }}>
          <HeartPulse size={13} strokeWidth={2.5} /> Health Score
        </div>
        <motion.div className="ap-card" style={{ textAlign: "center", padding: "24px 16px", opacity: 0.6 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
            Not enough ingredient data to calculate a health score.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const { score, rating, badMatches, goodMatches } = computeHealthScore(ingredientsText);

  const scoreColor =
    score >= 8 ? "#10b981" : score >= 6 ? "#84cc16" : score >= 4 ? "#f59e0b" : "#ef4444";

  const allRows = [
    ...badMatches.map((item) => ({ ...item, type: "bad" })),
    ...goodMatches.map((item) => ({ ...item, type: "good" })),
  ];

  return (
    <motion.div variants={slideUp}>
      <div className="ap-label lbl-blue" style={{ marginBottom: 10 }}>
        <HeartPulse size={13} strokeWidth={2.5} /> Health Score
      </div>
      <motion.div className="ap-card" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>

        {/* Score summary */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
          <div style={{
            width: 56, height: 56, borderRadius: "50%", flexShrink: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            border: `2px solid ${scoreColor}`, color: scoreColor,
            fontFamily: "Orbitron, sans-serif", fontSize: 18, fontWeight: 700,
          }}>
            {score}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: scoreColor, marginBottom: 2 }}>
              {rating}
            </p>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
              {badMatches.length} concern{badMatches.length !== 1 ? "s" : ""} found,{" "}
              {goodMatches.length} positive{goodMatches.length !== 1 ? "s" : ""} found —
              based on keyword scan of ingredient list.
            </p>
          </div>
        </div>

        {allRows.length === 0 ? (
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 12 }}>
            No strong flags found either way in the ingredient list.
          </p>
        ) : (
          <div style={{ marginTop: 14, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                  <th style={{ textAlign: "left", padding: "6px 8px", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Ingredient</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Type</th>
                  <th style={{ textAlign: "left", padding: "6px 8px", color: "rgba(255,255,255,0.4)", fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {allRows.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    <td style={{ padding: "8px", color: "rgba(255,255,255,0.85)", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {item.label}
                    </td>
                    <td style={{ padding: "8px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                        background: item.type === "bad" ? "rgba(239,68,68,0.1)" : "rgba(16,185,129,0.1)",
                        color: item.type === "bad" ? "#ef4444" : "#10b981",
                        border: `1px solid ${item.type === "bad" ? "rgba(239,68,68,0.2)" : "rgba(16,185,129,0.2)"}`,
                      }}>
                        {item.type === "bad" ? "Concern" : "Positive"}
                      </span>
                    </td>
                    <td style={{ padding: "8px", color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
                      {item.explain}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

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
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    API.get(`/api/dashboard/${userId}`)
      .then((res) => setScanHistory(res.data.history || []))
      .catch(() => setScanHistory([]));
  }, [product]); // refetch each time a new product is scanned

  if (!product) return <EmptyState onBack={onBack} />;

  const gradeColor = {
    a: "#10b981", b: "#84cc16", c: "#f59e0b", d: "#f97316", e: "#ef4444",
  }[product.nutritionGrade?.toLowerCase()] || "#7ab8ff";

  const ingredientsForScoring = product.ingredientsTranslated || product.ingredients;

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

          {/* ── INGREDIENTS (real data, with translation fallback) ── */}
          {product.ingredients && product.ingredients !== "Not available" && (
            <motion.div variants={slideUp}>
              <div className="ap-label lbl-am" style={{ marginBottom: 10 }}>
                <FlaskConical size={13} strokeWidth={2.5} /> Ingredients
              </div>
              <motion.div className="ap-card" whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
                  {product.ingredients}
                </p>
                {product.ingredientsTranslated && (
                  <>
                    <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "12px 0" }} />
                    <p style={{ fontSize: 10, color: "#7ab8ff", fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
                      English Translation
                    </p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
                      {product.ingredientsTranslated}
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ── NOT-YET-BUILT FEATURES ── */}
          <ComingSoon icon={AlertCircle} label="Fake Price Detector"
            note="MRP fraud detection is being built — hang tight!" />

          <HealthScoreCard ingredientsText={ingredientsForScoring} />

          <ComingSoon icon={TrendingDown} label="Smart Alternative"
            note="Cheaper/healthier product suggestions coming soon." />

          <ComingSoon icon={Users} label="Community Reviews"
            note="Real user reviews for this product will appear here." />

          {/* ── SCAN HISTORY (real data) ── */}
          <motion.div variants={slideUp}>
            <div className="ap-label lbl-em" style={{ marginBottom: 14 }}>
              <BadgeCheck size={13} strokeWidth={2.5} /> Scan History
            </div>
            {scanHistory.length === 0 ? (
              <motion.div className="ap-card" style={{ textAlign: "center", padding: "24px 16px", opacity: 0.6 }}>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  No scans yet — start scanning to build your history!
                </p>
              </motion.div>
            ) : (
              <div className="ap-hist-list">
                {scanHistory.map((item) => (
                  <motion.div key={item._id} className="ap-hist-card" whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
                    <div className="ap-hist-emoji">📦</div>
                    <div className="ap-hist-info">
                      <p className="ap-hist-name">{item.productName}</p>
                      <div className="ap-hist-meta">
                        Barcode: {item.barcode}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

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