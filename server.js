const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jsk@0826', // 🔴 change this
    database: 'customer_db'
});

db.connect(err => {
    if (err) {
        console.error('DB connection error:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// ---------- ROUTES ----------

// Add Customer
app.post('/customers', (req, res) => {
    const { name, city, signup_date } = req.body;

    const sql = 'INSERT INTO customers (name, city, signup_date) VALUES (?, ?, ?)';
    db.query(sql, [name, city, signup_date], (err) => {
        if (err) return res.status(500).send(err);
        res.send('customer Added');
    });
});

// Get Customers
app.get('/customers', (req, res) => {
    db.query('SELECT * FROM customers', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Add Order
app.post('/orders', (req, res) => {
    const { customer_id, amount, order_date } = req.body;

    const sql = 'INSERT INTO orders (customer_id, amount, order_date) VALUES (?, ?, ?)';
    db.query(sql, [customer_id, amount, order_date], (err) => {
        if (err) return res.status(500).send(err);
        res.send('order Added');
    });
});

// Get Orders
app.get('/orders', (req, res) => {
    db.query('SELECT * FROM orders', (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});
app.get('/', (req, res) => {
  res.send('Welcome to Customer Orders API');
});


// Join (Customer + Orders)
app.get('/customer-orders', (req, res) => {
    const sql = `
        SELECT c.name, c.city, o.amount, o.order_date
        FROM customers c
        JOIN orders o ON c.customer_id = o.customer_id
    `;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// Route to get customers with their orders
app.get('/customers-orders', (req, res) => {
  const sql = `
    SELECT c.customer_id, c.name, c.city, o.amount, o.order_date
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Start server
const PORT = 5000;
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});