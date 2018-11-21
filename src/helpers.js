import moment from "moment-timezone";
import CoordinateTZ from "coordinate-tz";

export const getTimezone = ({ lat, lng }) => {
  const { timezone } = CoordinateTZ.calculate(lat, lng);

  return timezone;
};

export const convertTimes = (timesArray, timezone) => {
  const format = "h:mm:ss A";

  return timesArray.map(time =>
    moment(time)
      .tz(timezone)
      .format(format),
  );
};

export const convertDate = date => {
  const format = "YYYY-MM-DD";
  return moment(date).format(format);
};

export const makeSunURL = ({ lat, lng, date }) => {
  let url = `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`;

  if (date) {
    url += `&date=${date}`;
  }

  return url;
};
