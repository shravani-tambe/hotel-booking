export const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocalDateString("en-Us", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
