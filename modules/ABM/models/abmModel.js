//--------------------------------------------------------------MODELOS de ABM--------------------------------------------------------------------


var datosForm;
async function datosCrudForm() {
    if (datosForm) {
        return Promise.resolve(datosForm);
    } else {
        return fetch('/abm/cargaDatosCrud')
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
                var selectModificar = document.getElementById(`form-select-modificar-${filtro}`);
                const option = document.createElement('option');
                option.value = datos['id'] ? datos['id'] : datos[filtro];
                option.text = datos[filtro];
                const optionMod = document.createElement('option');
                optionMod.value = datos['id'] ? datos['id'] : datos[filtro];
                optionMod.text = datos[filtro];
                select.appendChild(option);
                selectModificar.appendChild(optionMod)
            
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


var map = new L.map('map');

L.tileLayer(argenMapaUrl, {minZoom: 4, maxZoom: 20, attribution: argenMapaAttrib}).addTo(map);

map.setView([-44.2,-68], 7);


const mapaDiv = document.getElementById('map');
const modalMapa = document.getElementById('ubicacion-tab')
modalMapa.addEventListener('click', () => {
    map.invalidateSize()
})
var marker = new L.marker();
mapaDiv.addEventListener('click', function () {
    // Evento al hacer clic en el mapa
    map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        
        try {
        const response = await fetch(`abm/convert?lng=${lng}&lat=${lat}`);
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

function buscarDato (dato, valor) {
    datosForm.forEach(data => {
        var filtro = data['clave']; //obtiene el nombre de la clave para indicar en que formulario agregar las opciones
        if (filtro == dato){
            data["valor"].forEach(datos =>{
                if (datos[filtro] == valor) {
                    return id = datos.id;
                }            
            })
        }
    })
    return id
}

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

async function buscarInstitucion (cue, accion) {
    if (!cue == ''){
        return fetch(`obtenerDatos?id=${cue}`)
        .then(response => {
            // Maneja la respuesta recibida del servidor
            if (!response.ok) {
                throw new Error('Error al obtener los datos');
            }
            return response.json(); // Convierte la respuesta en formato JSON
        })
        .then(data => {
            if (accion == 'Modificar') {
                const divDatosModificar = document.getElementById('datosInstitucionModificar')
                divDatosModificar.innerHTML = '';
                const formDatosModificar = document.getElementById('formDatosModificar')
                formDatosModificar.setAttribute('style', 'display: block')
                document.getElementById('form-select-modificar-localidad').value = buscarDato('localidad', data.localidad)
                document.getElementById('form-select-modificar-departamento').value = buscarDato('departamento', data.departamento)
                document.getElementById('codJurisFormModificar').value = data.numero;
                document.getElementById('cueFormModificar').value = data.cue;
                document.getElementById('anexoFormModificar').value = data.anexo;
                document.getElementById('form-select-modificar-region').value = data.region;
                document.getElementById('direccionFormModificar').value = data.domicilio;
                document.getElementById('cpFormModificar').value= data.cp;
                document.getElementById('form-select-modificar-ambito').value = data.ambito;
                document.getElementById('webFormModificar').value = data.web;
                document.getElementById('emailFormModificar').value = data.email_inst;
                document.getElementById('nombreFormModificar').value = data.nombre;
                document.getElementById('telFormModificar').value = data.tel;
                document.getElementById('form-select-modificar-nivel').value = buscarDato('nivel', data.nivel);
                document.getElementById('form-select-modificar-modalidad').value = buscarDato('modalidad', data.modalidad);
            } else {
                divDatos = document.getElementById('datosInstitucionBorrar')
                            divDatos.innerHTML = `
                                    <h4>La institucion que desea borrar es la siguiente?</h4><br>
                                    <p>Nombre: ${data.nombre}</p><br>
                                    <p>Numero: ${data.numero}</p><br>
                                    <p>Anexo: ${data.anexo}</p><br>
                                    <p>Domicilio: ${data.domicilio}</p><br>
                                `
            }
            return data.id_institucion
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        divDatos = document.getElementById(`datosInstitucion${accion}`)
            divDatos.innerHTML = `
                    <h4>La institucion no existe</h4><br>
                `
    }
}

async function seleccionarInstitucion (accion) {
    var cue = ''
    var escuela = ''
    if (accion == "Borrar") {
        cue = document.getElementById(`cueanexoFormBorrar`).value;
        datosForm.forEach(data => {
            if (data.clave == 'cueanexo'){
                data.valor.forEach(valor => {
                    if (valor.cueanexo == cue){
                        escuela = valor.id
                    }
                })
            }
        })
        /*if (escuela == '') {
            divDatos = document.getElementById('datosInstitucionBorrar')
            divDatos.innerHTML = `
                    <h4>La institucion no existe</h4><br>
                `
        }*/
    } else if (accion = 'Modificar') {
        cue = document.getElementById('cueanexoFormModificar').value;
        datosForm.forEach(data => {
            if (data.clave == 'cueanexo'){
                data.valor.forEach(valor => {
                    if (valor.cueanexo == cue){
                        escuela = valor.id
                    } 
                })
            }
        })
        /*if (escuela == '') {
            document.getElementById('formDatosModificar').innerHTML = '';
            divDatos = document.getElementById('datosInstitucionModificar')
            divDatos.innerHTML = `
                    <h4>La institucion no existe</h4><br>
                `
            
        }*/
    }
    const id = await buscarInstitucion(escuela, accion);
    document.getElementById(`boton${accion}`).setAttribute('value', id)
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
    var nivel = document.getElementById('form-select-nivel').value;
    var modalidad = document.getElementById('form-select-modalidad').value;
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
        long: marker._latlng.lng,
        nivel: nivel,
        modalidad: modalidad
    }
    var validacion = validarInstitucion(data);

    if (validacion[0]) {
        fetch(`abm/exist?id=${cue_anexo}`)
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

function updateLayer () {
    const id = document.getElementById('botonModificar').value;
    fetch(`obtenerDatos?id=${id}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(data => {
        const divDatosModificar = document.getElementById('datosInstitucionModificar')
        divDatosModificar.innerHTML = '';
        const formDatosModificar = document.getElementById('formDatosModificar')
        formDatosModificar.setAttribute('style', 'display: block')
        const localidad = document.getElementById('form-select-modificar-localidad').value
        const departamento = document.getElementById('form-select-modificar-departamento').value
        const numero = document.getElementById('codJurisFormModificar').value
        document.getElementById('cueFormModificar').value
        document.getElementById('anexoFormModificar').value
        const region = document.getElementById('form-select-modificar-region').value
        const domicilio = document.getElementById('direccionFormModificar').value
        const cp = document.getElementById('cpFormModificar').value
        const ambito = document.getElementById('form-select-modificar-ambito').value
        const web = document.getElementById('webFormModificar').value
        const email = document.getElementById('emailFormModificar').value
        const nombre = document.getElementById('nombreFormModificar').value 
        const tel = document.getElementById('telFormModificar').value
        const nivel = document.getElementById('form-select-modificar-nivel').value
        const modalidad = document.getElementById('form-select-modificar-modalidad').value
        var data = {
            id: data.id_institucion,
            departamento : departamento,
            localidad: localidad,
            numero: numero,
            region: region,
            domicilio:domicilio,
            cp: cp,
            ambito: ambito,
            web: web,
            email:email,
            nombre: nombre,
            tel: tel,
            nivel: nivel,
            modalidad: modalidad
        }
        fetch('update', {
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
            divDatos = document.getElementById('datosInstitucionModificar')
                        divDatos.innerHTML = `
                                <h4>La institucion ha sido modificada</h4><br>
                            `
            return response.json();
        })
        .then(responseData => console.log('Respuesta del servidor:', responseData))
        .catch(error => console.error('Error:', error));
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
            divDatos = document.getElementById('datosInstitucionBorrar')
                    divDatos.innerHTML =`<br><h4 style="color: red;">Ha borrado la institucion</h4><br>`
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

function logOut(){
    fetch(`http://localhost:3005/logout`,{
        method: 'POST',
        credentials: 'include'
    })
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        } else {
            window.location.href = '/auth'
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


