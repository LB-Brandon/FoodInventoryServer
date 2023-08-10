const Recipe = require('../models/recipeModel');
const User = require('../models/userModel');

class DBService {
	async saveRecipe(recipeJson) {
		try {
			const newRecipe = await Recipe.findOne({ name: recipeJson.name });
			if (!newRecipe) {
				const newRecipeInstance = new Recipe(newRecipe);
				const savedRecipe = await newRecipeInstance.save();
				console.log('Recipe saved:', savedRecipe.Name);
				return savedRecipe;
			} else {
				console.log('Recipe already exists:', recipeJson.Name);
			}
		} catch (error) {
			console.error('Error importing data:', error);
			mongoose.connection.close();
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

	async addIngredients(userId, receivedIngredients) {
		// find user by id
		// mockUserId = '64d3f99d43bc1ea2c2056bac';

		const user = await this.findUserById(userId);
		if (user) {
			// add recived ingredients to user's ingredients
			console.log(typeof user.Ingredients, 'user.Ingredients', user.Ingredients);
			const orginUserList = Array.from(user.Ingredients);
			const updateUserIngredients = [...orginUserList, ...receivedIngredients];
			// remove duplicates
			const uniqueIngredients = [...new Set(updateUserIngredients)];

			// save user
			user.Ingredients = uniqueIngredients;
			const savedUser = await user.save();

			console.log('User saved:', savedUser.Name);
			return savedUser;
		} else {
			console.log('User not found:', userId);
			return null;
		}
	}
}

module.exports = new DBService(); // export a instance of DBService
