import React, { useState, useEffect } from "react";
import { forwardRef } from "react";

import { makeStyles } from "@material-ui/core/styles";

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
import { Button } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
const useStyles = makeStyles({
  details: {
    fontFamily: "Oswald",
    textAlign: "center",
  },
});

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
  baseURL: `http://localhost:3000`,
});

export default function Waitlist() {

 const style= useStyles()

 let columns = [
  { title: "id", field: "id", hidden: true },
  { title: "County", field: "county", hidden: true, export: true  },
  { title: "Requestor Name", field: "nameElse", export: true },
    { title: "Requestor Email", field: "emailElse", hidden: true, export: true  },
    { title: "Requestor Phone", field: "numberElse", hidden: true, export: true  },
  { title: "Name", field: "nameSelf" },
  { title: "DOB", field: "dob", hidden: true, export: true  },
  { title: "Email", field: "email" },
  { title: "Phone", field: "phone", hidden: true, export: true  },
  { title: "Street", field: "address.address1", hidden: true, export: true  },
  { title: "Apt/PO Box", field: "address.address2", hidden: true, export: true  },
  { title: "City", field: "address.city", hidden: true, export: true  },
  { title: "State", field: "address.state", hidden: true, export: true  },
  { title: "ZipCode", field: "address.zip", hidden: true, export: true  },
  { title: "Size", field: "size" },
  { title: "Length", field: "length", hidden: true, export: true  },
  { title: "Color", field: "color", hidden: true, export: true  },
];
  let modalColumns = [
    { title: "id", field: "id", hidden: true },
    { title: "County", field: "county" },
    { title: "Requestor Name", field: "nameElse" },
    { title: "Requestor Email", field: "emailElse" },
    { title: "Requestor Phone", field: "phoneElse" },
    { title: "Name", field: "nameSelf" },
    { title: "DOB", field: "dob" },
    { title: "Email", field: "emailSelf" },
    { title: "Phone", field: "phoneSelf" },
    { title: "Street", field: "address.address1" },
    { title: "Apt/PO Box", field: "address.address2" },
    { title: "City", field: "address.city" },
    { title: "State", field: "address.state" },
    { title: "ZipCode", field: "address.zip" },
    { title: "Size", field: "size" },
    { title: "Length", field: "length" },
    { title: "Color", field: "color" },
  ];
  const [data, setData] = useState([]); //table data
  //Modal code
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  function handleOpen(rowData) {
    let newArray = [];
    newArray.push(rowData);
    console.log(data);
    console.log(newArray);
    setModalData(newArray);

    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  //for error handling
  const [iserror, setIserror] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    console.log("hehe");
    api
      .get("/wait")
      .then((res) => {
        setData(res.data);
      })
      .catch((error) => {
        console.log("Error");
      });
  }, []);

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = [];
    if (
      newData.county !== "Androscoggin" &&
      newData.county !== "Aroostook" &&
      newData.county !== "Cumberland" &&
      newData.county !== "Franklin" &&
      newData.county !== "Hancock" &&
      newData.county !== "Kennebec" &&
      newData.county !== "Knox" &&
      newData.county !== "Lincoln" &&
      newData.county !== "Oxford" &&
      newData.county !== "Penobscot" &&
      newData.county !== "Piscataquis" &&
      newData.county !== "Sagadahoc" &&
      newData.county !== "Somerset" &&
      newData.county !== "Waldo" &&
      newData.county !== "Washington" &&
      newData.county !== "York"
    ) {
      errorList.push(
        `You entered "${
          newData.county || "no value"
        }", please enter a valid Maine county. All values are capitalized.`
      );
    }
    if (newData.nameSelf === "") {
      errorList.push("This field cannot be empty.");
    }
    if (newData.dob === "") {
      errorList.push("This field cannot be empty.");
    }

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
      errorList.push(
        `You entered "${
          newData.size || "empty value"
        }", please enter a valid size. All first letters are capitalized. All X sizes follow this format: "X-large"; not "X-Large". `
      );
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
      newData.color !== "White" &&
      newData.color !== "" &&
      newData.color !== null
    ) {
      errorList.push(
        `You entered "${
          newData.color || "an invalid value"
        }", please enter a valid color. All values are capitalized.`
      );
    }
    if (
      newData.length !== "Short" &&
      newData.length !== "Long" &&
      newData.length !== "" &&
      newData.length !== null
    ) {
      errorList.push(
        `You entered "${
          newData.length || "an invalid value"
        }", please enter a valid length. All values are capitalized.`
      );
    }

    if (errorList.length < 1) {
      api
        .patch("/wait/" + newData._id, newData)
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
    //validation
    let errorList = [];
    if (
      newData.county !== "Androscoggin" &&
      newData.county !== "Aroostook" &&
      newData.county !== "Cumberland" &&
      newData.county !== "Franklin" &&
      newData.county !== "Hancock" &&
      newData.county !== "Kennebec" &&
      newData.county !== "Knox" &&
      newData.county !== "Lincoln" &&
      newData.county !== "Oxford" &&
      newData.county !== "Penobscot" &&
      newData.county !== "Piscataquis" &&
      newData.county !== "Sagadahoc" &&
      newData.county !== "Somerset" &&
      newData.county !== "Waldo" &&
      newData.county !== "Washington" &&
      newData.county !== "York"
    ) {
      errorList.push(
        `You entered "${
          newData.county || "no value"
        }", please enter a valid Maine county. All values are capitalized.`
      );
    }
    if (newData.nameSelf === "") {
      errorList.push("This field cannot be empty.");
    }
    if (newData.dob === "") {
      errorList.push("This field cannot be empty.");
    }

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
      errorList.push(
        `You entered "${
          newData.size || "empty value"
        }", please enter a valid size. All first letters are capitalized. All X sizes follow this format: "X-large"; not "X-Large". `
      );
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
      newData.color !== "White" &&
      newData.color !== "" &&
      newData.color !== null
    ) {
      errorList.push(
        `You entered "${
          newData.color || "an invalid value"
        }", please enter a valid color. All values are capitalized.`
      );
    }
    if (
      newData.length !== "Short" &&
      newData.length !== "Long" &&
      newData.length !== "" &&
      newData.length !== null
    ) {
      errorList.push(
        `You entered "${
          newData.length || "an invalid value"
        }", please enter a valid length. All values are capitalized.`
      );
    }

    if (errorList.length < 1) {
      //no error
      api
        .post("/wait/save", newData)
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
      .delete("/wait/" + oldData._id)
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
    <>
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
        title="WaitListed Requests"
        columns={columns}
        data={data}
        icons={tableIcons}
        onRowClick={(event, rowData) => handleOpen(rowData)}
        editable={{
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              handleRowDelete(oldData, resolve);
            }),
        }}
        options={{
          exportButton: true,
        }}
      />

      <Modal open={open} onClose={handleClose}>
        <MaterialTable
          title="Row Edit"
          columns={modalColumns}
          data={modalData}
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
          detailPanel={[
            {
              tooltip: "Show Comments",
              render: (data) => {
                return <div className={style.details}>{data.moreInfo}</div>;
              },
            },
          ]}
        />
      </Modal>
    </>
  );
}
