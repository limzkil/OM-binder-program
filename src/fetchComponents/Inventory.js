import React, { useState, useEffect } from "react";
import { forwardRef } from "react";

import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";

import { alpha } from '@material-ui/core/styles'


const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};

const api = axios.create({
  baseURL: `http://localhost:3000/`,
});

function App() {
  var columns = [
    { title: "id", field: "id", hidden: true },
    { title: "Size", field: "size" },
    { title: "Length", field: "length" },
    { title: "Color", field: "color" },
    { title: "Quantity", field: "quantity" },
    { title: "Date added", field: "dateSaved", editable: "never" },
  ];
  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    api
      .get("/binders")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);
  
 // FETCHES ON COMPONENTS NOT SHOWING DATA

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    if (
      newData.size !== "X-small" &&
      newData.size !== "Small" &&
      newData.size !== "Medium" &&
      newData.size !== "Large" &&
      newData.size !== "X-large" &&
      newData.size !== "2X-large" &&
      newData.size !== "3X-large" &&
      newData.size !== "4X-large" &&
      newData.size !== "5X-large"
    ) {
      errorList.push(`You entered "${newData.size}", please enter a valid size. All first letters are capitalized. All X sizes follow this format: "X-large"; not "X-Large". `);
    }
    if (
      newData.color !== "Red" && 
      newData.color !== "Purple" &&
      newData.color !== "Green" &&
      newData.color !== "Beige" &&
      newData.color !== "Tan" &&
      newData.color !== "Brown" &&
      newData.color !== "Black" &&
      newData.color !== "Grey" &&
      newData.color !== "White"
    ) {
      errorList.push(`You entered "${newData.color}", please enter a valid color. All values are capitalized.`);
    }
    if (newData.length !== "Short" && newData.length !== "Long") {
      errorList.push(`You entered "${newData.length}", please enter a valid length. All values are capitalized.`);
    }

    if (isNaN(newData.quantity)) {
      errorList.push(`You entered "${newData.quantity}", please enter a valid quantity. Only numbers are accepted.`);
    }

    if (errorList.length < 1) {
      api
        .patch("/binders/" + newData._id, newData)
        .then((res) => {
          const dataUpdate = [...data];
          const index = oldData.tableData.id;
          dataUpdate[index] = newData;
          setData([...dataUpdate]);
          resolve();
          setIserror(false);
          setErrorMessages([]);
        })
        .catch((error) => {
          setErrorMessages(["Update failed! Server error"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = [];
    if (
      newData.size !== "X-small" &&
      newData.size !=="Small" &&
      newData.size !== "Medium" &&
      newData.size !== "Large" &&
      newData.size !== "X-large" &&
      newData.size !== "2X-large" &&
      newData.size !== "3X-large" &&
      newData.size !== "4X-large" &&
      newData.size !== "5X-large"
    ) {
      errorList.push(`You entered "${newData.size}", please enter a valid size. All first letters are capitalized. All X sizes follow this format: "X-large"; not "X-Large". `);
    }
    if (
      newData.color !== "Red" && 
      newData.color !== "Purple" &&
      newData.color !== "Green" &&
      newData.color !== "Beige" &&
      newData.color !== "Tan" &&
      newData.color !== "Brown" &&
      newData.color !=="Black" &&
      newData.color !=="Grey" &&
      newData.color !=="White"
    ) {
      errorList.push(`You entered "${newData.color}", please enter a valid color. All values are capitalized.`);
    }
    if (newData.length !== "Short" && newData.length !== "Long") {
      errorList.push(`You entered "${newData.length}", please enter a valid length. All values are capitalized.`);
    }

    if (isNaN(newData.quantity)) {
      errorList.push(`You entered "${newData.quantity}", please enter a valid quantity. Only numbers are accepted.`);
    }

    if (errorList.length < 1) {
      //no error
      api
        .post("/binders/save", newData)
        .then((res) => {
          let dataToAdd = [...data];
          dataToAdd.push(newData);
          setData(dataToAdd);
          resolve();
          setErrorMessages([]);
          setIserror(false);
        })
        .catch((error) => {
          setErrorMessages(["Cannot add data. Server error!"]);
          setIserror(true);
          resolve();
        });
    } else {
      setErrorMessages(errorList);
      setIserror(true);
      resolve();
    }
  };

  const handleRowDelete = (oldData, resolve) => {
    console.log(oldData);

    api
      .delete("/binders/" + oldData._id)
      .then((res) => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve();
      })
      .catch((error) => {
        setErrorMessages(["Delete failed! Server error"]);
        setIserror(true);
        resolve();
      });
  };

  return (
    <div className="App">
      <div>
        {iserror && (
          <Alert severity="error">
            {errorMessages.map((msg, i) => {
              return <div key={i}>{msg}</div>;
            })}
          </Alert>
        )}
      </div>
      <MaterialTable
        title="Current Inventory"
        columns={columns}
        data={data}
        icons={tableIcons}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              handleRowUpdate(newData, oldData, resolve);
            }),
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              handleRowAdd(newData, resolve);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve);
            }),
        }}
        options={{
          exportButton: true,
        }}
      />
    </div>
  );
}

export default App;
