document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM cargado");
       
});

function descifrarDato(datoCifrado, clave) {
  const bytes = CryptoJS.AES.decrypt(datoCifrado, clave);
  return bytes.toString(CryptoJS.enc.Utf8);
}

async function completarDatosInstitucion() {
    const parametros = new URLSearchParams(window.location.search);
    //var id = descifrarDato(parametros.get('num') , 'SIGE2024');
    var id = parametros.get('num')
    fetch(`info/obtenerDatos?num=${id}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(data => {
        //datos institucion
        document.getElementById('cabecera').innerText += ` ${data.numero}`;
        document.getElementById('cueanexoinfoadicional').innerHTML = `${data.cue_anexo}`;
        document.getElementById('funinfoadicional').innerHTML = `${data.funcion}`;
        document.getElementById('Regioninfoadicional').innerHTML = `${data.region}`;
        document.getElementById('departamentoinfoadicional').innerHTML = `${data.departamento}`;
        document.getElementById('Localidadinfoadicional').innerHTML = `${data.localidad}`;
        document.getElementById('calleinfoadicional').innerHTML = `${data.domicilio}`;
        document.getElementById('cod_postalinfoadicional').innerHTML = `${data.cp}`;
        document.getElementById('amginfoadicional').innerHTML = `${data.ambito}`
        //datos directivo
        document.getElementById('resp_respnsableinfoadicional').innerHTML = `${data.responsable}`;
        document.getElementById('telefonoinfoadicional').innerHTML = `${data.tel}`;
        document.getElementById('emailinfoadicional').innerHTML = `${data.email}`;
        document.getElementById('sitio_webinfoadicional').innerHTML = `${data.web}`;
        document.getElementById('resp_telresponsableinfoadicional').innerHTML = `${data.tel_resp}`;
        
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    fetch(`info/obtenerDatosAdc?num=${id}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(data => {
        //datos oferta
        data.forEach(element => {
            if (document.getElementById('turnoinfoadicional').innerHTML == ``) {
                document.getElementById('turnoinfoadicional').innerHTML = `${element.turno}`;
            } else if (!document.getElementById('turnoinfoadicional').innerHTML.includes(element.turno)) {
                document.getElementById('turnoinfoadicional').innerHTML += `/ ${element.turno}`
            }
            if (document.getElementById('jornadainfoadicional').innerHTML == ``) {
                document.getElementById('jornadainfoadicional').innerHTML = `${element.jornada}`;
            } else if (!document.getElementById('jornadainfoadicional').innerHTML.includes(element.jornada)) {
                document.getElementById('jornadainfoadicional').innerHTML += `/ ${element.jornada}`
            }
            if (document.getElementById('modalidadinfoadicional').innerHTML == ``) {
                document.getElementById('modalidadinfoadicional').innerHTML = `${element.modalidad}`;
            } else if (!document.getElementById('modalidadinfoadicional').innerHTML.includes(element.modalidad)) {
                document.getElementById('modalidadinfoadicional').innerHTML += `/ ${element.modalidad}`
            }
            if (document.getElementById('nivelesinfoadicional').innerHTML == ``) {
                document.getElementById('nivelesinfoadicional').innerHTML += `${element.nivel}`;
            } else if (!document.getElementById('nivelesinfoadicional').innerHTML.includes(element.nivel)) {
                document.getElementById('nivelesinfoadicional').innerHTML += `/ ${element.nivel}`
            }
        });
            
    })
    .catch(error => {
        console.error('Error:', error);
    });

        };

completarDatosInstitucion();