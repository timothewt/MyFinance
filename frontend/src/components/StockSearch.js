import React, {useContext, useRef, useState} from "react"
import {LineChart, XAxis, YAxis, Line, CartesianGrid, ResponsiveContainer, Tooltip} from 'recharts';
import loading from '../assets/loading.gif'
import '../styles/StockSearch.css';
import UserDataContext from "../context/UserDataContext";


/**
 * Displays the all the transactions of the user as a table with Date, Stock Name, Action (Buy or Sell), Quantity and Price fields, with a button to add a transaction
 * @returns {JSX.Element}: the table of transactions
 */
const Transactions = () => {

    let [stockInfos, setStocksInfos] = useState(null);
    let [displayedStockPrices, setDisplayedStockPrices] = useState(null);
    let [confirmedTicker, setConfirmedTicker] = useState(false); // is the ticker of the user valid with the api?
    let [loadingSearch, setLoadingSearch] = useState(false); // is the ticker of the user valid with the api?
    let [selectedPeriod, setSelectedPeriod] = useState('0');
    let stockTickerInputRef = useRef(null); // reference to the ticker input
    let {currency} = useContext(UserDataContext);

    let searchStockInfos = async (e) => {
        e.preventDefault();
        setConfirmedTicker(false);
        setStocksInfos(null);
        setLoadingSearch(true);
        setSelectedPeriod('0');
        setDisplayedStockPrices('0');
        if (stockTickerInputRef.current.value === '') {
            setLoadingSearch(false);
            return;
        }
        let response = await fetch('http://127.0.0.1:8000/api/stockinfos/' + stockTickerInputRef.current.value + '/', {
            method: "get",
            headers: {
                'Content-Type':'application/json'
            },
        });
        let data = await response.json();
        if(response.status !== 200) {
            alert("Something went wrong...");
        } else {
            setConfirmedTicker(data[0]);
            setStocksInfos(data[1]);
            if(data[0] === true) {
                setDisplayedStockPrices(data[1]["Prices"][0]);
            }
        }
        setLoadingSearch(false);
    }

    let changeDisplayedPrices = (e) => {
        setSelectedPeriod((e.target.value).toString());
        setDisplayedStockPrices(stockInfos["Prices"][e.target.value]);
    }

    return (
        <div className={"stock-search"}>
            <div className={"search-stock-container"}>
                <h2>Stocks Infos | </h2>
                <form className={"search-stock-form"} onSubmit={searchStockInfos}>
                    <input type={"text"} placeholder={"Enter the stock Ticker"} ref={stockTickerInputRef}/>
                    <input type={"submit"} value={" "}/>
                </form>
            </div>
            <div className={"stock-infos"}>
                {
                    loadingSearch && !confirmedTicker &&
                    <div className={"loading-container"}>
                       <img className={"loading"} src={loading} alt={"loading..."}/>
                    </div>}
                {
                    !confirmedTicker && !loadingSearch &&
                    <div className={"stock-not-found"}>
                        <p>{stockInfos}</p>
                    </div>}
                {
                    confirmedTicker && !loadingSearch &&
                    <div>
                        <div className={"stock-text-infos"}>
                            <h2 className={"stock-name"}>{stockInfos['Name']}</h2>
                            <p className={"current-price"}>{currency}{stockInfos['CurrentPrice']} <span className={stockInfos['DailyChange'] >= 0 ? 'positive' : 'negative'}>({stockInfos['DailyChange'] >= 0 ? '+' : null}{stockInfos['DailyChange']}%)</span></p>
                            <p>Daily high: {currency}{stockInfos['DailyHigh']}</p>
                            <p>Daily low: {currency}{stockInfos['DailyLow']}</p>
                            <p>Volume: {stockInfos['Volume']}</p>
                            <p>
                                Dividends rate: {stockInfos['DividendRate'] ? stockInfos['DividendRate'] + '%': "None"}
                            </p>
                        </div>
                        <div className={"stock-evolution"}>
                            <div className={"change-date-interval"}>
                                <button value={0} onClick={changeDisplayedPrices} className={selectedPeriod === '0' && "selected-period"}>10y</button>
                                <button value={1} onClick={changeDisplayedPrices} className={selectedPeriod === '1' && "selected-period"}>5y</button>
                                <button value={2} onClick={changeDisplayedPrices} className={selectedPeriod === '2' && "selected-period"}>1y</button>
                                <button value={3} onClick={changeDisplayedPrices} className={selectedPeriod === '3'&& "selected-period"}>1m</button>
                            </div>
                            <ResponsiveContainer width="90%" height="80%" className={"stock-evolution-responsive-container"}>
                                <LineChart data={displayedStockPrices}>
                                    <CartesianGrid strokeDasharray="10 2.5" />
                                    <XAxis dataKey="date"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Line type="monotone" dataKey="value" stroke="#82ca9d" dot={null}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Transactions;
