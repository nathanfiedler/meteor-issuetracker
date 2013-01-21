// Users
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {"role": 1}});
});
Meteor.publish("allUserData", function () {
  return Meteor.users.find({}, {fields: {"role": 1}});
});

// Projects
Projects = new Meteor.Collection("projects");
Projects.allow({
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