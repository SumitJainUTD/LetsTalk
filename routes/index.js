var express = require('express');
var apigee = require('apigee-access');
var zlib = require('zlib');
var cache =apigee.getCache();
var router = express.Router();
  
var Post = require('./../models/posts');
var Comment = require('./../models/comments');
var Like = require('./../models/likes');
var User = require('./../models/User');

/* GET home page. */
router.get('/posts', function(req, res) {  
  console.log("Fresh Tryyyyyyyyyyyyyyyyyyyyyyy");
  if (req.isAuthenticated()) {
    Post.find({}).sort({date:-1}).populate('author').exec(function(err, posts) {
      if (err) {
        console.log("db error in GET /posts: " + err);
        res.send('500 Error');
      } else {
        console.log("Logged in user name is " + req.user.username);
        res.json(posts);
      }
    });
  }else{
     cache.get('allposts', function(err, data) {
          if(data){
            console.log("geeting from cache");
            // console.log(JSON.parse(data));
            // cache.remove('allposts');
            res.json( JSON.parse(data));
          }else{
            Post.find({}).sort({date:-1}).populate('author').exec(function(err, posts) {
              if (err) {
                console.log("Surpriseeeeeedb error in GET /posts: " + err);
                res.send('500 Error');
              } else {
                console.log("Getting from DB");
                console.log(posts);
                cache.put('allposts', posts, 120);
                // res.pipe(zlib.createGunzip()).pipe(posts);
                res.json(posts);
              }
            });            
          }
      }); 
        
  }  
  //   Post.find({}).sort({date:-1}).populate('author').exec(function(err, posts) {
  //     if (err) {
  //       console.log("db error in GET /posts: " + err);
  //       res.send('500 Error');
  //     } else {
  //       res.json(posts);
  //     }
  //   });   
  // }  


});



/////////////////////////////My Posts/////////////////////////////////


router.post('/myposts', function(req, res) {  
  console.log("My Posts");
  var currAuthor = req.body.author;
  console.log(req.body);
  if (req.isAuthenticated()) {
    Post.find({author:currAuthor}).sort({date:-1}).populate('author').exec(function(err, posts) {
      if (err) {
        console.log("db error in GET /posts: " + err);
        res.send('500 Error');
      } else {
        console.log("Logged in user name is " + req.user.username);
        res.json(posts);
      }
    });
  }else{
    Post.find({}).sort({date:-1}).populate('author').exec(function(err, posts) {
      if (err) {
        console.log("db error in GET /posts: " + err);
        res.send('500 Error');
      }else{
        res.json(posts);
      }
    });
    // Post.find({}).sort({date:-1}).exec(function(err, posts) {
    //   if (err) {
    //     console.log("db error in GET /posts: " + err);
    //     res.send('500 Error');
    //   } else {

    //     // User.findById(post.author).exec(function(err,user){
    //     //   console.log("User Name " + user.username);
    //     //   // post.push({username:user.username});
    //     //   res.json({
    //     //       Post: post,
    //     //       User:user
    //     //     });
    // //   // console.log(post);
    // //   res.json(post);
    // // });
    //     res.json(posts);
    //   }
    // });
  }  
});

//////////////////////////Home Page ///////////////////////
router.get('/', function(req, res, next) {
 console.log("Home Page");   
    res.json("./../public/Posts.html");
});

//////////////////////////Show the Post Details ///////////////////////
router.get('/posts/show/:id', function(req, res, next) {
 console.log("Sumittttttttttttttttttttt"); 
  Post.findById(req.params.id).populate('author').exec(function(err, post){
    res.json(post);
  });
});


//////////////////////////Show the Post Details for Edit///////////////////////
router.get('/posts/edit/:id', function(req, res, next) {
 console.log("Sumittttttttttttttttttttt"); 
  Post.findById(req.params.id).populate('author').exec(function(err, post){
    res.json(post);
  });
});

//////////////////////////Update the Post///////////////////////
router.put('/posts/edit/:id', function(req, res, next) {
 console.log("Updateeeeeeeeeeeeeeeeeeeeeeeeeee"); 
  Post.findById(req.params.id).exec(function(err, post){
    console.log(post);
    post.title = req.body.title;
    post.Body = req.body.body;
    post.save(function(err){
      if(err){
        console.log("Error in updating " + err);
        res.send('500 Error');
      }else{
        res.json(post);    
      }        
    });    
  });
});

//Delete The Post and Comments associated with it//////////////////////

router.get('/posts/delete/:id', function(req, res, next) {
  console.log("Deleteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
  Post.find({_id:req.params.id}).remove().exec(function(err, post){
    console.log("Posttttttttttttttt Deleteddddd");
    Comment.find({postId:req.params.id}).remove().exec(function(err,comment){
      console.log("Commentttttttttttttt Deleteddddd");
        res.send("deleted");
    });
  });
});

//Fetching all the comments ro display at the Post Detail page/////////////////////
router.get('/posts/showComments/:id', function(req, res, next) {
      console.log(req.params.id);
      Comment.find({postId:req.params.id}).sort({date:-1}).populate('author').exec(function(err,comments){
      if (err) {
      console.log("db error in GET /posts: " + err);
      res.send('500 Error');
    } else {
      res.json(comments);
    } 
  });
});


// Like the comment////////////////////////////////
router.post('/posts/likes', function(req, res) {
  console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
  res.send("Sumit");
  // console.log(req.body);
  // Like.create(req.body, function(err, post) {
  //   if (err) {
  //     console.log("db error in POST /posts: " + err);
  //     res.send('500');
  //   } else {
  //     res.json(post);
  //   }
  // });
});

//posting a new Thread///////////////////////////////////////
router.post('/posts/createThread', function(req, res) {
  console.log(req.body);
  Post.create(req.body, function(err, post) {
    if (err) {
      console.log("db error in POST /posts: " + err);
      res.send('500');
    } else {
      // req.flash('success', 'A new post was created');
      // post.push({"message" :"xxxxx"});
      // post["message"] ="ccc";
      res.json(post);
    }
  });
});


//Posting a new comment////////////////////////////////////////////////////////////
router.post('/posts/postComment', function(req, res) {
  // alert(req.body);
  // console.log(req.body);
  Comment.create(req.body, function(err, comment) {
    if (err) {
      console.log("db error in POST /comments: " + err);
      res.send('500');
    } else {
        Post.findById({_id:req.body.postId}).exec(function(err, post){
          var cmts = post.comments;
          post.comments = cmts+1;
           post.save(function(err){
            if(err){
              console.log("Error in updating " + err);
              res.send('500 Error');
            }else{
              Comment.findById(comment._id).populate('author').exec(function(err, newcomment){
                console.log(newcomment);
                res.json(newcomment);
              });
            }        
          });  
          
        });        
      }    
  });   
});

////////////////////////Authentication Module/////////////////////////////




// router.get('/posts/showComments/:id', function(req, res, next) {
//   res.json([{ _id: "1", body:"Versions of Lorem Ipsum.", author:'Sumit'},
//     { _id: "2", body:"simply dummy text of the printing", author:'Noopur'},
//     { _id: "3", body:"simply dummy text of the printing", author:'Raghav'},
//     ]);
//   // res.send("hello");
// });


module.exports = router;
