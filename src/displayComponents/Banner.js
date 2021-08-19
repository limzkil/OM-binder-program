import Image from "material-ui-image";
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box";
import React from "react";
import img from "../img/bannerfooter_outmaine.png";

export default function Banner() {
  return (
    <>
      <Box align="left">
        <Image src={img} aspectRatio={10 / 1} color="null" />
      </Box>
      
    </>
  );
}
