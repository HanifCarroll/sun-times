import React from "react";
import styles from "./styles.module.scss";

export const Buttons = ({
  location,
  onLocationChange,
  getTimes,
  getLocation,
  setLocation,
}) => {
  return (
    <div className={styles.container}>
      <button onClick={getLocation}>Use My Location</button>
      <input type="text" value={location} onChange={onLocationChange} />
      <button onClick={setLocation} disabled={!location}>
        Use Input Location
      </button>
    </div>
  );
};
