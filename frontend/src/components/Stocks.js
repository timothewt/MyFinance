import React, {useContext} from "react"
import '../styles/WalletContent.css';
import UserDataContext from "../context/UserDataContext";

/**
 * Displays the stocks of the user as a table with Stock Name, Quantity, Average Cost, Current Price, Value of all his stocks, Net Growth and Growth fields, and the Total Value
 * @returns {JSX.Element}: the table of stocks
 */
const Stocks = () => {

    let { stocks, currency } = useContext(UserDataContext); // gets the stocks of the user and the currency from the context

    return (
        <div className={"wallet-content stocks"}>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={2}>Stocks</th>
                            <th colSpan={5}>
                                Total value: ${stocks['totalValue']}
                                <span className={`growth ${stocks['totalGrowth'] >= 0 ? 'positive' : 'negative'}`}> (${stocks['totalGrowth'] >= 0 ? '+' : null}{stocks['totalGrowth']})</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Stock Name</th>
                            <th>Qty</th>
                            <th>Avg Cost</th>
                            <th>Last Price</th>
                            <th>Value</th>
                            <th>Net Growth</th>
                            <th>Growth</th>
                        </tr>
                        { stocks['stocks'].map(stock => (
                            <tr key={stock.Ticker}>
                                <td className={'stockName'}>{stock.Name}</td>
                                <td>{stock.Qty}</td>
                                <td>{currency}{stock.AvgCost}</td>
                                <td>{currency}{stock.CurrPrice}</td>
                                <td>{currency}{stock.Value}</td>
                                <td className={stock.Growth >= 0 ? 'positive' : 'negative'}>{currency}{stock.Growth >= 0 ? '+' : null}{stock.ValueGrowth}</td>
                                <td><span className={stock.Growth >= 0 ? 'positive' : 'negative'}>{stock.Growth >= 0 ? '+' : null}{stock.Growth}%</span> <span className={`growth ${stock.DailyChange >= 0 ? 'positive' : 'negative'}`}>({stock.DailyChange >= 0 ? '+' : null}{stock.DailyChange}%)</span></td>
                            </tr>
                        )) }
                        <tr>
                            { stocks['stocks'].length === 0 && <th colSpan={7}>Add a transaction to complete your wallet!</th>  }
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Stocks;
