// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        users: [],
        transactions: []
    }));
}

// Authentication endpoints
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    
    const user = data.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Transaction endpoints
app.get('/api/transactions', (req, res) => {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data.transactions);
});

app.post('/api/transactions', (req, res) => {
    const transaction = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    
    data.transactions.push({
        id: Date.now(),
        ...transaction,
        date: new Date().toISOString()
    });
    
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Transaction added' });
});

app.put('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    
    const index = data.transactions.findIndex(t => t.id == id);
    if (index !== -1) {
        data.transactions[index] = { ...data.transactions[index], ...updates };
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        res.json({ success: true, message: 'Transaction updated' });
    } else {
        res.status(404).json({ success: false, message: 'Transaction not found' });
    }
});

app.delete('/api/transactions/:id', (req, res) => {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    
    data.transactions = data.transactions.filter(t => t.id != id);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Transaction deleted' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});