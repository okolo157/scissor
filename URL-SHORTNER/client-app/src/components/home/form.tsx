import * as React from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Link2,
  Settings,
  Download,
  QrCode,
} from "lucide-react";
import { FormSkeleton } from "../skeleton/SkeletonLoader";
import QRCode from "react-qr-code";

interface IFormContainerProps {
  onSubmit: (
    url: string,
    customUrl?: string
  ) => Promise<{ shortUrl: string }> | { shortUrl: string };
}

const FormContainer: React.FC<IFormContainerProps> = ({ onSubmit }) => {
  const [step, setStep] = React.useState<1 | 2 | 3>(1); // 1: Enter URL, 2: Customize (optional), 3: Result
  const [fullUrl, setFullUrl] = React.useState<string>("");
  const [customUrl, setCustomUrl] = React.useState<string>("");
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

  const handleNext = () => {
    if (step === 1 && fullUrl.trim()) {
      setStep(2);
    }
  };

  const handleSkipCustomization = async () => {
    await handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const result = await onSubmit(fullUrl, customUrl.trim() || undefined);
      setSubmittedUrl(fullUrl);
      setShortenedUrl(`${window.location.origin}/${result.shortUrl}`);
      setAlert({ severity: "success", message: "URL successfully shortened!" });
      setStep(3);
    } catch (err: unknown) {
      console.error("Error in form submit:", err);
      let errorMessage = "Failed to shorten URL.";
      if (err && typeof err === "object" && "response" in err) {
        const response = (err as { response?: { data?: { message?: string } } })
          .response;
        errorMessage = response?.data?.message || errorMessage;
      }
      setAlert({ severity: "error", message: errorMessage });
      setShortenedUrl(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setFullUrl("");
    setCustomUrl("");
    setShortenedUrl(null);
    setSubmittedUrl(null);
    setCopied(false);
    setAlert(null);
  };

  const handleCopy = () => {
    if (shortenedUrl) {
      navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (!shortenedUrl) return;

    const svg = document.getElementById("qr-code-svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, 300, 300);
      ctx!.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `qr-code-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Progress Indicator */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {step > 1 ? <Check size={16} /> : "1"}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter URL
            </span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className={`h-full bg-blue-600 rounded transition-all duration-300 ${
                step >= 2 ? "w-full" : "w-0"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 2
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {step > 2 ? <Check size={16} /> : "2"}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Customize
            </span>
          </div>
          <div className="flex-1 h-1 mx-2 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className={`h-full bg-blue-600 rounded transition-all duration-300 ${
                step >= 3 ? "w-full" : "w-0"
              }`}
            />
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                step >= 3
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}
            >
              {step === 3 ? <Check size={16} /> : "3"}
            </div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Done
            </span>
          </div>
        </div>
      </div>

      {/* Step 1: Enter URL */}
      {step === 1 && (
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Step 1: Enter Your URL
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Paste the long URL you want to shorten
            </p>
          </div>

          <div className="space-y-3">
            <input
              type="url"
              placeholder="https://example.com/very-long-url..."
              required
              className="w-full p-3 sm:p-4 text-gray-900 dark:text-white text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-4 focus:ring-blue-400 outline-none"
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && fullUrl.trim()) {
                  e.preventDefault();
                  handleNext();
                }
              }}
            />
            <button
              onClick={handleNext}
              disabled={!fullUrl.trim()}
              className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl text-white transition-all bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed hover:scale-[1.02]"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Customize (Optional) */}
      {step === 2 && (
        <div className="w-full max-w-md space-y-4">
          <div className="text-center mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
              Step 2: Customize Your Link (Optional)
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
              Make your link memorable or skip to use auto-generated
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Settings
                size={18}
                className="text-blue-600 dark:text-blue-400"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom Short URL
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {window.location.origin}/
              </span>
              <input
                type="text"
                placeholder="my-custom-link"
                className="flex-1 px-3 py-2 text-gray-900 dark:text-white text-sm sm:text-base bg-transparent outline-none"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                pattern="[a-zA-Z0-9_-]{3,30}"
                title="3-30 characters: letters, numbers, hyphens, and underscores only"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Use 3-30 characters: letters, numbers, hyphens, underscores
            </p>
          </div>

          {loading ? (
            <FormSkeleton />
          ) : (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 px-6 py-3 text-sm sm:text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleSkipCustomization}
                disabled={loading}
                className="flex-1 px-6 py-3 text-sm sm:text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 border-2 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                Skip
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  loading ||
                  (customUrl.trim() !== "" &&
                    !/^[a-zA-Z0-9_-]{3,30}$/.test(customUrl))
                }
                className="flex-1 px-6 py-3 text-sm sm:text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                Create →
              </button>
            </div>
          )}

          {/* Alert feedback */}
          {alert && alert.severity === "error" && (
            <div className="p-3 sm:p-4 rounded-lg border bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs sm:text-sm font-medium">
                  {alert.message}
                </span>
                <button
                  onClick={() => setAlert(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Result */}
      {step === 3 && shortenedUrl && (
        <div className="w-full max-w-md">
          {/* Success header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-300 mb-2">
              Success! 🎉
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Your short link is ready to share
            </p>
          </div>

          {/* URL cards container */}
          <div className="space-y-3 sm:space-y-4">
            {/* Shortened URL card - Primary */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-4 sm:p-5 border-2 border-blue-300 dark:border-blue-700 shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                  <Link2 size={14} className="text-white" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">
                  Your Short Link
                </span>
              </div>

              <div className="bg-white dark:bg-gray-900 p-3 sm:p-4 rounded-xl border border-blue-200 dark:border-blue-800 mb-3">
                <a
                  href={shortenedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 text-base sm:text-lg font-bold hover:underline break-all block mb-3"
                >
                  {shortenedUrl}
                </a>

                {/* QR Code Section */}
                <div className="flex flex-col items-center gap-3 mb-4 p-4 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode
                      size={16}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">
                      QR Code
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <QRCode
                      id="qr-code-svg"
                      value={shortenedUrl}
                      size={150}
                      level="H"
                    />
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-medium"
                  >
                    <Download size={16} />
                    Download QR Code
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      copied
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        <span className="text-sm sm:text-base">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span className="text-sm sm:text-base">Copy Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-600 dark:border-blue-400 rounded-lg font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <ExternalLink size={18} />
                    <span className="text-sm sm:text-base">Open Link</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Original URL card - Secondary */}
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Link2 size={14} className="text-gray-500 dark:text-gray-400" />
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Original URL
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 break-all">
                {submittedUrl}
              </p>
            </div>
          </div>

          {/* Action button to return to form */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleReset}
              className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
            >
              ← Shorten Another URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormContainer;
