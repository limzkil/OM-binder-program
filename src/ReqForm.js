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
import Typography from "@material-ui/core/Typography";

import { useState, useEffect } from "react";

const useStyles = makeStyles({
  formContain: {
    fontFamily: "Open Sans",
    minHeight: "100vh",
  },
  formItemContain: {
    margin: "1.5em",
  },
  formItemField: {
    width: "25em",
  },
  formHeadings: {
    margin: "1em 1em 1em .5em",
    textDecoration: "underline",
    fontFamily: "Oswald",
    color: "#993399",
  },
  submitBtn: {
    margin: "1.5em",
    backgroundColor: "#339999",
    "&:hover": {
      backgroundColor: "#2c8080",
    },
    width: "35em",
    fontFamily: "Open Sans",
  },
});

//to add to schema: progSource, isFirstBind, moreInf, yesSurvey

export default function ReqForm() {
  const [sent, setSent] = useState(false);

  const [resMaine, setResMaine] = useState("");
  const [progSource, setProgSource] = useState("");
  const [selfOrElse, setSelfOrElse] = useState(false);

  const [minorConsent, setMinorConsent] = useState(false);
  const [nameElse, setNameElse] = useState("");
  const [emailElse, setEmailElse] = useState("");
  const [numberElse, setNumberElse] = useState("");
  const [relMinor, setRelMinor] = useState("");

  const [ageCheck, setAgeCheck] = useState(false);
  const [isFirstBind, setIsFirstBind] = useState(false);


  const [nameSelf, setNameSelf] = useState("");
  const [birth, setBirth] = useState("");
  const [emailSelf, setEmailSelf] = useState("");
  const [numberSelf, setNumberSelf] = useState("");
  const [addressSelf, setAddressSelf] = useState("");
   
  const [yesMeasure, setYesMeasure] = useState(false);

  const [bindSize, setBindSize] = useState("");

  const [noPref, setNoPref] = useState(false);
  const [waitLength, setWaitLength] = useState(false);
  const [waitColor, setWaitColor] = useState(false);
  const [waitLenCol, setWaitLenCol] = useState(false);

  const [bindLength, setBindLength] = useState("");
  const [bindColor, setBindColor] = useState("");
  const [moreInf, setMoreInf] = useState("")

  const [yesConfirm, setYesConfirm] = useState(false);
  const [yesSurvey, setYesSurvey] = useState(false)


  const style = useStyles();

  const handleSend = async (e) => {
    setSent(true);
    try {
      await fetch("http://localhost:5000/send_mail", {
        body: JSON.stringify({
          emailSelf: emailSelf,
          elseEmail: emailElse,
          numberSelf: numberSelf,
          numberElse: numberElse,
          addressSelf: addressSelf,
          size: bindSize,
          county: resMaine,
          nameSelf: nameSelf,
          nameElse: nameElse,
          dob: birth,
          bindLength: bindLength,
          bindColor: bindColor
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selfOrElse === "true") {
      setSelfOrElse(true);
    } else if (selfOrElse === "false") {
      setSelfOrElse(false);
    }
  }, [selfOrElse]);


  return (
    <>
      {/* div container setting the styling of the entire form to root */}
      <Container maxWidth="sm">
        <CssBaseline />
        {!sent ? (
          <>
            <Typography
              className={style.formHeadings}
              variant="h3"
              style={{
                color: "white",
                backgroundColor: "#ffcc33",
                padding: ".5em .7em .7em .7em ",
                textAlign: "center"
              }}
            >
              Binder Request Form
            </Typography>
            <Grid
              container
              spacing={1}
              direction="column"
              alignItems="center"
              justify="center"
              className={style.formContain}
            >
              <form onSubmit={handleSend} action="/" method="POST">
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    What is your county of residence in Maine?
                  </InputLabel>
                  <NativeSelect
                    id="resMaine"
                    name="resMaine"
                    value={resMaine}
                    onChange={(e) => setResMaine(e.target.value)}
                  >
                    <option value="">Select county</option>
                    <option value={"Androscoggin"}>Androscoggin</option>
                    <option value={"Aroostook"}>Aroostook</option>
                    <option value={"Cumberland"}>Cumberland</option>
                    <option value={"Franklin"}>Franklin</option>
                    <option value={"Hancock"}>Hancock</option>
                    <option value={"Kennebec"}>Kennebec</option>
                    <option value={"Knox"}>Knox</option>
                    <option value={"Lincoln"}>Lincoln</option>
                    <option value={"Oxford"}>Oxford</option>
                    <option value={"Penobscot"}>Penobscot</option>
                    <option value={"Piscataquis"}>Piscataquis</option>
                    <option value={"Sagadahoc"}>Sagadahoc</option>
                    <option value={"Somerset"}>Somerset</option>
                    <option value={"Waldo"}>Waldo</option>
                    <option value={"Washington"}>Washington</option>
                    <option value={"York"}>York</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Are you requesting for yourself or someone else?
                  </InputLabel>
                  <NativeSelect
                    id="selfOrElse"
                    value={selfOrElse}
                    onChange={(e) => setSelfOrElse(e.target.value)}
                  >
                    <option value={false}>I am requesting for myself.</option>
                    <option value={true}>
                      I am requesting for someone else.
                    </option>
                  </NativeSelect>
                </Grid>
                {console.log(selfOrElse)}

                {selfOrElse ? (
                  <>
                    <Typography className={style.formHeadings} variant="h4">
                      Requester Information
                    </Typography>
                    <Grid item xs={12} className={style.formItemContain}>
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

                    <Grid item xs={12} className={style.formItemContain}>
                      <TextField
                        type="text"
                        name="elseName"
                        placeholder="Enter your name (requester)"
                        value={nameElse}
                        className={style.formItemField}
                        onChange={(e) => setNameElse(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} className={style.formItemContain}>
                      <TextField
                        type="text"
                        name="elseEmail"
                        placeholder="Enter your email (requester)"
                        value={emailElse}
                        className={style.formItemField}
                        onChange={(e) => setEmailElse(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} className={style.formItemContain}>
                      <TextField
                        type="text"
                        name="elsePhone"
                        placeholder="Enter your number (requester)"
                        value={numberElse}
                        className={style.formItemField}
                        onChange={(e) => setNumberElse(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} className={style.formItemContain}>
                      <InputLabel>
                        What is your relationship with the requestee?
                      </InputLabel>
                      <NativeSelect
                        id="relMinor"
                        name="relMinor"
                        value={relMinor}
                        onChange={(e) => setRelMinor(e.target.value)}
                      >
                        <option value="">Select relationship</option>
                        <option value={"Parent"}>Parent</option>
                        <option value={"Relative"}>Relative</option>
                        <option value={"Friend"}>Friend</option>
                        <option value={"Mentor"}>Mentor</option>
                        <option value={"School employee"}>
                          School employee
                        </option>
                        <option value={"Other trusted person"}>
                          Other trusted person
                        </option>
                      </NativeSelect>
                    </Grid>
                  </>
                ) : null}

                <Typography className={style.formHeadings} variant="h4">
                  Requestee Information
                </Typography>
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Are you or the person you are requesting for between 14 and
                    22?
                  </InputLabel>
                  <NativeSelect
                    id="ageCheck"
                    value={ageCheck}
                    onChange={(e) => setAgeCheck(e.target.value)}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Is the first binder owned by you or the person you are
                    requesting for?
                  </InputLabel>
                  <NativeSelect
                    id="isFirstBind"
                    value={isFirstBind}
                    onChange={(e) => setIsFirstBind(e.target.value)}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="name"
                    placeholder="Enter your name (requestee)"
                    className={style.formItemField}
                    value={nameSelf}
                    onChange={(e) => setNameSelf(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Enter your birthday in mm/dd/yyyy format
                  </InputLabel>
                  <TextField
                    type="text"
                    name="dob"
                    placeholder=""
                    value={birth}
                    className={style.formItemField}
                    onChange={(e) => setBirth(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="email"
                    placeholder="Enter your email (requestee)"
                    value={emailSelf}
                    className={style.formItemField}
                    onChange={(e) => setEmailSelf(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="phone"
                    placeholder="Enter your number (requestee)"
                    value={numberSelf}
                    className={style.formItemField}
                    onChange={(e) => setNumberSelf(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="address"
                    placeholder="Enter your address (requestee)"
                    value={addressSelf}
                    className={style.formItemField}
                    onChange={(e) => setAddressSelf(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
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

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>What is your size?</InputLabel>
                  <NativeSelect
                    id="bindSize"
                    name="size"
                    value={bindSize}
                    onChange={(e) => setBindSize(e.target.value)}
                  >
                    <option value="">Select size</option>
                    <option value={"X-small"}>X-small</option>
                    <option value={"Small"}>Small</option>
                    <option value={"Medium"}>Medium</option>
                    <option value={"Large"}>Large</option>
                    <option value={"X-large"}>X-large</option>
                    <option value={"2X-large"}>2X-large</option>
                    <option value={"3X-large"}>3X-large</option>
                    <option value={"4X-large"}>4X-large</option>
                    <option value={"5X-large"}>5X-large</option>
                  </NativeSelect>
                </Grid>

                <InputLabel className={style.formItemContain}>
                  Please check ONE box regarding your preferences.
                </InputLabel>

                <Grid item xs={12} className={style.formItemContain}>
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

                <Grid item xs={12} className={style.formItemContain}>
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

                <Grid item xs={12} className={style.formItemContain}>
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

                <Grid item xs={12} className={style.formItemContain}>
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

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>What is your preferred length?</InputLabel>
                  <NativeSelect
                    id="bindLength"
                    name="length"
                    value={bindLength}
                    onChange={(e) => setBindLength(e.target.value)}
                  >
                    <option value="">Select length</option>
                    <option value={"Short"}>Short</option>
                    <option value={"Long"}>Long</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>What is your preferred color?</InputLabel>
                  <NativeSelect
                    id="bindColor"
                    name="color"
                    value={bindColor}
                    onChange={(e) => setBindColor(e.target.value)}
                  >
                    <option value="">Select color</option>
                    <option value={"Red"}>Red</option>
                    <option value={"Purple"}>Purple</option>
                    <option value={"Green"}>Green</option>
                    <option value={"Beige"}>Beige</option>
                    <option value={"Tan"}>Tan</option>
                    <option value={"Brown"}>Brown</option>
                    <option value={"Black"}>Black</option>
                    <option value={"Grey"}>Grey</option>
                    <option value={"White"}>White</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                <InputLabel>Any additional information regarding this request?</InputLabel>
                  <TextField
                        id="outlined-textarea"
                      
                        className={style.formItemField}
                        style = {{margin: "1em 0em 1em 0em", width: "35em"}}
                        placeholder=""
                        multiline
                        rows = {4}
                        variant="outlined"
                        value = {moreInf}
                        onChange={(e) => setMoreInf(e.target.value)}
                      />
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
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

                <Grid item xs={12} className={style.formItemContain}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={yesSurvey}
                        onChange={(e) => setYesSurvey(e.target.checked)}
                      />
                    }
                    label="I am willing to complete a short survey after receiving my binder."
                  />
                </Grid>

                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  value="Submit Form"
                  className={style.submitBtn}
                >
                  Submit
                </Button>
              </form>
            </Grid>
          </>
        ) : (
          <h1>A confirmation email has been sent to the address provided.</h1>
        )}
      </Container>
    </>
  );
}
