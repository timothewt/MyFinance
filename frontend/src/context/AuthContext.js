import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useHistory } from "react-router-dom";

const AuthContext = createContext(undefined); // authentication data and functions to facilitate access

export default AuthContext

/**
 * Every functions used for the auth system
 * @param children: children of the AuthProvider element, only displays
 * @returns {JSX.Element}: A container in which every child component can access the context
 */
export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null) // Authentication tokens used to authenticate the user and access the database
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null) // user infos encoded in the tokens
    let [loading, setLoading] = useState(true); // loading boolean, used to refresh the token when the user just enters the app

    const history = useHistory(); // used to redirect the user

    /**
     * Logins the user in the app using secured token with JWT. Stores the user infos and the tokens in local storage and AuthContext
     * @param e: login form
     */
    let loginUser = async (e) => {
        e.preventDefault(); // prevents the page from reloading when the form is submitted
        let response = await fetch('http://127.0.0.1:8000/api/token/', { // fetches the auth tokens using the REST API in the backend server
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value}) // posts the username and password entered in the form
        })
        let data = await response.json(); // converts the data of the response (the tokens) as a readable json
        if (response.status === 200) { // status 200 is a success
            setAuthTokens(data);
            setUser(jwt_decode(data.access)) // decodes the tokens
            localStorage.setItem('authTokens', JSON.stringify(data));
            history.push("/"); // redirects to the main page
        } else if (response.status === 401) {
            alert("Wrong login credentials.");
        } else {
            alert("Something went wrong...");
        }

    }

    /**
     * Signs up the user in the database
     * @param e: signup form
     */
    let signUpUser = async (e) => {
        e.preventDefault(); // prevents the page from reloading when the form is submitted
        let response = await fetch('http://127.0.0.1:8000/api/signup/', { // accesses the sign-up API view and creates the new user in the database
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        if (response.status === 200) { // status 200 is a success
            alert("Registered!");
            history.push("/login/"); // redirects to the login page
        } else if (response.status === 401) {
            alert("Username already exists.");
        } else {
            alert("Something went wrong...");
        }
    }

    /**
     * Logs out the user by deleting the local storage and AuthContext data
     */
    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        history.push('/login/');
    }

    /**
     * Updates the access token, which expires after a short time, using the refresh token
     */
    let updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh': authTokens?.refresh}) // uses the refresh token to have a new access token
        })
        let data = await response.json(); // converts the data into readable json object
        data['refresh'] = authTokens?.refresh;

        if (response.status === 200) { // status 200 is a success, updates the AuthContext and local storage
            setAuthTokens(data);
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data));
        } else { // if the token is not valid
            logoutUser();
        }

        if (loading) {
            setLoading(false);
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        signUpUser: signUpUser,
        logoutUser: logoutUser
    }

    /**
     * Updates the access token every 14 minutes and when the user first opens the page
     */
    useEffect(() => {
        if(loading) {
            updateToken();
        }
        let delay = 1000 * 60 * 14;
        let interval = setInterval(() => {
            if(authTokens) {
                updateToken();
            }
        }, delay);
        return () => clearInterval(interval);
    }, [authTokens, loading])

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}