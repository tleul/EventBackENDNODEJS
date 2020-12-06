const express = require('express');
const { Customer, validateCustomer } = require('../model/Customers');
const router = express.Router();

//Create Customer
router.post('/', async (req, res) => {
	const { name, phone, isMember } = req.body;
	const customer = await Customer.findOne({ $or: [{ phone }, { name }] });
	const { error } = validateCustomer(req.body);
	if (customer || error)
		return res
			.status(400)
			.json({ msg: error ? error : 'Customer Already Exist' });

	const newcustomer = new Customer({
		name,
		phone,
		isMember,
	});

	const response = await newcustomer.save();
	res.json(response);
});

//Get Customer
router.get('/', async (req, res) => {
	const customer = await Customer.find().sort('name');
	res.status(200).json(customer);
});

//Delete Customer
router.delete('/:id', async (req, res) => {
	const customer = await Customer.findByIdAndDelete(req.params.id);
	res.status(200).json(customer);
});

//Update Customer
router.put('/:id', async (req, res) => {
	const { name, phone, isMember } = req.body;
	let customer = await Customer.findOne({ $or: [{ phone }, { name }] });

	if (customer)
		return res.status(400).json({ msg: 'Customer Already Exist' });
	customer = await Customer.findByIdAndUpdate(
		req.params.id,
		{
			$set: {
				name: name ? name : customer.name,
				phone: phone ? phone : customer.phone,
				isMember: isMember ? isMember : customer.isMember,
			},
		},
		{ new: true },
	);
	return res.status(200).json(customer);
});
module.exports = router;
