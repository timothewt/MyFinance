import React, { Component } from "react";
import logo from "../assets/logo_white.png";
import user_icon from "../assets/user_icon.png";
import '../styles/Header.css';
import {Link} from "react-router-dom";


class Banner extends Component {
    render() {
        return (
            <header>
                <img src={logo} alt={"MyFinance"}/>
                <h1>Real-time investments tracker</h1>
                <div className={"userInfo"}>
                    <Link to={"/login/"}>Login</Link>
                    <Link to={"/signup/"}>Signup</Link>
                    <div className={"username"}>
                        <img src={user_icon} alt={'user: '}/>
                        <span className={"dropdown"}>username
                            <button className={"logout"}>Logout</button>
                        </span>
                    </div>
                </div>
            </header>
        );
    }
}

export default Banner;
