import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Effects from "@/components/Effects";
import SplitWords from "@/components/SplitWords";
import WhatsAppButton from "@/components/WhatsAppButton";
import Logo from "@/components/Logo";
import {
  company,
  differentials,
  hours,
  navLinks,
  services,
  testimonials,
  timeline,
  whatsappLink,
} from "@/lib/content";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.mapsQuery)}`;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* Serviços */}
        <section id="experiencias" className="section section-ink services">
          <div className="container">
            <h2 className="section-title" data-reveal>
              <SplitWords text="Três jeitos de ter uma Ferrari na sua vida" />
            </h2>
          </div>
          <div className="stack container" data-stack>
            {services.map((s, i) => (
              <article key={s.title} className={`stack-card stack-card-${i}`} style={{ ["--i" as string]: i }} data-light>
                <div className="stack-card-body">
                  <span className="stack-card-index" aria-hidden="true">0{i + 1}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.stats && (
                    <div className="stats">
                      {s.stats.map((st) => (
                        <div key={st.label} className="stat">
                          <strong>
                            <span data-odometer={st.value}>{st.value}</span>
                            {st.suffix}
                          </strong>
                          <span>{st.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <a className={`btn ${i === 1 ? "btn-dark" : i === 2 ? "btn-light" : "btn-primary"}`} data-elastic href={whatsappLink(s.message)} target="_blank" rel="noopener noreferrer">
                    {s.cta}
                  </a>
                </div>
                {s.image && (
                  <div className="stack-card-media" data-reveal>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.alt} loading="lazy" decoding="async" className="reveal-img" />
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* Diferenciais */}
        <section id="por-que-nos" className="section section-light differentials">
          <div className="container">
            <h2 className="section-title" data-reveal>
              <SplitWords text="Por que quem coleciona compra com a gente" />
            </h2>
            <div className="panels" data-panels>
              {differentials.map((d, i) => (
                <button
                  type="button"
                  key={d.title}
                  className={`panel${i === 0 ? " is-active" : ""}`}
                  data-light
                  aria-expanded={i === 0}
                >
                  <span className={`panel-figure${d.figure.length > 6 ? " is-long" : ""}`}>
                    {/^\d+$/.test(d.figure) ? <span data-odometer={d.figure}>{d.figure}</span> : d.figure}
                  </span>
                  <span className="panel-title">{d.title}</span>
                  <span className="panel-text">{d.text}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="clientes" className="section section-ink testimonials">
          <div className="container testimonials-head">
            <h2 className="section-title" data-reveal>
              <SplitWords text="Quem já dirigiu conta como foi" />
            </h2>
            <p className="drag-hint" aria-hidden="true">Arraste para o lado</p>
          </div>
          <div className="drag-track" data-drag tabIndex={0} aria-label="Depoimentos de clientes">
            <div className="drag-inner">
              {testimonials.map((t, i) => (
                <figure key={i} className={`quote quote-${i}`} data-cursor="Arrastar">
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span>{t.city}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Sobre */}
        <section id="nossa-casa" className="section section-light about">
          <div className="container">
            <h2 className="section-title about-title" data-reveal>
              <SplitWords text="97 anos de corrida, a poucos passos da fábrica" />
            </h2>
            <p className="fill-text" data-fill>
              <SplitWords
                text={`A Scuderia nasceu em ${company.founded} com um grupo de pilotos em Modena. São ${company.years} anos e ${company.clients} clientes em ${company.countries} países, mas o jeito continua o mesmo: você fala direto com quem entende do carro, sem fila e sem roteiro de vendas.`}
              />
            </p>
            <div className="about-grid">
              <div className="strips" data-reveal role="img" aria-label="Ferrari SF90 Stradale vermelha exposta no showroom de Maranello">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="strip" style={{ ["--s" as string]: i }} />
                ))}
              </div>
              <ol className="timeline" data-timeline>
                <span className="timeline-line" aria-hidden="true">
                  <span className="timeline-progress" />
                </span>
                {timeline.map((t, i) => (
                  <li key={i} className="milestone">
                    <strong>{t.year}</strong>
                    <span>{t.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Localização */}
        <section id="como-chegar" className="section section-ink location">
          <div className="container location-grid">
            <div className="location-info" data-reveal>
              <h2 className="section-title">
                <SplitWords text="Venha tomar um café com a gente em Maranello" />
              </h2>
              <address>{company.address}</address>
              <ul className="hours">
                {hours.map((h) => (
                  <li key={h.day}>
                    <span>{h.day}</span>
                    <strong>{h.time}</strong>
                  </li>
                ))}
              </ul>
              <div className="location-actions">
                <a className="btn btn-primary" data-elastic href={mapsUrl} target="_blank" rel="noopener noreferrer">
                  Abrir no Google Maps
                </a>
                <a className="btn btn-ghost" data-elastic href={whatsappLink("Olá! Quero agendar uma visita à loja.")} target="_blank" rel="noopener noreferrer">
                  Agendar minha visita
                </a>
              </div>
            </div>
            <div className="map" data-reveal>
              <iframe
                title="Mapa de Maranello"
                src={`https://www.google.com/maps?q=${encodeURIComponent(company.mapsQuery)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Chamada final */}
        <section className="final" data-mask aria-labelledby="final-title">
          <div className="final-sticky">
            <div className="final-under" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/cockpit.webp" alt="" loading="lazy" decoding="async" />
            </div>
            <div className="final-layer">
              <div className="container final-content">
                <h2 id="final-title">Sua primeira volta pode ser na próxima semana.</h2>
                <p>
                  Mande uma mensagem dizendo qual carro quer dirigir. A gente responde em até {company.responseTime} e reserva o seu horário.
                </p>
                <a className="btn btn-light btn-lg" data-elastic href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                  Agendar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <a href="#topo" className="footer-brand" aria-label="Voltar ao início">
            <Logo />
            <span>
              <strong>Scuderia Ferrari</strong>
              Maranello, Itália
            </span>
          </a>
          <nav aria-label="Links do rodapé">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <a href={company.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          </nav>
          <p className="footer-copy">© 2026 Scuderia Ferrari. Todos os direitos reservados.</p>
        </div>
      </footer>

      <WhatsAppButton />
      <Effects />
    </>
  );
}
