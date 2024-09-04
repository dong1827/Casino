import React from 'react'
import { useNavigate } from 'react-router-dom';

//Components for navigating to Guessing dice game
function DiceNum() {
    //Function to navigate to guess-dice page
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/guess-dice");
    }    
    
    //Creates an image and button for guess dice game.
    return(
        <div className='centerJustified columnFlex'>
            <img className='images' src='/images/Guessing_Dice.jpg' alt='Guessing Dice'></img>
            {/*navigates to guess-dice page on click*/}
            <button className='buttons' onClick={handleClick}>Guessing Dice</button>
        </div>
        
    );
}

//Components for navigating to Russian Roulette game
function RussianRoulette() {
    //Function to navigate to russian-roulette page
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/russian-roulette");
    };    
    
    //Creates an image and button for the game
    return(
        <div className='centerJustified columnFlex'>
            <img className='images' src='/images/Russian_Roulette.jpg' alt='Guessing Dice'></img>
            <button className='buttons' onClick={handleClick}>Russian Roulette</button>
        </div>
    );
}

//Components for navigating to Card Race game
function CardRace() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/card-race");
    }

    return(
        <div className='centerJustified columnFlex'>
            <img className='images' src='/images/Card_Race.jpg' alt='Guessing Dice'></img>
            <button className='buttons' onClick={handleClick}>Card Race</button>
        </div>
    )
}

//Components for navigating to Black Jack game
function BlackJack() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/black-jack")
    }

    return(
        <div className='centerJustified columnFlex'>
            <img className='images' src='/images/Black_Jack.jpg' alt='Black Jack'></img>
            <button className='buttons' onClick={handleClick}>Black Jack</button>
        </div>
    )
}

//The default component for this page
function Start() {
    return(
        //Contains every game's navigation component
        <div className='centerJustified'>
            <div className={`rowFlex centerJustified solidBorder`} id='gameBox'>
                <DiceNum></DiceNum>
                <RussianRoulette></RussianRoulette>
                <CardRace></CardRace>
                <BlackJack></BlackJack>
            </div>  
        </div>
    )
}

export default Start;