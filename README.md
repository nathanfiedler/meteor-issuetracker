meteor-issuetracker
===================


An issue tracking web app built with Meteor


Built With
-------------------
* Meteor -- http://www.meteor.com
* jQuery -- http://jquery.com
* Bootstrap -- http://twitter.github.com/bootstrap
* Font Awesome -- http://fortawesome.github.com/Font-Awesome
* jQuery BlockUI -- http://jquery.malsup.com/block
* jQuery ScrollTo -- http://flesler.blogspot.com/2007/10/jqueryscrollto.html
* jQuery Waypoints with Sticky Elements extension -- http://imakewebthings.com/jquery-waypoints
* toastr -- https://github.com/CodeSeven/toastr
* wysihtml5 -- http://xing.github.com/wysihtml5
* "f" is for Format & WHAT THE diff?? -- http://fisforformat.sourceforge.net  


Notes
-------------------
* In `server/config.js` and `server/api.js`, you may want to change the default variable values for your project.

* When you create and login as a new user, you are not allowed to contribute to any available projects, nor are you allowed to create projects. This is by design.

  Logout and login with an admin account (the email and password for the default admin account is **admin@domain.com** / **123456**), and...
  
  1. Give yourself an "admin" role; select the Users tab in the top nav bar, and change your (or anybody else's) role to "admin". Or...
  2. Assign yourself as a contributor to an existing project; select a project from the project list, select on the Users tab in the project nav bar, and select the checkbox next to your (or anybody else's) email/account. Or...
  3. Do both 1 and 2.

* To disable the wysihtml5 editor, set `wysihtml5Enabled` to `false` in `client/client.js`.

* Includes a simple API using RESTful GET! Look in the 'tests/api-tests' directory for two examples on how to interact with it. Change `localhost:3000` to `issuetracker.meteor.com` in the Meteor URL text field to perform actions on the demo below!


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