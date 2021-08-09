import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

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
          console.log(result);
          setRequestData(result);
        });
    }
  });
  console.log(requestData);
  return (
    <Router>
      <Switch>
        <div>
          <Route
            path="/inventory"
            component={() => {
              return (
                <div className="inventoryContainer">
                  {inventoryData.map((inventory, index) => (
                    <div key={index} className="inventoryEntry">
                      <div>
                        <h3>{inventory._id}</h3>
                        <h3>{inventory.size}</h3> <h3>{inventory.length}</h3>
                        <h3>{inventory.color}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          <Route
            path="/requests"
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
