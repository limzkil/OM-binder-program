import React, { useState, useEffect } from "react";

const Display = (props) => {
  const [inventoryData, setInventoryData] = useState([]);
  useEffect(() => {
    if (inventoryData.length === 0) {
      fetch("/inventory")
        .then((response) => response.json())

        .then((result) => {
          setInventoryData(result);
        });
    }
  }, [inventoryData]);
  return (
    <div className="inventoryContainer">
      <div> Hello I am Display</div>

      {inventoryData.map((inventory, index) => (
        <div key={index} className="inventoryEntry">
          <h1>{inventory.email}</h1>
        </div>
      ))}
    </div>
  );
};

export default Display;
