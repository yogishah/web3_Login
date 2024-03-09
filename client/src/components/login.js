// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [message, setMessage] = useState('');
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
            const response = await axios.post('http://localhost:5000/login',
                { address: accounts[0] });
            console.log(response)
            const user = response.data.record
            if (response.status == 200) {
                // const user = response.data.record
                setUserInfo(`Welcome ${user.firstname} ${user.lastname}!`);
            }
            else{
                setMessage(response.data.message);
                console.log(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={connectWallet}>Connect Wallet</button>
      <div>{userInfo}</div>
      {message && <div>{message}</div>}
    </div>
  );
};

export default Login;
