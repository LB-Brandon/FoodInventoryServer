const recipeService = require('./recipeService');
const userService = require('./userService');
const imageService = require('./imageCrawlerService');

module.exports = {
	getSubRecipes: async function (req, res) {
		try {
			const subRecipeList = await recipeService.getRandomRecipe();
			res.json({ result: subRecipeList });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
	seeWhatYouGot: async function (req, res) {
		try {
			const userEmail = req.query.email;
			const recipeName = req.query.recipe;
			const seletedRecipeIngredients = await recipeService.getSelectedRecipeIngredients(recipeName);
			console.log('seletedRecipeIngredients:', seletedRecipeIngredients);
			const storedIngredientList = await userService.getUserStoredIngredients(userEmail);
			console.log('storedIngredientList:', storedIngredientList);
			const missingIngredients = seletedRecipeIngredients.filter((ingredient) => {
				return !storedIngredientList.includes(ingredient);
			});
			const haveIngredients = seletedRecipeIngredients.filter((ingredient) => {
				return storedIngredientList.includes(ingredient);
			});
			console.log('haveIngredients:', haveIngredients);
			console.log('missingIngredients:', missingIngredients);
			res.json({ result: { haveIngredients: haveIngredients, missingIngredients: missingIngredients } });
		} catch (error) {
			res.status(500).json({ error: error.message });
		}
	},
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

			var newRecipeList = await recipeService.getRecipeDetails(newRecipeTitleList, storedIngredientList);
			newRecipeList = newRecipeList.filter((item) => item !== '');
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
