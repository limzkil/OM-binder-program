import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

export default function ReqForm() {
  const formik = useFormik({
    initialValues: {
      email: "",
    },

    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
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
