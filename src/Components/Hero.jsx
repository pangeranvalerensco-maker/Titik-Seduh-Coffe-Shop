import { ArrowDown, Coffee, MapPin, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" />
            Est. 2026 — Jakarta
          </p>
          <h1 className="hero-title">
            Arsip rasa dari <em>Nusantara.</em>
          </h1>
          <p className="hero-lead">
            Lima belas racikan, satu meja cerita. Kami menyimpan asal biji,
            karakter rasa, dan waktu terbaik untuk menikmatinya—supaya kamu
            tidak perlu menebak.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#menu">
              Buka arsip racikan
              <ArrowDown size={16} />
            </a>
            <a className="button button-ghost" href="#cerita">
              Baca cerita kami
            </a>
          </div>
          <dl className="hero-stats">
            <div>
              <dt>15</dt>
              <dd>Racikan</dd>
            </div>
            <div>
              <dt>06</dt>
              <dd>Origin</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>Biji lokal</dd>
            </div>
          </dl>
        </div>

        <div className="hero-art">
          <div className="hero-photo hero-photo-main">
            <img
              src="/images/Menu01.jpg"
              alt="Kopi susu dengan latte art di meja kayu"
            />
          </div>
          <div className="hero-photo hero-photo-small">
            <img
              src="/images/Menu07.jpg"
              alt="Lima cangkir kopi untuk mencicipi beberapa origin"
            />
          </div>

          <div className="hero-note">
            <span>
              <Sparkles size={13} />
              Batch #026
            </span>
            <strong>Gayo, Aceh</strong>
            <small>Chocolate · Spice · Long finish</small>
          </div>

          <div className="hero-stamp">
            <Coffee size={18} />
            <span>
              SEDUH
              <br />
              HARIAN
            </span>
          </div>

          <span className="hero-location">
            <MapPin size={14} />
            Jakarta, Indonesia
          </span>
        </div>
      </div>
    </section>
  );
};
