const recipeService = require('./recipeService');
const userService = require('./userService');
const imageService = require('./imageCrawlerService');

module.exports = {
	getRecipes: async function (req, res) {
		try {
			console.log('getRecipes called');
			const userEmail = req.query.email;
			// console.log('userEmail:', userEmail);
			const storedIngredientList = await userService.getUserStoredIngredients(userEmail);
			// console.log('storedIngredientList:', storedIngredientList);
			// console.log('storedIngredientList:', typeof storedIngredientList);
			const recommendedRecipeTitleList = await recipeService.getRecommondedMainRecipeTitleList(storedIngredientList);
			// console.log('recommendedRecipeList:', recommendedRecipeTitleList);
			// console.log('recommendedRecipeList:', typeof recommendedRecipeTitleList);

			const existingRecipeList = await recipeService.getExistingRecipeList(recommendedRecipeTitleList);
			// console.log('existingRecipeList:', existingRecipeList);
			existingRecipeList.map((recipe) => {
				console.log('existingRecipe', recipe.name);
			});

			if (existingRecipeList.length === 5) {
				return res.json({ result: existingRecipeList });
			}

			const newRecipeTitleList = recommendedRecipeTitleList.filter(
				(name) => !existingRecipeList.some((recipe) => recipe.name === name)
			);
			console.log('newRecipeTitleList:', newRecipeTitleList);

			const newRecipeList = await recipeService.getRecipeDetails(newRecipeTitleList, storedIngredientList);
			console.log('newRecipeList', newRecipeList);

			// Save Image Url
			for (const recipe of newRecipeList) {
				recipe.imageUrl = await imageService.getImageUrl(recipe.name);
				console.log('recipe.imageUrl', recipe.imageUrl);
			}
			await recipeService.saveRecipeList(newRecipeList);

			const combinedRecipeList = [...existingRecipeList, ...newRecipeList];
			if (combinedRecipeList.length < 5) {
				console.log('*****combinedRecipeList.length < 5*****');
			}
			return res.json({ result: combinedRecipeList });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
};
