
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";


function Inventory(props) {
    console.log(props)
  return (
    <TableContainer className="inventoryContainer">
      <Table className="inventoryEntry">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Length</TableCell>
            <TableCell>Color</TableCell>
          </TableRow>
        </TableHead>
        {props.inventoryData.map((inventory, index) => (
          <>
            <TableBody key={index}>
              <TableCell>
                <Typography variant="subtitle1">{inventory._id}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{inventory.size}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{inventory.length}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1">{inventory.color}</Typography>
              </TableCell>
            </TableBody>
          </>
        ))}
      </Table>
    </TableContainer>
  );
}
export default Inventory;
