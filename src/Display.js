import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
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
                  <Table className="inventoryEntry">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Length</TableCell>
                        <TableCell>Color</TableCell>
                      </TableRow>
                    </TableHead>
                    {inventoryData.map((inventory, index) => (
                      <>
                        <TableBody key={index}>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {inventory._id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {inventory.size}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {inventory.length}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {inventory.color}
                            </Typography>
                          </TableCell>
                        </TableBody>
                      </>
                    ))}
                  </Table>
                </TableContainer>
              );
            }}
          />
          <Route
            path="/display/requests"
            component={() => {
              return (
                <TableContainer className="requestContainer">
                  <Table className="requestEntry">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>County</TableCell>
                        <TableCell>ElseName</TableCell>
                        <TableCell>ElseEmail</TableCell>
                        <TableCell>ElsePhone</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>DOB</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Length</TableCell>
                        <TableCell>Color</TableCell>
                      </TableRow>
                    </TableHead>
                    {requestData.map((request, index) => (
                      <>
                        <TableBody key={index}>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request._id}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.county}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.elseName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.elseEmail}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.elsePhone}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.dob}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.email}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.phone}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.address}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.size}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.length}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle1">
                              {request.color}
                            </Typography>
                          </TableCell>
                        </TableBody>
                      </>
                    ))}
                  </Table>
                </TableContainer>
              );
            }}
          />
        </div>
      </Switch>
    </Router>
  );
};

export default Display;
