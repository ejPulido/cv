const bcrypt = require('bcrypt')
const connection = require("../connection/connection")
const controllers = {}
const session = require('express-session')


controllers.home = function (req, res) {
    let title = ""
    if(req.session.loggedin === undefined) { req.session.loggedin = false}
    if (req.session.loggedin === true){
        res.render('index',{title, logged: req.session.loggedin, nameUser: req.session.name });
    }
    else{
        res.render('login',{clases: '', contenido: '', logged: req.session.loggedin})
    }
  }


controllers.register = function(req,res){
    if(req.session.loggedin === undefined) { req.session.loggedin = false}
    console.log(req.session.loggedin) 
    if(req.session.loggedin === false){
        res.render('register',{clases: '', contenido: '', logged: req.session.loggedin})
    }
    else{
        res.redirect('/');

    }
        
}


controllers.registerPost = function(req,res){    
       const data = req.body

    bcrypt.hash(data.password, 12,function(err, hash){ 
        data.password = hash

         connection.query(`SELECT * from usuarios where email = '${data.email}';`,
            function(result,fields){
                if(fields.length > 0){
                    console.log('ya existe')
                    const contenido ='> Ya existe una cuenta con el correo electrónico ingresado'
                    res.render('register',{clases: 'class = msg', contenido: contenido, logged: req.session.loggedin})
                }
                else{
                    connection.query(`INSERT INTO usuarios(name, lastName, userName, email, password ) Values ('${data.name}','${data.lastName}', '${data.userName}', '${data.email}', '${data.password}');`,
            function(err, result, fields){
                console.log('result conectado', result)
                res.redirect('/login')
            }
            )
                }
            })

        
        console.log('data', data)

        
    })
}

controllers.login = function(req,res){
    if(req.session.loggedin === undefined) { req.session.loggedin = false}
    if(req.session.loggedin === false){
        res.render('login',{clases: '', contenido: '', logged: req.session.loggedin })

    }
    else{
        res.render('index',{title, logged: req.session.loggedin, nameUser: req.session.name });

    }
}

controllers.loginPost = function(req, res){
    const data = req.body
 connection.query(`SELECT * from usuarios where email = '${data.email}';`,
            function(result,fields){
                console.log('fields', fields[0])
                if (fields.length > 0){
                    bcrypt.compare( data.password, fields[0].password,(err,match)=>{
                            console.log('', match)
                            console.log('err', err)

                            if(match){
                                
                                req.session.loggedin = true;
                                req.session.name = fields[0].name
                                res.redirect('/')   
                            }
                            else{
                                 const contenido = 'Contraseña incorrecta'
                                    res.render('login',{clases: 'class = msg', contenido: contenido, logged: req.session.loggedin})
                                
                            }

                        })
                }
                else{
                    console.log('el usuario no existe')
                    const contenido = 'El usuario no está registrado'
                    res.render('login',{clases: 'class = msg', contenido: contenido, logged: req.session.loggedin})
                                
                }
            })
    console.log(req.body)
}


controllers.logout = function(req, res){
    if(req.session.loggedin === true){
        req.session.destroy();
    }

       res.redirect('/login')
}


module.exports = controllers