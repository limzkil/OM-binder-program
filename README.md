# OUT Maine Binder Program Application

## Scripts

Run `npm start` and `node server.js` in two seperate terminals in top level of repository for working locally within the `working-localhost` branch. `Main` houses Heroku production build.

## Purpose

Green-field software application created to automate and streamline the process of chest
binder distribution after LGBTQ non-profit experienced significant increase in requests. Limited development time.

### Technologies Utilized

#### Database
* MongoDB - Granular control and information handled fits document form.
* Mongoose - Collection validation and schema constraint.

#### Server
* NodeJS - Asynchronous handling of connection requests, access to package manager.
* Express - Reduces server development time via reducing LOC written.
* Axios - Reduces LOC written while improving functionality of XML/HTTP requests.

#### Security
* Passport - Authentication strategy utilizing JSON web tokens.
* JWT - JSON web token to hold valid user information; stored in a cookie.
* JS Cookie - Front-end cookie access.
* Cookie-Parser - Serverside cookie access.

#### Email Service
* Nodemailer/Mailgun-Transport - NodeJS module to handle email transactions; additional module for utilizing Mailgun.

#### Front-End

* React - Ideal for rapid development; flexible and low barrier to utilization.
* React-Router - Allows for single page site that dynamically renders components dependant on URL route.
* Material-UI - Ideal for rapid development of complex, beautiful interfaces. 
* Material-UI-Image; Material-Table - Additional libraries written in same style language.
*Validator - Library specific to reducing LOC written for user input validation.

---
documentation authored by limzkil/Julie Assur

---    
