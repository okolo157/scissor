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
      <h1 className="text-3xl font-bold text-slate-800 mb-1">Scissor</h1>
      <p className="text-gray-600 mb-6">Simple, fast & free URL shortener</p>

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
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Shorten"
            )}
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
    </div>
  );
};

export default FormContainer;
