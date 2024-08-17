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
        <td className="px-2 py-3 md:px-6 break-words">
          <a
            href={item.fullUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-sm md:text-base"
          >
            {item.fullUrl}
          </a>
        </td>
        <td className="px-2 py-3 md:px-6">
          <a
            href={`${serverUrl}/api/shortUrl/${item.shortUrl}`}
            target="_blank"
            rel="noreferrer noopener"
            className="block text-sm md:text-base"
          >
            {item.shortUrl}
          </a>
        </td>
        <td className="px-2 py-3 md:px-6">{item.clicks}</td>
        <td className="px-2 py-3 md:px-6">
          <div className="flex flex-col md:flex-row content-center space-y-2 md:space-y-0 md:space-x-2">
            <div
              className="cursor-pointer"
              onClick={() => copyToClipboard(item.shortUrl)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6"
              >
                {/* SVG path for the copy icon */}
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
                className="w-5 h-5 md:w-6 md:h-6"
              >
                {/* SVG path for the delete icon */}
              </svg>
            </div>
          </div>
        </td>
        <td className="px-2 py-3 md:px-6">
          <button
            onClick={() => handleOpen(item.shortUrl)}
            className="text-blue-500 underline text-sm md:text-base"
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
        <div className="mb-4">
          <Alert
            severity={alert.severity}
            onClose={handleCloseAlert}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </div>
      )}
      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <table className="w-full table-fixed text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-md uppercase text-gray-50 bg-gray-700">
            <tr>
              <th scope="col" className="px-2 py-3 w-4/12 md:px-6">
                Full URL
              </th>
              <th scope="col" className="px-2 py-3 w-3/12 md:px-6">
                Short URL
              </th>
              <th scope="col" className="px-2 py-3 w-1/12 md:px-6">
                Clicks
              </th>
              <th scope="col" className="px-2 py-3 w-2/12 md:px-6">
                Action
              </th>
              <th scope="col" className="px-2 py-3 w-2/12 md:px-6">
                QR Code
              </th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>

      <Modal open={open} onClose={handleClose}>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">QR Code for {selectedUrl}</h2>
            <QRCode value={`${serverUrl}/api/shortUrl/${selectedUrl}`} size={256} />
            <button
              onClick={handleClose}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DataTable;
