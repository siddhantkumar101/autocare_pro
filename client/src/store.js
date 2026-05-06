import { create } from 'zustand';

export const useStore = create((set) => ({
  cartItems: [],
  setCartItems: (items) => set({ cartItems: items }),
  clearCart: () => set({ cartItems: [] }),
}));
