const recipeService = require('./recipeService');
const userService = require('./userService');
const imageService = require('./imageCrawlerService');

module.exports = {
	getRecipes: async function (req, res) {
		try {
			const userEmail = req.query.email;
			console.log('userEmail:', userEmail);
			const storedIngredientList = await userService.getUserStoredIngredients(userEmail);
			// console.log('storedIngredientList:', storedIngredientList);
			// console.log('storedIngredientList:', typeof storedIngredientList);
			const recommendedRecipeTitleList = await recipeService.getRecommondedMainRecipeTitleList(storedIngredientList);
			console.log('recommendedRecipeList:', recommendedRecipeTitleList);
			// console.log('recommendedRecipeList:', typeof recommendedRecipeTitleList);

			const existingRecipeList = await recipeService.getExistingRecipeList(recommendedRecipeTitleList);
			// console.log('existingRecipeList:', existingRecipeList);
			// existingRecipeList.map((recipe) => {
			// 	console.log(recipe.name);
			// });

			if (existingRecipeList.length === 5) {
				return res.json({ result: existingRecipeList });
			}

			const newRecipeTitleList = recommendedRecipeTitleList.filter(
				(name) => !existingRecipeList.some((recipe) => recipe.name === name)
			);
			console.log('newRecipeTitleList:', newRecipeTitleList);

			const newRecipeList = await recipeService.getRecipeDetails(newRecipeTitleList, storedIngredientList);
			console.log('newRecipeList', newRecipeList);
			console.log('newRecipeList', typeof newRecipeList);

			for (const recipe of newRecipeList) {
				recipe.imageUrl = await imageService.getImageUrl(recipe.name);
			}
			await recipeService.saveRecipeList(newRecipeList);

			const combinedRecipeList = [...existingRecipeList, ...newRecipeList];
			for (const recipe of combinedRecipeList) {
				console.log('recipe:', recipe.name);
			}
			return res.json({ result: combinedRecipeList });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
};
