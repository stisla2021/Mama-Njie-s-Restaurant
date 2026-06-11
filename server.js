const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 1. Check MONGO_URI exists before connecting
const MONGO_URI = process.env.MONGO_URI;
console.log('MONGO_URI loaded:', MONGO_URI ? 'YES' : 'NO - env var missing!');

if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable not set in Render');
  process.exit(1);
}

// 2. Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected ✅ to Atlas'))
.catch(err => {
  console.error('MongoDB connection failed:', err.message);
  process.exit(1);
});

// Schemas
const menuSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    image: String
});
const Menu = mongoose.model('Menu', menuSchema);

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

// Health check - visit this in browser to confirm DB status
app.get('/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    res.json({ 
        status: dbState === 1 ? 'ok' : 'db not connected',
        mongoState: dbState,
        mongoUriLoaded: !!process.env.MONGO_URI
    });
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));