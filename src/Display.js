import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import React, { useState, useEffect } from "react";

//tab imports

import Typography from "@material-ui/core/Typography";

//table imports
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Inventory from "./displayComponents/Inventory";
import Requests from "./displayComponents/Requests";

const Display = (props) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  useEffect(() => {
    if (inventoryData.length === 0) {
      fetch("/inventory")
        .then((response) => response.json())

        .then((result) => {
          setInventoryData(result);
        });
    }

    if (requestData.length === 0) {
      fetch("/requests")
        .then((response) => response.json())
        .then((result) => {
          setRequestData(result);
        });
    }
  });

  return (
    <Router>
      <NavLink to="/display/requests">Requests</NavLink>
      <NavLink to="/display/inventory">Inventory</NavLink>
      <Switch>
        <div>
          <Route
            path="/display/inventory"
            component={() => {
              return <Inventory inventoryData={inventoryData} />;
            }}
          />
          <Route
            path="/display/requests"
            component={() => {
              return <Requests requestData={requestData} />;
            }}
          />
        </div>
      </Switch>
    </Router>
  );
};

export default Display;
