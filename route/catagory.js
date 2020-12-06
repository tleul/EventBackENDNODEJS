const express = require('express');
const auth = require('../modules/auth');
const admin = require('../modules/admin');
const { Catagory, validateCatagory } = require('../model/Category');
const { Event } = require('../model/Events');
const router = express.Router();

//Create Catagory
//TODO [auth, admin],
router.post('/', async (req, res) => {
	const { category_Name, category_Description, active } = req.body;

	const { error } = validateCatagory(req.body);
	const catagory = await Catagory.findOne({ category_Name });
	try {
		if (error || catagory)
			return res.status(400).json({
				msg: error ? error : 'The catagory name is already Exist',
			});
		const newcatagory = new Catagory({
			category_Name,
			category_Description,
			active,
		});
		const response = await newcatagory.save();
		console.log(response);
		return res.status(200).json(response);
	} catch (error) {
		console.log(error);
	}
});

//Get Catagory
router.get('/', async (req, res) => {
	const category = await Catagory.find();
	return res.status(200).json(category);
});

//Delete Catagory -- Remove[auth, admin]
router.delete('/:id', async (req, res) => {
	try {
		const events = await Event.find({
			event_category: { _id: req.params.id },
		}).populate('event_category');
		if (events.length > 0) {
			return res.status(400).send({
				msg:
					'You have an Event with this Category! in order to delete this category you need to delete the event associated with this category ',
			});
		}
		const catagory = await Catagory.findByIdAndDelete(req.params.id);

		return res.status(200).json(catagory);
	} catch (error) {
		console.log(error);
	}

	// const catagory = await Catagory.findByIdAndDelete(req.params.id);

	// return res.status(200).json(catagory);
});

//Update Catagory -- Update  Information[auth, admin]
router.put('/', async (req, res) => {
	try {
		const { categoryName, categoryDesc, active } = req.body;

		const catagory = await Catagory.findByIdAndUpdate(
			req.params.id,
			{
				$set: {
					categoryName,
					categoryDesc,
					active,
				},
			},
			{ new: true },
		);

		return res.status(200).json(catagory);
	} catch (error) {
		console.log(errror);
	}
});
module.exports = router;
