const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
// MongoDB connection URL
const dbURL = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });

// When successfully connected
mongoose.connection.on('connected', () => {
	console.log('Mongoose default connection open to ' + dbURL);
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
	console.log('Mongoose default connection error: ' + err);
});
