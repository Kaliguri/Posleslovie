export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  weight: string;
  badge?: string;
  image: {
    eyebrow: string;
    accent: string;
  };
};

export const products: Product[] = [
  {
    id: "gift-box-signature",
    slug: "signature",
    name: "Signature Box",
    shortDescription: "Фирменный набор для подарка, welcome pack или камерного события.",
    description:
      "Сбалансированный набор из гастрономических акцентов и эстетичной упаковки для личного заказа или корпоративного подарка.",
    price: 4900,
    weight: "1,2 кг",
    badge: "Хит",
    image: {
      eyebrow: "Коллекция 01",
      accent: "from-amber-200 via-rose-100 to-stone-100",
    },
  },
  {
    id: "gift-box-garden",
    slug: "garden",
    name: "Garden Ritual",
    shortDescription: "Легкий подарочный сет с флористическим настроением.",
    description:
      "Подходит для сезонных поздравлений, небольших мероприятий и комплиментов партнерам.",
    price: 6200,
    weight: "1,5 кг",
    image: {
      eyebrow: "Коллекция 02",
      accent: "from-emerald-200 via-lime-100 to-stone-100",
    },
  },
  {
    id: "gift-box-night",
    slug: "night",
    name: "Velvet Night",
    shortDescription: "Насыщенный набор с акцентом на вечернюю подачу.",
    description:
      "Выразительное решение для ужина, небольшого праздника или подарка с характером.",
    price: 7800,
    weight: "1,8 кг",
    badge: "Новинка",
    image: {
      eyebrow: "Коллекция 03",
      accent: "from-zinc-300 via-stone-200 to-rose-100",
    },
  },
  {
    id: "gift-box-grand",
    slug: "grand",
    name: "Grand Ceremony",
    shortDescription: "Премиальный сет для особых случаев и VIP-подарков.",
    description:
      "Флагманская позиция для свадеб, корпоративных событий и брендированных подарков.",
    price: 11200,
    weight: "2,6 кг",
    image: {
      eyebrow: "Коллекция 04",
      accent: "from-fuchsia-200 via-orange-100 to-stone-100",
    },
  },
];

export const productMap = new Map(products.map((product) => [product.id, product]));
