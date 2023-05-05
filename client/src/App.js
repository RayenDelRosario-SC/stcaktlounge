import React, { Fragment } from "react";
import './App.css';


import {
  BrowserRouter as Router,
  Route,
  Switch,

} from "react-router-dom";

//components
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route
              exact
              path="/login"
              render={props => 
                  <Login {...props} /> } />
            <Route
              exact
              path="/login"
              render={props => 
                  <Register {...props} /> } />
            <Route
              exact
              path="/login"
              render={props => 
                  <Dashboard {...props} /> } />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
  }


export default App;
