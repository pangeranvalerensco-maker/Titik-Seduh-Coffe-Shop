import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { UseCart } from "../Context/CartContext";
import { FormatRupiah } from "../Utils/Pricing";

export const HeroCarousel = ({ menus, onOpenMenu }) => {
  const { AddToCart, GetStock } = UseCart();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || menus.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % menus.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [menus.length, paused]);

  if (menus.length === 0) return null;

  const menu = menus[active];
  const stock = GetStock(menu.id);
  const GoTo = (index) =>
    setActive((index + menus.length) % menus.length);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-stage">
        {menus.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt={item.name}
            className={index === active ? "is-active" : ""}
            loading={index === 0 ? "eager" : "lazy"}
          />
        ))}

        <div className="carousel-shade" />

        <div className="carousel-top">
          <span className="carousel-counter">
            0{active + 1} / 0{menus.length}
          </span>
          <span className="carousel-badge">Top menu</span>
        </div>

        <div className="carousel-info" key={menu.id}>
          <span className="carousel-category">{menu.category}</span>
          <h2>{menu.name}</h2>
          <p>{menu.description}</p>
          <div className="carousel-meta">
            <span>
              <Star size={14} fill="currentColor" />
              {menu.rating.toFixed(1)}
            </span>
            <strong>{FormatRupiah(menu.price)}</strong>
          </div>
          <div className="carousel-actions">
            <button
              type="button"
              className="button button-light"
              onClick={() => AddToCart(menu)}
              disabled={stock <= 0}
            >
              {stock <= 0 ? "Stok habis" : "Tambah ke keranjang"}
            </button>
            <button
              type="button"
              className="button button-glass"
              onClick={() => onOpenMenu(menu.name)}
            >
              Lihat racikan
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

        <div className="carousel-controls">
          <button
            type="button"
            onClick={() => GoTo(active - 1)}
            aria-label="Racikan sebelumnya"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => GoTo(active + 1)}
            aria-label="Racikan berikutnya"
          >
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="carousel-dots" aria-label="Pilih racikan unggulan">
          {menus.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={index === active ? "is-active" : ""}
              onClick={() => GoTo(index)}
              aria-label={`Tampilkan ${item.name}`}
              aria-pressed={index === active}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
