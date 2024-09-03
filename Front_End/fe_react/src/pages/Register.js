import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repPassword, setRepPassword] = useState('');
    const [msg, setMsg] = useState('Welcome to Casino!');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (password !== repPassword){
                throw new Error('Password do not match')
            };
            const response = await axios.post('http://localhost:5000/register',  { username, password });
            setMsg(response.data['Msg'])
            console.log(response.data);
        } catch (error) {
            setMsg(error.message)
        }
    };

    const handleLoginClick = () => {
        navigate("/login")
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

                <div>
                    <input
                        className='inputBox'
                        placeholder='repeat password'
                        type='password'
                        id='repPassword'
                        value={repPassword}
                        onChange={(e) => setRepPassword(e.target.value)}
                        required
                    />
                </div>

                <div className='centerJustified'>
                    <button className='buttons' type='submit'>Register</button>
                    <button className='buttons' onClick={handleLoginClick}>Login</button>    
                </div>
                <p className='centerJustified'>{ msg }</p>
            </form>
        </div>
    );
}

export default Register;