import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { MenuData } from "../Data/MenuData";
import { UseLocalStorage } from "../Hooks/UseLocalStorage";
import { CalculateTotals, GetPromo } from "../Utils/Pricing";
import { CartContext } from "./CartContext";
import { UseNotifications } from "./NotificationContext";
import { UseToast } from "./ToastContext";

const InitialStock = Object.fromEntries(
  MenuData.map((menu) => [menu.id, menu.stock]),
);

const CartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((item) => item.id === action.menu.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.menu.id
            ? { ...item, qty: item.qty + 1 }
            : item,
        );
      }
      return [
        ...state,
        {
          id: action.menu.id,
          name: action.menu.name,
          category: action.menu.category,
          price: action.menu.price,
          image: action.menu.image,
          qty: 1,
        },
      ];
    }
    case "UPDATE":
      return state
        .map((item) =>
          item.id === action.id
            ? { ...item, qty: Math.max(0, item.qty + action.delta) }
            : item,
        )
        .filter((item) => item.qty > 0);
    case "REMOVE":
      return state.filter((item) => item.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [storedCart, setStoredCart] = UseLocalStorage("titikseduh.cart", []);
  const [cart, dispatch] = useReducer(CartReducer, storedCart);
  const [stock, setStock] = UseLocalStorage("titikseduh.stock", InitialStock);
  const [orders, setOrders] = UseLocalStorage("titikseduh.orders", []);
  const [promo, setPromo] = UseLocalStorage("titikseduh.promo", null);
  const [isCartOpen, setCartOpen] = useState(false);
  const { ShowToast } = UseToast();
  const { PushNotification } = UseNotifications();

  useEffect(() => {
    setStoredCart(cart);
  }, [cart, setStoredCart]);

  const GetStock = useCallback(
    (id) => stock[id] ?? 0,
    [stock],
  );

  const OpenCart = useCallback(() => setCartOpen(true), []);
  const CloseCart = useCallback(() => setCartOpen(false), []);

  const AddToCart = useCallback(
    (menu) => {
      const available = GetStock(menu.id);
      const inCart = cart.find((item) => item.id === menu.id)?.qty ?? 0;
      if (available <= 0 || inCart >= available) {
        ShowToast(
          "Stok tidak cukup",
          `${menu.name} hanya tersisa ${available} porsi.`,
          "warning",
        );
        PushNotification(
          "cart",
          "Batas stok tercapai",
          `${menu.name} tidak bisa ditambah lagi.`,
        );
        return false;
      }

      dispatch({ type: "ADD", menu });
      ShowToast(
        "Masuk keranjang",
        `${menu.name} ditambahkan ke pesanan.`,
        "cart",
      );
      PushNotification(
        "cart",
        "Keranjang diperbarui",
        `${menu.name} masuk keranjang.`,
      );
      return true;
    },
    [cart, GetStock, PushNotification, ShowToast],
  );

  const UpdateQty = useCallback(
    (id, delta) => {
      const item = cart.find((entry) => entry.id === id);
      if (!item) return;
      if (delta > 0 && item.qty >= GetStock(id)) {
        ShowToast(
          "Batas stok",
          `Stok ${item.name} tinggal ${GetStock(id)} porsi.`,
          "warning",
        );
        PushNotification(
          "cart",
          "Batas stok tercapai",
          `${item.name} tidak bisa ditambah lagi.`,
        );
        return;
      }
      dispatch({ type: "UPDATE", id, delta });
    },
    [cart, GetStock, PushNotification, ShowToast],
  );

  const RemoveItem = useCallback(
    (id) => {
      const item = cart.find((entry) => entry.id === id);
      dispatch({ type: "REMOVE", id });
      if (item) {
        ShowToast("Item dihapus", `${item.name} keluar dari keranjang.`, "warning");
        PushNotification(
          "cart",
          "Item dihapus",
          `${item.name} dihapus dari keranjang.`,
        );
      }
    },
    [cart, PushNotification, ShowToast],
  );

  const ClearCart = useCallback(() => {
    if (cart.length === 0) return;
    dispatch({ type: "CLEAR" });
    setPromo(null);
    ShowToast("Keranjang dikosongkan", "Semua item sudah dihapus.", "warning");
    PushNotification(
      "cart",
      "Keranjang dikosongkan",
      "Semua item di keranjang telah dihapus.",
    );
  }, [cart.length, PushNotification, setPromo, ShowToast]);

  const ApplyPromo = useCallback(
    (code) => {
      const found = GetPromo(code);
      if (!found) {
        ShowToast(
          "Kode promo tidak valid",
          "Coba UTS25, HEMAT10, atau KOPI15.",
          "warning",
        );
        PushNotification(
          "promo",
          "Promo gagal",
          `Kode ${String(code || "").toUpperCase() || "kosong"} tidak dikenali.`,
        );
        return false;
      }
      setPromo(found);
      ShowToast(
        "Promo aktif",
        `${found.code} memberi potongan ${found.percent}%.`,
        "promo",
      );
      PushNotification(
        "promo",
        "Promo aktif",
        `Kode ${found.code} dipakai untuk potongan ${found.percent}%.`,
      );
      return true;
    },
    [PushNotification, setPromo, ShowToast],
  );

  const RemovePromo = useCallback(() => {
    setPromo(null);
    ShowToast("Promo dilepas", "Harga kembali ke harga normal.", "warning");
    PushNotification("promo", "Promo dilepas", "Kode promo dihapus.");
  }, [PushNotification, setPromo, ShowToast]);

  const totals = useMemo(() => CalculateTotals(cart, promo), [cart, promo]);

  const Checkout = useCallback(() => {
    if (cart.length === 0) {
      ShowToast("Keranjang kosong", "Tambahkan menu sebelum checkout.", "warning");
      return null;
    }

    const order = {
      id: `TS-${Date.now().toString().slice(-6)}`,
      items: cart.map((item) => ({ ...item })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      tax: totals.tax,
      total: totals.total,
      promoCode: promo?.code ?? null,
      paidAt: Date.now(),
      method: "QRIS",
    };

    setStock((previous) => {
      const next = { ...previous };
      cart.forEach((item) => {
        next[item.id] = Math.max(0, (next[item.id] ?? 0) - item.qty);
      });
      return next;
    });
    setOrders((previous) => [order, ...previous]);
    dispatch({ type: "CLEAR" });
    setPromo(null);
    ShowToast("Pesanan dibayar", `Struk ${order.id} siap dilihat.`, "order");
    PushNotification(
      "order",
      "Pesanan dibayar",
      `Struk ${order.id} tersimpan di riwayat.`,
    );
    return order;
  }, [
    cart,
    promo,
    PushNotification,
    setOrders,
    setPromo,
    setStock,
    ShowToast,
    totals,
  ]);

  const ResetAll = useCallback(() => {
    setStock({ ...InitialStock });
    setOrders([]);
    setPromo(null);
    dispatch({ type: "CLEAR" });
    ShowToast(
      "Data direset",
      "Stok dan riwayat kembali ke kondisi awal.",
      "reset",
    );
    PushNotification(
      "reset",
      "Stok & riwayat direset",
      "Semua stok dan riwayat pesanan dikembalikan ke awal.",
    );
  }, [PushNotification, setOrders, setPromo, setStock, ShowToast]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      cartCount,
      stock,
      GetStock,
      AddToCart,
      UpdateQty,
      RemoveItem,
      ClearCart,
      promo,
      ApplyPromo,
      RemovePromo,
      totals,
      Checkout,
      orders,
      ResetAll,
      isCartOpen,
      OpenCart,
      CloseCart,
    }),
    [
      cart,
      cartCount,
      stock,
      GetStock,
      AddToCart,
      UpdateQty,
      RemoveItem,
      ClearCart,
      promo,
      ApplyPromo,
      RemovePromo,
      totals,
      Checkout,
      orders,
      ResetAll,
      isCartOpen,
      OpenCart,
      CloseCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
