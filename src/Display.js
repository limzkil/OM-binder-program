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
import ReadyToShip from "./fetchComponents/ReadyToShip";
import WaitList from "./fetchComponents/WaitList";

//header component
import LogoHead from './displayComponents/LogoHead'

const Display = (props) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [waitListData, setWaitListData] = useState([]);

  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const tabNameToIndex = {
    0: "inventory",
    1: "readytoship",
    2: "waitlist"
  };

  const indexToTabName = {
    inventory: 0,
    readytoship: 1,
    waitlist: 2
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
      fetch("/binders")
        .then((response) => response.json())

        .then((result) => {
          setInventoryData(result);
        });
    }

    if (requestData.length === 0) {
      fetch("/ready")
        .then((response) => response.json())
        .then((result) => {
          setRequestData(result);
        });
    }

    if(waitListData.length === 0){
      fetch("/wait")
        .then(res => res.json())
        .then(setWaitListData)
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
      
      <Grid item xs = {12}>
      <AppBar position="static">
        <Tabs value={tabSelect} onChange={handleTab}>
          <Tab label="Inventory" />
          <Tab label="Ready to Ship" />
          <Tab label="Wait List" />
        </Tabs>
      </AppBar>
      
      </Grid>
      </Grid>

      {tabSelect === 0 && <Inventory />}
      {tabSelect === 1 && <ReadyToShip />}
      {tabSelect === 2 && <WaitList />}
    </>
  )}else{
    return(
      <NotAuthorized />
    )
  }
};

export default Display;
