"use client";

import React, { useState } from "react";  // ✅ Import React & useState
import { useRouter } from "next/navigation";  // ✅ Ensure correct useRouter import
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import styles from "./forgotPassword.module.css";
import Link from "next/link";
import { app } from "../data/firebaseConfig";  // ✅ Ensure correct path

const auth = getAuth(app);

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
    
        // ✅ Custom Regex for email validation
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
        if (!emailPattern.test(email.trim())) {
            setError("Invalid email format. Please enter a valid email address.");
            setSuccessMessage("");
            return;
        }
    
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setSuccessMessage("If your email exists, a password reset link has been sent.");
            setError("");
        } catch (error) {
            console.error("Password reset error:", error);
            let errorMessage = "Error sending reset email. Please try again.";
    
            if (error.code === "auth/user-not-found") {
                errorMessage = "No user found with this email.";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "Invalid email address.";
            } else if (error.code === "auth/too-many-requests") {
                errorMessage = "Too many requests. Try again later.";
            }
    
            setError(errorMessage);
            setSuccessMessage("");
        }
    };
    
    return (
        <section className={styles.forgotSection}>
            <div className={styles.forgotContainer}>
                <h2 className={styles.forgotTitle}>Forgot Password</h2>
                <p className={styles.forgotInstructions}>
                    Enter your email address below to receive a password reset link.
                </p>

                <form onSubmit={handleEmailSubmit}>
                    <label htmlFor="email" className={styles.forgotLabel}>
                        Email Address
                    </label>
                    <input
                        type="text"
                        id="email"
                        className={styles.forgotInput}
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                        spellCheck="false"
                    />


                    {error && <p className={styles.errorMessage}>{error}</p>}
                    {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

                    <div className={styles.buttonGroup}>
                        <Link href="/user" className={styles.backButton}>Back</Link>
                        <button type="submit" className={styles.submitButton}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ForgotPassword;
