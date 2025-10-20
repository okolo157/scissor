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

  // Auto-hide alert
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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background blur elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-blue-600/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/30 blur-3xl rounded-full animate-pulse delay-300" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 backdrop-blur-2xl bg-white/10 border border-white/20 rounded-3xl shadow-xl px-6 py-10 md:px-12 md:py-16 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Scissor</h1>
        <p className="text-blue-100 text-lg font-light mb-6">
          Simple, fast & free URL shortener
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="mt-4">
            <Alert severity={alert.severity} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-blue-200 mt-8">
          Transform long links into short, shareable URLs in seconds ✨
        </p>
      </div>
    </div>
  );
};

export default FormContainer;
