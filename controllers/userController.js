const userService = require('./userService');
const userModel = require('../models/userModel');

module.exports = {
	createUser: async function (req, res) {
		try {
			const userName = req.body.name;
			const userPassword = req.body.password;
			const userEmail = req.body.email;
			console.log('req.body:', req.body);
			const foundUser = await userService.findUserByEmail(userEmail);
			if (!foundUser) {
				const newUser = new userModel({
					name: userName,
					password: userPassword,
					email: userEmail,
				});
				// save new user to database
				await userService.addNewUser(newUser);
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
	login: async function (req, res) {
		try {
			const userEmail = req.body.email;
			const userPassword = req.body.password;
			console.log('req.body:', req.body);
			const foundUser = await userService.findUserByEmail(userEmail);
			if (foundUser) {
				if (foundUser.password === userPassword) {
					console.log('User logged in:', foundUser.name);
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
			throw new Error('Server Error');
		}
	},
	saveIngredients: async function (req, res) {
		try {
			const userEmail = req.body.email;
			const receivedIngredients = req.body.ingredients;
			console.log('userEmail:', userEmail);
			console.log('receivedIngredients:', receivedIngredients);
			userService.addIngredients(userEmail, receivedIngredients);
			res.json({ message: 'ingredients saved' });
		} catch (error) {
			console.error('Error logging in user:', error);
			throw new Error('Server Error');
		}
	},
};
