import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

//tab imports
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import CssBaseline from "@material-ui/core/CssBaseline";

import Inventory from "./displayComponents/Inventory";
import Requests from "./displayComponents/Requests";

import LogoHead from './interfaceComponents/LogoHead'

const Display = (props) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [requestData, setRequestData] = useState([]);

  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const tabNameToIndex = {
    0: "inventory",
    1: "requests",
  };

  const indexToTabName = {
    inventory: 0,
    requests: 1,
  };

  const [tabSelect, setTabSelect] = useState(indexToTabName[page]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const handleTab = (e, newValue) => {
    history.push(`/display/${tabNameToIndex[newValue]}`);
    setTabSelect(newValue);
  };

  useEffect(() => {
    if (isAuthenticated === null) {
      let authCookie = Cookies.get("auth");
      if (authCookie === undefined) {
        setIsAuthenticated(false);
      } else if (authCookie.includes("null")) {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    }
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
if(isAuthenticated)
{return (
    
    <>
      <CssBaseline />
      <AppBar position="static">
        <Tabs value={tabSelect} onChange={handleTab}>
          <Tab label="Inventory" />
          <Tab label="Binder Requests" />
        </Tabs>
      </AppBar>

      {tabSelect === 0 && <Inventory inventoryData={inventoryData} />}
      {tabSelect === 1 && <Requests requestData={requestData} />}
    </>
  )}else{
    return(
      <h1>You are not Allowed</h1>
    )
  }
  
};

export default Display;
