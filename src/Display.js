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
  const [readyToShipData, setReadyToShipData] = useState([]);
  const [waitListData, setWaitListData] = useState([]);
  const [fetchedData, setFetchedData] = useState(false);

  //match object contains information about how a <Route path> matched the URL which it receives as props from App.js
  //history object represents the history stack of the browser
  const { match, history } = props;
  //params key/value pairs parsed from the URL corresponding to the dynamic segments of the path
  const { params } = match;
  //page is used to grab the current page out of the params and match it to its index value
  const { page } = params;

  //look up tables for connecting the tab names to a 0-index
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

  //state variables
  
  const [tabSelect, setTabSelect] = useState(indexToTabName[page]);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  // handleTab pushes the value of the indexed tabNameToIndex array into the URL so it indicates the currently selected tab
  //and changes the tabSelect state to reflect the currently reflected tab
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
    

    if (readyToShipData.length === 0 && fetchedData === false) {
      setFetchedData(true)
      fetch("/ready")
        .then((response) => response.json())
        .then((result) => {
          setReadyToShipData(result);
        });
    }
    if(waitListData.length === 0 && fetchedData === false){
      setFetchedData(true)
      fetch("/wait")
      .then((response) => response.json())
      .then((result) => {
        setWaitListData(result);
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
      {/* Tabs value holds the currently selected tab; tabs are 0-indexed */}
      {/* TabIndicatorProps controls the styling on the underline of currently selected tabs */}
        <Tabs value={tabSelect} onChange={handleTab} TabIndicatorProps={{
           style: { background: "#ffcc33", height: ".5em" }}}>
             {/* Tab label represents the title of each tab; the length of the data is to indicate how many entries are in each component. */}
          <Tab label={`Inventory`}   />
          <Tab label={`Wait List (${waitListData.length})`} />
          <Tab label={`Ready to Ship (${readyToShipData.length})`} />
          <Tab label={`Shipped`} />
        </Tabs>
    
      </AppBar>
      
      </Grid>
      </Grid>
          {/* Tabs are 0-indexed, so as the user clicks each tab, these tabSelects pair the index with the component that needs to be displayed */}
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
