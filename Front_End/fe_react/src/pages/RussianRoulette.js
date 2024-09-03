import axios from 'axios';
import React, { useState } from 'react'
import Header from '../components/Header.tsx';
import BetAmount from '../components/BetAmount.tsx';

function RussianRoulette() {
    /*
    Sending back the content for Russian Roulette page
    args: None 
    */
    const [amount, setAmount] = useState(0)
    const [disableFire, setDisableFire] = useState(true);
    const [disableReload, setDisableReload] = useState(true);
    const [disableLoad, setDisableLoad] = useState(false);
    const [bullets, setBullets] = useState(0);
    const [restart, setRestart] = useState(false);
    const [points, setPoints] = useState(0);
    const [msg, setMsg] = useState("");
    const description = "Press load button to load bullets. You can load up to six bullets. Click fire to shoot."
                        + "\nIf the shot does not contain bullet, you will be rewarded points depending on how many bullets you've loaded."
                        + "\nClick reload at anytime to withdraw all bullets or restart."
    const handleLoad = () => {
        let newBullets = bullets + 1;

        if (newBullets == 6) {
            setDisableLoad(true);
        };
        setBullets(newBullets)
        setMsg(`There are currently ${newBullets} bullets in the gun.`);

        if (disableFire) {
            setDisableFire(false);
            setDisableReload(false);
        };
    }
    
    const handleFire = () => {
        const fetchInfo = async () => {
            try {
                //Turn off fire and reload button when fetching data
                setDisableFire(true);
                setDisableReload(true);
                const response = await axios({
                    method: "post",
                    url: "http://localhost:5000/russian-roulette/bet",
                    withCredentials: true,
                    data: {
                        amount: amount,
                        bullets: bullets,
                        restart: restart
                    }
                });
    
                const data = response.data;
                if (data["hit"] == "hit") {
                    const tempMsg  = "You have been hit and lost " + data["earned"] + " points. Please click reload to restart."
                    //`You have been hit and lost ${data["earned"]} points. Please click reload to restart`
                    setMsg(tempMsg)
                }
                else {
                    //Reenable fire button if there wasn't bullet, else just disable it so player can't shoot  
                    setDisableFire(false);
                    const tempMsg = "Congratualations! There was no bullet in that shot. You have earned " + data["earned"] + " points."
                                    + "\n You have fired " + data["current"] + " out of 6 shots. Click fire to continue firing or reload to start another round"
                    setMsg(tempMsg)
                }
                
                setPoints(data["points"]);
            }
            catch (err) {
                setMsg(err);
            }
            finally {
                //Always reenable reload button, incase of error and etc.
                setDisableReload(false);
            }
        }

        setDisableLoad(true);
        setMsg("Loading")
        fetchInfo();
        if (restart) {
            setRestart(false)
        }
    }


    
    const handleReload = () => {
        let newBullets = 0
        setBullets(newBullets);
        setMsg(`There are currently ${newBullets} bullets in the gun.`);
        setDisableLoad(false);
        setDisableFire(true);
        setDisableReload(true);
        setRestart(true)
    }

    const changeAmount = (value) => {
        setAmount(value);
    }


    return(
        <div className='columnFlex'>
            <div>
                <Header newPoints={ points }/>
            </div>

            <div>
                <div className={`columnFlex centerJustified`}>
                    <p className={`lineBreaks centerJustified`}>{description}</p>
                    <div id='screen' className={`solidBorder`}>
                        <p>Animation here</p>
                    </div>
                    <p className={`lineBreaks centerJustified`}>{msg}</p>
                </div>

            {/*div for inputting a bet amount*/}
                <div className={`columnFlex centerJustified topGap`}>
                    <BetAmount amount= {amount} changeAmount = {changeAmount} /> 
                    {/*div that organize the buttons*/}
                    <div className='rowFlex'>
                        <button className='buttons' onClick={handleLoad} disabled={disableLoad}>Load</button>
                        <button className='buttons' onClick={handleFire} disabled={disableFire}>Fire!</button>
                        <button className='buttons' onClick={handleReload} disabled={disableReload}>Reload</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default RussianRoulette;