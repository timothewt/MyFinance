import React, {useContext, useState} from "react"
import '../styles/WalletContent.css';
import plusIcon from '../assets/plus_icon.png';
import trashIcon from '../assets/trash_can_icon.png';
import UserDataContext from "../context/UserDataContext";
import AddTransaction from "./AddTransaction";
import AuthContext from "../context/AuthContext";


/**
 * Displays the all the transactions of the user as a table with Date, Stock Name, Action (Buy or Sell), Quantity and Price fields, with a button to add a transaction
 * @returns {JSX.Element}: the table of transactions
 */
const Transactions = () => {

    let {transactions, currency } = useContext(UserDataContext); // gets the transactions of the user and the currency from the context
    let {authTokens} = useContext(AuthContext);
    const [showForm, setShowForm] = useState(false);
    const [highlightedRow, setHighlightedRow] = useState(false);
    const [highestTransactionId, setHighestTransactionId] = useState(0);

    /**
     * Sets to the state the highest transactions id which corresponds to the last transaction entered by the user
     */
    let setHighestTransactionIdToState = () => {
        if (transactions.length === 0) {
            return 0;
        }
        let result = transactions[0]["id"]
        transactions.forEach((e) => {
            if (e['id'] > result) {
                result = e['id']
            }
        });
        setHighestTransactionId(result)
    }

    /**
     * toggles the transaction row highlight so the user knows which transaction he will cancel
     */
    let toggleLastTransactionHighlight = () => {
        setHighestTransactionIdToState()
        setHighlightedRow(!highlightedRow)
    }

    /**
     * Toggle the Add Transaction form visibility
     */
    let toggleForm = () => {
        setShowForm(!showForm);
    }

    /**
     * Cancels the last transaction submitted by the user
     */
    let cancelTransaction = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/transactions/', {
            method: 'options',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + String(authTokens.access)
            },
            body: JSON.stringify({'action': 'cancel', 'transaction-id': highestTransactionId}) // selects the last entered transaction which is the highest id
        });
        if (response.status === 200) {
            window.location.reload();
        } else {
            alert("Something went wrong...");
        }
    }

    return (
        <div className={"wallet-content transactions"}>
            {showForm && <AddTransaction toggleForm={toggleForm}/>}
            <div>
                <table>
                    <thead>
                        <tr>
                            <th colSpan={5}>
                                <span>Transactions</span>
                                    <button className={'cancelTransactionBtn'} onClick={cancelTransaction} onMouseEnter={toggleLastTransactionHighlight} onMouseLeave={toggleLastTransactionHighlight}>
                                        <img src={trashIcon} alt={"Delete"} title={"Delete last entered transaction"}/>
                                    </button>
                                <button onClick={toggleForm}>
                                    <img src={plusIcon} alt={"plus"} title={"Add a transaction"}/>
                                </button>
                            </th>
                        </tr>
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
                            <tr key={transaction.id} className={(highlightedRow && highestTransactionId === transaction.id) ? 'highlightedTransactionRow' : null}>
                                <td className={'transactionDate'}>{transaction.date}</td>
                                <td className={'stockName'}>{transaction.name}</td>
                                <td className={transaction.action === "B" ? 'positive' : 'negative'}>{transaction.action === "B" ? 'Buy' : 'Sell'}</td>
                                <td>{transaction.qty}</td>
                                <td>{currency}{transaction.price}</td>
                            </tr>
                        )) }
                        { transactions.length === 0 &&
                            <tr>
                                <th colSpan={5}>No past transactions found.</th>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transactions;
