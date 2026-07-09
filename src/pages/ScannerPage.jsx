import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../scanner.css";
import API from "../api";

// ─── Circuit Board Canvas Background ─────────────────────────────────────────
function CircuitBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const CELL = 60;
    const LINE_COLOR = "rgba(60, 130, 255, 0.18)";
    const GLOW_COLOR = "rgba(80, 160, 255, 0.55)";
    const DOT_COLOR = "rgba(180, 230, 255, 1)";

    function buildCircuits() {
      const segments = [];
      const cols = Math.ceil(canvas.width / CELL) + 1;
      const rows = Math.ceil(canvas.height / CELL) + 1;

      for (let r = 0; r < rows; r++) {
        let c = 0;
        while (c < cols) {
          if (Math.random() < 0.45) {
            const len = 2 + Math.floor(Math.random() * 6);
            segments.push({
              x1: c * CELL, y1: r * CELL,
              x2: Math.min((c + len) * CELL, canvas.width), y2: r * CELL,
              dir: "h",
            });
            c += len + 1;
          } else {
            c++;
          }
        }
      }
      for (let c = 0; c < cols; c++) {
        let r = 0;
        while (r < rows) {
          if (Math.random() < 0.35) {
            const len = 2 + Math.floor(Math.random() * 5);
            segments.push({
              x1: c * CELL, y1: r * CELL,
              x2: c * CELL, y2: Math.min((r + len) * CELL, canvas.height),
              dir: "v",
            });
            r += len + 1;
          } else {
            r++;
          }
        }
      }
      return segments;
    }

    class Pulse {
      constructor(segs) {
        this.segs = segs;
        this.reset();
      }
      reset() {
        const seg = this.segs[Math.floor(Math.random() * this.segs.length)];
        this.x1 = seg.x1; this.y1 = seg.y1;
        this.x2 = seg.x2; this.y2 = seg.y2;
        this.t = 0;
        this.speed = 0.004 + Math.random() * 0.006;
        this.len = 0.12 + Math.random() * 0.1;
      }
      update() {
        this.t += this.speed;
        if (this.t > 1 + this.len) this.reset();
      }
      draw(ctx) {
        const t0 = Math.max(0, this.t - this.len);
        const t1 = Math.min(1, this.t);
        if (t0 >= t1) return;

        const lx1 = this.x1 + (this.x2 - this.x1) * t0;
        const ly1 = this.y1 + (this.y2 - this.y1) * t0;
        const lx2 = this.x1 + (this.x2 - this.x1) * t1;
        const ly2 = this.y1 + (this.y2 - this.y1) * t1;

        ctx.save();
        ctx.shadowColor = GLOW_COLOR;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = GLOW_COLOR;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();

        const headT = Math.min(1, this.t);
        const hx = this.x1 + (this.x2 - this.x1) * headT;
        const hy = this.y1 + (this.y2 - this.y1) * headT;
        ctx.shadowBlur = 18;
        ctx.shadowColor = DOT_COLOR;
        ctx.fillStyle = DOT_COLOR;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let segments = buildCircuits();
    const PULSE_COUNT = Math.floor((canvas.width * canvas.height) / 18000);
    let pulses = Array.from({ length: PULSE_COUNT }, () => new Pulse(segments));

    const handleResize = () => {
      resize();
      segments = buildCircuits();
      pulses = Array.from({ length: Math.floor((canvas.width * canvas.height) / 18000) },
        () => new Pulse(segments));
    };
    window.addEventListener("resize", handleResize);

    function drawCircuits() {
      ctx.save();
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(60,130,255,0.15)";
      ctx.shadowBlur = 4;
      segments.forEach((s) => {
        ctx.beginPath();
        ctx.moveTo(s.x1, s.y1);
        ctx.lineTo(s.x2, s.y2);
        ctx.stroke();

        ctx.fillStyle = "rgba(80,160,255,0.28)";
        ctx.beginPath();
        ctx.arc(s.x1, s.y1, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x2, s.y2, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
    }

    let rafId;
    function draw() {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#050a1a");
      grad.addColorStop(0.4, "#060c22");
      grad.addColorStop(1, "#08102e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawCircuits();
      pulses.forEach((p) => { p.update(); p.draw(ctx); });

      rafId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} id="circuit-canvas" />;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

function BarcodeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="3" height="16" rx="0.5" />
      <rect x="7" y="4" width="1.5" height="16" rx="0.5" />
      <rect x="10.5" y="4" width="3" height="16" rx="0.5" />
      <rect x="15.5" y="4" width="1.5" height="16" rx="0.5" />
      <rect x="19" y="4" width="3" height="16" rx="0.5" />
    </svg>
  );
}

// ─── Main Scanner Page ────────────────────────────────────────────────────────
export default function ScannerPage({ onBack, onProductScanned }) {
  const [query, setQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    const barcode = query.trim();
    if (!barcode) return;

    setError("");
    setLoading(true);
    try {
      const res = await API.get(`/api/product/${barcode}`);

      // Save this scan to history (fire-and-forget — don't block navigation if it fails)
      const userId = localStorage.getItem("userId");
      if (userId) {
        API.post("/api/dashboard/scan", {
          userId,
          barcode,
          productName: res.data.name,
        }).catch(() => {}); // silently ignore save errors, not critical to user flow
      }

      onProductScanned(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Product not found. Try a different barcode.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleScanClick = () => {
    setIsScanning((prev) => !prev);
    // TODO: Initialise barcode scanning library here (QuaggaJS / ZXing)
  };

  return (
    <>
      <CircuitBg />

      <div className="scanner-page">
        <motion.header className="sp-header"
          variants={fadeUp} custom={0} initial="hidden" animate="visible">
          <button className="sp-back" onClick={onBack} aria-label="Go back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </button>
          <div className="sp-logo">Cartico</div>
          <div className="sp-header-right" />
        </motion.header>

        <motion.div className="sp-search-wrap"
          variants={fadeUp} custom={1} initial="hidden" animate="visible">
          <form className="sp-search-form" onSubmit={handleSearch}>
            <button type="button" className="sp-scan-btn" onClick={handleScanClick} title="Scan Barcode">
              <BarcodeIcon />
            </button>
            <input className="sp-search-input" type="text"
              placeholder="Search product name or paste barcode…"
              value={query} onChange={(e) => setQuery(e.target.value)} autoComplete="off" />
            <button type="submit" className="sp-search-submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
          {error && <p className="sp-search-hint" style={{ color: "#ff7a92" }}>{error}</p>}
          <p className="sp-search-hint">
            Tip: Scan any barcode or type a product name to get instant insights.
          </p>
        </motion.div>

        <motion.div className="sp-viewfinder-wrap"
          variants={fadeUp} custom={0}
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
          <div className={`sp-viewfinder${isScanning ? " sp-vf-active" : ""}`}>
            <span className="vf-corner vf-tl" />
            <span className="vf-corner vf-tr" />
            <span className="vf-corner vf-bl" />
            <span className="vf-corner vf-br" />
            {isScanning && <div className="vf-scan-line" />}
            <div className="vf-center">
              {isScanning ? (
                <div className="vf-live-badge">
                  <span className="vf-pulse" /> Live Scanning…
                </div>
              ) : (
                <>
                  <div className="vf-icon">⊡</div>
                  <p className="vf-hint">
                    Tap the barcode icon in the search bar<br />to activate your camera
                  </p>
                </>
              )}
            </div>
            <div className="vf-label">
              {isScanning
                ? "Point camera at any product barcode or QR code"
                : "Camera viewfinder will appear here"}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}