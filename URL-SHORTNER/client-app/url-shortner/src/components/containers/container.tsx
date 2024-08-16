import * as React from "react";
import FormContainer from "./formContainer";
import { urlData } from "../../interface/urlData";
import axios from "axios";
import { serverUrl } from "../../helpers/constants";
import DataTable from "../dataTable/dataTable";

interface IContainerProps {}

const Container: React.FunctionComponent<IContainerProps> = () => {
  const [data, setData] = React.useState<urlData[]>([]);
  const [reload, setReload] = React.useState<boolean>(false);
  const updateReloadState = (): void => {
    setReload(true);
    // fetchTableData();
  };

  const fetchTableData = async () => {
    const response = await axios.get(`${serverUrl}/api/shortUrl`);
    console.log("Server response", response);
    setData(response.data);
    setReload(false);
    // console.log("Data:", data);
  };

  React.useEffect(() => {
    fetchTableData();
  }, [reload]);

  return (
    <>
      <FormContainer updateReloadState={updateReloadState} />
      <DataTable updateReloadState={updateReloadState} data={data} />
    </>
  );
};

export default Container;
