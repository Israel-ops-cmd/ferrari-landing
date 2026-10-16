"use client";

import { useEffect, useState } from "react";
import { navLinks, whatsappLink } from "@/lib/content";
import Logo from "./Logo";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = navLinks
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((s): s is HTMLElement => !!s);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`));
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`navbar${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <a href="#topo" className="navbar-logo" aria-label="Scuderia Ferrari, voltar ao início" onClick={() => setOpen(false)}>
        <Logo />
        <span>Scuderia Ferrari</span>
      </a>

      <nav className="nav-pill" aria-label="Navegação principal">
        {navLinks.map((l) => (
          <a key={l.href} href={l.href} className={active === l.href ? "active" : undefined}>
            {l.label}
          </a>
        ))}
      </nav>

      <div className="navbar-actions">
        <a className="btn btn-primary btn-sm" data-elastic href={whatsappLink()} target="_blank" rel="noopener noreferrer">
          Agendar meu drive
        </a>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Menu do celular">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <a className="btn btn-primary" href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
          Agendar pelo WhatsApp
        </a>
      </div>
    </header>
  );
}
