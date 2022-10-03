import { Route, Redirect } from 'react-router-dom'
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * If the user is not authenticated, he's redirected to the login page
 * @param children: components inside the SignedInPrivateRoute container
 * @param rest: other attributes
 * @returns {JSX.Element}: A component which redirects the user to the login page if not authenticated, the children otherwise
 */
const SignedInPrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext);
    return(
        <Route {...rest}>
            {!user ? <Redirect to={"/login"}/> : children}
        </Route>
    )
}

export default SignedInPrivateRoute;