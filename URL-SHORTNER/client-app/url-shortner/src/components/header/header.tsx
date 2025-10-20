import * as React from "react";
import Logo from "../../assets/scissor-logo.png";

interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 py-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-3 text-center">
        <img
          src={Logo}
          alt="Scissor Logo"
          className="w-12 h-12 md:w-14 md:h-14 object-contain"
        />
        <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-wide">
          Scissor <span className="text-blue-400">URL Shortener</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
