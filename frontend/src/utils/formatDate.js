export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocalDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
