import React, { useState, useEffect, useContext } from "react"
import '../styles/Wallet.css';
import AuthContext from "../context/AuthContext";


const Wallet = () => {
    let [wallet, setWallet] = useState({'totalValue':0, 'stocks':[]});
    let {authTokens} = useContext(AuthContext);

    useEffect(() => {
        getWallet();
    }, [])

    let getWallet = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/wallet/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        });
        let data = await response.json();
        if (response.status === 200 && data[0]) {
            setWallet(data[0]);
        }
    }

    return (
        <div className={"wallet"}>
            <div>
                <ul>
                    <p>Total value: ${ wallet['totalValue'] }</p>
                    { wallet['stocks'].map(stock => (
                        <li key={stock.Ticker}>{stock.Name} | ${stock.CurrPrice} | ${stock.Value}</li>
                    )) }
                </ul>
            </div>
        </div>
    );
}

export default Wallet;
