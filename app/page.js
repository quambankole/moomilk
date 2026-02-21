"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGreaterThan, faLessThan } from "@fortawesome/free-solid-svg-icons";
import homeStyles from "./home.module.css";
import { auth } from "../app/data/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
  "/images/slider4.jpg",
];

const stickers = [
  { image: "/images/sticker1.png", title: "Sir Pinalot" },
  { image: "/images/sticker2.png", title: "Huzz" },
  { image: "/images/sticker3.png", title: "Gymmy Neutron" },
  { image: "/images/sticker4.png", title: "Mr Where's my hug?" },
  { image: "/images/sticker5.png", title: "Mr Challant" },
];

const flavours = [
  { image: "/images/flavour1.jpg", title: "Blueberry flavour" },
  { image: "/images/flavour2.jpg", title: "Sigma flavour" },
  { image: "/images/flavour3.jpg", title: "Ant flavour" },
  { image: "/images/flavour4.jpg", title: "Skibidi flavour" },
  { image: "/images/flavour5.jpg", title: "Lone wolf flavour" },
  { image: "/images/flavour6.jpg", title: "Frog flavour" },
];

const winnerImage = "/images/winner.jpg";

const testimonials = [
  // {
  //   id: 1,
  //   name: "Anita Job",
  //   rating: "⭐⭐⭐⭐⭐",
  //   avatar: "/images/review1.jpg",
  //   review:
  //     "Now I'm an enlightened being who understands the true meaning of dairy. Thank you.",
  // },
  {
    id: 2,
    name: "Eugene Krabs",
    rating: "⭐⭐⭐⭐⭐",
    avatar: "/images/review2.jpg",
    review: "The only thing i'd spend me money on!",
  },
  {
    id: 3,
    name: "Pamela B",
    rating: "⭐⭐⭐⭐",
    avatar: "/images/review3.jpg",
    review:
      " I opened the bottle, and I swear I heard a faint 'moo.' This is the freshest milk on Earth.",
  },
  {
    id: 4,
    name: "Not Plankton ",
    rating: "⭐⭐⭐⭐⭐",
    avatar: "/images/review4.jpg",
    review: "This milk is suspiciously good. What is the formula?",
  },
];

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const autoSlide = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(autoSlide);
  }, []);

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const PrevArrow = ({ onClick }) => (
    <div className={homeStyles.sliderPrevArrow} onClick={onClick}>
      <FontAwesomeIcon icon={faLessThan} size="xs" />
    </div>
  );

  const NextArrow = ({ onClick }) => (
    <div className={homeStyles.sliderNextArrow} onClick={onClick}>
      <FontAwesomeIcon icon={faGreaterThan} size="xs" />
    </div>
  );

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const flavourSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <>
      {/* ── Hero Section ── */}
      <section className={homeStyles.heroSection}>
        <section className={homeStyles.imageWrapper}>
          <Image
            src={images[currentImageIndex]}
            alt="Featured slider"
            fill
            className={homeStyles.image}
            priority
          />
          <div className={homeStyles.heroOverlay} />
        </section>

        <button
          className={`${homeStyles.arrow} ${homeStyles.prev}`}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <FontAwesomeIcon icon={faLessThan} />
        </button>
        <button
          className={`${homeStyles.arrow} ${homeStyles.next}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FontAwesomeIcon icon={faGreaterThan} />
        </button>

        <div className={homeStyles.heroContent}>
          <h1 className={homeStyles.heroTitle}>Capture Your Milk Moment</h1>
          <p className={homeStyles.heroSubtitle}>
            Take a fun photo, add stickers &amp; filters, and compete to be
            Canada&apos;s winning photo of the week!
          </p>
          <Link href={user ? "/photobooth" : "/user"} passHref>
            <button className={`${homeStyles.formButton} ${homeStyles.blueNeonButton}`}>
              <span>Participate</span>
            </button>
          </Link>
        </div>

        <div className={homeStyles.slideDots}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`${homeStyles.dot} ${i === currentImageIndex ? homeStyles.dotActive : ""}`}
              onClick={() => setCurrentImageIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Winner Section ── */}
      <section className={homeStyles.winnerSection}>
        <h2 className={homeStyles.winnerTitle}>
          <span className={homeStyles.trophyBadge}>🏆</span> This Week&apos;s Winner
        </h2>
        <section className={homeStyles.winnerContainer}>
          <section className={homeStyles.winnerImageWrapper}>
            <Image
              src={winnerImage}
              alt="Winner"
              width={500}
              height={500}
              className={homeStyles.winnerImage}
            />
          </section>
          <section className={homeStyles.winnerDetails}>
            <p className={homeStyles.winnerText}>
              This week&apos;s PhotoBoothContest winner was randomly chosen for their
              fun and creative picture edit! They entered just for fun, never
              expecting to win, but their edited photo stood out among all the
              entries. Luck was on their side, and now they get to enjoy their
              well-deserved prize. Congrats to this week&apos;s lucky winner!
            </p>
          </section>
        </section>
      </section>

      {/* ── New Flavours ── */}
      <section className={homeStyles.flavour}>
        <h2 className={homeStyles.flavourh2}>New Flavours</h2>
        <Slider {...flavourSliderSettings} className={homeStyles.flavourContainer}>
          {flavours.map((flavour, index) => (
            <div key={index} className={homeStyles.flavourItem}>
              <div className={homeStyles.flavourImageContainer}>
                <Image
                  src={flavour.image}
                  alt={flavour.title}
                  width={500}
                  height={500}
                  className={homeStyles.flavourImage}
                />
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ── Featured Stickers ── */}
      <section className={homeStyles.sticker}>
        <h2 className={homeStyles.stickerh2}>Featured Stickers</h2>
        <Slider {...settings} className={homeStyles.stickerContainer}>
          {stickers.map((sticker, index) => (
            <div key={index} className={homeStyles.stickerItem}>
              <div className={homeStyles.stickerImageContainer}>
                <Image
                  src={sticker.image}
                  alt={sticker.title}
                  width={400}
                  height={400}
                  className={homeStyles.stickerImage}
                />
              </div>
              <h2 className={homeStyles.stickerTitle}>{sticker.title}</h2>
            </div>
          ))}
        </Slider>
      </section>

      {/* ── Testimonials ── */}
      <h2 className={homeStyles.testimonialsTitle}>Our Customers</h2>
      <section className={homeStyles.testimonialsSection}>
        {testimonials.map((testimonial, index) => (
          <section
            key={testimonial.id}
            className={`${homeStyles.testimonial} ${
              index % 2 !== 0 ? homeStyles.altBg : ""
            }`}
          >
            <section className={homeStyles.avatarContainer}>
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={90}
                height={90}
                className={homeStyles.avatar}
              />
            </section>
            <section className={homeStyles.reviewContent}>
              <h3 className={homeStyles.customerName}>{testimonial.name}</h3>
              <section className={homeStyles.starContainer}>
                <span className={homeStyles.starImage}>{testimonial.rating}</span>
              </section>
              <p className={homeStyles.reviewText}>{testimonial.review}</p>
            </section>
          </section>
        ))}
      </section>
    </>
  );
}
