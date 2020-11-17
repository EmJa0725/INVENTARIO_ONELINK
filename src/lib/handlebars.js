const helpers = {};

helpers.isAdmin = (TipoEmpleado) => {
    if (TipoEmpleado == 'ADMINISTRADOR') {        
        return true;
    }
    else return false;
}

helpers.isInventario = (TipoEmpleado) => {
    if (TipoEmpleado == 'INVENTARIO') {        
        return true;
    }
    else return false;
}

helpers.isCompras = (TipoEmpleado) => {
    if (TipoEmpleado == 'COMPRAS') {        
        return true;
    }
    else return false;

};

helpers.da = (dato)=>{
    if(dato==1){
        return "Modules/content";
    }
    else if(dato==2){
        
        return "Modules/menus/adminMenu/create";
    }
}

module.exports = helpers;