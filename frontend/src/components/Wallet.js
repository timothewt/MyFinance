import React from "react"
import '../styles/Wallet.css';
import Stocks from "./Stocks";
import Transactions from "./Transactions";

/**
 * Contains the stocks table and the transactions table
 * @returns {JSX.Element}: stocks and transactions tables
 */
const Wallet = () => {
    return (
        <div className={"wallet"}>
            <Stocks/>
            <Transactions/>
        </div>
    );
}

export default Wallet;
