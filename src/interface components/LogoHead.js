import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Typography from "@material-ui/core/Typography"

import OMLogo from "../OMlogo.png";

export default function LogoHead() {
  return (
    <>
    <Grid container spacing = {1} style = {{justifyContent: "center"}}>
        <Grid item xs = {12}>
      <Image src={OMLogo} />
      </Grid>
    <Grid item xs = {12}>
        <Typography variant = "h3" style = {{marginTop: "13vh"}}>Binder Inventory Management</Typography>
    </Grid>
      </Grid>
    </>
  );
}
