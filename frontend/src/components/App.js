import React, { Component} from "react";
import {Route, Switch} from "react-router-dom";
import '../styles/App.css';
import Header from './Header.js';
import Login from './Login.js';
import Signup from './Signup.js';
import Wallet from './Wallet.js';
import SignedInPrivateRoute from '../utils/SignedInPrivateRoute';
import SignedOutPrivateRoute from '../utils/SignedOutPrivateRoute';
import { AuthProvider } from "../context/AuthContext.js";

class App extends Component {
    render() {
        return (
            <div className={"site"}>
                <AuthProvider>
                    <Header/>
                    <Switch>
                        <SignedOutPrivateRoute path={"/login/"} component={Login}/>
                        <SignedOutPrivateRoute path={"/signup/"} component={Signup}/>
                        <SignedInPrivateRoute exact path={"/"} component={Wallet}/>
                    </Switch>
                </AuthProvider>
            </div>
        );
    }
}

export default App;
