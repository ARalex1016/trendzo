export const buildSearchQuery = (search?: string, fields: string[] = []) => {
  if (!search || fields.length === 0) return {};
  const regex = new RegExp(search, "i");
  return { $or: fields.map((field) => ({ [field]: regex })) };
};
