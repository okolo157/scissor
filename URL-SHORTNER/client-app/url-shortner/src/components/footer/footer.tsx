import * as React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-16 border-t border-white/10 bg-slate-900/50 backdrop-blur-md text-center py-6">
      <p className="text-sm text-blue-100/80">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-blue-300">Scissor</span> • Crafted with 💙 by{" "}
        <a
          href="https://victor.is-a.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-blue-400 transition-colors"
        >
          Victor Okolo
        </a>
      </p>
    </footer>
  );
};

export default Footer;
