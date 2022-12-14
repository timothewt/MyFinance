import React, {  useContext } from "react";
import AuthContext from "../context/AuthContext";
import logo from "../assets/logo_white.png";
import user_icon from "../assets/user_icon.png";
import '../styles/Header.css';
import { Link } from "react-router-dom";

/**
 * Header of the app, always visible
 * @returns {JSX.Element}: The header and its content (logo, if logged-in username otherwise login and signup links)
 */
const Header = () => {
    let {user, logoutUser} = useContext(AuthContext);
    return (
        <header>
            <img src={logo} alt={"MyFinance"}/>
            <h1>Real-time investments tracker</h1>
            <div className={"user-info"}>
                {
                    user ?
                    <div className={"username"}>
                        <img src={user_icon} alt={'user: '}/>
                        <span className={"dropdown"}>
                            {user.username}
                            <button className={"logout"} onClick={logoutUser}>Logout</button>
                        </span>
                    </div>
                        :
                    <div>
                        <Link to={"/login/"}>Login</Link>
                        <Link to={"/signup/"}>Signup</Link>
                    </div>
                }
            </div>
        </header>
    );
}

export default Header;
