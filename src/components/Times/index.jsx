import React from "react";

export const Times = ({ times }) => {
  const { sunrise, noon, sunset } = times;

  return (
    <div className="times">
      <p>Sunrise - {sunrise}</p>
      <p>Solar Noon - {noon}</p>
      <p>Sunset - {sunset}</p>
    </div>
  );
};
