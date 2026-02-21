"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../data/firebaseConfig";
import Link from "next/link";
import Image from "next/image";
import styles from "./login.module.css";

// Shared guest credentials
const GUEST_EMAIL = "chinu@gmail.com";
const GUEST_PASSWORD = "1234567GOOD!k";

export default function User() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/photobooth");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    }
  };

  const handleGuestLogin = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, GUEST_EMAIL, GUEST_PASSWORD);
      router.push("/photobooth");
    } catch (err) {
      console.error("Guest login failed:", err);
      setError("Could not sign in as guest. Please try again.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) {
    return <p className={styles.loadingText}>Checking authentication...</p>;
  }

  if (user) {
    const isGuest = user.email === GUEST_EMAIL;

    return (
      <section className={styles.loggedInSection}>
        <div className={styles.loggedInContainer}>
          <h2 className={styles.loggedInTitle}>Mooooooooooo</h2>

          <div className={styles.profilePictureContainer}>
            <Image
              src={user.photoURL || "/images/userIcon.png"}
              alt="User Profile"
              width={80}
              height={80}
              className={styles.profilePicture}
            />
          </div>

          <p className={styles.loggedInText}>
            You are logged in as{" "}
            <span className={styles.userEmail}>
              {isGuest ? "Guest" : user.email}
            </span>
          </p>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Log Out
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.formSection}>
      <form className={styles.formContainer} onSubmit={handleSubmit}>
        <h2 className={styles.logInTitle}>Log In</h2>

        <div className={styles.inputGroup}>
          <label htmlFor="email">Email Address</label>
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
          <Link href="/forgot-password" className={styles.forgotPassword}>
            Forgot Password?
          </Link>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.buttonRow}>
          <button type="submit" className={styles.submitButton}>
            Login
          </button>

          <button
            type="button"
            className={styles.guestButton}
            onClick={handleGuestLogin}
          >
            Guest
          </button>
        </div>

        <p className={styles.createAccountText}>
          Don't have an account?
          <Link href="/form" className={styles.createAccountLink}>
            {" "}
            Sign up
          </Link>
        </p>
      </form>
    </section>
  );
}
