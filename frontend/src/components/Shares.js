import React, {useContext} from "react";
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import '../styles/Shares.css';
import UserDataContext from "../context/UserDataContext";


const Shares = () => {

    let { stocksShares } = useContext(UserDataContext);
    const COLORS = ['#3366cc','#dc3912','#ff9900','#109618','#990099','#0099c6','#dd4477','#66aa00','#b82e2e','#316395','#994499','#22aa99','#aaaa11','#6633cc','#e67300','#8b0707','#651067','#329262','#5574a6','#3b3eac','#b77322','#16d620','#b91383','#f4359e','#9c5935','#a9c413','#2a778d','#668d1c','#bea413','#0c5922','#743411'];

    return (
        <div className={"shares"}>
            {stocksShares &&
                <div>
                    <ResponsiveContainer height="100%" width="40%" className={"chartContainer"}>
                        <PieChart>
                            <Pie cx="50%" cy="50%" data={stocksShares} nameKey={"name"} dataKey={"value"} innerRadius={60} label>
                                {stocksShares.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <table>
                        <tbody>
                            {stocksShares.map(stock => (
                                <tr style={{color: COLORS[stocksShares.indexOf(stock) % COLORS.length]}}>
                                    <td>{stock['name']}</td>
                                    <td>{stock['value']}%</td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

export default Shares;
