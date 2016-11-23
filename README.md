# Simple Node JWT-Token Authentication starter kit.

![alt tag](http://i.imgur.com/vlLzUe4.gif)


This repo uses JSON Web Tokens and the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package to implement token based authentication on a simple Node.js API with a MongoDB Database.

This is a starting point to have an API up and running in notime.

The Api Features:

	- JWT Auth Token
	- Separate .env file
	- User Management

##Installation

This project needs NodeJS > v6.9.0, MongoDB and `forever` to manage the process.

- clone the project `git clone git@github.com:negativo/JWT-Auth-NodeJS-Starter-Kit`
- run `npm install`
- run `mongod`
- edit `.env` and save it as `.env`
- edit `.env.production` for production
- `npm start`
- `npm test`

##API

###Setup test user

`curl -X POST -H 'Content-Type: application/json' -d '{"username":"admin","password":"password", "email": "email@example.com"}' http://localhost:8181/setup`

###Versioning

###Authenticate

To authenticate a user do a POST request to http://localhost:8181/api/user/auth
with the `email` and the `password` in the body

	{
		email:"jwtauth",
		password:"jwtauth"

	}
