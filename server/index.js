const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const { Web3 } = require('web3');
const { bufferToHex } = require('ethereumjs-util');
const { recoverPersonalSignature } = require('eth-sig-util');

const app = express();
const port = 5000;
const web3 = new Web3('https://polygon-mumbai.g.alchemy.com/v2/2nhdn6bynV4UCXrmBQTmSdzt9GOQ9-oF');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'testDB'
});

app.use(cors({
  origin: 'http://localhost:3000'
}));

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.use(express.json());

app.post('/login', (req, res) => {
  // Handle user login
  const { address, signature } = req.body;
  const msg = "Login with Web3"
  const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
  const signerAddress = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  console.log(signature)
  db.query('SELECT * FROM users WHERE address = ? ', [address], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      if (signerAddress !== address) {
        return res.status(201).json({ message: 'Invalid signature' });
      }
      res.status(200).json({
        message: 'Login successful',
        record: {
          firstname: results[0].firstname,
          lastname: results[0].lastname
        }
      });
    } else {
      res.status(201).json({ message: 'User is not Register' });
    }
  });
});
// Registration route
app.post('/register', (req, res) => {
  const { address, firstname, lastname, signature } = req.body;
  console.log(address, firstname, lastname)
  const msg = "Login with Web3"
  const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
  const signerAddress = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });
  if (signerAddress !== address) {
    return res.status(202).json({ message: 'Invalid signature' });
  }
  if (!address || !firstname || !lastname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('INSERT INTO users (address, firstname, lastname) VALUES (?, ?, ?)',
    [address, firstname, lastname],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(201).json({
            message: 'Username already exists',
            record: {
              firstname: firstname,
              lastname: lastname
            }
          });
        }
        throw err;
      }
      res.status(200).json({
        message: 'User registered successfully',
        record: {
          firstname: firstname,
          lastname: lastname
        }
      });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
