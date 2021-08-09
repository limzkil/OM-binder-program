import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

//tab imports
import AppBar from "@material-ui/core/AppBar"
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

//display imports
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'

//table imports
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


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
      <Switch>
        <div>
          <Route
            path="/display/inventory"
            component={() => {
              return (
                <TableContainer className="inventoryContainer">
                  {console.log("meeee!!!!")}
                  {inventoryData.map((inventory, index) => (
                    <>

                    <Table key={index} className="inventoryEntry">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Length</TableCell>
                        <TableCell>Color</TableCell>

                        </TableRow>
                        </TableHead>

                      <TableBody>
                        <TableCell><Typography variant = "subtitle1">{inventory._id}</Typography></TableCell>
                        <TableCell><Typography variant = "subtitle1">{inventory.size}</Typography></TableCell> 
                        <TableCell><Typography variant = "subtitle1">{inventory.length}</Typography></TableCell>
                        <TableCell><Typography variant = "subtitle1">{inventory.color}</Typography></TableCell>
                      </TableBody>

                    </Table>
                    </>
                  ))}
                </TableContainer>
              );
            }}
          />
          <Route
            path="/display/requests"
            component={() => {
              return (
                <div className="requestContainer">
                  <div>
                    {requestData.map((request, index) => (
                      <div key={index} className="requestEntry">
                        <div>
                          <h3>{request._id}</h3>
                          <h3>{request.county}</h3>
                          <h3>{request.elseName}</h3>
                          <h3>{request.elseEmail}</h3>
                          <h3>{request.elsePhone}</h3>
                          <h3>{request.name}</h3>
                          <h3>{request.dob}</h3>
                          <h3>{request.email}</h3>
                          <h3>{request.phone}</h3>
                          <h3>{request.address}</h3>
                          <h3>{request.size}</h3>
                          <h3>{request.length}</h3>
                          <h3>{request.color}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }}
          />
        </div>
      </Switch>
    </Router>
  );
};

export default Display;
