import * as React from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Check, Copy } from "lucide-react";

interface IFormContainerProps {
  onSubmit: (url: string) => Promise<{ shortUrl: string }> | { shortUrl: string };
}

const FormContainer: React.FC<IFormContainerProps> = ({ onSubmit }) => {
  const [fullUrl, setFullUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);
  const [shortenedUrl, setShortenedUrl] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState<boolean>(false);
  const [submittedUrl, setSubmittedUrl] = React.useState<string | null>(null);


  // Auto-hide alerts
  React.useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullUrl.trim()) return;

    try {
      setLoading(true);
      const result = await onSubmit(fullUrl);
      setSubmittedUrl(fullUrl);  // save original URL for display
      setShortenedUrl(`${window.location.origin}/${result.shortUrl}`);
      setAlert({ severity: "success", message: "URL successfully shortened!" });
    } catch (err) {
      console.error("Error in form submit:", err);
      setAlert({ severity: "error", message: "Failed to shorten URL." });
      setShortenedUrl(null);
    } finally {
      setLoading(false);
      setFullUrl("");
    }
  };

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm sm:text-base">
        Simple, fast & free URL shortener
      </p>

      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            required
            className="flex-grow p-3 text-gray-900 text-sm rounded-xl border border-gray-200 focus:ring-4 focus:ring-blue-400 outline-none"
            value={fullUrl}
            onChange={(e) => setFullUrl(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-5 py-3 text-sm font-medium rounded-xl text-white transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:scale-[1.03]"
            }`}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Shorten"}
          </button>
        </div>
      </form>

      {/* Alert feedback */}
      {alert && (
        <div className="mt-4 w-full max-w-sm">
          <Alert severity={alert.severity} onClose={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </div>
      )}

      {/* Show shortened URL */}
      {shortenedUrl && (
        <div className="mt-6 p-4 w-full max-w-sm border border-gray-200 bg-white/10 dark:bg-gray-800/40 backdrop-blur-md rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Original URL:</p>
          <p className="text-sm text-gray-900 dark:text-white truncate mb-3">{submittedUrl}</p>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Shortened URL:</p>
          <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-900/40 p-2 rounded-md overflow-x-auto">
            <a
              href={shortenedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-300 text-sm font-medium hover:underline truncate"
            >
              {shortenedUrl}
            </a>
            <button
              onClick={handleCopy}
              className="p-2 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition"
              title="Copy link"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-blue-500" />}
            </button>
          </div>
          {copied && <p className="text-green-500 text-xs mt-1">Copied to clipboard!</p>}
        </div>
      )}
    </div>
  );
};

export default FormContainer;
