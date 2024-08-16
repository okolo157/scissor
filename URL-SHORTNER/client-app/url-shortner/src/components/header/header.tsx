import * as React from "react";

interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = () => {
  return (
    <div className="bg-slate-900">
      <div className="container p-2 mx-auto">
        <nav className="py-5 flex">
          <a
            className="text-base text-white  hover:text-gray-200"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.location.reload();
            }}
          >
            Scissor URL Shortner
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Header;
