import { createContext, useContext } from "react";

export const CartContext = createContext(null);

export const UseCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("UseCart harus dipakai di dalam CartProvider");
  }
  return context;
};
