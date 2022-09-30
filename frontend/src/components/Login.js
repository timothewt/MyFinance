import React, { Component } from "react";
import user_icon from "../assets/user_icon.png";
import '../styles/Forms.css';


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {username: "", password: ""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        alert('A username and password was submitted: ' + this.state.username + " " + this.state.password);
        event.preventDefault();
    }

    render() {
        return (
            <div className={"user"}>
                <div className={"userForm"}>
                    <img src={user_icon} alt={"user"}></img>
                    <h1>Login</h1>
                    <form>
                        <label>
                            <h3>Username:</h3>
                            <input name={"username"} type={"text"} value={this.state.username} onChange={this.handleChange} required={true}/>
                        </label>
                        <label>
                            <h3>Password:</h3>
                            <input name={"password"} type={"password"} value={this.state.password} onChange={this.handleChange} required={true}/>
                        </label>
                        <input type={"submit"} value={"Login"}/>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;
