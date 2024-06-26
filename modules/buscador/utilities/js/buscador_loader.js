// ` backticks
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM cargado");   
});
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
        select = document.getElementById(`f-select-${result.clave}esc`); //se inyecta la clave para seleccionar el formulario
        result.valor.forEach(element => {
            const option = document.createElement('option');
            option.value = element[filtro];
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
                    coincidencias += 1;
                    var content = "<option class='list-group-item list-group-item-action' id='"+ data.cue + "-" + "xnumero" +"' value='"+ data.cue + "'onclick=itemsearchselected(this.id)  data-bs-toggle='list' role='tab' aria-controls='list-home'>"+ data.numero + " - " + data.nombre + " - " + data.cue_anexo + " - " + data.localidad + "</option>";
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
    console.log(miSelect);
    if(miSelect != ""){
        coincidencias = 0;
        fnombreescitem.innerHTML = " ";
        fetch('buscador/datos')
        .then(response => response.json())
        .then((escuelas) => {
            escuelas.forEach(data => {
                if (data.nombre == miSelect) {
                    coincidencias += 1;
                    var content = "<option class='list-group-item list-group-item-action' id='"+ data.cue + "-" + "xnombre" +"' value='"+ data.cue + "'onclick=itemsearchselected(this.id)  data-bs-toggle='list' role='tab' aria-controls='list-home'>"+ data.numero + " - " + data.nombre + " - " + data.cue_anexo + " - " + data.localidad + "</option>";
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

