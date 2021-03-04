const express = require('express');
const router = express.Router();
const { isLoggedIn, protectIndex} = require('../lib/auth');
const helpers = require('../lib/helpers');
const db = require('../database');
const passport = require('passport');

//------------- USER ROUTES ---------------------------------//
router.get('/insertElement', isLoggedIn, protectIndex, async(req, res) => {
    const listElementQuery = await db.query("SELECT IdElemento,NombreElemento,Stock from elemento");
    const listProviderQuery = await db.query("SELECT NITProveedor,NombreProveedor from proveedor");
    res.render('menuCompras/insertElement',{listElementQuery,listProviderQuery});
});

router.post('/insertElement', isLoggedIn, protectIndex, async(req, res) => {
    const reqBody = req.body
    const elementReq = reqBody.tableInput;
    const elementReqJSON = JSON.parse(elementReq);
    for (row in elementReqJSON){
        var fechaCompra = new Date();
        var vUnitario = elementReqJSON[row]["V. Unitario"]
        //Define here is optional, Database trigger total before insert it
        //var vTotal = elementReqJSON[row]["V. Total"]
        const {Id,Nombre,Cantidad,NIT,Proveedor} = elementReqJSON[row];
        const elementRow = {
            NIT,
            Id,
            Cantidad,
            vUnitario,
            fechaCompra
        }
        console.log(elementRow.vTotal);
        //Add item to Stock
        const sum = await db.query('UPDATE Elemento SET Stock = Stock + ? WHERE IdElemento= ?;',[elementRow.Cantidad,elementRow.Id]);
        const elementprice = await db.query('UPDATE Elemento SET PrecioUnitario = ? WHERE IdElemento =?',[elementRow.vUnitario,elementRow.Id])
        // Register Item in movements
        const result = await db.query('INSERT INTO compra(FoProveedor,FoElemento,Cantidad,ValorUnitario,Fecha) VALUES(?,?,?,?,?)', Object.values(elementRow));
        console.log(result);        
    }     
    req.flash('success','Movimiento ejecutado correctamente');
    res.redirect('/menuCompras/insertElement');    
});

router.post('/createElement',isLoggedIn, protectIndex,async(req,res) =>{
    const {nombreNuevoElemento} = req.body;
    const newElement = {
        nombreNuevoElemento
    };
    console.log(newElement);
    const result = await db.query('INSERT INTO Elemento(NombreElemento) VALUES(?)', Object.values(newElement));
    console.log(result);
    req.flash('success','Elemento creado');
    res.redirect('/menuCompras/insertElement');
});

router.post('/createSupplier',isLoggedIn, protectIndex,async(req,res) =>{
    const {nombreNuevoProveedor,direccionProveedor,telefonoProveedor,correoProveedor} = req.body;
    const newSupplier = {
        nombreNuevoProveedor,
        direccionProveedor,
        telefonoProveedor,
        correoProveedor
    };
    console.log(newSupplier);
    const result = await db.query('INSERT INTO proveedor(NombreProveedor,DireccionProveedor,TelefonoProveedor,CorreoProveedor) VALUES(?,?,?,?)', Object.values(newSupplier));
    console.log(result);
    req.flash('success','Proveedor creado');
    res.redirect('/menuCompras/insertElement');
});

router.post('/editSupplier',isLoggedIn, protectIndex,async(req,res) =>{
    const {idProveedor,nProveedor,dProveedor,tProveedor,cProveedor} = req.body;
    const newSupplier = {
        nombreProveedor : nProveedor,
        direccionProveedor : dProveedor,
        telefonoProveedor : tProveedor,
        correoProveedor: cProveedor
    };
    console.log(idProveedor);
    console.log(newSupplier);
    const result = await db.query('UPDATE Proveedor SET ? WHERE NITProveedor = ?',[newSupplier,idProveedor]);
    console.log(result);
    req.flash('success','Proveedor editado');
    res.redirect('/menuCompras/listSupplier');
});

router.post('/editElement',isLoggedIn, protectIndex,async(req,res) =>{
    const {idElemento,nElemento,pElemento} = req.body;
    const newElement = {
        NombreElemento : nElemento,
        PrecioUnitario : pElemento
    };
    console.log(idElemento);
    console.log(newElement);
    const result = await db.query('UPDATE Elemento SET ? WHERE idElemento = ?',[newElement,idElemento]);
    console.log(result);
    req.flash('success','Elemento editado');
    res.redirect('/menuCompras/listElement');
});

router.get('/listMovement', isLoggedIn, protectIndex, async(req, res) => {
    const movementRows = await db.query("SELECT IdCompra,proveedor.NombreProveedor,elemento.NombreElemento,Cantidad,ValorUnitario,TotalCompra,DATE_FORMAT(fecha,'%d-%m-%Y') as Fecha, DATE_FORMAT(fecha,'%Y%m%d') as FechaFormat FROM compra INNER JOIN elemento ON Compra.FoElemento = elemento.IdElemento  INNER JOIN proveedor ON compra.FoProveedor = proveedor.NITProveedor ORDER BY IdCompra ;");  
    res.render('menuCompras/listMovement',{movementRows});
});

router.get('/listInventory', isLoggedIn, protectIndex, async(req, res) => {
    const inventoryRows = await db.query("SELECT IdElemento,NombreElemento,PrecioUnitario,Stock from elemento;");  
    res.render('menuCompras/listInventory',{inventoryRows});
});

router.get('/listSupplier', isLoggedIn, protectIndex, async(req, res) => {
    const supplierRows = await db.query("SELECT NITProveedor,NombreProveedor,DireccionProveedor,TelefonoProveedor,CorreoProveedor from Proveedor;");  
    res.render('menuCompras/listSupplier',{supplierRows});
});

router.get('/deleteSupplier/:idSupplier', isLoggedIn, protectIndex, async(req,res) =>{
    const {idSupplier} = req.params;
    console.log(idSupplier);
    try{
        await db.query('DELETE FROM Proveedor WHERE NITProveedor=?',[idSupplier]);
        req.flash('success','Proveedor Eliminado');
        res.redirect('/menuCompras/listSupplier');
    }catch(e){
        
        req.flash('message','No se puede eliminar Proveedor ya que tiene elementos registrados');
        res.redirect('/menuCompras/listSupplier');
    }    
    
});

router.get('/listElement', isLoggedIn, protectIndex, async(req, res) => {
    const elementRows = await db.query("SELECT IdElemento,NombreElemento,PrecioUnitario from Elemento;");  
    res.render('menuCompras/listElement',{elementRows});
});

router.get('/deleteElement/:idElement', isLoggedIn, protectIndex, async(req,res) =>{
    const {idElement} = req.params;
    console.log(idElement);
    try{
        await db.query('DELETE FROM Elemento WHERE IdElemento=?',[idElement]);
        req.flash('success','Elemento Eliminado');
        res.redirect('/menuCompras/listElement');
    }catch(e){
        
        req.flash('message','No se puede eliminar elemento ya que se encuentra en inventario');
        res.redirect('/menuCompras/listElement');
    }    
    
});

router.get('/listRequest', isLoggedIn, protectIndex, async(req,res) => {
    const requestRows = await db.query("SELECT IdSolicitud, elemento.NombreElemento, Cantidad, DATE_FORMAT(FechaSolicitud,'%d-%m-%Y') as Fecha, DATE_FORMAT(FechaSolicitud,'%Y%m%d') as FechaFormat FROM solicitud_elemento INNER JOIN elemento ON solicitud_elemento.FoElemento = elemento.IdElemento WHERE EstadoSolicitud = 'ACTIVO';");
    res.render('menuCompras/listRequest', { requestRows });
});

module.exports = router;