const User = require('../models/userModel');

// create a new user
async function createUser(req, res) {
	try {
		const { name, email } = req.body;
		const user = new User({ name, email });
		await user.save();

		res.status(201).json(user);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

// get all users
async function getUsers(req, res) {
	try {
		const users = await User.find();
		res.json(users);
		// res.json({ name: 'test' });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

module.exports = {
	createUser,
	getUsers,
};
