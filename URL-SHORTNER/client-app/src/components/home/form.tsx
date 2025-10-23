import * as React from "react";
import { Check, Copy, ExternalLink, Link2 } from "lucide-react";

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
      setSubmittedUrl(fullUrl);
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
      {/* Show form when no shortened URL exists */}
      {!shortenedUrl ? (
        <>
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
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : (
                  "Shorten"
                )}
              </button>
            </div>
          </form>

          {/* Alert feedback - only show error alerts on form view */}
          {alert && alert.severity === "error" && (
            <div className="mt-4 w-full max-w-sm">
              <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{alert.message}</span>
                  <button
                    onClick={() => setAlert(null)}
                    className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Show success display when URL is shortened */
        <div className="mt-6 w-full max-w-md">
          {/* Success header */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <Check size={16} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
              URL Shortened Successfully!
            </h3>
          </div>

          {/* URL cards container */}
          <div className="space-y-4">
            {/* Original URL card */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Link2 size={16} className="text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Original URL
                </span>
              </div>
              <p className="text-sm text-gray-900 dark:text-white text-left break-all">
                {submittedUrl}
              </p>
            </div>

            {/* Shortened URL card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                  <Link2 size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                  Shortened URL
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white dark:bg-gray-900/80 p-3 rounded-lg border border-blue-100 dark:border-blue-800">
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline break-all text-left flex-1 mr-3"
                >
                  {shortenedUrl}
                </a>
                <div className="flex items-center gap-1">
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                    title="Visit link"
                  >
                    <ExternalLink size={16} />
                  </a>
                  <button
                    onClick={handleCopy}
                    className={`p-2 rounded-lg transition-all ${
                      copied 
                        ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
                    }`}
                    title={copied ? "Copied!" : "Copy link"}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              
              {copied && (
                <div className="flex items-center gap-1 mt-2 justify-center">
                  <Check size={14} className="text-green-500" />
                  <span className="text-green-600 dark:text-green-400 text-xs font-medium">
                    Copied to clipboard!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action button to return to form */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => {
                setShortenedUrl(null);
                setSubmittedUrl(null);
                setCopied(false);
              }}
              className="px-6 py-3 text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.03] transition-all"
            >
              Shorten Another URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormContainer
