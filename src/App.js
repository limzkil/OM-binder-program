import React from "react";
import Display from "./Display";
import ReqForm from "./ReqForm";
import AdminLogin from "./AdminLogin";
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from "react-router-dom";



export default function App() {
 
  return (
    <div>
      <Router>
        <NavLink to="/login"><h3>Login</h3></NavLink>
        <NavLink to="/form"><h3>Form</h3></NavLink>
        <NavLink to ="/display"><h3>Display</h3></NavLink>
        <Switch>
          <Route path="/login" component={AdminLogin} />
          <Route path="/form" component={ReqForm} />
          <Redirect exact from = "/display" to = "/display/inventory" />
          <Route exact path = "/display/:page?" render = {props => <Display{...props} />} />
        </Switch>
      </Router>
    </div>
  );
}


