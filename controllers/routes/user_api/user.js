const express = require('express');
const route = express.Router();
const udb = require('../../userController');
const gdb = require('../../groupController')

/* GET users listing. */
route.get('/', (req, res, next) => {
  res.json(udb.findUser(user.id));
});

route.get('/nav', (req,res,next) => {
    //send tiny partial to get appended to navbar
    res.render('partials/user_nav',{layout:false});
});

route.post('/create-group',(req,data,res) =>{
    gdb.createGroup(data, 1);
});

module.exports = route;