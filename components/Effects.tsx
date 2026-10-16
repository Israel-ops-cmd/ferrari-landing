"use client";

import { useEffect, useRef } from "react";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function Effects() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(
      target: Window | Document | HTMLElement,
      type: K | string,
      fn: (e: never) => void,
      opts?: AddEventListenerOptions
    ) => {
      target.addEventListener(type, fn as EventListener, opts);
      cleanups.push(() => target.removeEventListener(type, fn as EventListener, opts));
    };

    /* ---------- Revelar ao entrar na tela ---------- */
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* ---------- Esconde o WhatsApp fixo no hero do celular ---------- */
    const hero = document.getElementById("topo");
    if (hero) {
      const heroIO = new IntersectionObserver(([e]) => document.body.classList.toggle("hero-in-view", e.intersectionRatio > 0.35), {
        threshold: [0, 0.35, 1],
      });
      heroIO.observe(hero);
      cleanups.push(() => heroIO.disconnect());
    }

    /* ---------- Odômetro ---------- */
    const odoIO = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          odoIO.unobserve(e.target);
          const el = e.target as HTMLElement;
          const digits = (el.dataset.odometer || "").split("");
          el.textContent = "";
          el.classList.add("odometer");
          el.setAttribute("aria-label", digits.join(""));
          digits.forEach((d, i) => {
            const reel = document.createElement("span");
            reel.className = "odo-reel";
            reel.setAttribute("aria-hidden", "true");
            const strip = document.createElement("span");
            strip.className = "odo-strip";
            strip.innerHTML = Array.from({ length: 10 }, (_, n) => `<span>${n}</span>`).join("");
            reel.appendChild(strip);
            el.appendChild(reel);
            const n = Number(d);
            requestAnimationFrame(() =>
              setTimeout(() => {
                strip.style.transitionDelay = `${i * 120}ms`;
                strip.style.transform = `translateY(-${n * 10}%)`;
              }, 60)
            );
          });
        }),
      { threshold: 0.6 }
    );
    if (!reduced) document.querySelectorAll("[data-odometer]").forEach((el) => odoIO.observe(el));
    cleanups.push(() => odoIO.disconnect());

    /* ---------- Painéis que expandem ---------- */
    document.querySelectorAll<HTMLElement>("[data-panels]").forEach((group) => {
      const panels = Array.from(group.querySelectorAll<HTMLElement>(".panel"));
      const activate = (p: HTMLElement) =>
        panels.forEach((x) => {
          x.classList.toggle("is-active", x === p);
          x.setAttribute("aria-expanded", String(x === p));
        });
      panels.forEach((p) => {
        on(p, "click", () => activate(p));
        on(p, "focus", () => activate(p));
        if (finePointer) on(p, "mouseenter", () => activate(p));
      });
    });

    /* ---------- Luz que segue o mouse ---------- */
    if (finePointer) {
      document.querySelectorAll<HTMLElement>("[data-light]").forEach((el) => {
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        });
      });
    }

    /* ---------- Botão elástico ---------- */
    if (finePointer && !reduced) {
      document.querySelectorAll<HTMLElement>("[data-elastic]").forEach((el) => {
        let x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, raf = 0;
        const step = () => {
          vx += (tx - x) * 0.18; vy += (ty - y) * 0.18;
          vx *= 0.72; vy *= 0.72;
          x += vx; y += vy;
          el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
          if (Math.abs(vx) + Math.abs(vy) + Math.abs(tx - x) + Math.abs(ty - y) > 0.05) raf = requestAnimationFrame(step);
          else { el.style.transform = tx || ty ? el.style.transform : ""; raf = 0; }
        };
        const kick = () => { if (!raf) raf = requestAnimationFrame(step); };
        on(el, "pointermove", (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          tx = (e.clientX - (r.left + r.width / 2)) * 0.3;
          ty = (e.clientY - (r.top + r.height / 2)) * 0.4;
          kick();
        });
        on(el, "pointerleave", () => { tx = 0; ty = 0; kick(); });
      });
    }

    /* ---------- Arrastar para deslizar (depoimentos) ---------- */
    document.querySelectorAll<HTMLElement>("[data-drag]").forEach((track) => {
      const inner = track.querySelector<HTMLElement>(".drag-inner")!;
      let pos = 0, vel = 0, dragging = false, lastX = 0, raf = 0, moved = 0;
      const bounds = () => Math.min(0, track.clientWidth - inner.scrollWidth);
      const apply = () => (inner.style.transform = `translate3d(${pos}px,0,0)`);
      const glide = () => {
        if (dragging) return;
        pos += vel;
        vel *= 0.94;
        const min = bounds();
        if (pos > 0) { pos += (0 - pos) * 0.2; vel *= 0.5; }
        if (pos < min) { pos += (min - pos) * 0.2; vel *= 0.5; }
        apply();
        if (Math.abs(vel) > 0.1 || pos > 0.5 || pos < min - 0.5) raf = requestAnimationFrame(glide);
        else raf = 0;
      };
      on(track, "pointerdown", (e: PointerEvent) => {
        dragging = true; lastX = e.clientX; vel = 0; moved = 0;
        cancelAnimationFrame(raf);
        track.setPointerCapture(e.pointerId);
        track.classList.add("is-dragging");
      });
      on(track, "pointermove", (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        moved += Math.abs(dx);
        const min = bounds();
        pos += pos > 0 || pos < min ? dx * 0.35 : dx;
        vel = dx;
        apply();
      });
      const end = () => {
        if (!dragging) return;
        dragging = false;
        track.classList.remove("is-dragging");
        raf = requestAnimationFrame(glide);
      };
      on(track, "pointerup", end);
      on(track, "pointercancel", end);
      on(track, "keydown", (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") { vel = -18; raf = requestAnimationFrame(glide); }
        if (e.key === "ArrowLeft") { vel = 18; raf = requestAnimationFrame(glide); }
      });
      void moved;
    });

    /* ---------- Efeitos ligados à rolagem ---------- */
    const fills = Array.from(document.querySelectorAll<HTMLElement>("[data-fill]"));
    const timelines = Array.from(document.querySelectorAll<HTMLElement>("[data-timeline]"));
    const stacks = Array.from(document.querySelectorAll<HTMLElement>("[data-stack] .stack-card"));
    const masks = Array.from(document.querySelectorAll<HTMLElement>("[data-mask]"));

    const onScrollFrame = () => {
      const vh = window.innerHeight;

      fills.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
        const words = el.querySelectorAll(".word");
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
      });

      timelines.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp((vh * 0.7 - r.top) / r.height);
        el.style.setProperty("--p", String(p));
        el.querySelectorAll<HTMLElement>(".milestone").forEach((m) => {
          const mr = m.getBoundingClientRect();
          m.classList.toggle("is-lit", mr.top + 12 < vh * 0.7);
        });
      });

      stacks.forEach((card, i) => {
        const nextCard = stacks[i + 1];
        if (!nextCard) return;
        const r = card.getBoundingClientRect();
        const nr = nextCard.getBoundingClientRect();
        const p = clamp(1 - (nr.top - r.top) / Math.max(1, r.height));
        card.style.setProperty("--cover", String(p));
      });

      masks.forEach((el) => {
        const r = el.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - vh));
        el.style.setProperty("--m", String(p));
      });
    };

    let ticking = false;
    const requestFrame = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        onScrollFrame();
      });
    };
    on(window, "scroll", requestFrame, { passive: true });
    on(window, "resize", requestFrame);
    onScrollFrame();

    /* ---------- Rolagem com inércia (desktop) ---------- */
    if (finePointer && !reduced) {
      let target = window.scrollY;
      let current = window.scrollY;
      let raf = 0;
      let animating = false;
      const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
      const loop = () => {
        current += (target - current) * 0.11;
        if (Math.abs(target - current) < 0.5) {
          current = target;
          animating = false;
        }
        window.scrollTo(0, current);
        if (animating) raf = requestAnimationFrame(loop);
      };
      const start = () => {
        if (!animating) {
          animating = true;
          current = window.scrollY;
          raf = requestAnimationFrame(loop);
        }
      };
      on(window, "wheel", (e: WheelEvent) => {
        if (e.ctrlKey || document.body.classList.contains("is-preloading") || document.body.classList.contains("menu-open")) return;
        const el = e.target as HTMLElement;
        if (el.closest("iframe, [data-native-scroll]")) return;
        e.preventDefault();
        const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
        if (!animating) target = window.scrollY;
        target = clamp(target + delta, 0, maxScroll());
        start();
      }, { passive: false });
      on(window, "scroll", () => {
        if (!animating) target = current = window.scrollY;
      }, { passive: true });
      on(document, "click", (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
        if (!a) return;
        const id = a.getAttribute("href")!;
        const dest = id === "#topo" ? document.body : document.querySelector<HTMLElement>(id);
        if (!dest) return;
        e.preventDefault();
        const y = id === "#topo" ? 0 : dest.getBoundingClientRect().top + window.scrollY - 72;
        if (!animating) target = window.scrollY;
        target = clamp(y, 0, maxScroll());
        start();
        history.replaceState(null, "", id);
      });
      cleanups.push(() => cancelAnimationFrame(raf));
    }

    /* ---------- Cursor personalizado ---------- */
    const cursor = cursorRef.current;
    if (finePointer && cursor) {
      document.documentElement.classList.add("has-custom-cursor");
      const dot = cursor.querySelector<HTMLElement>(".cursor-dot")!;
      const orbit = cursor.querySelector<HTMLElement>(".cursor-orbit")!;
      const label = cursor.querySelector<HTMLElement>(".cursor-label")!;
      let mx = -100, my = -100, ox = -100, oy = -100, raf = 0;
      const loop = () => {
        ox += (mx - ox) * 0.2;
        oy += (my - oy) * 0.2;
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        orbit.style.setProperty("--x", `${ox}px`);
        orbit.style.setProperty("--y", `${oy}px`);
        label.style.setProperty("--x", `${ox}px`);
        label.style.setProperty("--y", `${oy}px`);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      const updateTarget = (el: Element | null) => {
        const t = el?.closest<HTMLElement>("[data-cursor], a, button");
        const text = t?.dataset.cursor;
        cursor.classList.toggle("is-enter", !!text);
        cursor.classList.toggle("is-link", !!t && !text);
        if (text) label.textContent = text;
      };
      on(window, "pointermove", (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        mx = e.clientX;
        my = e.clientY;
        cursor.classList.add("is-visible");
        updateTarget(e.target as Element);
      });
      on(window, "scroll", () => updateTarget(document.elementFromPoint(mx, my)), { passive: true });
      on(document, "mouseleave", () => cursor.classList.remove("is-visible"));
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        document.documentElement.classList.remove("has-custom-cursor");
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <div ref={cursorRef} className="custom-cursor" aria-hidden="true">
      <span className="cursor-orbit" />
      <span className="cursor-dot" />
      <span className="cursor-label">Entrar</span>
    </div>
  );
}
