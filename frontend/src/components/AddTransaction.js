import React, {useRef, useState} from "react"
import '../styles/AddTransaction.css';
import plusIcon from '../assets/plus_icon.png';


const AddTransaction = ({toggleForm}) => {

    let [confirmedTicker, setConfirmedTicker] = useState(false);
    let [stockName, setStockName] = useState("");

    let stockTickerInputRef = useRef(null);

    let cancelTicker = () => {
        setConfirmedTicker(false);
    }

    let checkForTicker = async (request) => {
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

    return (
        <div className={"addTransaction"}>
            <div className={"addTransactionFormContainer"}>
                <button className={"closeFormBtn"} onClick={toggleForm}>
                    <img src={plusIcon} alt={"close"}/>
                </button>
                <form className={"addTransactionForm"}>
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
                        <input type={"date"} name={"transactionDate"}/>
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
                        <input type={"number"} name={"stockQuantity"} min={'1'} placeholder={"1"} required={true}/>
                    </label>
                    <label>
                        <h4>Price</h4>
                        <span className={"priceInputContainer"}>
                            <input type={"number"} name={"stockPrice"} min={'.01'} step={".01"} placeholder={"1"} required={true}/>
                        </span>
                    </label>
                    <label className={"submitFormContainer"}>
                        <input type={'submit'} name={"submitAddTransaction"} value={"Add transaction"} disabled={!confirmedTicker} />
                    </label>
                </form>
            </div>
        </div>
    );
}

export default AddTransaction;
