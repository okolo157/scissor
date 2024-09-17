import * as React from "react";
import FormContainer from "./formContainer";
import { urlData } from "../../interface/urlData";
import axios from "axios";
import { serverUrl } from "../../helpers/constants";
import DataTable from "../dataTable/dataTable";
import CircularProgress from "@mui/material/CircularProgress"; // MUI spinner
import Box from "@mui/material/Box"; // MUI Box for centering the spinner

interface IContainerProps {}

const Container: React.FunctionComponent<IContainerProps> = () => {
  const [data, setData] = React.useState<urlData[]>([]);
  const [reload, setReload] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(true); // Loading state

  const updateReloadState = (): void => {
    setReload(true);
  };

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/shortUrl`);
      console.log("Server response", response);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading when data is fetched
      setReload(false);
    }
  };

  React.useEffect(() => {
    fetchTableData();
  }, [reload]);

  if (loading) {
    // Full-page loading animation
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={80} color="primary" /> {/* Big spinner */}
      </Box>
    );
  }

  return (
    <>
      <FormContainer updateReloadState={updateReloadState} />
      <DataTable updateReloadState={updateReloadState} data={data} />
    </>
  );
};

export default Container;
