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
