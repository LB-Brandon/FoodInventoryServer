const User = require('../models/userModel');
const DBService = require('./DBService');

module.exports = {
	getUsers: async function (req, res) {
		try {
			const users = await User.find();
			res.json(users);
			// res.json({ name: 'test' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
	saveIngredients: async function (req, res) {
		const userEmail = req.body.email;
		const receivedIngredients = req.body.ingredients;
		console.log('userEmail:', userEmail);
		console.log('receivedIngredients:', receivedIngredients);

		try {
			DBService.addIngredients(userEmail, receivedIngredients);
			res.json({ message: 'success' });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},

	createUser: async function (req, res) {
		const userName = req.body.name;
		const userPassword = req.body.password;
		const userEmail = req.body.email;
		console.log('req.body:', req.body);
		try {
			const foundUser = await DBService.findUserByEmail(userEmail);
			if (!foundUser) {
				const newUser = new User({
					Name: userName,
					Password: userPassword,
					Email: userEmail,
				});
				// save new user to database
				await DBService.addNewUser(newUser);
				res.json({ message: 'success' });
			} else {
				console.log('User already exists:', userEmail);
				res.json({ message: 'User already exists' });
			}
		} catch (error) {
			console.error('Error creating user:', error);
			res.status(500).json({ error: error.message });
		}
	},
	loginUser: async function (req, res) {
		const userEmail = req.body.email;
		const userPassword = req.body.password;
		console.log('req.body:', req.body);
		try {
			const foundUser = await DBService.findUserByEmail(userEmail);
			if (foundUser) {
				if (foundUser.Password === userPassword) {
					console.log('User logged in:', foundUser.Name);
					res.json({ message: 'success' });
				} else {
					console.log('Incorrect password:', userEmail);
					res.json({ message: 'Incorrect password' });
				}
			} else {
				console.log('Login User not found:', userEmail);
				res.json({ message: 'User not found' });
			}
		} catch (error) {
			console.error('Error logging in user:', error);
			res.status(500).json({ error: error.message });
		}
	},
};

// module.exports = {
// 	getUsers,
// 	addIngredients,
// };
