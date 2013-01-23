Meteor.startup(function () {
  // Users and Roles
  Accounts.onCreateUser(function(options, user) {
    user.role = user.emails[0].address === adminEmail ? "admin" : "user";
    if (options.profile) {
      user.profile = options.profile;
    }
    return user;
  });

  var adminUser; // The _id of the admin user is stored here when we create the admin user below
  if (Meteor.users.find().count() === 0) {
    if (adminEmail && adminPassword) {
      adminUser = Accounts.createUser({email: adminEmail, password: adminPassword});
    }
  }

  // If the Projects and Issues collections are empty, create some sample project and issue data
  if ((Projects.find().count() === 0)&&(Issues.find().count() === 0)) {
    var projectTitleSuffixChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    for (var i = 0; i < numberOfProjectsToCreateOnFirstStartup; i++) {
      var projectTitleSuffix = projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0] + projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0] + projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0];
      var projectTitle = "Sample Project " + projectTitleSuffix;
      var projectCreatedDate = ((new Date()).getTime()) - (Math.floor(Math.random() * 1209600000) + 60000); // Randomize date from 1 minute to 10 days ago
      
      var _pid = Projects.insert({projectTitle: projectTitle, projectDescription: "", projectCreatedDate: projectCreatedDate, lastIssueNumber: 0, users: []});
      
      var issueTitleSuffixChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
      var issueStatus = ["New", "Discuss", "Assigned", "Resolved", "Closed"];
      
      for (var j = 0; j < numberOfIssuesToCreatePerProjectOnFirstStartup; j++) {
        var issueTitleSuffix = issueTitleSuffixChars[Math.floor(Math.random() * issueTitleSuffixChars.length) + 0] + issueTitleSuffixChars[Math.floor(Math.random() * issueTitleSuffixChars.length) + 0] + issueTitleSuffixChars[Math.floor(Math.random() * issueTitleSuffixChars.length) + 0];
        var issueTitle = "Sample Issue " + issueTitleSuffix;
        var issueCreatedDate = ((new Date()).getTime()) - (Math.floor(Math.random() * 1209600000) + 60000); // Randomize date from 1 minute to 10 days ago
        var randomIssueStatus = Math.floor(Math.random() * issueStatus.length) + 0;
        
        Issues.insert({_pid: _pid, issueNumber: 0, issueTitle: issueTitle, issueDescription: "XXXXXX", issueStatus: issueStatus[randomIssueStatus], issueCreatedDate: issueCreatedDate});
      }
      
      var issueNumber = 1;
      var projectIssues = Issues.find({_pid: _pid}, {sort: {issueCreatedDate: 1}});
      projectIssues.forEach(function (issue) {
        Issues.update(issue._id, {$set: {issueNumber: issueNumber}});
        issueNumber++;
      });
      Projects.update(_pid, {$set: {lastIssueNumber: (issueNumber - 1)}});
      
      if (adminUser) Projects.update(_pid, {$addToSet: {users: {_id: adminUser}}});
    }
  }
});