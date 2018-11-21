import React from "react";
import styles from "./styles.module.scss";

export const Location = ({
  geoInfo: { name, city, state, country },
  error,
}) => {
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

  const errorText = () => <p className={styles.error}>{error}</p>;

  const locationText = () => (
    <p className={styles.location}>{locationString}</p>
  );
  const renderLocation = () => {
    return error ? errorText() : locationText();
  };

  return <div className={styles.container}> {renderLocation()}</div>;
};
