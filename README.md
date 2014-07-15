     __                                               
    /\ \       __                                     
    \ \ \     /\_\    ___      __   __  __     __     
     \ \ \  __\/\ \ /' _ `\  /'_ `\/\ \/\ \  /'__`\   
      \ \ \L\ \\ \ \/\ \/\ \/\ \L\ \ \ \_\ \/\ \L\.\_ 
       \ \____/ \ \_\ \_\ \_\ \____ \ \____/\ \__/.\_\
        \/___/   \/_/\/_/\/_/\/___L\ \/___/  \/__/\/_/
                               /\____/                
                               \_/__/                 
                                                      
==================

### Setup ###
* install NodeJS and MongoDB.
* install dependencies: run ```npm install```

### Seed data ###
Empty all collections
```
  grunt db-reset
```
Seed sample data
```
  grunt db-seed
```
### Start server ###
* Start mongoDB server: run ```mongod```
* Start server: run ```node app.js```
* Start server with Nodemon (for development): run ```npm start```

### Note for developers ###
If you reinstall the dependencies from package.json, you will need to update the following function in node_modules/node-oauth2-server/lib/grant.js
```javascript
function usePasswordGrant (done) {
  var uname = this.req.body.username,
    pword = this.req.body.password,
    fbtoken = this.req.body.facebook_token;
  if ((!uname || !pword) && !fbtoken) {
    return done(error('invalid_client',
      'Missing parameters. "username" and "password", or "facebook_token" are required'));
  }

  var self = this;
  return this.model.getUser(uname, pword, fbtoken, function (err, user) {
    if (err) return done(error('server_error', false, err));
    if (!user) {
      return done(error('invalid_grant', 'User credentials are invalid'));
    }

    self.user = user;
    done();
  });
}
```
