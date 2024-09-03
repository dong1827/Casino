import axios from 'axios'
import React, { useState } from 'react'
import BetAmount from "../components/BetAmount.tsx"
import Header from '../components/Header.tsx';

function GuessDice() {
    /*
    Sending back the content for Guess Dice page
    args: None 
    */
    const [amount, setAmount] = useState(0);
    const [answer, setAnswer] = useState("");
    const [dice, setDice] = useState("");
    const [msg, setMsg] = useState("");
    const [points, setPoints] = useState(0);
    const description = "Roll two dices and guess the outcome. If the dices sums up to more than 10, it's high. Else it's low"

    //Handle invalid inputs
    const handleBet = () => {
        const fetchInfo = async () => {
            try {
                const respose = await axios({
                    method: "post",
                    url: "http://localhost:5000/guess-dice/bet",
                    withCredentials: true,
                    data: {
                        answer: answer,
                        amount: amount
                    }
                });

                const data = respose.data;
                const earned = data["earned"]
                if (data["result"] == "win") {
                    const tempMsg = msg + ". Congratualtion, you've won " + earned + " points"
                    setMsg(tempMsg);
                }
                else if (data["result"] == "lose") {
                    const tempMsg = msg + ". Sorry, you lost " + earned + " points"
                    setMsg(tempMsg);
                }
    
                setDice(JSON.stringify(data["dice"]));
                setPoints(data["points"]);
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setAnswer("")
            }
        }

        fetchInfo();
    }

    //Handler for clicking High and Low button
    const handleHigh = () => {
        //Sets the user's answer and display a message
        setAnswer("High");
        setMsg("You have chosen High")
    };
    
    const handleLow = () => {
        setAnswer("Low");
        setMsg("You have chosen Low")
    };

    const changeAmount = (value) => {
        setAmount(value)
    };

    return(
        <div className='columnFlex'>
            <div>
                <Header newPoints={ points }/>
            </div>

            <div>
                {/*div for messages*/}
                <div className={`columnFlex centerJustified`}>
                    <p>{description}</p>
                    <div id='screen' className={`solidBorder`}>
                        <p>Animation here</p>
                    </div>
                    <label className='highPadding'>the result of the dice was: {dice}</label>
                    <label>{msg}</label>
                </div>

                {/*div for inputting a bet amount*/}
                <div className={`columnFlex centerJustified topGap`}>
                    <BetAmount amount= {amount} changeAmount = {changeAmount} /> 
                    {/*div that organize the buttons*/}
                    <div className='rowFlex'>
                        <button className='buttons' onClick={handleLow}>Low</button>
                        <button className='buttons' onClick={handleHigh}>High</button>
                        <button className='buttons' onClick={handleBet} disabled={answer == ""}>Place Bet</button>
                    </div>
                </div>
                
            </div>
        </div>
            
    )
}

export default GuessDice;