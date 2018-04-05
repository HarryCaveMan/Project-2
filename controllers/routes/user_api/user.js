const express = require('express');
const route = express.Router();
const udb = require('../../userController');
const gdb = require('../../groupController')

/* GET users listing. */
route.get('/', (req, res, next) => {
  res.json(req.user);
});

/* GET user profile. */
route.get('/groups', (req, res, next) => {
    let user = req.user;  
    let userData = {user:req.user, groups:udb
    }    
});

route.get('/nav', (req,res,next) => {
    //send tiny partial to get appended to navbar
    res.render('partials/user_nav',{layout:false});
});

route.post('/create-group',(req,data,res) =>{
    gdb.createGroup(data, 1);
});

module.exports = route;