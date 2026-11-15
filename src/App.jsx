import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, Coffee } from "lucide-react";
import { CartDrawer } from "./Components/CartDrawer";
import { Footer } from "./Components/Footer";
import { Header } from "./Components/Header";
import { HistoryModal } from "./Components/HistoryModal";
import { HomeDashboard } from "./Components/HomeDashboard";
import { MainContent } from "./Components/MainContent";
import { NotificationsModal } from "./Components/NotificationsModal";
import { ToastViewport } from "./Components/ToastViewport";
import { CartProvider } from "./Context/CartProvider";
import { NotificationProvider } from "./Context/NotificationProvider";
import { UseNotifications } from "./Context/NotificationContext";
import { ToastProvider } from "./Context/ToastProvider";
import { UseToast } from "./Context/ToastContext";
import { MenuData } from "./Data/MenuData";
import { UseLocalStorage } from "./Hooks/UseLocalStorage";

const CreateCommentId = () =>
  `comment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const GetInitialView = () =>
  window.location.hash.startsWith("#menu") ? "menu" : "home";

const TitikSeduhApp = () => {
  const [favorites, setFavorites] = UseLocalStorage("titikseduh.favorites", []);
  const [comments, setComments] = UseLocalStorage("titikseduh.comments", {});
  const [view, setView] = useState(GetInitialView);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sort, setSort] = useState("rekomendasi");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { ShowToast } = UseToast();
  const { PushNotification } = UseNotifications();

  useEffect(() => {
    const handleHash = () => {
      setView(window.location.hash.startsWith("#menu") ? "menu" : "home");
    };
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const Navigate = useCallback((nextView, anchor) => {
    setView(nextView);
    window.history.replaceState(
      null,
      "",
      nextView === "menu" ? "#menu" : "#beranda",
    );
    window.setTimeout(() => {
      if (anchor) {
        document
          .getElementById(anchor)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 50);
  }, []);

  const NavigateHome = useCallback(() => {
    setSearch("");
    setCategory("Semua");
    Navigate("home");
  }, [Navigate]);

  const OpenMenu = useCallback(() => {
    setSearch("");
    setCategory("Semua");
    setSort("rekomendasi");
    Navigate("menu");
  }, [Navigate]);

  const OpenSearchResult = useCallback(
    (term) => {
      setSearch(term);
      setCategory("Semua");
      setSort("rekomendasi");
      Navigate("menu");
    },
    [Navigate],
  );

  const SubmitSearch = useCallback(
    (term) => {
      if (term.trim()) {
        OpenSearchResult(term);
      } else {
        OpenMenu();
      }
    },
    [OpenMenu, OpenSearchResult],
  );

  const counts = useMemo(() => {
    const next = {
      Semua: MenuData.length,
      Kopi: 0,
      "Non-Kopi": 0,
      Makanan: 0,
      Snack: 0,
      Favorit: favorites.length,
    };
    MenuData.forEach((menu) => {
      next[menu.category] += 1;
    });
    return next;
  }, [favorites.length]);

  const filteredMenus = useMemo(() => {
    const query = search.trim().toLowerCase();
    const favoriteMap = new Map(
      favorites.map((favorite) => [favorite.id, favorite]),
    );

    const result = MenuData.filter((menu) => {
      const matchesCategory =
        category === "Semua" ||
        (category === "Favorit"
          ? favoriteMap.has(menu.id)
          : menu.category === category);
      const haystack =
        `${menu.name} ${menu.category} ${menu.description}`.toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });

    switch (sort) {
      case "favorit-baru":
        return [...result].sort(
          (a, b) =>
            (favoriteMap.get(b.id)?.addedAt || 0) -
            (favoriteMap.get(a.id)?.addedAt || 0),
        );
      case "favorit-lama":
        return [...result].sort(
          (a, b) =>
            (favoriteMap.get(a.id)?.addedAt || 0) -
            (favoriteMap.get(b.id)?.addedAt || 0),
        );
      case "harga-rendah":
        return [...result].sort((a, b) => a.price - b.price);
      case "harga-tinggi":
        return [...result].sort((a, b) => b.price - a.price);
      case "rating":
        return [...result].sort((a, b) => b.rating - a.rating);
      case "nama":
        return [...result].sort((a, b) => a.name.localeCompare(b.name, "id"));
      default:
        return result;
    }
  }, [category, favorites, search, sort]);

  const ToggleFavorite = useCallback(
    (menu) => {
      const exists = favorites.some((favorite) => favorite.id === menu.id);
      if (exists) {
        setFavorites((previous) =>
          previous.filter((favorite) => favorite.id !== menu.id),
        );
        ShowToast(
          "Favorit dilepas",
          `${menu.name} keluar dari daftar favorit.`,
          "favorite",
        );
        PushNotification(
          "favorite",
          "Favorit dilepas",
          `${menu.name} dihapus dari tab Favorit.`,
        );
      } else {
        setFavorites((previous) => [
          { id: menu.id, addedAt: Date.now() },
          ...previous,
        ]);
        ShowToast(
          "Favorit disimpan",
          `${menu.name} masuk ke tab Favorit.`,
          "favorite",
        );
        PushNotification(
          "favorite",
          "Favorit disimpan",
          `${menu.name} ditambahkan ke tab Favorit.`,
        );
      }
    },
    [favorites, PushNotification, setFavorites, ShowToast],
  );

  const AddComment = useCallback(
    (menuId, rating, text) => {
      const menu = MenuData.find((item) => item.id === menuId);
      setComments((previous) => ({
        ...previous,
        [menuId]: [
          {
            id: CreateCommentId(),
            rating,
            text,
            createdAt: Date.now(),
          },
          ...(previous[menuId] || []),
        ],
      }));
      ShowToast(
        "Ulasan tersimpan",
        `Terima kasih, rating ${rating}/5 untuk ${menu?.name || "menu"} sudah dicatat.`,
        "comment",
      );
      PushNotification(
        "comment",
        "Ulasan baru",
        `${menu?.name || "Menu"} mendapat rating ${rating}/5.`,
      );
    },
    [PushNotification, setComments, ShowToast],
  );

  const HandleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    if (nextCategory === "Favorit" && sort === "rekomendasi") {
      setSort("favorit-baru");
    }
  };

  const HandleResetFilters = () => {
    setSearch("");
    setCategory("Semua");
    setSort("rekomendasi");
  };

  return (
    <>
      <Header
        view={view}
        search={search}
        onSearchChange={setSearch}
        onSearchSelect={OpenSearchResult}
        onSearchSubmit={SubmitSearch}
        onNavigateHome={NavigateHome}
        onOpenMenu={OpenMenu}
        category={category}
        onCategoryChange={HandleCategoryChange}
        counts={counts}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <main>
        {view === "home" ? (
          <HomeDashboard
            menus={MenuData}
            favorites={favorites}
            comments={comments}
            onOpenMenu={OpenMenu}
            onSearchSelect={OpenSearchResult}
            onToggleFavorite={ToggleFavorite}
            onAddComment={AddComment}
          />
        ) : (
          <>
            <section className="menu-page-head">
              <div className="container">
                <div className="menu-breadcrumb">
                  <button type="button" onClick={NavigateHome}>
                    Beranda
                  </button>
                  <span>/</span>
                  <b>Menu</b>
                </div>
                <div className="menu-page-grid">
                  <div>
                    <p className="eyebrow">{"// seluruh arsip"}</p>
                    <h1>Pilih titik seduhmu.</h1>
                    <p>
                      Enam belas racikan tersedia. Gunakan kategori di atas
                      untuk mempersempit pilihan, atau cari langsung nama
                      racikannya.
                    </p>
                  </div>
                  <div className="menu-page-counts">
                    <span>
                      <strong>{counts.Kopi}</strong>
                      Kopi
                    </span>
                    <span>
                      <strong>{counts["Non-Kopi"]}</strong>
                      Non-Kopi
                    </span>
                    <span>
                      <strong>{counts.Makanan}</strong>
                      Makanan
                    </span>
                    <span>
                      <strong>{counts.Snack}</strong>
                      Snack
                    </span>
                  </div>
                </div>
                <div className="menu-page-cta">
                  <Coffee size={15} />
                  <span>Semua diseduh setelah pesanan masuk.</span>
                  <button type="button" onClick={() => Navigate("home", "cerita")}>
                    Baca cerita kami
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            <MainContent
              menus={filteredMenus}
              favorites={favorites}
              comments={comments}
              category={category}
              sort={sort}
              onSortChange={setSort}
              onToggleFavorite={ToggleFavorite}
              onAddComment={AddComment}
              onResetFilters={HandleResetFilters}
              totalCount={MenuData.length}
            />
          </>
        )}
      </main>

      <Footer
        onNavigateHome={NavigateHome}
        onOpenMenu={OpenMenu}
        onOpenStory={() => Navigate("home", "cerita")}
        onOpenHistory={() => setHistoryOpen(true)}
      />

      <CartDrawer />
      <NotificationsModal
        open={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
      <HistoryModal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />
    </>
  );
};

function App() {
  return (
    <NotificationProvider>
      <ToastProvider>
        <CartProvider>
          <TitikSeduhApp />
        </CartProvider>
        <ToastViewport />
      </ToastProvider>
    </NotificationProvider>
  );
}

export default App;
