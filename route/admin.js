const express = require('express');
const { userValidator } = require('../model/User');
const { User, generateToken } = require('../model/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const auth = require('../modules/auth');
//Create User -- Sign Up
router.post('/', async (req, res) => {
	const { error } = userValidator(req.body);

	// if (error) return res.status(400).json(error.message);
	const { name, email, password, admin, adminPin } = req.body;
	try {
		//Check is the user Exists
		const checkuser = await User.findOne({ email: email });
		if (checkuser)
			return res.status(400).json({ msg: ' User already exist' });
		if (admin && adminPin !== '2324') {
			return res.status(400).json({
				msg:
					'Admin Pin provided is incorrect please contact your employeer',
			});
		}
		const user = new User({
			name,
			email,
			password,
			admin,
		});

		if (admin && adminPin === '2324') {
			user.adminPin = adminPin;
		}

		// Generate Salt
		// Hash The password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		console.log(user);
		const response = await user.save();

		const token = generateToken(response);

		return res.status(200).header('x-auth-user', token).send(response);
	} catch (error) {
		res.status(400).json(error.message);
	}
});

//Get User -- Login
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (!user)
		return res.status(401).json({ msg: 'Wrong user name or password ' });
	const check = await bcrypt.compare(password, user.password);
	if (!check)
		return res.status(401).json({ msg: 'Wrong user name or password ' });

	const token = generateToken(user);

	return res.status(200).header('x-auth-user', token).send(user);
});

//Delete User -- Remove
router.delete('/', auth, async (req, res) => {
	const user = await User.findByIdAndDelete(req.user._id);
	return res.status(200).json({ msg: 'User deleted Succesfuly' });
});

//Update User -- Update Some Information
router.put('/', auth, async (req, res) => {
	const { name, email, password } = req.body;
	const user = await User.findById(req.user._id);
	console.log(name);
	const updateUser = {
		name: name ? name : user.name,
		email: email ? email : user.email,
	};

	const newuser = await User.findByIdAndUpdate(
		req.user._id,
		{
			$set: {
				name: updateUser.name,
				email: updateUser.email,
			},
		},
		{ new: true },
	);
	return res.status(200).json(newuser);
});
module.exports = router;
