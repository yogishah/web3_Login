const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 5000;

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
  const { address } = req.body;
  console.log(address)
  db.query('SELECT * FROM users WHERE address = ? ', [address], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
          res.status(200).json({ message: 'Login successful' ,
          record:{
            firstname: results[0].firstname,
           lastname: results[0].lastname }});
      } else {
          res.status(201).json({ message: 'User is not Register' });
      }
  });
});
// Registration route
app.post('/register', (req, res) => {
  const { address, firstname, lastname } = req.body;
    console.log(address, firstname, lastname)
  if (!address || !firstname || !lastname) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.query('INSERT INTO users (address, firstname, lastname) VALUES (?, ?, ?)',
    [address, firstname, lastname],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(201).json({ message: 'Username already exists', 
          record:{
            firstname: firstname,
           lastname: lastname }});
        }
        throw err;
      }
      res.status(200).json({ message: 'User registered successfully',
      record:{
       firstname: firstname,
      lastname: lastname }});
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
