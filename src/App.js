import React from "react";
import Dashboard from "./Dashboard";
import { HashRouter as Router, Route, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <Route exact path="/" component={Dashboard} />
    </Router>
  );
}

export default App;
