const express = require('express')
const { engine } = require('express-handlebars')
const myConnection = require('express-myconnection')
const session = require('express-session')
const bodyParser = require('body-parser')
const connection = require("./connection/connection")
const app = express()
const routes = require("./routes/routes.js")
let port = process.env.PORT || '5000';


app.use(session({ 
	secret: 'secreto',
	resave: true,
	saveUninitialized: true
})) 


app.set("view engine", "ejs")
app.set("views", "src/views/pages")

app.use(bodyParser.urlencoded({
	extended: true,
}))


app.use(express.static("src/assets"))
app.use(routes)

 
 
app.listen(port, (req, res)=>{
	console.log('server run in port 8000')
})