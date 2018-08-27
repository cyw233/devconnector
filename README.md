# Introduction
A **MERN stack** website built with MongoDB, Express.js, React.js and Node.js, which is mainly for connecting developers and allowing them to share their experiences and productions.

You can simply click [here](https://intense-hollows-93015.herokuapp.com/) to view the website. This app is deployed using [Heroku](http://www.heroku.com/) and the database of this app is managed by [mLab](https://www.mlab.com)

# Usage

1. Clone or download this repo.

2. Create a file called *keys_dev.js* in the *config* folder, and add following code:

   ```
   module.exports = {
     mongoURI: <YOUR_OWN_MONGODB_URI>,
     secretOrKey: <YOUR_OWN_SECRET>
   };
   ```

3. Make sure you have [Node.js](https://nodejs.org/en/) installed  

4. Run the following commands to install required library packages and start the app

   ```
   # Install dependencies for server
   $ npm install
   
   # Install dependencies for client
   $ npm run client-install
   
   # Run the client & server with "concurrently" library
   $ npm run dev
   ```

# Functions

**1. Authenticate**

Users can Sign up or Login by clicking buttons on the navbar or on the landing page. Only users that have signed in can view the public Post Feed and use his/her own Dashboard. When Signing up, if users want a profile image, they can use a Gravatar email.

**2. Developers profiles**

Users can view all the developer profiles with no need to login by clicking the _Developers_ button on the navbar. If they are interested in someone's profile, they can clcik *View Profile* button on some profile to view the detailed information.

**3. Dashboard**

After Login, users can create/edit the Profile, add/delete experiences and add/delete educations on the Dashboard.

**4. Personal Profile**

After Login, new users can create their own Profile including a handle, status, company, website, social networks and etc. If users want to show their latest Github repos, they can fill in their GIthub username in the corresponding input field, then the app will automatically retrieve 5 latest repos and listed in the personal profile page. Users can edit their profile later. The profile will be listed in the public profiles page and can be viewed by all users.

**5. Add Experience**

After Login, users can add experience by clicking _Add Experience_ button on the dashboard.

**6. Add Education**

After Login, users can add education by clicking _Add Education_ button on the dashboard.

**7. Post Feed**

After Login, users can click *Post Feed* button on the navbar to view all the posts submitted by other developers. Users can create/delete their own posts,  like/unlike other developers' posts and also comment on posts.

**8. Logout**

Users can also logout after Login.













