import * as React from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { urlData } from "../interface/urlData";
import FormContainer from "../components/home/form";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import Logo from "../assets/scissor-logo.png";

const Home: React.FC = () => {
  const handleShortenUrl = async (originalUrl: string, customUrl?: string) => {
    try {
      const requestBody: { fullUrl: string; customUrl?: string } = {
        fullUrl: originalUrl,
      };
      if (customUrl) {
        requestBody.customUrl = customUrl;
      }

      const response = await axios.post<urlData>(
        `${serverUrl}/api/shortUrl`,
        requestBody
      );

      return { shortUrl: response.data.shortUrl };
    } catch (err: unknown) {
      console.error("Error creating short URL:", err);
      throw err;
    }
  };

  return (
    <>
      <SEO
        title="Scissor — Free URL Shortener & Link in Bio Tool"
        description="Shorten long URLs instantly with Scissor. Create beautiful link-in-bio pages. Fast, free, and privacy-friendly URL shortener with QR codes and analytics."
        keywords="url shortener, link shortener, short url, free url shortener, link in bio, linktree alternative, qr code generator, link management"
        canonical="https://www.scissor.site/"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Scissor URL Shortener",
          url: "https://www.scissor.site",
          description:
            "Free URL shortener and link-in-bio tool for creating short links and managing your online presence.",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "URL Shortening",
            "Link Groups",
            "QR Code Generation",
            "Link Analytics",
          ],
        }}
      />
      <div className="relative flex flex-col items-center w-full justify-center py-5 sm:py-8 min-h-screen px-4 sm:px-6 text-white overflow-hidden">
        {/* Background blobs for visual depth */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 sm:w-72 sm:h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 sm:w-80 sm:h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto flex flex-col items-center justify-center gap-3 text-center mb-6 border-b border-white/10 pb-4"
          >
            <img
              src={Logo}
              alt="Scissor Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              Scissor <span className="text-blue-400">URL Shortener</span>
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-2">
              Simple, fast & free URL shortener
            </p>
          </motion.div>

          <FormContainer onSubmit={handleShortenUrl} />
        </motion.div>

        {/* --- Descriptive Section --- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="relative z-10 mt-8 sm:mt-12 max-w-2xl text-center px-4"
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-100 mb-3">
            What is Scissor?
          </h2>
          <p className="text-blue-200 text-xs sm:text-sm md:text-base leading-relaxed">
            Scissor helps you transform long, cluttered URLs into clean, short,
            and shareable links in just seconds. Whether you're promoting a
            brand, tracking campaigns, or simplifying posts for social media,
            Scissor makes it effortless.
          </p>
          <p className="mt-3 sm:mt-4 text-blue-300 text-xs sm:text-sm md:text-base leading-relaxed">
            No signup, no fuss — simply paste, shorten, and share. Built for
            speed, privacy, and convenience.
          </p>
        </motion.div>

        {/* Footer */}
        <p className="mt-8 sm:mt-10 text-xs sm:text-sm text-blue-300/70">
          © {new Date().getFullYear()} Scissor • Crafted with 💙{" "}
          <a
            href="https://github.com/okolo157"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-200 transition-colors"
          >
            Victor Okolo
          </a>
        </p>
      </div>
    </>
  );
};

export default Home;
