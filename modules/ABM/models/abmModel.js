//--------------------------------------------------------------MODELOS de ABM--------------------------------------------------------------------


var datosForm;
async function datosAbmForm() {
    if (datosForm) {
        return Promise.resolve(datosForm);
    } else {
        return fetch('/abm/cargaDatosABM')
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



async function cargarAbmForm(){
    datosForm = await datosAbmForm();
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
cargarAbmForm();

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
        const response = await fetch(`/abmservices/convert?lng=${lng}&lat=${lat}`);
        if (!response.ok) {
            throw new Error('Error al solicitar servicio de conversion');
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
                document.getElementById('form-select-modificar-modalidad').value = buscarDato('modalidad', data.modalidad);
                data.nivel = data.nivel.replace(" ", "");
                if (data.nivel.split(",").length == 0){
                    console.log(`form-checkbox-modificar-nivel-${nivel}`)
                    document.getElementById(`form-checkbox-modificar-nivel-${data.nivel}`).setAttribute("checked","");
                } else {
                    data.nivel.split(',').forEach(nivel => {
                        console.log(`form-checkbox-modificar-nivel-${nivel}`)
                        document.getElementById(`form-checkbox-modificar-nivel-${nivel}`).setAttribute("checked","");
                    })
                }
                
            } else {
                divDatos = document.getElementById('datosInstitucionBorrar')
                            divDatos.innerHTML = `
                                    <h4>La institucion que desea borrar es la siguiente?</h4><br>
                                    <p>Nombre: ${data.nombre}</p><br>
                                    <p>Numero: ${data.numero}</p><br>
                                    <p>Anexo: ${data.anexo}</p><br>
                                    <p>Domicilio: ${data.domicilio}</p><br>
                                    <p>Acción:</p>
                                    <select id="accionBorrar" class="form-select" value="baja">
                                        <option value="baja" selected>Baja</option>
                                        <option value="eliminar">Eliminar</option>
                                    </select>
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
    } else if (accion == 'Modificar') {
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
    var nivel = [document.getElementById('form-checkbox-modificar-nivel-Inicial').value, document.getElementById('form-checkbox-modificar-nivel-Primario').value,document.getElementById('form-checkbox-modificar-nivel-Secundario').value, document.getElementById('form-checkbox-modificar-nivel-Superior').value];
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
    data = {
        departamento : {
            tabla: "departamento",
            departamento: departamento
        },
        localidad: {
            tabla:"localidad",
            localidad: localidad
        },
        institucion : {
            tabla: "institucion",
            numero: numero,
            cue: cue,
            anexo: anexo,
            region: region,
            domicilio:domicilio,
            ambito: ambito,
            cp: cp,
            web: web,
            email:email,
            nombre: nombre,
            tel: tel,
            cue_anexo: cue_anexo,
            funcion: funcion,
        },
        georeferencia: {
            tabla: "georeferencia",
            lat: marker._latlng.lat,
            long: marker._latlng.lng,
        },
        nivel: {
            tabla: "nivel",
            nivel: nivel
        },
        modalidad: {
            tabla: "modalidades_esducativas",
            modalidad:modalidad
        }
    }


    if (validacion[0]) {
        fetch(`/abmservices/exist?id=${cue_anexo}`)
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

async function updateLayer() {
    try {
        const id = document.getElementById('botonModificar').value;

        // Obtener datos actuales
        const response = await fetch(`obtenerDatos?id=${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();

        // Mostrar formulario
        const formDatosModificar = document.getElementById('formDatosModificar');
        formDatosModificar.style.display = "block";

        // Tomar valores del formulario
        const datosNuevos = {
            institucion: {
                tabla:"institucion",
                id: data.id_institucion,
                numero: document.getElementById('codJurisFormModificar').value,
                region: document.getElementById('form-select-modificar-region').value,
                domicilio: document.getElementById('direccionFormModificar').value,
                cp: document.getElementById('cpFormModificar').value,
                ambito: document.getElementById('form-select-modificar-ambito').value,
                web: document.getElementById('webFormModificar').value,
                email: document.getElementById('emailFormModificar').value,
                nombre: document.getElementById('nombreFormModificar').value,
                tel: document.getElementById('telFormModificar').value,

            },
            departamento: {
                tabla: "departamento",
                departamento: document.getElementById('form-select-modificar-departamento').value
            },
            localidad: {
                tabla: "localidad",
                localidad: document.getElementById('form-select-modificar-localidad').value
            },
            nivel: {
                tabla: "nivel",
                nivel: [document.getElementById('form-checkbox-modificar-nivel-Inicial').value, document.getElementById('form-checkbox-modificar-nivel-Primario').value,document.getElementById('form-checkbox-modificar-nivel-Secundario').value, document.getElementById('form-checkbox-modificar-nivel-Superior').value]
            },
            modalidad: {
                tabla: "modalidades_educativas",
                modalidad: document.getElementById('form-select-modificar-modalidad').value
            }
        };

        const datosModificados = await compararRegistros(data, datosNuevos)
        console.log(data);
        
        console.log(datosModificados);

        // Construir lo que va al backend
        const dataCambios = {
            dato_nuevo: datosNuevos,
            tipo_cambio: 'modificacion',
            clave_primaria: id
        };

        // Enviar actualización al servidor
        const updateRes = await fetch('update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // El backend obtiene el usuario desde la cookie JWT automáticamente
            body: JSON.stringify(dataCambios)
        });

        if (!updateRes.ok) {
            throw new Error(`Error del servidor: ${updateRes.status}`);
        }

        const updateData = await updateRes.json();

        // Mostrar mensaje de éxito
        document.getElementById('datosInstitucionModificar').innerHTML = `
            <h4>Los cambios sobre la institucion han sido propuestos correctamente</h4>
        `;

        console.log("Respuesta del servidor:", updateData);

    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al actualizar la institución.");
    }
}


function deleteLayer () {
    const id = document.getElementById('botonBorrar').value;
    const accion = document.getElementById('accionBorrar').value
    if (id) {
        fetch(`delete?id=${id}&accion=${accion}`, {
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
            if(accion=="borrar") {
                divDatos.innerHTML =`<br><h4 style="color: red;">Ha solicitado borrar la institucion</h4><br>`
            } else {
                divDatos.innerHTML =`<br><h4 style="color: red;">Ha solicitado dar de baja la institucion</h4><br>`
            }
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

fetch('/session-info')
  .then(res => res.json())
  .then(info => {
    if (info.loggedIn && info.role === 'admin') {
      document.getElementById('buttonD').style.display = 'inline-block';
    }
  });

  function compararRegistros(registroA, registroB) {
    const resultado = {};
    var registroPlanoB = {};
    Object.keys(registroB).forEach(clavesMacroB =>{
        Object.keys(registroB[clavesMacroB]).forEach(clavesB => {
            if(clavesB !== "tabla"){
                datosForm.forEach(datos =>{
                    if (datos.clave == clavesB && registroPlanoB[clavesB] == undefined){    
                        datos.valor.forEach(datoBase =>{
                            if (datoBase.id == registroB[clavesMacroB][clavesB]){
                                registroPlanoB[clavesB] = datoBase[clavesB]
                            }
                        })
                    }
                })   
            }
            if (registroPlanoB[clavesB] == undefined && clavesB !== "tabla"){
                registroPlanoB[clavesB] = registroB[clavesMacroB][clavesB]
            }                     
        })
    })
    //registroPlanoB[clavesB] = registroB[clavesMacroB][clavesB]
    // Obtener solo las claves que existen en ambos registros
    const clavesComunes = Object.keys(registroA).filter(
        clave => clave in registroPlanoB
    );
    // Comparar los valores
    clavesComunes.forEach(clave => {
        if (registroA[clave] !== registroPlanoB[clave]) {
        resultado[clave] = {
            antes: registroA[clave],
            despues: registroPlanoB[clave]
        };
        }
    });
    // Si no hay diferencias
    if (Object.keys(resultado).length === 0) {
        return null; // o return {}
    }

    return resultado;
    }


function agregarTuplaCambio(cambio) {
    const tbody = document.querySelector('#tablaCambios tbody');

    // Crear la fila
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${cambio.id}</td>
        <td>`+(typeof cambio.dato_nuevo.nombre === "undefined"?cambio.dato_anterior.nombre:cambio.dato_nuevo.nombre)+`</td>
        <td>`+(typeof cambio.dato_nuevo.numero === "undefined"?cambio.dato_anterior.numero:cambio.dato_nuevo.numero)+`</td>
        <td>${cambio.usuario}</td>
        <td><span class="badge bg-info text-dark">${cambio.tipo_cambio}</span></td>
        <td>${cambio.fecha_solicitud}</td>
        <td><button class="btn btn-sm btn-warning me-2 btn-cambios">Ver cambios</button></td>
        <td class="text-end">
            <button class="btn btn-sm btn-success me-2 btn-aprobar">Aprobar</button>
            <button class="btn btn-sm btn-danger btn-rechazar">Rechazar</button>
        </td>
    `;

    // Agregar fila a la tabla
    tbody.appendChild(tr);

    // Asignar eventos a los botones
    const btnAprobar = tr.querySelector('.btn-aprobar');
    const btnRechazar = tr.querySelector('.btn-rechazar');
    const btnCambios = tr.querySelector('.btn-cambios');

    btnAprobar.addEventListener('click', () => aprobarCambio(cambio.id));
    btnRechazar.addEventListener('click', () => rechazarCambio(cambio.id));
    btnCambios.addEventListener('click', () => {
        const diferencias = compararRegistros(cambio.dato_anterior, cambio.dato_nuevo);
        panelInfo=document.getElementById("panelInfo");
        panelInfo.innerHTML=`
            <table class="table table-hover align-middle mb-0 tabla-ver-cambios">
                <thead class="table-light sticky-top">
                    <tr>
                        <th>Listado de cambios</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
            <button class="btn btn-sm btn-secondary btn-cerrarpanelinfo">cerrar</button>
        `
        var tablaCambios = document.querySelector('.tabla-ver-cambios tbody')
        if (diferencias) {
            Object.keys(diferencias).forEach(campo => {
                tablaCambios.innerHTML += `
                    <tr>
                        <td>Campo: ${campo}<td>
                        <td>Antes: ${diferencias[campo].antes}<td>
                        <td>Despues: ${diferencias[campo].despues}<td>
                    </tr>
                `
             });
        } else if (cambio.tipo_cambio == "crear"){
            Object.keys(cambio.dato_nuevo).forEach(campo => {
                 tablaCambios.innerHTML += `
                    <tr>
                        <td>${campo}<td>
                        <td>${cambio.dato_nuevo[campo]}<td>
                    </tr>
                `
            })
        } else {
            Object.keys(cambio.dato_anterior).forEach(campo => {
                 tablaCambios.innerHTML += `
                    <tr>
                        <td>${campo}<td>
                        <td>${cambio.dato_anterior[campo]}<td>
                    </tr>
                `
            })
        }
        panelInfo.classList.remove("d-none");
        const btnCerrarPanelCambios = panelInfo.querySelector('.btn-cerrarpanelinfo');
        btnCerrarPanelCambios.addEventListener('click', () => {
            panelInfo.innerHTML = ' '
            panelInfo.classList.add("d-none")
        })
    })
}


// Funciones de acción (las conectás con tu backend)
function aprobarCambio(id) {
    console.log("Aprobando:", id);

    fetch(`aprobarCambio?id=${id}`, { method: "POST" })
        .then(res => res.json())
        .then(data => alert("Cambio aprobado"))
        .catch(err => console.error(err));
}

function rechazarCambio(id) {
    const razon = prompt("Ingrese motivo de rechazo:");
    if (!razon) return;

    console.log("Rechazando:", id, razon);

    fetch(`/rechazarCambio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, razon })
    })
    .then(res => res.json())
    .then(data => alert("Cambio rechazado"))
    .catch(err => console.error(err));
}

function obtenerModificaciones() {
    fetch('modificaciones')
    .then(res => res.json())
    .then(info => {
        info.forEach(cambio => {
            agregarTuplaCambio(cambio);
        })
    })
}

function cerrarListaModificacion(){
    const tbody = document.querySelector('#tablaCambios tbody');
    tbody.innerHTML=' ';
}

