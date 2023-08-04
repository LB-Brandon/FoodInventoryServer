const mongoose = require('mongoose');

// MongoDB connection URL
const dbURL = 'mongodb://foodinventorypro.com:27017/food_inventory_pro';

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
