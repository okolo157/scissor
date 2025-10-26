import * as React from "react";
import { useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { Link2, FolderKanban, ArrowRight, QrCode } from "lucide-react";
import ScissorShape from "../components/ScissorShape";
// import Logo from "../assets/scissor-logo.png";

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Floating animation variants for scissors
  const floatingVariants = {
    animate: (i: number) => ({
      y: [0, -30, 0],
      x: [0, 15, -15, 0],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 6 + i * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: i * 0.3,
      },
    }),
  };

  return (
    <>
      <SEO
        title="Scissor — Free URL Shortener & Link in Bio Tool"
        description="Shorten long URLs instantly with Scissor. Create beautiful link-in-bio pages. Fast, free, and privacy-friendly URL shortener with QR codes and analytics."
        keywords="url shortener, link shortener, short url, free url shortener, link in bio, linktree alternative, qr code generator, link management"
        canonical="https://www.scissor.site/"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Scissor URL Shortener",
          url: "https://www.scissor.site",
          description:
            "Free URL shortener and link-in-bio tool for creating short links and managing your online presence.",
          applicationCategory: "UtilitiesApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "URL Shortening",
            "Link in Bio",
            "QR Code Generation",
            "Link Analytics",
          ],
        }}
      />
      <div className="relative flex flex-col items-center w-full justify-center py-8 sm:py-12 min-h-screen px-4 sm:px-6 text-white overflow-hidden">
        {/* Animated floating scissor shapes for visual depth */}
        <motion.div
          custom={0}
          variants={floatingVariants}
          animate="animate"
          className="absolute top-0 left-1/4 opacity-15"
        >
          <ScissorShape size={120} color="#60a5fa" />
        </motion.div>

        <motion.div
          custom={1}
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-0 right-1/4 opacity-15"
        >
          <ScissorShape size={140} color="#818cf8" />
        </motion.div>

        <motion.div
          custom={2}
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/2 right-1/4 opacity-10"
        >
          <ScissorShape size={100} color="#a78bfa" />
        </motion.div>

        <motion.div
          custom={3}
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-1/3 left-1/4 opacity-10"
        >
          <ScissorShape size={110} color="#60a5fa" />
        </motion.div>

        <motion.div
          custom={4}
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/2 left-1/6 opacity-12"
        >
          <ScissorShape size={90} color="#818cf8" />
        </motion.div>

        <motion.div
          custom={5}
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-1/2 right-1/6 opacity-12"
        >
          <ScissorShape size={95} color="#a78bfa" />
        </motion.div>
        <motion.div
          custom={5}
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-1/2 right-1/6 opacity-12"
        >
          <ScissorShape size={95} color="#a78bfa" />
        </motion.div>

        <motion.div
          custom={6}
          variants={floatingVariants}
          animate="animate"
          className="absolute top-2/3 right-1/3 opacity-8"
        >
          <ScissorShape size={80} color="#60a5fa" />
        </motion.div>

        <motion.div
          custom={2}
          variants={floatingVariants}
          animate="animate"
          className="absolute top-1/3 right-1/4 opacity-10"
        >
          <ScissorShape size={100} color="#a78bfa" />
        </motion.div>
        <motion.div
          custom={5}
          variants={floatingVariants}
          animate="animate"
          className="absolute bottom-1/2 right-1/6 opacity-12"
        >
          <ScissorShape size={95} color="#a78bfa" />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex flex-col items-center justify-center gap-4 text-center mb-8 sm:mb-12"
        >
          {/* <div className="flex items-center gap-3">
            <img
              src={Logo}
              alt="Scissor Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div> */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            Welcome to <span className="text-blue-400">Scissor</span>
          </h1>
          <p className="text-blue-200 text-sm sm:text-base md:text-lg max-w-2xl">
            The only link tool you'll ever need. Shorten URLs or create
            beautiful link-in-bio pages.
          </p>
        </motion.div>

        {/* Main Cards */}
        <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {/* Shorten Link Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            role="article"
            aria-labelledby="shorten-link-title"
          >
            <button
              onClick={() => navigate("/shorten")}
              className="w-full group cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 hover:border-blue-400/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-left"
              aria-label="Navigate to URL shortener page"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-600 rounded-2xl flex items-center justify-center"
                  aria-hidden="true"
                >
                  <Link2 size={40} className="text-white" />
                </div>

                <div>
                  <h2
                    id="shorten-link-title"
                    className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  >
                    Shorten Link
                  </h2>
                  <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                    Transform long URLs into short, shareable links in seconds
                  </p>
                </div>

                <ul
                  className="space-y-2 w-full"
                  aria-label="Shorten link features"
                >
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Instant URL shortening</span>
                  </li>
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Custom short links</span>
                  </li>
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-blue-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>No registration required</span>
                  </li>
                </ul>

                <div className="flex items-center gap-2 text-blue-300 font-semibold group-hover:text-white transition-colors pt-2">
                  <span>Get Started</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          </motion.div>

          {/* Create Link Group Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            role="article"
            aria-labelledby="link-group-title"
          >
            <button
              onClick={() => navigate("/link-group")}
              className="w-full group cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 hover:border-indigo-400/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-left"
              aria-label="Navigate to link in bio creation page"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-indigo-600 rounded-2xl flex items-center justify-center"
                  aria-hidden="true"
                >
                  <FolderKanban size={40} className="text-white" />
                </div>

                <div>
                  <h2
                    id="link-group-title"
                    className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  >
                    Link in Bio
                  </h2>
                  <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                    Build a beautiful link-in-bio page for all your important
                    links
                  </p>
                </div>

                <ul
                  className="space-y-2 w-full"
                  aria-label="Link group features"
                >
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Multiple links in one page</span>
                  </li>
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Custom profile & branding</span>
                  </li>
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Perfect for social media</span>
                  </li>
                </ul>

                <div className="flex items-center gap-2 text-indigo-300 font-semibold group-hover:text-white transition-colors pt-2">
                  <span>Get Started</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          </motion.div>

          {/* QR Code Generator Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            role="article"
            aria-labelledby="qr-code-title"
          >
            <button
              onClick={() => navigate("/qr-generator")}
              className="w-full group cursor-pointer bg-white/10 backdrop-blur-xl border border-white/20 hover:border-purple-400/50 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:scale-105 hover:-translate-y-2 text-left"
              aria-label="Navigate to QR code generator page"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-600 rounded-2xl flex items-center justify-center"
                  aria-hidden="true"
                >
                  <QrCode size={40} className="text-white" />
                </div>

                <div>
                  <h2
                    id="qr-code-title"
                    className="text-2xl sm:text-3xl font-bold text-white mb-2"
                  >
                    QR Code
                  </h2>
                  <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                    Create scannable QR codes for any URL or text
                  </p>
                </div>

                <ul className="space-y-2 w-full" aria-label="QR code features">
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Instant generation</span>
                  </li>
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>High-quality download</span>
                  </li>
                  <li className="flex items-center gap-2 text-blue-100 text-xs sm:text-sm">
                    <span
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                      aria-hidden="true"
                    ></span>
                    <span>Customizable size</span>
                  </li>
                </ul>

                <div className="flex items-center gap-2 text-purple-300 font-semibold group-hover:text-white transition-colors pt-2">
                  <span>Get Started</span>
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="relative z-10 mt-8 max-w-4xl px-4"
          role="region"
          aria-labelledby="features-heading"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8">
            <h2
              id="features-heading"
              className="text-2xl sm:text-3xl font-bold text-center text-white mb-6"
            >
              Why Choose Scissor?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-4xl mb-3" aria-hidden="true">
                  ⚡
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Lightning Fast
                </h3>
                <p className="text-blue-200 text-sm">
                  Create short links and link pages in seconds
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3" aria-hidden="true">
                  🎨
                </div>
                <h3 className="text-white font-semibold mb-2">
                  Beautiful Design
                </h3>
                <p className="text-blue-200 text-sm">
                  Professional-looking links and pages
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl mb-3" aria-hidden="true">
                  🔒
                </div>
                <h3 className="text-white font-semibold mb-2">Privacy First</h3>
                <p className="text-blue-200 text-sm">
                  No signup required, your privacy matters
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-xs sm:text-sm text-blue-300/70 text-center">
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

export default Home;
