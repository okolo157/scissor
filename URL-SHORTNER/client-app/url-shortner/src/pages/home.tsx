import * as React from "react";
import axios from "axios";
import { serverUrl } from "../helpers/constants";
import { urlData } from "../interface/urlData";
import FormContainer from "../components/home/form";
import { CircularProgress } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";

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
        originalUrl,
      });

      setShortUrl(response.data.shortUrl);
    } catch (err: any) {
      console.error("Error creating short URL:", err);
      setError("Failed to shorten URL. Please try again.");
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
    <div className="flex flex-col items-center w-full justify-center min-h-screen px-4 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-800">
      {/* Background blobs for visual depth */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-8"
      >
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
            className="mt-6 p-4 border border-gray-200 bg-white/10 backdrop-blur-md rounded-lg text-center"
          >
            <p className="text-white mb-2 font-medium">Shortened URL:</p>
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
              <p className="text-sm text-green-400 mt-1">Copied to clipboard!</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
