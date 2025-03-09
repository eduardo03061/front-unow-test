export const dateFormat = (dateIso: string) => {
  const fecha = new Date(dateIso);

  const day = String(fecha.getUTCDate()).padStart(2, "0");
  const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const year = fecha.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export const dateFormatInput = (dateIso: string) => {
  const fecha = new Date(dateIso);

  const day = String(fecha.getUTCDate()).padStart(2, "0");
  const month = String(fecha.getUTCMonth() + 1).padStart(2, "0");
  const year = fecha.getUTCFullYear();

  return `${year}-${month}-${day}`;
};
