"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { scenes, whatsappLink } from "@/lib/content";
import Logo from "./Logo";

const FOCAL = 850;
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function animateValue(setter: (v: number) => void, duration: number) {
  return new Promise<void>((resolve) => {
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setter(easeInOutCubic(t));
      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };
    requestAnimationFrame(step);
  });
}

const nextFrame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function retrigger(el: HTMLElement, cls: string) {
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
}

// Pontos de um retângulo arredondado centrado na origem, 10 passos por canto.
function roundedRectPoints(w: number, h: number, r: number) {
  r = Math.max(0, Math.min(r, w / 2, h / 2));
  const corners: [number, number, number, number][] = [
    [w / 2 - r, -h / 2 + r, -Math.PI / 2, 0],
    [w / 2 - r, h / 2 - r, 0, Math.PI / 2],
    [-w / 2 + r, h / 2 - r, Math.PI / 2, Math.PI],
    [-w / 2 + r, -h / 2 + r, Math.PI, Math.PI * 1.5],
  ];
  const pts: [number, number][] = [];
  for (const [cx, cy, a0, a1] of corners) {
    for (let i = 0; i <= 10; i++) {
      const a = a0 + ((a1 - a0) * i) / 10;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, W: number, H: number) {
  const mw = img.naturalWidth;
  const mh = img.naturalHeight;
  if (!mw || !mh) return;
  const s = Math.max(W / mw, H / mh);
  const w = mw * s;
  const h = mh * s;
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
}

function drawShade(ctx: CanvasRenderingContext2D, W: number, H: number) {
  const g = ctx.createLinearGradient(0, H * 0.52, 0, H);
  g.addColorStop(0, "rgba(13,13,13,0)");
  g.addColorStop(1, "rgba(13,13,13,.88)");
  ctx.fillStyle = g;
  ctx.fillRect(0, H * 0.52, W, H * 0.48);
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const next = (current + 1) % scenes.length;
  const scene = scenes[current];
  const nextScene = scenes[next];

  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const portalRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const preloaderRef = useRef<HTMLDivElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const nextRef = useRef(next);
  nextRef.current = next;
  const firstRender = useRef(true);
  const sceneListRef = useRef<HTMLDivElement>(null);

  const anim = useRef({
    rotX: 0,
    rotY: 0,
    targetX: 0,
    targetY: 0,
    expansion: 0,
    maskScale: 0,
    busy: true,
    W: 0,
    H: 0,
  });

  const revealMask = useCallback(() => {
    const hero = heroRef.current!;
    retrigger(hero, "mask-revealing");
    anim.current.maskScale = 0;
    return animateValue((v) => (anim.current.maskScale = v), 1050);
  }, []);

  const revealContent = useCallback(() => {
    retrigger(heroRef.current!, "content-revealing");
  }, []);

  // Carrega as imagens usadas pelo canvas.
  useEffect(() => {
    images.current = scenes.map((s) => {
      const img = new Image();
      img.decoding = "async";
      img.src = s.image;
      return img;
    });
  }, []);

  // Canvas, inclinação e loop de desenho.
  useEffect(() => {
    const hero = heroRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const a = anim.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const d = Math.min(window.devicePixelRatio || 1, 2);
      a.W = hero.clientWidth;
      a.H = hero.clientHeight;
      canvas.width = a.W * d;
      canvas.height = a.H * d;
      canvas.style.width = `${a.W}px`;
      canvas.style.height = `${a.H}px`;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const onMove = (e: PointerEvent) => {
      if (a.busy || e.pointerType !== "mouse") return;
      const r = hero.getBoundingClientRect();
      a.targetY = ((e.clientX - r.left) / r.width - 0.5) * 37.4;
      a.targetX = ((e.clientY - r.top) / r.height - 0.5) * -33;
    };
    const onLeave = () => {
      a.targetX = 0;
      a.targetY = 0;
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let last = performance.now();
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      const dt = Math.min(40, now - last);
      last = now;
      const heroRect = hero.getBoundingClientRect();
      if (heroRect.bottom < 0 || heroRect.top > window.innerHeight) return;

      const k = reduced ? 1 : Math.min(1, dt * 0.009);
      a.rotX += (a.targetX - a.rotX) * k;
      a.rotY += (a.targetY - a.rotY) * k;

      const { W, H } = a;
      ctx.clearRect(0, 0, W, H);
      const portal = portalRef.current;
      if (!portal) return;
      const rect = portal.getBoundingClientRect();
      const rcx = rect.left - heroRect.left + rect.width / 2;
      const rcy = rect.top - heroRect.top + rect.height / 2;
      const e = a.expansion;
      const cx = rcx + (W / 2 - rcx) * e;
      const cy = rcy + (H / 2 - rcy) * e;
      const baseW = rect.width + (W - rect.width) * e;
      const baseH = rect.height + (H - rect.height) * e;
      const scale = e ? 1 : a.maskScale;
      const w = baseW * scale;
      const h = baseH * scale;
      const radius = parseFloat(getComputedStyle(portal).borderTopLeftRadius) || 90;
      const r = radius * (1 - e) * scale;
      const ax = (a.rotX * (1 - e) * Math.PI) / 180;
      const ay = (a.rotY * (1 - e) * Math.PI) / 180;
      if (w <= 1 || h <= 1) return;

      const pts = roundedRectPoints(w, h, r).map(([x, y]) => {
        const xx = x * Math.cos(ay);
        const yy = y * Math.cos(ax);
        const z = x * Math.sin(ay) - y * Math.sin(ax);
        const p = FOCAL / (FOCAL + z);
        return [cx + xx * p, cy + yy * p] as const;
      });

      ctx.save();
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "#0D0D0D";
      ctx.fillRect(0, 0, W, H);
      const img = images.current[nextRef.current];
      if (img?.complete) drawCover(ctx, img, W, H);
      if (e > 0) drawShade(ctx, W, H);
      ctx.restore();
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Preloader: contador de 0 a 100% e logo que voa até a navbar.
  useEffect(() => {
    const body = document.body;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 300 : 2600;
    body.classList.add("is-preloading");
    let raf = 0;
    let done = false;
    const start = performance.now();

    const startExperience = async () => {
      const img = images.current[nextRef.current];
      if (img && !img.complete) {
        await Promise.race([new Promise((r) => (img.onload = r)), wait(1600)]);
      }
      await revealMask();
      body.classList.add("intro-ready");
      anim.current.busy = false;
      await wait(reduced ? 0 : 450);
      revealContent();
    };

    const finish = () => {
      if (done) return;
      done = true;
      if (valueRef.current) valueRef.current.textContent = "100";
      countRef.current?.classList.add("is-leaving");
      logoRef.current?.classList.add("is-docked");
      preloaderRef.current?.classList.add("is-done");
      body.classList.remove("is-preloading");
      body.classList.add("preload-complete");
      startExperience();
      setTimeout(() => countRef.current?.remove(), 750);
      setTimeout(() => body.classList.add("logo-settled"), reduced ? 0 : 2000);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      if (valueRef.current) valueRef.current.textContent = String(Math.round(easeInOutCubic(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [revealMask, revealContent]);

  // Lista de cenas pisca a cada troca.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (sceneListRef.current) retrigger(sceneListRef.current, "is-switching");
  }, [current]);

  const travel = async () => {
    const a = anim.current;
    const hero = heroRef.current!;
    if (a.busy) return;
    a.busy = true;
    a.targetX = 0;
    a.targetY = 0;
    try {
      hero.classList.remove("content-revealing", "mask-revealing");
      hero.classList.add("is-transitioning");
      await animateValue((v) => (a.expansion = v), 1100);
      hero.classList.add("is-committing");
      setCurrent(nextRef.current);
      await nextFrame();
      await nextFrame();
      a.expansion = 0;
      a.maskScale = 0;
      hero.classList.remove("is-transitioning", "is-committing");
      const mask = revealMask();
      setTimeout(revealContent, 100);
      await mask;
    } catch {
      a.expansion = 0;
      a.maskScale = 1;
      hero.classList.remove("is-transitioning", "is-committing", "is-loading");
    } finally {
      a.busy = false;
    }
  };

  return (
    <section ref={heroRef} id="topo" className="hero" data-scene={scene.id} aria-label="Apresentação">
      <div className="hero-backgrounds">
        {scenes.map((s, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={s.id}
            src={s.image}
            srcSet={`${s.imageSmall} 800w, ${s.image} 1408w`}
            sizes="100vw"
            alt={i === current ? s.alt : ""}
            aria-hidden={i !== current}
            className={`hero-bg${i === current ? " is-visible" : ""}`}
            fetchPriority={i === 0 ? "high" : "low"}
            decoding="async"
          />
        ))}
      </div>
      <div className="hero-shade" aria-hidden="true" />

      <div ref={preloaderRef} className="preloader" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={scenes[0].image} alt="" />
        <div className="preloader-shade" />
      </div>
      <div ref={logoRef} className="floating-logo" aria-hidden="true">
        <Logo />
      </div>
      <div ref={countRef} className="preloader-count" aria-live="polite">
        <span ref={valueRef}>0</span>
        <span className="percent">%</span>
      </div>

      <canvas ref={canvasRef} className="portal-canvas" aria-hidden="true" />

      <div ref={sceneListRef} className="scene-list chrome" aria-label="Cenas">
        {scenes.map((s, i) => (
          <span key={s.id} className={`scene-item${i === current ? " active" : ""}`}>
            {s.name}
          </span>
        ))}
      </div>

      <div className="hero-copy chrome">
        <h1 key={`h-${scene.id}`}>{scene.headline}</h1>
        <p key={`p-${scene.id}`}>{scene.text}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" data-elastic href={whatsappLink("Olá! Quero agendar um Drive Experience.")} target="_blank" rel="noopener noreferrer">
            Agendar meu drive
          </a>
          <a className="btn btn-ghost" data-elastic href={whatsappLink("Olá! Quero falar com um consultor.")} target="_blank" rel="noopener noreferrer">
            Falar com um consultor
          </a>
        </div>
      </div>

      <div className="portal-wrap chrome">
        <button
          ref={portalRef}
          className="portal"
          type="button"
          onClick={travel}
          data-cursor="Entrar"
          aria-label={`Ir para ${nextScene.name}`}
        />
      </div>

      <div className="scene-content chrome">
        <p className="scene-title" key={`t-${scene.id}`} aria-hidden="true">
          {scene.name.toUpperCase()}
        </p>
        <dl key={`f-${scene.id}`}>
          {scene.facts.map(([k, v]) => (
            <div className="fact" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
