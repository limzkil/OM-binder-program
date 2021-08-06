import React, { useState } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import ReqForm from "./ReqForm";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/apply" component={ReqForm} />
        <Route path="/admin/login" component={Login} />
        <Route path="/admin/dashboard" component={Dashboard}/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
