import React from "react";
import Display from "./Display";
import ReqForm from "./ReqForm";
import AdminLogin from "./AdminLogin";
import { BrowserRouter as Router, Switch, Route, NavLink } from "react-router-dom";
// import "./App.css"

function App() {
  return (
    <div>
      <Router>
        <NavLink to="/login"><h3>Login</h3></NavLink>
        <NavLink to="/form"><h3>Form</h3></NavLink>
        <NavLink to="/display/inventory"><h3>Display</h3></NavLink>
        <Switch>
          <Route path="/login" component={AdminLogin} />
          <Route path="/form" component={ReqForm} />
          <Route path="/display" component={Display} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
