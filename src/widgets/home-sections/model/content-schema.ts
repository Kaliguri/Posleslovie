import { z } from "zod";

const processSlideSchema = z.object({
  image: z.string().min(1),
  alt: z.string().min(1),
});

export const homeHeroSchema = z.object({
  heading: z.string().min(1),
  leadLine1: z.string().min(1),
  leadLine2: z.string().min(1),
  ctaLabel: z.string().min(1),
  backgroundMediaType: z.enum(["video", "image"]).catch("image"),
  backgroundImage: z.string().min(1),
  backgroundImageMobile: z.string().optional(),
  backgroundImageTablet: z.string().optional(),
  backgroundVideo: z.string().default(""),
});

export const homeFeatureCardsSchema = z.object({
  sectionTitle: z.string().min(1),
  cards: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
  ),
});

export const homeFaqSchema = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  items: z
    .array(
      z.object({
        question: z.string().min(1),
        answer: z.string().min(1),
      }),
    )
    .min(1),
});

export const homeProcessSectionSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  reverse: z.boolean().default(false),
  button: z.string().optional(),
  buttonHref: z.string().optional(),
  slides: z.array(processSlideSchema).min(1),
});

export const homeWhyUsSchema = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  backgroundImage: z.string().min(1),
  reasons: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      icon: z.string().min(1),
    }),
  ),
});

export const homeAboutSchema = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  paragraphs: z.array(z.string().min(1)).min(1),
  image: z.string().min(1),
});

export const homeReviewsSchema = z.object({
  kicker: z.string().min(1),
  title: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string().min(1),
      mediaType: z.enum(["image", "video"]).catch("image"),
      image: z.string().min(1),
      video: z.string().optional().default(""),
      text: z.string().min(1),
    }),
  ),
});

export const homeCtaSchema = z.object({
  heading: z.string().min(1),
  text: z.string().min(1),
  buttonLabel: z.string().min(1),
  backgroundImage: z.string().min(1),
});

export const siteBehaviorSchema = z.object({
  enableGlobalOverlays: z.boolean().default(true),
  enableScrollAnimations: z.boolean().default(true),
});

export const siteProductsSchema = z.object({
  items: z.array(
    z.object({
      title: z.string().min(1),
      price: z.number().positive(),
      image: z.string().min(1),
    }),
  ),
});

export const homeGalleriesSchema = z.object({
  galleries: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().min(1),
        slides: z.array(processSlideSchema).min(1),
      }),
    )
    .default([]),
});

export const homeProcessSectionsSchema = z.object({
  sections: z.array(homeProcessSectionSchema).default([]),
});
