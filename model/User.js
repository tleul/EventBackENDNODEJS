const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	adminPin: {
		type: Number,
	},
	admin: {
		type: Boolean,
		required: true,
		default: false,
	},
});
const User = mongoose.model('User', UserSchema);

function userValidator(user) {
	const schema = Joi.object({
		name: Joi.string().min(2).required(),
		email: Joi.string().email().required(),
		password: Joi.string().min(6).max(15).required(),
		admin: Joi.boolean().required(),
	});
	return schema.validate(user);
}

function generateToken(response) {
	console.log(response);
	const payload = {
		_id: response._id,
		name: response.name,
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET);
	return token;

	// jwt.sign(
	// 	payload,
	// 	process.env.JWT_SECRET,
	// 	{ expiresIn: 360000 },
	// 	(err, token) => {
	// 		if (err) {
	// 			throw err;
	// 		}

	// 		return token;
	// 	},
	// );
}

module.exports = { User, userValidator, generateToken };
