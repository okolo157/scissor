import * as React from "react";
import Logo from "../../../assets/scissor-logo.png";

interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-slate-900/70 backdrop-blur-md border-b border-slate-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.location.reload();
          }}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <img
            src={Logo}
            alt="Scissor Logo"
            className="w-8 h-8 md:w-10 md:h-10 object-contain"
          />
          <span className="text-white text-lg md:text-xl font-semibold tracking-wide">
            Scissor <span className="text-blue-400">URL Shortener</span>
          </span>
        </a>

        <button
          className="hidden sm:block px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Shorten a Link
        </button>
      </div>
    </header>
  );
};

export default Header;
