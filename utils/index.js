export const currencyFormat = new Intl.NumberFormat("vi-VN", {
  currency: "VND",
  style: "currency",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
