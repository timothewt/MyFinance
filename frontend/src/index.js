import React from 'react';
import {BrowserRouter} from 'react-router-dom'
import {render} from "react-dom";
import './styles/index.css';
import App from './components/App.js';

render((
    <BrowserRouter>
        <App  />
    </BrowserRouter>
), document.getElementById('root'));
