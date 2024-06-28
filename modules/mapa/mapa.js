// Crear mapa ------------------------------------------------------------------------------

var mymap = new L.map('map'/*, {
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft',
		forceSeparateButton: true
	}
}*/); 

// Function to hide the loading screen
function hideLoadingScreen() {
	document.getElementById('loading-screen').style.display = 'none';
}

// Check if the map is completely loaded
mymap.whenReady(hideLoadingScreen);

// Tile mapas

var osmUrl ='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib ='Map data &copy;  <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a> contributors';
var argenMapaUrl = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png';
var argenMapaAttrib ='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a>'; //| <a href="http://pagina estadistica" target="_blank">DEyEE</a>
var googleStreetsUrl = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
var googleStreetsAttrib = 'Map data &copy; Google contributors';
var googleSatUrl = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
var googleSatAttrib = 'Map data &copy; Google contributors';

// Setear posicion central, esta cerca de los Altares

mymap.setView(new L.LatLng(-44.0,-68.41215),7);

if (screen.width < 540  || screen.height < 540){
   mymap.setView(new L.LatLng(-44.0,-68.41215),6); 
}

// Agregar escala

new L.control.scale({imperial: false, position: "bottomleft"}).addTo(mymap);

// Agrega tile layers

var iconLayers = [];
var tileLayer0 = L.tileLayer(osmUrl, {minZoom: 6, maxZoom: 19, attribution: osmAttrib});
var tileLayer1 = L.tileLayer(argenMapaUrl, {minZoom: 6, maxZoom: 20, attribution: argenMapaAttrib});
var tileLayer2 = L.tileLayer(googleStreetsUrl,{minZoom: 6, maxZoom: 20,subdomains:['mt0','mt1','mt2','mt3'], attribution: googleStreetsAttrib});
var tileLayer3 = L.tileLayer(googleSatUrl,{minZoom: 6, maxZoom: 20, subdomains:['mt0','mt1','mt2','mt3'], attribution: googleSatAttrib});
iconLayers.push({
	title: "ArgenMap",
	layer: tileLayer1,
	icon: 'icons/argenmap.png'
});
iconLayers.push({
	title: "GoogleStreets",
	layer: tileLayer2,
	icon: 'icons/google.png'
});
iconLayers.push({
	title: "OSM",
	layer: tileLayer0,
	icon: 'icons/openstreetmap_mapnik.png'
});
iconLayers.push({
	title: "GoogleSat",
	layer: tileLayer3,
	icon: 'icons/satellite.png'
});
var iconLayersControl = new L.Control.IconLayers(
	iconLayers, {
		position: 'bottomright'
	});
iconLayersControl.addTo(mymap);

// Variable para layers

var baselayer = L.layerGroup().addTo(mymap);

// boton centrar mapa

var centrarMapaButton = L.easyButton({
    states: [{
            stateName: 'fa-globe',
            icon:      "<img class='icon' src='icons/centerscreen-icon.png' style='width:26px; height:26px;'>", 
            title:     'Centrar mapa', 
            onClick: function(btn, map) { 
            	if (screen.width < 540  || screen.height < 540){
   					mymap.setView(new L.LatLng(-44.0,-68.41215),6); 
				} else {
					mymap.setView(new L.LatLng(-44.0,-68.41215),7);	
				}
            }
        }]
	
});
centrarMapaButton.addTo(mymap);


/*const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2lnLWUtYWRtaW4iLCJhIjoiY2x3cWd2dXl5MDI2NTJrcHFrajhxbWp5dSJ9.R_tS8eyc4BaaaRY1yd3NZw';

if (!MAPBOX_ACCESS_TOKEN) {
	console.error('Debes proporcionar un token de acceso válido para Mapbox.');
}
var geocoder = L.Control.Geocoder.mapbox('MAPBOX_ACCESS_TOKEN');
*/
// Maneja el evento de búsqueda cuando el usuario presiona Enter
/*document.getElementById('address').addEventListener('keydown', function(event) {
		
  if (event.key == 'Enter' && event.target.value.length> 2) {
	var dirs = document.getElementById('resultados-buscador');
	dirs.innerHTML = '<p>resultados</p>';
	dirs.classList.toggle('d-none')
	var query = event.target.value;
	//fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_ACCESS_TOKEN}&types=address`)
	//fetch(`https://apis.datos.gob.ar/georef/api/direcciones?direccion=${query}&departamento=rawson&provincia=chubut`)
	//fetch(`https://apis.datos.gob.ar/georef/api/direcciones?provincia=chubut&direccion=${query}&format=jsonv2`)
	var marcadores = [];
	fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&addressdetails=1`)
	.then(response => response.json())
    .then(results => {
		console.log(results);
		//var result = results.direcciones;
		results.forEach(function(resultado, index) {
			if (index < 5) {
				var button = document.createElement('button');
				button.textContent = `${resultado.address.road}, ${resultado.address.house_number}, ${resultado.address.town}`;
				button.setAttribute('data-index', index); // Añade el índice como un atributo de datos personalizado
				var dataAddressValue = JSON.stringify([resultado.lat, resultado.lon]);
				button.setAttribute('data-address', dataAddressValue);
				button.setAttribute('class', 'btn')
				button.addEventListener('click', function() {
					var dataAddressValue = this.getAttribute('data-address');
					var latlng = JSON.parse(dataAddressValue);
					var marker;
					marker = L.marker(latlng).addTo(mymap)
					.bindPopup(resultado.address.road + ", " + resultado.address.town)
					.openPopup();
					mymap.setView(latlng, 13);
					marcadores.push(marker);
					marker.on('dblclick', function() {
						// Remover el marcador del mapa
						marker.remove();
						// Remover la referencia del marcador del array
						marcadores.splice(marcadores.indexOf(marker), 1);
					});
				});
				dirs.appendChild(button);
			}
		});
		
	});
  }
});

document.addEventListener('click', function(event) {
	var buscadorDireccion = document.getElementById('buscador-direccion');
	var resultadosBuscador = document.getElementById('resultados-buscador');

	if (!buscadorDireccion.contains(event.target)) {
		resultadosBuscador.classList.add('d-none');
	}
});

// Prevenir que el click dentro del buscador cierre el div
document.getElementById('resultados-buscador').addEventListener('click', function(event) {
	event.stopPropagation();
});*/
/*ar textLabelR2 = L.marker(textLatLngR2, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>II</div>'
    }),*/

// Agregar departaentos a mapa 

// Agrega control para ver los datos al pasar el puntero por departamento


var infoD = L.control();

// Crear panel de  info

infoD.onAdd = function(map){
    this._div = L.DomUtil.create('div','infoD');
    this.update();
    return this._div;
};

// Metodo que actualiza el control segun el puntero vaya pasando

infoD.update = function(props){
    this._div.innerHTML = "<b>Información del Departamento</h7></b>" + 
                            (props ? 
                            	"<table><tr><td><b>Departamento:</b> " + props.nomdep + " (" + props.gid + ")"+ 
                            	"</td></tr><tr><td><b>Cabecera:</b> "+ (props.cabecera?props.cabecera:"No definido") +
                            	"</td></tr><tr><td><b>Superficie:</b> "+ (props.superficie?props.superficie:"No definido")+
                            	"</td></tr></table>"
                            : "<br>Pase el puntero por un departamento");
};

// Agregar panel a mapa despues del legend

infoD.addTo(mymap); 


// Funcion de interaccion del puntero con la capa para resaltar el dapartamento

function highlightFeatureD(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 1,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    infoD.update(layer.feature.properties);
}

// Variable de departamento

var departament;

// Configurar los cambios de resaltar y de zoom de la capa

function resetHighlightD(e){
    departament.resetStyle(e.target);
    infoD.update();
}
function zoomToFeatureD(e){
    mymap.fitBounds(e.target.getBounds());
}
function onEachFeatureD(feature, layer){
    layer.on({
        mouseover: highlightFeatureD,
        mouseout: resetHighlightD,
        click: zoomToFeatureD
    });
}

// Colores por departamento

function colorDepartamento(d) { 
	return d == '1' ? '#cce4ce' : 
	d == '2' ? '#e3b9cd' : 
	d == '3' ? '#fabbb2' : 
	d == '4' ? '#cce4ce' :
	d == '5' ? '#c7c0df' :
	d == '6' ? '#e3b9cd' :
	d == '7' ? '#c7c0df' :
	d == '8' ? '#f7eaa4' :
	d == '9' ? '#c7c0df' :
	d == '10' ? '#f7eaa4' :
	d == '11' ? '#f7bdb2' :
	d == '12' ? '#f7bdb2' :
	d == '13' ? '#c7c0df' :
	d == '14' ? '#cce4ce' :
	d == '15' ? '#e3b9cd' :
		'#f1767f'; 
};


// Agregar departamentos
function estilo_departamentos (feature) {
		return{
			//weight: 1,
			fillColor: colorDepartamento(feature.properties.gid), 
			color: colorDepartamento(feature.properties.gid), 
			opacity :  0.3,
			fillOpacity: 0.5,
	};
};

departament =  L.geoJson(departamentos, {
    style: estilo_departamentos,
    onEachFeature: onEachFeatureD
});//.addTo(mymap);


// Agregar nombre region

var textLatLngR1 = [-42.263364, -70.828274];  
var textLabelR1 = L.marker(textLatLngR1, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>I</div>'
    }),
    zIndexOffset: -1 
});
baselayer.addLayer(textLabelR1);
var textLatLngR2 = [-42.340042, -65.70081];  
var textLabelR2 = L.marker(textLatLngR2, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>II</div>'
    }),
    zIndexOffset: -1 
});
baselayer.addLayer(textLabelR2);
var textLatLngR3 = [-43.678353, -70.742548];  
var textLabelR3 = L.marker(textLatLngR3, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>III</div>'
    }),
    zIndexOffset: -1 
});
baselayer.addLayer(textLabelR3);
var textLatLngR4 = [-43.533583, -67.91289];  
var textLabelR4 = L.marker(textLatLngR4, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>IV</div>'
    }),
    zIndexOffset: -1 
});
baselayer.addLayer(textLabelR4);
var textLatLngR5 = [-45.32692, -70.31852];  
var textLabelR5 = L.marker(textLatLngR5, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>V</div>'
    }),
    zIndexOffset: -1 
});
baselayer.addLayer(textLabelR5);
var textLatLngR6 = [-45.339412, -67.964911];  
var textLabelR6 = L.marker(textLatLngR6, {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>VI</div>'
    }),
    zIndexOffset: -1 
});
baselayer.addLayer(textLabelR6);


// Agregar regiones a mapa 

// Agrega control para ver los datos al pasar el puntero por region

var info = L.control();

// Crear panel de  info

info.onAdd = function(map){
    this._div = L.DomUtil.create('div','info');
    this.update();
    return this._div;
};

// Metodo que actualiza el control segun el puntero vaya pasando

info.update = function(props){
    this._div.innerHTML = "<b>Información de la Región</h7></b>" + 
                            (props ? 
                            	"<table><tr><td><b>Región:</b> " + props.numReg + " (" + props.nombreReg + ")"+ 
                            	"</td></tr><tr><td><b>Total Localizaciones:</b> "+ (props.totalLocal?props.totalLocal:"Sin Localizaciones") +
                            	"</td></tr><tr><td><b>Educación Inicial:</b> "+ (props.Inicial?props.Inicial:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Primaria:</b> "+ (props.Primario?props.Primario:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Secundaria:</b> "+ (props.Secundario?props.Secundario:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Superior:</b> "+ (props.Superior?props.Superior:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Formación Profesional:</b> "+ (props.Formación?props.Formación:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Domiciliaria y Hospitalaria:</b> "+ (props.DomHosp?props.DomHosp:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Especial:</b> "+ (props.Especial?props.Especial:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Artística:</b> "+ (props.Artística?props.Artística:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>EPJA:</b> "+ (props.EPJA?props.EPJA:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Otros Servicios Educativos:</b> "+ (props.OServEduc?props.OServEduc:"Sin Localizaciones")+
								"</td></tr><tr><td><b>Edificios:</b> "+ (props.Edificios?props.Edificios:"Sin Localizaciones")+
								"</td></tr><tr><td><b>Sedes:</b> "+ (props.Sedes?props.Sedes:"Sin Localizaciones")+
								"</td></tr><tr><td><b>Anexos:</b> "+ (props.Anexos?props.Anexos:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Población:</b> "+ (props.Población?props.Población:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Superficie:</b> "+ (props.Superficie?props.Superficie:"Sin Localizaciones")+
                            	"</td></tr></table>"
                            : "<br>Pase el puntero por una región");
};

// Agregar panel a mapa despues del legend

info.addTo(mymap); 


// Funcion de interaccion del puntero con la capa para resaltar el la region

function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.5
    });
    info.update(layer.feature.properties);
}

// Variable de region

var polygon;

// Configurar los cambios de resaltar y de zoom de la capa

function resetHighlight(e){
    polygon.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e){
    mymap.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Colores por region

function colorRegion(d) { 
	return d == "I" ? '#ffb109' : 
	d == "II" ? '#ffc815' : 
	d == "III" ? '#ff682c' : 
	d == "IV" ? '#ff8540' :
	d == "V" ? '#5894a7' :
		'#21708c'; 
};

// Estilo por region

function estilo_region (feature) {		
			if (feature.properties.numReg == 'I' || feature.properties.numReg == 'III' || feature.properties.numReg == 'VI') {
				return{fillColor: colorRegion(feature.properties.numReg), 
				color: colorRegion(feature.properties.numReg), 
				opacity :  0.2,
				fillOpacity: 0.3,}
			} else {
				return {fillColor: colorRegion(feature.properties.numReg), 
				color: colorRegion(feature.properties.numReg), 
				opacity :  0.2,
				fillOpacity: 0.2,}
			}
			
	};

// Agregar regiones a mapa

polygon = L.geoJson(regiones_educativas, {
    style: estilo_region,
    onEachFeature: onEachFeature
}).addTo(mymap);



// Agregar organizaciones educativas a mapa

// Layer supervision inicial

function closepoputNL(e) {
    var layer = e.target;
  	setTimeout(function(){ layer.closePopup(); }, 10000);  
}

function popup_supervision (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'> " + " " +
		(feature.properties.nombre_sup?feature.properties.nombre_sup:"")+
		"</h6><table>" + 
		"<tr><td><b>Nivel:</b> "+(feature.properties.nivel?feature.properties.nivel:"No se registra")+"</td></tr>" + 
		"<tr><td><b>Región:</b> "+(feature.properties.region?feature.properties.region:"No se registra")+"</td></tr>" + 
		"<tr><td><b>Dirección:</b> "+(feature.properties.direccion?feature.properties.direccion:"No se registra")+"</td></tr>" +
		//"<tr><td><b>Responsable:</b> "+(feature.properties.Responsable?feature.properties.Responsable:"No se registra")+"</td></tr>" + 
		"<tr><td><b>Télefono:</b> "+(feature.properties.telefono?feature.properties.telefono:"No se registra")+"</td></tr>" + 
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"</table></div>",
		{minWidth: 270, maxWidth: 270}
	);
	layer.on({
        popupopen : closepoputNL,
    });
};			
var sup_inicial = L.geoJSON(supervicion_inicial, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/supervision_inicial.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},	
		onEachFeature: popup_supervision
});		


// Layer supervision primaria	

var sup_primaria = L.geoJSON(supervicion_primaria, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/supervision_primaria.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},
		onEachFeature: popup_supervision
});		

// Layer supervision secundaria	

var sup_secundaria = L.geoJSON(supervicion_secundaria, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/supervision_secundaria.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},
		onEachFeature: popup_supervision	
});		

// Layer supervision privada

var sup_privada = L.geoJSON(supervicion_privada, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/supervision_privada.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},
		onEachFeature: popup_supervision
});

// Layer ministerio educacion

function popup_min_educacion (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>"+ (feature.properties.Nombre?feature.properties.Nombre:"No se registra")+
		"</h6><table><tr><td><b>Dirección:</b> "+ (feature.properties.Dirección?feature.properties.Dirección:"No se registra") +
		"</td></tr></table></div>",
		{minWidth: 270, maxWidth: 270}
	);
	layer.on({
        popupopen : closepoputNL,
    });
};			
var min_educacion = L.geoJSON(ministerio_educacion, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/ministerio.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},
		onEachFeature: popup_min_educacion	
});

// Layer delegaciones administrativas

function popup_del_admnistrativas (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") +
		"</h6><table><tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"") + 
		"</td></tr><tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"</td></tr><tr><td><b>Delegado:</b> "+ (feature.properties.responsable?feature.properties.responsable:"No se registra") +
		"</td></tr><tr><td><b>Teléfono:</b> "+ (feature.properties.tel?feature.properties.tel:"No se registra") +
		"</td></tr></table></div>",
		{minWidth: 270, maxWidth: 270}
	);
	layer.on({
        popupopen : closepoputNL,
    });
};			
var del_admnistrativas = L.geoJSON(delegaciones_administrativas, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/delegacion_.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},
		onEachFeature: popup_del_admnistrativas
});


// agrega capas a layer
/*baselayer.addLayer(sup_secundaria);
baselayer.addLayer(sup_privada);
baselayer.addLayer(sup_primaria);
baselayer.addLayer(sup_inicial);*/
baselayer.addLayer(min_educacion);
//baselayer.addLayer(del_admnistrativas);


// Layer bibliotecas pedagogicas

function popup_bib_pedagogicas (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Biblioteca Pedagógica "+ (feature.properties.nombreBibl?feature.properties.nombreBibl:"") +
		"</h6><table>" + 
		"<tr><td><b>Número:</b> "+ (feature.properties.numBibl?feature.properties.numBibl:"No se registra") +
		"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.numReg?feature.properties.numReg:"No se registra") +
		"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.Localidad?feature.properties.Localidad:"No se registra") +
		"</td></tr><tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") +
		"</td></tr><tr><td><b>Cod. Postal:</b> "+ (feature.properties.codPostal?feature.properties.codPostal:"No se registra") +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"</td></tr><tr><td><b>Horario:</b> "+ (feature.properties.horario?feature.properties.horario:"No se registra") +
		"</td></tr></table></div>",
		{minWidth: 270, maxWidth: 270}
	);
	layer.on({
        popupopen : closepoputNL,
    });
};

var bib_pedagogicas = L.geoJSON(bibliotecas_pedagogicas, {
		pointToLayer: function (feature, latlng) {
				return L.marker(latlng, {
					icon: L.icon({
					    iconUrl: "icons/biblioteca.svg",
					    iconSize:     [22, 22], 
					    iconAnchor:   [11, 0], 
					    popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				});
			},
		onEachFeature: popup_bib_pedagogicas
});		
//baselayer.addLayer(bib_pedagogicas);

// Agregar establecimientos educativos a mapa 

function formatoNombre(cadena) {
	let splitCad = cadena.split(" ");
	let minusCad = splitCad.map(palabra => {
    	return palabra.toLowerCase();
	})
	let mayusCad = minusCad.map(palabra => {
    return palabra[0].toUpperCase() + palabra.slice(1);
	})
	return mayusCad.join(" ");
};

function mostrarDiv(idcue){
	var displaydatos = document.getElementById(idcue);
	var botondisplaypoput = document.getElementById("botondisplaypoput");

	if(displaydatos.style.display == 'block'){
		displaydatos.style.display = 'none';
		botondisplaypoput.innerHTML = "+";
	} else {
		displaydatos.style.display = 'block';
		botondisplaypoput.innerHTML = "-";	
	}
}
/*
function closepoput(e, layer) {
	featureR = e.target.feature;
	document.getElementById("cueanexoinfoadicional").innerHTML = "<b>Cueanexo: </b><div id='cueanexoinfoadicionale'>" + (featureR.properties.cueanexo?featureR.properties.cueanexo:"No se registra") + "." + "</div>";
	document.getElementById("calleinfoadicional").innerHTML = "<b>Domicilio: </b><div id='calleinfoadicionale'>" + (featureR.properties.direccion?featureR.properties.direccion:"No se registra") + "." + "</div>";	
	document.getElementById("funinfoadicional").innerHTML = "<b>Activo/No activo: </b><div id='funinfoadicionale'>" + (featureR.properties.funcion?featureR.properties.funcion:"No se registra") + "." + "</div>";
	document.getElementById("fnainfoadicional").innerHTML = "<div id='fnainfoadicionale'>" + (featureR.properties.nombre?featureR.properties.nombre:"No se registra.") + " (Nro: " + (featureR.properties.numero?featureR.properties.numero:"No se registra.") + ")" + "</div>";
	document.getElementById("cod_postalinfoadicional").innerHTML = "<b>CP: </b><div id='cod_postalinfoadicionale'>" + (featureR.properties.cp?featureR.properties.cp:"No se registra") + "." + "</div>";
	document.getElementById("Localidadinfoadicional").innerHTML = "<b>Localidad: </b><div id='Localidadinfoadicionale'>" + (featureR.properties.localidad?featureR.properties.localidad:"No se registra") + "." + "</div>";
	document.getElementById("departamentoinfoadicional").innerHTML = "<b>Departamento: </b><div id='departamentoinfoadicionale'>" + (featureR.properties.departamento?featureR.properties.departamento:"No se registra") + "." + "</div>";
	document.getElementById("amginfoadicional").innerHTML = "<b>Ambito: </b><div id='amginfoadicionale'>" + (featureR.properties.ambito?featureR.properties.ambito:"No se registra") + "." + "</div>";
	document.getElementById("Regioninfoadicional").innerHTML = "<b>Region: </b><div id='Regioninfoadicionale'>" + (featureR.properties.region?featureR.properties.region:"No se registra") + "." + "</div>";
	document.getElementById("Modalidadinfoadicional").innerHTML = "<b>Tipo de Educación/Modalidad: </b><div id='Modalidadinfoadicionale'>" + (featureR.properties.modalidad?featureR.properties.modalidad:"No se registra") + "." + "</div>";
	document.getElementById("Nivelesinfoadicional").innerHTML = "<b>Nivel: </b><div id='Nivelesinfoadicionale'>" + (featureR.properties.nivel?featureR.properties.nivel:"No se registra") + "." + "</div>";
	document.getElementById("Ofertainfoadicional").innerHTML = "<b>Oferta: </b><div id='Ofertainfoadicionale'>" + (featureR.properties.oferta?featureR.properties.oferta:"No se registra") + "." + "</div>";
	document.getElementById("Dependenciinfoadicional").innerHTML = "<b>Dependencia: </b><div id='Dependenciinfoadicionale'>" + (featureR.properties.dependencia?featureR.properties.dependencia:"No se registra") + "." + "</div>";
	document.getElementById("gesinfoadicional").innerHTML = "<b>Sector de Gestión: </b><div id='gesinfoadicionale'>" + (featureR.properties.gestion?featureR.properties.gestion:"No se registra") + "." + "</div>";
	document.getElementById("telefonoinfoadicional").innerHTML = "<b>Teléfono: </b><div id='telefonoinfoadicionale'>" + (featureR.properties.tel?featureR.properties.tel:"") + "." + "</div>";
	document.getElementById("emailinfoadicional").innerHTML ="<b>Email: </b><div id='emailinfoadicionale'><a href=mailto:" + (featureR.properties.email?featureR.properties.email:"No se registra") + " '> "  + (featureR.properties.email?featureR.properties.email:"No se registra.") + "</a>" + "</div>";
	document.getElementById("sitio_webinfoadicional").innerHTML = "<b>Sitio Web:</b><div id='sitio_webinfoadicionale'><a " + (featureR.properties.web && featureR.properties.web != 'Sin información'?"href='"+featureR.properties.web:"") + " ' target='_blank' rel='noopener noreferrer'> "  + (featureR.properties.sitioweb?featureR.properties.sitioweb:"No se registra.") + "</a>" + "</div>";
	document.getElementById("resp_respnsableinfoadicional").innerHTML = "<b>Responsable: </b><div id='resp_respnsableinfoadicionale'>" + (featureR.properties.responsable?featureR.properties.responsable:"No se registra") + "." + "</div>";
	document.getElementById("resp_telresponsableinfoadicional").innerHTML = "<b>Tel. del Responsable: </b><div id='resp_telresponsableinfoadicionale'>" + (featureR.properties.tel_resp?featureR.properties.tel_resp:"No se registra") + "." + "</div>";
  	setTimeout(function(){ layer.closePopup(); }, 20000);  
}*/

//ventana informativa pequeña
function onEachFeatureL(feature, layer){
	layer.bindPopup(
		"<div class='p-3'>"+
  		"<h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") + "</h6>" +
	 	"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>CUE - Anexo:</b> "+ (feature.properties.cueanexo?feature.properties.cueanexo:"No se registra") + "</td></tr>"+
		"<tr><td><b>Número:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") + "</td></tr>" + 
		"<tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") + "</td></tr>" +
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?formatoNombre(feature.properties.localidad):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") + "</td></tr>" +
		"<tr><td><b>Nivel:</b> "+ (feature.properties.nivel?feature.properties.nivel:"No se registra") + "</td></tr>" +
		"</table>" +
		"<h6 class='mt-3'> Información de Contacto</h6>" + 
		"<table>" +
		"<tr><td><b>Teléfono:</b> "+ (feature.properties.tel?feature.properties.tel:"") + "</td></tr>" +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"<tr><td><b>Sitio Web:</b>" + "<a " + (feature.properties.sitioweb && feature.properties.sitioweb != 'Sin información'?"href='"+feature.properties.sitioweb:"") + " ' target='_blank' rel='noopener noreferrer'> "  + (feature.properties.sitioweb?feature.properties.sitioweb:"No se registra") + "</a>"+ "</td></tr>" +
		"<tr><td><b>Responsable:</b> "+ (feature.properties.responsable?feature.properties.responsable:"") + "</td></tr>" +
		"<tr><td><b>Tel. del Responsable:</b> "+ (feature.properties.tel_resp?feature.properties.tel_resp:"-") + "</td></tr>" +
		"</table>" +
  		"</div></div>" +
  		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='/info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
  		"</div>"
  		, {minWidth: 270, maxWidth: 270}
	);
}
/*
var domiciliaria_hospitalaria = L.geoJSON(ed_domiciliaria_hospitalaria, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_dom_hosp.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});	

//baselayer.addLayer(domiciliaria_hospitalaria);
var especial = L.geoJSON(ed_especial, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_especial.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});	

//baselayer.addLayer(especial);
var inicial = L.geoJSON(ed_inicial, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_inicial.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});		

//baselayer.addLayer(inicial);
var primaria = L.geoJSON(ed_primaria, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_primaria.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});
//baselayer.addLayer(secundaria);
var superior = L.geoJSON(ed_superior, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_superior.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});	

//baselayer.addLayer(superior);


var form_prof = L.geoJSON(ed_form_prof, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_form_prof.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});	

//baselayer.addLayer(form_prof);
var otros_serv_comp = L.geoJSON(ed_otros_serv_comp, {
		pointToLayer: function (feature, latlng) {
			return L.marker(latlng, {
				icon: L.icon({
				    iconUrl: "icons/establecimientos_comp.svg",
				    iconSize:     [22, 22], 
					iconAnchor:   [11, 0], 
				    popupAnchor:  [0, 0] 
				}),
				riseOnHover: true
			});
		},	
		onEachFeature: onEachFeatureL
});		
//baselayer.addLayer(otros_serv_comp);



//baselayer.addLayer(form_prof);


*/	
//crear cluster de markers, es decir que los iconos del layer se agrupan o desagrupan segun se haga zoom out o zoom in
function createCluster(tipo, nivel) {
	var cluster = L.markerClusterGroup({
		showCoverageOnHover: false, // Desactiva la visualización del radio en el hover
		disableClusteringAtZoom: 13, // Desactiva la agrupación a partir de cierto nivel de zoom
		spiderfyOnMaxZoom: false, // No agrupa los marcadores al hacer zoom máximo
		maxClusterRadius: 30, // Establece el radio máximo de agrupación
		iconCreateFunction: function(cluster) {
			return L.divIcon({ 
				html: `<img src="./icons/${tipo}_${nivel}.svg">`, // Utiliza un ícono personalizado
				className: `${tipo}-icons`, // Clase CSS para el ícono
				iconSize: L.point(3, 3) // Tamaño del ícono
			});
		}
	});
	return cluster;
}
//function createLayer(cluster, data, nivel) 
function createLayer(data, tipo, nivel) {
	var cluster = createCluster(tipo, nivel);
	var layer = L.geoJSON(data, {
		pointToLayer: function (feature, latlng) {
			var marker = L.marker(latlng, {
				icon: L.icon({
					iconUrl: `icons/${tipo}_${nivel}.svg`,
					iconSize: [22, 22],
					iconAnchor: [11, 0],
					popupAnchor: [0, 0]
				}),
				riseOnHover: true
			});
			cluster.addLayer(marker);
			return marker;
		},
		onEachFeature: (tipo === 'supervision') ? popup_supervision : (tipo === 'delegacion') ? popup_del_admnistrativas :onEachFeatureL
	});
	return cluster;
}
/*var clusterSecundaria = createCluster('sec');
var clusterInicial = createCluster('inicial');
var clusterPrimaria = createCluster('primaria');
var clusterEspecial = createCluster('especial');
var clusterSNU = createCluster('superior');
var clusterDomHosp = createCluster('dom_hosp');
var clusterFormProf = createCluster('form_prof');
var clusterOtrosServ = createCluster('comp');*/
/*L.markerClusterGroup({
    showCoverageOnHover: false, // Desactiva la visualización del radio en el hover
    disableClusteringAtZoom: 13, // Desactiva la agrupación a partir de cierto nivel de zoom
    spiderfyOnMaxZoom: false, // No agrupa los marcadores al hacer zoom máximo
    maxClusterRadius: 30, // Establece el radio máximo de agrupación
	iconCreateFunction: function(cluster) {
        return L.divIcon({ 
            html: '<img src="./icons/establecimientos_sec.svg">', // Utiliza un ícono personalizado
            className: 'establecimientos-icons', // Clase CSS para el ícono
            iconSize: L.point(3, 3) // Tamaño del ícono
        });
    }
});*/



// Función para obtener la capa de datos
function getEstablecimientosLayers() {
    return fetch('mapa/setInstMarkers')
        .then(response => response.json())
        .then(data => {
			var todosLayers = [];
			var dataInicial = [];
			var dataPrimaria = [];
			var dataSecundaria = [];
			var dataEspecial = [];
			var dataSNU = [];
			var dataDomHosp = [];
			var dataFormProf = [];
			var dataOtrosServ = [];
			var dataArtistica = [];
			data.features.forEach(escuelas => {
				switch (true) {
					//numeracion inicial 400 a 499 / 4000 a 4999 / 1400 a 1499 / 2400 a 2499
					//case ((escuelas.properties.numero >= 400 && escuelas.properties.numero <= 499) || (escuelas.properties.numero >= 4000 && escuelas.properties.numero <= 4999) || (escuelas.properties.numero >= 1400 && escuelas.properties.numero <= 1499) || (escuelas.properties.numero >= 2400 && escuelas.properties.numero <= 2499)):
					case (escuelas.properties.nivel == 'Inicial'):
						dataInicial.push(escuelas);
						break;
					//numeracion primaria 0 a 299 / 1000 a 1299 / 2000 a 2099
					//case ((escuelas.properties.numero >= 0 && escuelas.properties.numero <= 299) || (escuelas.properties.numero >= 1000 && escuelas.properties.numero <= 1299) || (escuelas.properties.numero >= 2000 && escuelas.properties.numero <= 2099)):
					case (escuelas.properties.nivel == 'Primario'):
						dataPrimaria.push(escuelas)
						break;
					//numeracion secundaria 700 a 799 / 7000 a 7999 / 1700 a 1799 / 2700 a 2799
					//case ((escuelas.properties.numero >= 700 && escuelas.properties.numero <= 799) || (escuelas.properties.numero >= 7000 && escuelas.properties.numero <= 7999) || (escuelas.properties.numero >= 1700 && escuelas.properties.numero <= 1799) || (escuelas.properties.numero >= 2700 && escuelas.properties.numero <= 2799)):
					case (escuelas.properties.nivel == 'Secundario'):
						dataSecundaria.push(escuelas)
						break;
					//numeracion Adultos - formacion profesional 600 a 699 / 1600 a 1699
					//case ((escuelas.properties.numero >= 600 && escuelas.properties.numero <= 699) || (escuelas.properties.numero >= 1600 && escuelas.properties.numero <= 1699)):
					case (escuelas.properties.nivel == 'Formación profesional'):
						dataFormProf.push(escuelas);
						break;
					//numeracion especial 500 a 599 / 1500 a 1500
					case ((escuelas.properties.numero >= 500 && escuelas.properties.numero <= 599) || (escuelas.properties.numero >= 1500 && escuelas.properties.numero <= 1599)):
						dataEspecial.push(escuelas);
						break;
					//superior no universitario SNU 800 a 899 / 1800 a 1899
					case ((escuelas.properties.numero >= 800 && escuelas.properties.numero <= 899) || (escuelas.properties.numero >= 1800 && escuelas.properties.numero <= 1899)):
						dataSNU.push(escuelas);
						break;
					//numeracion domiciliaria/hospitalaria 300 a 399
					case (escuelas.properties.numero >= 300 && escuelas.properties.numero <= 399):
						dataDomHosp.push(escuelas);
						break;
					//lo que no cae en lo anterior cae en otros servicios educativos
					case (escuelas.properties.nivel == 'Otros servicios educativos'):
						dataOtrosServ.push(escuelas);
						break;	
					default:
        				console.log('no se encontraron instituciones');
					}})
					
            //console.log('Fetched data:', data.features); // Log después de obtener los datos

            // Crea la capa GeoJSON y añádela al cluster
			var inicialLayer = createLayer(dataInicial,'establecimientos', 'inicial');
			//console.log('Created layer:', inicialLayer); // Log después de crear secundariaLayer
			var primariaLayer = createLayer(dataPrimaria,'establecimientos', 'primaria');
			//console.log('Created layer:', primariaLayer); // Log después de crear secundariaLayer
			var secundariaLayer = createLayer(dataSecundaria,'establecimientos', 'sec');
			//console.log('Created layer:', secundariaLayer); // Log después de crear secundariaLayer
			var especialLayer = createLayer(dataEspecial,'establecimientos', 'especial');
			//console.log('Created layer:', especialLayer); // Log después de crear secundariaLayer
			var SNULayer = createLayer(dataSNU,'establecimientos', 'superior');
			//console.log('Created layer:', SNULayer); // Log después de crear secundariaLayer
			var domHospLayer = createLayer(dataDomHosp,'establecimientos', 'dom_hosp');
			//console.log('Created layer:', domHospLayer); // Log después de crear secundariaLayer
			var formProfLayer = createLayer(dataFormProf,'establecimientos', 'form_prof');
			//console.log('Created layer:', formProfLayer); // Log después de crear secundariaLayer
			var otrosServLayer = createLayer(dataOtrosServ,'establecimientos', 'comp');
			//console.log('Created layer:', otrosServLayer); // Log después de crear secundariaLayer
			/*L.geoJSON(dataSecundaria, {
                pointToLayer: function (feature, latlng) {
                    var marker = L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: "icons/establecimientos_sec.svg",
                            iconSize: [22, 22],
                            iconAnchor: [11, 0],
                            popupAnchor: [0, 0]
                        }),
                        riseOnHover: true
                    });
					clusterSecundaria.addLayer(marker);
                    return marker;
                },
                onEachFeature: onEachFeatureL
            });*/
			
			todosLayers.push([[inicialLayer],[{label: 'Ed. Inicial', url: 'inicial'}]]);//0
			todosLayers.push([[primariaLayer],[{label: 'Ed. Primaria', url: 'primaria'}]]);//1
			todosLayers.push([[secundariaLayer],[{label: 'Ed. Secundaria', url: 'sec'}]]);//2
			todosLayers.push([[SNULayer],[{label: 'Superior No Universitario', url: 'superior'}]]);//3
			todosLayers.push([[especialLayer],[{label: 'Ed. Especial', url: 'especial'}]]);//4
			todosLayers.push([[formProfLayer],[{label: 'Formacion Profesional', url: 'form_prof'}]]);//5
			todosLayers.push([[domHospLayer],[{label: 'Ed. Domiciliaria/Hospitalaria', url: 'dom_hosp'}]]);//6
			todosLayers.push([[otrosServLayer],[{label: 'Otros Servicios Educativos', url: 'comp'}]]);//7
            return todosLayers;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return null;
        });
	return layersEst;
}

function getSupervisionLayers(){
	var layersSuperv = fetch('mapa/setSupervMarkers')
	.then(response => response.json())
	.then( data => {
		var todosLayers = [];
		var superInicial = [];
		var superPrimaria = [];
		var superSecundaria = [];
		var superPrivada = [];
		data.features.forEach(supervision => {
			switch (true) {
				case (supervision.properties.nivel == 'Inicial' && supervision.properties.gestion == 'Estatal'):
					superInicial.push(supervision);
					break;
				case (supervision.properties.nivel == 'Primario' && supervision.properties.gestion == 'Estatal'):
					superPrimaria.push(supervision)
					break;
				case (supervision.properties.nivel == 'Secundario' && supervision.properties.gestion == 'Estatal'):
					superSecundaria.push(supervision)
					break;
				case (supervision.properties.gestion == 'Privada'):
					superPrivada.push(supervision);
					break;
				default:
					console.log('no se encontraron instituciones: ' + supervision.properties.gestion);
				}})
			var superInicialLayer = createLayer(superInicial, 'supervision', 'inicial');
			var superSecundariaLayer = createLayer(superSecundaria, 'supervision', 'secundario');
			var superPrimariaLayer = createLayer(superPrimaria, 'supervision', 'primaria');
			var superPrivadaLayer = createLayer(superPrivada, 'supervision', 'privada');
			todosLayers.push([[superInicialLayer],[{label: 'Inicial', url: 'inicial'}]]);
			todosLayers.push([[superPrimariaLayer],[{label: 'Primaria', url: 'primaria'}]]);
			todosLayers.push([[superSecundariaLayer],[{label: 'Secundaria', url: 'secundario'}]]);
			todosLayers.push([[superPrivadaLayer],[{label: 'Privada', url: 'privada'}]]);
			todosLayers.forEach(layers => {
				mymap.addLayer(layers[0][0]);
			})
			return todosLayers
	})
	.catch(error => {
		console.error('Error fetching data:', error);
		return null;
	});
	return layersSuperv
}

function getDelegacionLayers(){
	var layerDel = fetch ('mapa/setDelegMarkers')
	.then(response => response.json())
	.then( data => {
		var delegacionLayer = createLayer(data, 'delegacion' , '');
		mymap.addLayer(delegacionLayer);
		return delegacionLayer
	})
	.catch(error => {
		console.error('Error fetching data:', error);
		return null;
	});
	return layerDel
}

async function generarTodosLayers() {
    var layersConfig = [];

	

    // Obtener establecimientos y crear configuraciones de capas
    const establecimientos = await getEstablecimientosLayers();
    establecimientos.forEach(establecimiento => {
		var layer = establecimiento[0][0];
        layersConfig.push({
            label: `${establecimiento[1][0].label}`,
            type: "image",
            url: `icons/establecimientos_${establecimiento[1][0].url}.svg`,
            layers_type: "establecimiento",
            layers: layer,
            inactive: true,
        });
			
    });

	const delegaciones = await getDelegacionLayers();

	layersConfig.push({
		label: "Ministerio de Educación",
		type: "image",
		url: "icons/ministerio.svg",
		layers_type: "organizacion",
		layers: [min_educacion],
		inactive: false,
        })

	layersConfig.push({
		label: 'Delegaciones Administrativas',
		type: 'image',
		url: 'icons/delegacion_.svg',
		layers_type: "organizacion",
		layers: delegaciones,
		inactive: false
	})

	layersConfig.push ({
		label: "Regiones Educativas",
		type: "polygon",
		sides: 4,
		color: "#FFFFFF",
		fillColor: "#FF0000",
		weight: 1,
		layers_type: "general",
		layers: [polygon, textLabelR1, textLabelR2 ,textLabelR3, textLabelR4, textLabelR5, textLabelR6],
		inactive: false,
        })

    layersConfig.push({
        label: "Departamentos",
		type: "polygon",
		sides: 4,
		color: "#FFF252",
		fillColor: "#FFF252",
		weight: 1,
		layers_type: "general",
		layers: [departament],
		inactive: true,
        })

	// Obtener supervisiones y crear configuraciones de capas
    const supervision = await getSupervisionLayers();
    supervision.forEach(supervision => {
		var layer = supervision[0][0];
        layersConfig.push({
            label: `Supervisíon ${supervision[1][0].label}`,
            type: "image",
            url: `icons/supervision_${supervision[1][0].url}.svg`,
            layers_type: "organizacion",
            layers: layer,
            inactive: false,
        });
    });
    return layersConfig;
}

// Obtener la capa y configurarla
/*getEstablecimientosLayers().then(Layers => {
    var layersConfig = [
		{
		label: "Ed. Inicial",
		type: "image",
		url: "icons/establecimientos_inicial.svg",
		layers_type: "establecimiento",
		layers: [Layers[0]],
		inactive: true,
		},
		{
		label: "Ed. Primaria",
		type: "image",
		url: "icons/establecimientos_primaria.svg",
		layers_type: "establecimiento",
		layers: [Layers[1]],
		inactive: true,
		},
		{
		label: "Ed. Secundaria",
		type: "image",
		url: "icons/establecimientos_sec.svg",
		layers_type: "establecimiento",
		layers: [Layers[2]],
		inactive: true,
		},
		{
		label: "Ed. Superior No Universitaria",
		type: "image",
		url: "icons/establecimientos_superior.svg",
		layers_type: "establecimiento",
		layers: [Layers[3]],
		inactive: true,
		},
		{
		label: "Ed. Especial",
		type: "image",
		url: "icons/establecimientos_especial.svg",
		layers_type: "establecimiento",
		layers: [Layers[4]],
		inactive: true,
		},
		{
		label: "Formación Profesional",
		type: "image",
		url: "icons/establecimientos_form_prof.svg",
		layers_type: "establecimiento",
		layers: [Layers[5]],
		inactive: true,
		},
		{
		label: "Ed. Domiciliaria y Hospitalaria",
		type: "image",
		url: "icons/establecimientos_dom_hosp.svg",
		layers_type: "establecimiento",
		layers: [Layers[6]],
		inactive: true,
		},
		{
		label: "Otros Servicios Educativos",
		type: "image",
		url: "icons/establecimientos_comp.svg",
		layers_type: "establecimiento",
		layers: [Layers[7]],
		inactive: true,
		}
	];

    // Añadir la capa al mapa si está definida
    if (Layers) {
		var legend = new L.control.Legend({
			position: "topleft",
			title: "Capas2",
			collapsed: true,
			symbolWidth: 17, 
			opacity: 1,
			column: false,
			legends: layersConfig
			})
			.addTo(mymap);
    } else {
        console.error('No se econtraron capas de instituciones');
    }
});*/

//mymap.addLayer(markersCluster);
var legends;
var legend;
async function initMap() {
    // Generar y añadir leyendas
    legends = await generarTodosLayers();
    legend = new L.control.Legend({
        position: "topleft",
        title: "Capas",
        collapsed: true,
        symbolWidth: 17, 
        opacity: 1,
        column: false,
        legends: legends
    }).addTo(mymap);
}



// Agregar boton consulta
var myModal = new bootstrap.Modal(document.getElementById('exampleModalBusqueda'));
var mostrarConsultaButton = L.easyButton({
    id: 'idConsultaButton',
    states: [{
      stateName: 'fa-globe',
      icon: "<img class='icon' src='icons/search-icon.png' style='width:18px; height:18px;'>",
      title: 'Búsqueda',
      onClick: function(btn, map) {
        fetch('buscador')
          .then(response => response.text())
          .then(html => {
            // Insertar el HTML obtenido en el cuerpo del modal
            document.getElementById('modalBodyBuscador').innerHTML = html;
            // Mostrar el modal
            myModal.show();
			cargarDatosBuscador();
          })
          .catch(error => {
            console.error('Error al cargar contenido:', error);
          });
      }
    }]
  });

// Agregar boton filtro

var mostrarFiltroButton = L.easyButton({
    id: 'idFiltroButton',
    states: [{
            stateName: 'fa-globe',
            icon:      "<img class='icon' src='icons/filter.png' style='width:15px; height:15px;'>", 
            title:     'Filtro',
            onClick: function(btn, map) { 
				var modalFiltro = new bootstrap.Modal(document.getElementById('filtroInformacion'), {});
            	modalFiltro.toggle();
            }
        }]
});
//mostrarFiltroButton.addTo(mymap);

// Agregar  control impresion

var browserPrint = L.browserPrint(mymap,{debug:false, cancelWithEsc: true});

var controlbrowserPrint = L.control.browserPrint({
	id: 'idPrintButton',
	title: 'Exportar mapa a PDF',
	documentTitle: 'Mapa Educativo Interactivo de la Provincia del Chubut',
	printModes: [
    	L.BrowserPrint.Mode.Portrait('A4', {
        	margin: {left: 20, right: 0, top: 0, bottom: 0},
        	title: 'Vertical',
        	header: {
            	enabled: true,
            	text: "<span style=><img class='rounded float-end m-3 mb-0' src='icons/ministerio_educacion.png' style='max-height: 25px; height: auto; display:inline;vertical-align:middle;'></img></span>",
            	size: "15mm",
            	overTheMap: false,
            },
            footer: {
                enabled: true,
                text: "<span><h6 class='fst-italic mt-1'>Mapa Educativo Interactivo de la Provincia del Chubut</h6></span>",
            	size: "10mm",
                overTheMap: false,
            }
    	}),
        L.BrowserPrint.Mode.Landscape(
        	'A4', {
        	margin: {left: 0, right: 0, top: 0, bottom: 0}, 
        	title: 'Horizontal',
        	header: {
            	enabled: true,
            	text: "<span style=><img class='rounded float-end m-3 mb-0' src='icons/ministerio_educacion.png' style='max-height: 25px; height: auto; display:inline;vertical-align:middle;'></img></span>",
            	size: "15mm",
            	overTheMap: false,
            },
            footer: {
                enabled: true,
                text: "<span><h6 class='fst-italic mt-1'>Mapa Educativo Interactivo de la Provincia del Chubut</h6></span>",
            	size: "10mm",
                overTheMap: false,
            }
    	}),
        L.BrowserPrint.Mode.Personalizado(
        	'A4', {
        	margin: {left: 0, right: 0, top: 0, bottom: 0}, 
        	title: "Seleccionar Área",
        	header: {
            	enabled: true,
            	text: "<span style=><img class='rounded float-end m-3 mb-0' src='icons/ministerio_educacion.png' style='max-height: 25px; height: auto; display:inline;vertical-align:middle;'></img></span>",
            	size: "15mm",
            	overTheMap: false,
            },
            footer: {
                enabled: true,
                text: "<span><h6 class='fst-italic mt-1'>Mapa Educativo Interactivo de la Provincia del Chubut</h6></span>",
            	size: "10mm",
                overTheMap: false,
            }
        })
    ]
}, browserPrint);

function addFullmapPrint(){
	let print = document.getElementsByClassName('leaflet-control-browser-print')[0]

		let ul = document.createElement('UL')
		ul.classList = 'browser-print-holder'
		let li = document.createElement('LI')
		li.classList = 'browser-print-mode'
		li.style.display = 'none'
		let a = document.createElement('A')
		a.textContent = 'Descargar Mapa de Establecimientos'
		a.classList = 'descarga'
		a.setAttribute('download','EstablecimientosEducativosChubut.pdf')
		a.setAttribute('href', 'public/img/MapaEstablecimientosEducativosChubut.pdf')
		li.append(a)
		ul.append(li)


		print.append(ul)

		print.addEventListener('mouseover', () =>{
			li.style.display = 'inline-block'
		})

		print.addEventListener('mouseout', () =>{
			li.style.display = 'none'
		})
}

//controlbrowserPrint.addTo(mymap);

function removeButtonById(buttonId) {
    var buttonToRemove = document.getElementById(buttonId);
    if (buttonToRemove) {
        // Eliminar el botón del DOM o desactivarlo
        buttonToRemove.parentNode.removeChild(buttonToRemove);}
}

var epja = L.geoJSON(ed_epja, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			icon: L.icon({
				iconUrl: "icons/establecimientos_epja.svg",
				iconSize:     [22, 22], 
				iconAnchor:   [11, 0], 
				popupAnchor:  [0, 0] 
			}),
			riseOnHover: true
		});
	},	
	onEachFeature: onEachFeatureL
});
var artistica = L.geoJSON(ed_artistica, {
	pointToLayer: function (feature, latlng) {
		return L.marker(latlng, {
			icon: L.icon({
				iconUrl: "icons/establecimientos_artistica.svg",
				iconSize:     [22, 22], 
				iconAnchor:   [11, 0], 
				popupAnchor:  [0, 0] 
			}),
			riseOnHover: true
		});
	},	
	onEachFeature: onEachFeatureL
});		
//baselayer.addLayer(artistica);

//baselayer.addLayer(epja);
// Agregar leyenda a mapa 
/*
var	legends = [
        {
		label: "Delegaciones Administrativas",
		type: "image",
		url: "icons/delegacion_.svg",
		layers_type: "organizacion",
		layers: [del_admnistrativas],
		inactive: false,
        },
		/*{
		label: "Supervisión Inicial",
		type: "image",
		url: "icons/supervision_inicial.svg",
		layers_type: "organizacion",
		layers: [sup_inicial],
		inactive: false,
		},
        {
		label: "Supervisión Primaria",
		type: "image",
		url: "icons/supervision_primaria.svg",
		layers_type: "organizacion",
		layers: [sup_primaria],
		inactive: false,
        },
        {
		label: "Supervisión Secundaria",
		type: "image",
		url: "icons/supervision_secundaria.svg",
		layers_type: "organizacion",
		layers: [sup_secundaria],
		inactive: false,
        },
        {
		label: "Supervisión Privada",
		type: "image",
		url: "icons/supervision_privada.svg",
		layers_type: "organizacion",
		layers: [sup_privada],
		inactive: false,
        },
        {
		label: "Bibliotecas Pedagógicas",
		type: "image",
		url: "icons/biblioteca.svg",
		layers_type: "organizacion",
		layers: [bib_pedagogicas],
		inactive: true,
        },
		{
		label: "Ed. permanente de Jóvenes y Adultos",
		type: "image",
		url: "icons/establecimientos_epja.svg",
		layers_type: "establecimiento",
		layers: [epja],
		inactive: true,
		},
		{
		label: "Ed. Artística",
		type: "image",
		url: "icons/establecimientos_artistica.svg",
		layers_type: "establecimiento",
		layers: [artistica],
		inactive: true,
		}        
        ];
legend = L.control.Legend({
	position: "topleft",
	title: "Capas1",
	collapsed: true,
	symbolWidth: 17, 
	opacity: 1,
	column: false,
	legends: legends
    })
    .addTo(mymap);*/

// Agrega los tres botonones despues del legend


async function cargarBotonesMapa() {
		// Simula una carga de datos asíncrona, por ejemplo, desde un servidor
		await initMap();
		mostrarConsultaButton.addTo(mymap);
		//mostrarFiltroButton.addTo(mymap);
		controlbrowserPrint.addTo(mymap);
		addFullmapPrint();

		
}

cargarBotonesMapa();
// existe layer

function layerNoExiste(layer){
    var existe=true;
    for (i=0; i < legends.length; i++) {
        if(legends[i].label == layer ){
            existe = false;
        }
    }
    return existe;
}

// Agregar nueva legend
function agregarNuevaLegend(){
	if(legend instanceof L.Control.Legend){
		mymap.removeControl(legend);
		removeButtonById("idConsultaButton");
		removeButtonById("idPrintButton");
	}
	legend = new L.control.Legend({
	position: "topleft",
	title: "Capas",
	collapsed: true,
	symbolWidth: 17,
	opacity: 1,
	column: 1,
	legends: legends
    })
    .addTo(mymap);
	mostrarConsultaButton.addTo(mymap);
	controlbrowserPrint.addTo(mymap);
	addFullmapPrint();
}


//FUNCIONES PARA INTENTAR GENERAR UNA BASE DE CAPAS CREADAS
/*function mostrarModal() {
    var myModal = new bootstrap.Modal(document.getElementById('nombreCapaModal'));
    myModal.show();
  }

function agregarOpcion() {
	mostrarModal()
    var valorInput = document.getElementById('inputValor').value;
    if (valorInput.trim() !== '') {
      var select = document.getElementById('selectOpciones');
      var option = document.createElement('option');
      option.textContent = valorInput;
      option.value = valorInput;
      select.appendChild(option);
      document.getElementById('inputValor').value = ''; // Limpiar input
	  return valorInput;
    } else {
      alert('Por favor ingrese un valor válido.');
    }
}*/

//ya puede ubicar una escuela, falta corregir el popup que le anexa y la creacion de la nueva capa
var instSelected = [];
function itemsearchselected(selected){
	var id = selected.split("-")[0];
	var por = selected.split("-")[1];
	var name = prompt();
	fetch(`mapa/ubicacion?id=${id}`)
	.then(response => response.json())
	.then(data => {
		if(layerNoExiste(name)){
			instSelected.push(L.geoJSON(data, {
					pointToLayer: function (feature, latlng) {
							return L.marker(latlng, {
								icon: L.icon({
									iconUrl: "icons/establecimientos_consulta.svg",
									iconSize:     [22, 22], 
									iconAnchor:   [11, 0], 
									popupAnchor:  [0, 0]
								}),
								riseOnHover: true
							});
						},
					filter: function(feature, layer) {								
						return (feature.properties.id == id);
					},	
					onEachFeature: onEachFeatureL
			}));
			if (instSelected.length == 1) {
				mymap.fitBounds(instSelected[0].getBounds());
			}
			instSelected.forEach(marker => {
				baselayer.addLayer(marker)
			})
			mymap.setZoom(16);
			//limpiarItemsNombreEsc();
			//limpiarItemsNroEsc();
			updateButtonInLegend(name,{label: name,
				type: "image",
				url:  "icons/establecimientos_consulta.svg",
				layers_type: "consulta",
				layers: instSelected,
				inactive: false,
				});
			//agregarNuevaLegend();
			
			/*var myModalEl = document.getElementById('consultasEscuelas');
			var modal = bootstrap.Modal.getInstance(myModalEl);
			modal.hide();*/
			
		} else if (!layerNoExiste(name)){
			instSelected.push(L.geoJSON(data, {
				pointToLayer: function (feature, latlng) {
						return L.marker(latlng, {
							icon: L.icon({
								iconUrl: "icons/establecimientos_consulta.svg",
								iconSize:     [22, 22], 
								iconAnchor:   [11, 0], 
								popupAnchor:  [0, 0]
							}),
							riseOnHover: true
						});
					},
				filter: function(feature, layer) {								
					return (feature.properties.id == id);
				},	
				onEachFeature: onEachFeatureL
		}));
		instSelected.forEach(marker => {
			baselayer.addLayer(marker)
		})
		}else {
			if(por == "xnombre"){
				document.getElementById("infoNomNombreRepetidoFormControlSelect").style.display= "block";
			} else {
				document.getElementById("infoNumNombreRepetidoFormControlSelect").style.display= "block";
			}
		}
	})
	
}

function updateButtonInLegend(label, newContent) {
    var legends = legend.options.legends;
	// Actualizar el contenido del botón directamente
	legends.push(newContent);
	agregarNuevaLegend();


}



function limpiarItemsNombreEsc(){
	var fnombreescitem = document.getElementById("f-nombreesc-item");
	fnombreescitem.innerHTML = " ";
	var nombreescbtnclean = document.getElementById("f-nombreesc-item_btn_clean");
	nombreescbtnclean.style.display= "none";
	var nombreescbtn = document.getElementById("f-nombreesc-item_btn");
	nombreescbtn.style.display= "block";
	var nombreescblockitem = document.getElementById("nombreesc-block-item");
	nombreescblockitem.style.display= "none";
	var nombreesc = document.getElementById("f-nombreessc");
	nombreesc.value = "";
	var infoNombre = document.getElementById("infoNombre");
	var infoNombreError = document.getElementById("infoNombreError");
	var infoNombreErrorNonombre = document.getElementById("infoNombreErrorNonombre");
	infoNombre.style.display= "block";
	infoNombreError.style.display= "none";
	infoNombreErrorNonombre.style.display= "none";
	var infoNomNombreRepetidoFormControlSelect = document.getElementById("infoNomNombreRepetidoFormControlSelect");
	infoNomNombreRepetidoFormControlSelect.style.display= "none";
}

function limpiarItemsNroEsc(){
	var numeroescbtn = document.getElementById("f-nroesc-item_btn");
	var numeroescbtnclean = document.getElementById("f-nroesc-item_btn_clean");
	var infoNro = document.getElementById("infoNumero");
	var infoNroError = document.getElementById("infoNumeroError");
	var infoNroErrorNonombre = document.getElementById("infoNumeroErrorNumero");
	var numeroescblockitem = document.getElementById("f-numeroesc-block-item");
	var fnumeroescitem = document.getElementById("f-numeroesc-item");
	var numeroesc = document.getElementById("f-numeroesc");
	fnumeroescitem.innerHTML = " ";
	numeroescbtnclean.style.display= "none";
	numeroescbtn.style.display= "block";
	numeroescblockitem.style.display= "none";
	numeroesc.value = "";
	infoNro.style.display= "block";
	infoNroError.style.display= "none";
	infoNroErrorNonombre.style.display= "none";
	var infoNumNombreRepetidoFormControlSelect = document.getElementById("infoNumNombreRepetidoFormControlSelect");
	infoNumNombreRepetidoFormControlSelect.style.display= "none";
}

// Consultas ---------------------------------------------------------------------------------

// Consulta de establecimiento por cueanexo
/*
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
	var fcue = document.getElementById("f-cue");
	var miSelect = fcue.value;
	var res = false;
	if(layerNoExiste(miSelect)){
		if(cue_valido(miSelect)){
			infoCueAnexo.style.display = 'block';
			infoCueAnexoError.style.display = 'none';
			infoCueAnexoErrorNoExiste.style.display = 'none';
			var nombre = "";
			var cueAnexoSelect = L.geoJSON(localizaciones, {
					pointToLayer: function (feature, latlng) {
							return L.marker(latlng, {
								icon: L.icon({
								    iconUrl: "icons/establecimientos_consulta.svg",
								    iconSize:     [22, 22], 
								    iconAnchor:   [11, 0], 
								    popupAnchor:  [0, 0] 
								}),
								riseOnHover: true
							});
						},
					filter: function(feature, layer) {								
				 		// si encontro al menos uno
				 		if((feature.properties.cueanexo == miSelect) && res == false){
				 			nombre = feature.properties.cueanexo;
				 			res = true;	
				 		}
						return (feature.properties.cueanexo == miSelect);
					},	
					onEachFeature: onEachFeatureL	
			});		
			if(res){
				mymap.fitBounds(cueAnexoSelect.getBounds());
				mymap.setZoom(16);
				//baselayer.clearLayers();
				baselayer.addLayer(cueAnexoSelect);
				fcue.value = '';
				legends.push({label: nombre,
					type: "image",
					url:  "icons/establecimientos_consulta.svg",
					layers_type: "consulta",
					layers: [cueAnexoSelect],
					inactive: false,
				});
				var myModalEl = document.getElementById('consultasEscuelas');
				var modal = bootstrap.Modal.getInstance(myModalEl);
				modal.hide();
				agregarNuevaLegend();
			} else {
				infoCueNombreRepetidoFormControlSelect.style.display = 'none';
				infoCueAnexo.style.display = 'none';
				infoCueAnexoError.style.display = 'none';
				infoCueAnexoErrorNoExiste.style.display = 'block';
			}
		}else{
			infoCueNombreRepetidoFormControlSelect.style.display = 'none';
			infoCueAnexo.style.display = 'none';
			infoCueAnexoErrorNoExiste.style.display = 'none';
			infoCueAnexoError.style.display = 'block';
		}
	} else {
		infoCueAnexo.style.display = 'none';
		infoCueAnexoErrorNoExiste.style.display = 'none';
		infoCueAnexoError.style.display = 'none';
		infoCueNombreRepetidoFormControlSelect.style.display = 'block';
	}
}





// consulta de establecimientos por numero



// es numero





// consulta de establecimientos por localizaciones 

document.getElementById("regionFormControlSelect").addEventListener("change", habilitarLocalidad);
function habilitarLocalidad() {
	document.getElementById("inforegionspinner").style.display = 'block';
	var reg = document.getElementById("regionFormControlSelect");
	var loc = document.getElementById("departamentoFormControlSelect");
	var dir = document.getElementById("direccionFormControlSelect");
	var inforegionNoDatosFormControlSelect = document.getElementById("inforegionNoDatosFormControlSelect");
	var inforegionNoConnFormControlSelect = document.getElementById("inforegionNoConnFormControlSelect");
	inforegionNoDatosFormControlSelect.style.display = 'none';
	inforegionNoConnFormControlSelect.style.display = 'none';
	dir.innerHTML = '';
	dir.setAttribute("disabled", "");
	switch (reg.value) {	
		case 'todo':
		loc.innerHTML = '';
		dir.innerHTML = '';
		loc.setAttribute("disabled", "");
		dir.setAttribute("disabled", "");
		document.getElementById("inforegionspinner").style.display = 'none';
		break;
		default:
		loc.removeAttribute("disabled");
		fetch('php/solicitarlocalidades.php', {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			body: "region=" + reg.value
			})
			.then(response => response.json())
			.then(data => {
				if(data==="errornodatos"){
					document.getElementById("inforegionspinner").style.display = 'none';
					inforegionNoDatosFormControlSelect.style.display = 'block'
				} else {
					loc.innerHTML = '';
					loc.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
					for (const [clave, valor] of Object.entries(data)) {
						loc.innerHTML += `<option value="${clave}">${valor}</option>`;
					}
					inforegionNoDatosFormControlSelect.style.display = 'none';
					inforegionNoConnFormControlSelect.style.display = 'none';
					document.getElementById("inforegionspinner").style.display = 'none';	
				}
			})
			.catch(err => {
				document.getElementById("inforegionspinner").style.display = 'none';
          		inforegionNoConnFormControlSelect.style.display = 'block';
        	}
        );
	}
}

document.getElementById("departamentoFormControlSelect").addEventListener("change", habilitarDirecciones);
function habilitarDirecciones() {
	document.getElementById("infolocspinner").style.display = 'block';
	var reg = document.getElementById("regionFormControlSelect");
	var loc = document.getElementById("departamentoFormControlSelect");
	var dir = document.getElementById("direccionFormControlSelect");
	var infolocNoDatosFormControlSelect = document.getElementById("infolocNoDatosFormControlSelect");
	var infolocNoConnFormControlSelect = document.getElementById("infolocNoConnFormControlSelect");
	infolocNoDatosFormControlSelect.style.display = 'none';
	infolocNoConnFormControlSelect.style.display = 'none';
	switch (loc.value) {	
		case 'todo':
		dir.innerHTML = '';
		dir.setAttribute("disabled", "");
		document.getElementById("infolocspinner").style.display = 'none';
		break;
		default:
		dir.removeAttribute("disabled");
		const datos = new URLSearchParams("region="+ reg.value + "&localidad=" + loc.value);
		fetch('php/solicitardirecciones.php', {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			body: datos 
			})
			.then(response => response.json())
			.then(data => {
				if(data==="errornodatos"){
					document.getElementById("infolocspinner").style.display = 'none';
					infolocNoDatosFormControlSelect.style.display = 'block';
				} else {
					dir.innerHTML = '';
					dir.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
					for (const [clave, valor] of Object.entries(data)) {
						if(valor == ' '){
							dir.innerHTML += `<option value="sinddomicilioregistrado">Sin domicilio registrado</option>`;
						} else {
							dir.innerHTML += `<option value="${clave}">${valor}</option>`;
						}
					}
					infolocNoDatosFormControlSelect.style.display = 'none';
					infolocNoConnFormControlSelect.style.display = 'none';
					document.getElementById("infolocspinner").style.display = 'none';
				}	
			})
			.catch(err => {
				document.getElementById("infolocspinner").style.display = 'none';
          		infolocNoConnFormControlSelect.style.display = 'block';
        	}
        );
	}
}

var formuarioLoc = document.getElementById("formLocalizacion");
formuarioLoc.addEventListener("submit", function(e) {
	e.preventDefault();
	document.getElementById("consultalocalizacionspinner").style.display = 'block';
	var datos = new FormData(formuarioLoc);
	var inforegionFormControlSelect = document.getElementById("inforegionFormControlSelect");
	var infoLocNombreRepetidoFormControlSelect = document.getElementById("infoLocNombreRepetidoFormControlSelect");
	infoLocNombreRepetidoFormControlSelect.style.display = 'none';	
	var infolocNoDatosFinalesFormControlSelect = document.getElementById("infolocNoDatosFinalesFormControlSelect");
	var infolocNoConnFinalesFormControlSelect = document.getElementById("infolocNoConnFinalesFormControlSelect");
	infolocNoDatosFinalesFormControlSelect.style.display = 'none';
	infolocNoConnFinalesFormControlSelect.style.display = 'none';
	var r = datos.get('regionFormControlSelect')!='todo'?datos.get('regionFormControlSelect'):'';
	var l = datos.get('departamentoFormControlSelect')!=null && datos.get('departamentoFormControlSelect')!='todo'?" - " + datos.get('departamentoFormControlSelect'):'';
	var d = datos.get('direccionFormControlSelect')!=null && datos.get('direccionFormControlSelect')!='todo'?" - "+datos.get('direccionFormControlSelect'):'';
	var nombre = r + l + d;
	if(layerNoExiste(nombre)){
		fetch('php/solicitarestablacimientosxloc.php', {
			method: 'POST',
			body: datos 
			})
			.then(response => response.json())
			.then(data => {
				if(data==="errornoregion"){
					document.getElementById("consultalocalizacionspinner").style.display = 'none';
					inforegionFormControlSelect.style.display = 'block';
				} else if (data==="errornodatos"){
					document.getElementById("consultalocalizacionspinner").style.display = 'none';
					infolocNoDatosFinalesFormControlSelect.style.display = 'block';
				} else { 
					itemsearchcomplexselected(data, nombre);
					inforegionFormControlSelect.style.display = 'none';
					var reg = document.getElementById("regionFormControlSelect");
					var loc = document.getElementById("departamentoFormControlSelect");
					var dir = document.getElementById("direccionFormControlSelect");
					dir.innerHTML = '';
					dir.setAttribute("disabled", "");
					loc.innerHTML = '';
					loc.setAttribute("disabled", "");
					reg.value ="todo";
					infoLocNombreRepetidoFormControlSelect.style.display = 'none';
					infolocNoDatosFinalesFormControlSelect.style.display = 'none';
					infolocNoConnFinalesFormControlSelect.style.display = 'none';
					document.getElementById("consultalocalizacionspinner").style.display = 'none';
					var myModalEl = document.getElementById('consultasEscuelas');
					var modal = bootstrap.Modal.getInstance(myModalEl);
					modal.hide();
				}
			})
			.catch(err => {
				document.getElementById("consultalocalizacionspinner").style.display = 'none';
          		infolocNoConnFinalesFormControlSelect.style.display = 'block';
          		document.getElementById("infolocNoConnFormControlSelect").style.display = 'none';
          		document.getElementById("inforegionNoConnFormControlSelect").style.display = 'none';
        	}
        );
	} else {
		document.getElementById("consultalocalizacionspinner").style.display = 'none';
		infoLocNombreRepetidoFormControlSelect.style.display = 'block';
	} 	
})

// consulta de establecimientos por oferta

document.getElementById("f-tipo").addEventListener("change", habilitarNivel);
function habilitarNivel(){
	document.getElementById("infonivelspinner").style.display = 'block';
	var mod = document.getElementById("f-tipo");
	var nivel = document.getElementById("f-nivel");
	var infoofertamodalidadNoRep = document.getElementById("infoofertamodalidadNoRepFormControlSelect");
	var infoofertamodalidadNoConn = document.getElementById("infoofertamodalidadNoConnFormControlSelect");
	infoofertamodalidadNoRep.style.display = 'none';
	infoofertamodalidadNoConn.style.display = 'none';
	var fplanestudio = document.getElementById("f-plan-estudio");
	fplanestudio.style.display = 'none';
	var orientacion = document.getElementById("orientacion");
	var dictado = document.getElementById("dictado");
	orientacion.value = "todo";
	dictado.value = "todo";
	nivel.innerHTML = '';
	nivel.setAttribute("disabled", "");
	switch (mod.value) {	
		case 'todo':
		nivel.innerHTML = '';
		nivel.setAttribute("disabled", "");
		orientacion.innerHTML = '';
		orientacion.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
		orientacion.value = "todo";
		dictado.value = "todo";
		fplanestudio.style.display = 'none';
		document.getElementById("infonivelspinner").style.display = 'none';	
		break;
		default:
		fetch('php/solicitarniveles.php', {
			method: 'POST',
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			body: "modalidad=" + mod.value
			})
			.then(response => response.json())
			.then(data => {
				if(data==="errornodatos"){
					document.getElementById("infonivelspinner").style.display = 'none';
					nivel.innerHTML = '';
					nivel.setAttribute("disabled", "");
					infoofertamodalidadNoRep.style.display = 'block';
				} else {
					nivel.innerHTML = '';
					nivel.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
					for (const [clave, valor] of Object.entries(data)) {
						document.getElementsById("infoofertaplaetudioNoConnFormControlSelect").innerText += `<option value="${clave}">${valor}</option>`;		 
						nivel.innerHTML += `<option value="${clave}">${valor}</option>`;
					}
					infoofertamodalidadNoRep.style.display = 'none';
					infoofertamodalidadNoConn.style.display = 'none';
					nivel.removeAttribute("disabled");
					document.getElementById("infonivelspinner").style.display = 'none';
				}
			})
			.catch(err => {
				document.getElementById("infonivelspinner").style.display = 'none';
          		infoofertamodalidadNoConn.style.display = 'block';
        	}
        );
	}
}

document.getElementById("f-nivel").addEventListener("change", habilitarPlanesEstudio);
function habilitarPlanesEstudio(){
	document.getElementById("infoorientacionspinner").style.display = 'block';
	var mod = document.getElementById("f-tipo");
	var nivel = document.getElementById("f-nivel");
	var word = "secundari"
	var word1 = "snu"
	var fplanestudio = document.getElementById("f-plan-estudio");
	var orientacion = document.getElementById("orientacion");
	var dictado = document.getElementById("dictado");
	var infoofertaplaetudioNoConnFormControlSelect = document.getElementById("infoofertaplaetudioNoConnFormControlSelect");
	var infoofertafertaplaetudioNoRepFormControlSelect = document.getElementById("infoofertafertaplaetudioNoRepFormControlSelect");
	infoofertaplaetudioNoConnFormControlSelect.style.display = 'none';
	infoofertafertaplaetudioNoRepFormControlSelect.style.display = 'none';
	orientacion.innerHTML = '';
	orientacion.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
	orientacion.value = "todo";
	dictado.innerHTML = '';
	dictado.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
	dictado.value = "todo";
	fplanestudio.style.display = 'none';
	switch (nivel.value) {	
		case 'todo':
		orientacion.innerHTML = '';
		orientacion.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
		orientacion.value = "todo";
		dictado.innerHTML = '';
		dictado.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
		dictado.value = "todo";
		fplanestudio.style.display = 'none';
		document.getElementById("infoorientacionspinner").style.display = 'none';
		break;
		default:
		var valorn = nivel.value.toLowerCase();
		if(valorn.includes(word) || valorn.includes(word1)){
			var archivo = "";
			if(valorn.includes(word)){
				archivo = 'php/solicitarPlanesEstudio.php';
			} else {
				archivo = 'php/solicitarPlanesEstudioSNU.php' 
			}
			const datos = new URLSearchParams("modalidad="+ mod.value + "&nivel=" + nivel.value);
			fetch(archivo, {
				method: 'POST',
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				body: datos
				})
				.then(response => response.json())
				.then(data => {
					if(data==="errornodatos"){
						document.getElementById("infoorientacionspinner").style.display = 'none';
						orientacion.innerHTML = '';
						orientacion.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
						orientacion.value = "todo";
						infoofertafertaplaetudioNoRepFormControlSelect.style.display = 'block';
					} else {
						orientacion.innerHTML = '';
						orientacion.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
						for (const [clave, valor] of Object.entries(data)) {
							orientacion.innerHTML += `<option value="${clave}">${valor}</option>`;
						}
						infoofertaplaetudioNoConnFormControlSelect.style.display = 'none';
						infoofertafertaplaetudioNoRepFormControlSelect.style.display = 'none';
						document.getElementById("infoorientacionspinner").style.display = 'none';
					}
				})
				.catch(err => {
					document.getElementById("infoorientacionspinner").style.display = 'none';
	          		infoofertaplaetudioNoConnFormControlSelect.style.display = 'block';
	        	}
	        );
			document.getElementById("infoorientacionspinner").style.display = 'none';
			fplanestudio.style.display = 'block';
		}
	}
}

document.getElementById("orientacion").addEventListener("change", habilitarDictado);
function habilitarDictado(){
	document.getElementById("infodictadospinner").style.display = 'block';
	var mod = document.getElementById("f-tipo");
	var nivel = document.getElementById("f-nivel");
	var orientacion = document.getElementById("orientacion");
	var dictado = document.getElementById("dictado");
	var infoofertafertadictadoNoRepFormControlSelect = document.getElementById("infoofertafertadictadoNoRepFormControlSelect");	        
	infoofertafertadictadoNoRepFormControlSelect.style.display = 'none';
	var infoofertadictadoNoConnFormControlSelect = document.getElementById("infoofertadictadoNoConnFormControlSelect");
	infoofertadictadoNoConnFormControlSelect.style.display = 'none';
	switch (orientacion.value) {	
		case 'todo':
		dictado.innerHTML = '';
		dictado.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
		dictado.value = "todo";
		document.getElementById("infodictadospinner").style.display = 'none';
		break;
		default:
		const datos = new URLSearchParams("modalidad="+ mod.value + "&nivel=" + nivel.value + "&orientacion=" + orientacion.value);
		fetch('php/solicitardictado.php', {
			method: 'POST',
			body: datos 
			})
			.then(response => response.json())
			.then(data => {
				if (data==="errornodatos"){
					document.getElementById("infodictadospinner").style.display = 'none';
					dictado.innerHTML = '';
					dictado.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
					dictado.value = "todo";
					infoofertafertadictadoNoRepFormControlSelect.style.display = 'block';
				} else { 
					dictado.innerHTML = '';
					dictado.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
					for (const [clave, valor] of Object.entries(data)) {
						dictado.innerHTML += `<option value="${clave}">${valor}</option>`;
					}
					infoofertadictadoNoConnFormControlSelect.style.display = 'none';
					infoofertafertadictadoNoRepFormControlSelect.style.display = 'none';
					document.getElementById("infodictadospinner").style.display = 'none';
				}
			})
			.catch(err => {
				document.getElementById("infodictadospinner").style.display = 'none';
          		infoofertadictadoNoConnFormControlSelect.style.display = 'block';
        	}
        );	
	}
}

var formuarioOferta = document.getElementById("formOferta");
formuarioOferta.addEventListener("submit", function(e) {
	e.preventDefault();
	document.getElementById("consultaofertaspinner").style.display = 'block';
	var datos = new FormData(formuarioOferta);
	var t = datos.get('f-tipo')!='todo'?datos.get('f-tipo'):''
	var n = datos.get('f-nivel')!='todo'?' - ' +datos.get('f-nivel'):''
	var o = datos.get('orientacion')!='todo'?' - ' +datos.get('orientacion'):''
	var d = datos.get('dictado')!='todo'?' - ' +datos.get('dictado'):''
	var nombre = t +  n  + o  + d;
	var infoofertaNoModalidadFormControlSelect = document.getElementById("infoofertaNoModalidadFormControlSelect");
	infoofertaNoModalidadFormControlSelect.style.display = "none";
	var infoOfertaNombreRepetidoFormControlSelect = document.getElementById("infoOfertaNombreRepetidoFormControlSelect");
	infoOfertaNombreRepetidoFormControlSelect.style.display = 'none';
	var infoOfertaNoDatosFinalesFormControlSelect = document.getElementById("infoOfertaNoDatosFinalesFormControlSelect");	        
	infoOfertaNoDatosFinalesFormControlSelect.style.display = 'none';
	var infoOfertaNoConnFinalesFormControlSelect = document.getElementById("infoOfertaNoConnFinalesFormControlSelect");
	infoOfertaNoConnFinalesFormControlSelect.style.display = 'none';
	if(layerNoExiste(nombre)){
		if(datos.get('f-tipo') != "todo"){
			infoofertaNoModalidadFormControlSelect.style.display = "none";
			fetch('php/solicitarestablacimientosxoferta.php', {
				method: 'POST',
				body: datos 
				})
				.then(response => response.json())
				.then(data => {
					if(data==="errornotipo"){
						document.getElementById("consultaofertaspinner").style.display = 'none';
						infoofertaNoModalidadFormControlSelect.style.display = 'block';
					} else if (data==="errornodatos"){
						document.getElementById("consultaofertaspinner").style.display = 'none';
						infoOfertaNoDatosFinalesFormControlSelect.style.display = 'block';
					} else { 
						itemsearchcomplexselected(data, nombre);
				
						var nivel = document.getElementById("f-nivel");
						nivel.innerHTML = '';
						nivel.setAttribute("disabled", "");
						var orientacion = document.getElementById("orientacion");
						orientacion.innerHTML = '';
						orientacion.innerHTML += `<option selected value="todo">Sin seleccionar</option>`;
						orientacion.value = "todo";
						document.getElementById("dictado").value = "todo";
						document.getElementById("f-plan-estudio").style.display = 'none';
						document.getElementById("f-tipo").value = "todo";
						document.getElementById("infoofertaplaetudioNoConnFormControlSelect").style.display = 'none';
	          			document.getElementById("infoofertamodalidadNoConnFormControlSelect").style.display = 'none';
						infoOfertaNoConnFinalesFormControlSelect.style.display = 'none';
						infoOfertaNoDatosFinalesFormControlSelect.style.display = 'none';
						infoofertaNoModalidadFormControlSelect.style.display = 'none';
						infoOfertaNombreRepetidoFormControlSelect.style.display = 'none';
						document.getElementById("consultaofertaspinner").style.display = 'none';
						var myModalEl = document.getElementById('consultasEscuelas');
						var modal = bootstrap.Modal.getInstance(myModalEl);
						modal.hide();
					}
				})
				.catch(err => {
					document.getElementById("consultaofertaspinner").style.display = 'none';
	          		infoOfertaNoConnFinalesFormControlSelect.style.display = 'block';
	          		document.getElementById("infoofertaplaetudioNoConnFormControlSelect").style.display = 'none';
	          		document.getElementById("infoofertamodalidadNoConnFormControlSelect").style.display = 'none';
	          		document.getElementById("infoofertadictadoNoConnFormControlSelect").style.display = 'none';
	        	}
	        );
		} else {
			document.getElementById("consultaofertaspinner").style.display = 'none';
			infoofertaNoModalidadFormControlSelect.style.display = 'block';
		}
	} else {
		document.getElementById("consultaofertaspinner").style.display = 'none';
		infoOfertaNombreRepetidoFormControlSelect.style.display = 'block';
	}
})

//consulta de establecimientos por otros



var formuarioOtros = document.getElementById("formOtros");
formuarioOtros.addEventListener("submit", function(e) {
	e.preventDefault();
	document.getElementById("consultaotrosspinner").style.display = 'block';
	var datos = new FormData(formuarioOtros);
	var infotNoSelectedFormControlSelect = document.getElementById("infoOtrosNoSelecFormControlSelect");
	var infotNoNombreFormControlSelect = document.getElementById("infotNoNombreFormControlSelect");
	var infoOtrosNoResultFormControlSelect = document.getElementById("infoOtrosNoResultFormControlSelect");
	var infoOtrosNombreRepetidoFormControlSelect = document.getElementById("infoOtrosNombreRepetidoFormControlSelect");
	var infoOtrosNoConnFormControlSelect = document.getElementById("infoOtrosNoConnFormControlSelect");
	infoOtrosNombreRepetidoFormControlSelect.style.display = 'none';
	infotNoSelectedFormControlSelect.style.display = 'none';	
	infotNoNombreFormControlSelect.style.display = 'none';
	infoOtrosNoResultFormControlSelect.style.display = 'none';
	infoOtrosNoConnFormControlSelect.style.display = 'none';
	var nombre = datos.get('nombrecapa');
	console.log("iniciando conexion a postgres")
	if(layerNoExiste(nombre)){
		fetch('php/solicitarestablacimientosxotros.php', {
			method: 'POST',
			body: datos 
			})
			.then(response => response.json())
			.then(data => {
				if(data==="errornoselected"){
					document.getElementById("consultaotrosspinner").style.display = 'none';
					infotNoSelectedFormControlSelect.style.display = 'block';
				} else if (data==="errornonombre"){
					document.getElementById("consultaotrosspinner").style.display = 'none';
					infotNoNombreFormControlSelect.style.display = 'block';
				} else if (data==="errornodatos"){
					document.getElementById("consultaotrosspinner").style.display = 'none';
					infoOtrosNoResultFormControlSelect.style.display = 'block';
				} else if(data==="errornoconsulta"){
					document.getElementById("consultaotrosspinner").style.display = 'none';
					infoOtrosNoResultFormControlSelect.style.display = 'block';
				}  else {
					itemsearchcomplexselected(data, nombre);
					infotNoSelectedFormControlSelect.style.display = 'none';	
					infotNoNombreFormControlSelect.style.display = 'none';
					infoOtrosNoResultFormControlSelect.style.display = 'none';
					infoOtrosNombreRepetidoFormControlSelect.style.display = 'none';
					infoOtrosNoConnFormControlSelect.style.display = 'none';
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
					var fielset1 = document.getElementById("paso1");
					var fielset2 = document.getElementById("paso2");
					var fielset3 = document.getElementById("paso3");
					fielset2.style.display = 'none';
					fielset3.style.display = 'none';
					fielset1.style.display = 'block';
					document.getElementById("consultaotrosspinner").style.display = 'none';
					var myModalEl = document.getElementById('consultasEscuelas');
					var modal = bootstrap.Modal.getInstance(myModalEl);
					modal.hide();
				}
			})
			.catch(err => {
				document.getElementById("consultaotrosspinner").style.display = 'none';
          		infoOtrosNoConnFormControlSelect.style.display = 'block';
        	}
        );
	} else {
		document.getElementById("consultaotrosspinner").style.display = 'none';
		infoOtrosNombreRepetidoFormControlSelect.style.display = 'block';
	}
})

function itemsearchcomplexselected(data, name){	
	var locfiltered = {
		"features": []
	};

	var pointsmarker = [];

	var len = localizaciones.features.length;
	
	for (const [clave, valor] of Object.entries(data)) {
		for (var i = 0; i < len; i++){
			if(localizaciones.features[i].properties.cueanexo == valor){
				locfiltered.features.push(localizaciones.features[i]);
				pointsmarker.push(localizaciones.features[i].geometry.coordinates);
			}
		}
	}

	var estxlocalizacion = L.geoJSON(locfiltered, {
			pointToLayer: function (feature, latlng) {
					return L.marker(latlng, {
						icon: L.icon({
						    iconUrl: "icons/establecimientos_consulta.svg",
							iconSize:     [22, 22], 
							iconAnchor:   [11, 0], 
							popupAnchor:  [0, 0]
						}),
						riseOnHover: true
					});
				},	
			onEachFeature: onEachFeatureL
	});				
	baselayer.addLayer(estxlocalizacion);
	legends.push({label: name,
		type: "image",
		url:  "icons/establecimientos_consulta.svg",
		layers_type: "consulta",
		layers: [estxlocalizacion],
		inactive: false,
        });
	agregarNuevaLegend();
	var bounds = new L.LatLngBounds(pointsmarker);
	mymap.fitBounds(bounds);
	// aca lng va primero que lat, por eso es que se dan vuelta 
	mymap.setView(new L.LatLng(bounds.getCenter().lng,bounds.getCenter().lat));
}*/

// Quitar capas  desde legend

/*function eliminarlayer(namelayer){
	legends = legends.filter(function(value, index, arr){ 
        return value.label != namelayer;
    });
	agregarNuevaLegend();
}*/

// actualiza legends dede legend

function actualizarLegends(label, inactive){
    for (i=0; i < legends.length; i++) {
        if(legends[i].label == label ){
            legends[i].inactive = inactive;
        }
    }
}



// Mostrar poput info layer de legend

function mostrarpoputinfo(namelayer){
	document.getElementById("staticBackdropLabelleyend").innerHTML= namelayer;
	var staticBMBL = document.getElementById("staticBMBL");
	staticBMBL.innerHTML = "";
	switch (namelayer) {
		case "Regiones Educativas":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3 text-danger">No esta la info de la capa!</p>`;
			break;
		case "Ministerio de Educación":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3 text-danger">No esta la info de la capa!</p>`;
			break;
		case "Supervisión Inicial":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos del nivel inicial.</p>`;
			break;
		case "Supervisión Primaria":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3 ">Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos del nivel primario.</p>`;
			break;
		case "Supervisión Secundaria":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos del nivel secundario.</p>`;
			break;
		case "Supervisión Privada":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos de gestión privada.</p>`;
			break;
		case "Delegaciones Administrativas":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3 text-danger">No esta la info de la capa!</p>`;
			break;
		case "Bibliotecas Pedagógicas":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3 text-danger">No esta la info de la capa!</p>`;
			break;
		case "Ed. Domiciliaria y Hospitalaria":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Es la modalidad del sistema educativo en los niveles de Educación Inicial, Primaria y Secundaria, destinada a garantizar el derecho a la educación de los/ as estudiantes que, por razones de salud, se ven imposibilitados/as de asistir con regularidad a una institución educativa en los niveles de la educación obligatoria, por períodos de quince (15) días corridos o más.</p>`;
			break;
		case "Ed. Especial":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Es la modalidad del Sistema Educativo destinada a asegurar el derecho a la educación de las personas con discapacidades, temporales o permanentes, en todos los niveles y modalidades del Sistema Educativo.</p>`;
			break;
		case "Ed. Inicial":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">La educación inicial constituye una unidad pedagógica que brinda educación a los/as niños/as desde los cuarenta y cinco (45) días hasta los cinco (5) años de edad inclusive, siendo obligatoria la sala de cinco (5) años.</p>`;
			break;
		case "Ed. Primaria":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">La educación primaria es obligatoria y constituye una unidad pedagógica que tiene por finalidad brindar una enseñanza común, integral y básica que asegure a los/as niños/as las condiciones para el acceso, tránsito, permanencia y egreso del nivel. Tiene una duración de seis (6) años, organizada en dos ciclos de tres (3) años cada uno.</p>`;
			break;
		case "Ed. Secundaria":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">La educación secundaria es obligatoria, constituye una unidad pedagógica y organizativa destinada a los/as adolescentes, jóvenes y adultos que hayan cumplido con el nivel de educación primaria.</p>`;
			break;
		case "Ed. Superior no universitaria":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Está constituida por los Institutos de Educación Superior, sean éstos de formación docente, humanística, social, técnico-profesional o artística y por instituciones nacionales y provinciales de educación no universitaria.</p>`;
			break;
		case "Ed. perm. de Jovenes y Adultos":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Es la modalidad educativa destinada a garantizar la alfabetización y el cumplimiento de la obligatoriedad escolar, a quienes no la hayan completado en la edad establecida reglamentariamente, y a brindar posibilidades de educación a lo largo de toda la vida.</p>`;
			break;
		case "Formación Profesional":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Es la modalidad de la Educación Secundaria y la Educación Superior, responsable de la formación de Técnicos Medios y Técnicos Superiores, en áreas ocupacionales específicas y de la formación profesional, introduciendo a los/as estudiantes, jóvenes y adultos, en un recorrido de profesionalización a partir del acceso a una base de conocimientos y de habilidades profesionales que les permita su inserción en áreas ocupacionales cuya complejidad exige haber adquirido una formación general, una cultura científico tecnológica de base a la par de una formación técnica específica de carácter profesional, así como continuar aprendiendo durante toda su vida.</p>`;
			break;
		case "Otros servicios educativos":
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3">Esta capa no tiene descripción</p>`;
			break;
		default:
			staticBMBL.innerHTML = `<p class="text-center text-break fs-6 fst-italic lh-sm user-select-none pt-3 text-danger text-danger">No esta la info de la capa!</p>`;	
	}
	var modalFiltro = new bootstrap.Modal(document.getElementById('staticBackdropleyend'), {});
	modalFiltro.toggle();
}

// Mostrar poput quetion de legend

function mostrarpoputquestion(msg){
	document.getElementById("staticBackdropLabelleyend").innerHTML= "Ayuda sobre " + msg;
	var staticBMBL = document.getElementById("staticBMBL");
	staticBMBL.innerHTML = "";
	staticBMBL.innerHTML = `<p id="AyudaCapas" class="text-break fs-6 fst-italic lh-sm user-select-none fw-light pt-3">
						Despliega el listado de las capas (organizadas en grupos) que se visualizan en el mapa, permitiendo:
						<ul class="text-break fs-6 fst-italic lh-sm user-select-none">
							<li><a href='#AyudaActivarCapas' class="text-decoration-none fw-light">Activar y desactivar capas.</a></li>
							<li><a href='#AyudaExportarInfo' class="text-decoration-none fw-light">Exportar la información de las capas a un archivo de Excel.</a></li>
							<li><a href='#AyudaVerDetalle' class="text-decoration-none fw-light">Ver detalle de las capas.</a></li>
							<li><a href='#AyudaEliminarCapa' class="text-decoration-none fw-light">Eliminar capas de consulta.</a></li>
						</ul>
						<p id="AyudaActivarCapas" class="text-center text-break fw-bold fs-6 fst-italic lh-sm user-select-none pt-3">Activar y desactivar capas</p>
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">1. Hacer clic sobre el listado de capas para desplegarlo.</p>
						<img class="img-fluid mb-2" src="icons/lxayd0.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">2. Hacer clic sobre el grupo de capas para desplegarlo. En el ejemplo, se despliega el grupo de capas llamado Establecimientos.</p>
						<img class="img-fluid mb-2" src="icons/lxayd1.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">3. Hacer clic sobre el nombre de la capa (activa) que se desea desactivar. En el ejemplo, se desactiva la capa de Ed. Secundaria.</p>
						<img class="img-fluid mb-2" src="icons/lxayd2.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">4. Para volver a activar, hacer clic sobre el nombre de la capa (desactivada) que se desea activar. En el ejemplo, se activa la capa de Ed. Secundaria.</p>
						<img class="img-fluid mb-2" src="icons/lxayd3.png" alt="busqueda mapa educativo interactivo chubut">
						<a href='#AyudaCapas' class="text-decoration-none fw-light text-end fs-6 fst-italic">Volver al principio</a>
						<p id="AyudaExportarInfo" class="text-center text-break fw-bold fs-6 fst-italic lh-sm user-select-none pt-3">Exportar la información de las capas a un archivo de Excel</p>
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">1. Hacer clic sobre el listado de capas para desplegarlo.</p>
						<img class="img-fluid mb-2" src="icons/lxayd0.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">2. Hacer clic sobre el grupo de capas para desplegarlo. En el ejemplo, se despliega el grupo de capas llamado Establecimientos.</p>
						<img class="img-fluid mb-2" src="icons/lxayd1.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">3. Hacer clic sobre el botón 'Exportar capa a Excel', en el ejemplo, se va a exportar la capa de Ed. Secundaria.</p>
						<img class="img-fluid mb-2" src="icons/lxexp2.png" alt="busqueda mapa educativo interactivo chubut">
						<a href='#AyudaCapas' class="text-decoration-none fw-light text-end fs-6 fst-italic">Volver al principio</a>
						<p id="AyudaVerDetalle" class="text-center text-break fw-bold fs-6 fst-italic lh-sm user-select-none pt-3">Ver detalle de las capas</p>
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">1. Hacer clic sobre el listado de capas para desplegarlo.</p>
						<img class="img-fluid mb-2" src="icons/lxayd0.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">2. Hacer clic sobre el grupo de capas para desplegarlo, en el ejemplo, se despliega el grupo de capas llamado Establecimientos.</p>
						<img class="img-fluid mb-2" src="icons/lxayd1.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">3. Hacer clic sobre el botón 'Saber más sobre esta capa', en el ejemplo, se desea saber sobre la capa de Ed. Secundaria.</p>
						<img class="img-fluid mb-2" src="icons/lxcapavd2.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">4. Se abre la información de la capa elegida.</p>
						<a href='#AyudaCapas' class="text-decoration-none fw-light text-end fs-6 fst-italic">Volver al principio</a>
						<p id="AyudaEliminarCapa" class="text-center text-break fw-bold fs-6 fst-italic lh-sm user-select-none pt-3">Eliminar capas de consulta</p>
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">1. Hacer clic sobre el listado de capas para desplegarlo.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc0.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">2. Hacer clic sobre el grupo de capas 'Consulta' para desplegarlo.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc1.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">3. Hacer clic sobre el botón 'Eliminar capa', en el ejemplo, se desea eliminar la capa 'Escuela para la vida'.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc2.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">4. Se abre el dialogo solicitando que se confirme la acción, en el caso de que se desee continuar, hacer clic sobre el botón 'Confirmar' para eliminar la capa.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc3.png" alt="busqueda mapa educativo interactivo chubut">
						<a href='#AyudaCapas' class="text-decoration-none fw-light text-end fs-6 fst-italic">Volver al principio</a>
					</p>`;
	var modalFiltro = new bootstrap.Modal(document.getElementById('staticBackdropleyend'), {});
	modalFiltro.toggle();
}

// Descargar excel desde legend 

function downloadAsExcel(namelayer){
	var datosLabel = "";
	switch (namelayer) {
		case "Ministerio de Educación":
		datosLabel = ministerio_educacion.features;
		break;
		case "Supervisión Inicial":
		datosLabel = supervicion_inicial.features;
		break;
		case "Supervisión Primaria":
		datosLabel = supervicion_primaria.features;
		break;
		case "Supervisión Secundaria":
		datosLabel = supervicion_secundaria.features;
		break;
		case "Supervisión Privada":
		datosLabel = supervicion_privada.features;
		break;
		case "Delegaciones Administrativas":
		datosLabel = delegaciones_administrativas.features;
		break;
		case "Bibliotecas Pedagógicas":
		datosLabel = bibliotecas_pedagogicas.features;
		break;
		case "Ed. Domiciliaria y Hospitalaria":
		datosLabel = ed_domiciliaria_hospitalaria.features;
		break;
		case "Ed. Especial":
		datosLabel = ed_especial.features;
		break;
		case "Ed. Inicial":
		datosLabel = ed_inicial.features;
		break;
		case "Ed. Primaria":
		datosLabel = ed_primaria.features;
		break;
		case "Ed. Secundaria":
		datosLabel = ed_secundaria.features;
		break;
		case "Ed. Superior no universitaria":
		datosLabel = ed_superior.features;
		break;
		case "Ed. perm. de Jovenes y Adultos":
		datosLabel = ed_epja.features;
		break;
		case "Formación Profesional":
		datosLabel = ed_form_prof.features;
		break;
		case "Otros servicios educativos":
		datosLabel = ed_otros_serv_comp.features;
		break;
		default:
		var datosL = []; 
		var layerN = legends.filter(function(value, index, arr){ 
        	return value.label === namelayer;
        });
		var layerN_array = layerN[0].layers[0]._layers;
		for (const [clave, obj] of Object.entries(layerN_array)) {
			datosL.push(obj.feature);
		}
		datosLabel = datosL;
	}
	var len = datosLabel.length;
	var datosObj = []
	for (var i = 0; i < len; i++){
		datosObj.push(datosLabel[i].properties);
	}
	downloadAsExcelD(namelayer, datosObj);
}

//FALTA AGREGAR FUNCIOON EXPORTAR INFO COMO EXCEL
/*
document.getElementById("exportarinfoadicional").addEventListener("click", downloadAsExceInfoAdicional);
function downloadAsExceInfoAdicional(){
	var namelayer = document.getElementById("fnainfoadicional").innerText;
	var datosObj = [];
	var obj = {};
	obj["cueanexo"] = document.getElementById("cueanexoinfoadicionale").innerHTML; 
	obj["fna"] = document.getElementById("fnainfoadicionale").innerHTML;
	obj["domicilio"] = document.getElementById("calleinfoadicionale").innerHTML; 
	obj["fun"] = document.getElementById("funinfoadicionale").innerHTML; 
	obj["codigoPostal"] = document.getElementById("cod_postalinfoadicionale").innerHTML;
	obj["localidad"] = document.getElementById("Localidadinfoadicionale").innerHTML; 
	obj["departemento"] = document.getElementById("departamentoinfoadicionale").innerHTML; 
	obj["ambito"] = document.getElementById("amginfoadicionale").innerHTML; 
	obj["region"] = document.getElementById("Regioninfoadicionale").innerHTML; 
	obj["modalidad"] = document.getElementById("Modalidadinfoadicionale").innerHTML; 
	obj["niveles"] = document.getElementById("Nivelesinfoadicionale").innerHTML; 
	obj["jornadainfoadicional"] = document.getElementById("jornadainfoadicionale").innerHTML;
	obj["turnoinfoadicional"] = document.getElementById("turnoinfoadicionale").innerHTML;
	obj["oferta"] = document.getElementById("Ofertainfoadicionale").innerHTML; 
	obj["dependencia"] = document.getElementById("Dependenciinfoadicionale").innerHTML; 
	obj["gestion"] = document.getElementById("gesinfoadicionale").innerHTML;
	obj["telefono"] = document.getElementById("telefonoinfoadicionale").innerHTML; 
	obj["email"] = document.getElementById("emailinfoadicionale").innerText; 
	obj["web"] = document.getElementById("sitio_webinfoadicionale").innerText; 
	obj["responsable"] = document.getElementById("resp_respnsableinfoadicionale").innerHTML; 
	obj["tel_responsable"] = document.getElementById("resp_telresponsableinfoadicionale").innerHTML; 
	obj["bibliotecainfoadicional"] = document.getElementById("bibliotecainfoadicionale").innerHTML;
	obj["laboratorioinfoadicional"] = document.getElementById("laboratorioinfoadicionale").innerHTML;
	obj["internetinfoadicional"] = document.getElementById("internetinfoadicionale").innerHTML;
	obj["energiainfoadicional"] = document.getElementById("energiainfoadicionale").innerHTML;
	obj["fuentenergiainfoadicional"] = document.getElementById("fuentenergiainfoadicionale").innerHTML;
	obj["aguainfoadicional"] = document.getElementById("aguainfoadicionale").innerHTML;
	datosObj.push(obj);
	downloadAsExcelD(namelayer, datosObj);
}*/

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

function downloadAsExcelD(filename, data){
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
        Sheets:{        
            'data': worksheet
        },
        SheetNames:['data'] 
    };
    const excelBuffer = XLSX.write(workbook,{ bookType: 'xlsx', type: 'array'});
    saveAsExcel(excelBuffer, filename);    
}

function saveAsExcel(buffer, filename){
    const data = new Blob([buffer], {type:EXCEL_TYPE});
    saveAs (data,filename + '_export_' + new Date().getTime()+EXCEL_EXTENSION);
}


// mostrar mapa

function verMapa(){
	var mapa = document.getElementById("map");
	mapa.classList.remove('invisible');
}

// maneja pasos de modal	

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

function showElementsById(ids) {
	var idList = ids.split(" ");
	var item;
	for (var i = 0; i < idList.length; i++) {
		item = document.getElementById(idList[i]);
		if (item) {
			item.style.display = 'block';
		}
	}
}

function hideElementsById(ids) {
	var idList = ids.split(" ");
	var item;
	for (var i = 0; i < idList.length; i++) {
		item = document.getElementById(idList[i]);
		if (item) {
			item.style.display = 'none';
		}
	}
}	


	
// mostrar ocultar informes

function mostrarInfoAdicional(){
	document.getElementById("map").style.display = "none";
	document.getElementById("InfoAdicional").style.display = "block";
}
function nomostrarInfoAdicional(){
	document.getElementById("map").style.display = "block";
	document.getElementById("InfoAdicional").style.display = "none";	
}

// cambiar tamaño imagen navbar
/*
if (screen.height < 576){
	imgnavbar.style.height = '22px'; 
}

window.addEventListener('resize', function(event){
	var imgnavbar = document.getElementById("imgnavbar");
	if (screen.height < 576){
		imgnavbar.style.height = '22px';
		imgnavbar.style.width = '35px'; 
	} else {
		imgnavbar.style.height = '32px';
		imgnavbar.style.widtht = '45px';
	}
});*/

// control button modal inicio

function buttonHidden(){
	var ElementCssClass = document.getElementById("utimoitem").className;
	var buttonNext = document.getElementById("buttonNext");
	if("carousel-item carousel-item-next carousel-item-start" === ElementCssClass)
		buttonNext.style.visibility  = 'hidden';
	else {
		buttonNext.innerText = "Ver capas";
	}
}


// modal filtro

function resetFormFiltro() {
	var form = document.getElementById("seleccionarfila");
	var inputs = form.getElementsByTagName('input');
	for (var i = 0; i<inputs.length; i++) {
		inputs[i].checked = false;
		inputs[i].disabled = false;
	}
	var form = document.getElementById("seleccionarcolumna");
	var inputs = form.getElementsByTagName('input');
	for (var i = 0; i<inputs.length; i++) {
		inputs[i].checked = false;
		inputs[i].disabled = false;   
	}
	var form = document.getElementById("seleccionardato");
	var inputs = form.getElementsByTagName('input');
	for (var i = 0; i<inputs.length; i++) {
		inputs[i].checked = false;
		inputs[i].disabled = false;   
	}
	var infoestablecimientosxfiltronoselect = document.getElementById("infoestablecimientosxfiltronoselect");
	infoestablecimientosxfiltronoselect.style.display = 'none';
	var infoestablecimientosxfiltronoconn = document.getElementById("infoestablecimientosxfiltronoconn");
	infoestablecimientosxfiltronoconn.style.display = 'none';
	document.getElementById("seleccionarfilah").style.display = 'none';
	document.getElementById("seleccionarcolumnah").style.display = 'none';

	return false;
}



var flexSwitchCheckMatricula = document.getElementById("flexSwitchCheckMatricula")
flexSwitchCheckMatricula.addEventListener("change", function() {
	var form = document.getElementById("seleccionardato");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckMatricula.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckMatricula){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}
		document.getElementById("seleccionarfilah").style.display = 'block';
		document.getElementById("seleccionarcolumnah").style.display = 'block';
		document.getElementById("colflexSwitchCheckNivel").style.display = 'block';
		document.getElementById("colfilavacia").style.display = 'none';
		document.getElementById("colflexSwitchCheckAmbito1").style.display = 'block';
		document.getElementById("colflexSwitchCheckGestion1").style.display = 'block';
		document.getElementById("colflexSwitchCheckRegion1").style.display = 'block';
		document.getElementById("colclovacia1").style.display = 'none';
		document.getElementById("colclovacia2").style.display = 'none';
		document.getElementById("colclovacia3").style.display = 'none';

	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
		document.getElementById("seleccionarfilah").style.display = 'none';
		document.getElementById("seleccionarcolumnah").style.display = 'none';
		document.getElementById("colflexSwitchCheckNivel").style.display = 'none';
		document.getElementById("colfilavacia").style.display = 'block';
		var form = document.getElementById("seleccionarfila");
		var inputs = form.getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			inputs[i].checked = false;
			inputs[i].disabled = false;
		}
		document.getElementById("colflexSwitchCheckAmbito1").style.display = 'none';
		document.getElementById("colflexSwitchCheckGestion1").style.display = 'none';
		document.getElementById("colflexSwitchCheckRegion1").style.display = 'none';
		document.getElementById("colclovacia1").style.display = 'block';
		document.getElementById("colclovacia2").style.display = 'block';
		document.getElementById("colclovacia3").style.display = 'block';
		var form = document.getElementById("seleccionarcolumna");
		var inputs = form.getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			inputs[i].checked = false;
			inputs[i].disabled = false;   
		}
	}

})
var flexSwitchCheckEstablecimiento = document.getElementById("flexSwitchCheckEstablecimiento")
flexSwitchCheckEstablecimiento.addEventListener("change", function() {
	var form = document.getElementById("seleccionardato");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckEstablecimiento.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckEstablecimiento){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
		document.getElementById("seleccionarfilah").style.display = 'block';
		document.getElementById("seleccionarcolumnah").style.display = 'block';
		document.getElementById("colflexSwitchCheckRegion").style.display = 'block';
		document.getElementById("colfilavacia").style.display = 'none';
		document.getElementById("colflexSwitchCheckAmbito1").style.display = 'block';
		document.getElementById("colflexSwitchCheckGestion1").style.display = 'block';
		document.getElementById("colflexSwitchCheckRegion1").style.display = 'none';
		document.getElementById("colclovacia1").style.display = 'none';
		document.getElementById("colclovacia2").style.display = 'none';
		document.getElementById("colclovacia3").style.display = 'block';
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
		document.getElementById("seleccionarfilah").style.display = 'none';
		document.getElementById("seleccionarcolumnah").style.display = 'none';
		document.getElementById("colflexSwitchCheckRegion").style.display = 'none';
		document.getElementById("colfilavacia").style.display = 'block';
		var form = document.getElementById("seleccionarfila");
		var inputs = form.getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			inputs[i].checked = false;
			inputs[i].disabled = false;
		}
		document.getElementById("colflexSwitchCheckAmbito1").style.display = 'none';
		document.getElementById("colflexSwitchCheckGestion1").style.display = 'none';
		document.getElementById("colflexSwitchCheckRegion1").style.display = 'block';
		document.getElementById("colclovacia1").style.display = 'block';
		document.getElementById("colclovacia2").style.display = 'block';
		document.getElementById("colclovacia3").style.display = 'none';
		var form = document.getElementById("seleccionarcolumna");
		var inputs = form.getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			inputs[i].checked = false;
			inputs[i].disabled = false;   
		}
	}
})
var flexSwitchCheckUnidades = document.getElementById("flexSwitchCheckUnidades")
flexSwitchCheckUnidades.addEventListener("change", function() {
	var form = document.getElementById("seleccionardato");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckUnidades.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckUnidades){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
		document.getElementById("seleccionarfilah").style.display = 'block';
		document.getElementById("seleccionarcolumnah").style.display = 'block';
		document.getElementById("colflexSwitchCheckNivel").style.display = 'block';
		document.getElementById("colfilavacia").style.display = 'none';
		document.getElementById("colflexSwitchCheckAmbito1").style.display = 'block';
		document.getElementById("colflexSwitchCheckGestion1").style.display = 'block';
		document.getElementById("colflexSwitchCheckRegion1").style.display = 'block';
		document.getElementById("colclovacia1").style.display = 'none';
		document.getElementById("colclovacia2").style.display = 'none';
		document.getElementById("colclovacia3").style.display = 'none';
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
		document.getElementById("seleccionarfilah").style.display = 'none';
		document.getElementById("seleccionarcolumnah").style.display = 'none';
		document.getElementById("colflexSwitchCheckNivel").style.display = 'none';
		document.getElementById("colfilavacia").style.display = 'block';
		var form = document.getElementById("seleccionarfila");
		var inputs = form.getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			inputs[i].checked = false;
			inputs[i].disabled = false;
		}
		document.getElementById("colflexSwitchCheckAmbito1").style.display = 'none';
		document.getElementById("colflexSwitchCheckGestion1").style.display = 'none';
		document.getElementById("colflexSwitchCheckRegion1").style.display = 'none';
		document.getElementById("colclovacia1").style.display = 'block';
		document.getElementById("colclovacia2").style.display = 'block';
		document.getElementById("colclovacia3").style.display = 'block';
		var form = document.getElementById("seleccionarcolumna");
		var inputs = form.getElementsByTagName('input');
		for (var i = 0; i<inputs.length; i++) {
			inputs[i].checked = false;
			inputs[i].disabled = false;   
		}
	}
})


var flexSwitchCheckNivel = document.getElementById("flexSwitchCheckNivel")
flexSwitchCheckNivel.addEventListener("change", function() {
	var form = document.getElementById("seleccionarfila");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckNivel.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckNivel){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
	}
})

var flexSwitchCheckRegion = document.getElementById("flexSwitchCheckRegion")
flexSwitchCheckRegion.addEventListener("change", function() {
	var form = document.getElementById("seleccionarfila");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckRegion.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckRegion){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
	}
})

var flexSwitchCheckAmbito1 = document.getElementById("flexSwitchCheckAmbito1")
flexSwitchCheckAmbito1.addEventListener("change", function() {
	var form = document.getElementById("seleccionarcolumna");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckAmbito1.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckAmbito1){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
	}
})

var flexSwitchCheckGestion1 = document.getElementById("flexSwitchCheckGestion1")
flexSwitchCheckGestion1.addEventListener("change", function() {
	var form = document.getElementById("seleccionarcolumna");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckGestion1.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckGestion1){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
	}
})

var flexSwitchCheckRegion1 = document.getElementById("flexSwitchCheckRegion1")
flexSwitchCheckRegion1.addEventListener("change", function() {
	var form = document.getElementById("seleccionarcolumna");
	var inputs = form.getElementsByTagName('input');
	if(flexSwitchCheckRegion1.checked == true){	
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i] != flexSwitchCheckRegion1){
				inputs[i].checked = false;
				inputs[i].disabled = true;
			}
		}	
	} else {
		for (var i = 0; i<inputs.length; i++) {
			if(inputs[i].disabled = true){
				inputs[i].checked = false;
				inputs[i].disabled = false; 
			}
		}
	}
})


// Filtro Informacion 


var formfiltroInformacion = document.getElementById("formfiltroInformacion");
formfiltroInformacion.addEventListener("submit", function(e) {
	e.preventDefault();
	const datos = new URLSearchParams();
	var nombrecolumnasE = "";
	var nombrefilasE = ""; 
	var nombrecantidadE = "";
	var formDato = document.getElementById("seleccionardato");
	var inputsDato = formDato.getElementsByTagName('input');
	for (var i = 0; i<inputsDato.length; i++) {
		if(inputsDato[i].checked == true){
			datos.append("dato",document.getElementById(inputsDato[i].id).labels[0].innerHTML);
			nombrecantidadE = document.getElementById(inputsDato[i].id).labels[0].innerHTML;
		}      
	}


	var formFila = document.getElementById("seleccionarfila");
	var inputsFila = formFila.getElementsByTagName('input');
	for (var i = 0; i<inputsFila.length; i++) {
		if(inputsFila[i].checked == true){
			var nf = document.getElementById(inputsFila[i].id).labels[0].innerHTML;
			if(nf=="Orientación técnica"){
				nf="Orientación_técnica";
			}
			if(nf=="Gestión"){
				nf="Gestion";
			}
			datos.append("fila", nf);
			nombrefilasE = document.getElementById(inputsFila[i].id).labels[0].innerHTML;
		}
	}

	var formColumna = document.getElementById("seleccionarcolumna");
	var inputsColumna = formColumna.getElementsByTagName('input');
	for (var i = 0; i<inputsColumna.length; i++) {
		if(inputsColumna[i].checked == true){
			if(nombrefilasE == ""){
				var nc = document.getElementById(inputsColumna[i].id).labels[0].innerHTML;
				if(nc=="Orientación técnica"){
					nc="Orientación_técnica";
				}
				if(nc=="Gestión"){
					nc="Gestion";
				}
				datos.append("fila", nc);
				nombrefilasE = document.getElementById(inputsColumna[i].id).labels[0].innerHTML;
			} else {
				var nc = document.getElementById(inputsColumna[i].id).labels[0].innerHTML;
				if(nc=="Orientación técnica"){
					nc="Orientación_técnica";
				}
				if(nc=="Gestión"){
					nc="Gestion";
				}
				datos.append("columna", nc);
				nombrecolumnasE = document.getElementById(inputsColumna[i].id).labels[0].innerHTML;	
			}
		}   
	}

	var titulo = "";

	if(nombrecolumnasE == ""){
		titulo =  nombrecantidadE + ' por ' + nombrefilasE;
	} else {
		titulo =  nombrecantidadE + ' por ' + nombrefilasE + ' y ' + nombrecolumnasE;
	}

	var tituloinfofiltro = document.getElementById("tituloinfofiltro");
	tituloinfofiltro.innerHTML = titulo;
	tablatr1.innerHTML ='';
	tablatr2.innerHTML ='';
	tablatr3.innerHTML ='';
	var infoestablecimientosxfiltronoselect = document.getElementById("infoestablecimientosxfiltronoselect");
	infoestablecimientosxfiltronoselect.style.display = 'none';
	var infoestablecimientosxfiltronoconn = document.getElementById("infoestablecimientosxfiltronoconn");
	infoestablecimientosxfiltronoconn.style.display = 'none';
	var phpfile = "";
	
	if(nombrecantidadE == "Establecimientos"){
		if(nombrecolumnasE == ""){
			phpfile = 'php/solicitarestablecimientosxfiltroUnaOpcion.php';
		} else {
			phpfile = 'php/solicitarestablecimientosxfiltro.php';
		}
	}

	if(nombrecantidadE == "Matrícula"){
		if(nombrecolumnasE == ""){
			phpfile = 'php/solicitarmatriculaxfiltroUnaOpcion.php';
		} else {
			phpfile = 'php/solicitarmatriculaxfiltro.php';
		}
	}

	if(nombrecantidadE == "Unidades"){
		if(nombrecolumnasE == ""){
			phpfile = 'php/solicitarunidadesxfiltroUnaOpcion.php';
		} else {
			phpfile = 'php/solicitarunidadesxfiltro.php';
		}
	}

	if(nombrefilasE != "" && nombrecantidadE != ""){
		fetch(phpfile, {
			method: 'POST',
			body: datos 
			})
			.then(response => response.json())
			.then(data1 => {
			
				if (data1==="errornodatos"){
					console.log(" hay errornoconn");
					//infoOtrosNoResultFormControlSelect.style.display = 'block';
				} else {
//----------------					if (nombrecantidadE == "Establecimientos") {
						// nombres de columna
						var nombresColumna = [];
						for (const [clave, obj] of Object.entries(data1)) {
							//console.log(obj.total);
							//console.log(obj.fila);
							var nombre = obj.columna;
							var total = obj.total;
							if(nombre!= null && total>0){
								if (!nombresColumna.includes(nombre)) {
									nombresColumna.push(nombre);
								}	
							}
						}
						var lencolumnas = 0;
						var tablatr1 = document.getElementById("tablatr1");
						var tablatr2 = document.getElementById("tablatr2");
						if(nombrecolumnasE != ""){
							lencolumnas = nombresColumna.length;
							tablatr1.innerHTML = `<th class="border-top" scope="col"></th>
									<th class="bg-info-custom border-top border-end border-start" scope="col"></th>
									<th class="border-top border-start text-center text-uppercase" scope="col" colspan="${lencolumnas}">${nombrecolumnasE}</th>`;
							var subnombrecolumnasE = "";
							for (let i = 0; i < lencolumnas; i++) {
			    				subnombrecolumnasE += "<th class='bg-color-info-custom border-top border-start text-center text-uppercase' scope='col'>" + nombresColumna[i] + "</th>";
							}
							tablatr2.innerHTML = `<th class="text-uppercase" scope="col">${nombrefilasE}</th>
									<th class="bg-info-custom border-start text-center text-uppercase" scope="col">${nombrecantidadE}</th>${subnombrecolumnasE}`;
						} else {
							tablatr2.innerHTML = `<th class="text-uppercase" scope="col">${nombrefilasE}</th>
									<th class="bg-info-custom border-start text-center text-uppercase" scope="col">${nombrecantidadE}</th>`;
						}
						// nombres de fila
						var nombresFila = [];
						for (const [clave, obj] of Object.entries(data1)) {
							var nombre = obj.fila;
							var total = obj.total;
							if(nombre!= null && total>0){
								if (!nombresFila.includes(nombre)) {
									nombresFila.push(nombre);
								}	
							}
						}
						var lenfilas = 0;
						lenfilas = nombresFila.length;
						// armar filas
						var entre = "</td><td class='fw-bold border-top border-start text-center'>";
						var filas = "";
						// recorro filas
						valuessubtotalfila = [];
						if(nombrecolumnasE != ""){
							for (let i = 0; i < lenfilas; i++) {
								// cantidad total por fila
								filas += "<tr><th class='fw-normal border-top'>" + nombresFila[i] + "</th><td class='bg-info-custom fw-bold border-top border-start text-center'>";
								var subtotalfila = 0;
								for (const [clave, obj] of Object.entries(data1)) {
									var fila = obj.fila;
									var total = obj.total;
									if(nombresFila[i]== fila && total>0){
										subtotalfila += parseInt(total); 	
									}
								}
								filas += subtotalfila + entre;
								valuessubtotalfila.push(subtotalfila);
								// cantida por columna
								//recorro fila x columnas
								for (let j = 0; j < lencolumnas; j++){
									var subtotalfilaxcolumna = 0;
									for (const [clave, obj] of Object.entries(data1)) {
										var fila = obj.fila;
										var columna = obj.columna;
										var total = obj.total;
										if(nombresFila[i] == fila && nombresColumna[j] == columna && total>0){
											subtotalfilaxcolumna += parseInt(total);
										}
									}
									if (j == lencolumnas - 1){
										filas += subtotalfilaxcolumna; 
									} else {
										filas += subtotalfilaxcolumna + entre;	
									}

								}
							}
						} else {
							for (let i = 0; i < lenfilas; i++) {
								// cantidad total por fila
								filas += "<tr><th class='fw-normal border-top'>" + nombresFila[i] + "</th><td class='bg-info-custom fw-bold border-top border-start text-center'>";
								var subtotalfila = 0;
								for (const [clave, obj] of Object.entries(data1)) {
									var fila = obj.fila;
									var total = obj.total;
									if(nombresFila[i]== fila && total>0){
										subtotalfila += parseInt(total); 	
									}
								}
								filas += subtotalfila;
								valuessubtotalfila.push(subtotalfila);
							}	
						}
						filas += "</td></tr>";
						// agrego fila  de subtotal
						var entre2 ="</td><td class='bg-primary-custom text-white text-center'>";
						filas +=  "<tr><th class='bg-primary-custom text-white fw-bold'>TOTAL CHUBUT</th><td class='bg-dark-custom text-white fw-bold text-center'>"
						var totaldetotales = 0;

						if(nombrecolumnasE != ""){
							for (const [clave, obj] of Object.entries(data1)) {
								var fila = obj.fila;
								var columna = obj.columna;
								var total = obj.total;
								if(total>0 && columna != null && fila != null){
									totaldetotales += parseInt(total);
								}
							}
							filas += totaldetotales + entre2;
							valuessubtotalcolumna = [];
							
							for (let k = 0; k < lencolumnas; k++){
								var subtotalcolumna = 0;
								for (const [clave, obj] of Object.entries(data1)) {
									var fila = obj.fila;
									var columna = obj.columna;
									var total = obj.total;
									if(fila != null && nombresColumna[k] == columna && total>0){
										subtotalcolumna += parseInt(total);
									}
								}
								if (k == lencolumnas - 1){
									filas += subtotalcolumna;
								} else {
									filas += subtotalcolumna + entre2;	
								}
								valuessubtotalcolumna.push(subtotalcolumna);
							}
						} else {
							for (const [clave, obj] of Object.entries(data1)) {
								var fila = obj.fila;
								var total = obj.total;
								if(total>0 && fila != null){
									totaldetotales += parseInt(total);
								}
							}
							filas += totaldetotales;
							valuessubtotalcolumna = [];
						}
						filas += "</td></tr>";
						var tablatr3 = document.getElementById("tablatr3");
						tablatr3.innerHTML = `${filas}`;

						resetFormFiltro();
						var myModalEl = document.getElementById('filtroInformacion');
						var modal = bootstrap.Modal.getInstance(myModalEl);
						modal.hide();
						var mapa = document.getElementById("map");
						mapa.style.display = "none";
						var establecimientosinfofiltro = document.getElementById("establecimientosinfofiltro");
						establecimientosinfofiltro.style.display = 'block';


						// graficos
						var graficoporfila = document.getElementById("graficoporfila");
						var graficoporcolumna = document.getElementById("graficoporcolumna");
						if(lenfilas>1){
							var datafila = [{
								values: valuessubtotalfila,
								labels: nombresFila,
								name: nombrefilasE,
								hoverinfo: false,
								hole: .5,
								type: 'pie'
							}];
							var layout = {
								title: nombrecantidadE + ' por ' + nombrefilasE,
						        font: {
							      family: 'sans-serif',
							      size: 10
							    },
								showlegend: true,
								legend: {
							        xanchor : "center",
	                     			x : 1,
	                     			yanchor : "top",
	                     			y: 0.5,
							        font: {
								      family: 'sans-serif',
								      size: 10
								    },
								},
							};
							Plotly.newPlot(graficoporfila, datafila, layout, {responsive: true, displaylogo: false});	
						}
						if(lencolumnas>1){
							var datacolumna = [{
								values: valuessubtotalcolumna,
								labels: nombresColumna,
								name: nombrecolumnasE,
								hoverinfo: false,
								hole: .5,
								type: 'pie'
							}];
							var layout = {
								title: nombrecantidadE + ' por ' + nombrecolumnasE,
						        font: {
							      family: 'sans-serif',
							      size: 10
							    },
								showlegend: true,
								legend: {
							        xanchor : "center",
	                     			x : 1,
	                     			yanchor : "top",
	                     			y: 0.5,
							        font: {
								      family: 'sans-serif',
								      size: 10
								    },
								},
							};
							Plotly.newPlot(graficoporcolumna, datacolumna, layout, {responsive: true, displaylogo: false});
					}
				}
			})
			.catch(err => {
          		infoestablecimientosxfiltronoconn.style.display = 'block';
        	}
        );	
	} else {
		infoestablecimientosxfiltronoselect.style.display = 'block';
	}
})

function nomostrarestablecimientosinfofiltro(){
	document.getElementById("map").style.display = "block";
	document.getElementById("establecimientosinfofiltro").style.display = 'none';
}
