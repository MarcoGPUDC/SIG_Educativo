// ` backticks
var datosBuscador = null;


async function obtenerDatosBuscador() {
    if (datosBuscador) {
        return Promise.resolve(datosBuscador);
    } else {
        return fetch('buscador/cargaDatos')
            .then(response => {
                // Maneja la respuesta recibida del servidor
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                return response.json(); // Convierte la respuesta en formato JSON
            })
            .then(data => {
                return data;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }
}

datosBuscador = obtenerDatosBuscador();

function cargarDatosBuscador() {
    datosBuscador.then((data) => {
        data.forEach(result => {
        //Doble for para recorrer la matriz de datos generada por "buscador_loader"
        var filtro = result.clave; //obtiene el nombre de la clave para indicar en que formulario agregar las opciones
        var select = document.getElementById(`f-select-${result.clave}esc`); //se inyecta la clave para seleccionar el formulario
        result.valor.forEach(element => {
            const option = document.createElement('option');
            option.value = element[filtro];
            option.text = element[filtro];
            select.appendChild(option);
            
        })
        //console.log(`${result.clave} cargados al buscador`);
    });

    })};

function obtenerBoton(cadena) {
    // Utilizar una expresión regular para buscar la palabra después de "f-info" y antes de "esc-item_btn"
    const match = cadena.match(/f-info(.+?)esc-item_btn/); //f-infonumeroesc-item_btn los id de los botones de los formularios siguen es regla 
    if (match) {
        // El grupo capturado en la expresión regular contendrá la palabra buscada
        return match[1]; // Devolver la palabra encontrada
    } else {
        // Si no se encuentra ninguna coincidencia, devolver null
        return null;
    }
}

function cifrarDato(valor, clave) {
    return CryptoJS.AES.encrypt(valor, clave).toString();
}

function verInfo(event) {
    var boton = obtenerBoton(event.target.id);
    const select = document.getElementById(`f-${boton}esc-item`)
    const buscar = cifrarDato(select.value.toString(), 'SIGE2024');
    window.open(`info?num=${select.value}`, '_blank');
};

//buscar por numero
function isNa(value){
    var esnum = true;
    if (isNaN(value) || value.length == 0) {
        esnum = false;
    }
    return esnum;
}
function nroSelect(){	
    var numeroescbtn = document.getElementById("f-nroesc-item_btn");
    var numeroescbtnclean = document.getElementById("f-nroesc-item_btn_clean");
    var infoNro = document.getElementById("infoNumero");
    var infoNroError = document.getElementById("infoNumeroError");
    var infoNroErrorNonombre = document.getElementById("infoNumeroErrorNumero");
    var numeroescblockitem = document.getElementById("f-numeroesc-block-item");
    var fnumeroescitem = document.getElementById("f-numeroesc-item");
    var numeroesc = document.getElementById("select-numero");
    var miSelect = numeroesc.value;
    if(isNa(miSelect)){
        coincidencias = 0;
        fnumeroescitem.innerHTML = " ";
        fetch('buscador/datos')
        .then(response => response.json())
        .then((escuelas) => {
            escuelas.forEach(data => {
                if (data.numero == miSelect) {
                    // Cadena JSON
                    let jsonString = data.geom;
                    // Convertir la cadena JSON a un objeto JavaScript
                    let geoObject = JSON.parse(jsonString);
                    const long = geoObject.coordinates[0]
                    const lat = geoObject.coordinates[1]
                    coincidencias += 1;
                    var content =   "<ul class='list-group list-group-horizontal'>" +
                                    "<li class='list-group-item list-group-item-primary botonAñadirBuscador' id='"+ data.id_institucion + "-" + "xnumero" +"' value='"+ data.id_institucion + "'onclick=itemsearchselected(this.id)  data-bs-toggle='list' role='tab' aria-controls='list-home'>"+ data.numero + " - " + data.nombre + " - " + data.cue_anexo + " - " + data.localidad + "</li>" +
                                    "<button type='button' class='list-group-item list-group-item-warning botonIrBuscador' data-bs-dismiss='modal' id='botonIr"+data.id_institucion+"' value='"+lat+"/"+long+"'onclick=itemSearchUbicacion(this.value) aria-current='true'>Ir</button> </ul>"
                    fnumeroescitem.innerHTML += content;
                }
            })
            if(coincidencias > 0){
                numeroescblockitem.style.display = "block";
                infoNro.style.display= "block";
                infoNroError.style.display= "none";
                infoNroErrorNonombre.style.display= "none";
                numeroescbtn.style.display= "none";
                numeroescbtnclean.style.display= "block";
            } else {
                infoNro.style.display= "none";
                infoNroError.style.display= "none";
                infoNroErrorNonombre.style.display= "block";
            }
        })

    } else {
        infoNro.style.display= "none";
        infoNroError.style.display= "block";
        infoNroErrorNonombre.style.display= "none";
        numeroescblockitem.style.display = "none";
    }
}
//buscar por nombre
function nombreSelect() {
    var nombreescbtn = document.getElementById("f-nombreesc-item_btn");
    var nombreescbtnclean = document.getElementById("f-nombreesc-item_btn_clean");
    var infoNombre = document.getElementById("infoNombre");
    var infoNombreError = document.getElementById("infoNombreError");
    var infoNombreErrorNonombre = document.getElementById("infoNombreErrorNonombre");
    var nombreescblockitem = document.getElementById("nombreesc-block-item");
    var fnombreescitem = document.getElementById("f-nombreesc-item");
    var nombreesc = document.getElementById("select-nombre");
    var miSelect = nombreesc.value;
    if(miSelect != ""){
        coincidencias = 0;
        fnombreescitem.innerHTML = " ";
        fetch('buscador/datos')
        .then(response => response.json())
        .then((escuelas) => {
            escuelas.forEach(data => {
                if (data.nombre == miSelect) {
                     // Cadena JSON
                     let jsonString = data.geom;
                     // Convertir la cadena JSON a un objeto JavaScript
                     let geoObject = JSON.parse(jsonString);
                     const long = geoObject.coordinates[0]
                     const lat = geoObject.coordinates[1]
                     coincidencias += 1;
                    coincidencias += 1;
                    var content = "<ul class='list-group list-group-horizontal'>" +
                                    "<li class='list-group-item list-group-item-primary botonAñadirBuscador' id='"+ data.id_institucion + "-" + "xnumero" +"' value='"+ data.id_institucion + "'onclick=itemsearchselected(this.id)  data-bs-toggle='list' role='tab' aria-controls='list-home'>"+ data.numero + " - " + data.nombre + " - " + data.cue_anexo + " - " + data.localidad + "</li>" +
                                    "<button type='button' class='list-group-item list-group-item-warning botonIrBuscador' data-bs-dismiss='modal' id='botonIr"+data.id_institucion+"' value='"+lat+"/"+long+"'onclick=itemSearchUbicacion(this.value) aria-current='true'>Ir</button> </ul>"
                    fnombreescitem.innerHTML += content;
                }
            })
        if(coincidencias > 0){
            nombreescblockitem.style.display = "block";
            infoNombre.style.display= "block";
            infoNombreError.style.display= "none";
            infoNombreErrorNonombre.style.display= "none";
            nombreescbtn.style.display= "none";
            nombreescbtnclean.style.display= "block";
        } else {
            infoNombre.style.display= "none";
            infoNombreError.style.display= "none";
            infoNombreErrorNonombre.style.display= "block";
        }})
    }else {
        infoNombre.style.display= "none";
        infoNombreError.style.display= "block";
        infoNombreErrorNonombre.style.display= "none";
        nombreescblockitem.style.display = "none";
    }

}

//buscar por cue
function cue_valido(c){
	//si tiene 9 caracteres y son todos numeros es TRUE
	return (c.match(/^[0-9]+$/) != null && c.length == 9);
}

function cueAnexoSelect() {
	var infoCueAnexo = document.getElementById("infoCueAnexo");
	var infoCueAnexoError = document.getElementById("infoCueAnexoError");
	var infoCueAnexoErrorNoExiste = document.getElementById("infoCueAnexoErrorNoExiste");
	var infoCueNombreRepetidoFormControlSelect = document.getElementById("infoCueNombreRepetidoFormControlSelect");
	infoCueNombreRepetidoFormControlSelect.style.display = 'none';
	var fcue = document.getElementById("select-cue");
	var miSelect = fcue.value;
    var fcueescitem = document.getElementById("f-cueesc-item");
    var coincidencias = 0;
	if(cue_valido(miSelect)){
        infoCueAnexo.style.display = 'block';
        infoCueAnexoError.style.display = 'none';
        infoCueAnexoErrorNoExiste.style.display = 'none';
        fetch('buscador/datos')
        .then(response => response.json())
        .then((escuelas) => {
            escuelas.forEach(data => {
                if (data.cue_anexo === miSelect) {
                    console.log("entro")
                    coincidencias += 1;
                    // Cadena JSON
                    let jsonString = data.geom;
                    // Convertir la cadena JSON a un objeto JavaScript
                    let geoObject = JSON.parse(jsonString);
                    const long = geoObject.coordinates[0]
                    const lat = geoObject.coordinates[1]
                    var content = "<ul class='list-group list-group-horizontal'>" +
                                    "<li class='list-group-item list-group-item-primary botonAñadirBuscador' id='"+ data.id_institucion + "-" + "xnumero" +"' value='"+ data.id_institucion + "'onclick=itemsearchselected(this.id)  data-bs-toggle='list' role='tab' aria-controls='list-home'>"+ data.numero + " - " + data.nombre + " - " + data.cue_anexo + " - " + data.localidad + "</li>" +
                                    "<button type='button' class='list-group-item list-group-item-warning botonIrBuscador' data-bs-dismiss='modal' id='botonIr"+data.id_institucion+"' value='"+lat+"/"+long+"'onclick=itemSearchUbicacion(this.value) aria-current='true'>Ir</button> </ul>"
                    fcueescitem.innerHTML += content;
                }
            })
        
        if (coincidencias > 0){
            document.getElementById('cueesc-block-item').style.display = 'block';
        } else {
            infoCueAnexoErrorNoExiste.style.display = 'block';
        }
    })
    }else{
        infoCueNombreRepetidoFormControlSelect.style.display = 'none';
        infoCueAnexo.style.display = 'none';
        infoCueAnexoErrorNoExiste.style.display = 'none';
        infoCueAnexoError.style.display = 'block';
    }
}


//resetear formularios de modales

function resetForm() {
	/*form oferta
	var formOferta = document.getElementById("formOferta");
	var selectsformOferta = formOferta.getElementsByTagName('select');
	for (var i = 0; i<selectsformOferta.length; i++)
		selectsformOferta[i].value = "todo";
	document.getElementById("f-plan-estudio").style.display = "none";
	document.getElementById("infoofertamodalidadNoRepFormControlSelect").style.display = "none";
	document.getElementById("infoofertamodalidadNoConnFormControlSelect").style.display = "none";
	document.getElementById("infoofertaplaetudioNoConnFormControlSelect").style.display = "none";
	document.getElementById("infoofertafertaplaetudioNoRepFormControlSelect").style.display = "none";
	document.getElementById("infoofertaNoModalidadFormControlSelect").style.display = "none";
	document.getElementById("infoOfertaNombreRepetidoFormControlSelect").style.display = 'none';
	var nivel = document.getElementById("f-select-nivelesc");
	nivel.innerHTML = '';
	nivel.setAttribute("disabled", "");
	document.getElementById("infoofertafertadictadoNoRepFormControlSelect").style.display = 'none';
	document.getElementById("infoofertadictadoNoConnFormControlSelect").style.display = 'none';
	var dictado = document.getElementById("dictado");
	dictado.innerHTML = '';
	dictado.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
	dictado.value = "todo";
	document.getElementById("infonivelspinner").style.display = "none";
	document.getElementById("infoorientacionspinner").style.display = "none";
	document.getElementById("infodictadospinner").style.display = "none";
	document.getElementById("consultaofertaspinner").style.display = "none";
	//form localizacion
	var formLocalizacion = document.getElementById("formLocalizacion");
	var selectsformLocalizacion = formLocalizacion.getElementsByTagName('select');
	for (var i = 0; i<selectsformLocalizacion.length; i++)
		selectsformLocalizacion[i].value = "todo";
	document.getElementById("infoOfertaNoDatosFinalesFormControlSelect").style.display = 'none';
	document.getElementById("infoOfertaNoConnFinalesFormControlSelect").style.display = 'none';
	var loc = document.getElementById("departamentoFormControlSelect");
	var dir = document.getElementById("direccionFormControlSelect");
	loc.innerHTML = '';
	dir.innerHTML = '';
	loc.setAttribute("disabled", "");
	dir.setAttribute("disabled", "");
	document.getElementById("inforegionFormControlSelect").style.display = 'none';
	document.getElementById("infoLocNombreRepetidoFormControlSelect").style.display = 'none';
	document.getElementById("inforegionNoDatosFormControlSelect").style.display = 'none';
	document.getElementById("inforegionNoConnFormControlSelect").style.display = 'none';
	document.getElementById("infolocNoDatosFormControlSelect").style.display = 'none';
	document.getElementById("infolocNoConnFormControlSelect").style.display = 'none';
	document.getElementById("infolocNoDatosFinalesFormControlSelect").style.display = 'none';
	document.getElementById("infolocNoConnFinalesFormControlSelect").style.display = 'none';
	document.getElementById("inforegionspinner").style.display = 'none';
	document.getElementById("infolocspinner").style.display = 'none';
	document.getElementById("consultalocalizacionspinner").style.display = 'none';
	//form otros
	var form = document.getElementById("formOtros");
	var inputs = form.getElementsByTagName('input');
	for (var i = 0; i<inputs.length; i++) {
		switch (inputs[i].type) {
			case 'text':
			inputs[i].value = '';
			break;
			case 'radio':
			case 'checkbox':
				inputs[i].checked = false;   
		}
	}
	var selects = form.getElementsByTagName('select');
	for (var i = 0; i<selects.length; i++)
		selects[i].value = "todo";
	document.getElementById("paso1").style.display = 'block';
	document.getElementById("paso2").style.display = 'none';
	document.getElementById("paso3").style.display = 'none';
	document.getElementById("infoOtrosNoSelecFormControlSelect").style.display = 'none';
	document.getElementById("infotNoNombreFormControlSelect").style.display = 'none';
	document.getElementById("infoOtrosNoResultFormControlSelect").style.display = 'none';
	document.getElementById("infoOtrosNombreRepetidoFormControlSelect").style.display = 'none';
	document.getElementById("infoOtrosNoConnFormControlSelect").style.display = 'none';
	document.getElementById("consultaotrosspinner").style.display = 'none';
	//consultas simples
	document.getElementById("infoCueAnexo").style.display = 'block';
	document.getElementById("infoCueAnexoError").style.display = 'none';
	document.getElementById("infoCueAnexoErrorNoExiste").style.display = 'none';
	document.getElementById("f-cue").value = "";
	document.getElementById("infoCueNombreRepetidoFormControlSelect").style.display = 'none';
	limpiarItemsNombreEsc();
	limpiarItemsNroEsc();
	return false;*/
    return true
}       

function paso1apaso2(){
    var fielset1 = document.getElementById("paso1");
    var fielset2 = document.getElementById("paso2");
    fielset1.style.display = 'none';
    fielset2.style.display = 'block';
}

function paso2apaso3(){
    var fielset2 = document.getElementById("paso2");
    var fielset3 = document.getElementById("paso3");
    fielset2.style.display = 'none';
    fielset3.style.display = 'block';
}

function paso2apaso1(){
    var fielset2 = document.getElementById("paso2");
    var fielset1 = document.getElementById("paso1");
    fielset2.style.display = 'none';
    fielset1.style.display = 'block';
}

function paso3apaso2(){
    var fielset2 = document.getElementById("paso2");
    var fielset3 = document.getElementById("paso3");
    fielset3.style.display = 'none';
    fielset2.style.display = 'block';
}