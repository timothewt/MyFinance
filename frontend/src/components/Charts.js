import React from "react"
import '../styles/Charts.css';
import Shares from "./Shares";
import StockSearch from "./StockSearch";


const Charts = () => {

    return (
        <div className={"charts"}>
            <Shares/>
            <StockSearch/>
        </div>
    );
}

export default Charts;
