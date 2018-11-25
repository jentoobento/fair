import React from "react";
import footerCars from "../../images/car_lineup.png";
import "./Footer.css";

export const Footer = () => {
  return (
    <React.Fragment>
      <div>
        <img src={footerCars} alt="cars" id='footer-cars'/>
      </div>
      <div className="footer" />
    </React.Fragment>
  );
};
