import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './reducers';
import "./index.css";

import VideoSelectScreen from './screens/VideoSelectScreen';
import ConvertScreen from './screens/ConvertScreen';

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="app">
        <Routes>
          {/* <Route path="/" element={<VideoSelectScreen />} /> */}
          <Route path="/" element={<ConvertScreen />} />
        </Routes>
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
