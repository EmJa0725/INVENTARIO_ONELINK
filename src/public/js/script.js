//Loader
$(window).on("load",function(){
  $(".loader-wrapper").fadeOut("slow");
});

window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
}, 3000);

//RELOJ EN EL NAV DEL MODULO
$(function(){
    var hourUpdate = function(){
      var date = new Date(),
          hours = date.getHours(),
          minuts = date.getMinutes(),
          seconds = date.getSeconds(),
          weekDay = date.getDay(),
          day = date.getDate(),
          month = date.getMonth(),
          year = date.getFullYear(),
          ampm;
      
      var $phours = $("#hours"),
          $pseconds = $("#seconds"),
          $pminuts = $("#minuts"),
          $pAMPM = $("#ampm"),
          $pweekDay = $("#weekDay"),
          $pday = $("#day"),
          $pmonth = $("#month"),
          $pyear = $("#year");
      var semana = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
      var monthes = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
      
      $pweekDay.text(semana[weekDay]);
      $pday.text(day);
      $pmonth.text(monthes[month]);
      $pyear.text(year);
      if(hours>=12){
        hours = hours - 12;
        ampm = "PM";
      }else{
        ampm = "AM";
      }
      if(hours == 0){
        hours = 12;
      }
      if(hours<10){$phours.text("0"+hours)}else{$phours.text(hours)};
      if(minuts<10){$pminuts.text("0"+minuts)}else{$pminuts.text(minuts)};
      if(seconds<10){$pseconds.text("0"+seconds)}else{$pseconds.text(seconds)};
      $pAMPM.text(ampm);
      
    };    
    hourUpdate();
    var interval = setInterval(hourUpdate,1000);
  });


function verifyPassword(){  
    var password = document.getElementById('password');
    var password2 =  document.getElementById('password2');  
    //console.log(password);
    //console.log(password2);
    try {
      document.getElementById('passwordCheck').innerHTML = password.value == password2.value ? "<span style='color: green;'>Contraseña coinciden</span>" : "<span style='color: red;'>Contraseña no coinciden</span>";
      if (password.value == password2.value && password.value != " " && password2.value != " ") {
        password.style = "border-color:green;border-style:solid;border-width:3px";
        password2.style = "border-color:green;border-style:solid;border-width:3px";
        document.getElementById("boton").disabled = false;
        return true
      }
      else if (password.value != password2.value) {
        password.style = "border-color:red;border-style:solid;border-width:3px";
        password2.style = "border-color:red;border-style:solid;border-width:3px";
        document.getElementById("boton").disabled = true;
        return false
      }
    } catch (error) {
      
    }    
};

try{
    password.addEventListener('keyup',() =>{
        if(password.lenght != 0) verifyPassword();
    });
    password2.addEventListener('keyup', () =>{
        if(password2.lenght != 0) verifyPassword();
    });
} catch(e){}


function fillUserModal(username,id){
  document.getElementById('modalBody').textContent = '¿Desea eliminar al usuario '+username+' con id = '+id+'?';
}
function fillAreaModal(nombreArea,id){
  document.getElementById('modalBody').textContent = '¿Desea eliminar el Area '+nombreArea+' con id = '+id+'?';
}

function fillSupplierModal(nombreProveedor, id) {
  var div = document.getElementById('deleteModalBody');
  div.innerHTML = '¿Desea eliminar el Proveedor '+nombreProveedor+' con id = '+id+'?';
}

function fillElementModal(nombreElemento, id) {
  var div = document.getElementById('deleteModalBody');
  div.innerHTML = '¿Desea eliminar el elemento '+nombreElemento+' con id = '+id+'?';
}

function confirmDeleteUser(){
  var idEmpleado = document.getElementById('modalBody').textContent;
  idEmpleado = idEmpleado.split('=').pop(); 
  //document.getElementById('modalBody').textContent = "menuAdministrador/delete/"+idEmpleado;
  location.href = '/menuAdministrador/deleteUser/' + idEmpleado;
}

function confirmDeleteArea(){
  var idArea = document.getElementById('modalBody').textContent;
  idArea = idArea.split('=').pop(); 
  //document.getElementById('modalBody').textContent = "menuAdministrador/delete/"+idEmpleado;
  location.href = '/menuAdministrador/deleteArea/' + idArea;
}

function confirmDeleteSupplier(){
  var idSupplier = document.getElementById('deleteModalBody').textContent;
  idSupplier = idSupplier.split('=').pop(); 
  location.href = '/menuCompras/deleteSupplier/' + idSupplier;
}

function confirmDeleteElement(){
  var idElement = document.getElementById('deleteModalBody').textContent;
  idElement = idElement.split('=').pop(); 
  location.href = '/menuCompras/deleteElement/' + idElement;
}

$('.nav a').click(function(){
  $('.nav a').removeClass('active');
  $(this).addClass('active');    
});

$(document).ready(function () {

  // open submenu when user select option inside
  $(".superMenu").each(function () {
    var url = window.location.href;
    if(url.includes('list')){
      $(this).click();
    }
  });

  // dynamic active item after user selection
  $(".nav a").each(function () {
    url = 'http://localhost:4000' + $(this).attr('href');    
    if (window.location.href == url) {      
      var con = $(this).text();
      var containCon = con.includes('Consultas');
      $(this).addClass("active");
      if(!containCon){
        $('#consultas').removeClass("active");
        //$("#consultas").dropdown('toogle')        
        //console.log('dropdown closed')
      }  
    }
  });

  $('#usersTable').DataTable({
    "paging": true,    
    "aaSorting": [],
    columnDefs: [{
      orderable: false,
      targets: [6,7]
    }],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",  
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      }   
    },
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>rtiBp",
    buttons: [
      {
        extend: 'excelHtml5',
        autofilter: true,
        text: '<i class="fas fa-file-excel"></i>',
        title: 'REPORTE USUARIOS',
        tittleAttr: 'Exportar a Excel',
        className: 'btn btn-success',
        exportOptions: {
          columns: [0,1,2,3,4,5]
        }
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i>',
        title: 'REPORTE USUARIOS',
        tittleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        exportOptions: {
          columns: [0,1,2,3,4,5]
        }
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i>',
        title: 'REPORTE USUARIOS',
        tittleAttr: 'Imprimir',
        className: 'btn btn-info',
        exportOptions: {
          columns: [0,1,2,3,4,5]
        }
      }
    ],
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');

  $('#areasTable').DataTable({
    "paging": true,    
    "aaSorting": [],
    columnDefs: [{
      orderable: false,
      targets: [3,4]
    }],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",  
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      }  
    },
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>rtiBp",
    buttons: [
      {
        extend: 'excelHtml5',
        autofilter: true,
        text: '<i class="fas fa-file-excel"></i>',
        title: 'REPORTE AREAS',
        tittleAttr: 'Exportar a Excel',
        className: 'btn btn-success',
        exportOptions: {
          columns: [0,1,2]
        }
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i>',
        title: 'REPORTE AREAS',
        tittleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        exportOptions: {
          columns: [0,1,2]
        }
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i>',
        title: 'REPORTE AREAS',
        tittleAttr: 'Imprimir',
        className: 'btn btn-info',
        exportOptions: {
          columns: [0,1,2]
        }
      }
    ],
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');

  $('#movementsTable').DataTable({
    dom: 'Bfrtip',
    buttons: [
      'copy', 'csv', 'excel', 'pdf', 'print'
    ],
    "paging": true,    
    "aaSorting": [],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas", 
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      }    
    },
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>rtiBp",
    buttons: [
      {
        extend: 'excelHtml5',
        autofilter: true,
        text: '<i class="fas fa-file-excel"></i>',
        title: 'REPORTE MOVIMIENTOS',
        tittleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i>',
        title: 'REPORTE MOVIMIENTOS',
        tittleAttr: 'Exportar a PDF',
        className: 'btn btn-danger'
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i>',
        title: 'REPORTE MOVIMIENTOS',
        tittleAttr: 'Imprimir',
        className: 'btn btn-info'
      }
    ],
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');

  $('#inventoryTable').DataTable({
    "paging": true,
    "aaSorting": [],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",  
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      }   
    },
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>rtiBp",
    buttons: [
      {
        extend: 'excelHtml5',
        autofilter: true,
        text: '<i class="fas fa-file-excel"></i>',
        title: 'REPORTE INVENTARIO',
        tittleAttr: 'Exportar a Excel',
        className: 'btn btn-success'
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i>',
        title: 'REPORTE INVENTARIO',
        tittleAttr: 'Exportar a PDF',
        className: 'btn btn-danger'
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i>',
        title: 'REPORTE INVENTARIO',
        tittleAttr: 'Imprimir',
        className: 'btn btn-info'
      }
    ],
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');  

  var supplierTable = $('#supplierTable').DataTable({
    "paging": true,    
    "aaSorting": [],
    columnDefs: [{
      orderable: false,
      targets: [5,6]
    }],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",  
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      }   
    },
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>rtiBp",
    buttons: [
      {
        extend: 'excelHtml5',
        autofilter: true,
        text: '<i class="fas fa-file-excel"></i>',
        title: 'REPORTE PROVEEDORES',
        tittleAttr: 'Exportar a Excel',
        className: 'btn btn-success',
        exportOptions: {
          columns: [0,1,2,3,4]
        }
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i>',
        title: 'REPORTE PROVEEDORES',
        tittleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        exportOptions: {
          columns: [0,1,2,3,4]
        }
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i>',
        title: 'REPORTE PROVEEDORES',
        tittleAttr: 'Imprimir',
        className: 'btn btn-info',
        exportOptions: {
          columns: [0,1,2,3,4]
        }
      }
    ],
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');

  var elementTable = $('#elementTable').DataTable({
    "paging": true,    
    "aaSorting": [],
    columnDefs: [{
      orderable: false,
      targets: [3,4]
    }],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",  
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      }   
    },
    dom: "<'row'<'col-md-6'l><'col-md-6'f>>rtiBp",
    buttons: [
      {
        extend: 'excelHtml5',
        autofilter: true,
        text: '<i class="fas fa-file-excel"></i>',
        title: 'REPORTE ELEMENTOS',
        tittleAttr: 'Exportar a Excel',
        className: 'btn btn-success',
        exportOptions: {
          columns: [0,1,2]
        }
      },
      {
        extend: 'pdfHtml5',
        text: '<i class="fas fa-file-pdf"></i>',
        title: 'REPORTE ELEMENTOS',
        tittleAttr: 'Exportar a PDF',
        className: 'btn btn-danger',
        exportOptions: {
          columns: [0,1,2]
        }
      },
      {
        extend: 'print',
        text: '<i class="fas fa-print"></i>',
        title: 'REPORTE ELEMENTOS',
        tittleAttr: 'Imprimir',
        className: 'btn btn-info',
        exportOptions: {
          columns: [0,1,2]
        }
      }
    ],
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');

  // Edit Supplier

  $('#supplierTable tbody').on('click', 'tr', function () {
    var row = supplierTable.row(this).data();
    $("#idProveedor").val(row[0]);
    $("#nProveedor").val(row[1]);
    $("#dProveedor").val(row[2]);
    $("#tProveedor").val(row[3]);
    $("#cProveedor").val(row[4]);
  });

  $('#elementTable tbody').on('click', 'tr', function () {
    var row = elementTable.row(this).data();
    $("#idElemento").val(row[0]);
    $("#nElemento").val(row[1]);
    $("#pElemento").val(row[2]);
  });

  var tipoMovimiento = $(".tipoMovimiento:checked").val();
  if (tipoMovimiento == 'Salida'){
    $("#outputForm").show();
    $("#returnForm").hide();;
  }  
});


//Show Stock after select element
$('.elementSelect').on('change',function(){
  var stock = $(this).children('option:selected').data('stock');
  var id = $(this).val();
  $('#codigoElemento').val(id);
  $('#codigoElementoDevolucion').val(id);
  $('#stockElemento').val(stock);
});

$('.elementSelect').change();


$('.supplierSelect').on('change',function(){
  var id = $(this).val();
  $('#codigoProveedor').val(id);
});

$('.supplierSelect').change();


$('.areaSelect').on('change',function(){
  var id = $(this).val();
  $('#codigoArea').val(id); 
  $('#codigoAreaDevolucion').val(id); 
  $('#codigoEmpleado').val(null); 
});

$('.areaSelect').change();


$('.staffSelect').on('change',function(){
  var id = $(this).val();
  $('#codigoEmpleado').val(id);
  $('#codigoEmpleadoDevolucion').val(id);
});

$('.staffSelect').change();

//Filter area staff based on select option from select2 area field
var select = $('#nombreEmpleadoSalida'),
  cache = $('#nombreEmpleadoSalida').clone();
//$('.cloned').append(cache);
$("#nombreAreaSalida").change(function () {
  var id = $(this).val();
    options=[];
  select.empty();
  cache.find('option').each(function () {
    if (id === '') {
      select.append($(this).clone());
    } else if ($(this).data('area') == id) {
      select.append($(this).clone());
    }
  });
  select.val([]).trigger('change');
});

var select2 = $('#nombreEmpleadoDevolucion'),
  cache2 = $('#nombreEmpleadoDevolucion').clone();
$("#nombreAreaDevolucion").change(function () {
  var id = $(this).val();
    options=[];
  select2.empty();
  cache2.find('option').each(function () {
    if (id === '') {
      select2.append($(this).clone());
    } else if ($(this).data('area') == id) {
      select2.append($(this).clone());
    }
  });
  select2.val([]).trigger('change');
});

//Filter elements based on employeer selection
var select3 = $('#nombreElementoDevolucion'),
  cache3 = $('#nombreElementoDevolucion').clone();
//$('.cloned').append(cache);
$("#nombreEmpleadoDevolucion").change(function () {
  var id = $(this).val();
    options=[];
  select3.empty();
  cache3.find('option').each(function () {
    if (id === '') {
      select3.append($(this).clone());
    } else if ($(this).data('empleado') == id) {
      select3.append($(this).clone());
    }
  });
  select3.val([]).trigger('change');
});

$("#nombreElementoDevolucion").on('change',function(){
  var cantidad = $(this).children('option:selected').data('cantidad');
  //console.log($("#nombreElementoDevolucion").data('cantidad'));
  $("#cantidadAsignada").val(cantidad);
})

//Filter element on select
$(document).ready(function () {
  try {

    var dynamicColors = function () {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };

    //pie
    currentURL = window.location.pathname;
    if (currentURL == '/indexAdministrador') {
      $.ajax({
        url: "indexAdministrador/charts",
        beforeSend: function () {
          $('#piechart').text('Cargando...');
        },
        success: function (data) {
          var staffByArea = data;
          var nombreArea = [];
          var cantidadEmpleados = [];
          var colors = []        

          for (var i in staffByArea) {
            nombreArea.push(staffByArea[i].NombreArea);
            cantidadEmpleados.push(staffByArea[i].CantidadEmpleados);
            colors.push(dynamicColors());
          }
          var ctxP = document.getElementById("pieChart").getContext('2d');
          var myPieChart = new Chart(ctxP, {
            type: 'doughnut',
            data: {
              labels: nombreArea,
              datasets: [{
                data: cantidadEmpleados,
                backgroundColor: colors,
                hoverBackgroundColor: colors
              }]
            },
            options: {
              responsive: true
              // title: {
              //   display: true,
              //   text: 'EMPLEADOS POR AREA',
              //   fontSize: 26,
              //   fontColor: 'blue'
              // }
            }
          });
        }
      }).fail(function () {

      })
    }
    if (currentURL == '/indexCompras') {
      //bar
      $.ajax({
        url: "indexCompras/charts",
        beforeSend: function () {
          $('#barChart').text('Cargando...');
        },
        success: function (data) {
          var totalByArea = data;
          var nombreArea = [];
          var totalAsignado = [];
          var colors = []        

          for (var i in totalByArea) {
            nombreArea.push(totalByArea[i].NombreArea);
            totalAsignado.push(totalByArea[i].TotalAsignado);
            colors.push(dynamicColors());
          }

          var ctx = document.getElementById("barChart");
          var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: nombreArea,
              datasets: [{
                label: 'AREAS',
                data: totalAsignado,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                xAxes: [{
                  ticks: {
                    fontStyle: 'bold'
                  },
                  gridLines: {
                    offsetGridLines: true 
                  }
                }],
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Valor es pesos ($)'
                  },
                  ticks: {
                    beginAtZero: true
                  }
                }]
              }
            }
          });

        }
      }).fail(function () {

      });
    }
  } catch (error) {
    console.log("No se ha podido cargar Grafica: Empleados por area");
  }
  // Initialize select2
  $(".elementSelect").select2({
    language:{
      "noResults": function(){
        return "No se encontraron resultados <br><a href='' data-toggle='modal' data-target='#modalElement' onclick='closeSelect();' style='display: block;'>Codificar nuevo elemento</a>";
      }
    },
    placeholder: "Seleccionar elemento",
    escapeMarkup: function (markup) {
      return markup;
    },
    theme: 'bootstrap',
    width: '100%'
  });

  $(".supplierSelect").select2({
    language:{
      "noResults": function(){
        return "No se encontraron resultados <br><a href='' data-toggle='modal' data-target='#modalSupplier' onclick='closeSelect();' style='display: block;'>Codificar nuevo proveedor</a>";
      }
    },
    placeholder: "Seleccionar proveedor",
    escapeMarkup: function (markup){
      return markup;
    },
    theme: 'bootstrap',
    width: '100%'
  });

  $(".areaSelect").select2({
    language:{
      "noResults": function(){
        return "No se encontraron resultados";
      }
    },
    placeholder: "Seleccionar Area",
    theme: 'bootstrap',
    width: '100%'
  });

  $(".staffSelect").select2({
    language:{
      "noResults": function(){
        return "No se encontraron resultados";
      }
    },
    placeholder: "Seleccionar empleado",
    theme: 'bootstrap',
    width: '100%'
  });

  $(".stateSelect").select2({
    placeholder: "Seleccionar estado",
    theme: 'bootstrap',
    minimumResultsForSearch: Infinity
  })


  $('#elementsTable').DataTable({
    "scrollY": "400px",
    "scrollCollapse": true,
    "language": {  
      "zeroRecords": " ",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas", 
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      } 
    },
    "ordering": false,
    "searching": false,
    // "serverSide": true,
    // "ajax": {
    //   "url": "",
    //   "type": "POST"
    // },
    // "columns": [
    //   { "data": "nombre" },
    //   { "data": "proveedor" },
    //   { "data": "cantidad" },
    //   { "data": "precio" }
    // ]
  });



  $('#outputTable , #requestTable').DataTable({
    "scrollY": "400px",
    "scrollCollapse": true,
    "language": {  
      "zeroRecords": " ",
      "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas", 
      "infoEmpty": "No hay entradas",
      "lengthMenu": "Mostrando _MENU_ entradas",
      "paginate": {
        "previous": "Anterior",
        "next": "Siguiente"
      } 
    },
    "ordering": false,
    "searching": false,
    // "serverSide": true,
    // "ajax": {
    //   "url": "",
    //   "type": "POST"
    // },
    // "columns": [
    //   { "data": "nombre" },
    //   { "data": "proveedor" },
    //   { "data": "cantidad" },
    //   { "data": "precio" }
    // ]
  });
});


var x = 0;
let tipoMovimiento = [];
let nombreElemento = [];
let codElemento = [];
let cantidad = [];
let proveedor = [];
let codProveedor = [];
let precio = [];
let vTotal = [];
let codArea = [];
let nombreArea = [];
let codEmpleado = [];
let nombreEmpleado = [];
let estadoElemento = [];

function listElement(){
  nombreElemento[x] = $(".elementSelect :selected").text();
  codElemento[x] = document.getElementById("codigoElemento").value;
  cantidad[x] = document.getElementById('cantidadEntrada').value;
  proveedor[x] = $(".supplierSelect :selected").text();
  codProveedor[x]= document.getElementById("codigoProveedor").value;
  precio[x] = document.getElementById('precioElemento').value;   
  
  var table = $("#elementsTable").DataTable();
  vTotal[x] = cantidad[x]*precio[x];
  table.row.add([
    codElemento[x],
    nombreElemento[x],
    cantidad[x],
    codProveedor[x],
    proveedor[x],
    precio[x],
    vTotal[x]
  ]).draw();

  $('.elementForm')[0].reset();
  $('.elementSelect').val("").change();
  $('.supplierSelect').val("").change();
  x=x+1;  
 // document.getElementById('nombreAsignatura').value='';
 // document.getElementById('profesorAsignatura').value=''; 
}

function listOutputElement(){  
  tipoMovimiento[x] = $(".tipoMovimiento:checked").val();
  nombreElemento[x] = $("#nombreElementoSalida :selected").text();
  codElemento[x] = document.getElementById("codigoElemento").value;
  cantidad[x] = document.getElementById('cantidadSalida').value;
  codArea[x] = document.getElementById("codigoArea").value;
  nombreArea[x] = $("#nombreAreaSalida :selected").text();
  codEmpleado[x]= document.getElementById("codigoEmpleado").value;
  nombreEmpleado[x] = $("#nombreEmpleadoSalida :selected").text();  
  
  var table = $("#outputTable").DataTable();
  table.row.add([
    tipoMovimiento[x],
    codElemento[x],
    nombreElemento[x],
    cantidad[x],
    codArea[x],
    nombreArea[x],
    codEmpleado[x],
    nombreEmpleado[x]
  ]).draw();

  resetOutputForm();
  //$('#nombreEmpleado').val("").change();
  x=x+1;  
 // document.getElementById('nombreAsignatura').value='';
 // document.getElementById('profesorAsignatura').value=''; 
}

function listReturnElement(){ 
  nombreArea[x] = $("#nombreAreaDevolucion :selected").text();
  codArea[x] = document.getElementById("codigoArea").value;
  nombreEmpleado[x] = $("#nombreEmpleadoDevolucion :selected").text();
  codEmpleado[x]= document.getElementById("codigoEmpleado").value;
  nombreElemento[x] = $("#nombreElementoDevolucion :selected").text();
  codElemento[x] = document.getElementById("codigoElemento").value;
  cantidad[x] = document.getElementById('cantidadDevolucion').value;
  estadoElemento[x] = $('#estadoElemento :selected').text(); 
  tipoMovimiento[x] = (estadoElemento[x] == 'Bueno') ? $(".tipoMovimiento:checked").val() : 'Baja';
  
  var table = $("#outputTable").DataTable();
  table.row.add([
    tipoMovimiento[x],
    codElemento[x],
    nombreElemento[x],
    cantidad[x],
    codArea[x],
    nombreArea[x],
    codEmpleado[x],
    nombreEmpleado[x]
  ]).draw();

  resetReturnForm();
  //$('#nombreEmpleado').val("").change();
  x=x+1;  
 // document.getElementById('nombreAsignatura').value='';
 // document.getElementById('profesorAsignatura').value='';
}

function listRequestElement(){  
  nombreElemento[x] = $("#nombreElementoSolicitud :selected").text();
  codElemento[x] = document.getElementById("codigoElemento").value;
  cantidad[x] = document.getElementById('cantidadSolicitud').value; 
  
  var table = $("#requestTable").DataTable();
  table.row.add([
    codElemento[x],
    nombreElemento[x],
    cantidad[x],
  ]).draw();

  resetRequestForm();
  //$('#nombreEmpleado').val("").change();
  x=x+1;  
 // document.getElementById('nombreAsignatura').value='';
 // document.getElementById('profesorAsignatura').value=''; 
}

function resetOutputForm() {
  $('.elementForm')[0].reset();
  $('.elementSelect').val("").change();
  $('.areaSelect').val("").change();
}

function resetReturnForm() {
  $('.elementForm')[0].reset();
  $('.elementSelect').val("").change();
  $('.areaSelect').val("").change();
  $('#cantidadDevolucion').val('');
  $('.stateSelect').val("").change();
}

function resetRequestForm() {
  $('.elementForm')[0].reset();
  $('.elementSelect').val("").change();
}

function tableJson(){
  var tableData = $('#elementsTable').tableToJSON();
  var input = document.getElementById('tableInput');  
  tableDataFormat = JSON.stringify(tableData);
  input.value = tableDataFormat;
  console.log(tableDataFormat);
}

function tableOutputJson(){
  var tableData = $('#outputTable').tableToJSON();
  var input = document.getElementById('tableInput');  
  tableDataFormat = JSON.stringify(tableData);
  input.value = tableDataFormat;
  console.log(tableDataFormat);
}

function tableRequestJson(){
  var tableData = $('#requestTable').tableToJSON();
  var input = document.getElementById('tableInput');  
  tableDataFormat = JSON.stringify(tableData);
  input.value = tableDataFormat;
  console.log(tableDataFormat);
}

// Clear Table
function clearTable(){
  var table = $('#elementsTable').DataTable();
  table
    .clear()
    .draw();
  console.log('Limpiar tabla');
}

function clearOutputTable(){
  var table = $('#outputTable').DataTable();
  table
    .clear()
    .draw();
  console.log('Limpiar tabla');
}

function clearRequestTable(){
  var table = $('#requestTable').DataTable();
  table
    .clear()
    .draw();
  console.log('Limpiar tabla');
}

// Aoutofocus on modal
$('.modal').on('shown.bs.modal', function() {
  $(this).find('[autofocus]').focus();
});
// Close Select after open modal
function closeSelect(){
  $(".elementSelect").select2("close");
  $(".supplierSelect").select2("close")
};

$('select').change(function(){
  var tipoMovimiento = $(".tipoMovimiento:checked").val();
  //console.log(tipoMovimiento);
  if (tipoMovimiento == 'Salida'){
    $("#cantidadSalida").attr('max', $(this).find(":selected").data('stock'));
  }  
  else if (tipoMovimiento == 'Devolucion'){
    $("#cantidadDevolucion").attr('max', $(this).find(":selected").data('cantidad'));
  }
});

//Display form on radio button change event
$('.tipoMovimiento').change(function() {
  if (this.value == 'Salida') {
    currentURL = window.location.href;
    newURL = currentURL.replace(/\/[^\/]*$/, '')
    window.history.pushState("data","Title",newURL);
    $('#formTable').attr('action','/menuInventario/outputElement');
    resetOutputForm();
    $("#outputForm :input").prop("disabled", false);
    $("#outputForm").show();
    $("#returnForm :input").prop("disabled", true);
    $("#returnForm").hide();
  }
  else if (this.value == 'Devolucion') {
    currentURL = window.location.href;
    newURL = currentURL + "/return";
    window.history.pushState("data","Title",newURL);
    $('#formTable').attr('action','/menuInventario/outputElement/return');
    $("#outputForm :input").prop("disabled", true);  
    $("#outputForm").hide();
    $("#returnForm :input").prop("disabled", false);
    $("#returnForm").show();
  }
  clearOutputTable();
}); 

function filterArea() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('areaFilter');
  filter = input.value.toUpperCase();
  ul = document.getElementById("areaName");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function filterEmployee() {
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('employeeFilter');
  filter = input.value.toUpperCase();
  ul = document.getElementById("employeeName");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    a = li[i];
    txtValue = a.textContent || a.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

function filterElement() {
  // Declare variables
  var input, filter, ul, td, a, i, txtValue;
  input = document.getElementById('elementFilter');
  filter = input.value.toUpperCase();
  ul = document.getElementById("elementName");
  tr = ul.getElementsByTagName('tr');

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    a = tr[i];
    txtValue = a.textContent || a.innerText;
    tr[0].style.display = "";
    if (txtValue.toUpperCase().indexOf(filter) > -1) {      
      tr[i].style.display = "";
      console.log(tr[0]);
    } else {
      tr[i].style.display = "none";
    }
  }
}

$('.areaButton').click(function(){
  $("#elementName").html('');
  $('.areaButton').css("background-color", "#007bff");
  $(this).css("background-color", "orange");
  currentURL = window.location.href;
  buttonText = $(this).text();
  area = buttonText.split(" ").join("");
  idArea = $(this).data("id");
  $.ajax({
    url: currentURL + '/' +idArea,
    beforeSend : function(){
      $('#employeeName').text('Cargando...');
    },
    success: function(data){
      //console.log(data);
      employees = JSON.parse(data);
      //console.log(employees);
      var names = "";  
      for (var employee of employees){
        console.log(employee);
        names += ("<li data-id='"+employee.IdEmpleado+"' id='adc' class='btn btn-primary mt-2 employeeButton' >"+ employee.NombreEmpleado+" "+ employee.ApellidoEmpleado +"</li>");
      }  
      $('#employeeName').html(names);      
    }    
  }).fail(function(){
    alert("Error al cargar los datos");
  })
})

$("body").on("click",".employeeButton", function(){
  $('.employeeButton').css("background-color", "#007bff");
  $(this).css("background-color", "orange");
  currentURL = window.location.href;
  buttonText = $(this).text();
  area = buttonText.split(" ").join("");
  idEmpleado = $(this).data("id");
  $.ajax({
    url: "listAreaElement/empleado/"+idEmpleado,
    beforeSend : function(){
      $('#elementName').text('Cargando...');
    },
    success: function(data){
      //console.log(data);
      elements = JSON.parse(data);
      //console.log(employees);
      var names = "<thead><tr><th scope='col'>Nombre</th><th scope='col'>Cantidad</th></tr></thead><tbody>";  
      
      for (var element of elements){
        //console.log(element);
        names += ("<tr><td>"+ element.NombreElemento+"</td><td>"+ element.Cantidad+"</td></tr>");
      }  
      names += "</tbody>"
      $('#elementName').html(names);      
    }    
  }).fail(function(){
    alert("Error al cargar los datos");
  })
});
