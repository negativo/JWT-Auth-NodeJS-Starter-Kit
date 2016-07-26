# Simple Node JWT-Token Authentication starter kit.

![alt tag](http://i.imgur.com/vlLzUe4.gif)


This repo uses JSON Web Tokens and the [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) package to implement token based authentication on a simple Node.js API with a MongoDB Database.

This is a starting point to have an API up and running in notime.


##Installation

This project needs NodeJS > v5.0.0, MongoDB and `forever` to manage the process.

- clone the project `git clone git@github.com:negativo/JWT-Auth-NodeJS-Starter-Kit`
- run `npm install` 
- run `mongod`
- edit `.env.example` and save it as `.env`
- npm start
- npm test

##API

###Setup test user

To setup an admin user edit your `.env` file and request the url  `http://localhost:8282/setup` 

`curl http://localhost:8282/setup`

###Authenticate

To authenticate a user do POST request to http://localhost:8282/auth
with the `name` and the `password` in the body

	{
		name:"jwtauth",
		password:"jwtauth"

	}


`curl -H "Content-Type: application/json" -X POST -d '{ "name":"jwtauth","password":"jwtauth"}' http://localhost:8282/api/auth`

