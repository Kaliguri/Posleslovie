"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { productMap } from "@/entities/product/model/products";

type CartLine = {
  productId: string;
  quantity: number;
};

type CartItem = CartLine & {
  name: string;
  price: number;
};

type CartContextValue = {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "posleslovie-cart";

const CartContext = createContext<CartContextValue | null>(null);

const normalizeLines = (lines: CartLine[]) =>
  lines.filter((line) => line.quantity > 0 && productMap.has(line.productId));

const getInitialLines = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    const parsed = JSON.parse(saved) as CartLine[];
    return normalizeLines(parsed);
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [lines, setLines] = useState<CartLine[]>(getInitialLines);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((productId: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.productId === productId);

      if (existing) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }

      return [...current, { productId, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      normalizeLines(
        current.map((line) =>
          line.productId === productId ? { ...line, quantity } : line,
        ),
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const items = useMemo(
    () =>
      lines.flatMap((line) => {
        const product = productMap.get(line.productId);

        if (!product) {
          return [];
        }

        return [
          {
            ...line,
            name: product.name,
            price: product.price,
          },
        ];
      }),
    [lines],
  );

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      itemsCount,
      subtotal,
      isOpen,
      openCart,
      closeCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [
    addItem,
    clearCart,
    closeCart,
    isOpen,
    items,
    openCart,
    removeItem,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
