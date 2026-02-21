"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./photobooth.module.css";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../data/firebaseConfig";
import { gsap } from "gsap";
import * as Tone from "tone";
import Sticker from "../component/stickers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-regular-svg-icons";

export default function PhotoBooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const stickerCanvasRef = useRef(null);
  const countdownRef = useRef(null);

  const [filter, setFilter] = useState("none");
  const [stickers, setStickers] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showButtons, setShowButtons] = useState(false);

  const [showVideo, setShowVideo] = useState(true);
  const [showCaptureButton, setShowCaptureButton] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [showCanvasContainer, setShowCanvasContainer] = useState(false);
  const [stickersEnabled, setStickersEnabled] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [showClearStickersButton, setShowClearStickersButton] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showStickers, setShowStickers] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported on this device.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true);
        videoRef.current.setAttribute("autoplay", true);
        videoRef.current.setAttribute("muted", true);
        videoRef.current.style.display = "block";
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.style.filter = getCSSFilter(filter);
    }
  }, [filter]);

  useEffect(() => {
    drawStickers();
  }, [stickers]);

  const applyFilter = (pixels, filter) => {
    for (let i = 0; i < pixels.data.length; i += 4) {
      let r = pixels.data[i],
        g = pixels.data[i + 1],
        b = pixels.data[i + 2];
      if (filter === "grayscale") {
        let avg = (r + g + b) / 3;
        pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = avg;
      } else if (filter === "sepia") {
        pixels.data[i] = r * 0.393 + g * 0.769 + b * 0.189;
        pixels.data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
        pixels.data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
      } else if (filter === "invert") {
        pixels.data[i] = 255 - r;
        pixels.data[i + 1] = 255 - g;
        pixels.data[i + 2] = 255 - b;
      } else if (filter === "contrast") {
        let factor = (259 * (200 + 255)) / (255 * (259 - 200));
        pixels.data[i] = factor * (r - 128) + 128;
        pixels.data[i + 1] = factor * (g - 128) + 128;
        pixels.data[i + 2] = factor * (b - 128) + 128;
      } else if (filter === "blue") {
        pixels.data[i] = 0.1 * r + 0.2 * g + 0.5 * b;
        pixels.data[i + 1] = 0.2 * r + 0.3 * g + 0.7 * b;
        pixels.data[i + 2] = 0.3 * r + 0.5 * g + 1.4 * g;

        // pixels.data[i + 0] = pixels.data[i + 100];
        // pixels.data[i + 1] = pixels.data[i + 1];
        // pixels.data[i + 2] = pixels.data[i + 202];
      }
    }

    return pixels;
  };

  const playBeep = async () => {
    await Tone.start();
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease("C5", "8n");
  };

  const getCSSFilter = (filter) => {
    const filters = {
      grayscale: "grayscale(100%)",
      sepia: "sepia(100%)",
      invert: "invert(100%)",
      contrast: "contrast(200%)",
      blue: "hue-rotate(180deg)",
    };
    return filters[filter] || "none";
  };

  const playShutterSound = async () => {
    try {
      await Tone.start();

      const noise = new Tone.NoiseSynth({
        noise: { type: "white" },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0 },
      }).toDestination();

      noise.triggerAttackRelease(0.1);
    } catch (error) {
      console.error("Error playing shutter sound:", error);
    }
  };

  const captureWithCountdown = () => {
    let count = 3;
    setCountdown(count);
    setShowCaptureButton(false);

    playBeep();

    const countdownInterval = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count > 0) {
        playBeep();
      }

      if (countdownRef.current) {
        gsap.fromTo(
          countdownRef.current,
          { scale: 2, opacity: 1 },
          { scale: 1, opacity: 0, duration: 0.8 }
        );
      }

      if (count === 0) {
        clearInterval(countdownInterval);

        playShutterSound();

        setTimeout(() => captureImage(), 500);
      }
    }, 1000);
  };

  const clearStickers = () => {
    setStickers([]);
  };
  const addSticker = (stickerImage) => {
    const img = new Image();
    img.src = stickerImage;

    img.onload = () => {
      setStickers((prev) => [
        ...prev,
        {
          img,
          x: 50,
          y: 50,
          width: 100,
          height: 100,
        },
      ]);
    };

    img.onerror = () => {
      console.error(`Error loading sticker: ${stickerImage}`);
    };
  };

  const drawStickers = () => {
    const context = stickerCanvasRef.current?.getContext("2d");
    if (!context) return;
    context.clearRect(
      0,
      0,
      stickerCanvasRef.current.width,
      stickerCanvasRef.current.height
    );
    stickers.forEach((sticker) => {
      context.drawImage(
        sticker.img,
        sticker.x,
        sticker.y,
        sticker.width,
        sticker.height
      );
    });
  };

  const handleMouseDown = (event) => {
    const rect = stickerCanvasRef.current.getBoundingClientRect();
    const scaleX = stickerCanvasRef.current.width / rect.width;
    const scaleY = stickerCanvasRef.current.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    for (let i = stickers.length - 1; i >= 0; i--) {
      let sticker = stickers[i];
      if (
        mouseX >= sticker.x &&
        mouseX <= sticker.x + sticker.width &&
        mouseY >= sticker.y &&
        mouseY <= sticker.y + sticker.height
      ) {
        setIsDragging(true);
        setDragIndex(i);
        setOffset({ x: mouseX - sticker.x, y: mouseY - sticker.y });
        return;
      }
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging || dragIndex === null) return;

    const rect = stickerCanvasRef.current.getBoundingClientRect();
    const scaleX = stickerCanvasRef.current.width / rect.width;
    const scaleY = stickerCanvasRef.current.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;
    setStickers((prevStickers) =>
      prevStickers.map((sticker, index) =>
        index === dragIndex
          ? {
              ...sticker,
              x: Math.max(
                0,
                Math.min(
                  mouseX - offset.x,
                  stickerCanvasRef.current.width - sticker.width
                )
              ), // Keep inside bounds
              y: Math.max(
                0,
                Math.min(
                  mouseY - offset.y,
                  stickerCanvasRef.current.height - sticker.height
                )
              ), // Keep inside bounds
            }
          : sticker
      )
    );
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragIndex(null);
  };

  const handleDoubleClick = (event) => {
    const rect = stickerCanvasRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    setStickers((prev) =>
      prev.filter(
        (sticker) =>
          !(
            mouseX >= sticker.x &&
            mouseX <= sticker.x + sticker.width &&
            mouseY >= sticker.y &&
            mouseY <= sticker.y + sticker.height
          )
      )
    );
  };

  useEffect(() => {
    const stickerCanvas = stickerCanvasRef.current;
    if (!stickerCanvas) return;

    const handleTouchStart = (event) => {
      event.preventDefault();

      const rect = stickerCanvas.getBoundingClientRect();
      const touch = event.changedTouches[0];
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;

      for (let i = stickers.length - 1; i >= 0; i--) {
        let sticker = stickers[i];
        if (
          touchX >= sticker.x &&
          touchX <= sticker.x + sticker.width &&
          touchY >= sticker.y &&
          touchY <= sticker.y + sticker.height
        ) {
          setIsDragging(true);
          setDragIndex(i);
          setOffset({ x: touchX - sticker.x, y: touchY - sticker.y });

          setStickers((prevStickers) =>
            prevStickers.map((s, index) =>
              index === i
                ? {
                    ...s,
                    originalWidth: s.width,
                    originalHeight: s.height,
                    width: s.width * 1.2,
                    height: s.height * 1.2,
                  }
                : s
            )
          );
          break;
        }
      }
    };

    const handleTouchMove = (event) => {
      if (!isDragging || dragIndex === null) return;
      event.preventDefault();

      const rect = stickerCanvas.getBoundingClientRect();
      const touch = event.changedTouches[0];

      setStickers((prevStickers) =>
        prevStickers.map((s, index) =>
          index === dragIndex
            ? {
                ...s,
                x: touch.clientX - rect.left - offset.x,
                y: touch.clientY - rect.top - offset.y,
              }
            : s
        )
      );
    };

    const handleTouchEnd = () => {
      if (isDragging && dragIndex !== null) {
        setStickers((prevStickers) =>
          prevStickers.map((s, index) =>
            index === dragIndex
              ? { ...s, width: s.originalWidth, height: s.originalHeight }
              : s
          )
        );
      }
      setIsDragging(false);
      setDragIndex(null);
    };

    stickerCanvas.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    stickerCanvas.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    stickerCanvas.addEventListener("touchend", handleTouchEnd, {
      passive: false,
    });
    stickerCanvas.addEventListener("touchcancel", handleTouchEnd, {
      passive: false,
    });

    return () => {
      stickerCanvas.removeEventListener("touchstart", handleTouchStart);
      stickerCanvas.removeEventListener("touchmove", handleTouchMove);
      stickerCanvas.removeEventListener("touchend", handleTouchEnd);
      stickerCanvas.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [stickers, isDragging, dragIndex, offset]);

  const captureImage = async () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video) {
      console.error("Canvas or video element is missing!");
      return;
    }

    if (video.readyState < 2) {
      console.error("Video is not ready yet!");
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      console.error("Failed to get 2D context for canvas");
      return;
    }

    context.filter = getCSSFilter(filter);

    // Draw the video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    let pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    pixels = applyFilter(pixels, filter);
    context.putImageData(pixels, 0, 0);

    setShowClearStickersButton(true);
    context.drawImage(stickerCanvasRef.current, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");
    setCapturedImage(imageUrl);

    console.log("Image captured but NOT uploaded. Waiting for user to save...");
    setShowSaveButton(true);
    setShowVideo(false);
    stopCamera();
    setShowButtons(true);
    setShowCanvasContainer(true);
    setShowCaptureButton(false);
    setStickersEnabled(true);
    setShowDownloadButton(true);
  };

  const handleSaveToFirebase = async () => {
    if (!canvasRef.current || !stickerCanvasRef.current) {
      console.error("Canvas references are missing.");
      return;
    }

    setIsUploading(true);

    try {
      const mergedCanvas = document.createElement("canvas");
      mergedCanvas.width = canvasRef.current.width;
      mergedCanvas.height = canvasRef.current.height;
      const mergedContext = mergedCanvas.getContext("2d");

      mergedContext.drawImage(canvasRef.current, 0, 0);
      mergedContext.drawImage(stickerCanvasRef.current, 0, 0);

      const mergedImageUrl = mergedCanvas.toDataURL("image/png");
      const response = await fetch(mergedImageUrl);
      const blob = await response.blob();

      const imageRef = ref(storage, `photos/${Date.now()}.png`);
      await uploadBytes(imageRef, blob);

      console.log("✅ Image with stickers saved to Firebase successfully!");
      setShowSaveButton(false);
    } catch (error) {
      console.error("❌ Error uploading image to Firebase:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRetake = () => {
    setShowButtons(false);
    setShowVideo(true);
    setShowCanvasContainer(false);
    setStickers([]);
    setShowClearStickersButton(false);
    startCamera();
    setShowSaveButton(false);

    setFilter("none");

    if (videoRef.current) {
      videoRef.current.style.filter = "none";
    }

    if (canvasRef.current) {
      canvasRef.current.classList.remove(styles.help);
    }

    setShowCaptureButton(true);
    setStickersEnabled(false);
    setShowDownloadButton(false);
  };

  const downloadImage = () => {
    if (!canvasRef.current || !stickerCanvasRef.current) return;
    const mergedCanvas = document.createElement("canvas");
    mergedCanvas.width = canvasRef.current.width;
    mergedCanvas.height = canvasRef.current.height;
    const mergedContext = mergedCanvas.getContext("2d");

    mergedContext.drawImage(canvasRef.current, 0, 0);

    mergedContext.drawImage(stickerCanvasRef.current, 0, 0);

    const mergedImageUrl = mergedCanvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = mergedImageUrl;
    link.download = "photo_with_stickers.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setShowStickers(false);
  };
  const handleOpen = () => {
    setShowStickers(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.photoboothcontainer}>
        <h1 className={styles.h1}>
          Choose a filter & take a picture before you can customize it with
          stickers!
        </h1>
        <img src="/images/Vector.svg"></img>

        <div className={styles.canvasContainer}>
          {showVideo && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width="640"
              height="480"
              className={styles.video}
            />
          )}
          <div className={styles.emojiButton} onClick={handleOpen}>
            <FontAwesomeIcon icon={faFaceSmile} size="3x" />
          </div>
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className={styles.canvas}
          ></canvas>
          <canvas
            ref={stickerCanvasRef}
            width="640"
            height="480"
            className={styles.stickerCanvas}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDoubleClick={handleDoubleClick}
          ></canvas>

          {showCaptureButton && (
            <div
              onClick={captureWithCountdown}
              className={styles.captureButton}
            >
              <div className={styles.innerCaptureButton}></div>
            </div>
          )}
        </div>

        {showCaptureButton && (
          <div className={styles.initialButtons}>
            <select
              onChange={(e) => setFilter(e.target.value)}
              className={styles.filters}
            >
              <option value="none">None</option>
              <option value="grayscale">Grayscale</option>
              <option value="sepia">Sepia</option>
              <option value="invert">Invert</option>
              <option value="contrast">High Contrast</option>
              <option value="blue">Chameleon</option>
            </select>
          </div>
        )}

        {countdown > 0 && (
          <h2 ref={countdownRef} className={styles.countdown}>
            {countdown}
          </h2>
        )}

        <div className={styles.photoboothbuttons}>
          {showSaveButton && (
            <button
              onClick={handleSaveToFirebase}
              className={`${styles.uploadButton} ${
                showSaveButton ? styles.showUpload : ""
              }`}
            >
              Upload Image
            </button>
          )}
          {showButtons && (
            <button onClick={handleRetake} className={styles.retakeButton}>
              Retake
            </button>
          )}
          {showDownloadButton && (
            <button onClick={downloadImage} className={styles.downloadButton}>
              Download
            </button>
          )}
          {showClearStickersButton && (
            <button onClick={clearStickers} className={styles.stickerButton}>
              Clear Stickers
            </button>
          )}
        </div>
      </div>

      <div
        className={`${styles.stickerContainer} ${
          !showStickers ? styles.hidden : styles.show
        }`}
      >
        <div className={styles.stickerClose} onClick={handleClose}>
          <span></span>
          <span></span>
        </div>
        <Sticker addSticker={addSticker} stickersEnabled={stickersEnabled} />
      </div>
    </div>
  );
}
