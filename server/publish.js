// Users and Roles
Meteor.users.deny({
  insert: function (userId, doc) {
    // No inserting users (for now)
    return true;
  },
  remove: function (userId, docs) {
    // No removing users (for now)
    return true;
  }
});
Meteor.users.allow({
  update: function (userId, docs, fields, modifier) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      var adminUser = Meteor.users.findOne({"emails.0.address": adminEmail});
      if (user.role === "admin") { // If user has an admin role
        return _.all(docs, function(doc) {
          // The update won't happen if:
          //   * The user is trying to update the role of the default admin user
          //   * The user is trying to update their own role
          if (doc._id != adminUser._id && doc._id != user._id) {
            return true;
          }
          else return false;
        });
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
      var adminUser = Meteor.users.findOne({"emails.0.address": adminEmail});
      if (user.role === "admin") { // User must have an admin role to insert a project
        // We need to add the default admin's _id to the list of project users if it isn't already there
        if (doc.users[0]._id !== adminUser._id) {
          doc.users.push({_id: adminUser._id});
        }
        return true;
      }
      else return false;
    }
    else return false;
  },
  update: function (userId, docs, fields, modifier) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      var adminUser = Meteor.users.findOne({"emails.0.address": adminEmail});
      if (user.role === "admin") { // // User has an admin role
        // We don't want the default admin to be removed as a project user from any project
        if (_.contains(fields, "users")) {
          console.log((_.values(modifier))[0].users._id);
          var newProjectUser = (_.values(modifier))[0].users._id;
          if (newProjectUser !== adminUser._id) {
            return true;
          }
          else return false;
        }
        else return true;
      }
      else {
        if (user.role === "user") { // If user has a user role, only allow an update to the lastIssueNumber field
          if (_.contains(fields, "lastIssueNumber")) {
            return true;
          }
          else return false;
        }
        else return false;
      }
    }
    else return false;
  },
  remove: function (userId, docs) {
    if (userId) { // User must be logged in
      var user = Meteor.users.findOne({_id: userId});
      if (user.role === "admin") { // User must have an admin role to remove a project
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