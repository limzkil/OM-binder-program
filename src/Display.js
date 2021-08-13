import React, { useState, useEffect } from "react";

//auth import
import Cookies from "js-cookie";

//MUI general import
import CssBaseline from "@material-ui/core/CssBaseline";

// component to show when user is not authorized to see data
import NotAuthorized from "./NotAuthorized";

//tab imports
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

//grid import
import Grid from '@material-ui/core/Grid';

//components to pass in fetched data
import Inventory from "./fetchComponents/Inventory";
import Requests from "./fetchComponents/Requests";

//header component
import LogoHead from './displayComponents/LogoHead'

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
      <Grid container spacing = {1}>
      <Grid item xs = {12}>
      <LogoHead />
      </Grid>
      <Grid item xs = {2} />
      <Grid item xs = {8}>
      <AppBar position="static">
        <Tabs value={tabSelect} onChange={handleTab}>
          <Tab label="Inventory" />
          <Tab label="Binder Requests" />
        </Tabs>
      </AppBar>
      <Grid item xs = {2} />
      </Grid>
      </Grid>

      {tabSelect === 0 && <Inventory inventoryData={inventoryData} />}
      {tabSelect === 1 && <Requests requestData={requestData} />}
    </>
  )}else{
    return(
      <NotAuthorized />
    )
  }
  
};

export default Display;
