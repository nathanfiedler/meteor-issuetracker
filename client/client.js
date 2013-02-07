// Define Minimongo collections to match server/publish.js.
Projects = new Meteor.Collection("projects");
Issues = new Meteor.Collection("issues");

var defaultToastrOptions = {fadeIn: 250, fadeOut: 250, timeOut: 3000, extendedTimeOut: 250};
var lengthyToastrOptions = {fadeIn: 250, fadeOut: 250, timeOut: 10000, extendedTimeOut: 250};
var confirmToastrOptions = {fadeIn: 250, fadeOut: 250, timeOut: 0, extendedTimeOut: 0, onclick: null, tapToDismiss: false};

var wysihtml5Enabled = true; // Set to false to disable the wysihtml5 editor
var wysihtml5EditorA, wysihtml5EditorB, wysihtml5EditorC, wysihtml5EditorD, wysihtml5EditorE, wysihtml5EditorF;

function initMeteorSessionVariables() {
  Session.set("debug", false); // set to true to show debug related info
  Session.set("page", "home"); // home is the default page
  Session.set("selected_pid", null);
  Session.set("selected_id", null);
  Session.set("selected_issue_status_filter", null);
  Session.set("updating_project_users", false);
  Session.set("loading_projects", false);
  Session.set("loading_issues", false);
  Session.set("no_projects", false);
  Session.set("no_issues", false);
  Session.set("help_after_login", null);
  Session.set("help_filter_by_issue_status", null);
}

Meteor.startup(function () {
  initMeteorSessionVariables(); // If a user was logged in from a previous session and returns, we need this here
  
  $.blockUI.defaults.fadeIn = 0;
  $.blockUI.defaults.fadeOut = 0;
  $.blockUI.defaults.timeout = 0;
  $.blockUI.defaults.message = null;
  $.blockUI.defaults.css.border = "0px";
  $.blockUI.defaults.overlayCSS.backgroundColor = "#fff";

  Meteor.autosubscribe(function () {
    if (Meteor.user()) {
      Meteor.subscribe("userData", function onComplete() {
        // Subscription Complete!
      });
      if (Meteor.user().role === "admin") {
        Meteor.subscribe("allUserData", function onComplete() {
          // Subscription Complete!
        });
      }
      Session.set("loading_projects", true);
      //$.blockUI({message: $("#loadingProjects")});
      Meteor.subscribe("projects", Meteor.user()._id, function onComplete() {
        // Subscription Complete!
        var projectCount = Projects.find().count();
        Session.set("no_projects", projectCount === 0 ? true : false);
        Session.set("loading_projects", false);
        //$.unblockUI();
        if (!Session.get("help_after_login")) {
          if (projectCount !== 0) {
            if (Meteor.user().role === "admin") {
              toastr.info("", "Select or create a project to begin!", defaultToastrOptions);
            }
            else {
              toastr.info("", "Select a project to begin!", defaultToastrOptions);
            }
          }
          else if (Meteor.user().role === "admin") {
            toastr.info("", "Create a project to begin!", defaultToastrOptions);
          }
          Session.set("help_after_login", true);
        }
      });
      if (Session.get("selected_pid")) {
        var project = Projects.findOne(Session.get("selected_pid"));
        if (project) {
          Session.set("loading_issues", true);
          //$.blockUI({message: $("#loadingIssues")});
          Meteor.subscribe("issues", Session.get("selected_pid"), function onComplete() {
            // Subscription Complete!
            var issueCount = Issues.find({_pid: Session.get("selected_pid")}).count();
            Session.set("no_issues", issueCount === 0 ? true : false);
            Session.set("loading_issues", false);
            //$.unblockUI();
          });
          if (Session.get("selected_id")) {
            var issue = Issues.findOne(Session.get("selected_id"));
            if (!issue) {
              resetIssue();
            }
          }
        }
        else {
          resetIssue();
          resetProject();
        }
      }
    }
    else {
      if (Meteor.loggingIn()) {
        initMeteorSessionVariables(); // If a user logs out another another logs in in the same browser session, we need this here
      }
    }
  });
  Accounts.ui.config({
    passwordSignupFields: "EMAIL_ONLY"
  });
  $(window).resize(function() {
    createWaypoints();
  });
});

// Global Handlebars Helpers --------------------------------------------
Handlebars.registerHelper("isDebug", function() {
  return Session.get("debug");
});

Handlebars.registerHelper("isAdmin", function() {
  return Meteor.user().role === "admin";
});

Handlebars.registerHelper("isPageHome", function() {
  return Session.equals("page", "home") ? true : false;
});

Handlebars.registerHelper("isPageUsers", function() {
  return Session.equals("page", "users") ? true : false;
});

Handlebars.registerHelper("isProjectSelected", function() {
  return Session.equals("selected_pid", null) ? false : true;
});

Handlebars.registerHelper("isIssueSelected", function() {
  return Session.equals("selected_id", null) ? false : true;
});

Handlebars.registerHelper("areNoProjects", function() {
  return Session.get("no_projects");
});

Handlebars.registerHelper("areNoIssues", function() {
  return Session.get("no_issues");
});
// Global Handlebars Helpers --------------------------------------------

// Templates ------------------------------------------------------------
Template.navbar.rendered = function() {

};

Template.navbar.events({
  "click a.brand": function (event) {
    event.preventDefault();
  },
  "click a[href=\"#home\"]": function (event) {
    event.preventDefault();
    resetIssue();
    resetProject();
    Session.set("page", "home");
  },
  "click a[href=\"#users\"]": function (event) {
    event.preventDefault();
    Session.set("page", "users");
  }
});

Template.navbar.helpers({
  activePage: function (page) {
    return Session.equals("page", page) ? "active" : "";
  }
});

Template.projectList.rendered = function() {

};

Template.projectList.events({

});

Template.projectList.helpers({
  projects: function () {
    return Projects.find({}, {sort: {projectTitle: 1}});
  }
});

Template.project.rendered = function() {

};

Template.project.events({
  "click .project": function (event) {
    resetIssue();
    if (Session.get("selected_pid") !== this._id) {
      Session.set("selected_pid", this._id);
    }
    else {
      resetProject();
    }
  }
});

Template.project.helpers({
  selectedProject: function () {
    return Session.equals("selected_pid", this._id) ? "selected" : "";
  }
});

Template.projectInfo.rendered = function() {
  if (Session.get("selected_pid")) {
    var project = Projects.findOne(Session.get("selected_pid"));
    Meteor.flush();
    if (project) {
      if (Meteor.user().role === "admin") {
        if (Session.get("debug")) {
          $("#projectInfoUpdate_Project_id").val(Session.get("selected_pid"));
          $("#projectInfoDelete_Project_id").val(Session.get("selected_pid"));
        }
        if ($("#projectInfoOverview_ProjectDescription").length) {
          $("#projectInfoOverview_ProjectDescription").html(project.projectDescription);
        }
        $("#projectInfoCreate_ProjectTitle").val("");
        $("#projectInfoCreate_ProjectDescription").val("");
        if (wysihtml5Enabled && $("#projectInfoCreate_ProjectDescription").length) {
          wysihtml5EditorA = new wysihtml5.Editor("projectInfoCreate_ProjectDescription", {
            toolbar: "projectInfoCreate_ProjectDescriptionToolbar",
            parserRules: wysihtml5ParserRules
          });
          wysihtml5EditorA.on("load", function() {
            if (wysihtml5EditorA) {
              var doc = wysihtml5EditorA.composer.sandbox.getDocument();
              var link = doc.createElement("link");
              link.href = "css/wysiwyg-color.css";
              link.rel = "stylesheet";
              doc.querySelector("head").appendChild(link);
              wysihtml5EditorA.clear();
            }
          });
          wysihtml5EditorA.on("destroy:composer", function() {
            wysihtml5EditorA = null;
          });
        }
        $("#projectInfoUpdate_ProjectTitle").val(project.projectTitle);
        $("#projectInfoUpdate_ProjectDescription").val(project.projectDescription);
        if (wysihtml5Enabled && $("#projectInfoUpdate_ProjectDescription").length) {
          wysihtml5EditorB = new wysihtml5.Editor("projectInfoUpdate_ProjectDescription", {
            toolbar: "projectInfoUpdate_ProjectDescriptionToolbar",
            parserRules: wysihtml5ParserRules
          });
          wysihtml5EditorB.on("load", function() {
            if (wysihtml5EditorB) {
              var doc = wysihtml5EditorB.composer.sandbox.getDocument();
              var link = doc.createElement("link");
              link.href = "css/wysiwyg-color.css";
              link.rel = "stylesheet";
              doc.querySelector("head").appendChild(link);
              wysihtml5EditorB.setValue(project.projectDescription, true);
            }
          });
          wysihtml5EditorB.on("destroy:composer", function() {
            wysihtml5EditorB = null;
          });
        }
        if (Session.get("updating_project_users")) {
          Session.set("updating_project_users", false);
          $("#projectInfoTabs a[href=\"#projectInfoUsers\"]").tab("show");
        }
        else {
          $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
        }
      }
      else {
        $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
      }
    }
  }
  else {
    Meteor.flush();
    if (Meteor.user().role === "admin") {
      $("#projectInfoCreate_ProjectTitle").val("");
      $("#projectInfoCreate_ProjectDescription").val("");
      if (wysihtml5Enabled && $("#projectInfoCreate_ProjectDescription").length) {
        wysihtml5EditorC = new wysihtml5.Editor("projectInfoCreate_ProjectDescription", {
          toolbar: "projectInfoCreate_ProjectDescriptionToolbar",
          parserRules: wysihtml5ParserRules
        });
        wysihtml5EditorC.on("load", function() {
          if (wysihtml5EditorC) {
            var doc = wysihtml5EditorC.composer.sandbox.getDocument();
            var link = doc.createElement("link");
            link.href = "css/wysiwyg-color.css";
            link.rel = "stylesheet";
            doc.querySelector("head").appendChild(link);
            wysihtml5EditorC.clear();
          }
        });
        wysihtml5EditorC.on("destroy:composer", function() {
          wysihtml5EditorC = null;
        });
      }
      $("#projectInfoTabs a[href=\"#projectInfoCreate\"]").tab("show");
    }
    else {
      $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
    }
  }
};

Template.projectInfo.events({
  "click #projectInfoCreate_CreateProject": function (event) {
    if ($("#projectInfoCreate_ProjectTitle").val().stripHTML() !== "") {
      var projectTitle = $("#projectInfoCreate_ProjectTitle").val().stripHTML();
      var projectDescription = wysihtml5Enabled ? $("#projectInfoCreate_ProjectDescription").val() : $("#projectInfoCreate_ProjectDescription").val().stripHTML();
      var projectCreatedDate = (new Date()).getTime();
      Projects.insert({projectTitle: projectTitle, projectDescription: projectDescription, projectCreatedDate: projectCreatedDate, lastIssueNumber: 0, users: [{_id: Meteor.user()._id}]}, function (error, result) {
        if (error) {
          toastr.error("The project was not created", "Error", defaultToastrOptions);
        }
        else {
          Session.set("selected_pid", result);
          toastr.success("", "Project created", defaultToastrOptions);
        }
      });
    }
    else {
      toastr.warning("", "Please enter a project title", defaultToastrOptions);
    }
  },
  "click #projectInfoCreate_CancelProject": function (event) {
    $("#projectInfoCreate_ProjectTitle").val("");
    $("#projectInfoCreate_ProjectDescription").val("");
    if (wysihtml5Enabled) {
      if (wysihtml5EditorA) {
        wysihtml5EditorA.clear();
      }
      else if (wysihtml5EditorC) {
        wysihtml5EditorC.clear();
      }
      else {
        $("#projectInfoCreate").find("iframe.wysihtml5-sandbox").contents().find('.wysihtml5-editor').html("");
      }
    }
    if (Session.get("selected_pid")) {
      $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
    }
  },
  "click #projectInfoUpdate_UpdateProject": function (event) {
    if ($("#projectInfoUpdate_ProjectTitle").val().stripHTML() !== "") {
      var projectTitle = $("#projectInfoUpdate_ProjectTitle").val().stripHTML();
      var projectDescription = wysihtml5Enabled ? $("#projectInfoUpdate_ProjectDescription").val() : $("#projectInfoUpdate_ProjectDescription").val().stripHTML();
      Projects.update(Session.get("selected_pid"), {$set: {projectTitle: projectTitle, projectDescription: projectDescription}}, function (error) {
        if (error) {
          toastr.error("The project was not updated", "Error", defaultToastrOptions);
        }
        else {
          toastr.success("", "Project updated", defaultToastrOptions);
        }
      });
    }
    else {
      toastr.warning("", "Please enter a project title", defaultToastrOptions);
    }
  },
  "click #projectInfoUpdate_CancelProject": function (event) {
    if (Session.get("selected_pid")) {
      var project = Projects.findOne(Session.get("selected_pid"));
      if (Session.get("debug")) {
        $("#projectInfoUpdate_Project_id").val(Session.get("selected_pid"));
      }
      $("#projectInfoUpdate_ProjectTitle").val(project.projectTitle);
      $("#projectInfoUpdate_ProjectDescription").val(project.projectDescription);
      if (wysihtml5Enabled) {
        if (wysihtml5EditorB) {
          wysihtml5EditorB.setValue(project.projectDescription, true);
        }
        else {
          $("#projectInfoUpdate").find("iframe.wysihtml5-sandbox").contents().find('.wysihtml5-editor').html(project.projectDescription);
        }
      }
      $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
    }
    else {
      if (Meteor.user().role === "admin") {
        $("#projectInfoTabs a[href=\"#projectInfoCreate\"]").tab("show");
      }
      else {
        $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
      }
    }
  },
  "click #projectInfoDelete_DeleteProject": function (event) {
    if (Session.get("selected_pid")) {
      $.blockUI();
      var $toast = toastr.error("", "<div><button type=\"button\" id=\"deleteProjectYesBtn\" class=\"btn btn-primary\">Yes</button><button type=\"button\" id=\"deleteProjectNoBtn\" class=\"btn\" style=\"margin: 0 8px 0 8px\">No</button> Delete Project?</div>", confirmToastrOptions);
      if ($toast.find("#deleteProjectYesBtn").length) {
        $toast.delegate("#deleteProjectYesBtn", "click", function () {
          resetIssue();
          var projectIssues = Issues.find({_pid: Session.get("selected_pid")});
          projectIssues.forEach(function (issue) {
            Issues.remove({_id: issue._id}, function (error) {
              if (error) {
                toastr.error("There was an problem deleting an issue associated with this project", "Error", defaultToastrOptions);
              }
            });
          });
          Projects.remove({_id: Session.get("selected_pid")}, function (error) {
            if (error) {
              toastr.error("The project was not deleted", "Error", defaultToastrOptions);
            }
            else {
              toastr.success("", "Project deleted", defaultToastrOptions);
              resetProject();
              $.unblockUI();
              $toast.remove();
            }
          });
        });
      }
      if ($toast.find("#deleteProjectNoBtn").length) {
        $toast.delegate("#deleteProjectNoBtn", "click", function () {
          $.unblockUI();
          $toast.remove();
          $("#projectInfoTabs a[href=\"#projectInfoOverview\"]").tab("show");
        });
      }
    }
  }
});

Template.projectInfo.helpers({
  project: function () {
    var project = Projects.findOne(Session.get("selected_pid"));
    return project ? project : {};
  },
  getIssueCount: function () {
    return Session.get("selected_pid") ? Issues.find({_pid: Session.get("selected_pid")}).count() : 0;
  },
  getIssueStatusCount: function (issueStatus) {
    return Session.get("selected_pid") ? Issues.find({_pid: Session.get("selected_pid"), issueStatus: issueStatus}).count() : 0;
  },
  projectUsers: function () {
    return Meteor.users.find({}, {sort: {"emails.0.address": 1}});
  },
  hasProjectDescription: function() {
    return (this && this.projectDescription) ? true : false;
  }
});

Template.projectUser.rendered = function() {

};

Template.projectUser.events({
  "click .projectUser": function (event) {
    Session.set("updating_project_users", true);
    if (this._id !== Meteor.user()._id) {
      var project = Projects.findOne({_id: Session.get("selected_pid"), "users._id": this._id});
      if (project) {
        Projects.update(Session.get("selected_pid"), {$pull: {users: {_id: this._id}}}, function (error) {
          if (error) {
            $("#projectInfoTabs a[href=\"#projectInfoUsers\"]").tab("show");
            toastr.error("That action is not allowed", "Error", defaultToastrOptions);
          }
        });
      }
      else {
        Projects.update(Session.get("selected_pid"), {$addToSet: {users: {_id: this._id}}}, function (error) {
          if (error) {
            $("#projectInfoTabs a[href=\"#projectInfoUsers\"]").tab("show");
            toastr.error("That action is not allowed", "Error", defaultToastrOptions);
          }
        });
      }
    }
    else {
      toastr.error("That action is not allowed", "Error", defaultToastrOptions);
    }
  }
});

Template.projectUser.helpers({
  email: function () {
    return this.emails[0].address ? this.emails[0].address : "";
  },
  isProjectUser: function () {
    var project = Projects.findOne({_id: Session.get("selected_pid"), "users._id": this._id});
    return project ? true : false;
  }
});

Template.issueListFilters.events({
  "click .issueListFilters_Status": function (event) {
    if (!Session.get("help_filter_by_issue_status")) {
      toastr.info("", "You are filtering issues by a particular status. To remove the filter, click again on the filter you just selected, or select another filter.", lengthyToastrOptions);
      Session.set("help_filter_by_issue_status", true);
    }
    resetIssue();
    Session.set("selected_issue_status_filter", Session.equals("selected_issue_status_filter", event.currentTarget.getAttribute("data-status")) ? null : event.currentTarget.getAttribute("data-status"));
  }
});

Template.issueListFilters.helpers({
  selectedIssueStatusFilter: function (whatStatus) {
    return Session.equals("selected_issue_status_filter", whatStatus) ? "btn-inverse" : "";
  }
});

Template.issueList.events({

});

Template.issueList.helpers({
  issues: function () {
    var selected_pid = Session.get("selected_pid");
    if (!selected_pid) return {};

    var query = {_pid: selected_pid};
    
    var selectedStatusFilter = Session.get("selected_issue_status_filter");
    if (selectedStatusFilter) {
      query.issueStatus = selectedStatusFilter;
    }

    return Issues.find(query, {sort: {issueNumber: 1}});
  }
});

Template.issue.events({
  "click a.issueStatus": function (event) {
    event.preventDefault();
    Session.set("selected_id", this._id);
    Issues.update(Session.get("selected_id"), {$set: {issueStatus: event.currentTarget.getAttribute("data-status")}}, function (error) {
      if (error) {
        toastr.error("The issue was not updated", "Error", defaultToastrOptions);
      }
      else {
        toastr.success("", "Issue updated", defaultToastrOptions);
      }
    });
  },
  "click tr.issue": function (event) {
    if (event.target.nodeName !== "A") {
    var isNull = Session.equals("selected_id", null) ? true : false;
      if (Session.get("selected_id") !== this._id) {
        Session.set("selected_id", this._id);
        if (!isNull) { // Handle issue selection from another issue
          var issue = Issues.findOne(Session.get("selected_id"));
          Meteor.flush();
          if (issue) {
            if (Session.get("debug")) {
              $("#issueInfoUpdate_Issue_id").val(Session.get("selected_id"));
              $("#issueInfoDelete_Issue_id").val(Session.get("selected_id"));
            }
            $("#issueInfoCreate_IssueTitle").val("");
            $("#issueInfoCreate_IssueDescription").val("");
            if (wysihtml5Enabled) {
              if (wysihtml5EditorD) {
                wysihtml5EditorD.clear();
              }
              else if (wysihtml5EditorF) {
                wysihtml5EditorF.clear();
              }
              else {
                $("#issueInfoCreate").find("iframe.wysihtml5-sandbox").contents().find('.wysihtml5-editor').html("");
              }
            }
            $("#issueInfoUpdate_IssueNumber").val(issue.issueNumber);
            $("#issueInfoUpdate_issueCreatedDate").val((new Date(issue.issueCreatedDate)).f("MM/dd/yyyy HH:mm a"));
            $("#issueInfoUpdate_IssueTitle").val(issue.issueTitle);
            $("#issueInfoUpdate_IssueDescription").val(issue.issueDescription);
            if (wysihtml5Enabled) {
              if (wysihtml5EditorE) {
                wysihtml5EditorE.setValue(issue.issueDescription, true);
              }
              else {
                $("#issueInfoUpdate").find("iframe.wysihtml5-sandbox").contents().find('.wysihtml5-editor').html(issue.issueDescription);
              }
            }
            $("#IssueInfoTabs a[href=\"#issueInfoUpdate\"]").tab("show");
          }
        }
        if (matchMedia("only screen and (max-width: 979px)").matches) {
          $.scrollTo($("#issueInfo"), 500, {offset: -10}); // Small screens
        }
        else {
          $.scrollTo($("#issueInfo"), 500, {offset: -51}); // Large screens
        }
      }
      else {
        resetIssue();
      }
    }
  }
});

Template.issue.helpers({
  selectedIssue: function () {
    return Session.equals("selected_id", this._id) ? "selected" : "";
  },
  issueStatusStyle: function () {
    return this ? (this.issueStatus).toLowerCase() : "";
  },
  formatMilliseconds: function (milliseconds) {
    return milliseconds ? (new Date(milliseconds)).f("MM/dd/yyyy HH:mm a") : "";
  }
});

Template.issueInfo.rendered = function() {
  if (Session.get("selected_id")) {
    var issue = Issues.findOne(Session.get("selected_id"));
    Meteor.flush();
    if (issue) {
      if (Session.get("debug")) {
        $("#issueInfoUpdate_Issue_id").val(Session.get("selected_id"));
        $("#issueInfoDelete_Issue_id").val(Session.get("selected_id"));
      }
      $("#issueInfoCreate_IssueTitle").val("");
      $("#issueInfoCreate_IssueDescription").val("");
      if (wysihtml5Enabled && $("#issueInfoCreate_IssueDescription").length) {
        wysihtml5EditorD = new wysihtml5.Editor("issueInfoCreate_IssueDescription", {
          toolbar: "issueInfoCreate_IssueDescriptionToolbar",
          parserRules: wysihtml5ParserRules
        });
        wysihtml5EditorD.on("load", function() {
          if (wysihtml5EditorD) {
            var doc = wysihtml5EditorD.composer.sandbox.getDocument();
            var link = doc.createElement("link");
            link.href = "css/wysiwyg-color.css";
            link.rel = "stylesheet";
            doc.querySelector("head").appendChild(link);
            wysihtml5EditorD.clear();
          }
        });
        wysihtml5EditorD.on("destroy:composer", function() {
          wysihtml5EditorD = null;
        });
      }
      $("#issueInfoUpdate_IssueNumber").val(issue.issueNumber);
      $("#issueInfoUpdate_issueCreatedDate").val((new Date(issue.issueCreatedDate)).f("MM/dd/yyyy HH:mm a"));
      $("#issueInfoUpdate_IssueTitle").val(issue.issueTitle);
      $("#issueInfoUpdate_IssueDescription").val(issue.issueDescription);
      if (wysihtml5Enabled && $("#issueInfoUpdate_IssueDescription").length) {
        wysihtml5EditorE = new wysihtml5.Editor("issueInfoUpdate_IssueDescription", {
          toolbar: "issueInfoUpdate_IssueDescriptionToolbar",
          parserRules: wysihtml5ParserRules
        });
        wysihtml5EditorE.on("load", function() {
          if (wysihtml5EditorE) {
            var doc = wysihtml5EditorE.composer.sandbox.getDocument();
            var link = doc.createElement("link");
            link.href = "css/wysiwyg-color.css";
            link.rel = "stylesheet";
            doc.querySelector("head").appendChild(link);
            wysihtml5EditorE.setValue(issue.issueDescription, true);
          }
        });
        wysihtml5EditorE.on("destroy:composer", function() {
          wysihtml5EditorE = null;
        });
      }
      $("#IssueInfoTabs a[href=\"#issueInfoUpdate\"]").tab("show");
    }
  }
  else {
    Meteor.flush();
    $("#issueInfoCreate_IssueTitle").val("");
    $("#issueInfoCreate_IssueDescription").val("");
    if (wysihtml5Enabled && $("#issueInfoCreate_IssueDescription").length) {
      wysihtml5EditorF = new wysihtml5.Editor("issueInfoCreate_IssueDescription", {
        toolbar: "issueInfoCreate_IssueDescriptionToolbar",
        parserRules: wysihtml5ParserRules
      });
      wysihtml5EditorF.on("load", function() {
        if (wysihtml5EditorF) {
          var doc = wysihtml5EditorF.composer.sandbox.getDocument();
          var link = doc.createElement("link");
          link.href = "css/wysiwyg-color.css";
          link.rel = "stylesheet";
          doc.querySelector("head").appendChild(link);
          wysihtml5EditorF.clear();
        }
      });
      wysihtml5EditorF.on("destroy:composer", function() {
        wysihtml5EditorF = null;
      });
    }
    $("#IssueInfoTabs a[href=\"#issueInfoCreate\"]").tab("show");
  }
  createWaypoints();
};

Template.issueInfo.events({
  "click a.issueStatus": function (event) {
    event.preventDefault();
    Session.set("selected_id", this._id);
    Issues.update(Session.get("selected_id"), {$set: {issueStatus: event.currentTarget.getAttribute("data-status")}}, function (error) {
      if (error) {
        toastr.error("The issue was not updated", "Error", defaultToastrOptions);
      }
      else {
        toastr.success("", "Issue updated", defaultToastrOptions);
      }
    });
  },
  "click #issueInfoCreate_CreateIssue": function (event) {
    if ($("#issueInfoCreate_IssueTitle").val().stripHTML() !== "") {
      var project = Projects.findOne(Session.get("selected_pid"));
      var lastIssueNumber = project.lastIssueNumber;
      var nextIssueNumber = lastIssueNumber + 1;
      var issueTitle = $("#issueInfoCreate_IssueTitle").val().stripHTML();
      var issueDescription = wysihtml5Enabled ? $("#issueInfoCreate_IssueDescription").val() : $("#issueInfoCreate_IssueDescription").val().stripHTML();
      var issueCreatedDate = (new Date()).getTime();
      Projects.update(Session.get("selected_pid"), {$set: {lastIssueNumber: nextIssueNumber}}, function (error) {
        if (error) {
          toastr.error("The issue was not created", "Error", defaultToastrOptions);
        }
        else {
          Issues.insert({_pid: Session.get("selected_pid"), issueNumber: nextIssueNumber, issueTitle: issueTitle, issueDescription: issueDescription, issueStatus: "New", issueCreatedDate: issueCreatedDate}, function (error, result) {
            if (error) {
              toastr.error("The issue was not created", "Error", defaultToastrOptions);
            }
            else {
              Session.set("selected_id", result);
              toastr.success("", "Issue created", defaultToastrOptions);
            }
          });
        }
      });
    }
    else {
      toastr.warning("", "Please enter an issue title", defaultToastrOptions);
    }
  },
  "click #issueInfoCreate_CancelIssue": function (event) {
    $("#issueInfoCreate_IssueTitle").val("");
    $("#issueInfoCreate_IssueDescription").val("");
    if (wysihtml5Enabled) {
      if (wysihtml5EditorD) {
        wysihtml5EditorD.clear();
      }
      else if (wysihtml5EditorF) {
        wysihtml5EditorF.clear();
      }
      else {
        $("#issueInfoCreate").find("iframe.wysihtml5-sandbox").contents().find('.wysihtml5-editor').html("");
      }
    }
  },
  "click #issueInfoUpdate_UpdateIssue": function (event) {
    if (Session.get("selected_id")) {
      if ($("#issueInfoUpdate_IssueTitle").val().stripHTML() !== "") {
        var issueTitle = $("#issueInfoUpdate_IssueTitle").val().stripHTML();
        var issueDescription = wysihtml5Enabled ? $("#issueInfoUpdate_IssueDescription").val() : $("#issueInfoUpdate_IssueDescription").val().stripHTML();
        Issues.update(Session.get("selected_id"), {$set: {issueTitle: issueTitle, issueDescription: issueDescription}}, function (error) {
          if (error) {
            toastr.error("The issue was not updated", "Error", defaultToastrOptions);
          }
          else {
            toastr.success("", "Issue updated", defaultToastrOptions);
          }
        });
      }
      else {
        toastr.warning("", "Please enter an issue title", defaultToastrOptions);
      }
    }
  },
  "click #issueInfoUpdate_CancelIssue": function (event) {
    resetIssue();
    $("#IssueInfoTabs a[href=\"#issueInfoCreate\"]").tab("show");
  },
  "click #issueInfoDelete_DeleteIssue": function (event) {
    if (Session.get("selected_id")) {
      $.blockUI();
      var $toast = toastr.error("", "<div><button type=\"button\" id=\"deleteIssueYesBtn\" class=\"btn btn-primary\">Yes</button><button type=\"button\" id=\"deleteIssueNoBtn\" class=\"btn\" style=\"margin: 0 8px 0 8px\">No</button> Delete Issue?</div>", confirmToastrOptions);
      if ($toast.find("#deleteIssueYesBtn").length) {
        $toast.delegate("#deleteIssueYesBtn", "click", function () {
          Issues.remove({_id: Session.get("selected_id")}, function (error) {
            if (error) {
              toastr.error("The issue was not deleted", "Error", defaultToastrOptions);
            }
            else {
              toastr.success("", "Issue deleted", defaultToastrOptions);
              resetIssue();
              $.unblockUI();
              $toast.remove();
            }
          });
        });
      }
      if ($toast.find("#deleteIssueNoBtn").length) {
        $toast.delegate("#deleteIssueNoBtn", "click", function () {
          $.unblockUI();
          $toast.remove();
          $("#IssueInfoTabs a[href=\"#issueInfoUpdate\"]").tab("show");
        });
      }
    }
  }
});

Template.issueInfo.helpers({
  issue: function () {
    var issue = Issues.findOne(Session.get("selected_id"));
    return issue ? issue : {};
  },
  issueStatusStyle: function () {
    var issue = Issues.findOne(Session.get("selected_id"));
    return issue ? (issue.issueStatus).toLowerCase() : "";
  },
  formatMilliseconds: function (milliseconds) {
    return milliseconds ? (new Date(milliseconds)).f("MM/dd/yyyy HH:mm a") : "";
  }
});

Template.userList.rendered = function() {

};

Template.userList.events({

});

Template.userList.helpers({
  users: function () {
    return Meteor.users.find({}, {sort: {"emails.0.address": 1}});
  }
});

Template.user.rendered = function() {

};

Template.user.events({
  "click a.role": function (event) {
    event.preventDefault();
    Meteor.users.update(this._id, {$set: {role:event.target.text}}, function (error) {
      if (error) {
        toastr.error("That action is not allowed", "Error", defaultToastrOptions);
      }
    });
  }
});

Template.user.helpers({
  email: function () {
    return this.emails[0].address ? this.emails[0].address : "";
  }
});

Template.wysihtml5Toolbar.rendered = function() {

};

Template.wysihtml5Toolbar.events({

});

Template.wysihtml5Toolbar.helpers({

});
// Templates ------------------------------------------------------------

// Functions ------------------------------------------------------------
function createWaypoints() {
    $.waypoints("destroy");
    if ($("#issueInfo").length) {
      $("#issueInfo").removeClass("stuck");
      // If there is not enough vertical height to display all of #issueInfo, then we will not attach a waypoint
      var screenMatch = "only screen and (min-width: 768px) and (min-height: " + ($("#issueInfo").height() + 61) + "px)";
      if (matchMedia(screenMatch).matches) {
        $("#issueInfo").waypoint("sticky");
      }
    }
};

function resetProject() {
  Session.set("selected_pid", null);
};

function resetIssue() {
  Session.set("selected_id", null);
};
// Functions ------------------------------------------------------------

// Prototypes -----------------------------------------------------------
String.prototype.stripHTML = function() {
  exp = new RegExp("<(?:.|\s)*?>", "gi");
  return this.replace(exp, "");
};
// Prototypes -----------------------------------------------------------

