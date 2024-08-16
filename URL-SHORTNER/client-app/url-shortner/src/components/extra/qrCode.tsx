import React from "react";
import { useParams } from "react-router-dom";
import QRCode from "react-qr-code";
import { serverUrl } from "../../helpers/constants";

const QrCodePage: React.FC = () => {
  const { shortUrl } = useParams<{ shortUrl: string }>();

  // Construct the full URL for the QR code
  const qrCodeUrl = `${serverUrl}/api/shortUrl/${shortUrl}`;

  // Function to handle navigation to the home page with reload
  const goHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 text-center">
      <h1 className="text-2xl font-bold mb-4 sm:text-3xl lg:text-4xl">
        QR Code for {shortUrl}
      </h1>
      <div className="flex justify-center mb-6">
        <QRCode value={qrCodeUrl} size={256} />
      </div>
      <button
        onClick={goHome}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
      >
        Back to Home
      </button>
    </div>
  );
};

export default QrCodePage;
