"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import headerStyles from "./header.module.css";

const logo = "/images/logo.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={headerStyles.header}>
      <div className={headerStyles.logoContainer}>
        <Link href="/">
          <Image
            src={logo}
            alt="Logo"
            width={100}
            height={100}
            className={headerStyles.logoImage}
          />
        </Link>
        <button
          className={`${headerStyles.menuButton} ${menuOpen ? headerStyles.open : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      <nav
        className={`${headerStyles.nav} ${
          menuOpen ? headerStyles.navOpen : ""
        }`}
      >
        <ul className={headerStyles.navList}>
          <li className={`navItem ${pathname === "/" ? "active" : ""}`}>
            <Link href="/">Home</Link>
          </li>
          <li
            className={`navItem ${
              pathname.startsWith("/photobooth") ? "active" : ""
            }`}
          >
            <Link href="/photobooth">Photobooth</Link>
          </li>
          <li
            className={`navItem ${
              pathname.startsWith("/about") ? "active" : ""
            }`}
          >
            <Link href="/about">About</Link>
          </li>
          <li
            className={`navItem ${
              pathname.startsWith("/references") ? "active" : ""
            }`}
          >
            <Link href="/references">References</Link>
          </li>
          <li
            className={`navItem ${
              pathname.startsWith("/user") ? "active" : ""
            }`}
          >
            <Link href="/user">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}