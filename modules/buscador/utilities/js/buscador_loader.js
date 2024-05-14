// ` backticks
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM cargado");   
});
var datosBuscador = null;


async function obtenerDatosBuscador() {
    if (datosBuscador) {
        return Promise.resolve(datosBuscador);
    } else {
        return fetch('/buscador/cargaDatos')
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
    datosBuscador.then((data) => {
        var boton = obtenerBoton(event.target.id);
            data.forEach(element => {
                if (boton == element.clave) {
                    const num = document.getElementById(`select-${boton}`)
                    element.valor.forEach(valores =>{
                        if (valores[boton] == num.value) {
                            const buscar = cifrarDato(valores.id.toString(), 'SIGE2024');
                            window.location.href = `/info?num=${buscar}`;
                        }
                    })
                        
                }
            })          
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        })};    
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

var modalBusqueda = document.getElementById('modalBusqueda');
modalBusqueda.addEventListener('shown.bs.modal', function (event) {
    cargarDatosBuscador();
});
