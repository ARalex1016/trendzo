import type { Model } from "mongoose";

export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

export const generateUniqueSlugs = async <T extends Record<string, unknown>>(
  model: Model<T>,
  field: keyof T & string,
  value: string,
  maxSuggestions = 5,
): Promise<string[]> => {
  const baseSlug = createSlug(value);

  if (!baseSlug) {
    throw new Error("Unable to generate slug.");
  }

  const suggestions: string[] = [];
  let counter = 0;

  while (suggestions.length < maxSuggestions) {
    const slug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`;

    const exists = await model.exists({
      [field]: slug,
    });

    if (!exists) {
      suggestions.push(slug);
    }

    counter++;
  }

  return suggestions;
};

export const isSlugAvailable = async <T extends Record<string, unknown>>(
  model: Model<T>,
  field: keyof T & string,
  slug: string,
): Promise<boolean> => {
  const exists = await model.exists({
    [field]: slug,
  });

  return !exists;
};
