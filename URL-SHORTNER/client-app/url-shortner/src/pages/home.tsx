import * as React from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { urlData } from "../interface/urlData";
import FormContainer from "../components/home/form";
import { CircularProgress } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "../assets/scissor-logo.png";


const Home: React.FC = () => {
  const [shortUrl, setShortUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);


const handleShortenUrl = async (originalUrl: string) => {
  try {
    setError(null);
    setLoading(true);
    setShortUrl(null);
    setCopied(false);

    const response = await axios.post<urlData>(`${serverUrl}/api/shortUrl`, {
      fullUrl: originalUrl,
    });

    return { shortUrl: response.data.shortUrl };
  } catch (err: any) {
    console.error("Error creating short URL:", err);
    setError("Failed to shorten URL. Please try again.");
    throw err;
  } finally {
    setLoading(false);
  }
};



  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full justify-center py-4 min-h-screen px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-800 text-white overflow-hidden">
      {/* Background blobs for visual depth */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-8"
      >



        <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex flex-col items-center justify-center gap-3 text-center mb-6 border-b border-white/10 pb-4"
        >
        <img src={Logo} alt="Scissor Logo" className="w-24 h-24 object-contain" />
       <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
        Scissor <span className="text-blue-400">URL Shortener</span>
        </h1>
        </motion.div>

        <FormContainer onSubmit={handleShortenUrl} />


        {loading && (
          <div className="flex justify-center mt-6">
            <CircularProgress color="primary" />
          </div>
        )}

        {error && (
          <p className="text-red-400 mt-4 text-center font-medium">{error}</p>
        )}

        {shortUrl && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 border border-white/20 bg-white/10 backdrop-blur-md rounded-lg text-center"
          >
            <p className="text-blue-100 mb-2 font-medium">Shortened URL:</p>
            <div className="flex items-center justify-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 font-semibold hover:underline break-all"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-blue-100/20 active:scale-90 transition-transform"
                title="Copy link"
              >
                {copied ? (
                  <Check size={18} className="text-green-400" />
                ) : (
                  <Copy size={18} className="text-blue-200" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-400 mt-1">
                Copied to clipboard!
              </p>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* --- Descriptive Section --- */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative z-10 mt-12 max-w-2xl text-center px-4"
      >
        <h2 className="text-2xl font-semibold text-blue-100 mb-3">
          What is Scissor?
        </h2>
        <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
          Scissor helps you transform long, cluttered URLs into clean, short,
          and shareable links in just seconds. Whether you’re promoting a brand,
          tracking campaigns, or simplifying posts for social media — Scissor
          makes it effortless.
        </p>
        <p className="mt-4 text-blue-300 text-sm sm:text-base leading-relaxed">
          No signup, no fuss — simply paste, shorten, and share. 
          Built for speed, privacy, and convenience ✨
        </p>
      </motion.div>

      {/* Footer */}
      <p className="mt-10 text-xs text-blue-300/70">
        © {new Date().getFullYear()} Scissor • Crafted with 💙
      </p>
    </div>
  );
};

export default Home;

