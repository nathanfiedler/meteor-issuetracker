meteor-issuetracker
===================


An issue tracking web app built with Meteor


Built With
-------------------
* Meteor -- http://www.meteor.com
* jQuery -- http://jquery.com
* Bootstrap -- http://twitter.github.com/bootstrap
* jQuery BlockUI -- http://jquery.malsup.com/block
* jQuery ScrollTo -- http://flesler.blogspot.com/2007/10/jqueryscrollto.html
* jQuery Waypoints with Sticky Elements extension -- http://imakewebthings.com/jquery-waypoints
* toastr -- https://github.com/CodeSeven/toastr
* "f" is for Format & WHAT THE diff?? -- http://fisforformat.sourceforge.net  


Notes
-------------------
* In `server/api.js`, you may want to change the authToken string (line 6) to another random string or password. If you don't, you may get CRUD operations from unwanted guests! Alternatively, you can just comment out `app.use(router);` at the very bottom to disable the API.
* When you login (i.e. create an account) as a new user, your default role will be "user", which will limit your functionality at the Project level (creating, updating and deleting). Login with the pre-made admin account "admin@domain.com/123456", click on the Users tab at the top, and give yourself (or whoever) an "admin" role.
* Change the pre-made admin account in `server/server.js` and `server/publish.js` for your instance (if you need to).
* Look in the 'tests/api' directory for the API tester! Change `localhost:3000` to `issuetracker.meteor.com` for added fun!


Setup
-------------------
1. Install Meteor  
Linux: http://docs.meteor.com/#quickstart  
Windows: http://win.meteor.com/  

2. Clone this repository  
      `$ git clone git://github.com/nathan-j-fiedler/meteor-issuetracker.git`  

3. Go to the new directory you just cloned/created  
      `$ cd meteor-issuetracker`  

4. Run Meteor  
      `$ meteor`  

5. Open browser to `http://localhost:3000`  


Demo
-------------------
http://issuetracker.meteor.com