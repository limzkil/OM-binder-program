import React from "react";
import Display from "./Display";
import ReqForm from "./ReqForm";
import AdminLogin from "./AdminLogin";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";



export default function App() {
 
  return (
    <div>
      <Router>
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


