import React, { Component} from "react";
import {Route, Switch} from "react-router-dom";
import '../styles/App.css';
import Header from './Header.js';
import Login from './Login.js';
import SignUp from './SignUp.js';
import Content from './Content.js';
import SignedInPrivateRoute from '../utils/SignedInPrivateRoute';
import SignedOutPrivateRoute from '../utils/SignedOutPrivateRoute';
import { AuthProvider } from "../context/AuthContext.js";
import {UserDataProvider} from "../context/UserDataContext";

/**
 * Main component of the app, contains all the other components and pages
 */
class App extends Component {
    /**
     * The login and signup pages are only available when disconnected, and the content component only when logged in.
     * @returns {JSX.Element}: what is displayed on the page
     */
    render() {
        return (
            <div className={"site"}>
                <AuthProvider>
                    <Header/>
                    <Switch>
                        <SignedOutPrivateRoute path={"/login/"} component={Login}/>
                        <SignedOutPrivateRoute path={"/signup/"} component={SignUp}/>
                        <UserDataProvider>
                            <SignedInPrivateRoute exact path={"/"} component={Content}/>
                        </UserDataProvider>
                        <Route path={'*'} component={Content}/>
                    </Switch>
                </AuthProvider>
            </div>
        );
    }
}

export default App;
