import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import {useHistory} from "react-router-dom";

const AuthContext = createContext(undefined);

export default AuthContext


export const AuthProvider = ({children}) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
    let [loading, setLoading] = useState(true);
    let currency = '$';

    const history = useHistory();

    let loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        let data = await response.json();
        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data));
            history.push("/");
        } else if (response.status === 401) {
            alert("Wrong login credentials.");
        } else {
            alert("Something went wrong...");
        }

    }

    let signUpUser = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/signup/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username': e.target.username.value, 'password': e.target.password.value})
        })
        let data = await response.json();
        if (response.status === 200) {
            alert("Registered!")
            history.push("/login/");
        } else if (response.status === 401) {
            alert("Username already exists.");
        } else {
            alert("Something went wrong...");
        }
    }

    let logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        history.push('/login/');
    }

    let updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh': authTokens?.refresh})
        })
        let data = await response.json();
        data['refresh'] = authTokens?.refresh;

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data));
        } else {
            logoutUser();
        }

        if(loading) {
            setLoading(false);
        }
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        currency: currency,
        loginUser: loginUser,
        signUpUser: signUpUser,
        logoutUser: logoutUser
    }

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