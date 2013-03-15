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


Compatibility
-------------------
Meteor 0.5.7+  


Notes
-------------------
* In `server/config.js` and `server/api.js`, you may want to change the default variable values for your project.

* When you create a new user and login, you are not allowed to contribute to any available projects, nor are you allowed to create projects. This is by design.

  Logout and login with an admin account (the email and password for the default admin account is **admin@example.com** / **123456**), and...
  
    * Give yourself an "admin" role; select the Users tab in the top navigation bar, and change your (or anybody else's) user account role to "admin". Or...
    * Assign yourself as a contributor to an existing project; select a project from the project list, select on the Users tab in the project navigation bar, and select the checkbox next to your (or anybody else's) user account. Or...
    * Do both of the above steps.  
  
  Logout and login with your user account again and you will have the appropriate permissions.

* To disable the wysihtml5 editor, set `wysihtml5Enabled` to `false` in `client/client.js`.

* Includes a simple API using RESTful GET! Look in the `tests/api-tests` directory for two examples on how to interact with it. In the `html_and_jquery` test package, change `localhost:3000` to `issuetracker.meteor.com` in the Meteor URL text field to perform actions on the hosted demo below!


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


Copyright and License
-------------------
The MIT License (MIT)

Copyright (c) 2013 Nathan Fiedler | nathan(dot)j(dot)fiedler(at)gmail(dot)com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.