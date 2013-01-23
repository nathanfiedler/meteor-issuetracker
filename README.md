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
* In `server/config.js` and `server/api.js`, you may want to change the default variable values for your project.

* When you login with a new user account, you won't have any projects to access, and your role will be "user" (which prohibits you from assigning project users and project creation, updates and deletion).

  Logout and login with the admin account (the default account is admin@domain.com/123456), click on the Users tab in the top nav bar, and change your (or anybody else's) role to "admin".

* Look in the 'tests/api' directory for the API tester! Change `localhost:3000` to `issuetracker.meteor.com` to perform actions on the demo below!


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