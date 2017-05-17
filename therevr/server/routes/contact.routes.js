
const { Router } = require('express');
const { makeResponse, async } = require('../helpers/index');

const Contact = require('../models/contact.model').model;
const User = require('../models/user.model').model;

const {io} = require('../io.js');

const api = new Router();

const getUser = async(function *(userid) {
	var user = yield User.findOne({
		user_id: userid
	}).exec();

	return user;
})

// get all the user's contacts
api.get('/contacts/:userid', async(function *(req, res) {

	try {

		// var user = yield getUser(req.params.userid);

		var results = yield Contact.aggregate()
			.match({connection: req.params.userid})
			.project({connection: {
				$arrayElemAt: [{
					$filter: {
						input: "$connection",
						as: "connect",
						cond: { $ne: ["$$connect", req.params.userid] }
					}
				}, 0]
			}})
			.lookup({
				from: "users",
				localField: "connection",
				foreignField: "user_id",
				as: "connection"
			})
			.group({
				_id: null,
				contacts: {$push: {$arrayElemAt: ["$connection", 0]}}
			})
			.exec();

		res.send({success: true, results: results[0]});

	} catch(e) {

		res.send({success: false, error: e.toString()});

	}

}));


module.exports = () => api;
