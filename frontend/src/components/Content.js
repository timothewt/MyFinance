import React from "react";
import '../styles/Content.css';
import Wallet from './Wallet.js';
import Charts from "./Charts";

/**
 * Main content of the app, contains the wallet and the charts
 * @returns {JSX.Element}: content of the app (wallet and charts)
 */
const Content = () => {

    return (
        <div className={"content"}>
            <Wallet/>
            <Charts/>
        </div>
    );
}

export default Content;
