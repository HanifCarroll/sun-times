import React from "react";
import Loader from "react-loader-spinner";
import styles from "./styles.module.scss";

export const Spinner = () => {
  return (
    <div className={styles.container}>
      <Loader type="Oval" color="white" height={30} width={30} />
    </div>
  );
};
