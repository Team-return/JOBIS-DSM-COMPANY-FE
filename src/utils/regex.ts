export const regex = {
  phone_number: (value: string) =>
    value
      ?.replace(/[^0-9]/g, "")
      .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, ""),
  buisness_number: (value: string) =>
    value
      ?.replace(/[^0-9]/g, "")
      .replace(/^(\d{3})(\d{2})(\d{5})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, ""),
  date_number: (value: string) =>
    value
      ?.replace(/[^0-9]/g, "")
      .replace(/^(\d{4})(\d{2})(\d{2})$/g, "$1-$2-$3")
      .replace(/(-{1,2})$/g, ""),
};
