import React, { Component } from "react";
import logo from "../assets/logo_white.png";
import user_icon from "../assets/user_icon.png";
import '../styles/Header.css';


class Banner extends Component {
    render() {
        return (
            <header>
                <img src={logo} alt={"MyFinance"}/>
                <h1>Real-time investments tracker</h1>
            </header>
        );
    }
}

export default Banner;
