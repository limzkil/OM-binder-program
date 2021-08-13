import React from "react";
import { useState } from "react";
import Modal from "@material-ui/core/Modal";
import {
  Button,
  Container,
  Grid,
  InputLabel,
  NativeSelect,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
function BinderModal() {
  const [open, setOpen] = useState(false);
  const [binderSize, setBinderSize] = useState("");
  const [binderStyle, setBinderStyle] = useState("");
  const [binderColor, setBinderColor] = useState("");
  const [binderQuantity, setBinderQuantity] = useState("")
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const useStyles = makeStyles({
    formContain: {
      fontFamily: "Open Sans",
      minHeight: "100vh",
    },
    formItemContain: {
      margin: "30px",
    },
    formItemField: {
      width: "15vw",
    },
    formHeadings: {
      margin: "30px",
      textDecoration: "underline",
      fontFamily: "Oswald",
      color: "#993399",
    },
    submitBtn: {
      margin: "30px",
      backgroundColor: "#339999",
      "&:hover": {
        backgroundColor: "#2c8080",
      },
      width: "500px",
      fontFamily: "Open Sans",
    },
  });
  const style = useStyles();

  return (
    <div>
      <button type="button" onClick={handleOpen}>
        Create a Binder
      </button>
      <Modal open={open} onClose={handleClose}>
        <Container maxWidth="sm">
          <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            justify="center"
            className={style.formContain}
          >
            <form action="/savebinder" method="POST">
              <Grid item xs={12} className={style.formItemContain}>
                <InputLabel> What size is the binder?</InputLabel>
                <NativeSelect
                  id="binderSize"
                  name="binderSize"
                  value={binderSize}
                  onChange={(event) => setBinderSize(event.target.value)}
                >
                  <option value="">Select a size</option>
                  <option value={"Small"}>Small</option>
                  <option value={"Medium"}>Medium</option>
                  <option value={"Large"}>Large</option>
                </NativeSelect>
              </Grid>
              <Grid item xs={12} className={style.formItemContain}>
                <InputLabel>What is the style of the binder</InputLabel>
                <NativeSelect
                  id="binderStyle"
                  name="binderStyle"
                  value={binderStyle}
                  onChange={(event) => setBinderStyle(event.target.value)}
                >
                  <option value="">Select a Style</option>
                  <option value={"Short"}>Short</option>
                  <option value={"Long"}>Long</option>
                </NativeSelect>
              </Grid>
              <Grid item xs={12} className={style.formItemContain}>
                <InputLabel>What is the color of the binder?</InputLabel>
                <NativeSelect
                  id="binderColor"
                  name="binderColor"
                  value={binderColor}
                  onChange={(event) => setBinderColor(event.target.value)}
                >
                  <option value="">Select a Color</option>
                  <option value={"Blue"}>Blue</option>
                  <option value={"Red"}>Red</option>
                </NativeSelect>
                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="binderQuantity"
                    placeholder="enter the number of binders you are adding"
                    value={binderQuantity}
                    className={style.formItemField}
                    onChange={(event) => setBinderQuantity(event.target.value)}
                  />
                </Grid>
              </Grid>
              <Button
                color="primary"
                varient="containted"
                type="submit"
                value="Submit Form"
                className={style.submitBtn}
              >
                Submit
              </Button>
            </form>
          </Grid>
        </Container>
      </Modal>
    </div>
  );
}

export default BinderModal;
