'use strict';
require('../static/sass/main.scss');

import React from 'react';
import ReactDom from 'react-dom';
// var React = require('react');
// var ReactDom = require('react-dom');

// var App = require('./app.js');
import App from './app.js';

// var App = React.createClass({
//   render: function() {
//     return <div><div className="tech electron">Electron</div> + <div className="tech react">React</div> + <div className="tech sass">Sass</div></div>;
//   }
// });

ReactDom.render(<App/>, document.getElementById('react-root'));
