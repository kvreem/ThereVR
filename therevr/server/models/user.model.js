const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  fb_picture: String,
  profile_picture: { type: 'String', required: true },
  birthday: Date,
  location: {
    id: String,
    name: String,
  },
  friends: [{ id: String, name: String }],
  status: { type: 'String', required: true },
  created_at: { type: Date, default: new Date() },
  updated_at: Date,
  recent: [String]
});

function updatedAt(next) {
  // get the current date
  const currentDate = new Date();

  // change the updated_at field to current date
  this.updated_at = currentDate;

  next();
}

userSchema.pre('save', updatedAt);


module.exports = {
  model: mongoose.model('User', userSchema),
  userSchema,
};
