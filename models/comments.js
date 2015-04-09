var mongoose =  require('mongoose');


var schema = mongoose.Schema({
  comment: {type: String, default: "" },
  date:{type:String, default:""},
  postId:{ type: mongoose.Schema.Types.ObjectId, ref: 'allposts' },
  author:{ type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  likes:{type: Number, default:0}
});
var Comment = mongoose.model('comments', schema);
module.exports = Comment;
