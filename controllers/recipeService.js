const { Configuration, OpenAIApi } = require('openai');
const recipeModel = require('../models/recipeModel');
const userModel = require('../models/userModel');
require('dotenv').config({ path: __dirname + '/../.env' });
const openAPIKey = process.env.API_KEY;
const config = new Configuration({
	apiKey: openAPIKey,
});
const openai = new OpenAIApi(config);

module.exports = {
	getRandomRecipe: async () => {
		try {
			return await recipeModel.aggregate([{ $sample: { size: 5 } }]);
		} catch (error) {
			console.error('Error getting random recipe:', error);
			throw new Error('Server Error');
		}
	},

	getSelectedRecipeIngredients: async (recipeName) => {
		const recipe = await recipeModel.findOne({ name: recipeName });
		const recipeIngredients = recipe.ingredients;
		return recipeIngredients;
	},
	saveRecipeList: async (recipeList) => {
		console.log('Saving recipe list');
		try {
			for (const recipe of recipeList) {
				const { name } = recipe;
				const existingRecipe = await recipeModel.findOne({ name });

				if (existingRecipe) {
					console.log('Recipe already exists');
					continue;
				} else {
					const newRecipe = new recipeModel(recipe);
					await newRecipe.save();
				}
			}
			console.log('Recipe list saved successfully');
		} catch (error) {
			console.error('Error saving recipe list:', error);
		}
	},
	getRecipeDetails: async (newRecipeTitleList, storedIngredientList) => {
		const recipeList = [];

		for (const title of newRecipeTitleList) {
			console.log('Generating recipe for', title);

			const prompt = `The following food title and prepared ingredients will be provided next:
        Title: ${title}
        Prepared Ingredients: ${storedIngredientList.join(', ')}\n
        You don't need to use all of the prepared ingredients. \
        You can also suggest dishes that require 1 to 3 additional ingredients. \
        If there are limited options with the prepared ingredients, \
        you can suggest dishes that require more ingredients for a wider variety.\n
        with "name", "serving", "ingredients", "time" and "instructions" as the keys. \
        In the list of "ingredients", the prepared ingredients which are used for the dish should come first, \
        followed by additional ingredients needed for the dish. \n
        The recipe should match the "Ingredients". and should be suitable for 1 serving(s). \
        It should include specific details such as quantities and measurements. \
        To respond, format your answer as a JSON object, "Make sure that the key values below are included in all objects" ["name", "serving", "ingredients", "time", "instructions"]
        But Don't number the instruction.
        For example: {"name": "Recipe Name", "serving": 1, \
        "ingredients": ["ingredient", "ingredient", "ingredient"], \
        "itme" : time as min, \
        "instructions": ["instruction", "instruction", "instruction"]}\
    }`;

			const response = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'system', content: prompt }],
				max_tokens: 450,
				temperature: 1,
			});

			const recipeInfo = JSON.parse(response.data.choices[0].message.content);
			// console.log('recipeInfo', recipeInfo);
			recipeInstructions = recipeInfo.instructions;
			recipeInstructions = recipeInstructions.map((item) => item.replace(/^[\d-]+\.\s*/, ''));
			recipeInfo.instructions = recipeInstructions;
			recipeTime = recipeInfo.time;
			recipeTime = recipeTime.toString();
			recipeTime = recipeTime.replace(/[^0-9]/g, '');
			recipeInfo.time = recipeTime;
			recipeList.push(recipeInfo);
		}

		return recipeList;
	},

	getExistingRecipeList: async (recommendedRecipeTitleList) => {
		console.log('recommendedRecipeTitleList', recommendedRecipeTitleList);
		const existingRecipeList = await recipeModel.find({ name: { $in: recommendedRecipeTitleList } }).limit(5);
		return existingRecipeList;
	},

	getRecommondedMainRecipeTitleList: async (storedIngredientList) => {
		const prompt = `Please recommend 5 dishes\
    that can be prepared using the following ingredients:\n
    Prepared ingredients:\n 
    - ${storedIngredientList.join(', ')}\n
    You don't need to use all of the prepared ingredients. \
    You can also suggest dishes that require 1 to 3 additional ingredients. \
    If there are limited options with the prepared ingredients, \
    you can suggest dishes that require more ingredients for a wider variety. \
    You should give only the names of dishes. \
    Don't provide the recipe and ingredients. \
    The first letter of every word is capitalized\n`;

		const appropriateExamples = `
    Appropriate examples:[dishs without number or label]`;

		const inappropriateExamples = ``;

		const fullPrompt = prompt + appropriateExamples + inappropriateExamples;

		const response = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [{ role: 'system', content: fullPrompt }],
			max_tokens: 450,
			temperature: 1,
		});

		// return list type
		var result = response.data.choices[0].message.content;
		// console.log('result', result);

		var recipeInstructions = result.split('\n');
		recipeInstructions = recipeInstructions.map((item) => item.replace(/^[\d-]+\.\s*/, ''));

		// console.log('filteredList', recipeInstructions);
		return recipeInstructions;
	},
};
