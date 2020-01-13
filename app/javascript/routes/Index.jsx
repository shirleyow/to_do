import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/Home";
import Tasks from "../components/Tasks";
import NewTask from "../components/NewTask";
import EditTask from "../components/EditTask";

export default (
  <Router>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/tasks" exact component={Tasks} />
      <Route path="/new" exact component={NewTask} />
	  <Route path="/update/:id" component = {EditTask} />
    </Switch>
  </Router>
);