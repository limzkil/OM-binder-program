import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import React from "react";
import OMlogo from "../img/OMlogo.png";


export default function LogoHead() {
  return (
    <>
    <Container>
    <Grid item xs = {1} />
    <Grid container spacing = {3} >
        <Grid item xs = {3}>
      <Image src={OMlogo} aspectRatio = {(1.5/1)} color = "null"  />
      </Grid>
    <Grid item xs = {7}>
        <Typography variant = "h3" style = {{marginTop: "10vh", fontFamily: 'Oswald'}}>Binder Program Management</Typography>
    </Grid>
    <Grid item xs = {1} />
      </Grid>
      </Container>
    </>
  );
}
