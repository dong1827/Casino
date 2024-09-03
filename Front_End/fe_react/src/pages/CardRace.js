import React, { useState } from "react";
import BetAmount from "../components/BetAmount.tsx";
import Header from "../components/Header.tsx";
import axios from "axios";


function CardRace() {
    const [disableButton, setDisableButton] = useState(false);
    const [disableAdvance, setDisableAdvance] = useState(true);
    const [choice, setChoice] = useState(null);
    const [points, setPoints] = useState(0);
    const [amount, setAmount] = useState(0);
    const [msg, setMsg] = useState("");
    const [suits, setSuits] = useState(new Map());
    const [cards, setCards] = useState(null);
    const [counter, setCounter] = useState(6);
    const [checkpoint, setCheckpoint] = useState(0)
    const description = "Enter your bet amount, and choose a card to start the race"

    const initializeSuits = () => {
        const tempSuits = new Map();
        tempSuits.set("Spades", 0)
        tempSuits.set("Clubs", 0)
        tempSuits.set("Hearts", 0)
        tempSuits.set("Diamonds", 0)

        setSuits(tempSuits)
    }

    const advance = () => {
        try {
            let count = counter
            while(true) {
                let curCard = cards[count];
                count += 1;

                if (curCard[0] != 1) {
                    let message = `Current card is ${curCard}.`;

                    let tempSuits = new Map(suits);
                    tempSuits.set(curCard[1], tempSuits.get(curCard[1]) + 1);

                    let min = 7;
                    let max = 0;
                    for (let value of tempSuits.values()) {
                        if (value < min) {
                            min = value;
                        }

                        if (value > max) {
                            max = value;
                        }
                    }

                    if (min > checkpoint) {
                        let drawback = cards[checkpoint];
                        tempSuits.set(drawback[1], tempSuits.get(drawback[1]) -1);
                        message += ` Since all card reached ${checkpoint + 1}, a drawback is revealed. The drawback card was ${drawback}`;
                        setCheckpoint(checkpoint + 1)
                    }

                    if (max == 7) {
                        message += ` ${curCard[1]} has won.`
                        setDisableAdvance(true);
                    }

                    setSuits(tempSuits);
                    setMsg(message);
                    break;
                }

            }
            setCounter(count);
            
        }
        catch (err) {
            console.log(err)
        }
        

    }

    const startRace = () => {
        initializeSuits();
        const fetchInfo = async () => {
            try {
                setDisableButton(true);
                const response = await axios({
                    method: "post",
                    url: "http://localhost:5000/Card-Race/bet",
                    withCredentials: true,
                    data: {
                        amount: amount,
                        choice: choice
                    }
                });

                const data = response.data;
                
                setCards(data["cards"]);
                setPoints(data["points"]);
            }
            catch (err){
                console.log(err);
            }
            finally {
                setDisableAdvance(false);
                setDisableButton(false);
            }
        }

        if (choice == null) {
            setMsg("Please make a choice before betting!")
        }   
        else {
            fetchInfo();
        }
        
    }
    
    const handleClick = (value) => {
        setMsg(`You have chosen: ${value}`);
        setChoice(value);
    }

    const changeAmount = (value) => {
        setAmount(value);
    };

    return(
        <div>
            <div>
                <Header newPoints={ points }/>
            </div>

            <div>
                <div className={`columnFlex centerJustified`}>
                    <p className={`lineBreaks centerJustified`}>{description}</p>
                    <div id='screen' className={`solidBorder`}>
                        <p>Animation here</p>
                        <p>{suits}</p>
                    </div>
                    <p className={`lineBreaks centerJustified`}>{msg}</p>
                </div>

                <div className={`columnFlex centerJustified topGap`}>
                    <BetAmount amount= {amount} changeAmount = {changeAmount} /> 
                    {/*div that organize the buttons*/}
                    <div className='rowFlex'>
                        <button className='buttons' onClick={() => handleClick("Spades")} disabled={disableButton}>Choose Spades</button>
                        <button className='buttons' onClick={() => handleClick("Clubs")} disabled={disableButton}>Choose Clubs</button>
                        <button className='buttons' onClick={() => handleClick("Hearts")} disabled={disableButton}>Choose Hearts</button>
                        <button className='buttons' onClick={() => handleClick("Diamonds")} disabled={disableButton}>Choose Diamonds</button>
                    </div>
                    <div className='rowFlex'>
                        <button className='buttons' onClick={startRace} disabled={disableButton}>Start Race!</button>
                        <button className='buttons' onClick={advance} disabled={disableAdvance}>Next</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CardRace;