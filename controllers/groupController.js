const models = require("../models");

module.exports = {
  // Allows the user to create a group and then links the user to the group
  createGroup: (groupname, userId, route) => {
      models.Groups.create({
          group_name: groupname,
          route: route
      })
      .then( function(group) { 
          models.User.findById(userId)
          .then( function (user) {
              user.addGroups(group).then( user => {
                  console.log("user: " + userId + " has created group: " + groupname + "!");
              }).then( data => {
                  return user.increment({
                      'number_of_Groups': 1
                  }).get({plain:true})
              }).catch(err => console.log(err));
          }).catch(err => console.log(err));
      }).catch(err => console.log(err));      
  },

  // Allows user to join a group, increases their group count and the group's user count
  joinGroup: (groupId, userId) => {
    models.User.findById(userId)
      .then(user => {
        models.Groups.findById(groupId)
          .then(group => {
            user
              .addGroups(group)
              .then(data => {
                return user.increment({
                  number_of_Groups: 1
                });
              })
              .then(data => {
                return group.increment({
                  group_members: 1
                });
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  },

  // Allows user to leave a group they are a part of, decrements their group count and the group's user count
  leaveGroup: (groupId, userId) => {
      models.User.findById(userId)
      .then( user => {
          models.Groups.findById(groupId)
          .then( group => {
              user.removeGroups(group)
              .then( data => {
                  return user.decrement({
                      'number_of_Groups': 1
                  });
              }).then( data => {
                  return group.decrement({
                      'group_members': 1
                  });
              }).catch(err => console.log(err));
          }).catch(err => console.log(err));
      }).catch(err => console.log(err));
  },

  // Finds and returns the top 5 groups by most users
  searchPopularGroups: () => {
      models.Groups.findAll({
          order: [
              ['group_members', 'DESC']
          ],
          limit: 5,
          plain:true
          // again brings large array back, will have to select info we need here or server side
      }).then( groups => groups.map(group => group.id));
  },


  // Finds and returns a specific group by group name
  findGroups: (ids) => {
     models.Groups.findAll({
       where: {
         group_name: models.Sequelize.or(
          {id:ids}
          )
       },
       include: [{
         model: models.User,
         through: ["user_name"]
         }]
     }).then(function(group) {
        
     }).catch(err => console.log(err)); 
  },

  // Allows creation of pre-planned 'events' and allows us to set the price and put a limit oh how many people can join the event [eventSpots])
  createEvent: (groupName, eventCost, eventSpots, route) => {
      models.Groups.create({
          group_name: groupName,
          is_event: true,
          eventCost: eventCost,
          eventSpots: eventSpots,
          route: route
      }).then(group => console.log(group.get({
          plain: true
      }))).catch(err => console.log(err));
  },

  findAllEvents: () => {
    models.Groups.findAll({
      where: {
        is_event: true
      }
    })
      .then(function(events) {
        console.log(events); //this info needs to be sifted through after it is sent back to the front end javascript
      })
      .catch(err => console.log(err));
  }

};