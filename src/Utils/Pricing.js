export const PromoCodes = {
  UTS25: 25,
  HEMAT10: 10,
  KOPI15: 15,
};

export const TaxRate = 0.1;

export const FormatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const FormatDate = (timestamp) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));

export const GetPromo = (code) => {
  const normalized = String(code || "").trim().toUpperCase();
  const percent = PromoCodes[normalized];
  if (!percent) return null;
  return { code: normalized, percent };
};

export const CalculateTotals = (cart, promo) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promo ? Math.round((subtotal * promo.percent) / 100) : 0;
  const tax = Math.round((subtotal - discount) * TaxRate);
  return {
    subtotal,
    discount,
    tax,
    total: subtotal - discount + tax,
  };
};
