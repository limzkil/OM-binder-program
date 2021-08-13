import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableRowColumn from "@material-ui/core/Table";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import Grid from "@material-ui/core/Grid";

import { makeStyles } from "@material-ui/core/styles";
import BinderModal from "../displayComponents/BinderModal";

const useStyles = makeStyles({});

function Inventory(props) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TableContainer className="inventoryContainer">
          <Table className="inventoryEntry">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Length</TableCell>
                <TableCell>Color</TableCell>
                <BinderModal />
              </TableRow>
            </TableHead>

            {props.inventoryData.map((inventory, index) => (
              <>
                <TableBody key={index}>
                  <TableCell>
                    <Typography variant="subtitle1">{inventory._id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {inventory.size}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {inventory.length}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {inventory.color}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      {inventory.quantity}
                    </Typography>
                  </TableCell>
                  <TableRowColumn>
                    <EditIcon />
                  </TableRowColumn>
                  <TableRowColumn>
                    <DeleteIcon />
                  </TableRowColumn>
                </TableBody>
              </>
            ))}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
export default Inventory;
