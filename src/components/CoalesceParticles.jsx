import { useEffect, useRef } from "react";

/**
 * CoalesceParticles — Canvas-based particle engine
 * Reference: Coalesce visual — small squares & diamond tech-fragments
 * rotating & drifting in 3D-axis, mouse-reactive (disperse/coalesce).
 * Background: Dark Charcoal → Emerald Moss linear gradient.
 */
export default function CoalesceParticles() {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // ── Resize ──────────────────────────────────────────────────
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse tracking ──────────────────────────────────────────
    const onMouse = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    // ── Particle colour palette (matches Coalesce reference) ───
    const COLORS = [
      // Yellows / golds
      "rgba(255,210,60,",   "rgba(240,190,40,",   "rgba(255,230,100,",
      // Greens
      "rgba(80,200,120,",   "rgba(50,180,100,",   "rgba(100,220,140,",
      // Reds / orange
      "rgba(220,80,60,",    "rgba(200,100,50,",
      // Whites (tiny)
      "rgba(255,255,255,",
    ];

    // ── Particle factory ────────────────────────────────────────
    const COUNT = 220;

    function mkParticle() {
      const isDiamond = Math.random() < 0.4; // 40% diamond, 60% square
      const depth     = 0.3 + Math.random() * 0.7; // z-depth 0..1
      const size      = (isDiamond ? 4 : 3) + Math.random() * 8 * depth;
      const color     = COLORS[Math.floor(Math.random() * COLORS.length)];
      const alpha     = 0.25 + Math.random() * 0.65;

      return {
        x:   Math.random() * window.innerWidth,
        y:   Math.random() * window.innerHeight,
        vx:  (Math.random() - 0.5) * 0.35 * depth,
        vy:  (Math.random() - 0.5) * 0.35 * depth,
        size,
        rot:    Math.random() * Math.PI * 2,
        rotSpd: (Math.random() - 0.5) * 0.012 * (isDiamond ? 1.4 : 0.7),
        color,
        alpha,
        baseAlpha: alpha,
        isDiamond,
        depth,
        // glow radius
        glowR: size * (0.8 + Math.random() * 1.2),
      };
    }

    let particles = Array.from({ length: COUNT }, mkParticle);

    // ── Draw helpers ────────────────────────────────────────────
    function drawSquare(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const s = p.size;

      // Glow
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.glowR);
      grd.addColorStop(0,   p.color + (p.alpha * 0.5).toFixed(2) + ")");
      grd.addColorStop(1,   p.color + "0)");
      ctx.fillStyle = grd;
      ctx.fillRect(-p.glowR, -p.glowR, p.glowR * 2, p.glowR * 2);

      // Border only (open square) — matches reference image
      ctx.strokeStyle = p.color + p.alpha.toFixed(2) + ")";
      ctx.lineWidth   = 1 + p.depth * 0.8;
      ctx.strokeRect(-s / 2, -s / 2, s, s);

      ctx.restore();
    }

    function drawDiamond(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot + Math.PI / 4); // 45° = diamond

      const s = p.size;

      // Glow
      const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, p.glowR);
      grd.addColorStop(0,   p.color + (p.alpha * 0.45).toFixed(2) + ")");
      grd.addColorStop(1,   p.color + "0)");
      ctx.fillStyle = grd;
      ctx.fillRect(-p.glowR, -p.glowR, p.glowR * 2, p.glowR * 2);

      // Border only
      ctx.strokeStyle = p.color + p.alpha.toFixed(2) + ")";
      ctx.lineWidth   = 0.8 + p.depth * 0.6;
      ctx.strokeRect(-s / 2, -s / 2, s, s);

      ctx.restore();
    }

    // ── Animation loop ──────────────────────────────────────────
    const MOUSE_RADIUS  = 180;
    const MOUSE_FORCE   = 0.012; // disperse strength
    const FRICTION      = 0.985;

    function tick() {
      const W = canvas.width;
      const H = canvas.height;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Background: charcoal → emerald moss
      const bgGrad = ctx.createLinearGradient(0, 0, W * 0.6, H);
      bgGrad.addColorStop(0,   "#111820");
      bgGrad.addColorStop(0.5, "#0d1c14");
      bgGrad.addColorStop(1,   "#0a1a10");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Subtle vignette
      const vign = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.85);
      vign.addColorStop(0, "rgba(0,0,0,0)");
      vign.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.fillStyle = vign;
      ctx.fillRect(0, 0, W, H);

      // Update & draw particles
      for (const p of particles) {
        // Mouse interaction — disperse outward
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
          const nx = dx / dist;
          const ny = dy / dist;
          p.vx += nx * force * 4.5;
          p.vy += ny * force * 4.5;
          // Brighten nearby particles
          p.alpha = Math.min(p.baseAlpha * 1.5, 0.95);
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.03; // recover
        }

        // Move
        p.vx *= FRICTION;
        p.vy *= FRICTION;
        p.x  += p.vx;
        p.y  += p.vy;
        p.rot += p.rotSpd;

        // Wrap edges
        if (p.x < -30) p.x = W + 30;
        if (p.x > W + 30) p.x = -30;
        if (p.y < -30) p.y = H + 30;
        if (p.y > H + 30) p.y = -30;

        // Draw
        if (p.isDiamond) drawDiamond(p);
        else             drawSquare(p);
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
