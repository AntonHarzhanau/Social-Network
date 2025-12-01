export const getInitials = (authorName?: string | null) => {
  if (!authorName) return "??";

  return authorName
    .trim()
    .split(/\s+/)
    .map((namePart) => namePart.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
};
