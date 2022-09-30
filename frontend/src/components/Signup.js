import React, { useContext } from "react";
import user_icon from "../assets/user_icon.png";
import '../styles/Forms.css';
import AuthContext from "../context/AuthContext.js";


const Signup = () => {
    let {signUpUser} = useContext(AuthContext);
    return (
        <div className={"user"}>
            <div className={"userForm"}>
                <img src={user_icon} alt={"user"}></img>
                <h1>Sign Up</h1>
                <form onSubmit={signUpUser}>
                    <label>
                        <h3>Username:</h3>
                        <input name={"username"} type={"text"} required={true}/>
                    </label>
                    <label>
                        <h3>Password:</h3>
                        <input name={"password"} type={"password"} required={true}/>
                    </label>
                    <input type={"submit"} value={"Sign Up"}/>
                </form>
            </div>
        </div>
    );
}

export default Signup;
