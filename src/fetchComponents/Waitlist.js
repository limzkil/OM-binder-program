import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";

import Grid from "@material-ui/core/Grid";

function Waitlist({ waitListData }) {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TableContainer className="waitlistContainer">
          <Table className="waitlistEntry">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>County</TableCell>
                <TableCell>ElseName</TableCell>
                <TableCell>ElseEmail</TableCell>
                <TableCell>ElsePhone</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>DOB</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Length</TableCell>
                <TableCell>Color</TableCell>
              </TableRow>
            </TableHead>
            {waitListData.length !== 0 ? (
              waitListData.map((request, index) => (
                <>
                  <TableBody key={index}>
                    <TableCell>
                      <Typography variant="subtitle1">{request._id}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.county}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.elseName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.elseEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.elsePhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">{request.dob}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.size}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.length}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle1">
                        {request.color}
                      </Typography>
                    </TableCell>
                  </TableBody>
                </>
              ))
            ) : (
              <>
                <TableBody>
                  <Typography variant="subtitle1">
                    No requests in the wait list currently.
                  </Typography>
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}

export default Waitlist;
