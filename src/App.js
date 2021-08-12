import React, { useState, useEffect } from "react";

import { DataGrid, GridToolbarContainer,
  GridToolbarExport, } from "@material-ui/data-grid";

import ReactDOM from "react-dom";

import logo from "./logo.svg";
import "./App.css";
const axios = require("axios").default;

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/binders") //

      .then((response) => response.data)
      .then((data) => {
        setIsLoaded(true);
        setRowData(data);
      });
  }, []);


  // MATERIAL DATAGRID

  const columns = [
    { field: "_id", headerName: "_id", width: 250, editable: true, },

    { field: "size", headerName: "Size", width: 250, editable: true },

    { field: "color", headerName: "Color", width: 250, editable: true },

    { field: "length", headerName: "Length", width: 250, editable: true },

    {
      field: "dateSaved",
      headerName: "Date Added",
      width: 250,
      editable: true,
    },
  ];

  return (
    <div style={{ height: 700, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <DataGrid
            columns={columns}
            rows={rowData}
            getRowId={(row) => row._id}
            id="_id"
            components={{
              Toolbar: CustomToolbar,
            }}
          />
        </div>
      </div>
    </div>
    
  );
}
