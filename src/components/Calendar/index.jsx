import React from "react";
import ReactCalendar from "react-calendar";
import styles from "./styles.module.scss";

export const Calendar = ({ onChange }) => {
  return (
    <div className={styles.container}>
      <ReactCalendar className={styles.calendar} onChange={onChange} />
    </div>
  );
};
