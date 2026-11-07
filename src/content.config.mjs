import { existsSync } from 'node:fs';
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { RUBRIQUES } from './lib/rubriques.mjs';

// Les articles vivent dans le dépôt PRIVÉ intime-conviction-articles, cloné à
// côté de celui-ci. IC_ARTICLES permet de pointer ailleurs (hébergeur, CI).
const base = process.env.IC_ARTICLES ?? (existsSync('.site-content') ? '.site-content' : '../intime-conviction-articles/articles');

const articles = defineCollection({
  loader: glob({ pattern: '**/*.json', base, generateId: ({ data }) => String(data.slug) }),
  schema: z.object({
    titre: z.string(),
    slug: z.string(),
    date: z.coerce.date(),
    dateMiseAJour: z.coerce.date().optional(),
    verificationEnCours: z.boolean().optional(),
    chemin: z.string(),
    rubrique: z.enum(RUBRIQUES.map((r) => r.slug)),
    anciennesCategories: z.array(z.string()),
    auteur: z.string(),
    extrait: z.string(),
    mots: z.number(),
    html: z.string(),
  }),
});

export const collections = { articles };
