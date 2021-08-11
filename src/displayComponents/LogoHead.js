import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"

import OMlogo from "../img/OMlogo.png";


export default function LogoHead() {
  return (
    <>
    <Container>
    <Grid container spacing = {3} >
        <Grid item xs = {3}>
      <Image src={OMlogo} aspectRatio = {(2/1)} color = "null"  />
      </Grid>
    <Grid item xs = {9}>
        <Typography variant = "h3" style = {{marginTop: "8vh", fontFamily: 'Oswald'}}>Binder Program Management</Typography>
    </Grid>
      </Grid>
      </Container>
    </>
  );
}
