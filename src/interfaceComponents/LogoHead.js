import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"

import OMlogo from "../OMlogo.png";
import BannerHead from "../Banner_Head_OUT_Maine.jpg"

export default function LogoHead() {
  return (
    <>
    <Container>
    <Grid container spacing = {1} style = {{alignContent: "center"}}>
        <Grid item xs = {3}>
      <Image src={OMlogo} aspectRatio = {(2/1)} />
      </Grid>
    <Grid item xs = {9}>
        <Typography variant = "h3" style = {{marginTop: "8vh"}}>Binder Program Management</Typography>
    </Grid>
      </Grid>
      </Container>
    </>
  );
}
