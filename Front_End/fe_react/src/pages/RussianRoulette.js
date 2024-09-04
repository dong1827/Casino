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
        /*
        Function for loading the gun
        args: None 
        */
        //Everytime the function is called, load a bullet into the gun, until a maximum of 6 is reached.
        let newBullets = bullets + 1;
        if (newBullets == 6) {
            setDisableLoad(true);
        };
        setBullets(newBullets)
        setMsg(`There are currently ${newBullets} bullets in the gun.`);

        //If disableFire is true(i.e. no bullets in the gun), set it to false to indicate the gun can be fired
        if (disableFire) {
            setDisableFire(false);
            setDisableReload(false);
        };
    }
    
    const handleFire = () => {
        /*
        Function for firing the gun
        args: None 
        */
       //Send data to backend and fetch the result
        const fetchInfo = async () => {
            try {
                //Turn off fire and reload button when fetching data
                setDisableFire(true);
                setDisableReload(true);
                //Fetch from the url and wait for response
                const response = await axios({
                    method: "post",
                    url: "http://localhost:5000/russian-roulette/bet",
                    withCredentials: true,
                    data: {
                        //amount: the amount of points the user has bet
                        amount: amount,
                        //bullets: the number of bullets user loaded
                        bullets: bullets,
                        //restart: whether the user wants to restart or not 
                        restart: restart
                    }
                });
    
                const data = response.data;
                //Check the result of the fire and set appropriate messages and points
                if (data["hit"] == "hit") {
                    const tempMsg  = "You have been hit and lost " + data["earned"] + " points. Please click reload to restart."
                    //`You have been hit and lost ${data["earned"]} points. Please click reload to restart`
                    setMsg(tempMsg)
                }
                else {
                    //Reenable fire button if there wasn't bullet, else just disable it so player can't fire again  
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
        
        //Disable loading once the gun has been fired
        setDisableLoad(true);
        //Set message to loading while waiting for fetchInfo function to get data
        setMsg("Loading")
        fetchInfo();
        //If the user selected restart(i.e. wants to reload), reset it to false afterwards.
        if (restart) {
            setRestart(false)
        }
    }

    const handleReload = () => {
        /*
        Function for handling reload 
        args: None 
        */
        //Reset the number of bullets
        let newBullets = 0
        setBullets(newBullets);
        setMsg(`There are currently ${newBullets} bullets in the gun.`);
        //Allow reload and disable firing and reload
        setDisableLoad(false);
        setDisableFire(true);
        setDisableReload(true);
        //set restart to true to indicate the user wanted to restart
        setRestart(true)
    }

    const changeAmount = (value) => {
        /*
        Function for syncing the bet amount with display
        args: 
            value (int): the new bet amount 
        */
        setAmount(value);
    }


    return(
        <div className='columnFlex'>
            {/*Puts the Header component on the top*/}
            <div>
                <Header newPoints={ points }/>
            </div>

            {/*Div for the rest of the components*/}
            <div>
                {/*Creates a area for game related information*/}
                <div className={`columnFlex centerJustified`}>
                    <p className={`lineBreaks centerJustified`}>{description}</p>
                    <div id='screen' className={`solidBorder`}>
                        <p>Animation here</p>
                    </div>
                    <p className={`lineBreaks centerJustified`}>{msg}</p>
                </div>

                {/*div for interaction components*/}
                <div className={`columnFlex centerJustified topGap`}>
                    <BetAmount amount= {amount} changeAmount = {changeAmount} /> 
                    {/*div for organizing necessary buttons*/}
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