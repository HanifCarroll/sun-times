import React from "react";
import styles from "./styles.module.scss";

export const Times = ({ times }) => {
  const { sunrise, noon, sunset } = times;

  return (
    <div className={styles.times}>
      <p>Sunrise - {sunrise}</p>
      <p>Solar Noon - {noon}</p>
      <p>Sunset - {sunset}</p>
    </div>
  );
};
