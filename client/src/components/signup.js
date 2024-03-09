// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Signup = () => {
    let navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userInfo, setUserInfo] = useState('');

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            console.log(accounts)
            const message = 'Login with Web3';
            const signature = await ethereum.request({
                method: 'personal_sign',
                params: [message, accounts[0]], // Pass the message and the account to sign with
            });

            const userData = {
                firstName: firstName,
                lastName: lastName,
                signature: signature,
            };
            const response = await axios.post('http://localhost:5000/register',
                { firstname: firstName, lastname: lastName, address: accounts[0] });
            console.log(response)
            if (response.status == 201) {
                const user = response.data.record
                navigate('/login')
                setUserInfo(`Welcome ${user.firstname} ${user.lastname}!`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Web3 Login Demo</h1>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <br></br>
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <br></br>
            <button onClick={(connectWallet)}>Connect Wallet</button>
            <div>{userInfo}</div>
        </div>
    );
};

export default Signup;
