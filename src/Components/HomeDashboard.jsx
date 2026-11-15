import {
  ArrowDown,
  ArrowRight,
  Leaf,
  MapPin,
  Sparkles,
} from "lucide-react";
import { PopularSearches, TopMenuIds } from "../Data/MenuData";
import { HeroCarousel } from "./HeroCarousel";
import { MenuCard } from "./MenuCard";
import { StorySection } from "./StorySection";

export const HomeDashboard = ({
  menus,
  favorites,
  comments,
  onOpenMenu,
  onSearchSelect,
  onToggleFavorite,
  onAddComment,
}) => {
  const carouselMenus = TopMenuIds.slice(0, 3)
    .map((id) => menus.find((menu) => menu.id === id))
    .filter(Boolean);
  const topMenus = TopMenuIds.map((id) =>
    menus.find((menu) => menu.id === id),
  ).filter(Boolean);
  const favoriteIds = new Set(favorites.map((favorite) => favorite.id));

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" />
              Est. 2026 — Jakarta
            </p>
            <h1 className="home-title">
              Titik <em>seduh</em>, titik temu rasa.
            </h1>
            <p className="home-lead">
              Enam belas racikan dari biji dan bahan Nusantara, dicatat rapi
              supaya kamu tahu persis apa yang sedang diminum. Mulai dari
              espresso pekat sampai kue sore.
            </p>
            <div className="home-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => onOpenMenu()}
              >
                Jelajahi menu
                <ArrowDown size={16} />
              </button>
              <button
                type="button"
                className="button button-ghost"
                onClick={() => onSearchSelect("Kopi Birong")}
              >
                Coba Kopi Birong
              </button>
            </div>

            <div className="trending-searches">
              <span>Lagi dicari</span>
              {PopularSearches.slice(0, 3).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onSearchSelect(term)}
                >
                  {term}
                </button>
              ))}
            </div>

            <dl className="hero-stats">
              <div>
                <dt>16</dt>
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

          <HeroCarousel menus={carouselMenus} onOpenMenu={onOpenMenu} />
        </div>
      </section>

      <section className="home-picks">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{"// pilihan barista"}</p>
              <h2 className="section-title">Yang paling sering dituang.</h2>
              <p className="section-text">
                Empat racikan yang paling sering keluar dari bar hari ini.
                Kopi Birong baru masuk daftar, langsung jadi favorit.
              </p>
            </div>
            <button
              type="button"
              className="button button-ghost"
              onClick={() => onOpenMenu()}
            >
              Lihat semua menu
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="home-picks-grid">
            {topMenus.map((menu) => (
              <MenuCard
                key={menu.id}
                {...menu}
                favorite={favoriteIds.has(menu.id)}
                comments={comments[menu.id] || []}
                onToggleFavorite={onToggleFavorite}
                onAddComment={onAddComment}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="home-promo">
        <div className="container home-promo-inner">
          <div>
            <p className="eyebrow">{"// promo meja panjang"}</p>
            <h2>Kode UTS25, potongan 25%.</h2>
            <p>
              Gunakan di keranjang sebelum checkout. Bisa digabung dengan pajak
              dan promo lain? Tidak. Tapi tetap terasa ringan.
            </p>
          </div>
          <div className="home-promo-notes">
            <span>
              <MapPin size={14} />
              Cikini, Jakarta Pusat
            </span>
            <span>
              <Leaf size={14} />
              Biji lokal, sangrai mingguan
            </span>
            <span>
              <Sparkles size={14} />
              Batch baru setiap Senin
            </span>
          </div>
          <button
            type="button"
            className="button button-light"
            onClick={() => onOpenMenu()}
          >
            Pilih racikan
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      <StorySection />
    </>
  );
};
