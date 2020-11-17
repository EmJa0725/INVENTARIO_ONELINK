window.setTimeout(function() {
    $(".alert").fadeTo(500, 0).slideUp(500, function(){
        $(this).remove(); 
    });
}, 2000);


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
    document.getElementById('passwordCheck').innerHTML = password.value == password2.value ? "<span style='color: green;'>Contraseña coinciden</span>" :  "<span style='color: red;'>Contraseña no coinciden</span>";
    if(password.value == password2.value && password.value!=" " && password2.value!=" "){
        password.style = "border-color:green;border-style:solid;border-width:3px";
        password2.style = "border-color:green;border-style:solid;border-width:3px";
        document.getElementById("boton").disabled = false;
        return true
    }
    else if (password.value != password2.value){
        password.style = "border-color:red;border-style:solid;border-width:3px";
        password2.style = "border-color:red;border-style:solid;border-width:3px";
        document.getElementById("boton").disabled = true;
        return false
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
  location.href = '/menuAdministrador/deleteArea/' + '1';
}

$(document).ready(function () {
  $('#usersTable').DataTable({
    "paging": false,    
    "aaSorting": [],
    columnDefs: [{
      orderable: false,
      targets: [6,7]
    }],
    "language": {
      "search": "Filtrar Registro",  
      "zeroRecords": "No se encontraron resultados"    
    },
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');

  $('#areasTable').DataTable({
    "paging": false,    
    "aaSorting": [],
    columnDefs: [{
      orderable: false,
      targets: [3,4]
    }],
    "language": {
      "search": "Filtrar Area",  
      "zeroRecords": "No se encontraron resultados"    
    },
    "info": false
  });
  $('.dataTables_length').addClass('bs-select');
});