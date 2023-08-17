const mongoose = require('mongoose');

const mainRecipeSchema = new mongoose.Schema({
	name: { type: String, required: true, index: true, unique: true },
	serving: { type: Number },
	time: { type: String },
	ingredients: { type: [String] }, // ingredients 필드는 문자열 리스트로 정의
	instructions: { type: [String] }, // instructions 필드는 문자열 리스트로 정의
	imageUrl: { type: String, required: false },
});

const MainRecipe = mongoose.model('MainRecipe', mainRecipeSchema);

MainRecipe.createIndexes();

module.exports = MainRecipe;
