var express = require('express');
var router = express.Router();
const UserModel = require("./users");
const PostModel = require("./post")
const passport = require('passport');
const localStrategy = require("passport-local")
const Upload = require("./multer")

passport.use(new localStrategy(UserModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { nav: false });
});

router.get('/register', function(req, res, next) {
  res.render('register', { nav: false } );
});

router.get('/profile',isLoggedIn, async function(req, res, next) {
  const user =  
            await UserModel
                  .findOne({username:req.session.passport.user})
                  .populate("post")
  
  res.render('profile',{user , nav: true } );
});


router.get('/show/posts',isLoggedIn, async function(req, res, next) {
  const user =  
            await UserModel
                  .findOne({username:req.session.passport.user})
                  .populate("post")
  
  res.render('Posts',{user , nav: true } );
});


router.get('/feed',isLoggedIn, async function(req, res, next) {
  const user = await UserModel.findOne({username:req.session.passport.user})
     const posts = await  PostModel.find()
     .populate("user")
  
  res.render('Posts',{user , posts, nav:true } );
});







router.get('/add',isLoggedIn, async function(req, res, next) {
  const user = await UserModel.findOne({username:req.session.passport.user});
  res.render('add',{user , nav: true } );
});

router.post('/createpost',isLoggedIn,Upload.single("postimage") , async function(req, res, next) {
  const user = await UserModel.findOne({username:req.session.passport.user});
  const post = await  PostModel.create({
    user:user._id,
    title : req.body.title,
    descrpition : req.body.descrpition,
    image : req.file.filename

  });

  user.post.push(post._id)
  await user.save()
  res.redirect("/profile")
 
});





router.post("/file", isLoggedIn,Upload.single("image"),  async function(req,res,next){
 const user = await UserModel.findOne({username:req.session.passport.user});
 user.profileImage = req.file.filename
 await user.save()
 res.redirect("/profile")
})



router.post('/register', function(req, res, next) {
 const data = new UserModel({
  username: req.body.username,
  email : req.body.email,
  contact: req.body.contact
 })
UserModel.register(data,req.body.password).then(function(){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile")
  })
})

});

router.post('/login',passport.authenticate("local",{
  failureRedirect: "/" ,
  successRedirect: "/profile"
}) ,function(req, res, next) {

 
 });


 router.get("logout",function(req,res,next){

    req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
 })

 function isLoggedIn(req,res,next){

  if(req.isAuthenticated()){
    return next();

  }

  res.redirect("/")
 }


module.exports = router;
