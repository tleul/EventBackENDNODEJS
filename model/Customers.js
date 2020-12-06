const mongoose = require('mongoose');
const Joi = require('joi');
const { schema } = require('./Category');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: Number,
		required: true,
	},
	isMember: {
		type: Boolean,
		required: true,
	},
});
const Customer = mongoose.model('Customer', CustomerSchema);
const validateCustomer = (customer) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		phone: Joi.number().min(9).required(),
		isMember: Joi.boolean().required(),
	});
	return schema.validate(customer);
};

module.exports = { Customer, validateCustomer };
