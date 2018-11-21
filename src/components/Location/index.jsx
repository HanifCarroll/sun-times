import React from "react";
import styles from "./styles.module.scss";

export const Location = ({ geoInfo: { name, city, state, country } }) => {
  let locationString = "";
  name ? (locationString += `${name}`) : (locationString += "");
  city && city !== name
    ? (locationString += `, ${city}`)
    : (locationString += "");
  state && state !== name
    ? (locationString += `, ${state}`)
    : (locationString += "");
  country && country !== name
    ? (locationString += `, ${country}`)
    : (locationString += "");

  return (
    <div className={styles.container}>
      <p className={styles.location}>{locationString}</p>
    </div>
  );
};
