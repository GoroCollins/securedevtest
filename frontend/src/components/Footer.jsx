import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faTwitter,
    faInstagram,
    faTiktok
  } from "@fortawesome/free-brands-svg-icons";
// import './Footer.css'; // Assuming you have a CSS file for the component

export default function Footer() {
  return (
    <>
    <div className="social-container">
    <p><strong>Email address:</strong><a href="mailto:test@gmail.com">test@gmail.com</a></p>
    <p><strong>Customer care:</strong><a href="tel:+254713396454">+254713396454</a></p>
      <h3>Follow Us</h3>
      <a href="https://www.facebook.com/share/C71Rpxx6wMNoAFWP/?mibextid=qi2Omg"
        className="facebook social"
        aria-label="Facebook">
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </a>
      {/* <a href="https://www.twitter.com/jamesqquick" className="twitter social" aria-label="Twitter">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </a> */}
      <a href="https://www.instagram.com/mobi_sandals/?igsh=bXF6ZmF4c25jcTJw"
        className="instagram social"
        aria-label="Instagram">
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
      <a href="https://www.tiktok.com/@mobi_handmade_sandals?_t=8nAaOLWe73F&_r=1" className="tiktok social" aria-label="TikTok">
        <FontAwesomeIcon icon={faTiktok} size="2x" />
      </a>
    </div>
    </>
  );
}
