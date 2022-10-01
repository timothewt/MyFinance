import React, { useState, useEffect, useContext } from "react"
import '../styles/Stocks.css';
import AuthContext from "../context/AuthContext";


const Stocks = () => {
    let currency = '$';
    let [stocks, setStocks] = useState({'totalValue':0, 'stocks':[]});
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
            setStocks(data[0]);
        }
    }

    return (
        <div className={"stocks"}>
            <div>
                <table>
                    <thead>
                        <th colSpan={2}>Stocks</th>
                        <th colSpan={5}>Total value: ${stocks['totalValue']}</th>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Avg Cost</th>
                            <th>Last Price</th>
                            <th>Value</th>
                            <th>Net Growth</th>
                            <th>Growth</th>
                        </tr>
                        { stocks['stocks'].map(stock => (
                            <tr key={stock.Ticker}>
                                <td className={'stockName'}>{stock.Name}</td>
                                <td>{stock.Qty}</td>
                                <td>{currency}{stock.AvgCost}</td>
                                <td>{currency}{stock.CurrPrice}</td>
                                <td>{currency}{stock.Value}</td>
                                <td className={stock.Growth >= 0 ? 'positive' : 'negative'}>{currency}{stock.Growth >= 0 ? '+' : null}{stock.ValueGrowth}</td>
                                <td className={stock.Growth >= 0 ? 'positive' : 'negative'}>{stock.Growth >= 0 ? '+' : null}{stock.Growth}%</td>
                            </tr>
                        )) }
                        { stocks['stocks'].length === 0 && <th colSpan={7}>Add a transaction to complete your wallet!</th>  }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stocks;
