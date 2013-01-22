// Users
Meteor.users.deny({
  insert: function (userId, doc) {
    // Not allowed
    return true;
  },
  remove: function (userId, docs) {
    // Not allowed
    return true;
  }
});
Meteor.users.allow({
  update: function (userId, docs, fields, modifier) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      if (user.role === "admin") { // User must have an admin role to change a role
        return true;
      }
      else return false;
    }
    else return false;
  }
});
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {"role": 1}});
});
Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, {fields: {"emails": 1, "role": 1}});
});

// Projects
Projects = new Meteor.Collection("projects");
Projects.allow({
  insert: function (userId, doc) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      if (user.role === "admin") { // User must have an admin role to change a role
        return true;
      }
      else return false;
    }
    else return false;
  },
  update: function (userId, docs, fields, modifier) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      if (user.role === "admin") { // User must have an admin role to change a role
        return true;
      }
      else return false;
    }
    else return false;
  },
  remove: function (userId, docs) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      if (user.role === "admin") { // User must have an admin role to change a role
        return true;
      }
      else return false;
    }
    else return false;
  }
});
Meteor.publish('projects', function () {
  return Projects.find();
});

// Issues
Issues = new Meteor.Collection("issues");
Issues.allow({
  insert: function (userId, doc) {
    // User must be logged in
    return (userId);
  },
  update: function (userId, docs, fields, modifier) {
    // User must be logged in
    return (userId);
  },
  remove: function (userId, docs) {
    // User must be logged in
    return (userId);
  }
});
Meteor.publish('issues', function (_pid) {
  return Issues.find({_pid: _pid});
});