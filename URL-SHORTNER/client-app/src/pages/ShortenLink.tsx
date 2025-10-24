import * as React from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { urlData } from "../interface/urlData";
import FormContainer from "../components/home/form";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { ArrowLeft, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ShortenLink: React.FC = () => {
  const navigate = useNavigate();

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
        title="Shorten URL — Free Link Shortener | Scissor"
        description="Shorten long URLs instantly with Scissor. Create clean, shareable short links with optional custom aliases. Fast, free, and privacy-friendly URL shortener."
        keywords="url shortener, link shortener, short url, free url shortener, custom short links"
        canonical="https://www.scissor.site/shorten"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Scissor URL Shortener",
          url: "https://www.scissor.site/shorten",
          description: "Free URL shortener for creating short links instantly.",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <div className="relative flex flex-col items-center w-full justify-center py-5 sm:py-8 min-h-screen px-4 sm:px-6 text-white overflow-hidden">
        {/* Background blobs for visual depth */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 sm:w-72 sm:h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 sm:w-80 sm:h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />

        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate("/")}
          className="relative z-10 self-start mb-6 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 rounded-lg transition-all text-blue-200 hover:text-white"
          aria-label="Go back to home page"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="text-sm font-medium">Back to Home</span>
        </motion.button>

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
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-shadow"
              aria-hidden="true"
            >
              <FolderKanban size={40} className="text-white" />
            </div>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <span className="text-blue-400">Shorten</span> Your Link
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-2">
              Transform long URLs into clean, shareable short links
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
          role="region"
          aria-labelledby="how-it-works-heading"
        >
          <h2
            id="how-it-works-heading"
            className="text-xl sm:text-2xl font-semibold text-blue-100 mb-3"
          >
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-blue-200 text-xs sm:text-sm md:text-base">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2" aria-hidden="true">
                1️⃣
              </div>
              <h3 className="font-semibold text-white mb-1">Paste URL</h3>
              <p>Enter your long URL</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2" aria-hidden="true">
                2️⃣
              </div>
              <h3 className="font-semibold text-white mb-1">Customize</h3>
              <p>Optional custom alias</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2" aria-hidden="true">
                3️⃣
              </div>
              <h3 className="font-semibold text-white mb-1">Share</h3>
              <p>Copy and share anywhere</p>
            </div>
          </div>
          <p className="mt-6 text-blue-300 text-xs sm:text-sm md:text-base leading-relaxed">
            No signup, no fuss — simply paste, shorten, and share. Built for
            speed, privacy, and convenience.
          </p>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-10 text-xs sm:text-sm text-blue-300/70">
          <p>
            © {new Date().getFullYear()} Scissor • Crafted with 💙{" "}
            <a
              href="https://github.com/okolo157"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-200 transition-colors"
              aria-label="Visit Victor Okolo's GitHub profile"
            >
              Victor Okolo
            </a>
          </p>
        </footer>
      </div>
    </>
  );
};

export default ShortenLink;
