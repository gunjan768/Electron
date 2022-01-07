import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";
import reportWebVitals from './reportWebVitals';

// See react-router-dom v6. It's new: https://reactrouter.com/docs/en/v6
ReactDOM.render(
  // <React.StrictMode>
    <App />,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
