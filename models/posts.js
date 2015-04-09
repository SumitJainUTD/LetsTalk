

var mongoose =  require('mongoose');	
var schema = mongoose.Schema({
   title: {type: String, default: "" },
  Body: {type: String, default: "" },
  date:{type:String, default:""},
  course:{type:String, default:""},
  comments:{type:Number, default:0},
  author:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
});
var Post = mongoose.model('allposts', schema);
module.exports = Post;

