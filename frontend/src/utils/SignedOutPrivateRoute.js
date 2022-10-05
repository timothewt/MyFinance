import { Route, Redirect } from 'react-router-dom'
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * If the user is authenticated, he's redirected to the main page
 * @param children: components inside the SignedOutPrivateRoute container
 * @param rest: other attributes
 * @returns {JSX.Element}: A component which redirects the user to the main page if authenticated, the children otherwise
 */
const SignedOutPrivateRoute = ({children, ...rest}) => {
    let {user} = useContext(AuthContext);
    return(
        <Route {...rest}>
            {user ? <Redirect to={"/"}/> : children}
        </Route>
    )
}

export default SignedOutPrivateRoute;