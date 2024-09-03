import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import LRButtons from '../components/LRButtons';
import LogoutButton from '../components/LogoutButton';

//Start button to redirect the user to choosing their game
function StartButton() {
    return (
        <div> 
            <Link to='start'>
                <button className='buttons'>Start</button>
            </Link>
        </div>
    )
}

function WelcomePage({user, points}) {

    return (
        <div id='welcomePage'>

            <div className='rightJustified'>
                {user 
                ? <div id="userInfo">
                    <label id="user">Welcome: { user }, current points: { points }</label>
                    <LogoutButton></LogoutButton>
                </div> 

                : <LRButtons />}
            </div>

            <div className={`centerJustified columnFlex`}>
                <h1>Welcome to the casino! 
                    {user 
                    ? <span> Press the start button to choose games</span> 
                    : <span> Please login using the buttons on the top right.</span>}
                </h1>

                {user && <StartButton />}
            </div>
        </div>
    )
}

function Home() {
    //Check if there's an active session
    const [user, setUser] = useState(null)
    const [points, setPoints] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        //Getting the current user 
        const fetchUser = async () => {
            try {
                const response = await axios({
                    method: "get",
                    url: ("http://localhost:5000/session"),
                    withCredentials: true
                });

                const data = response.data;

                if (data["session"] != "None" && data["session"] != user) {
                    setUser(data["session"]);
                    setPoints(data["points"]);
                }
            }
            catch (err) {
                console.log(err)
            }
            finally {
                setLoading(false)
            }
            
        }

        fetchUser();
        
    }, [user, points]);     

    if (loading) {
        return (
            <p>Loading...</p>
        )
    }

    return(
        <WelcomePage user={user} points={points}/>
    )
    
}

export default Home;