import axios from 'axios'
import React, { useState } from 'react'
import BetAmount from "../components/BetAmount.tsx"
import Header from '../components/Header.tsx';

function BlackJack() {
    /*
    Sending back the content for Black Jack page
    args: None 
    */
    const [amount, setAmount] = useState(0);
    const [start, setStart] = useState(false);
    const [stand, setStand] = useState(false);
    const [player, setPlayer] = useState([]);
    const [dealer, setDealer] = useState([]);
    const [gameLabel, setGameLabel] = useState("Enter a bet amount and press start to begin");
    const [msg, setMsg] = useState("");
    const [points, setPoints] = useState(0);
    const description = "Get as close to 21 points as you can.";

    //Handle invalid inputs
    const handleBet = (act) => {
        const fetchInfo = async () => {
            try {
                const respose = await axios({
                    method: "post",
                    url: "http://localhost:5000//Black-Jack/bet",
                    withCredentials: true,
                    data: {
                        action: act,
                        amount: amount
                    }
                });

                const data = respose.data;
                const earned = data["earned"]
                
                setPlayer(data["player"]);
                hideDealerHand(data["dealer"]);

                if (data["result"] != "") {
                    const resultPoints = Math.abs(earned)
                    if (data["result"] == "player won") {
                        const tempMsg = "Congratualtion, you've won " + resultPoints + " points"
                        setMsg(tempMsg);
                    }
                    else if (data["result"] == "dealer won") {
                        const tempMsg = "You lost " + resultPoints + " points"
                        setMsg(tempMsg);
                    }
                    setPoints(data["points"]);
                    setGameLabel("Final Hand");
                    setStart(false);
                    setStand(false);

                    setDealer(data["dealer"]);
                }

            }
            catch (err) {
                console.log(err);
            }
        }

        fetchInfo();
    }

    //Handler for clicking Hit and Stand button
    const handleHit = () => {
        setMsg("You decided to hit");
        handleBet("hit");
    };
    
    const handleStand = () => {
        setMsg("You decided to stand");
        setStand(true)
        handleBet("stand");
    };

    const handleStart = () => {
        handleBet(" ");
        setStart(true);
        setMsg("The game has started, please choose to hit or stand");
    }

    const changeAmount = (value) => {
        setAmount(value)
    };

    const renderCard = (card, index) => {
        if (card[0] == 14) {
            card[0] = 1
        }

        return (
            <img
                key={index}
                src={"/images/cards/" + card[0] + card[1] + ".png"}
                id='cards'
                alt={card[0] + " of " + card[1]}
            />
        )
    }
    
    const hideDealerHand = (dealerHand) => {
        let hand = [];
        hand.push(dealerHand[0]);
        hand.push(["unknown", ""]);
        setDealer(hand);
    }

    return(
        <div className='columnFlex'>
            <div>
                <Header newPoints={ points }/>
            </div>

            <div>
                {/*div for messages*/}
                <div className={`columnFlex centerJustified`}>
                    <p>{description}</p>
                    <div id='screen' className={`columnFlex centerJustified solidBorder`}>
                        {!start && <h2>{gameLabel}</h2>}
                        {start && <h2>Dealer's hand</h2>}
                        <div id='blackJackBox' className={`rowFlex centerJustified`}>
                            {dealer.map((card, index) => (
                                renderCard(card, index)
                            ))}
                        </div>
                        
                        {start && <h2>Player's hand</h2>}
                        <div id='blackJackBox' className={`rowFlex centerJustified`}>
                            {player.map((card, index) => (
                                renderCard(card, index)
                            ))}
                        </div>
                        
                    </div>
                    <label>{msg}</label>
                </div>

                {/*div for inputting a bet amount*/}
                <div className={`columnFlex centerJustified topGap`}>
                    {start ? null : <BetAmount amount= {amount} changeAmount = {changeAmount} />} 
                    {/*div that organize the buttons*/}
                    <div className='rowFlex'>
                        <button className='buttons' onClick={handleHit} disabled={!start}>Hit</button>
                        <button className='buttons' onClick={handleStand} disabled={!start}>Stand</button>
                        <button className='buttons' onClick={handleStart} disabled={start}>Start</button>
                    </div>
                </div>
                
            </div>
        </div>
            
    )
}

export default BlackJack;