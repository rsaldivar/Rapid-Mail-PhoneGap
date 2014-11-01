function init() {
	// Espera a que PhoneGap se inicie 
	document.addEventListener("deviceready", startup, false);
	window.addEventListener("orientationchange", orientationChange, true);
}

//FUNCIONES A EJECUTAR CUANDO PHONEGAP ESTE LISTO
function startup() {
	console.log("PHONEGAP INIT...");
	checkConnection();
	ajaxError();
	var value = window.localStorage.getItem("id");
	console.log("GET ITEM ID SESSION : "+window.localStorage.getItem("id"));
	console.log("GET KEY SESSION : "+ window.localStorage.getItem("id"));
	
	if(value != null ){
		console.log("SESSION INICIADA ID = "+ value);
		listarContactos();
		listarContactosCorreos();
        $.mobile.changePage("#pageCorreos");
        console.log("REDURECIONANDO A LA PAGINA DE ENVIO DE CORREOS");
	}
	else{
		console.log("SESSION NO INICIADA VALUE = "+value);
        $.mobile.changePage("#pageLogin");
	}
}
	
function ajaxError(){
	$.ajaxSetup({
		error: function(jqXHR, exception) {
			if (jqXHR.status === 0) {
				alert('Not connect.\n Verify Network.');
			} else if (jqXHR.status == 404) {
				console.log("Requested page not found. [404]");
			} else if (jqXHR.status == 500) {
				alert('Internal Server Error [500].');
			} else if (exception === 'parsererror') {
				alert('Requested JSON parse failed.');
			} else if (exception === 'timeout') {
				alert('Time out error.');
			} else if (exception === 'abort') {
				alert('Ajax request aborted.');
			} else {
				console.log('Uncaught Error.\n' + jqXHR.responseText);
   			}
		}
   	});
}

// FUNCIONES QUE MANEJAN LA SESSION
function abrirSession(data){
	console.log(data[0].id);
    window.localStorage.setItem("id", data[0].id);
    console.log("GUARDANDO ID SESSION -->");
    console.log(  data[0].id);
    console.log(" ID SESSION <--");
}
function cerrarSession(){
	window.localStorage.clear();
	console.log("LIMPIANDO ARCHIVOS DE SESSION");
	cerrarApp();
} 

function cerrarApp(){
   	navigator.app.exitApp();
}
  	
//REVISAR CONEXION 
function checkConnection() {
	var networkState = navigator.network.connection.type;
	var states = {};
	states[Connection.UNKNOWN]  = 'Conexión desconocida';
	states[Connection.ETHERNET] = 'Conexión ethernet';
	states[Connection.WIFI]     = 'Conexión WI FI';
	states[Connection.CELL_2G]  = 'Conexión movil 2G';
	states[Connection.CELL_3G]  = 'Conexión movil 3G';
	states[Connection.CELL_4G]  = 'Conexión movil 4G';
	states[Connection.NONE]     = 'Sin conexión';
	
	if (networkState != Connection.WIFI && networkState != Connection.ETHERNET ){
		console.log('Revisa tu conexión a internet');
		alert('Revisa tu conexión a internet : ' + states[networkState]);
	};
}
    
//REVISAR CAMBIO DE ROTACION
function orientationChange(e) {
	if(window.orientation == -90 || window.orientation == 90)console.log("Nueva Orientacion pantalla  :landscape");
	else{
		console.log("Nueva Orientacion pantalla :  portrait ");
    }
}

/*FUCIONES DE LOGIN*/
//EN CASO DE NO LOGEARSE 
function loginInvalido(data) { 
	navigator.notification.vibrate(1000);
	alert("Email o Usuario invalido");
}

function loginValido(data) {
	navigator.notification.beep(1);
    $.mobile.changePage("#pageCorreos");
	abrirSession(data);
}
    
//ENVIAR LA INFORMACION DEL FORMULARIO PETICION AJAX AL SERVIDOR
function login(){
	var parametros = {email: $("#email").val() , password : $("#password").val() };
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/json_login.php",
		data: parametros,
		success: function(data){ // si la respuestas es true muestra mensaje
			if( data != false ){
				loginValido(data);
			}
			else
			{
				loginInvalido(data);
			}
	  },
	  error : function(data){
		  alert("Error al concectarse al servidor");
	  },
	  dataType: "json"
	});
}
 
//FUNCIONES ALTA USUARIO
function errorIncripcion(){
	alert("ERROR AL SUBSCRIBIRSE");
}
	    
//ENVIAR LA INFORMACION DEL FORMULARIO PETICION AJAX AL SERVIDOR 
function registrar(){
	if( $("#mail").val() != $("#mail2").val() ){
		alert("Email distintos");
		return false;
	}
	if( $("#pass").val() != $("#pass2").val() ){
		alert("Contraseñas distintas");
		return false;
	}
	// FORMATO JSON {name:value, name:value , ...}
	var parametros = { mail: $("#mail").val() , pass : $("#pass").val(),  username: $("#username").val() };
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/controller_alta.php",
		data: parametros,
		success: function(data){
			if(data != false ){
				alert("Gracias por registrarse");
		         $.mobile.changePage("#pageLogin");
			}
			alert(data);
		},
		error : function(){
			alert("Intentalo mas tarde");
	         $.mobile.changePage("#pageLogin");
		},
		dataType: "json"
	});
}   
	    
//ENVIAR EMAIL PAGINA CORREO
function email(){
	var a=$("#mail_email").val();
	var b=$("#mail_asunto").val();
	var c=$("#mail_cuerpo").val();
	var parametros = { mail: a ,  asunto : b ,  cuerpo: c };
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/json_email.php",
		data: parametros,
		success: function(data){
			if(data == true ){
				alert("Email enviado con exito");
		         $.mobile.changePage("#pageCorreos");
			}
			else{
				alert(data);	
			}
		},
		error : function(){
			alert("Intenta enviar el correo mas tarde");
		},
		dataType: "json"		
	});	 
}
	
//RECUPERAR PASSWORD
function recuperar(){
	console.log("FUNCION RESTAURAR");
	var parametros = { email: $("#emailrecuperar").val()  };
	console.log("ENVIANDO A json_restarurar email : " + $("#emailrecuperar").val() );
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/json_restaurar.php",
		data: parametros,
		success: function(data){ 
			if(data == true){
				alert("Enviamos tu password, revisa tu correo!");
		         $.mobile.changePage("#pageLogin");
	      	}
			else {
				console.log("ERORR AL RECUPERAR LA CONTRASEÑA"+ data);
				alert("Ocurrio un error, revisa tu email");
			}
		},
		dataType: "json"
	});
}
	   
	
//LISTAR CONTACTOS PARA ENVIAR CORREO
function listarContactosCorreos(){
	var id= window.localStorage.getItem("id");
	console.log("LISTAR CONTACTOS AREA DE CORREO, DEL USERNAME " + id );
	var parametros = { username:  id };
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/json_contactos.php",
		data: parametros,
		success: function(data){
			console.log("XXX");
			$("#mail_email").empty();
			console.log(data);
			listarCorreos(data);
		},
		error:function(){
			alert("no se pudo obtener tus contactos");
		},
		dataType: "json"
	});
}

//INTERAMOS EL ARREGLO
function listarCorreos(data) {
	for (var i = 0; i < data.length; i++) {
		listarCorreo(data[i]);
	}
}

//INTERAMOS EL OBJETO 
function listarCorreo(rowData) {
	console.log("NUEVA OPCION PARA ENVIAR CORREO " + rowData.correo );
	$("#mail_email").append('<option value="' + rowData.correo + ' "  > ' + rowData.nombre + '</option>');
}
   
 //LISTAR CONTACTOS PARA EDICION
function listarContactos(){
	var id= window.localStorage.getItem("id");
	console.log("LISTAR CONTACTOS DEL USERNAME " + id );
 	var parametros = { username:  id };
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/json_contactos.php",
		data: parametros,
		success: function(data){
			$("#personDataTable").empty();
			drawTable(data);
			$( "#personDataTable" ).listview( "refresh" );
		},
		error:function(){
			alert("No se pudo obtener los contactos, revisa tu conexión");
		},
		dataType: "json"
	});				
}

//INTERAMOS EL ARREGLO
function drawTable(data) {
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}
	
//INTERAMOS EL OBJETO 
function drawRow(rowData) {
    $("#personDataTable").append("<li><a href='#' ><h3>" + rowData.nombre + "</h3><p>" + rowData.correo + "</p>"+'</a><a href="#"  onclick=\'eliminarContacto (" '+rowData.id+' " )\'  >Borrar</a></li>');
}

//ELIMINAR CONTACTO 
function eliminarContacto(id){
	console.log("ELIMINAR CONTACTO ");
	var parametros = { id : id };
		$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/controller_eliminar_contacto.php",
		data: parametros,
		success: function(data){
	         listarContactos();
	 		listarContactosCorreos();
	         $.mobile.changePage("#pageEditContactos", { transition: "slideup", changeHash: false });
	         alert("Contacto Eliminado");
		},
		error:function(){
			alert("No se pudo eliminar contacto, intentalo mas tarde");
	         $.mobile.changePage("#pageCorreos");
		},
		dataType: "json"
	});
}

//PAGINA DE ALTA DE CONTACTO
function altaContacto(){
	var id =  window.localStorage.getItem("id");
	console.log("ALTA CONTACTO CON ID USERNAME = "+ id );
	var parametros = {nombre: $("#nombre").val() , correo : $("#correo").val() , telefono : $("#telefono").val() , username : id };
	$.ajax({
		type: "POST",
		url: "http://rsaldivar.x10.mx/android/controller_alta_contacto.php",
		data: parametros,
		success: function(data){
			if(data != false ){
				alert("Contacto Agregado");
		        listarContactos();
				listarContactosCorreos();
		        $.mobile.changePage("#pageEditContactos", { transition: "slideup", changeHash: false });
			}
		},
		error : function(){
			alert("Intentalo mas tarde");
	         $.mobile.changePage("#pageContactos");
		},
		dataType: "json"
	});
}