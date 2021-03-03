const express = require('express');
const router = express.Router();
const passport = require('passport')
const { isLoggedIn, protectIndex} = require('../lib/auth');
const db = require('../database');
const helpers = require('../lib/helpers');
const nodemailer = require('nodemailer');


router.get('/signin', protectIndex, (req,res) => {
    res.render('auth/signin')
});

// router.get('/signup', (req,res) =>{
//     res.render('auth/signup')
// });

// router.post('/signup', (req,res) =>{
//     passport.authenticate('local.signup',{
//         SuccessRedirect: '/profile',
//         failureRedirect: '/signup',
//         failureFlash: true
//     });
//     res.send('Received');
// });

// router.post('/signup',passport.authenticate('local.signup', {
//     successRedirect: '/signin',
//     failureRedirect: '/signup',
//     failureFlash: true
// }));


// router.post('/signin', (req,res,next) => {
//     passport.authenticate('local.signin',{
//         successRedirect: '/indexInventario',
//         failureRedirect: '/signin',
//         failureFlash: true
//     })(req,res,next);    
// });

router.post('/signin', function (req, res, next) {
    passport.authenticate('local.signin', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/signin'); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            if (user.TipoEmpleado == 'ADMINISTRADOR') {
                return res.redirect('/indexAdministrador');
            }
            else if (user.TipoEmpleado == 'COMPRAS') {
                return res.redirect('/indexCompras');
            }
            else if (user.TipoEmpleado == 'INVENTARIO') {
                return res.redirect('/indexInventario');
            }
        });
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success','Sesion cerrada');
    res.redirect('/signin');
});

router.get('/indexAdministrador', isLoggedIn, protectIndex ,async(req,res) => {
    const countStaffQuery = await db.query("SELECT COUNT(IdEmpleado) AS count from Empleado;");
    const countAreaQuery = await db.query("SELECT COUNT(IdArea) AS count from Area;");
    const countElementQuery = await db.query("SELECT COUNT(IdElemento) AS count from Elemento;");
    const countProviderQuery = await db.query("SELECT COUNT(NITPRoveedor) AS count from Proveedor");
    countStaff = countStaffQuery[0].count;
    countArea = countAreaQuery[0].count;
    countElement = countElementQuery[0].count;
    countProvider = countProviderQuery[0].count;
    res.render('indexAdministrador',{countStaff,countArea,countElement,countProvider});    
});
router.get('/indexAdministrador/charts', isLoggedIn, protectIndex ,async(req,res) => {
    const staffByArea = await db.query("SELECT * from Area WHERE CantidadEmpleados > 0");
    res.send(staffByArea);    
});

router.get('/indexInventario', isLoggedIn, protectIndex, async(req,res) => {
    const stockAlert = await db.query('SELECT * FROM elemento WHERE stock < 5;')
    const countElementQuery = await db.query("SELECT COUNT(IdElemento) AS count from Elemento;");
    const assignedElementsQuery = await db.query("SELECT COUNT(idAsignado) as assigned FROM asignacion_elemento;");
    const totalElementsValueQuery = await db.query("SELECT SUM(PrecioUnitario*Stock) AS total FROM elemento;");
    const totalAssignedQuery = await db.query("SELECT SUM(CON.TotaL) AS total FROM (SELECT E.NombreElemento, AE.Cantidad, E.PrecioUnitario,(Cantidad*PrecioUnitario) AS Total  FROM asignacion_elemento AS AE INNER JOIN Elemento AS E ON AE.FoElemento = E.IdElemento) AS CON;");
    countElement = countElementQuery[0].count;
    assignedElements = assignedElementsQuery[0].assigned;
    elementsValue = totalElementsValueQuery[0].total;
    totalAssigned = totalAssignedQuery[0].total;

    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    elementsValue = currencyFormat.format(elementsValue);
    totalAssigned = currencyFormat.format(totalAssigned);

    res.render('indexInventario',{stockAlert,countElement,assignedElements,elementsValue,totalAssigned});
});

router.get('/indexCompras', isLoggedIn, protectIndex, async(req,res) => {
    const countElementQuery = await db.query("SELECT COUNT(IdElemento) AS count from Elemento;");
    const countProviderQuery = await db.query("SELECT COUNT(NITPRoveedor) AS count from Proveedor");
    const totalElementsValueQuery = await db.query("SELECT SUM(PrecioUnitario*Stock) AS total FROM elemento;");
    countElement = countElementQuery[0].count;
    countProvider = countProviderQuery[0].count;
    elementsValue = totalElementsValueQuery[0].total;
    
    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    elementsValue = currencyFormat.format(elementsValue);

    res.render('indexCompras',{countElement,countProvider,elementsValue});
});

router.get('/indexCompras/charts', isLoggedIn, protectIndex ,async(req,res) => {
    const valueByArea = await db.query("SELECT con.NombreArea, SUM(con.Total) AS TotalAsignado FROM (select A.NombreArea, FoElemento, Cantidad, E.PrecioUnitario, (E.PrecioUnitario * Cantidad) AS Total  from asignacion_elemento AS AE INNER JOIN Elemento AS E ON AE.FoElemento = E.IdElemento INNER JOIN Area as A ON AE.FoArea = A.IdArea ORDER by FoArea) AS con GROUP BY con.NombreArea;");
    res.json(valueByArea);    
});

router.post('/recoverPassword', async(req,res) => {

    const {username} = req.body;
    const veryfyExists = await db.query(" SELECT EXISTS(SELECT * from Empleado WHERE Username = ?) as username;",[username]);
    usernameExists = veryfyExists[0].username;
    console.log(usernameExists);

    if (usernameExists) {

        const emailQuery = await db.query("SELECT correoEmpleado FROM empleado WHERE username = ?",[username]);
        const email = emailQuery[0].correoEmpleado;
        console.log(email);
        newPassword = await helpers.recoverPassword(username);
        await db.query('UPDATE empleado set password = sha1(?) WHERE username = ?',[newPassword,username]);

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'jam0725mailer@gmail.com',
                pass: 'MyMailer0725.'
            },
            tls: { rejectUnauthorized: false }
        });

        var mainOptions = {
            from: "Remitente",
            to: email,
            subject: "Solicitud nueva contraseña OneLink",
            text: `Su contraseña de recuperación es: ${newPassword}`
        };

        transporter.sendMail(mainOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send(error.message);
            } else {
                console.log('Email enviado');
                res.status(200).jsonp(req.body);
            }
        });
        req.flash('success', 'Nueva contraseña enviada a su correo');
    } else {
        req.flash('message', 'Usuario no encontrado')
    }
    res.redirect('/signin');
})

module.exports = router;
