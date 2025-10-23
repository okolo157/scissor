import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Link2, FolderKanban } from "lucide-react";
import Logo from "../../assets/scissor-logo.png";

const Navbar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/shorten", label: "Shorten Link", icon: Link2 },
    { path: "/link-group", label: "Link Groups", icon: FolderKanban },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center gap-2 group hover:scale-105 transition-transform"
          >
            <img
              src={Logo}
              alt="Scissor Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-white text-xl font-bold hidden sm:block">
              Scissor
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
