
// create a router 
const router = require('express').Router();
// // create a mongoose model 
// let User = require('../models/user.model');

// router.route('/').get((req, res) => {
//     // mongoose method 
//   User.find()
//     .then(users => res.json(users))
//     .catch(err => res.status(400).json('Error: ' + err));
// });

router.route('/add').post((req, res) => {
    // since new username is part of the request
    console.log(req.body)
  // const username = req.body.username;
  //   // create a new user 
  // const newUser = new User({username});
  //   // save the new user in db 
  // newUser.save()
  //   .then(() => res.json('User added!'))
  //   .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;
