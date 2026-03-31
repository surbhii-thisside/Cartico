import { useEffect, useRef } from "react";

/**
 * DataStreamBg — A beautiful, interactive node mesh animation.
 * Represents "data analysis" connecting different data points (ingredients, prices, reviews).
 * Colors: Emerald (#10b981), Amber (#f59e0b), and Soft Blue/Gray.
 */
export default function DataStreamBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width, height;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Mouse tracking for interaction ──
    const mouse = { x: -9999, y: -9999 };
    const onMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseleave", onLeave);

    // ── Particle setup ──
    const COLORS = ["#10b981", "#34d399", "#f59e0b", "#7ab8ff", "#ffffff"];
    const PARTICLE_COUNT = Math.min(Math.floor(window.innerWidth / 15), 80);
    const CONNECTION_RADIUS = 140;

    let particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // ── Animation Loop ──
    let raf;
    function draw() {
      // Clear with dark navy gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#030818");
      grad.addColorStop(1, "#0a122e");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges smoothly
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse avoidance/attraction mix
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          p.x += dx * 0.02;
          p.y += dy * 0.02;
        }

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < CONNECTION_RADIUS) {
            const opacity = (1 - dist2 / CONNECTION_RADIUS) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = `${p.color}${(opacity * 255).toString(16).padStart(2, '0').split('.')[0]}`; 
            ctx.lineWidth = 0.8;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Glow effect for nodes near mouse
        if (dist < 100) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.15;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      raf = requestAnimationFrame(draw);
    }
    
    draw();

    return () => {
      cancelAnimationFrame(raf);
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
