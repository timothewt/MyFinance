import React, {useContext, useEffect, useState} from "react";
import '../styles/Content.css';
import Wallet from './Wallet.js';
import AuthContext from "../context/AuthContext";
import Charts from "./Charts";

const Login = () => {

    let [transactions, setTransactions] = useState([]);
    let [stocks, setStocks] = useState({'totalValue':0, 'stocks':[]});
    let {authTokens, currency} = useContext(AuthContext);

    useEffect(() => {
        getUserData("wallet");
        getUserData("transactions");
    }, [])

    let getUserData = async (request) => {
        let response = await fetch('http://127.0.0.1:8000/api/' + request + '/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        });
        let data = await response.json();
        if (response.status === 200 && data[0]) {
            if (request === "wallet") {
                setStocks(data[0]);
            } else if (request === "transactions") {
                setTransactions(data);
            }
        }
    }
    return (
        <div className={"content"}>
            <Wallet stocks={stocks} transactions={transactions} currency={currency}/>
            <Charts/>
        </div>
    );
}

export default Login;
