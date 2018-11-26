import React from "react";
import ReactCalendar from "react-calendar";
import styles from "./styles.module.scss";

export const Calendar = ({ onChange, isCalendarOpen }) => {
  return (
    <div
      className={styles.container}
      style={{ display: isCalendarOpen ? "flex" : "none" }}
    >
      <ReactCalendar
        className={styles.calendar}
        onChange={onChange}
        calendarType="US"
      />
    </div>
  );
};
