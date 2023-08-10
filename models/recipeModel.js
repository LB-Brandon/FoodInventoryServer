const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
	// Name is primary key
	Name: { type: String, required: true, unique: true },
	Serving: Number,
	Ingredients: [String],
	Instructions: [String],
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
