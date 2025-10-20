import * as React from "react";
import axios from "axios";
import { serverUrl } from "../../helpers/constants";
import { urlData } from "../../interface/urlData";
import FormContainer from "./formContainer";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface IContainerProps {}

const Container: React.FC<IContainerProps> = () => {
  const [shortUrl, setShortUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleShortenUrl = async (originalUrl: string) => {
    try {
      setError(null);
      setLoading(true);
      setShortUrl(null);

      const response = await axios.post<urlData>(`${serverUrl}/api/shortUrl`, {
        originalUrl,
      });

      setShortUrl(response.data.shortUrl);
    } catch (err: any) {
      console.error("Error creating short URL:", err);
      setError("Failed to shorten URL. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-4">
      <FormContainer onSubmit={handleShortenUrl} />

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {error && (
        <p className="text-red-600 mt-4 text-center font-medium">{error}</p>
      )}

      {shortUrl && !loading && (
        <div className="mt-6 p-4 border border-gray-300 rounded-lg text-center">
          <p className="text-gray-700">Shortened URL:</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-semibold hover:underline"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default Container;
