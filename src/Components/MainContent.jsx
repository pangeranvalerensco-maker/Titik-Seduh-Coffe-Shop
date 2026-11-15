import { useMemo } from "react";
import { Coffee, RotateCcw, SlidersHorizontal } from "lucide-react";
import { MenuCard } from "./MenuCard";

const SortOptions = [
  { value: "rekomendasi", label: "Rekomendasi" },
  { value: "favorit-baru", label: "Favorit terbaru" },
  { value: "favorit-lama", label: "Favorit terlama" },
  { value: "harga-rendah", label: "Harga terendah" },
  { value: "harga-tinggi", label: "Harga tertinggi" },
  { value: "rating", label: "Rating tertinggi" },
  { value: "nama", label: "Nama A–Z" },
];

const GetHeading = (category, totalCount) => {
  if (category === "Favorit") {
    return {
      eyebrow: "// meja favorit",
      title: "Racikan yang kamu simpan",
      text: "Urutkan sesuai waktu disimpan, harga, rating, atau nama.",
    };
  }
  if (category === "Semua") {
    return {
      eyebrow: "// arsip racikan",
      title: `${totalCount} racikan di satu meja`,
      text: "Dari espresso pekat sampai kue sore. Pilih satu, atau biarkan kami merekomendasikan.",
    };
  }
  return {
    eyebrow: `// kategori ${category.toLowerCase()}`,
    title: `Racikan ${category.toLowerCase()}`,
    text: "Setiap racikan punya asal, karakter, dan waktu terbaiknya sendiri.",
  };
};

export const MainContent = ({
  menus,
  favorites,
  comments,
  category,
  sort,
  onSortChange,
  onToggleFavorite,
  onAddComment,
  onResetFilters,
  totalCount,
}) => {
  const heading = GetHeading(category, totalCount);
  const favoriteIds = useMemo(
    () => new Set(favorites.map((favorite) => favorite.id)),
    [favorites],
  );

  return (
    <section className="menu-section" id="menu">
      <div className="container">
        <div className="section-head">
          <div>
            <p className="eyebrow">{heading.eyebrow}</p>
            <h2 className="section-title">{heading.title}</h2>
            <p className="section-text">{heading.text}</p>
          </div>

          <div className="section-tools">
            <span className="result-count" aria-live="polite">
              {menus.length} / {totalCount} racikan
            </span>
            <label className="sort-control">
              <SlidersHorizontal size={16} />
              <span className="sr-only">Urutkan menu</span>
              <select
                value={sort}
                onChange={(event) => onSortChange(event.target.value)}
              >
                {SortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {menus.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              <Coffee size={28} />
            </span>
            <h3>Belum ada racikan yang cocok</h3>
            <p>
              Coba kata kunci lain, pilih kategori berbeda, atau kembali ke
              seluruh arsip.
            </p>
            <button
              type="button"
              className="button button-primary"
              onClick={onResetFilters}
            >
              <RotateCcw size={16} />
              Reset pencarian
            </button>
          </div>
        ) : (
          <div className="menu-grid">
            {menus.map((menu) => (
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
        )}
      </div>
    </section>
  );
};
