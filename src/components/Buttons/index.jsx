import React from "react";
import { IoMdLocate, IoMdCalendar } from "react-icons/io";
import styles from "./styles.module.scss";

export const Buttons = ({
  date,
  location,
  onLocationChange,
  getLocation,
  setLocation,
  isGPSActive,
  onCalendarToggle,
  isDatePicked,
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
        style={{ color: isGPSActive ? "#67d6ff" : "white" }}
      />
      <button
        id="location"
        className={styles.button}
        style={{ color: isGPSActive ? "#67d6ff" : "white" }}
        onClick={getLocation}
      >
        <IoMdLocate />
      </button>
      <div className={styles.calendarContainer}>
        <button
          id="date"
          className={styles.calendarButton}
          onClick={onCalendarToggle}
        >
          <p className={styles.dateText}>{date}</p>
          <IoMdCalendar className={styles.calendarIcon} />
        </button>
      </div>
    </div>
  );
};
