import slugify from "slugify";
import { Model, Document } from "mongoose";

export const generateUniqueSlugs = async <T extends Document>(
  model: Model<any>,
  field: keyof any,
  baseString: string,
  maxSuggestions = 5
): Promise<string[]> => {
  const baseSlug = slugify(baseString, { lower: true, strict: true });
  const slugs: string[] = [];
  let count = 0;

  while (slugs.length < maxSuggestions) {
    const slug = count === 0 ? baseSlug : `${baseSlug}-${count}`;
    const exists = await model.exists({ [field]: slug });
    if (!exists) slugs.push(slug);
    count++;
  }

  return slugs;
};

/**
 * Check if a slug is available
 * @param model Mongoose model
 * @param field Field to check
 * @param slug Slug to check
 */
export const isSlugAvailable = async <T extends Document>(
  model: Model<any>,
  field: keyof any,
  slug: string
): Promise<boolean> => {
  const exists = await model.exists({ [field]: slug });
  return !exists;
};
