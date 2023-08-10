const { Configuration, OpenAIApi } = require('openai');
const DBService = require('./DBService');

// get key from .env file
require('dotenv').config();
const openAPIKey = process.env.API_KEY;

async function getFoods(req, res) {
	try {
		const newRecipeJson = await runPrompt();
		const savedRecipe = await DBService.saveRecipe(newRecipeJson);
		res.json(newRecipeJson);
		// res.render('api', { data: apiResponse }); // 데이터를 포함한 템플릿 렌더링
	} catch (error) {
		console.error('Error importing data:', error);
		res.status(500).send('Server Error');
	}
}
//features

//ejs 템플릿 엔진을 사용하여 렌더링

// get foods
// async function getFoods(req, res) {
// 	try {
// 		var recipe = runPrompt();
// 		res.json(recipe);
// 		// res.json({ name: 'test' });
// 	} catch (error) {
// 		res.status(500).json({ error: error.message });
// 	}
// }

module.exports = {
	getFoods,
};

const config = new Configuration({
	apiKey: openAPIKey,
});

const openai = new OpenAIApi(config);

const runPrompt = async () => {
	const ingredients_prepared = ['Eggs', 'Milk', 'Salt', 'Pepper', 'Butter'];
	const serving = 1;
	const prompt = `Please recommend 1 dishes \
    that can be prepared using the following ingredients:\n
    Prepared ingredients:\n
    - ${ingredients_prepared.join(', ')}\n
    You don't need to use all of the prepared ingredients. \
    You can also suggest dishes that require 1 to 3 additional ingredients. \
    If there are limited options with the prepared ingredients, \
    you can suggest dishes that require more ingredients for a wider variety.\n
    To respond, format your answer as a JSON object \
    with "Name", "Serving", "Ingredients" and "Instructions" as the keys. \
    In the list of "ingredients", the prepared ingredients which are used for the dish should come first, \
    followed by additional ingredients needed for the dish. \n
    Put the cooking instructions for the specific dish in the correct sequential order in "Instructions". \
    The recipe should match the "Ingredients". and should be suitable for ${serving} serving(s). \
    It would be great if it includes specific details such as quantities and measurements. \
    For example: {"Name": "Recipe Name", "Serving": ${serving}, \
    "Ingredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3"], \
    "Instructions": ["Instruction 1", "Instruction 2", "Instruction 3"] }`;

	const response = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [{ role: 'system', content: prompt }],
		max_tokens: 450,
		temperature: 1,
	});

	console.log(response.data.choices[0].message.content);
	return JSON.parse(response.data.choices[0].message.content);
};

// runPrompt();
