const express = require('express');
const router = express.Router();
const { isLoggedIn, protectIndex} = require('../lib/auth');
const helpers = require('../lib/helpers');
const db = require('../database');
const passport = require('passport');

router.get('/outputElement', isLoggedIn, protectIndex, async(req, res) => {
    const listElementQuery = await db.query("SELECT IdElemento,NombreElemento,Stock from Elemento");
    const listAreaQuery = await db.query("SELECT IdArea,NombreArea,CantidadEmpleados,FuncionArea from Area");
    const listStaffQuery = await db.query("SELECT IdEmpleado,FoArea as IdArea,NombreEmpleado,ApellidoEmpleado from Empleado");
    const areaWithElementsQuery = await db.query("SELECT DISTINCT IdArea,NombreArea from Area INNER JOIN asignacion_elemento as A ON Area.IdArea = A.FoArea;");
    const staffWithElementsQuery = await db.query("SELECT DISTINCT IdEmpleado,NombreEmpleado,ApellidoEmpleado,A.FoArea as IdArea from Empleado INNER JOIN asignacion_elemento as A ON Empleado.IdEmpleado = A.FoEmpleado;");
    const activeElementsQuery = await db.query("SELECT IdAsignado,FoEmpleado as IdEmpleado,FoArea as IdArea,FoElemento as IdElemento,Cantidad,E.NombreElemento from asignacion_elemento INNER JOIN Elemento as E ON asignacion_elemento.FoElemento = E.IdElemento");
    //SELECT IdEmpleado,NombreEmpleado,ApellidoEmpleado,A.NombreArea FROM Empleado INNER JOIN Area as A ON Empleado.FoArea = A.IdArea;
    // areaWithElementsQuery,staffWithElementsQuery,activeElementsQuery
    res.render('menuInventario/outputElement',{listElementQuery,listAreaQuery,listStaffQuery,areaWithElementsQuery,staffWithElementsQuery,activeElementsQuery});
});

router.post('/outputElement', isLoggedIn, protectIndex, async(req, res) => {
    const reqBody = req.body
    console.log(req.body);
    const elementReq = reqBody.tableInput;
    const elementReqJSON = JSON.parse(elementReq);
    for (row in elementReqJSON){
        var fechaMovimiento = new Date();
        const {Tipo,IdElemento,Elemento,Cantidad,IdArea,Area,IdEmpleado,Empleado} = elementReqJSON[row];
        const elementRow = {
                Tipo,
                IdElemento,
                IdArea,
                IdEmpleado,
                Cantidad,
                fechaMovimiento
        }
        console.log(elementRow);
        //substract stock
        const res = await db.query('UPDATE Elemento SET Stock = Stock - ? WHERE IdElemento= ?;',[elementRow.Cantidad,elementRow.IdElemento]);
        console.log(res);
        //Register Item in movements
        const movement = await db.query('INSERT INTO movimiento_inventario(TipoMovimiento,FoElemento,FoArea,FoEmpleado,Cantidad,Fecha) VALUES(?,?,?,?,?,?)', Object.values(elementRow));
        console.log(movement);
        //Assign element to employee
        const elementExists = await db.query("SELECT EXISTS(SELECT * FROM asignacion_elemento WHERE FoElemento = ? AND FoEmpleado = ? ) as verify;",[elementRow.IdElemento,elementRow.IdEmpleado]);
        const elementAssigned = elementExists[0].verify;
        if (elementAssigned){
            const assign = await db.query('UPDATE asignacion_elemento SET Cantidad = Cantidad + ? WHERE FoElemento = ? AND FoEmpleado = ?;',[elementRow.Cantidad,elementRow.IdElemento,elementRow.IdEmpleado]);
            console.log(assign);
        }
        else{
            const assign = await db.query('INSERT INTO asignacion_elemento(foEmpleado,foElemento,foArea,Cantidad) VALUES(?,?,?,?)',[elementRow.IdEmpleado,elementRow.IdElemento,elementRow.IdArea,elementRow.Cantidad]);
            console.log(assign);
        }       
    }     
    req.flash('success','Salida ejecutada correctamente');
    res.redirect('/menuInventario/outputElement');    
});

router.get('/outputElement/return', isLoggedIn, protectIndex, async(req, res) => {
    res.redirect('/menuInventario/outputElement')
});

router.post('/outputElement/return', isLoggedIn, protectIndex, async(req, res) => {
    const reqBody = req.body
    const elementReq = reqBody.tableInput;
    console.log(req.body);
    const elementReqJSON = JSON.parse(elementReq);
    for (row in elementReqJSON){
        var fechaMovimiento = new Date();
        const {Tipo,IdElemento,Elemento,Cantidad,IdArea,Area,IdEmpleado,Empleado} = elementReqJSON[row];
        const elementRow = {
                Tipo,
                IdElemento,
                IdArea,
                IdEmpleado,
                Cantidad,
                fechaMovimiento
        }  
        console.log(elementRow);  
        //sum stock
        const sum = await db.query('UPDATE Elemento SET Stock = Stock + ? WHERE IdElemento= ?;',[elementRow.Cantidad,elementRow.IdElemento]);
        //subtract element to employee
        const res = await db.query('UPDATE asignacion_elemento SET Cantidad = Cantidad - ? WHERE FoEmpleado = ? AND FoElemento= ?;',[elementRow.Cantidad,elementRow.IdEmpleado,elementRow.IdElemento]);
        //Register Item in movements
        const movement = await db.query('INSERT INTO movimiento_inventario(TipoMovimiento,FoElemento,FoArea,FoEmpleado,Cantidad,Fecha) VALUES(?,?,?,?,?,?)', Object.values(elementRow));
        //remove item to employee
        const verifyelementIsZero = await db.query("SELECT EXISTS(SELECT * FROM asignacion_elemento WHERE FoEmpleado = ? AND Cantidad = 0) as verify;",[elementRow.IdEmpleado]);
        const elementIsZero = verifyelementIsZero[0].verify;
        if (elementIsZero){
            const remove = await db.query("DELETE FROM asignacion_elemento WHERE FoEmpleado = ? AND FoElemento = ?;",[elementRow.IdEmpleado,elementRow.IdElemento]);   
            console.log('Element removed');
        }
    }
    req.flash('success','Devolucion ejecutada correctamente');
    res.redirect('/menuInventario/outputElement');
});

router.get('/listInventory', isLoggedIn, protectIndex, async(req, res) => {
    const inventoryRows = await db.query("SELECT IdElemento,NombreElemento,PrecioUnitario,Stock from elemento;");  
    res.render('menuInventario/listInventory',{inventoryRows});
});

router.get('/listOutput', isLoggedIn, protectIndex, async(req, res) => {
    const outputRows = await db.query("SELECT IdMovimiento,TipoMovimiento,area.NombreArea,empleado.NombreEmpleado,empleado.ApellidoEmpleado,elemento.NombreElemento,Cantidad,DATE_FORMAT(fecha,'%d-%m-%Y') as Fecha FROM movimiento_inventario INNER JOIN elemento ON movimiento_inventario.FoElemento = elemento.IdElemento INNER JOIN empleado ON movimiento_inventario.FoEmpleado = empleado.IdEmpleado INNER JOIN area ON movimiento_inventario.FoArea = area.IdArea WHERE tipoMovimiento = 'SALIDA' ORDER BY IdMovimiento ;");
    res.render('menuInventario/listOutput', { outputRows });
});

router.get('/listReturn', isLoggedIn, protectIndex, async(req, res) => {
    const returnRows = await db.query("SELECT IdMovimiento,TipoMovimiento,area.NombreArea,empleado.NombreEmpleado,empleado.ApellidoEmpleado,elemento.NombreElemento,Cantidad,DATE_FORMAT(fecha,'%d-%m-%Y') as Fecha FROM movimiento_inventario INNER JOIN elemento ON movimiento_inventario.FoElemento = elemento.IdElemento INNER JOIN empleado ON movimiento_inventario.FoEmpleado = empleado.IdEmpleado INNER JOIN area ON movimiento_inventario.FoArea = area.IdArea WHERE tipoMovimiento = 'DEVOLUCION' ORDER BY IdMovimiento ;");  
    res.render('menuInventario/listReturn',{returnRows});
});

router.get('/listAreaElement', isLoggedIn, protectIndex, async(req, res) => {
    const areaWithElementsQuery = await db.query("SELECT DISTINCT IdArea,NombreArea from Area INNER JOIN asignacion_elemento as A ON Area.IdArea = A.FoArea;"); 
    res.render('menuInventario/listAreaElement',{areaWithElementsQuery});
});

router.get('/listAreaElement/:idArea', isLoggedIn, protectIndex, async(req, res) => {
    const {idArea} = req.params;
    console.log(idArea);
    const staffWithElementsQuery = await db.query("SELECT DISTINCT IdEmpleado,NombreEmpleado,ApellidoEmpleado,A.FoArea as IdArea from Empleado INNER JOIN asignacion_elemento as A ON Empleado.IdEmpleado = A.FoEmpleado WHERE Empleado.FoArea = ? ;",[idArea]);
    res.send(JSON.stringify(staffWithElementsQuery));
});

router.get('/listAreaElement/empleado/:idEmpleado', isLoggedIn, protectIndex, async(req, res) => {
    const {idEmpleado} = req.params;
    console.log(idEmpleado);
    const activeElementsQuery = await db.query("SELECT IdAsignado,FoEmpleado as IdEmpleado,FoArea as IdArea,FoElemento as IdElemento,Cantidad,E.NombreElemento from asignacion_elemento INNER JOIN Elemento as E ON asignacion_elemento.FoElemento = E.IdElemento WHERE asignacion_elemento.FoEmpleado = ? ;",[idEmpleado]);
    res.send(JSON.stringify(activeElementsQuery));
});

module.exports = router;