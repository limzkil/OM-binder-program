
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import InputLabel from '@material-ui/core/InputLabel';


export default function ReqForm() {
  const [sent, setSent] = useState(false);
  const [nameSelf, setNameSelf] = useState("");
  const [emailSelf, setEmailSelf] = useState("");
  const [numberSelf, setNumberSelf] = useState("");
  const [addressSelf, setAddressSelf] = useState("");
  const [birth, setBirth] = useState("")
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
  const [yesPref, setYesPref] = useState(false);
  const [bindLength, setBindLength] = useState("");
  const [bindColor, setBindColor] = useState("");
  const [yesConfirm, setYesConfirm] = useState(false);

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
                <InputLabel>Enter your birthday in mm/dd/yyyy format</InputLabel>
                <TextField
                  type="text"
                  placeholder=""
                  value={birth}
                  onChange={(e) => setBirth(e.target.value)}
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

              <InputLabel>
                Please check ONE box regarding your preferences.
              </InputLabel>

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
                      checked={yesPref}
                      onChange={(e) => setYesPref(e.target.checked)}
                    />
                  }
                  label="I have preferences and I am willing to wait if they are not in stock."
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
                  <option value={"Short"}>Short</option>
                  <option value={"Long"}>Long</option>
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

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={yesPref}
                      onChange={(e) => setYesPref(e.target.checked)}
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
