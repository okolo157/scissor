import * as React from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

interface IFormContainerProps {
  onSubmit: (url: string) => Promise<void> | void;
}

const FormContainer: React.FC<IFormContainerProps> = ({ onSubmit }) => {
  const [fullUrl, setFullUrl] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [alert, setAlert] = React.useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

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
      await onSubmit(fullUrl);
      setFullUrl("");
      setAlert({ severity: "success", message: "URL successfully shortened!" });
    } catch (err) {
      console.error("Error in form submit:", err);
      setAlert({ severity: "error", message: "Failed to shorten URL." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* App Header */}
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
        Scissor
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm sm:text-base">
        Simple, fast & free URL shortener
      </p>

      {/* Form Container */}
      <div className="w-full bg-gradient-to-br from-white/90 to-slate-100/70 dark:from-slate-800/60 dark:to-slate-900/50 backdrop-blur-md shadow-xl border border-gray-200 dark:border-slate-700 rounded-2xl p-6 transition-all">
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="url"
              placeholder="Paste your long URL here..."
              required
              className="flex-grow p-3 text-gray-800 dark:text-gray-100 text-sm rounded-xl 
                         bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700
                         focus:ring-4 focus:ring-blue-400 focus:border-blue-500 outline-none
                         placeholder-gray-400 dark:placeholder-gray-500 transition-all"
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-3 text-sm font-semibold rounded-xl text-white transition-all 
                         shadow-md hover:shadow-lg active:scale-95 
                         ${
                           loading
                             ? "bg-blue-400 cursor-not-allowed"
                             : "bg-blue-600 hover:bg-blue-700"
                         }`}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Shorten URL"
              )}
            </button>
          </div>
        </form>

        {/* Alert feedback */}
        {alert && (
          <div className="mt-4 w-full max-w-sm mx-auto">
            <Alert severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </div>
        )}
      </div>

      {/* Descriptive Text Below */}
      <div className="mt-8 max-w-md text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
        <p>
          Scissor helps you transform long, messy URLs into clean and shareable
          links in seconds. Whether you’re sharing on social media, sending
          emails, or tracking engagement, our fast and reliable URL shortener
          keeps your links simple and professional.
        </p>
        <p className="mt-3">
          No sign-up required — just paste your link, click{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            Shorten URL
          </span>
          , and you’re good to go.
        </p>
      </div>

      <p className="mt-10 text-xs text-gray-400 dark:text-gray-500">
        Powered by <span className="text-blue-600 font-medium">Scissor</span>
      </p>
    </div>
  );
};

export default FormContainer;
