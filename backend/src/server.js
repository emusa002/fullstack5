const express = require("express");
const cors = require('cors');
const connectDB = require('../config/db');
const contactRoutes = require('../routes/contactRoutes');

const app = express()

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors()); // Use CORS middleware

// Define Routes
app.use('/api/contacts', contactRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})