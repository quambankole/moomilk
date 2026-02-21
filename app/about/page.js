import styles from "./about.module.css";

export default function About() {
    return (
        <section className={styles.aboutContainer}>
            <h1 className={styles.aboutTitle}>About Us</h1>

            <section className={styles.aboutContent}>
                <div className={styles.aboutTextbox}>
                    <h2 className={styles.aboutSubtitle}>Canada’s Dairy: Fresh, Nutritious & Sustainable</h2>
                    <p className={styles.aboutText}>
                        Canada’s dairy industry is built on a strong tradition of 
                        <span className={styles.highlight}> FAMILY-RUN FARMS</span> and 
                        <span className={styles.highlight}> SUSTAINABLE PRACTICES</span>. From coast to coast, our farmers are dedicated to producing 
                        <span className={styles.highlight}> FRESH, NUTRITIOUS DAIRY</span> products that Canadians can trust. They take pride in their work, 
                        ensuring that every product meets the highest standards of 
                        <span className={styles.highlight}> QUALITY</span> and 
                        <span className={styles.highlight}> TASTE</span>. 
                        By choosing <span className={styles.highlight}> CANADIAN DAIRY</span>, you’re not just supporting local farmers—you’re fueling your body 
                        with high-quality <span className={styles.highlight}> MILK, CHEESE, AND YOGURT</span> that contribute to an active and balanced lifestyle.
                    </p>

                </div>
                <div className={styles.aboutImage}>
                    <img className={styles.aboutImg} src="/images/aboutImage1.jpg" alt="Dairy Farm" />
                </div>
            </section>

            <section className={styles.aboutContent}>
                <div className={styles.aboutImage}>
                    <img className={styles.aboutImg} src="/images/aboutImage2.jpg" alt="Photobooth Challenge" />
                </div>
                <div className={styles.aboutTextbox}>
                    <h2 className={styles.aboutSubtitle}>Join the Milk Photobooth Challenge!</h2>
                    <p className={styles.aboutText}>
                        This competition celebrates the <span className={styles.highlight}>ACTIVE LIFESTYLE</span> of young Canadians. Whether you're 
                        <span className={styles.highlight}> HITTING THE GYM</span> or <span className={styles.highlight}>RELAXING AT HOME</span>, our contest 
                        encourages you to showcase how you enjoy <span className={styles.highlight}>MILK</span> as part of your daily routine. By participating, 
                        you not only get to share your <span className={styles.highlight}>HEALTHY HABITS</span> with others, but also inspire fellow Canadians 
                        to incorporate dairy into their lifestyles. Each week, a lucky winner will have their photo featured as the 
                        <span className={styles.highlight}> "WINNING IMAGE OF THE WEEK"</span> on our site and in our nationwide campaign!
                    </p>
                </div>
            </section>

            <section className={styles.aboutContent}>
                <div className={styles.aboutTextbox}>
                    <h2 className={styles.aboutSubtitle}>Our Mission: Healthy Living with Canadian Dairy</h2>
                    <p className={styles.aboutText}>
                        Our campaign aims to promote the importance of an <span className={styles.highlight}>ACTIVE LIFESTYLE</span> supported by 
                        <span className={styles.highlight}> HEALTHY NUTRITION</span>, especially the benefits of <span className={styles.highlight}>CANADIAN MILK</span>. 
                        By celebrating the diverse ways Canadians enjoy <span className={styles.highlight}>MILK</span>, we’re encouraging young adults to embrace 
                        a <span className={styles.highlight}>BALANCED DIET</span> while staying active. Through this competition, we hope to inspire you to make 
                        <span className={styles.highlight}>MILK</span> a part of your routine and empower you to <span className={styles.highlight}>LIVE YOUR BEST LIFE</span>, 
                        every day! As part of this movement, we’re also fostering a sense of <span className={styles.highlight}>COMMUNITY</span> where individuals 
                        can share their <span className={styles.highlight}>FITNESS JOURNEYS</span> and support each other.
                    </p>

                </div>
                <div className={styles.aboutImage}>
                    <img className={styles.aboutImg} src="/images/aboutImage3.jpg" alt="Healthy Lifestyle" />
                </div>
            </section>

            <section className={styles.aboutSummary}>
                <p className={styles.aboutText1}>
                    Proudly supporting Canada's dairy industry, celebrating its rich heritage, 
                    honoring the hard work of people like you, and ensuring a brighter future
                    for generations to come!
                </p>
            </section>
        </section>
    );
}
