const express = require('express');
const jwt = require('jsonwebtoken');
const { User } = require('../model/User');
const router = express.Router();
const auth = require('../modules/auth');
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select('-password');
		console.log(user);
		return res.status(200).send(user);
	} catch (error) {
		return res.status(401).send({ msg: 'User Not LOGEDIN' });
	}
});

module.exports = router;
