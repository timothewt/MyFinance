import { Route, Redirect } from 'react-router-dom'
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const SignedOutPrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext);
    return(
        <Route {...rest}>
            {user ? <Redirect to={"/"}/> : children}
        </Route>
    )
}

export default SignedOutPrivateRoute;