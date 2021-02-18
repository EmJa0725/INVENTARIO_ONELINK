//Methods 
const bcrypt = require('bcryptjs');
const sha1 = require('js-sha1');

const helpers = {};

// helpers.encryptPassword = async (password) =>{
//     const salt = await bcrypt.genSalt();
//     const hash = bcrypt.hash(password,salt);
//     return hash;
// };

helpers.matchPassword = async(password,savedPassword) =>{
    try{
        var hash = await sha1(password);
        if(hash == savedPassword){
            return await true;
        }
        else{
            return await false;
        }
    }catch(e){
        console.log(e);
    }
}    

helpers.calcularEdad= (fNacimiento) =>{   
    //var fecha = document.getElementById("fNacimiento").value;
    var fecha_Nacimiento = new Date(fNacimiento);
    var fecha_Hoy = new Date();


    var fechaInicio = fecha_Nacimiento.getTime();
    var fechaFin = fecha_Hoy.getTime();
    var diff = fechaFin - fechaInicio;

    edad = Math.floor((diff / (1000 * 60 * 60 * 24)) / 365); 
    
    return edad;
};

helpers.verifyEncripted = async(password) =>{
    if (password.length > 20){        
        return await true;
    }
    return await false;
};

helpers.recoverPassword = async(username) => {
    var random = Math.floor(Math.random() * 99999) + 10000  
    newPassword= username + random;
    return await newPassword; 
} 

module.exports = helpers;