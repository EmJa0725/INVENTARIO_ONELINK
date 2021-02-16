const express = require('express');
const router = express.Router();
const { isLoggedIn, protectIndex} = require('../lib/auth');
const helpers = require('../lib/helpers');
const db = require('../database');
const passport = require('passport');

//------------- USER ROUTES ---------------------------------//
router.get('/createUser', isLoggedIn, protectIndex,  async(req, res) => {
    const listAreaQuery = await db.query("SELECT IdArea,NombreArea from Area");
    //const listArea = JSON.stringify(listAreaQuery);
    res.render('menuAdministrador/createUser', {listAreaQuery});
});

router.post('/createUser',isLoggedIn, protectIndex, async(req,res) =>{
    //console.log(req.body);    
    const {nombre,apellido,sexo,fNacimiento,correo,telefono,direccion,cargo,area,username,password} = req.body;
    var fechaIngreso = new Date(); 
    var edad = helpers.calcularEdad(fNacimiento);
    const newUser = {
        username,
        password,
        area,
        nombre,
        apellido,
        sexo,
        cargo,
        fNacimiento,
        edad,
        direccion,
        telefono,
        correo,
        fechaIngreso,
    };
    console.log(newUser);
    const result = await db.query('INSERT INTO Empleado(Username,Password,FoArea,NombreEmpleado,ApellidoEmpleado,SexoEmpleado,CargoEmpleado,fNacimientoEmpleado,EdadEmpleado,DireccionEmpleado,TelefonoEmpleado,CorreoEmpleado,FechaIngreso) VALUES(?,sha1(?),?,?,?,?,?,?,?,?,?,?,?)', Object.values(newUser));
    console.log(result);
    req.flash('success','Usuario creado');
    res.redirect('/menuAdministrador/createUser');
});

router.get('/listUser', isLoggedIn, protectIndex,  async(req, res) => {
    const userRows = await db.query("SELECT IdEmpleado,username,NombreEmpleado,ApellidoEmpleado,CargoEmpleado, area.NombreArea FROM Empleado INNER JOIN Area ON Empleado.FoArea = Area.IdArea;");
    res.render('menuAdministrador/listUser',{userRows});
});


router.get('/editUser/:id', isLoggedIn, protectIndex, async (req,res) =>{
    const {id} = req.params;    
    const userQuery = await db.query("SELECT IdEmpleado,NombreEmpleado,ApellidoEmpleado,SexoEmpleado,DATE_FORMAT(fNacimientoEmpleado,'%Y-%m-%d') as fNacimientoEmpleado,CorreoEmpleado,TelefonoEmpleado,DireccionEmpleado,CargoEmpleado,area.NombreArea,FoArea,Username,Password FROM Empleado INNER JOIN Area ON Empleado.FoArea = Area.IdArea WHERE IdEmpleado = ?;",[id]);
    console.log(userQuery[0]);
    const listAreaQuery = await db.query("SELECT IdArea,NombreArea from Area");
    res.render('menuAdministrador/editUser',{userToEdit: userQuery[0],listAreaQuery});
});

router.post('/editUser/:id', isLoggedIn, protectIndex,  async(req,res) =>{
    const {id} = req.params;
    const {nombre,apellido,sexo,fNacimiento,correo,telefono,direccion,cargo,area,username,password} = req.body;
    var edad = helpers.calcularEdad(fNacimiento);
    const newUser = {
        username,
        password,
        FoArea : area,
        NombreEmpleado: nombre,
        ApellidoEmpleado : apellido,
        SexoEmpleado: sexo,
        CargoEmpleado: cargo,
        fNacimientoEmpleado: fNacimiento,
        EdadEmpleado: edad,
        DireccionEmpleado: direccion,
        TelefonoEmpleado: telefono,
        CorreoEmpleado: correo        
    };
    const isEncrypted = await helpers.verifyEncripted(newUser.password);
    console.log(newUser);
        await db.query('UPDATE empleado set ? WHERE idEmpleado = ?',[newUser,id]);
    if(!isEncrypted){        
        await db.query('UPDATE empleado set password = sha1(?) WHERE idEmpleado = ?',[newUser.password,id]);        
    }    
    req.flash('success','Usuario Editado');
    res.redirect('/menuAdministrador/editUser/'+id); 
});

router.get('/deleteUser/:id', isLoggedIn, protectIndex,  async(req,res) =>{
    const {id} = req.params;
    console.log(id);
    await db.query('DELETE FROM empleado WHERE IdEmpleado=?',[id]);
    req.flash('success','Usuario Eliminado');
    res.redirect('/menuAdministrador/listUser');
});

//------------------ AREA ROUTES ----------------------//
router.get('/createArea', isLoggedIn, protectIndex,  async(req, res) => {
    const listAreaQuery = await db.query("SELECT IdArea,NombreArea from Area");
    //const listArea = JSON.stringify(listAreaQuery);
    res.render('menuAdministrador/createArea', {listAreaQuery});
});

router.post('/createArea',isLoggedIn, protectIndex, async(req,res) =>{
    //console.log(req.body);    
    const {nombreArea,funcionArea} = req.body;
    const newArea = {
        nombreArea,
        funcionArea,
    };
    console.log(newArea);
    const result = await db.query('INSERT INTO Area(NombreArea,FuncionArea) VALUES(?,?)', Object.values(newArea));
    console.log(result);
    req.flash('success','Area creada');
    res.redirect('/menuAdministrador/createArea');
});

router.get('/listArea', isLoggedIn, protectIndex,  async(req, res) => {
    // Count Total employees by Area before render table 
    await db.query("UPDATE AREA  as A JOIN (SELECT t2.IdArea, IFNULL(COUNT(t1.FoArea),0) AS Total FROM Area AS t2 LEFT JOIN Empleado AS t1 ON t1.FoArea = t2.IdArea GROUP BY t2.IdArea) AS CON ON A.IdArea SET A.CantidadEmpleados = CON.TOTAL WHERE CON.IdArea = A.IdArea");
    const areaRows = await db.query("SELECT IdArea,NombreArea,CantidadEmpleados from area");      
    res.render('menuAdministrador/listArea',{areaRows});
});

router.get('/editArea/:idArea', isLoggedIn, protectIndex, async (req,res) =>{
    const {idArea} = req.params;    
    const areaQuery = await db.query("SELECT IdArea,NombreArea,FuncionArea FROM Area WHERE idArea = ?;",[idArea]);
    console.log(areaQuery[0]);
        res.render('menuAdministrador/editArea',{areaToEdit: areaQuery[0]});
});

router.post('/editArea/:idArea', isLoggedIn, protectIndex,  async(req,res) =>{
    const {idArea} = req.params;
    const {editNombreArea,funcionArea} = req.body;
    const newArea = {
        NombreArea: editNombreArea,
        funcionArea        
    };
    console.log(newArea);
    await db.query('UPDATE area set ? WHERE idArea = ?',[newArea,idArea]);
        
    req.flash('success','Area Editada');
    res.redirect('/menuAdministrador/editArea/'+idArea); 
});

router.get('/deleteArea/:idArea', isLoggedIn, protectIndex,  async(req,res) =>{
    const {idArea} = req.params;
    console.log(idArea);
    try{
        await db.query('DELETE FROM area WHERE IdArea=?',[idArea]);
        req.flash('success','Area Eliminada');
        res.redirect('/menuAdministrador/listArea');
    }catch(e){
        
        req.flash('message','No se puede eliminar Area ya que tiene empleados asignados');
        res.redirect('/menuAdministrador/listArea');
    }    
    
});



module.exports = router;

//select IdEmpleado,username,NombreEmpleado,ApellidoEmpleado,CargoEmpleado, area.NombreArea from Empleado INNER JOIN Area ON Empleado.FoArea = Area.IdArea;

// INSERT INTO Area(CantidadEmpleados) SELECT COUNT(empleado.FoArea) from empleado join Area ON Empleado.FoArea = Area.IdArea group by Empleado.FoArea;

//UPDATE Area JOIN Empleado on Area.IdArea = Empleado.FoArea SET Area.CantidadEmpleados = (SELECT COUNT(Empleado.FoArea) as total  group by Empleado.FoArea);

//SELECT t2.IdArea, IFNULL(COUNT(t1.FoArea),0) AS CON FROM Area AS t2 LEFT JOIN Empleado AS t1 ON t1.FoArea = t2.IdArea GROUP BY t2.IdArea;

//UPDATE AREA  as A JOIN (SELECT COUNT(FoArea) as total,FoArea from empleado group by FoArea) AS CON ON A.IdArea SET A.CantidadEmpleados = CON.TOTAL WHERE CON.FoArea = A.IdArea;