import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Typography from "@material-ui/core/Typography"
import Container from "@material-ui/core/Container"
import React from "react";
import OMlogo from "../img/OMlogo.png";


export default function Header() {
  return (
    <>
    <Container>
    
        <Typography variant = "subtitle1" style = {{marginTop: "10vh", fontFamily: 'Oswald'}}>Binder Program Management</Typography>
      </Container>
    </>
  );
}
