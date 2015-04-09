

var mongoose =  require('mongoose');	
var schema = mongoose.Schema({
   author: {type: String, default: "" },
  commentid: {type: String, default: "" }
});
var Like = mongoose.model('likes', schema);
module.exports = Like;

