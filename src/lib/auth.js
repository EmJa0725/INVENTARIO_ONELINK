const express = require('express');


module.exports = {
    isLoggedIn(req,res,next){
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    },

    protectIndex(req,res,next){
        const user = req.user;
        if (!req.isAuthenticated()){            
            return next();
        } 
        if (user.TipoEmpleado == 'INVENTARIO'){
            return res.redirect('/indexInventario')
        }  
        else if (user.TipoEmpleado == 'COMPRAS'){
            return res.redirect('/indexCompras')
        }  
        else if (user.TipoEmpleado == 'ADMINISTRADOR'){
            return res.redirect('/indexAdministrador')
        }  
    },
}