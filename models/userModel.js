const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	ingredients: {
		type: [String],
		required: false,
	},
	tools: {
		type: [String],
		required: false,
	},
});

// This name "User" is will be used to match the MongoDB collection named "users".
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
