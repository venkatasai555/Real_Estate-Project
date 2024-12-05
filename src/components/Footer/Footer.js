import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="first-col">
        <h1 className="company-name">DJ Dream Homes</h1>
        <div className="company-description">
          <h4>
            Discover your dream home with DJ Real Estate! Offering exceptional
            properties, personalized service, and expert guidance to make your
            home-buying journey seamless.
          </h4>
        </div>
      </div>
      <div className="second-col">
        <h2 className="link-header">Contact</h2>
        <ul className="link-items">
          <li>Hyderabad, India</li>
          <li>djestates@gmail.com</li>
          <li>+91 6767453210</li>
          <li>+056 939689223</li>
        </ul>
      </div>
    </footer>
  );
}
