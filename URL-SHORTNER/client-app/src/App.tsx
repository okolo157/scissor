import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import ShortenLink from "./pages/ShortenLink";
import GroupLinks from "./pages/GroupLinks";
import Navbar from "./components/navbar/Navbar";
// import Footer from "./components/footer/footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-800">
      <Navbar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shorten" element={<ShortenLink />} />
          <Route path="/link-group" element={<GroupLinks />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
