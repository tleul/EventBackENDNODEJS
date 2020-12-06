const { User } = require('../model/User');

module.exports = async function auth(req, res, next) {
	const { _id } = req.user;
	try {
		const user = await User.findById(_id);

		if (!user.isAdmin)
			return res.status(401).json({ msg: 'Unauthorized user' });
		next();
	} catch (error) {
		console.log(error);
	}
};
