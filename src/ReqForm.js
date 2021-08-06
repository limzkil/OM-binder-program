import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { useState } from "react";

export default function ReqForm() {
  const [sent, setSent] = useState(false);
  const [nameSelf, setNameSelf] = useState("");
  const [emailSelf, setEmailSelf] = useState("");
  const [numberSelf, setNumberSelf] = useState("");
  const [addressSelf, setAddressSelf] = useState("");
  const [resMaine, setResMaine] = useState("");
  const [ageCheck, setAgeCheck] = useState(false);
  const [selfOrElse, setSelfOrElse] = useState(true);
  const [minorConsent, setMinorConsent] = useState(false);
  const [nameElse, setNameElse] = useState("");
  const [emailElse, setEmailElse] = useState("");
  const [numberElse, setNumberElse] = useState("");
  const [yesMeasure, setYesMeasure] = useState(false);
  const [bindSize, setBindSize] = useState("");
  const [noPref, setNoPref] = useState(false);
  const [waitLength, setWaitLength] = useState(false);
  const [waitColor, setWaitColor] = useState(false);
  const [waitLenCol, setWaitLenCol] = useState(false);
  const [bindLength, setBindLength] = useState("");
  const [bindColor, setBindColor] = useState("");
  const [yesConfirm, setYesConfirm] = useState(false)

  const handleSend = async (e) => {
    setSent(true);
    try {
      await fetch("http://localhost:5000/send_mail", {
        body: JSON.stringify({
          // email: email,
          // number: number,
          // address: address,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* div container setting the styling of the entire form to root */}
      <Container maxWidth="sm">
        <CssBaseline />
        {!sent ? (
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: "100vh" }}
          >
            <form onSubmit={handleSend} action="/" method="POST">
              <Grid item xs={12}>
                <InputLabel>
                  What is your county of residence in Maine?
                </InputLabel>
                <NativeSelect
                  id="resMaine"
                  value={resMaine}
                  onChange={(e) => setResMaine(e.target.value)}
                >
                  <option value="">Select county</option>
                  <option value={resMaine}>Androscoggin</option>
                  <option value={resMaine}>Aroostook</option>
                  <option value={resMaine}>Cumberland</option>
                  <option value={resMaine}>Franklin</option>
                  <option value={resMaine}>Hancock</option>
                  <option value={resMaine}>Kennebec</option>
                  <option value={resMaine}>Knox</option>
                  <option value={resMaine}>Lincoln</option>
                  <option value={resMaine}>Oxford</option>
                  <option value={resMaine}>Penobscot</option>
                  <option value={resMaine}>Piscataquis</option>
                  <option value={resMaine}>Sagadahoc</option>
                  <option value={resMaine}>Somerset</option>
                  <option value={resMaine}>Waldo</option>
                  <option value={resMaine}>Washington</option>
                  <option value={resMaine}>York</option>
                </NativeSelect>
              </Grid>

              <Grid item xs={12}>
                <InputLabel>
                  Are you requesting for yourself or someone else?
                </InputLabel>
                <NativeSelect
                  id="selfOrElse"
                  value={selfOrElse}
                  onChange={(e) => setSelfOrElse(e.target.value)}
                >
                  <option value={true}>I am requesting for myself.</option>
                  <option value={false}>
                    I am requesting for someone else.
                  </option>
                </NativeSelect>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={minorConsent}
                      onChange={(e) => setMinorConsent(e.target.checked)}
                    />
                  }
                  label="I have consent to make this request and ship it to the given address."
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel>Are you between the ages of 14 and 22?</InputLabel>
                <NativeSelect
                  id="ageCheck"
                  value={ageCheck}
                  onChange={(e) => setAgeCheck(e.target.value)}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </NativeSelect>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your name (else)"
                  value={nameElse}
                  onChange={(e) => setNameElse(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your email (else)"
                  value={emailElse}
                  onChange={(e) => setEmailElse(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your number (else)"
                  value={numberElse}
                  onChange={(e) => setNumberElse(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your name (self)"
                  value={nameSelf}
                  onChange={(e) => setNameSelf(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your email (self)"
                  value={emailSelf}
                  onChange={(e) => setEmailSelf(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your number (self)"
                  value={numberSelf}
                  onChange={(e) => setNumberSelf(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  placeholder="Enter your address (self)"
                  value={addressSelf}
                  onChange={(e) => setAddressSelf(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={yesMeasure}
                      onChange={(e) => setYesMeasure(e.target.checked)}
                    />
                  }
                  label="I have measured the binder size according to the FAQ."
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel>What is your size?</InputLabel>
                <NativeSelect
                  id="bindSize"
                  value={bindSize}
                  onChange={(e) => setBindSize(e.target.value)}
                >
                  <option value="">Select size</option>
                  <option value={resMaine}>X-small</option>
                  <option value={resMaine}>Small</option>
                  <option value={resMaine}>Medium</option>
                  <option value={resMaine}>Large</option>
                  <option value={resMaine}>X-large</option>
                  <option value={resMaine}>2X-large</option>
                  <option value={resMaine}>3X-large</option>
                  <option value={resMaine}>4X-large</option>
                  <option value={resMaine}>5X-large</option>
                </NativeSelect>
              </Grid>

              <InputLabel>Please check ONE box regarding your preferences.</InputLabel>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={noPref}
                      onChange={(e) => setNoPref(e.target.checked)}
                    />
                  }
                  label="I have no preference on color or length."
                />
              </Grid>


              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={waitLength}
                      onChange={(e) => setWaitLength(e.target.checked)}
                    />
                  }
                  label="I have preference on length and I am willing to wait."
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={waitColor}
                      onChange={(e) => setWaitColor(e.target.checked)}
                    />
                  }
                  label="I have preference on color and I am willing to wait."
                />
              </Grid>

              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={waitLenCol}
                      onChange={(e) => setWaitLenCol(e.target.checked)}
                    />
                  }
                  label="I have preference on color and length and I am willing to wait."
                />
              </Grid>

              <Grid item xs={12}>
                <InputLabel>What is your preferred length?</InputLabel>
                <NativeSelect
                  id="bindLength"
                  value={bindLength}
                  onChange={(e) => setBindLength(e.target.value)}
                >
                  <option value="">Select length</option>
                  <option value={bindLength}>Short</option>
                  <option value={bindLength}>Long</option>

                </NativeSelect>
              </Grid>

              <Grid item xs={12}>
                <InputLabel>What is your preferred color?</InputLabel>
                <NativeSelect
                  id="bindColor"
                  value={bindColor}
                  onChange={(e) => setBindColor(e.target.value)}
                >
                  <option value="">Select color</option>
                  <option value={bindColor}>Red</option>
                  <option value={bindColor}>Purple</option>
                  <option value={bindColor}>Green</option>
                  <option value={bindColor}>Beige</option>
                  <option value={bindColor}>Tan</option>
                  <option value={bindColor}>Brown</option>
                  <option value={bindColor}>Black</option>
                  <option value={bindColor}>Grey</option>
                  <option value={bindColor}>White</option>

                </NativeSelect>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={yesConfirm}
                      onChange={(e) => setYesConfirm(e.target.checked)}
                    />
                  }
                  label="I am confirming I have double checked the given information."
                />
              </Grid>
              <Button
                color="primary"
                variant="contained"
                type="submit"
                value="Submit Form"
              >
                Submit
              </Button>
            </form>
          </Grid>
        ) : (
          <h1>A confirmation email has been sent to the address provided.</h1>
        )}
      </Container>
    </>
  );
}
