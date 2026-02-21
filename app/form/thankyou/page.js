"use client";

import { useRouter } from "next/navigation";
import styles from "./thanks.module.css"; // Make sure the CSS module exists
import Image from "next/image";

export default function ThankYou() {
    const router = useRouter();

    return (
        <div className={styles.thankYouContainer}>
            <div className={styles.overlay}>
                <h1 className={styles.title}>🎉 Thank You! 🎉</h1>
                <p className={styles.message}>
                    You can now be officially part of the <strong>Photobooth Contest</strong>! <br />
                    Your account has been successfully created, click the button to create amooozing photos
                </p>
                <button
                    className={styles.backButton}
                    onClick={() => router.push("/photobooth")} 
                >
                    🎊 Continue 🎊
                </button>
                
            </div>
        </div>
    );
}
