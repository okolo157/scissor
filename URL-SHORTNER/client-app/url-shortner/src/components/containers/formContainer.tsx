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
    <div className="container mx-auto p-2">
      <div className="relative my-8 rounded-xl overflow-hidden">
        <img
          src="../src/assets/newp.jpg"
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.6)", transform: "scale(1.1)" }}
        />
        <div className="relative w-full h-full rounded-xl p-20 backdrop-brightness-50 flex flex-col items-center justify-center">
          <h2 className="text-white text-4xl font-bold text-center pb-4">
            Scissor URL Shortener
          </h2>
          <p className="text-white text-center pb-2 text-xl font-light">
            Paste your link to shorten it
          </p>
          <p className="text-white text-center pb-4 text-sm font-thin">
            Free tool to shorten URL or reduce link length
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-slate-800">
                  scissor.link/
                </div>
                <input
                  type="text"
                  placeholder="e.g. https://www.example.com"
                  required
                  className="block w-full p-4 ps-32 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                  value={fullUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFullUrl(e.target.value)
                  }
                />
              </div>
              <button
                type="submit"
                className="p-4 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300"
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
