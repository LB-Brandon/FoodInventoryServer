const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

class DBService {
	async saveRecipe(recipeJson) {
		try {
			const newRecipe = await Recipe.findOne({ Name: recipeJson.name });
			if (!newRecipe) {
				const newRecipeInstance = new Recipe(recipeJson);
				const savedRecipe = await newRecipeInstance.save();
				console.log('Recipe saved:', savedRecipe.Name);
				return savedRecipe;
			} else {
				console.log('Recipe already exists:', recipeJson.Name);
			}
		} catch (error) {
			console.error('Error importing data:', error);
			throw new Error('Server Error');
		}
	}

	async findUserByEmail(userEmail) {
		try {
			const foundUser = await User.findOne({ Email: userEmail });
			if (foundUser) {
				console.log('User found:', foundUser.Name);
				return foundUser;
			} else {
				console.log('User not found:', userEmail);
				return null;
			}
		} catch (error) {
			console.error('Error finding user:', error);
			throw new Error('Server Error');
		}
	}

	async addNewUser(newUser) {
		try {
			const savedUser = await newUser.save();
			console.log('User saved:', savedUser.Name);
			return savedUser;
		} catch (error) {
			console.error('Error creating user:', error);
			throw new Error('Server Error');
		}
	}

	async addIngredients(userEmail, receivedIngredients) {
		// find user by id
		// mockUserId = '64d3f99d43bc1ea2c2056bac';

		const user = await this.findUserByEmail(userEmail);
		if (user) {
			// add recived ingredients to user's ingredients
			// console.log(typeof user.Ingredients, 'user.Ingredients', user.Ingredients);
			const orginUserList = Array.from(user.Ingredients);
			const updateUserIngredients = [...orginUserList, ...receivedIngredients];
			// remove duplicates
			const uniqueIngredients = [...new Set(updateUserIngredients)];

			// save user
			user.Ingredients = uniqueIngredients;
			const savedUser = await user.save();
			console.log('ingredients saved:', savedUser.Ingredients);
			return savedUser;
		} else {
			console.log('findUserByEmail - User not found:', userEmail);
			return null;
		}
	}
}

module.exports = new DBService(); // export a instance of DBService
