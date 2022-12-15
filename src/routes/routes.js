const express = require('express');
const routes = express.Router();
const controllers = require("../controllers/controller")


routes.get('/', controllers.home)

routes.get('/register', controllers.register )
routes.post('/register', controllers.registerPost )

routes.get('/login', controllers.login)
routes.post('/login', controllers.loginPost)  

routes.get('/logout', controllers.logout)

module.exports = routes