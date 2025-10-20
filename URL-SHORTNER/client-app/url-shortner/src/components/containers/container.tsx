import * as React from "react";
import axios from "axios";
import { serverUrl } from "../../helpers/constants";
import { urlData } from "../../interface/urlData";
import FormContainer from "./formContainer";
import { CircularProgress } from "@mui/material";
import { Check, Copy } from "lucide-react";
import { motion } from "framer-motion";

interface IContainerProps {}

const Container: React.FC<IContainerProps> = () => {
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-lg rounded-2xl p-6"
      >
        <h2 className="text-2xl font-semibold text-center text-slate-800 mb-4">
          Shorten Your Link 🔗
        </h2>

        <FormContainer onSubmit={handleShortenUrl} />

        {loading && (
          <div className="flex justify-center mt-6">
            <CircularProgress color="primary" />
          </div>
        )}

        {error && (
          <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
        )}

        {shortUrl && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 border border-gray-200 bg-gray-50 rounded-lg text-center"
          >
            <p className="text-gray-700 mb-2 font-medium">Shortened URL:</p>
            <div className="flex items-center justify-center gap-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 font-semibold hover:underline break-all"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-blue-50 transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <Check size={18} className="text-green-600" />
                ) : (
                  <Copy size={18} className="text-gray-600" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Container;
