import React from "react"
import '../styles/Wallet.css';
import Stocks from "./Stocks";
import Transactions from "./Transactions";


const Wallet = ({stocks, transactions, currency}) => {

    return (
        <div className={"wallet"}>
            <Stocks stocks={stocks} currency={currency}/>
            <Transactions transactions={transactions} currency={currency}/>
        </div>
    );
}

export default Wallet;
