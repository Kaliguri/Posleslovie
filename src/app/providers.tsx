"use client";

import { type ReactNode } from "react";

import { CartProvider } from "@/features/cart/model/cart-context";
import { CartDrawer } from "@/features/cart/ui/cart-drawer";

export const Providers = ({ children }: { children: ReactNode }) => (
  <CartProvider>
    {children}
    <CartDrawer />
  </CartProvider>
);
