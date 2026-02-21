"use client";

import footerStyle from "./footer.module.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const logo = "/images/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={footerStyle.footer}>
      {/* Logo */}
      <div className={footerStyle.logoContainer}>
        <Image
          src={logo}
          alt="Moo Milk logo"
          width={120}
          height={120}
          className={footerStyle.logoImage}
        />
      </div>

      {/* Copyright */}
      <p className={footerStyle.copyright}>
        © {year} Moo Milk. All rights reserved.
      </p>

      {/* Social icons */}
      <div className={footerStyle.socialMedia}>
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} />
        </a>

        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
      </div>
    </footer>
  );
}
