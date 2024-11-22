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
        if (filtro == 'modalidad' || filtro == 'localidad' || filtro == 'nivel' || filtro == 'departamento'){
            data["valor"].forEach(datos =>{
                var select = document.getElementById(`form-select-${filtro}`); //se inyecta la clave para seleccionar el formulario
                const option = document.createElement('option');
                option.value = datos[filtro];
                option.text = datos[filtro];
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
        } catch (error) {
        console.error(error);
        alert('No se pudo convertir las coordenadas');
        }
    });
});




function createLayer () {

}

function readLayer () {
    
}

function updateLayer () {

}

function deleteLayer () {

}


console.log("dentro del crud")
