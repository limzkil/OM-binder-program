//React, useState and Effect import
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
import Typography from "@material-ui/core/Typography"

//grid import
import Grid from '@material-ui/core/Grid';

//components to pass in fetched data
import Inventory from "./fetchComponents/Inventory";
import ReadyToShip from "./fetchComponents/ReadyToShip";
import Waitlist from "./fetchComponents/Waitlist";
import Shipped from "./fetchComponents/Shipped"

//banner component
import Banner from './displayComponents/Banner'

//Main Display component used to sort through and render data from different fetch components 
const Display = (props) => {
  //useState variables used to house fetched data and make changes to it.
  const [inventoryData, setInventoryData] = useState([]);
  const [readyToShipData, setReadyToShipData] = useState([]);
  const [waitListData, setWaitListData] = useState([]);
  const [shippedData, setShippedData] = useState([]);

  const { match, history } = props;
  const { params } = match;
  const { page } = params;

  const tabNameToIndex = {
    0: "inventory",
    1: "waitlist",
    2: "readytoship",
    3: "shipped"
  };

  const indexToTabName = {
    inventory: 0,
    waitlist: 1,
    readytoship: 2,
    shipped: 3
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

  //if no information exists within state variables, attempts to fetch information from appropriate API route, 
  //converts the information to json format and assigns the resulting value to the initial state variable
    if (inventoryData.length === 0) {
      fetch("/binders")
        .then((response) => response.json())

        .then((result) => {
          setInventoryData(result);
        });
    }

    if (readyToShipData.length === 0) {
      fetch("/ready")
        .then((response) => response.json())
        .then((result) => {
          setReadyToShipData(result);
        });
    }

    if(waitListData.length === 0){
      fetch("/wait")
      .then((response) => response.json())
      .then((result) => {
        setWaitListData(result);
      });
    }

    if(shippedData.length === 0){
      fetch("/shipped")
      .then((response) => response.json())
      .then((result) => {
        setShippedData(result);
      });
    }
  });


//display properties for an authorized user
if(isAuthenticated)
{return (
    
    <>
      <CssBaseline />
      <Grid container spacing = {1}>
    
      <Grid item xs = {12}>
      <Banner />
      </Grid>
      
      <Grid item xs = {12}>
      <AppBar position="static" style = {{backgroundColor: "#339999"}}>
      <Typography variant = "h2" style = {{fontFamily: 'Oswald'}}>Binder Program Management</Typography>
        <Tabs value={tabSelect} onChange={handleTab} TabIndicatorProps={{
           style: { background: "#ffcc33", height: ".5em" }}}>
          <Tab label={`Inventory(${inventoryData.length})`}   />
          <Tab label={`Wait List (${waitListData.length})`} />
          <Tab label={`Ready to Ship (${readyToShipData.length})`} />
          <Tab label={`Shipped (${shippedData.length})`} />
        </Tabs>
    
      </AppBar>
      
      </Grid>
      </Grid>

      {tabSelect === 0 && <Inventory />}
      {tabSelect === 1 && <Waitlist />}
      {tabSelect === 2 && <ReadyToShip />}
      {tabSelect === 3 && <Shipped />}

      <Grid item xs = {12} >
      
      </Grid>
    </>
  )}

  else{
    return(
      <NotAuthorized />
    )
  }
};

export default Display;
