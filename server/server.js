Meteor.startup(function () {

  // Easily perform CRUD operations on Meteor Collections over HTTP/HTTPS from outside of the Meteor client or server environment
  // You may want to change the authToken string to another random character string for your application
  // More info: https://github.com/crazytoad/meteor-collectionapi
  collectionApi = new CollectionAPI({ authToken: '67F45D61BCBC4585643E3C51F743CD51' });
  collectionApi.addCollection(Projects, 'projects');
  collectionApi.addCollection(Issues, 'issues');
  collectionApi.start();

  // On first launch, the Projects and Issues collections will be empty
  // Let's create some sample projects and issues
  var numberOfProjectsToCreate = 6;
  var numberOfIssuesToCreatePerProject = 20;
  
  if ((Projects.find().count() === 0)&&(Issues.find().count() === 0)) {
    var projectTitleSuffixChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    
    for (var i = 0; i < numberOfProjectsToCreate; i++) {
      var projectTitleSuffix = projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0] + projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0] + projectTitleSuffixChars[Math.floor(Math.random() * projectTitleSuffixChars.length) + 0];
      var projectTitle = "Sample Project " + projectTitleSuffix;
      var projectCreatedTime = ((new Date()).getTime()) - (Math.floor(Math.random() * 1209600000) + 60000); // Randomize time from 1 minute to 10 days ago
      
      var _pid = Projects.insert({projectTitle: projectTitle, projectDescription: "", projectCreatedTime: projectCreatedTime});
      
      var issueTitleSuffixChars = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
      var issueStatus = ["New", "Need Information", "Assigned", "Resolved", "Closed"];
      
      for (var j = 0; j < numberOfIssuesToCreatePerProject; j++) {
        var issueTitleSuffix = issueTitleSuffixChars[Math.floor(Math.random() * issueTitleSuffixChars.length) + 0] + issueTitleSuffixChars[Math.floor(Math.random() * issueTitleSuffixChars.length) + 0] + issueTitleSuffixChars[Math.floor(Math.random() * issueTitleSuffixChars.length) + 0];
        var issueTitle = "Sample Issue " + issueTitleSuffix;
        var issueCreatedTime = ((new Date()).getTime()) - (Math.floor(Math.random() * 1209600000) + 60000); // Randomize time from 1 minute to 10 days ago
        var randomIssueStatus = Math.floor(Math.random() * issueStatus.length) + 0;
        
        Issues.insert({_pid: _pid, issueNumber: 0, issueTitle: issueTitle, issueDescription: "XXXXXX", issueStatus: issueStatus[randomIssueStatus], issueCreatedTime: issueCreatedTime});
      }
      
      var issueNumber = 1;
      var projectIssues = Issues.find({_pid: _pid}, {sort: {issueCreatedTime: 1}});
      projectIssues.forEach(function (issue) {
        Issues.update(issue._id, {$set: {issueNumber: issueNumber}});
        issueNumber++;
      });
    }
  }
});