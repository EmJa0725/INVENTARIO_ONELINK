const express = require('express');
const router = express.Router();
const passport = require('passport')
const { isLoggedIn, protectIndex} = require('../lib/auth');
const db = require('../database');


router.get('/signin',protectIndex, (req,res) =>{
    res.render('auth/signin')
});

router.get('/signup', (req,res) =>{
    res.render('auth/signup')
});

// router.post('/signup', (req,res) =>{
//     passport.authenticate('local.signup',{
//         SuccessRedirect: '/profile',
//         failureRedirect: '/signup',
//         failureFlash: true
//     });
//     res.send('Received');
// });

router.post('/signup',passport.authenticate('local.signup', {
    successRedirect: '/signin',
    failureRedirect: '/signup',
    failureFlash: true
}));


// router.post('/signin', (req,res,next) => {
//     passport.authenticate('local.signin',{
//         successRedirect: '/indexInventario',
//         failureRedirect: '/signin',
//         failureFlash: true
//     })(req,res,next);    
// });

router.post('/signin', function(req, res, next) {
    passport.authenticate('local.signin', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/signin'); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        if(user.TipoEmpleado == 'ADMINISTRADOR'){
            return res.redirect('/indexAdministrador');
        }
        else if(user.TipoEmpleado == 'COMPRAS'){
            return res.redirect('/indexCompras');
        }
        else if(user.TipoEmpleado == 'INVENTARIO'){
            return res.redirect('/indexInventario');
        }
      });
    })(req, res, next);
  });


router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

router.get('/indexAdministrador', isLoggedIn ,async(req,res) =>{
    const CountStaffQuery = await db.query("SELECT COUNT(IdEmpleado) AS count from empleado;");
    CountStaff = CountStaffQuery[0].count;
    res.render('indexAdministrador',{CountStaff});    
});

router.get('/indexInventario', isLoggedIn, (req,res) =>{
    res.render('indexInventario');
    
});

router.get('/indexCompras', isLoggedIn, (req,res) =>{
    res.render('indexCompras');
});


module.exports = router;
