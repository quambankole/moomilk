"use client";

import React from "react";
import styles from "./sticker.module.css"; 

const stickerData = [
    { image: "/images/stickers/dynamite.svg", title: "Dynamite Sticker" },
    { image: "/images/stickers/football.svg", title: "Football Sticker" },
    { image: "/images/stickers/gym.svg", title: "Gym Sticker" },
    { image: "/images/stickers/i-have-abs.svg", title: "Abs Sticker" },
    { image: "/images/stickers/kiwi.svg", title: "Kiwi Sticker" },
    { image: "/images/stickers/orange.svg", title: "Orange Sticker" },
    { image: "/images/stickers/pineapple.svg", title: "Pineapple Sticker" },
    { image: "/images/stickers/strawberry.svg", title: "Strawberry Sticker" },
    { image: "/images/stickers/sticker1.svg", title: "Gymmy Neutron Sticker" },
    { image: "/images/stickers/sticker2.svg", title: " Woth a Melon Sticker" },
    { image: "/images/stickers/sticker3.svg", title: "Challant Sticker" },
    { image: "/images/stickers/sticker4.svg", title: "Speech Sticker" }
];

export default function StickerGallery({ addSticker, stickersEnabled }) {
    return (
        <div className={styles.stickerContainer}>
            <h2>Choose a Sticker:</h2>
            <div className={styles.stickerGrid}>
                {stickerData.map((sticker, index) => (
                    <img 
                        key={index}
                        src={sticker.image} 
                        alt={sticker.title}
                        title={sticker.title}
                        className={`${styles.sticker} ${stickersEnabled ? styles.active : styles.disabled}`}
                        onClick={() => stickersEnabled && addSticker(sticker.image)}
                    />
                ))}
            </div>
        </div>
    );
}