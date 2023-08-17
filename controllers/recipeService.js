const { Configuration, OpenAIApi } = require('openai');
const userService = require('./userService');
const recipeModel = require('../models/recipeModel');
require('dotenv').config({ path: __dirname + '/../.env' });
const openAPIKey = process.env.API_KEY;
const config = new Configuration({
	apiKey: openAPIKey,
});
const openai = new OpenAIApi(config);

module.exports = {
	saveRecipeList: async (recipeList) => {
		try {
			for (const recipe of recipeList) {
				await recipeModel.create(recipe);
				console.log('Saved recipe:', recipe.name);
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

			const prompt = `Use the following ingredients to give information about the exact same dish as following. ${title} \
        that can be prepared using the following ingredients:\n
        Prepared ingredients:\n
        - ${storedIngredientList.join(', ')}\n
        You don't need to use all of the prepared ingredients. \
        You can also suggest dishes that require 1 to 3 additional ingredients. \
        If there are limited options with the prepared ingredients, \
        you can suggest dishes that require more ingredients for a wider variety.\n
        with "name", "serving", "ingredients", "time" and "instructions" as the keys. \
        In the list of "ingredients", the prepared ingredients which are used for the dish should come first, \
        followed by additional ingredients needed for the dish. \n
        Put the cooking instructions for the specific dish in the correct sequential order in "Instructions". \
        The recipe should match the "Ingredients". and should be suitable for 1 serving(s). \
        It would be great if it includes specific details such as quantities and measurements. \
        For example: {"name": "Recipe Name", "serving": 1, \
        "ingredients": ["ingredient", "ingredient", "ingredient"], \
        "itme" : "time", \
        "instructions": ["instruction", "instruction", "instruction"]\
        To respond, format your answer as a JSON object, \
        "Make sure that the key values below are included in all objects" \
        "["name", "serving", "ingredients", "time", "instructions"]"\
        Don't number the instruction. \
        "time is string as minutes" \n
    }`;

			const response = await openai.createChatCompletion({
				model: 'gpt-3.5-turbo',
				messages: [{ role: 'system', content: prompt }],
				max_tokens: 450,
				temperature: 1,
			});

			const recipeInfo = JSON.parse(response.data.choices[0].message.content);
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
