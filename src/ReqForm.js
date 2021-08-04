import { useFormik } from "formik";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import axios from "axios";

export default function ReqForm() {
  //code for form
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
  // code for email
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [address, setAddress] = useState("");

  const handleSend = async (e) => {
    setSent(true);
    try {
      await fetch("http://localhost:5000/send_mail", {
        body: JSON.stringify({
          email: email,
          number: number,
          address: address,
        }),
        headers: { "content-type": "application/json" },
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {/* form for email */}
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
      {/* code for email form */}
      <div className="email-container">
        {!sent ? (
          <form onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <input type="submit" value="Submit Form" />
          </form>
        ) : (
          <h1>A confirmation email has been sent to the address provided.</h1>
        )}
      </div>
    </>
  );
}
