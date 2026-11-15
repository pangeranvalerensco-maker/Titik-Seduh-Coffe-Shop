import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Coffee,
  Heart,
  Receipt,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import { UseCart } from "../Context/CartContext";
import { UseNotifications } from "../Context/NotificationContext";
import { UseToast } from "../Context/ToastContext";
import {
  MenuData,
  PopularSearches,
  TopMenuIds,
} from "../Data/MenuData";
import { FormatDate, FormatRupiah } from "../Utils/Pricing";

const Categories = ["Semua", "Kopi", "Non-Kopi", "Makanan", "Snack", "Favorit"];

const TopMenus = TopMenuIds.map((id) =>
  MenuData.find((menu) => menu.id === id),
).filter(Boolean);

export const Header = ({
  view,
  search,
  onSearchChange,
  onSearchSelect,
  onSearchSubmit,
  onNavigateHome,
  onOpenMenu,
  category,
  onCategoryChange,
  counts,
  onOpenNotifications,
  onOpenHistory,
}) => {
  const { cart, cartCount, totals, orders, OpenCart } = UseCart();
  const { notifications, unreadCount, MarkAllRead } = UseNotifications();
  const { ShowToast } = UseToast();
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState(null);
  const searchRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointer = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setOpenPanel(null);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setOpenPanel(null);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const query = search.trim().toLowerCase();
  const matchedMenus = query
    ? MenuData.filter((menu) =>
        `${menu.name} ${menu.category} ${menu.description}`
          .toLowerCase()
          .includes(query),
      ).slice(0, 5)
    : [];
  const suggestions = query ? matchedMenus : TopMenus;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);

  const SelectSearch = (term) => {
    onSearchSelect(term);
    setSearchOpen(false);
  };

  const SubmitSearch = (event) => {
    event.preventDefault();
    onSearchSubmit(search);
    setSearchOpen(false);
  };

  const OpenFull = (callback) => {
    setOpenPanel(null);
    callback();
  };

  const MarkRead = () => {
    MarkAllRead();
    ShowToast("Notifikasi", "Semua aktivitas ditandai sudah dibaca.");
  };

  return (
    <header className={`site-header ${compact ? "is-compact" : ""}`}>
      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            <Sparkles size={13} />
            Racikan Nusantara, diseduh harian
          </span>
          <span>
            Kode <strong>UTS25</strong> — potongan 25%
          </span>
        </div>
      </div>

      <div className="container header-main">
        <button
          type="button"
          className="brand"
          onClick={onNavigateHome}
          aria-label="Titik Seduh, kembali ke beranda"
        >
          <span className="brand-mark">
            <Coffee size={22} />
          </span>
          <span className="brand-copy">
            <strong>Titik Seduh.</strong>
            <small>Arsip racikan Nusantara</small>
          </span>
        </button>

        <nav className="primary-nav" aria-label="Navigasi utama">
          <button
            type="button"
            className={view === "home" ? "is-active" : ""}
            onClick={onNavigateHome}
          >
            Beranda
          </button>
          <button
            type="button"
            className={view === "menu" ? "is-active" : ""}
            onClick={() => onOpenMenu()}
          >
            Menu
            <span>{MenuData.length}</span>
          </button>
        </nav>

        <div className="search-wrap" ref={searchRef}>
          <form className="search-box" role="search" onSubmit={SubmitSearch}>
            <Search size={17} />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                onSearchChange(event.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Cari racikan, bahan, atau cerita..."
              aria-label="Cari menu"
              aria-expanded={searchOpen}
            />
            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  onSearchChange("");
                  setSearchOpen(true);
                }}
                aria-label="Hapus pencarian"
              >
                <X size={15} />
              </button>
            )}
          </form>

          {searchOpen && (
            <div className="search-suggestions">
              <div className="suggestion-head">
                <span>
                  {query ? "// hasil pencarian" : "// rekomendasi teratas"}
                </span>
                <b>
                  {query
                    ? `${suggestions.length} racikan`
                    : "Paling sering dituang"}
                </b>
              </div>

              <div className="suggestion-popular">
                <span>Pencarian populer</span>
                <div>
                  {PopularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => SelectSearch(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {suggestions.length > 0 ? (
                <div className="suggestion-list">
                  {suggestions.map((menu) => (
                    <button
                      key={menu.id}
                      type="button"
                      className="suggestion-item"
                      onClick={() => SelectSearch(menu.name)}
                    >
                      <img src={menu.image} alt="" />
                      <span>
                        <strong>{menu.name}</strong>
                        <small>
                          {menu.category} · {FormatRupiah(menu.price)}
                        </small>
                      </span>
                      <ArrowRight size={14} />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="suggestion-empty">
                  Belum ada racikan yang cocok. Coba kata kunci lain.
                </p>
              )}

              <button
                type="button"
                className="suggestion-more"
                onClick={() => {
                  if (query) {
                    onSearchSubmit(search);
                  } else {
                    onOpenMenu();
                  }
                  setSearchOpen(false);
                }}
              >
                {query ? "Lihat semua hasil" : "Buka seluruh menu"}
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="header-actions" ref={actionsRef}>
          <div
            className="quick-wrap"
            onMouseEnter={() => setOpenPanel("notifications")}
            onMouseLeave={() =>
              setOpenPanel((current) =>
                current === "notifications" ? null : current,
              )
            }
          >
            <button
              type="button"
              className={`icon-button ${
                openPanel === "notifications" ? "is-active" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) =>
                  current === "notifications" ? null : "notifications",
                )
              }
              aria-label="Buka notifikasi"
              aria-expanded={openPanel === "notifications"}
              title="Notifikasi"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="icon-badge">{unreadCount}</span>
              )}
            </button>

            {openPanel === "notifications" && (
              <div className="quick-panel" role="dialog" aria-label="Notifikasi">
                <div className="quick-head">
                  <div>
                    <span>{"// notifikasi"}</span>
                    <strong>{unreadCount} belum dibaca</strong>
                  </div>
                  <button
                    type="button"
                    onClick={MarkRead}
                    disabled={unreadCount === 0}
                  >
                    Tandai dibaca
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="quick-empty">
                    Belum ada aktivitas. Favorit, komentar, dan pesanan akan
                    muncul di sini.
                  </p>
                ) : (
                  <div className="quick-list">
                    {notifications.slice(0, 3).map((notification) => (
                      <div className="quick-item" key={notification.id}>
                        <span
                          className={`quick-dot ${
                            notification.read ? "" : "is-unread"
                          }`}
                        />
                        <div>
                          <strong>{notification.title}</strong>
                          <p>{notification.message}</p>
                          <span>{FormatDate(notification.time)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="quick-more"
                  onClick={() => OpenFull(onOpenNotifications)}
                >
                  Lihat semua notifikasi
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div
            className="quick-wrap"
            onMouseEnter={() => setOpenPanel("history")}
            onMouseLeave={() =>
              setOpenPanel((current) =>
                current === "history" ? null : current,
              )
            }
          >
            <button
              type="button"
              className={`icon-button ${
                openPanel === "history" ? "is-active" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) =>
                  current === "history" ? null : "history",
                )
              }
              aria-label="Buka riwayat pesanan"
              aria-expanded={openPanel === "history"}
              title="Riwayat"
            >
              <Receipt size={18} />
            </button>

            {openPanel === "history" && (
              <div className="quick-panel" role="dialog" aria-label="Riwayat">
                <div className="quick-head">
                  <div>
                    <span>{"// riwayat"}</span>
                    <strong>{orders.length} transaksi</strong>
                  </div>
                  <b>{FormatRupiah(totalSpent)}</b>
                </div>

                {orders.length === 0 ? (
                  <p className="quick-empty">
                    Belum ada transaksi. Checkout pertamamu akan tercatat di
                    sini.
                  </p>
                ) : (
                  <div className="quick-list">
                    {orders.slice(0, 2).map((order) => (
                      <div className="quick-order" key={order.id}>
                        <div>
                          <strong>{order.id}</strong>
                          <span>{FormatDate(order.paidAt)}</span>
                        </div>
                        <b>{FormatRupiah(order.total)}</b>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="quick-more"
                  onClick={() => OpenFull(onOpenHistory)}
                >
                  Buka riwayat lengkap
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div
            className="quick-wrap"
            onMouseEnter={() => setOpenPanel("cart")}
            onMouseLeave={() =>
              setOpenPanel((current) => (current === "cart" ? null : current))
            }
          >
            <button
              type="button"
              className={`icon-button icon-button-cart ${
                openPanel === "cart" ? "is-active" : ""
              }`}
              onClick={() =>
                setOpenPanel((current) =>
                  current === "cart" ? null : "cart",
                )
              }
              aria-label="Buka keranjang"
              aria-expanded={openPanel === "cart"}
              title="Keranjang"
            >
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
            </button>

            {openPanel === "cart" && (
              <div className="quick-panel" role="dialog" aria-label="Keranjang">
                <div className="quick-head">
                  <div>
                    <span>{"// keranjang"}</span>
                    <strong>{cartCount} item</strong>
                  </div>
                  <b>{FormatRupiah(totals.subtotal)}</b>
                </div>

                {cart.length === 0 ? (
                  <p className="quick-empty">
                    Keranjang masih kosong. Pilih racikan dari menu untuk mulai.
                  </p>
                ) : (
                  <div className="quick-list">
                    {cart.slice(0, 3).map((item) => (
                      <div className="quick-cart-item" key={item.id}>
                        <img src={item.image} alt="" />
                        <div>
                          <strong>{item.name}</strong>
                          <span>
                            {item.qty} × {FormatRupiah(item.price)}
                          </span>
                        </div>
                        <b>{FormatRupiah(item.price * item.qty)}</b>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="quick-more"
                  onClick={() => OpenFull(OpenCart)}
                >
                  Buka keranjang
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {view === "menu" && (
        <div className="category-shell">
          <div
            className="container category-bar"
            role="tablist"
            aria-label="Kategori menu"
          >
            <span className="category-label">Kategori</span>
            {Categories.map((item) => (
              <button
                key={item}
                type="button"
                className={`category-tab ${
                  category === item ? "is-active" : ""
                }`}
                onClick={() => onCategoryChange(item)}
                aria-pressed={category === item}
              >
                {item === "Favorit" && <Heart size={13} />}
                <span>{item}</span>
                <b>{counts[item] ?? 0}</b>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
