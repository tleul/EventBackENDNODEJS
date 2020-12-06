const Joi = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CatagorySchema = new Schema({
	category_Name: {
		type: String,
	},

	category_Description: {
		type: String,
	},
	active: {
		type: Boolean,
		required: true,
	},
});
const Catagory = mongoose.model('Catagory', CatagorySchema);

const validateCatagory = (catagory) => {
	const schema = Joi.object({
		category_Name: Joi.string().min(3).required(),
		category_Description: Joi.string().min(3).required(),
		active: Joi.boolean().required(),
	});
	return schema.validate(catagory);
};

module.exports = { Catagory, validateCatagory };
