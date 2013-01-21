Meteor.startup(function () {
  // Users and Roles
  var adminEmail = "admin@domain.com";
  var adminPassword = "123456";

  var testEmail = "test@domain.com";
  var testPassword = "123456";

  Accounts.onCreateUser(function(options, user) {
    user.role = user.emails[0].address === adminEmail ? "admin" : "user";
    if (options.profile) {
      user.profile = options.profile;
    }
    return user;
  });

  if (Meteor.users.find().count() === 0) {
    Accounts.createUser({email: adminEmail, password: adminPassword});
    Accounts.createUser({email: testEmail, password: testPassword});
  }

  // If the Projects and Issues collections are empty, create some sample project and issue data.
  // If you don't need any sample data, set both numberOfProjectsToCreate and numberOfIssuesToCreatePerProject to 0.
  var numberOfProjectsToCreate = 3;
  var numberOfIssuesToCreatePerProject = 20;
  
  if ((Projects.find().count() === 0)&&(Issues.find().count() === 0)) {
    var projectTitleSuffixChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    for (var i = 0; i < numberOfProjectsToCreate; i++) {
      var projectTitleSuffix = projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0] + projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0] + projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0];
      var projectTitle = "Sample Project " + projectTitleSuffix;
      var projectCreatedDate = ((new Date()).getTime()) - (Math.floor(Math.random() * 1209600000) + 60000); // Randomize date from 1 minute to 10 days ago
      
      var _pid = Projects.insert({projectTitle: projectTitle, projectDescription: "", projectCreatedDate: projectCreatedDate, lastIssueNumber: 0});
      
      var issueTitleSuffixChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
      var issueStatus = ["New", "Discuss", "Assigned", "Resolved", "Closed"];
      
      for (var j = 0; j < numberOfIssuesToCreatePerProject; j++) {
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
    }
  }
});