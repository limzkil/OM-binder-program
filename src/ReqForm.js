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
import Card from "@material-ui/core/Card";
import Tooltip from "@material-ui/core/Tooltip";
import validator from "validator";
import React, { useState, useEffect } from "react";

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
    margin: ".3em",
  },
  formHeadings: {
    margin: "1em 1em .5em .5em",
    textDecoration: "underline",
    fontFamily: "Oswald",
    color: "#993399",
  },
  formSubtitle: {
    margin: "1em",
    fontFamily: "Oswald",
    textDecoration: "underline",
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
  colorCards: {
    height: "3rem",
    width: "3rem",
    marginLeft: ".2rem",
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
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [addressState, setAddressState] = useState("");

  const [yesMeasure, setYesMeasure] = useState(false);

  const [bindSize, setBindSize] = useState("");

  const [waitLenCol, setWaitLenCol] = useState(false);

  const [bindLength, setBindLength] = useState("");
  const [bindColor, setBindColor] = useState("");
  const [moreInf, setMoreInf] = useState("");

  const [yesConfirm, setYesConfirm] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validDate, setValidDate] = useState(false);
  const [validRes, setValidRes] = useState(false);
  const [validNameElse, setValidNameElse] = useState(false);
  const [validElseEmail, setValidElseEmail] = useState(false);
  const [validElsePhone, setValidElsePhone] = useState(false);
  const [validConsent, setValidConsent] = useState(false);
  const [validName, setValidName] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validSize, setValidSize] = useState(false);
  const [isError, setIsError] = useState(true);

  const style = useStyles();
  const handlePhone = (event) => {
    let phone = event.target.value;
    setNumberSelf(phone);
    if (validator.isMobilePhone(phone, "en-US")) {
      setValidPhone(true);
    } else {
      setValidPhone(false);
    }
  };
  const handleSize = (event) => {
    let size = event.target.value;
    setBindSize(size);
    if (size === "") {
      setValidSize(false);
    } else {
      setValidSize(true);
    }
  };
  const handleSelfOrElse = (event) => {
    let SoE = event.target.value;
    setSelfOrElse(SoE);
    if (SoE === true) {
      setValidElsePhone(false);
      setValidElseEmail(false);
      setValidNameElse(false);
      setValidConsent(false);
    } else if (SoE === false) {
      setValidElsePhone(true);
      setValidElseEmail(true);
      setValidNameElse(true);
      setValidConsent(true);
    }
  };
  const handleConsent = (event) => {
    let consent = event.target.checked;
    setMinorConsent(consent);
    if (consent === true) {
      setValidConsent(true);
    } else {
      setValidConsent(false);
    }
  };
  const handleElsePhone = (event) => {
    let phone = event.target.value;
    setNumberElse(phone);

    if (validator.isMobilePhone(phone, "en-US")) {
      setValidElsePhone(true);
    } else {
      setValidElsePhone(false);
    }
  };
  const handleName = (event) => {
    let name = event.target.value;
    setNameSelf(name);
    if (name.length > 0) {
      setValidName(true);
    } else {
      setValidName(false);
    }
  };
  const handleElseEmail = (event) => {
    let email = event.target.value;
    setEmailElse(email);
    if (validator.isEmail(email)) {
      setValidElseEmail(true);
    } else {
      setValidElseEmail(false);
    }
  };
  const handleNameElse = (event) => {
    let name = event.target.value;
    setNameElse(name);
    if (name.length > 0) {
      setValidNameElse(true);
    } else {
      setValidNameElse(false);
    }
  };
  const handleRes = (event) => {
    let res = event.target.value;
    setResMaine(res);
    if (res.length > 0) {
      setValidRes(true);
    } else {
      setValidRes(false);
    }
  };
  const handleEmail = (event) => {
    let email = event.target.value;
    setEmailSelf(email);

    if (validator.isEmail(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };
  const handleDate = (event) => {
    let dob = event.target.value;
    setBirth(dob);

    if (validator.isDate(dob, { format: "MM/DD/YYYY" })) {
      setValidDate(true);
    } else {
      setValidDate(false);
    }
  };
  const checkKeyDown = (event) => {
    if (event.code === "Enter") {
      event.preventDefault();
    }
  };
  const handleSend = async (e) => {
    setSent(true);
    try {
      console.log(bindColor + " " + bindLength);
      await fetch("http://localhost:5000/send_mail", {
        body: JSON.stringify({
          emailSelf: emailSelf,
          emailElse: emailElse,
          numberSelf: numberSelf,
          numberElse: numberElse,
          address: {
            address1: address1,
            address2: address2,
            city: addressCity,
            state: addressState,
            zip: addressZip,
          },
          size: bindSize,
          county: resMaine,
          progSource: progSource,
          nameSelf: nameSelf,
          nameElse: nameElse,
          dob: birth,
          bindLength: bindLength === "" ? "No preference" : bindLength,
          bindColor: bindColor === "" ? "No preference" : bindColor,
          willWait: waitLenCol,
          moreInfo: moreInf
         

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
                textAlign: "center",
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
              <form
                onSubmit={handleSend}
                noValidate
                onKeyDown={(event) => checkKeyDown(event)}
                action="/"
                method="POST"
              >
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    What is your county of residence in Maine?
                  </InputLabel>
                  <NativeSelect
                    id="resMaine"
                    name="resMaine"
                    value={resMaine}
                    error={validRes ? false : isError}
                    helperTExt={!validRes ? "Please Choose a County" : null}
                    onChange={handleRes}
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
                    Where did you hear about the Binder Donation program?
                  </InputLabel>
                  <NativeSelect
                    id="progSource"
                    name="progSource"
                    value={progSource}
                    onChange={(e) => setProgSource(e.target.value)}
                  >
                    <option value="">Select option</option>
                    <option value={"Facebook"}>Facebook</option>
                    <option value={"Instagram"}>Instagram</option>
                    <option value={"Word of mouth"}>Word of mouth</option>
                    <option value={"GSTA"}>GSTA</option>
                    <option value={"Teacher/School Advisor"}>
                      Teacher/School Advisor
                    </option>
                    <option value={"Friend or family member"}>
                      Friend or family member
                    </option>
                    <option value={"Community member"}>Community member</option>
                    <option value={"Other"}>Other</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Are you requesting for yourself or someone else?
                  </InputLabel>
                  <NativeSelect
                    id="selfOrElse"
                    value={selfOrElse}
                    onChange={handleSelfOrElse}
                  >
                    <option value={false}>I am requesting for myself.</option>
                    <option value={true}>
                      I am requesting for someone else.
                    </option>
                  </NativeSelect>
                </Grid>

                {selfOrElse ? (
                  <>
                    <Typography className={style.formHeadings} variant="h4">
                      Requester Information
                    </Typography>
                    <Typography
                      className={style.formSubtitle}
                      variant="subtitle1"
                    >
                      "Requester" refers to the person making the{" "}
                      <div style={{ color: "red", display: "inline" }}>
                        request for someone else
                      </div>
                    </Typography>
                    <Grid item xs={12} className={style.formItemContain}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={minorConsent}
                            error={validConsent ? false : isError}
                            helperTExt={
                              !validConsent
                                ? "Consent is required for this request"
                                : null
                            }
                            onChange={handleConsent}
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
                        error={validNameElse ? false : isError}
                        helperText={
                          !validNameElse ? "Please Enter Your Name" : null
                        }
                        onChange={handleNameElse}
                      />
                    </Grid>
                    <Grid item xs={12} className={style.formItemContain}>
                      <TextField
                        type="text"
                        name="elseEmail"
                        placeholder="Enter your email (requester)"
                        value={emailElse}
                        className={style.formItemField}
                        helperText={
                          !validElseEmail ? "Please Enter a Valid Email" : null
                        }
                        error={validElseEmail ? false : isError}
                        onChange={handleElseEmail}
                      />
                    </Grid>
                    <Grid item xs={12} className={style.formItemContain}>
                      <TextField
                        type="text"
                        name="elsePhone"
                        placeholder="Enter your number (requester)"
                        value={numberElse}
                        className={style.formItemField}
                        helperText={
                          !validElsePhone
                            ? "Please Enter a Valid Phone Number"
                            : null
                        }
                        error={validElsePhone ? false : isError}
                        onChange={handleElsePhone}
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
                        <option value={"Parent or guardian"}>
                          Parent or guardian
                        </option>
                        <option value={"Teacher or other school staff"}>
                          Teacher or other school staff
                        </option>
                        <option value={"Sibling or friend"}>
                          Sibling or friend
                        </option>
                        <option
                          value={"Counselor, therapist or other medical staff"}
                        >
                          Counselor, therapist or other medical staff
                        </option>
                        <option value={"Other"}>Other</option>
                      </NativeSelect>
                    </Grid>
                  </>
                ) : null}

                <Typography className={style.formHeadings} variant="h4">
                  Requestee Information
                </Typography>
                <Typography className={style.formSubtitle} variant="subtitle1">
                  "Requestee" refers to the person who will be{" "}
                  <div style={{ color: "red", display: "inline" }}>
                    wearing the binder
                  </div>
                </Typography>
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Are you, or the person you are requesting the binder for,
                    between the ages of 14 & 22
                  </InputLabel>
                  <NativeSelect
                    id="ageCheck"
                    value={ageCheck}
                    error={ageCheck ? false : isError}
                    helperText={
                      !ageCheck
                        ? "You must be between the ages of 14 & 22 to receive a binder"
                        : null
                    }
                    onChange={(e) => setAgeCheck(e.target.value)}
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Will this be the first binder that you, or the person you're
                    requesting for, have owned?
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
                    error={validName ? false : isError}
                    helperText={!validName ? "Please Enter Your Name" : null}
                    onChange={handleName}
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
                    helperText={!validDate ? "Invalid Date" : null}
                    error={validDate ? false : isError}
                    className={style.formItemField}
                    onChange={handleDate}
                  />
                  {console.log(isError)}
                  {console.log(validDate)}
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="email"
                    placeholder="Enter your email (requestee)"
                    value={emailSelf}
                    helperText={
                      !validEmail ? "Please Enter a Valid Email" : null
                    }
                    error={validEmail ? false : isError}
                    className={style.formItemField}
                    onChange={handleEmail}
                  />
                </Grid>
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Enter your phone number in 000-000-0000 format
                  </InputLabel>
                  <TextField
                    type="text"
                    name="phone"
                    placeholder=""
                    value={numberSelf}
                    className={style.formItemField}
                    helperText={
                      !validPhone ? "Please Enter a Valid Phone Number" : null
                    }
                    error={validPhone ? false : isError}
                    onChange={handlePhone}
                  />
                </Grid>
                <Grid item xs={12} className={style.formItemContain}>
                  <TextField
                    type="text"
                    name="address1"
                    placeholder="Enter your address 1(requestee)"
                    value={address1}
                    className={style.formItemField}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                  <TextField
                    type="text"
                    name="address2"
                    placeholder="Enter your address 2(requestee)"
                    value={address2}
                    className={style.formItemField}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                  <TextField
                    type="text"
                    name="addressCity"
                    placeholder="Enter your City (requestee)"
                    value={addressCity}
                    className={style.formItemField}
                    onChange={(e) => setAddressCity(e.target.value)}
                  />
                  <TextField
                    type="text"
                    name="addressZip"
                    placeholder="Enter your Zip code (requestee)"
                    value={addressZip}
                    className={style.formItemField}
                    onChange={(e) => setAddressZip(e.target.value)}
                  />
                  <InputLabel className={style.formItemField}>Please Choose your State</InputLabel>
                  <NativeSelect
                    id="addressState"
                    name="addressState"
                    placeholder="Please Choose your state (requestee)"
                    className={style.formItemField}
                    value={addressState}
                    onChange={(e) => setAddressState(e.target.value)}
                  >
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </NativeSelect>
                </Grid>

                <Grid item xs={12} className={style.formItemContain}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={yesMeasure}
                        onChange={(e) => setYesMeasure(e.target.checked)}
                      />
                    }
                    label="I have measured myself for the correct sized binder."
                  />
                </Grid>
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>What is your size?</InputLabel>
                  <NativeSelect
                    id="bindSize"
                    name="size"
                    value={bindSize}
                    error={validSize ? false : isError}
                    helperTExt={!validSize ? "Please Select a Size" : null}
                    onChange={handleSize}
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
                <Grid item xs={12} className={style.formItemContain}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={waitLenCol}
                        onChange={(e) => setWaitLenCol(e.target.checked)}
                      />
                    }
                    label="I have a strong preference on color and/or length and I am willing to wait."
                  />
                </Grid>
                {waitLenCol ? (
                  <>
                    <Grid item xs={12} className={style.formItemContain}>
                      <InputLabel>What is your preferred length?</InputLabel>
                      <NativeSelect
                        id="bindLength"
                        name="length"
                        value={bindLength}
                        onChange={(e) => setBindLength(e.target.value)}
                      >
                        <option value="">Select length</option>
                        <option value={"No Preference"}>No preference</option>
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
                        <option value={"No Preference"}>No preference</option>
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
                      <Tooltip title="Red">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Red",
                            display: "inline-block",
                            marginLeft: "0"
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Purple">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Purple",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Green">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Green",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Beige">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Beige",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Tan">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Tan",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Brown">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Brown",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Black">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Black",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="Grey">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "Grey",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                      <Tooltip title="White">
                        <Card
                          className={style.colorCards}
                          style={{
                            backgroundColor: "White",
                            display: "inline-block",
                          }}
                        ></Card>
                      </Tooltip>
                    </Grid>
                  </>
                ) : null}
                <Grid item xs={12} className={style.formItemContain}>
                  <InputLabel>
                    Any additional information regarding this request?
                  </InputLabel>
                  <TextField
                    id="outlined-textarea"
                    className={style.formItemField}
                    style={{ margin: "1em 0em 1em 0em", width: "35em" }}
                    placeholder=""
                    multiline
                    rows={4}
                    variant="outlined"
                    value={moreInf}
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
                <Button
                  color="primary"
                  variant="contained"
                  type="submit"
                  value="Submit Form"
                  className={style.submitBtn}
                  disabled={
                    validSize &&
                    validConsent &&
                    validEmail &&
                    validDate &&
                    validRes &&
                    validNameElse &&
                    validElseEmail &&
                    validElsePhone &&
                    validName &&
                    validPhone
                      ? false
                      : true
                  }
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
