import '../styles/App.css';
import Header from './Header.js';
import Login from './Login.js';
import Signup from './Signup.js';

function App() {
    return (
        <div className={"site"}>
            <Header/>
            <Signup/>
        </div>
    );
}

export default App;
