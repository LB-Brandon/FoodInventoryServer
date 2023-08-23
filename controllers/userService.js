const userModel = require('../models/userModel');

module.exports = {
	makeNewUser: (name, password, email) => {
		const newUser = new userModel({
			name: name,
			password: password,
			email: email,
		});
		return newUser;
	},
	deleteUserIngredient: async (userEmail, ingredientName) => {
		try {
			const user = await userModel.findOne({ email: userEmail });
			const existingIngredients = user.ingredients;
			const updatedIngredients = existingIngredients.filter((ingredient) => ingredient !== ingredientName);
			user.ingredients = updatedIngredients;
			await user.save();
			return true;
		} catch (error) {
			console.error('Error deleting user ingredient:', error);
			return false;
		}
	},
	findUserByEmail: async (userEmail) => {
		try {
			console.log('findUserByEmail');
			const foundUser = await userModel.findOne({ email: userEmail });
			if (foundUser) {
				return foundUser;
			} else {
				return null;
			}
		} catch (error) {
			console.error('Error finding user:', error);
			throw new Error('Server Error');
		}
	},
	getUserStoredIngredients: async (userEmail) => {
		console.log('getUserStoredIngredients');
		const foundUser = await module.exports.findUserByEmail(userEmail);
		// console.log('user', user);
		const userIngredients = foundUser.ingredients;
		return userIngredients;
	},
	addNewUser: async (newUser) => {
		try {
			const savedUser = await newUser.save();
			console.log('User saved:', savedUser.name);
			return true;
		} catch (error) {
			console.error('Error creating user:', error);
			throw new Error('Server Error');
		}
	},
	addIngredients: async (userEmail, receivedIngredients) => {
		try {
			const foundUser = await module.exports.findUserByEmail(userEmail);
			if (foundUser) {
				const storedUserIngredients = Array.from(foundUser.ingredients);
				console.log('storedUserIngredients:', storedUserIngredients);
				const updateUserIngredients = [...storedUserIngredients, ...receivedIngredients];
				const uniqueIngredients = [...new Set(updateUserIngredients)];
				console.log('uniqueIngredients:', uniqueIngredients);
				foundUser.ingredients = uniqueIngredients;
				const savedUser = await foundUser.save();
				console.log('ingredients saved:', savedUser.ingredients);
				return savedUser;
			} else {
				console.log('User Email not found');
				return null;
			}
		} catch (error) {
			console.error('Error adding ingredients:', error);
			throw new Error('Server Error');
		}
	},
};
