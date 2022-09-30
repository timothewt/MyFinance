import React, { Component} from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import '../styles/App.css';
import Header from './Header.js';
import Login from './Login.js';
import Signup from './Signup.js';
import Wallet from './Wallet.js';
import PrivateRoute from '../utils/PrivateRoute';

class App extends Component {
    render() {
        return (
            <div className={"site"}>
                <Header/>
                <Switch>
                    <Route path={"/login/"} component={Login}/>
                    <Route path={"/signup/"} component={Signup}/>
                    <PrivateRoute exact path={"/"} component={Wallet}/>
                </Switch>
            </div>
        );
    }
}

export default App;
