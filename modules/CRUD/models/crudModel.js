//--------------------------------------------------------------MODELOS de CRUD--------------------------------------------------------------------

var datosForm;
async function datosCrudForm() {
    if (datosForm) {
        return Promise.resolve(datosForm);
    } else {
        return fetch('/crud/cargaDatosCrud')
            .then(response => {
                // Maneja la respuesta recibida del servidor
                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }
                return response.json(); // Convierte la respuesta en formato JSON
            })
            .then(data => {
                datosForm = data;
                return datosForm;
            })
            .catch(error => {
                console.error('Error:', error);
                throw error;
            });
    }
}



async function cargarCrudForm(){
    datosForm = await datosCrudForm();
    datosForm.forEach(data => {
        var filtro = data['clave']; //obtiene el nombre de la clave para indicar en que formulario agregar las opciones
        if (filtro == 'modalidad' || filtro == 'localidad' || filtro == 'nivel' || filtro == 'departamento'||filtro == 'ambito'){
            data["valor"].forEach(datos =>{
                var select = document.getElementById(`form-select-${filtro}`); //se inyecta la clave para seleccionar el formulario
                const option = document.createElement('option');
                option.value = datos['id'] ? datos['id'] : datos[filtro];
                option.text = datos[filtro];
                select.appendChild(option);
            
            })
        } else if (filtro == 'cueanexo') {
            data["valor"].forEach(datos =>{
                var select = document.getElementById(`form-select-${filtro}`); //se inyecta la clave para seleccionar el formulario
                const option = document.createElement('option');
                option.text = datos.cueanexo;
                option.value = datos.cueanexo;
                select.appendChild(option);
            })
        }
    })
}
cargarCrudForm();

var argenMapaUrl = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png';
var argenMapaAttrib ='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>';


var map = new L.map('map', {
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft',
		forceSeparateButton: true
	}
});

L.tileLayer(argenMapaUrl, {minZoom: 4, maxZoom: 20, attribution: argenMapaAttrib}).addTo(map);

map.setView([-44.2,-68], 7);


const mapaDiv = document.getElementById('map');
var marker = new L.marker();
mapaDiv.addEventListener('click', function () {
    // Evento al hacer clic en el mapa
    map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        
        try {
        const response = await fetch(`crud/convert?lng=${lng}&lat=${lat}`);
        if (!response.ok) {
            throw new Error('Error al convertir las coordenadas');
        }

        var data = await response.json();
        if (marker._leaflet_id){ 
            map.removeLayer(marker);
        }
        marker.setLatLng([lat,lng]).addTo(map);
        const ubiText = document.getElementById('ubiCrearInst')
        ubiText.innerHTML = '<i class="bi bi-pin-map-fill"></i> ' + 'lat: '+lat + ' Lng: ' + lng
        } catch (error) {
        console.error(error);
        alert('No se pudo convertir las coordenadas');
        }
    });
});



function validarInstitucion(data){
    var isValid = true;
    var error = [];
    //numero, cue, anexo cp, web, tel
    const regexCodJuris = /^\d+$/
    const regexCue = /^\d{7}$/
    const regexAnexo = /^\d{2}$/
    const regexCp = /^[U]?[0-9]{4}/
    const regexEmail = /^\w+[@]\w*[.]\w*/
    Object.keys(data).forEach(value => {
        switch (value) {
            case 'numero':
                    if (!regexCodJuris.test(data[value])) {
                        isValid = false
                        error.push('El Codigo Jurisdiccional debe ser un numero positivo')
                    }
                break;
            case 'cue':
                    if(!regexCue.test(data[value])) {
                        isValid = false
                        error.push('El CUE debe contener exactamente 7 digitos')
                    }
                break;
            case 'cue':
                    if(!regexAnexo.test(data[value])) {
                        isValid = false
                        error.push('El Anexo debe contener exactamente 2 numeros(00 a 99)')
                    }
                break;
            case 'cp':
                    if(!regexCp.test(data[value])) {
                        isValid = false
                        error.push('El Codigo Postal debe contener al menos 4 digitos')
                    }
                break;
            case 'web':
                    try {
                        new URL(data[value]);
                        isValid = false;
                        error.push('El sitio web ingresado es invalido')
                    } catch (e) {
                        return false
                    }
                break;
            case 'email':
                    if(!regexEmail.test(data[value])) {
                        isValid = false
                        error.push('El correo es invalido')
                    }
                break;
        }
    })

    return [isValid, error];
}

function buscarInstitucion (cue) {
    //const id = cue.id;
    console.log('buscando')
    fetch(`obtenerDatos?id=${cue}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(data => {
        divDatos = document.getElementById('datosInstitucionBorrar')
        divDatos.innerHTML = `
                <h4>Esta es la institucion que desea borrar?</h4><br>
                <p>Nombre: ${data.nombre}</p><br>
                <p>Cod. Jurisdiccional: ${data.numero}</p><br>
                <p>Domicilio: ${data.domicilio}</p><br>
                <p>localidad: ${data.localidad}</p><br>
            `
        document.getElementById('botonBorrar').setAttribute('value', data.id_institucion)
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function seleccionarInstitucion () {
    const cue = document.getElementById('cueanexoFormBorrar');
    datosForm.forEach(data => {
        if (data.clave == 'cueanexo'){
            data.valor.forEach(valor => {
                if (valor.cueanexo == cue.value){
                    buscarInstitucion(valor.id);
                } else {
                    divDatos = document.getElementById('datosInstitucionBorrar')
                    divDatos.innerHTML = `
                            <h4>La institucion que desea borrar no existe</h4><br>
                        `
                }
            })
        }
    })
}


function createLayer () {
    var departamento = document.getElementById('form-select-departamento').value;
    var localidad = document.getElementById('form-select-localidad').value;
    var numero = document.getElementById('codJurisFormCrear').value;
    var cue = document.getElementById('cueFormCrear').value;
    var anexo = document.getElementById('anexoFormCrear').value;
    var funcion = "Activo";
    var region = document.getElementById('form-select-region').value;
    var domicilio = document.getElementById('direccionFormCrear').value;
    var cp = document.getElementById('cpFormCrear').value;
    var ambito = document.getElementById('form-select-ambito').value;
    var web = document.getElementById('webFormCrear').value;
    var email = document.getElementById('emailFormCrear').value;
    var nombre = document.getElementById('nombreFormCrear').value;
    var tel = document.getElementById('telFormCrear').value;
    var cue_anexo = '' + cue + anexo;
    var data = {
        departamento : departamento,
        localidad: localidad,
        numero: numero,
        cue: cue,
        anexo: anexo,
        funcion: funcion,
        region: region,
        domicilio:domicilio,
        cp: cp,
        ambito: ambito,
        web: web,
        email:email,
        nombre: nombre,
        tel: tel,
        cue_anexo: cue_anexo,
        lat: marker._latlng.lat,
        long: marker._latlng.lng
    }
    var validacion = validarInstitucion(data);

    if (validacion[0]) {
        fetch(`crud/exist?id=${cue_anexo}`)
        .then(response => {
            if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(exists => {
            if (!exists) {
                fetch('insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(responseData => console.log('Respuesta del servidor:', responseData))
                .catch(error => console.error('Error:', error));
            } else {
                console.log('El registro ya existe');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        const errorDiv = document.getElementById('erroresForm')
        errorDiv.innerHTML= '';
        validacion[1].forEach(error =>{
            const text = document.createElement('p')
            var logo = document.createElement('i')
            logo.setAttribute('class' ,'bi bi-exclamation-circle');
            logo.setAttribute('style', 'color:red;')
            text.innerText = error
            text.setAttribute('class', 'errorP')
            errorDiv.appendChild(logo);
            errorDiv.appendChild(text);
            errorDiv.appendChild(document.createElement('br'));
            errorDiv.setAttribute('style', 'display: inline-block');
            console.log(error);
        })
    }
}

function readLayer () {
    
}

function updateLayer () {

}

function deleteLayer () {
    const id = document.getElementById('botonBorrar').value;
    if (id) {
        fetch(`delete?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            // Maneja la respuesta recibida del servidor
            if (!response.ok) {
                throw new Error('Error al realizar la consulta');
            }
            return response.json(); // Convierte la respuesta en formato JSON
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        divDatos = document.getElementById('datosInstitucionBorrar')
        divDatos.innerHTML = `
                <h4>No ha seleccionado ninguna institucion</h4><br>
            `
    }
}




