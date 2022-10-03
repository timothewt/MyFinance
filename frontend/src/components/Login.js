import React, { useContext } from "react";
import user_icon from "../assets/user_icon.png";
import '../styles/Forms.css';
import AuthContext from "../context/AuthContext.js";

/**
 * Login form with username and password fields
 * @returns {JSX.Element} the form
 */
const Login = () => {
    let {loginUser} = useContext(AuthContext);
    return (
        <div className={"user"}>
            <div className={"userForm"}>
                <img src={user_icon} alt={"user"}></img>
                <h1>Login</h1>
                <form onSubmit={loginUser}>
                    <label>
                        <h3>Username:</h3>
                        <input name="username" type="text" required={true}/>
                    </label>
                    <label>
                        <h3>Password:</h3>
                        <input name="password" type="password" required={true}/>
                    </label>
                    <input type="submit" value={"Login"}/>
                </form>
            </div>
        </div>
    );
}

export default Login;
