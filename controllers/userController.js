const userService = require('./userService');

module.exports = {
	deleteUserIngredients: async function (req, res) {
		try {
			const userEmail = req.body.email;
			const ingredientName = req.body.ingredient;
			console.log('userEmail:', userEmail);
			console.log('ingredientName:', ingredientName);
			const status = await userService.deleteUserIngredient(userEmail, ingredientName);
			if (status) {
				res.json({ status: status, message: 'success' });
			} else {
				res.json({ status: status, message: 'failed' });
			}
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
	getUserIngredients: async function (req, res) {
		try {
			const userEmail = req.query.email;
			console.log('userEmail:', userEmail);
			const storedIngredientList = await userService.getUserStoredIngredients(userEmail);
			console.log('storedIngredientList:', storedIngredientList);
			const formattedIngredientList = storedIngredientList.map((ingredient) => {
				return { name: ingredient };
			});
			res.json({ result: formattedIngredientList });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
	signUp: async function (req, res) {
		try {
			const userName = req.body.name;
			const userPassword = req.body.password;
			const userEmail = req.body.email;
			console.log('req.body:', req.body);
			const foundUser = await userService.findUserByEmail(userEmail);
			if (!foundUser) {
				const newUser = userService.makeNewUser(userName, userPassword, userEmail);
				// save new user to database
				const status = await userService.addNewUser(newUser);
				if (status) {
					res.json({ status: status, message: 'success' });
				} else {
					res.json({ status: status, message: 'failed' });
				}
			} else {
				console.log('User already exists:', userEmail);
				res.json({ status: false, message: 'failed' });
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
					res.json({ status: true, message: 'success' });
				} else {
					console.log('Incorrect password:', userEmail);
					res.json({ status: false, message: 'Incorrect password', name: foundUser.name });
				}
			} else {
				console.log('Login User not found:', userEmail);
				res.json({ status: false, message: 'User not found' });
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
