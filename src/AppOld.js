import React, { useState, useEffect } from "react";

import ReactDataGrid from 'react-data-grid';

import "./App.css";
const axios = require("axios").default;
const Item = require("./model");


export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    axios

      .get("http://localhost:3000/binders") // node.js MongoDB mongoose users REST service

      .then((response) => {
        setIsLoaded(true);

        console.log(response.data);

        setRowData(response.data);

        response.data.forEach((binder) => {});
      });
  }, []);

  // MATERIAL DATAGRID

  const columns = [
    { key: "_id", name: "_id", width: 250, editable: true },
    { key: "id", name: "ID", width: 250 },

    { key: "size", name: "Size", width: 250, editable: true },

    { key: "color", name: "Color", width: 250, editable: true },

    { key: "length", name: "Length", width: 250, editable: true },

    {
      key: "dateSaved",
      headerName: "Date Added",
      width: 250,
      editable: true,
    },
  ];

  return (
    <div style={{ height: 700, width: "100%" }}>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ flexGrow: 1 }}>
          <ReactDataGrid
            columns={columns}
            rows={rowData}
            getRowId={(row) => row._id}
            onEditComplete={fetch("http://localhost:3000/binders/:binderId", {
              headers: { "content-type": "application/json" },
              method: "PATCH",
            })}
          />
        </div>
      </div>
    </div>
  );
}
