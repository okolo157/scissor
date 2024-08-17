import * as React from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import QRCode from "react-qr-code";
import { urlData } from "../../interface/urlData";
import { serverUrl } from "../../helpers/constants";

interface IDataTableProps {
  data: urlData[];
  updateReloadState: () => void;
}

const DataTable: React.FunctionComponent<IDataTableProps> = (props) => {
  const { data, updateReloadState } = props;
  const [alert, setAlert] = React.useState<{
    severity: "success" | "error";
    message: string;
  } | null>(null);
  const [open, setOpen] = React.useState(false);
  const [selectedUrl, setSelectedUrl] = React.useState<string | null>(null);

  const handleOpen = (shortUrl: string) => {
    setSelectedUrl(shortUrl);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleCloseAlert = () => {
    setAlert(null);
  };

  const renderTableData = () => {
    return data.map((item) => (
      <tr
        key={item._id}
        className="border-b text-white bg-gray-600 hover:bg-white hover:text-gray-800"
      >
        <td className="px-2 py-3 md:px-2 text-left break-words w-4/12">
          <a
            href={item.fullUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-xs sm:text-sm md:text-base"
          >
            {item.fullUrl}
          </a>
        </td>
        <td className="px-2 py-3 md:px-3 text-left w-3/12">
          <a
            href={`${serverUrl}/api/shortUrl/${item.shortUrl}`}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-xs sm:text-sm md:text-base"
          >
            {item.shortUrl}
          </a>
        </td>
        <td className="px-2 py-3 md:px-4 text-center text-xs sm:text-sm md:text-base w-1/12">
          {item.clicks}
        </td>
        <td className="px-2 py-3 md:px-4 w-2/12">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-2">
            <div
              className="cursor-pointer"
              onClick={() => copyToClipboard(item.shortUrl)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => deleteUrl(item._id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="red"
                className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </td>
        <td className="px-2 py-3 md:px-2 text-left w-2/12 text-xs sm:text-sm md:text-base">
          <button
            onClick={() => handleOpen(item.shortUrl)}
            className="text-blue-500 underline"
          >
            View QR Code
          </button>
        </td>
      </tr>
    ));
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(`${serverUrl}/api/shortUrl/${url}`);
      setAlert({ severity: "success", message: "Copied to clipboard!" });
    } catch (error) {
      console.log(error);
      setAlert({ severity: "error", message: "Failed to copy URL." });
    }
  };

  const deleteUrl = async (id: string) => {
    try {
      await axios.delete(`${serverUrl}/api/shortUrl/${id}`);
      setAlert({ severity: "error", message: "URL deleted successfully." });
      updateReloadState();
    } catch (error) {
      console.log(error);
      setAlert({ severity: "error", message: "Failed to delete URL." });
    }
  };

  return (
    <div className="container mx-auto pt-2 pb-10">
      {alert && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
          <Alert severity={alert.severity} onClose={handleCloseAlert}>
            {alert.message}
          </Alert>
        </div>
      )}
      <Modal open={open} onClose={handleClose}>
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <QRCode value={`${serverUrl}/api/shortUrl/${selectedUrl}`} />
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead>
          <tr className="bg-gray-800">
            <th className="px-2 py-3 md:px-2 text-left text-xs sm:text-sm md:text-base text-white">
              Full URL
            </th>
            <th className="px-2 py-3 md:px-3 text-left text-xs sm:text-sm md:text-base text-white">
              Short URL
            </th>
            <th className="px-2 py-3 md:px-4 text-center text-xs sm:text-sm md:text-base text-white">
              Clicks
            </th>
            <th className="px-2 py-3 md:px-4 text-center text-xs sm:text-sm md:text-base text-white">
              Actions
            </th>
            <th className="px-2 py-3 md:px-2 text-left text-xs sm:text-sm md:text-base text-white">
              QR Code
            </th>
          </tr>
        </thead>
        <tbody>{renderTableData()}</tbody>
      </table>
    </div>
  );
};

export default DataTable;
