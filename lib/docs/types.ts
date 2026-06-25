import { z } from "zod";

export const docInputSchema = z.object({
  title: z.string().trim().min(1, "Укажите заголовок"),
  slug: z
    .string()
    .trim()
    .min(1, "Укажите slug")
    .regex(/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/, "Slug может содержать латиницу, цифры, / и -"),
  section: z.string().trim().min(1, "Укажите раздел"),
  navTitle: z.string().trim().min(1, "Укажите название в меню"),
  order: z.coerce.number().int().min(0),
  content: z.string().trim().min(1, "Добавьте текст страницы"),
});

export type DocInput = z.infer<typeof docInputSchema>;

export type DocPage = DocInput & {
  id: number;
  createdAt: string;
  updatedAt: string;
};
