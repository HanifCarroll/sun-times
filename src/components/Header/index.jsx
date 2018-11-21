import React from "react";
import styles from "./styles.module.scss";

export const Header = props => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Sun Times</h1>
    </div>
  );
};
