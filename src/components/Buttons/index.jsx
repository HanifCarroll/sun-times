import React from "react";
import styles from "./styles.module.scss";

export const Buttons = ({
  location,
  onLocationChange,
  getLocation,
  setLocation,
}) => {
  const onEnterPress = e => {
    if (e.key === "Enter" && location) {
      setLocation();
    }
  };
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        onKeyPress={e => onEnterPress(e)}
        type="text"
        value={location}
        onChange={onLocationChange}
        placeholder="Enter location..."
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={getLocation}>
          Use My Location
        </button>
      </div>
    </div>
  );
};
