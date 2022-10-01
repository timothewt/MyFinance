import React, { useState, useEffect, useContext } from "react"
import '../styles/Wallet.css';
import Stocks from "./Stocks";


const Wallet = () => {
    return (
        <div className={"wallet"}>
            <Stocks/>
        </div>
    );
}

export default Wallet;
