const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../server');

// Get all transactions
router.get('/', (req, res) => {
  const db = readDB();
  res.json(db.transactions);
});

// Add new transaction
router.post('/', (req, res) => {
  const transaction = req.body;
  const db = readDB();
  
  transaction.id = Date.now();
  transaction.date = new Date().toISOString();
  db.transactions.push(transaction);
  
  writeDB(db);
  res.json({ 
    success: true, 
    message: 'Transaction added',
    transaction
  });
});

// Update transaction
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const db = readDB();
  
  const index = db.transactions.findIndex(t => t.id == id);
  if (index !== -1) {
    db.transactions[index] = { ...db.transactions[index], ...updates };
    writeDB(db);
    res.json({ success: true, message: 'Transaction updated' });
  } else {
    res.status(404).json({ success: false, message: 'Transaction not found' });
  }
});

// Delete transaction
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  
  db.transactions = db.transactions.filter(t => t.id != id);
  writeDB(db);
  res.json({ success: true, message: 'Transaction deleted' });
});

module.exports = router;