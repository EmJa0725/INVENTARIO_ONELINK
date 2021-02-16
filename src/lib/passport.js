const { decodeBase64 } = require('bcryptjs');
const passport = require('passport');
//Strategia de Registro, en este caso usuario y contraseña
const LocalStrategy = require('passport-local').Strategy; 

const db = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req,username,password,done)=>{
    const rows = await db.query('SELECT * FROM Empleado WHERE Username = ?',[username]);
    try{
        if(rows[0].IdEmpleado != undefined){ //user found
            console.log('User found');   
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password,user.Password)
            if(validPassword){
                done(null,user,req.flash('success', 'Bienvenido ' + user.Username));
            }else{
                done(null,false, req.flash('message','Contraseña incorrecta'));           
            }
        }
    }catch(e){
        console.log('User not found');  
        done(null,false, req.flash('message', 'Usuario no existe'));    
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password,done)=>{
    const { idArea } = req.body;
    const newUser = {
        idArea,
        username,
        password
    }; 
    //newUser.password = await helpers.encryptPassword(password); 
    const result = await db.query('INSERT INTO Empleado(FoArea,Username,Password) VALUES(?,?,sha1(?))', Object.values(newUser));
    //console.log(result);
    newUser.IdEmpleado = result.insertId;
    return done(null,newUser)
}));

// Save user into session 
passport.serializeUser((user,done)=>{
    done(null,user.IdEmpleado);
});

passport.deserializeUser(async(id,done) =>{
    //console.log(id);
    const rows = await db.query('SELECT * FROM Empleado WHERE IdEmpleado= ?', [id]);
    done(null,rows[0]);
});

