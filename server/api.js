// You may want to change these variable values for your project
var apiEnabled = true;
var apiAuthToken = "B6D49B2D0F2F16C2";
// -------------------------------------------------------------

var fibers = __meteor_bootstrap__.require("fibers");
var connect = __meteor_bootstrap__.require("connect");
var url = __meteor_bootstrap__.require("url");
var app = __meteor_bootstrap__.app;

var router = connect.middleware.router(function(route) {
  route.get("/api/"+apiAuthToken, function(req, res, next) {
    var fn = Fiber(function() {
      try {
        var _fiber = Fiber.current;
        var _url = url.parse(req.url, true);
        
        var adminUser;
        var cursor;
        var documents = [];
        var insert_id;
        var issue;
        var issues;
        var lastIssueNumber;
        var nextIssueNumber;
        var project;
        
        res.setHeader("Access-Control-Allow-Origin", "*");
        //res.setHeader("Access-Control-Allow-Origin", "http://www.yoursite.com");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Accept, Cache-Control, Connection, Content-Type, Host, Origin, Referer, User-Agent, X-Requested-With");
        res.setHeader("Content-Type", "text/plain");
        
        if (_url.query["action"] && _url.query["collection"]) {
          switch (_url.query["action"].toLowerCase()) {
            case "find":
              switch (_url.query["collection"].toLowerCase()) {
                case "projects":
                  cursor = Projects.find();
                  break;
                case "issues":
                  cursor = Issues.find();
                  break;
                default:
                  // ERROR: COLLECTION NOT SUPPORTED
                  console.log(JSON.stringify([{error:"COLLECTION NOT SUPPORTED"}]));
                  res.statusCode = 501;
                  res.write(JSON.stringify([{error:"COLLECTION NOT SUPPORTED"}]));
                  res.end();
                  return;
              }
              if (cursor) {
                cursor.forEach(function(document) {
                  documents.push(document);
                });
                res.statusCode = 200;
                res.write(JSON.stringify(documents));
                res.end();
                return;
              }
              else {
                  // ERROR: COLLECTION NOT FOUND
                  console.log(JSON.stringify([{error:"COLLECTION NOT FOUND"}]));
                  res.statusCode = 404;
                  res.write(JSON.stringify([{error:"COLLECTION NOT FOUND"}]));
                  res.end();
                  return;
              }
              break;
            case "insert":
              if (_url.query["title"].stripHTML()) {
                switch (_url.query["collection"].toLowerCase()) {
                  case "projects":
                    adminUser = Meteor.users.findOne({"emails.0.address": adminEmail});
                    insert_id = Projects.insert({projectTitle: _url.query["title"].stripHTML(), projectDescription: _url.query["description"].sanitizeHTML(), projectCreatedDate: ((new Date()).getTime()), lastIssueNumber: 0, users: [{_id: adminUser._id}]});
                    cursor = Projects.find({_id: insert_id});
                    break;
                  case "issues":
                    if (_url.query["_id"]) {
                      project = Projects.findOne(_url.query["_id"]);
                      if (project) {
                        lastIssueNumber = project.lastIssueNumber;
                        nextIssueNumber = lastIssueNumber + 1;
                        insert_id = Issues.insert({_pid: _url.query["_id"], issueNumber: nextIssueNumber, issueTitle: _url.query["title"].stripHTML(), issueDescription: _url.query["description"].sanitizeHTML(), issueStatus: "New", issueCreatedDate: ((new Date()).getTime())});
                        if (insert_id) {
                          Projects.update(_url.query["_id"], {$set: {lastIssueNumber: nextIssueNumber}});
                        }
                        else {
                            // ERROR: DOCUMENT NOT INSERTED
                            console.log(JSON.stringify([{error:"DOCUMENT NOT INSERTED"}]));
                            res.statusCode = 501;
                            res.write(JSON.stringify([{error:"DOCUMENT NOT INSERTED"}]));
                            res.end();
                            return;
                        }
                        cursor = Issues.find({_id: insert_id});
                        break;
                      }
                      else {
                        // ERROR: DOCUMENT NOT FOUND
                        console.log(JSON.stringify([{error:"DOCUMENT NOT FOUND"}]));
                        res.statusCode = 404;
                        res.write(JSON.stringify([{error:"DOCUMENT NOT FOUND"}]));
                        res.end();
                        return;
                      }
                    }
                    else {
                      // ERROR: ID IS REQUIRED FOR INSERT
                      console.log(JSON.stringify([{error:"ID IS REQUIRED FOR INSERT"}]));
                      res.statusCode = 501;
                      res.write(JSON.stringify([{error:"ID IS REQUIRED FOR INSERT"}]));
                      res.end();
                      return;
                    }
                    break;
                  default:
                    // ERROR: COLLECTION NOT SUPPORTED
                    console.log(JSON.stringify([{error:"COLLECTION NOT SUPPORTED"}]));
                    res.statusCode = 501;
                    res.write(JSON.stringify([{error:"COLLECTION NOT SUPPORTED"}]));
                    res.end();
                    return;
                }
                if (cursor) {
                  cursor.forEach(function(document) {
                    documents.push(document);
                  });
                  res.statusCode = 200;
                  res.write(JSON.stringify(documents));
                  res.end();
                  return;
                }
                else {
                    // ERROR: DOCUMENT NOT INSERTED
                    console.log(JSON.stringify([{error:"DOCUMENT NOT INSERTED"}]));
                    res.statusCode = 501;
                    res.write(JSON.stringify([{error:"DOCUMENT NOT INSERTED"}]));
                    res.end();
                    return;
                }
              }
              else {
                // ERROR: TITLE IS REQUIRED FOR INSERT
                console.log(JSON.stringify([{error:"TITLE IS REQUIRED FOR INSERT"}]));
                res.statusCode = 501;
                res.write(JSON.stringify([{error:"TITLE IS REQUIRED FOR INSERT"}]));
                res.end();
                return;
              }
              break;
            case "remove":
              if (_url.query["_id"]) {
                switch (_url.query["collection"].toLowerCase()) {
                  case "projects":
                    project = Projects.findOne(_url.query["_id"]);
                    if (project) {
                      issues = Issues.find({_pid: _url.query["_id"]});
                      issues.forEach(function(document) {
                        Issues.remove({_id: document._id});
                      });
                      Projects.remove({_id: _url.query["_id"]});
                      break;
                    }
                    else {
                      // ERROR: DOCUMENT NOT FOUND
                      console.log(JSON.stringify([{error:"DOCUMENT NOT FOUND"}]));
                      res.statusCode = 404;
                      res.write(JSON.stringify([{error:"DOCUMENT NOT FOUND"}]));
                      res.end();
                      return;
                    }
                    break;
                  case "issues":
                    issue = Issues.findOne(_url.query["_id"]);
                    if (issue) {
                      Issues.remove({_id: _url.query["_id"]});
                      break;
                    }
                    else {
                      // ERROR: DOCUMENT NOT FOUND
                      console.log(JSON.stringify([{error:"DOCUMENT NOT FOUND"}]));
                      res.statusCode = 404;
                      res.write(JSON.stringify([{error:"DOCUMENT NOT FOUND"}]));
                      res.end();
                      return;
                    }
                    break;
                  default:
                    // ERROR: COLLECTION NOT SUPPORTED
                    console.log(JSON.stringify([{error:"COLLECTION NOT SUPPORTED"}]));
                    res.statusCode = 501;
                    res.write(JSON.stringify([{error:"COLLECTION NOT SUPPORTED"}]));
                    res.end();
                    return;
                }
                res.statusCode = 200;
                res.write(JSON.stringify([{status:"SUCCESS"}]));
                res.end();
                return;
              }
              else {
                // ERROR: ID IS REQUIRED FOR REMOVE
                console.log(JSON.stringify([{error:"ID IS REQUIRED FOR REMOVE"}]));
                res.statusCode = 501;
                res.write(JSON.stringify([{error:"ID IS REQUIRED FOR REMOVE"}]));
                res.end();
                return;
              }
              break;
            default:
              // ERROR: ACTION NOT SUPPORTED
              console.log(JSON.stringify([{error:"ACTION NOT SUPPORTED"}]));
              res.statusCode = 501;
              res.write(JSON.stringify([{error:"ACTION NOT SUPPORTED"}]));
              res.end();
              return;
          }
        }
        else {
          // ERROR: ACTION AND COLLECTION REQUIRED
          console.log(JSON.stringify([{error:"ACTION AND COLLECTION REQUIRED"}]));
          res.statusCode = 501;
          res.write(JSON.stringify([{error:"ACTION AND COLLECTION REQUIRED"}]));
          res.end();
          return;
        }
      }
      catch (e) {
        // ERROR: INTERNAL SERVER ERROR
        console.log(JSON.stringify([{error:"INTERNAL SERVER ERROR"}]));
        res.statusCode = 500;
        res.write(JSON.stringify([{error:"INTERNAL SERVER ERROR"}]));
        res.end();
        return;
      }
    }).run();
    //return next();
    return;
  });
  return;
});

String.prototype.sanitizeHTML = function (white, black) {
  if (!white) white = "b|strong|i|em|u|p|br|ul|ol|li|blockquote"; // Default elements allowed
  if (!black) black = "script|object|embed"; // Default elements not allowed
  exp = new RegExp("(<(" + black + ")[^>]*>.*</\\2>|(?!<[/]?(" + white + ")(\\s[^<]*>|[/]>|>))<[^<>]*>|(?!<[^<>\\s]+)\\s[^</>]+(?=[/>]))", "gi");
  return this.replace(exp, "");
};

String.prototype.stripHTML = function() {
  exp = new RegExp("<(?:.|\s)*?>", "gi");
  return this.replace(exp, "");
};

if (apiEnabled) app.use(router);