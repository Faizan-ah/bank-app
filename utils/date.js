import moment from "moment";
const FORMAT = "D/MM/YY, hh:mm a";

export const convertTimeZoneToDateFormat = (date) => {
  return moment().format(FORMAT, date);
};
