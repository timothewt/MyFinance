import React from "react"
import '../styles/WalletContent.css';
import plusIcon from '../assets/plus_icon.png';


const Transactions = ({transactions, currency}) => {
    return (
        <div className={"wallet-content transactions"}>
            <div>
                <table>
                    <thead>
                        <th colSpan={5}>
                            <span>Transactions</span>
                            <button>
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
