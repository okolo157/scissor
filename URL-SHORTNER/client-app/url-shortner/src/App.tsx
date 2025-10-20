import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import QrCodePage from "./components/extra/qrCode";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/qrcode/:shortUrl" element={<QrCodePage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
