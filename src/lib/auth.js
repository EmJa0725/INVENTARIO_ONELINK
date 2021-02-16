const express = require('express');

module.exports = {
    isLoggedIn(req,res,next){
        if (req.isAuthenticated()) {
            // console.log(req.url);
            return next();
        }
        return res.redirect('/signin');
    },

    protectIndex(req, res, next) {
        try {
            var url = req.protocol + '://' + req.get('host') + req.originalUrl;
            console.log(url);
            const user = req.user;
            // if (!req.isAuthenticated()){            
            //     return next();
            // } 
            if (user.TipoEmpleado == 'INVENTARIO' && !url.includes("Inventario")) {
                return res.redirect('/indexInventario');
            }
            else if (user.TipoEmpleado == 'COMPRAS' && !url.includes("Compras")) {
                return res.redirect('/indexCompras');
            }
            else if (user.TipoEmpleado == 'ADMINISTRADOR' && !url.includes("Administrador")) {
                return res.redirect('/indexAdministrador');
            }
            return next();

        } catch (error) {
            return next();
        }
    },
}