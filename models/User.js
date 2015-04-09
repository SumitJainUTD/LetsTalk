var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = mongoose.Schema({
	username : {type: String, require: true},
	email: {type: String, require: true, trim: true, unique: true},
	password: {type: String, require: true}
});

schema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

schema.methods.isValidPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('users', schema);
module.exports = User;