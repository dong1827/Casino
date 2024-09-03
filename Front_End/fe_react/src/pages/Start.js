import React from 'react'
import { useNavigate } from 'react-router-dom';

//Button for directing to Guessing dice game
function DiceNum() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/guess-dice");
    }    
    
    return(
        <div className='centerJustified columnFlex'>
            <img className='images' src='/images/Guessing_Dice.jpg' alt='Guessing Dice'></img>
            <button className='buttons' onClick={handleClick}>Guessing Dice</button>
        </div>
        
    );
}

//Button for directing to Russian Roulette game
function RussianRoulette() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate("/russian-roulette");
    };    
    
    return(
        <div className='centerJustified columnFlex'>
            <img className='images' src='/images/Russian_Roulette.jpg' alt='Guessing Dice'></img>
            <button className='buttons' onClick={handleClick}>Russian Roulette</button>
        </div>
    );
}

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

function Start() {
    return(
        //Returning buttons for directing to all the avaliable games
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