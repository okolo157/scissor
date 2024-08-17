import * as React from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import { serverUrl } from "../../helpers/constants";

interface IFormContainerProps {
  updateReloadState: () => void;
}

const FormContainer: React.FunctionComponent<IFormContainerProps> = (props) => {
  const { updateReloadState } = props;
  const [fullUrl, setFullUrl] = React.useState<string>("");
  const [alert, setAlert] = React.useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);

  // Auto-hide alert after 3 seconds
  React.useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000); // Alert disappears after 3 seconds

      return () => clearTimeout(timer); // Clean up timer on component unmount or alert change
    }
  }, [alert]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${serverUrl}/api/shortUrl`, {
        fullUrl: fullUrl,
      });
      setFullUrl("");
      setAlert({ severity: "success", message: "URL successfully shortened!" });
      updateReloadState();
    } catch (error) {
      console.log(error);
      setAlert({ severity: "error", message: "Failed to shorten URL." });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="relative my-8 rounded-xl overflow-hidden">
        <img
          src="https://getwallpapers.com/wallpaper/full/1/4/c/1160356-download-free-tech-hd-wallpapers-1920x1080-download-free.jpg"
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.6)", transform: "scale(1.1)" }}
        />
        <div className="relative w-full h-full rounded-xl p-8 md:p-20 backdrop-brightness-50 flex flex-col items-center justify-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold text-center pb-4">
            Scissor URL Shortener
          </h2>
          <p className="text-white text-center pb-2 text-lg md:text-xl font-light">
            Paste your link to shorten it
          </p>
          <p className="text-white text-center pb-4 text-sm font-thin">
            Free tool to shorten URL or reduce link length
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
              <div className="relative flex-grow w-full">
                <input
                  type="text"
                  placeholder="e.g. https://www.example.com"
                  required
                  className="block w-full p-3 md:p-4 text-sm md:text-base text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  value={fullUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFullUrl(e.target.value)
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto p-3 md:p-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Shorten
              </button>
            </div>
          </form>
          {alert && (
            <div className="mt-4">
              <Alert severity={alert.severity} onClose={() => setAlert(null)}>
                {alert.message}
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
