const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	Name: { type: String, required: true },
	Email: {
		type: String,
		required: true,
		unique: true,
	},
	Password: {
		type: String,
		required: true,
	},
	Ingredients: {
		type: [String],
		required: false,
	},
	Tools: {
		type: [String],
		required: false,
	},
});

// This name "User" is will be used to match the MongoDB collection named "users".
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
