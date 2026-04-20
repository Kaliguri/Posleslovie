import { type Product } from "@/entities/product/model/products";
import { AddToCartButton } from "@/features/cart/ui/add-to-cart-button";
import { formatPrice } from "@/shared/lib/format";

export const ProductCard = ({ product }: { product: Product }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm shadow-stone-950/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-950/10">
    <div
      className={`relative flex min-h-60 flex-col justify-between bg-gradient-to-br ${product.image.accent} p-6`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-700 backdrop-blur">
          {product.image.eyebrow}
        </span>
        {product.badge ? (
          <span className="rounded-full bg-stone-950 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
            {product.badge}
          </span>
        ) : null}
      </div>
      <div className="max-w-56 rounded-[1.5rem] border border-white/50 bg-white/60 p-4 backdrop-blur">
        <p className="text-sm leading-6 text-stone-600">{product.description}</p>
      </div>
    </div>

    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-stone-950">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-500">
            {product.shortDescription}
          </p>
        </div>
        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
          {product.weight}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-lg font-semibold text-stone-950">
          {formatPrice(product.price)}
        </p>
        <AddToCartButton productId={product.id} />
      </div>
    </div>
  </article>
);
