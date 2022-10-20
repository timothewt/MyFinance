import React, {useContext, useRef, useState} from "react"
import '../styles/AddTransaction.css';
import plusIcon from '../assets/plus_icon.png';
import AuthContext from "../context/AuthContext";


const AddTransaction = ({toggleForm}) => {

    let [confirmedTicker, setConfirmedTicker] = useState(false); // is the ticker of the user valid with the api?
    let [stockName, setStockName] = useState("");   // name of the stock retrieved by the ticker
    let {authTokens} = useContext(AuthContext); // authentication tokens

    let stockTickerInputRef = useRef(null); // reference to the ticker input
    let todayDate = new Date().toISOString().split("T")[0]; // today's date, which is the max date that the user can submit in the form

    /**
     * Cancels the ticker confirmation
     */
    let cancelTicker = () => {
        setConfirmedTicker(false);
    }

    /**
     * Checks if the stock exists and is valid with its ticker and the API, if yes retrieves its name
     */
    let checkForTicker = async () => {
        if (stockTickerInputRef.current.value === '') {
            return;
        }
        let response = await fetch('http://127.0.0.1:8000/api/stockname/' + stockTickerInputRef.current.value + '/', {
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
            setStockName(data[1]);
        }
    }

    /**
     * Submits the transaction to the backend through the API
     * @param e: content of the form
     */
    let submitAddTransaction = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/transactions/', {
            method: 'post',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({'ticker': e.target.stockTicker.value,
                                        'date': e.target.transactionDate.value,
                                        'action': e.target.action.value,
                                        'qty': e.target.stockQuantity.value,
                                        'price': e.target.stockPrice.value})
        });
        if (response.status === 200) { // status 200 is a success
            window.location.reload();
        } else if (response.status === 400) {
            alert("Not enough stock to sell");
        } else if (response.status === 404) {
            alert("Stock not found in the wallet");
        } else {
            alert("Something went wrong..");
        }
    }

    return (
        <div className={"add-transaction"}>
            <div className={"add-transaction-form-container"}>
                <button className={"close-form-btn"} onClick={toggleForm}>
                    <img src={plusIcon} alt={"close"}/>
                </button>
                <form className={"add-transaction-form"} onSubmit={submitAddTransaction}>
                    <label>
                        <h3>Add a transaction</h3>
                    </label>
                    <label>
                        <h4>Stock ticker</h4>
                        <input ref={stockTickerInputRef} type={"text"} name={"stockTicker"} required={true} disabled={confirmedTicker}/>
                        { confirmedTicker ?
                            <button name={"cancelTicker"} value={"Cancel ticker"} onClick={cancelTicker} type={"button"}>Change ticker</button>
                            :
                            <button name={"submitTicker"} value={"Submit ticker"} onClick={checkForTicker} type={"button"}>Submit Ticker</button>
                        }

                    </label>
                    <label>
                        <h4>Stock name</h4>
                        <input type={"text"} name={"stockName"} disabled={true} required={true} value={stockName}/>
                    </label>
                    <label>
                        <h4>Transaction date</h4>
                        <input type={"date"} name={"transactionDate"} required={true} min={"1990-01-01"} max={todayDate} defaultValue={todayDate}/>
                    </label>
                    <label>
                        <h4>Action</h4>
                        <select name={"action"}>
                            <option name={"buy"} value={'B'}>Buy</option>
                            <option name={"sell"} value={'S'}>Sell</option>
                        </select>
                    </label>
                    <label>
                        <h4>Quantity</h4>
                        <input type={"number"} name={"stockQuantity"} min={'1'} placeholder={"0"} required={true}/>
                    </label>
                    <label>
                        <h4>Price</h4>
                        <span className={"price-input-container"}>
                            <input type={"number"} name={"stockPrice"} min={'.01'} step={".01"} placeholder={"0"} required={true}/>
                        </span>
                    </label>
                    <span className={"submit-form-container"}>
                        <input type={'submit'} name={"submitAddTransaction"} value={"Add transaction"} disabled={!confirmedTicker}/>
                    </span>
                </form>
            </div>
        </div>
    );
}

export default AddTransaction;
