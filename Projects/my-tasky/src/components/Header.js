import React from "react";
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  return (
    // We have used Router in App.js and this Header.js is inside that Router so no need to use it here.
    // <Router>
      <nav>
      <div className="nav-wrapper">
        <Link
          to="/settings"
          className="brand-logo right"
          style={{ cursor: "pointer" }}
        >
          <i className="material-icons">settings</i>
        </Link>
        <ul>
          <li>
            <Link to="/">Active Task</Link>
          </li>
          <li>
            <Link to="/tasks">All Tasks</Link>
          </li>
        </ul>
      </div>
    </nav>
    // </Router>
  );
};
