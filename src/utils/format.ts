const formatDuration = (duration?: number, language?: string) => {
  if (!duration) return "";

  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;

  if (language === "en") {
    return `${hours}h ${minutes}m`;
  }

  return `${hours}j ${minutes}m`;
};

const formatNumber = (number?: number) => {
  if (!number) return "";

  const formatter = new Intl.NumberFormat("id-ID", { notation: "compact" });

  return formatter.format(number);
};
export { formatDuration, formatNumber };
