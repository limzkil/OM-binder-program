import { useState } from "react"

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  

  return (
    <div>
      <form method="post" action="/admin/login">
        <label>
          Username: <input type="text" name="username" placeholder="Enter your username..."/>
        </label>
        <label>
          Password: <input type="password" name="password" placeholder="Enter your password..." />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}

export default Login;
