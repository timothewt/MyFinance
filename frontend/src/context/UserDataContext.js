import React, {createContext, useContext, useEffect, useState} from "react";
import AuthContext from "./AuthContext";

const UserDataContext = createContext(undefined); // context of the user data to facilitate access
export default UserDataContext

/**
 *
 * @param children children of the container
 * @returns {JSX.Element}: A container in which every child component can access the context
 */
export const UserDataProvider = ({children}) => {

    let [transactions, setTransactions] = useState([]); // transactions made by the user
    let [stocks, setStocks] = useState({'totalValue':0, 'stocks':[]});  // stocks in the user's wallet
    let [stocksShares, setStocksShares] = useState([]);
    let {authTokens} = useContext(AuthContext); // authentication tokens
    let currency = '$'; // user's currency, the user will be able to change in future versions
    /**
     * Gets data from the database from the backend using the REST API
     * @param request: what to retrieve, can be wallet or transactions
     * @returns {Promise<void>}: the stocks in the user wallet or the transactions
     */
    let getUserData = async (request) => {
        let response = await fetch('http://127.0.0.1:8000/api/' + request + '/', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            }
        });
        let data = await response.json(); // converts the received data to readable JSON
        /**
         * Adds the stock share data to the array
         * @param arr: array of stock shares with name and value
         * @param stock: stock from which we take the share
         */
        function addStockShare(arr, stock) {
            if (stock['Share'] < 8) {
                find: {
                    for (let stockSearch of arr) {
                        if (stockSearch['name'] === 'Others') {
                            stockSearch['value'] += stock['Share'];
                            break find;
                        }
                    }
                    arr.push({
                        "name": "Others",
                        "value": stock['Share']
                    })
                }
            } else {
                arr.push({
                    "name": stock['Name'],
                    "value": stock['Share']
                })
            }
        }

        if (response.status === 200 && data[0]) {   // status 200 is a success
            if (request === "wallet") {
                let newStockShares = []
                data[0]['stocks'].forEach(stock => (
                    addStockShare(newStockShares, stock)
                ));
                for (let i = 0; i < newStockShares.length; i++) {
                    newStockShares[i]["value"] = Math.round(newStockShares[i]["value"] * 100) / 100
                }
                setStocksShares(newStockShares)
                setStocks(data[0]);
            } else if (request === "transactions") {
                setTransactions(data);
            }
        }
    }

    let contextData = {
        stocks: stocks,
        transactions: transactions,
        currency: currency,
        stocksShares: stocksShares
    }

    // When the component is displayed, retrieves the stocks and transactions data
    useEffect(() => {
        getUserData("wallet");
        getUserData("transactions");
    }, [])

    return (
        <UserDataContext.Provider value={contextData}>
            { children }
        </UserDataContext.Provider>
    );
}