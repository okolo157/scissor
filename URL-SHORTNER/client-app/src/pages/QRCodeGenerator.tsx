import * as React from "react";
import { useState } from "react";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { ArrowLeft, QrCode, Download, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

const QRCodeGenerator: React.FC = () => {
  const navigate = useNavigate();
  const [inputUrl, setInputUrl] = useState<string>("");
  const [qrUrl, setQrUrl] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(256);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = () => {
    if (inputUrl.trim()) {
      setQrUrl(inputUrl.trim());
    }
  };

  const handleDownloadQR = () => {
    if (!qrUrl) return;

    const svg = document.getElementById("qr-code-display");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img") as HTMLImageElement;

    canvas.width = qrSize;
    canvas.height = qrSize;

    img.onload = () => {
      ctx!.fillStyle = "white";
      ctx!.fillRect(0, 0, qrSize, qrSize);
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

  const handleCopyUrl = () => {
    if (qrUrl) {
      navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setInputUrl("");
    setQrUrl("");
    setCopied(false);
  };

  return (
    <>
      <SEO
        title="QR Code Generator — Create QR Codes Instantly | Scissor"
        description="Generate QR codes for any URL or text instantly with Scissor. Free, fast, and customizable QR code generator. Download high-quality QR codes for print and digital use."
        keywords="qr code generator, free qr code, create qr code, qr code maker, url to qr code"
        canonical="https://www.scissor.site/qr-generator"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Scissor QR Code Generator",
          url: "https://www.scissor.site/qr-generator",
          description:
            "Free QR code generator for creating scannable codes instantly.",
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
        <div className="absolute top-1/4 left-1/3 w-64 h-64 sm:w-72 sm:h-72 bg-purple-500/30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 sm:w-80 sm:h-80 bg-pink-500/30 blur-3xl rounded-full animate-pulse delay-300" />

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
          className="relative z-10 w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl p-6 sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto flex flex-col items-center justify-center gap-3 text-center mb-6 border-b border-white/10 pb-4"
          >
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow"
              aria-hidden="true"
            >
              <QrCode size={40} className="text-white" />
            </div>
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide drop-shadow-[0_0_10px_rgba(168,85,247,0.3)]">
              <span className="text-purple-400">QR Code</span> Generator
            </h1>
            <p className="text-blue-200 text-xs sm:text-sm mt-2">
              Create scannable QR codes for any URL or text
            </p>
          </motion.div>

          {/* Input Section */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                Enter URL or Text
              </label>
              <input
                type="text"
                placeholder="https://example.com or any text..."
                className="w-full p-3 sm:p-4 text-gray-900 dark:text-white text-sm sm:text-base rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:ring-4 focus:ring-purple-400 outline-none"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && inputUrl.trim()) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                QR Code Size: {qrSize}px
              </label>
              <input
                type="range"
                min="128"
                max="512"
                step="64"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <div className="flex justify-between text-xs text-blue-200 mt-1">
                <span>128px</span>
                <span>256px</span>
                <span>512px</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!inputUrl.trim()}
              className="w-full px-6 py-3 sm:py-4 text-sm sm:text-base font-medium rounded-xl text-white transition-all bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed hover:scale-[1.02] shadow-lg shadow-purple-500/30"
            >
              Generate QR Code
            </button>
          </div>

          {/* QR Code Display */}
          {qrUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4"
            >
              <div className="flex flex-col items-center gap-4">
                <h3 className="text-lg font-semibold text-white">
                  Your QR Code
                </h3>
                <div className="bg-white p-4 rounded-xl shadow-2xl">
                  <QRCode
                    id="qr-code-display"
                    value={qrUrl}
                    size={qrSize}
                    level="H"
                  />
                </div>

                <div className="w-full bg-gray-900/40 rounded-lg p-3">
                  <p className="text-xs text-gray-300 mb-1">Encoded Data:</p>
                  <code className="text-sm text-white break-all block">
                    {qrUrl}
                  </code>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all font-medium shadow-lg shadow-purple-500/30"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={handleCopyUrl}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all font-medium ${
                      copied
                        ? "bg-green-600 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={18} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
                  >
                    <span>New QR Code</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Description Section */}
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
            Why Use QR Codes?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-blue-200 text-xs sm:text-sm md:text-base">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2" aria-hidden="true">
                📱
              </div>
              <h3 className="font-semibold text-white mb-1">Mobile Ready</h3>
              <p>Scan with any smartphone camera</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2" aria-hidden="true">
                🖨️
              </div>
              <h3 className="font-semibold text-white mb-1">Print Friendly</h3>
              <p>Perfect for posters & flyers</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
              <div className="text-3xl mb-2" aria-hidden="true">
                ⚡
              </div>
              <h3 className="font-semibold text-white mb-1">Instant Access</h3>
              <p>Quick link sharing anywhere</p>
            </div>
          </div>
          <p className="mt-6 text-blue-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Generate high-quality QR codes instantly. Perfect for marketing
            materials, business cards, product packaging, and more.
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

export default QRCodeGenerator;
