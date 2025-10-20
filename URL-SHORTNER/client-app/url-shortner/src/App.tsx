import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer/footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      <Footer />
    </div>
  );
}
