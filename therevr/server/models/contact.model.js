
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
	connection: { type: [ String ], required: true, validate: [contactRequire, '{PATH} needs 2 contacts'] },
	connectionId: { type: String, required: true, unique: true, index: true }
});

contactSchema.pre('validate', function (next) {
	console.log(this.connection.sort().join(","));
	this.connectionId = this.connection.sort().join(",");
	next();
})

function contactRequire(val) {
	val.length != 2;
}

module.exports = {
	model: mongoose.model("Contact", contactSchema),
	contactSchema
};
