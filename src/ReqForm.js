import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select"
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import axios from "axios"

export default function ReqForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
      resMaine: false
    },

    onSubmit: (values) => {
      console.log(values)
      axios.post('http://localhost:3000/')
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <form action='/' method='POST'>
        <InputLabel>Are you a resident of Maine?</InputLabel>
        <Select 
        id = "resMaine"
        name = "resMaine"
        value = {formik.values.resMaine}
        onChange = {formik.handleChange} >

          <MenuItem value = {true}>Yes</MenuItem>
          <MenuItem value = {false}>No</MenuItem>

        </Select>

        <TextField
          
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <Button color="primary" variant="contained"  type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
