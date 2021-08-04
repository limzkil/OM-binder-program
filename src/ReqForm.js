import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

export default function ReqForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    onSubmit: (values) => {
      console.log(values);
      axios.post("http://localhost:3000/");
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <form action="/" method="POST">
        <TextField
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
        />
        <Button color="primary" variant="contained" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
