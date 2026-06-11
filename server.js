const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from current folder
app.use(express.static(path.join(__dirname)));

// DEBUG: Check if Render injected MONGO_URI
console.log('MONGO_URI loaded:', process.env.MONGO_URI ? 'YES' : 'NO - env var missing!');

// Connect to MongoDB - ATLAS + RENDER
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected ✅ to Atlas'))
.catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1); // crash so Render shows error clearly
});

// Menu Schema
const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    image: String
});
const Menu = mongoose.model('Menu', menuSchema);

// Reservation Schema - includes 'notes' field
const reservationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    dish: String,
    date: String,
    time: String,
    guests: Number,
    notes: String,
    createdAt: { type: Date, default: Date.now }
});
const Reservation = mongoose.model('Reservation', reservationSchema);

// Routes
app.get('/', (req, res) => {
    res.send('Mama Njie\'s Restaurant API is running!');
});

// EXPLICIT routes - kills "Cannot GET" errors
app.get('/menu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'menu.html'));
});

app.get('/reservation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'reservation.html'));
});

app.get('/api/menu', async (req, res) => {
    try {
        const items = await Menu.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reservation endpoint
app.post('/reserve', async (req, res) => {
    try {
        console.log('Received reservation:', req.body);
        const newReservation = new Reservation(req.body);
        await newReservation.save();
        res.json({ success: true, message: 'Reservation saved! We will call you.' });
    } catch (err) {
        console.error('Save error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Use Render's port or 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));