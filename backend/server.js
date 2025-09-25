const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
// const { ethers } = require('ethers'); // Uncomment when adding real blockchain provider

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple file-based storage for received intents (replace with blockchain calls later)
const DATA_DIR = path.join(__dirname, 'data');
const INTENTS_FILE = path.join(DATA_DIR, 'intents.json');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(INTENTS_FILE)) fs.writeFileSync(INTENTS_FILE, '[]', 'utf8');

app.post('/api/intents', async (req, res) => {
  try {
    const intent = req.body;
    if (!intent || !intent.email) return res.status(400).json({ success: false, message: 'Invalid intent' });

    // TODO: Replace this block with smart contract interaction (ethers/web3/Anoma SDK)
    const raw = fs.readFileSync(INTENTS_FILE, 'utf8');
    const intents = JSON.parse(raw || '[]');
    intents.push({ ...intent, receivedAt: new Date().toISOString() });
    fs.writeFileSync(INTENTS_FILE, JSON.stringify(intents, null, 2), 'utf8');

    return res.json({ success: true, message: 'Intent received and stored (backend mock).' });
  } catch (err) {
    console.error('Error saving intent:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Mock donor registry endpoint
app.get('/api/donors', (req, res) => {
  res.json([
    { id: 1, name: 'Donor A', location: 'City X' },
    { id: 2, name: 'Donor B', location: 'City Y' }
  ]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));