import { Injectable, NotFoundException } from "@nestjs/common";
import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { UpdateContentDto } from "./dto/update-content.dto";

type ContentPageView = { slug: string; title: string; data: Record<string, unknown> };

@Injectable()
export class ContentService {
  private readonly db: Database.Database;

  constructor() {
    const dbPath = resolve(process.cwd(), "data", "content.db");
    mkdirSync(dirname(dbPath), { recursive: true });
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS content_pages (slug TEXT PRIMARY KEY, title TEXT NOT NULL, data TEXT NOT NULL, updated_at TEXT NOT NULL)",
    );
    this.seedDefaults();
  }

  private seedDefaults(): void {
    const now = new Date().toISOString();
    const defaults: Array<{ slug: string; title: string; data: Record<string, unknown> }> = [
      {
        slug: "home-hero",
        title: "Главный экран",
        data: {
          heading: "Послесловие к вашему дню",
          leadLine1: "Энергия природы в каждой бомбочке для ванны",
          leadLine2: "Внимание и забота к каждой минуте наедине с собой",
          ctaLabel: "Оформить заказ",
        },
      },
      {
        slug: "home-feature-cards",
        title: "Карточки преимуществ",
        data: {
          cards: [
            {
              title: "Природа в чистом виде",
              description:
                "Никакой агрессивной химии. Ручная сборка, натуральные масла и компоненты, которые мы тщательно отбираем сами.",
              icon: "/images/desktop-29/icon-nature.png",
            },
            {
              title: "Сюрприз в каждом заказе",
              description:
                "Наши художники и писатели запечатали внутри культурный опыт и волшебство момента",
              icon: "/images/desktop-29/icon-gift.png",
            },
            {
              title: "Дизайн по вашим правилам",
              description:
                "От цвета упаковки до теплых пожеланий на вкладыше. Мы полностью адаптируем внешний вид упаковки под эстетику вашего бренда",
              icon: "/images/desktop-29/icon-success.png",
            },
          ],
        },
      },
      {
        slug: "home-process-sections",
        title: "Секции процесса",
        data: {
          sections: [
            {
              eyebrow: "Продукция",
              title: "Как мы делаем бомбочки для ванн?",
              description:
                "Каждая бомбочка сделана в ручную. В составе исключительно натуральные ингредиенты, прошедшие сертификацию в лаборатории. Мы не экономим на вас, главное принести реальную пользу",
              reverse: false,
              gallery: "bombs",
            },
            {
              eyebrow: "Натуральные масла",
              title: "Собираем лаванду вручную",
              description:
                "Наши партнеры собирают лаванду и изготавливают масло в ручную. Букет из 50 сортов лаванды в каждой бомбочке.",
              reverse: true,
              gallery: "lavender",
            },
            {
              eyebrow: "Продукция",
              title: "Упаковываем с любовью",
              description:
                "Мы нанесем ваш логотип на упаковку, вы выберите цвет сургучной печати. Мы возьмем на себя все технические моменты, чтобы вы получили готовый брендированный бокс, соответствующий эстетике и духу вашей компании",
              reverse: false,
              gallery: "packs",
              button: "Сделать заказ",
            },
          ],
        },
      },
      {
        slug: "home-why-us",
        title: "Секция Почему выбирают нас",
        data: {
          title: "Почему выбирают нас?",
          backgroundImage: "/images/desktop-29/why-us.jpg",
          reasons: [
            {
              title: "Чистый состав",
              description: "Только органические масла и настоящие сухоцветы",
              icon: "/images/desktop-29/icon-nature.png",
            },
            {
              title: "Гарантия качества",
              description: "Ручная сборка и контроль каждой партии",
              icon: "/images/desktop-29/icon-success.png",
            },
            {
              title: "Креативный подарок",
              description: "Приятный сюрприз и культурный опыт в каждом наборе",
              icon: "/images/desktop-29/icon-gift.png",
            },
          ],
        },
      },
      {
        slug: "home-about",
        title: "Секция О нас",
        data: {
          kicker: "О нас",
          title: "Кто мы такие?",
          paragraphs: [
            "Послесловие — это команда амбициозных, творческих и талантливых людей, бесконечно целеустремленных и искренне увлеченных процессом создания подарков.",
            "Мы прилагаем максимум усилий, чтобы создать продукцию на уровень выше конкурентов. Именно поэтому с нами сотрудничают лидеры рынка в своих нишах.",
          ],
          image: "/images/desktop-29/bombs-1.jpg",
        },
      },
      {
        slug: "home-reviews",
        title: "Секция Отзывы",
        data: {
          title: "Нам доверяют",
          items: [
            {
              name: "Алиса Ч.",
              image: "/images/desktop-29/review-1.svg",
              text: "«Потрясающая бомбочка! Я очень привередлива к запахам и не люблю химозные отдушки, но тут аромат настоящей лаванды, как будто стоишь в поле. Растворяется мягко, кожу не сушит, сухоцветы смотрятся невероятно красиво. И самое главное — ванну после нее отмывать не нужно!»",
            },
            {
              name: "Мария П.",
              image: "/images/desktop-29/review-2.svg",
              text: "«Покупала набор в подарок. Все выглядит аккуратно и очень премиально: упаковка, аромат, сама идея маленького ритуала после долгого дня. Получательница была в восторге.»",
            },
            {
              name: "Владимир К.",
              image: "/images/desktop-29/review-3.svg",
              text: "«Искали эстетичные комплименты для подарочных боксов, заказали партию с нашим логотипом на упаковке. Качество превзошло ожидания, продукт делает распаковку особенной.»",
            },
            {
              name: "Анна С.",
              image: "/images/desktop-29/review-4.svg",
              text: "«Брала набор себе, чтобы отдохнуть от суеты. Очень эстетичный вид, чувствуется ручная работа и внимание к деталям. После тяжелого дня — идеальный способ расслабиться.»",
            },
          ],
        },
      },
      {
        slug: "home-cta",
        title: "Финальный CTA блок",
        data: {
          heading: "Наши наборы - ваш идеальный комплимент!",
          text: "Подарите минуты душевного равновесия и культурный опыт тем, кто вам важен",
          buttonLabel: "Оформить заказ",
          backgroundImage: "/images/desktop-29/cta.jpg",
        },
      },
      {
        slug: "home-galleries",
        title: "Галереи секций",
        data: {
          bombs: [
            { image: "/images/desktop-29/bombs-1.jpg", alt: "Мраморные бомбочки для ванны" },
            { image: "/images/desktop-29/bombs-2.jpg", alt: "Голубые бомбочки с лавандой" },
            { image: "/images/desktop-29/bombs-3.jpg", alt: "Бомбочка крупным планом" },
          ],
          lavender: [
            { image: "/images/desktop-29/product-2.svg", alt: "Лавандовая бомбочка для ванны" },
            { image: "/images/desktop-29/product-1.svg", alt: "Натуральные масла и сухоцветы" },
            { image: "/images/desktop-29/product-3.svg", alt: "Лавандовый блок" },
          ],
          packs: [
            { image: "/images/desktop-29/packs-1.jpg", alt: "Подарочная упаковка Послесловие" },
            { image: "/images/desktop-29/packs-2.jpg", alt: "Брендированный набор бомбочек" },
            { image: "/images/desktop-29/packs-3.jpg", alt: "Упакованные наборы для подарков" },
          ],
        },
      },
    ];

    for (const item of defaults) {
      this.db
        .prepare(
          "INSERT INTO content_pages (slug, title, data, updated_at) VALUES (@slug, @title, @data, @updatedAt) ON CONFLICT(slug) DO NOTHING",
        )
        .run({
          slug: item.slug,
          title: item.title,
          data: JSON.stringify(item.data),
          updatedAt: now,
        });
    }
  }

  async getPublicPage(slug: string): Promise<ContentPageView> {
    const row = this.db
      .prepare("SELECT slug, title, data FROM content_pages WHERE slug = ?")
      .get(slug) as { slug: string; title: string; data: string } | undefined;

    if (!row) {
      throw new NotFoundException(`Content page '${slug}' was not found`);
    }

    return {
      slug: row.slug,
      title: row.title,
      data: JSON.parse(row.data) as Record<string, unknown>,
    };
  }

  async upsertPage(
    slug: string,
    payload: UpdateContentDto,
    _actor: string,
  ): Promise<ContentPageView> {
    const title = payload.title ?? slug;
    const dataJson = JSON.stringify(payload.data);
    const now = new Date().toISOString();
    this.db
      .prepare(
        "INSERT INTO content_pages (slug, title, data, updated_at) VALUES (@slug, @title, @data, @updatedAt) ON CONFLICT(slug) DO UPDATE SET title = excluded.title, data = excluded.data, updated_at = excluded.updated_at",
      )
      .run({ slug, title, data: dataJson, updatedAt: now });

    return {
      slug,
      title,
      data: payload.data,
    };
  }
}
