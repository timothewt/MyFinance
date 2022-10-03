import React, {useContext, useState} from "react"
import '../styles/WalletContent.css';
import plusIcon from '../assets/plus_icon.png';
import UserDataContext from "../context/UserDataContext";
import AddTransaction from "./AddTransaction";


/**
 * Displays the all the transactions of the user as a table with Date, Stock Name, Action (Buy or Sell), Quantity and Price fields, with a button to add a transaction
 * @returns {JSX.Element}: the table of transactions
 */
const Transactions = () => {

    let {transactions, currency } = useContext(UserDataContext); // gets the transactions of the user and the currency from the context

    const [showForm, setShowForm] = useState(false);

    let toggleForm = () => {
        setShowForm(!showForm);
    }

    return (
        <div className={"wallet-content transactions"}>
            {showForm && <AddTransaction toggleForm={toggleForm}/>}
            <div>
                <table>
                    <thead>
                        <th colSpan={5}>
                            <span>Transactions</span>
                            <button onClick={toggleForm}>
                                <img src={plusIcon} alt={"plus"}/>
                            </button>
                        </th>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Date</th>
                            <th>Stock Name</th>
                            <th>Action</th>
                            <th>Qty</th>
                            <th>Price</th>
                        </tr>
                        { transactions.map(transaction => (
                            <tr key={transaction.ticker}>
                                <td className={'transactionDate'}>{transaction.date}</td>
                                <td className={'stockName'}>{transaction.name}</td>
                                <td className={transaction.action === "B" ? 'positive' : 'negative'}>{transaction.action === "B" ? 'Buy' : 'Sell'}</td>
                                <td>{transaction.qty}</td>
                                <td>{currency}{transaction.price}</td>
                            </tr>
                        )) }
                        { transactions.length === 0 && <th colSpan={5}>No past transactions found.</th>  }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transactions;
