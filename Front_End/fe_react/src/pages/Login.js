import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('Welcome to Casino')
    const navigate = useNavigate()

    const handleRegisterClick = () => {
        navigate('/register')
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        axios({
            method: "post",
            url: "http://localhost:5000/login",
            withCredentials: true,
            data: {
                username: username,
                password: password
            }  
        })
        .then((response) => {
            if (response.data["login"] == "success") {
                navigate("/");
            }
            else {
                setMsg("Login failed")
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className={`centerJustified halfHeight`}>
            <form id='LRBox' className={`columnFlex solidBorder`} onSubmit={handleSubmit}>
                <div>
                    <input
                        className='inputBox'
                        placeholder='username'
                        type='text'
                        id='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className='inputBox'
                        placeholder='password'
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='centerJustified'>
                    <button className='buttons' type='submit'>Login</button>
                    <button className='buttons' onClick={handleRegisterClick}>Register</button>
                </div>
                <p className='centerJustified'>{msg}</p>
            </form>
        </div>
    );
}

export default Login;