import React from "react"
import '../styles/Charts.css';
import Shares from "./Shares";


const Charts = ({stocks}) => {

    return (
        <div className={"charts"}>
            <Shares stocks={stocks}/>
        </div>
    );
}

export default Charts;
