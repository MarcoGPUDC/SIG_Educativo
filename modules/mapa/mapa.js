// mapa interactivo ------------------------------------------------------------------------------

//espera 3 segundos antes de mostrar la pantalla

function hideLoadingScreen() {
	document.getElementById('loading-screen').style.display = 'none';
}
setTimeout(hideLoadingScreen,2500);

//setea el mapa

var mymap = new L.map('map', {
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft',
		forceSeparateButton: true
	}
}); 


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
        fillOpacity: 0.3
    });
    infoD.update(layer.feature.properties);
}

// Variable de departamento

var capaDepartamentos;

// Configurar los cambios de resaltar y de zoom de la capa

function resetHighlightD(e){
    capaDepartamentos.resetStyle(e.target);
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


 
  



// Agregar nombre region
var posRegiones = [
	[-42.263364, -70.828274],
	[-42.340042, -65.70081],
	[-43.678353, -70.742548],
	[-43.533583, -67.91289],
	[-45.32692, -70.31852],
	[-45.339412, -67.964911]
]
var textLatLngR1 = [-42.263364, -70.828274];  
var textLabelR1 = L.marker(posRegiones[0], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>I</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
baselayer.addLayer(textLabelR1);
var textLatLngR2 = [-42.340042, -65.70081];  
var textLabelR2 = L.marker(posRegiones[1], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>II</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
baselayer.addLayer(textLabelR2);
var textLatLngR3 = [-43.678353, -70.742548];  
var textLabelR3 = L.marker(posRegiones[2], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>III</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
baselayer.addLayer(textLabelR3);
var textLatLngR4 = [-43.533583, -67.91289];  
var textLabelR4 = L.marker(posRegiones[3], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>IV</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
baselayer.addLayer(textLabelR4);
var textLatLngR5 = [-45.32692, -70.31852];  
var textLabelR5 = L.marker(posRegiones[4], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>V</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
baselayer.addLayer(textLabelR5);
var textLatLngR6 = [-45.339412, -67.964911];  
var textLabelR6 = L.marker(posRegiones[5], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>VI</div>'
    }),
    zIndexOffset: -1,
	interactive: false
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
                            	"<table><tr><td><b>Región:</b> " + props.numreg + " (" + props.nombrereg + ")"+ 
                            	"</td></tr><tr><td><b>Total Localizaciones:</b> "+ (props.totallocal?props.totallocal:"Sin Localizaciones") +
                            	"</td></tr><tr><td><b>Educación Inicial:</b> "+ (props.inicial?props.inicial:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Primaria:</b> "+ (props.primario?props.primario:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Secundaria:</b> "+ (props.secundario?props.secundario:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Superior:</b> "+ (props.superior?props.superior:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Formación Profesional:</b> "+ (props.formacion?props.formacion:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Domiciliaria y Hospitalaria:</b> "+(props.domhosp?props.domhosp:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Especial:</b> "+ (props.especial?props.especial:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Artística:</b> "+ (props.artistica?props.artistica:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>EPJA:</b> "+ (props.epja?props.epja:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Otros Servicios Educativos:</b> "+ (props.oserveduc?props.oserveduc:"Sin Localizaciones")+
								"</td></tr><tr><td><b>Edificios:</b> "+ (props.edificios?props.edificios:"Sin Localizaciones")+
								"</td></tr><tr><td><b>Sedes:</b> "+ (props.sedes?props.sedes:"Sin Localizaciones")+
								"</td></tr><tr><td><b>Anexos:</b> "+ (props.anexos?props.anexos:"Sin Localizaciones")+
                            	//"</td></tr><tr><td><b>Población:</b> "+ (props.poblacion?props.poblacion:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Superficie:</b> "+ (props.superficie?props.superficie:"Sin Localizaciones")+
                            	"</td></tr></table>"
                            : "<br>Haga click en una región");
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
        fillOpacity: 0.3
    });
}

function highlightContent(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
}

// Variable de region
var capaRegiones;

// Configurar los cambios de resaltar y de zoom de la capa

function resetHighlight(e){
    capaRegiones.resetStyle(e.target);
    info.update();
}
function zoomToFeature(e){
    mymap.fitBounds(e.target.getBounds());
}
function onEachFeature(feature, layer){
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: highlightContent
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
			if (feature.properties.numreg == 'I' || feature.properties.numreg == 'III' || feature.properties.numreg == 'VI') {
				return{fillColor: colorRegion(feature.properties.numreg), 
				color: colorRegion(feature.properties.numreg), 
				opacity :  0.2,
				fillOpacity: 0.3,}
			} else {
				return {fillColor: colorRegion(feature.properties.numreg), 
				color: colorRegion(feature.properties.numreg), 
				opacity :  0.2,
				fillOpacity: 0.2,}
			}
			
	};

async function getGeoserverLayer(workspace, layer) {
	const viewLayer = L.tileLayer.wms("http://localhost:3005/geoserver/ows", {
		layers: `${workspace}:${layer}`,
		format: 'image/png',
		transparent: true,	
		version: '1.1.1',
		styles: layer,
		attribution: "SIG Educativo"
	})
	let tipo = layer.split("_")[0];
	let nivel = layer.split("_")[1];
	let dataLayer;
	try {
		const geoResponse = await fetch(`http://localhost:3005/geoserver/sigeducativo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}%3A${layer}&maxFeatures=300&outputFormat=application%2Fjson&srsname=EPSG:4326`);
		const dataGeoJSON = await geoResponse.json();
		switch (tipo) {
			case "regiones":
				viewLayer.addTo(mymap);
				dataLayer = L.geoJSON(dataGeoJSON, {
					onEachFeature: function (feature, layer) {
						// Configurar eventos de interacción con cada feature
						layer.on({mouseover: highlightFeature});
			
						// Resetear el estilo cuando el mouse sale de la feature
						layer.on('mouseout', function (e) {
							dataLayer.resetStyle(e.target);
							info.update();
						});
					
					},
					style: function() {
						return { color: 'transparent' }; // Hacer la capa invisible
					}
				}).addTo(mymap);
				break;
			default:
					(tipo)?tipo = 'establecimientos': tipo == tipo;
					dataLayer = createLayer(dataGeoJSON, tipo, (nivel)?nivel:'')
					dataLayer.addTo(mymap);
				break;
		}

	} catch (error) {
		console.error("Error al cargar la capa: ", error);
        return;
	}
	return dataLayer;
}


// Agregar regiones a mapa

/*node async function getRegiones() {
	const viewRegionLayer = L.tileLayer.wms("/geoserver/sigeducativo/ows", {
		layers: 'sigeducativo:regiones_educativas',
		format: 'image/png',
		transparent: true,
		version: '1.1.1',
		styles: 'regiones_educativas',
		attribution: "SIG Educativo"
	})
	let dataRegionLayer;
    try {
        const response = await fetch('/geoserver/sigeducativo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sigeducativo%3Aregiones_educativas&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:4326');
        const regiones = await response.json();
        // Crear la capa GeoJSON con los datos recibidos
        dataRegionLayer = L.geoJSON(regiones, {
            onEachFeature: function (feature, layer) {
				// Configurar eventos de interacción con cada feature
				layer.on({mouseover: highlightFeature});
	
				// Resetear el estilo cuando el mouse sale de la feature
				layer.on('mouseout', function (e) {
					dataRegionLayer.resetStyle(e.target);
					info.update();
				});
			
			},
			style: function() {
				return { color: 'transparent' }; // Hacer la capa invisible
			}
		})
    } catch (error) {
        console.error("Error al cargar la capa WFS: ", error);
        return;
    }
	var combinedLayer = L.layerGroup([viewRegionLayer, dataRegionLayer]);
	combinedLayer.addTo(mymap);
	return combinedLayer
}*/

async function getRegiones() {
	return fetch('mapa/regiones')
	.then(response => response.json())
	.then(regiones => {
		const capaRegiones = L.geoJSON(regiones, {
			style: estilo_region,
			onEachFeature: onEachFeature
		}).addTo(mymap);
		return capaRegiones
	})
}

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

// Layer bibliotecas pedagogicas

function popup_bib_pedagogicas (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Biblioteca Pedagógica "+ (feature.properties.nombrebibl?feature.properties.nombrebibl:"") +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.numreg?feature.properties.numreg:"No se registra") +
		"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") +
		"</td></tr><tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") +
		"</td></tr><tr><td><b>Cod. Postal:</b> "+ (feature.properties.codpostal?feature.properties.codpostal:"No se registra") +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"</td></tr><tr><td><b>Horario:</b> "+ (feature.properties.horario?feature.properties.horario:"No se registra") +
		"</td></tr></table></div>",
		{minWidth: 270, maxWidth: 270}
	);
	layer.on({
        popupopen : closepoputNL,
    });
};
// Agregar establecimientos educativos a mapa 

function formatoNombre(cadena) {
	if (cadena) {
		let splitCad = cadena.split(" ");
		let minusCad = splitCad.map(palabra => {
			return palabra.toLowerCase();
		})
		let mayusCad = minusCad.map(palabra => {
		return palabra[0].toUpperCase() + palabra.slice(1);
		})
		return mayusCad.join(" ");
	} else {
		return false
	}
		
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

//ventana informativa pequeña
function onEachFeatureL(feature, layer){
	layer.bindPopup(
		"<div class='p-3'>"+
  		"<h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") + "</h6>" +
	 	"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>CUE - Anexo:</b> "+ (feature.properties.cue_anexo?feature.properties.cue_anexo:"No se registra") + "</td></tr>"+
		"<tr><td><b>Número:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") + "</td></tr>" + 
		"<tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") + "</td></tr>" +
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?formatoNombre(feature.properties.localidad):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.domicilio?feature.properties.domicilio:"No se registra") + "</td></tr>" +
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
  		"</div></div>" + (feature.properties.area?"<div id='divBotonArea'></td></tr><tr><td><label for='areaInstMarker'>Mostrar Area</label><input type='checkbox' id='areaInstMarker' value='"+feature.properties.id+"'></input></div>":"</div>") +
  		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='/sigeducativo/info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
  		"</div>"
  		, {minWidth: 270, maxWidth: 270}
	);
}
function onEachFeatureEst(feature, layer){
	layer.bindPopup(
		"<div class='p-3'>"+
  		"<h6 style='color:#0d6efd'>"+ (feature.properties.fna?feature.properties.fna:"No se registra") + "</h6>" +
	 	"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>CUE - Anexo:</b> "+ (feature.properties.cueanexo?feature.properties.cueanexo:"No se registra") + "</td></tr>"+
		"<tr><td><b>Número:</b> "+ (feature.properties.codjurid?feature.properties.codjurid:"No se registra") + "</td></tr>" + 
		"<tr><td><b>Región:</b> "+ (feature.properties.región?feature.properties.región:"No se registra") + "</td></tr>" +
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?formatoNombre(feature.properties.localidad):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.calle?feature.properties.calle + " " + feature.properties.num_calle:"No se registra") + "</td></tr>" +
		"<tr><td><b>Nivel:</b> "+ (feature.properties.nivel?feature.properties.nivel:"No se registra") + "</td></tr>" +
		"</table>" +
		"<h6 class='mt-3'> Información de Contacto</h6>" + 
		"<table>" +
		"<tr><td><b>Teléfono:</b> "+ (feature.properties.telefono?feature.properties.telefono:"") + "</td></tr>" +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"<tr><td><b>Sitio Web:</b>" + "<a " + (feature.properties.sitioweb && feature.properties.sitioweb != 'Sin información'?"href='"+feature.properties.sitioweb:"") + " ' target='_blank' rel='noopener noreferrer'> "  + (feature.properties.sitioweb?feature.properties.sitioweb:"No se registra") + "</a>"+ "</td></tr>" +
		"<tr><td><b>Responsable:</b> "+ (feature.properties.responsabl?feature.properties.responsabl:"") + "</td></tr>" +
		"<tr><td><b>Tel. del Responsable:</b> "+ (feature.properties.resp_tel?feature.properties.resp_tel:"-") + "</td></tr>" +
		"</table>" +
  		"</div></div>" +
  		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='/sigeducativo/info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
  		"</div>"
  		, {minWidth: 270, maxWidth: 270}
	);
}

function onEachFeatureS (feature, layer) {
	layer.bindPopup(	
		"<div class='p-3'>"+
		"<h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") + "</h6>" +
		"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>Número:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") + "</td></tr>" +
		"<tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") + "</td></tr>" +
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?formatoNombre(feature.properties.localidad):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") + "</td></tr>" +
		"</table>" +
		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='/sigeducativo/info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
		"</div>", {minWidth: 270, maxWidth: 270}
		);
	}

	function onEachFeatureO (feature, layer) {
		layer.bindPopup(	
			"<div class='p-3'>"+
			"<h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") + "</h6>" +
			"<h6> Información General</h6>" + 
			 "<table>"+
			"<tr><td><b>Número:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") + "</td></tr>" +
			"<tr><td><b>Nivel:</b> "+ (feature.properties.nivel?feature.properties.nivel:"No se registra") + "</td></tr>" +
			"<tr><td><b>Modalidad:</b> "+ (feature.properties.modalidad?feature.properties.modalidad:"No se registra") + "</td></tr>" +
			"</table>" +
			"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='/sigeducativo/info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
			"</div>", {minWidth: 270, maxWidth: 270}
			);
		}

function showZoom(){
	var zoom = mymap.getZoom();
	console.log(zoom);
	return zoom;
}

//Mover marcador
function moverMarcador(marcador) {
	var latlngOriginal = marcador.getLatLng();
	var latoriginal = latlngOriginal.lat;
	var lngoriginal = latlngOriginal.lng;
	var zoomLevel = mymap.getZoom();
	if (zoomLevel == 7){
		marcador.setLatLng([latoriginal, lngoriginal - 0.25]);
	} else if (zoomLevel == 8){
		marcador.setLatLng([latoriginal, lngoriginal - 0.13]);
	} else if (zoomLevel == 9){
		marcador.setLatLng([latoriginal, lngoriginal - 0.07]);
	} else if (zoomLevel == 10){
		marcador.setLatLng([latoriginal, lngoriginal - 0.032]);
	} else if (zoomLevel == 11){
		marcador.setLatLng([latoriginal, lngoriginal - 0.016]);
	} else if (zoomLevel == 12){
		marcador.setLatLng([latoriginal, lngoriginal - 0.008]);
	} else if (zoomLevel == 13){
		marcador.setLatLng([latoriginal, lngoriginal - 0.0040]);
	} else if (zoomLevel == 14){
		marcador.setLatLng([latoriginal, lngoriginal - 0.0021]);
	} else if (zoomLevel == 15){
		marcador.setLatLng([latoriginal, lngoriginal - 0.0010]);
	} else if (zoomLevel == 16){
		marcador.setLatLng([latoriginal, lngoriginal - 0.00051]);
	} else if (zoomLevel == 17){
		marcador.setLatLng([latoriginal, lngoriginal - 0.00028]);
	} else if (zoomLevel == 18){
		marcador.setLatLng([latoriginal, lngoriginal - 0.00013]);
	} else if (zoomLevel == 19){
		marcador.setLatLng([latoriginal, lngoriginal - 0.000074]);
	} else if (zoomLevel == 20){
		marcador.setLatLng([latoriginal, lngoriginal - 0.000034]);
	}
	
}

	
//crear cluster de markers, es decir que los iconos del layer se agrupan o desagrupan segun se haga zoom out o zoom in
var clusterLayers = {};
function createCluster(tipo, nivel) {
	var cluster = L.markerClusterGroup({
		showCoverageOnHover: false, // Desactiva la visualización del radio en el hover
		disableClusteringAtZoom: 13, // Desactiva la agrupación a partir de cierto nivel de zoom
		spiderfyOnMaxZoom: false, // No agrupa los marcadores al hacer zoom máximo
		maxClusterRadius: 30, // Establece el radio máximo de agrupación
		iconCreateFunction: function(cluster) {
			return L.divIcon({ 
				html: `<img src="./icons/${tipo}_${nivel}.svg">`, // Utiliza un ícono personalizado
				className: `marker-icons`, // Clase CSS para el ícono
				iconSize: L.point(3, 3) // Tamaño del ícono
			});
		}
	});
	clusterLayers[`${tipo}_${nivel}`] = cluster;
	return cluster;
}
var globalMarkers = [];
var areasControl;
getAreasEscolares();
//crear capa, se crea a partir de un geoJSON, se indica tipo de dependencia (institucion, supervision, delegacion) y nivel para obtener el icono correspondiente
function createLayer(data, tipo, nivel) {
	var cluster = createCluster(tipo, nivel);
	var layer = L.geoJSON(data, {
		pointToLayer: function (feature, latlng) {
			var moved = false;
			var marker = L.marker(latlng, {
				icon: L.icon({
					iconUrl: `icons/${tipo}_${nivel}.svg`,
					iconSize: [22, 22],
					iconAnchor: [11, 0],
					popupAnchor: [0, 0]
				}),
				riseOnHover: true,	
			});
			marker.on('mouseover', function(){
				var latlng = marker.getLatLng();
				globalMarkers.forEach(referencia => {
					if (latlng.lat === referencia.getLatLng().lat && latlng.lng === referencia.getLatLng().lng && marker._leaflet_id !== referencia._leaflet_id && marker.feature.properties.nivel !== referencia.feature.properties.nivel){
						moverMarcador(marker);
						moved = true;
					}
				})
			})
			marker.on('mouseout', function(){
				if (moved){
					marker.setLatLng([latlng.lat, latlng.lng])
				}
					
			});
			marker.on('add', function(){
				globalMarkers.push(marker);
			})
			marker.on('remove', function(){
				globalMarkers = globalMarkers.filter(item => item._leaflet_id !== marker._leaflet_id)
			})
			marker.on('popupopen', function() {
				//actualiza las areas para verificar el estado de cada una
				getAreasLayer()
				//se pregunta si el checkbox actual tiene en su value el id de una institucion que coincida con el de algun area
				if (checkbox = document.getElementById("areaInstMarker")){
					areasControl.forEach(data => {
						//pregunta si esta en el mapa y coloca el input en el estado correcto
						if (data.id_institucion == checkbox.value){
							if (data.mostrar){
								checkbox.checked = true;
							}
						}
					})
				}
			});
			cluster.addLayer(marker);
			return marker;
		},
		onEachFeature: (tipo === 'supervision') ? popup_supervision : (tipo === 'delegacion') ? popup_del_admnistrativas : (tipo === 'biblioteca') ? popup_bib_pedagogicas : (tipo === 'establec') ? onEachFeatureEst : onEachFeatureL
		});
	return cluster;
}

function parseWKT(wkt) {
	var coords = wkt
		.replace('MULTIPOLYGON(((','')
		.replace(')))','')
		return coords.split(')),((').map(polygon => {
			return polygon.split(',').map(coord => {
				var [lng,lat] = coord.trim().split(/\s+/).map(Number)
				if (isNaN(lng) || isNaN(lat)) {
					throw new Error("error al convertir coordenadas")
				}
				return [lat,lng]
			})
		})
}


function getDepartamentos() {
	return fetch('mapa/departamentos')
	.then(response => response.json())
	.then(departamentos => {
		capaDepartamentos = L.geoJSON(departamentos, {
			style: estilo_departamentos,
			onEachFeature: onEachFeatureD
		})
		return capaDepartamentos
	})
	}

// Función para obtener las capas por nivel y modalidad
function getEstablecimientosLayers() {
    return fetch('mapa/setInstMarkers')
        .then(response => response.json())
        .then(data => {
			var filter = true;
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
			var dataEPJA = [];
			var dataContexto = [];
			var dataRural = [];
			var dataEIB = [];
			data.features.forEach(escuelas => {
				
				
				switch (true) {
					//numeracion inicial 400 a 499 / 4000 a 4999 / 1400 a 1499 / 2400 a 2499
					//case ((escuelas.properties.numero >= 400 && escuelas.properties.numero <= 499) || (escuelas.properties.numero >= 4000 && escuelas.properties.numero <= 4999) || (escuelas.properties.numero >= 1400 && escuelas.properties.numero <= 1499) || (escuelas.properties.numero >= 2400 && escuelas.properties.numero <= 2499)):
					case (escuelas.properties.nivel == 'Inicial' && escuelas.properties.funcion == 'Activo'):
						dataInicial.push(escuelas);
						break;
					//numeracion primaria 0 a 299 / 1000 a 1299 / 2000 a 2099
					//case ((escuelas.properties.numero >= 0 && escuelas.properties.numero <= 299) || (escuelas.properties.numero >= 1000 && escuelas.properties.numero <= 1299) || (escuelas.properties.numero >= 2000 && escuelas.properties.numero <= 2099)):
					case (escuelas.properties.nivel == 'Primario' && escuelas.properties.funcion == 'Activo'):
						dataPrimaria.push(escuelas)
						break;
					//numeracion secundaria 700 a 799 / 7000 a 7999 / 1700 a 1799 / 2700 a 2799
					//case ((escuelas.properties.numero >= 700 && escuelas.properties.numero <= 799) || (escuelas.properties.numero >= 7000 && escuelas.properties.numero <= 7999) || (escuelas.properties.numero >= 1700 && escuelas.properties.numero <= 1799) || (escuelas.properties.numero >= 2700 && escuelas.properties.numero <= 2799)):
					case (escuelas.properties.nivel == 'Secundario' && escuelas.properties.funcion == 'Activo'):
						dataSecundaria.push(escuelas)
						break;
					//numeracion Adultos - formacion profesional 600 a 699 / 1600 a 1699
					//case ((escuelas.properties.numero >= 600 && escuelas.properties.numero <= 699) || (escuelas.properties.numero >= 1600 && escuelas.properties.numero <= 1699)):
					case (escuelas.properties.nivel == 'Superior' && escuelas.properties.funcion == 'Activo'):
						dataSNU.push(escuelas);
						break;
					default:
						filter = false;
					}
				switch (true) {
					//numeracion Adultos - formacion profesional 600 a 699 / 1600 a 1699
					//case ((escuelas.properties.numero >= 600 && escuelas.properties.numero <= 699) || (escuelas.properties.numero >= 1600 && escuelas.properties.numero <= 1699)):
					case (escuelas.properties.modalidad == 'ETP' && escuelas.properties.funcion == 'Activo'):
						dataFormProf.push(escuelas);
						break;
					//numeracion especial 500 a 599 / 1500 a 1500
					case (escuelas.properties.modalidad == 'Especial' && escuelas.properties.funcion == 'Activo'):
						dataEspecial.push(escuelas);
						break;
					//numeracion domiciliaria/hospitalaria 300 a 399
					case (escuelas.properties.modalidad == 'Domiciliaria/hospitalaria' && escuelas.properties.funcion == 'Activo'):
						dataDomHosp.push(escuelas);
						break;
					case (escuelas.properties.modalidad == 'Artistica' && escuelas.properties.funcion == 'Activo'):
						dataArtistica.push(escuelas);
						break;
					case (escuelas.properties.modalidad == 'EPJA' && escuelas.properties.funcion == 'Activo'):
						dataEPJA.push(escuelas);
						break;
					case (escuelas.properties.modalidad == 'Contexto de encierro' && escuelas.properties.funcion == 'Activo'):
						dataContexto.push(escuelas);
						break;
					case (escuelas.properties.modalidad == 'Rural' && escuelas.properties.funcion == 'Activo'):
						dataRural.push(escuelas);
						break;
					case (escuelas.properties.modalidad == 'EIB' && escuelas.properties.funcion == 'Activo'):
						dataEIB.push(escuelas);
						break;
					//lo que no cae en lo anterior cae en otros servicios educativos
					case (escuelas.properties.modalidad == 'Otros servicios educativos' && escuelas.properties.funcion == 'Activo'):
						dataOtrosServ.push(escuelas);
						break;
					default:
						if (!filter) {
							console.log('No se clasifico la escuela N° ' + escuelas.properties.numero);
							console.log('Modalidad: '+ escuelas.properties.modalidad);
							console.log('Nivel: '+ escuelas.properties.nivel);
						}
					}
				filter = true;
			})
					
            // Crea la capa GeoJSON y añádela al cluster
			var inicialLayer = createLayer(dataInicial,'establecimientos', 'inicial');
			var primariaLayer = createLayer(dataPrimaria,'establecimientos', 'primaria');
			var secundariaLayer = createLayer(dataSecundaria,'establecimientos', 'sec');
			var especialLayer = createLayer(dataEspecial,'establecimientos', 'especial');
			var SNULayer = createLayer(dataSNU,'establecimientos', 'superior');
			var domHospLayer = createLayer(dataDomHosp,'establecimientos', 'dom_hosp');
			var formProfLayer = createLayer(dataFormProf,'establecimientos', 'form_prof');
			var otrosServLayer = createLayer(dataOtrosServ,'establecimientos', 'comp');
			var artisticaLayer = createLayer(dataArtistica,'establecimientos', 'artistica')
			var epjaLayer = createLayer(dataEPJA,'establecimientos', 'epja')
			var contextoLayer = createLayer(dataContexto, 'establecimientos', 'contexto')
			var ruralLayer = createLayer(dataRural, 'establecimientos', 'rurales')
			var eibLayer = createLayer(dataEIB, 'establecimientos', 'eib')
			// agrega las capas a un array de capas para guardar las referencias
			todosLayers.push([[inicialLayer],[{label: 'Inicial', url: 'inicial', legend:'nivel'}]]);//0
			todosLayers.push([[primariaLayer],[{label: 'Primaria', url: 'primaria', legend:'nivel'}]]);//1
			todosLayers.push([[secundariaLayer],[{label: 'Secundaria', url: 'sec', legend:'nivel'}]]);//2
			todosLayers.push([[SNULayer],[{label: 'Superior No Universitario', url: 'superior', legend:'nivel'}]]);//3
			todosLayers.push([[especialLayer],[{label: 'Especial', url: 'especial', legend:'modalidad'}]]);//4
			todosLayers.push([[formProfLayer],[{label: 'ETP', url: 'form_prof', legend:'modalidad'}]]);//5
			todosLayers.push([[domHospLayer],[{label: 'Domiciliaria/Hospitalaria', url: 'dom_hosp', legend:'modalidad'}]]);//6	
			todosLayers.push([[artisticaLayer],[{label: 'Artística', url: 'artistica', legend:'modalidad'}]]);//7
			todosLayers.push([[epjaLayer],[{label: 'Escuela Permanente p/ Jóvenes y Adultos', url: 'epja', legend:'modalidad'}]]);//8
			todosLayers.push([[contextoLayer],[{label: 'Contexto de encierro', url: 'contexto', legend:'modalidad'}]]);//9
			todosLayers.push([[ruralLayer],[{label: 'Rural', url: 'rurales', legend:'modalidad'}]]);//10
			todosLayers.push([[eibLayer],[{label: 'EIB', url: 'eib', legend:'modalidad'}]]);//11
			todosLayers.push([[otrosServLayer],[{label: 'Otros Servicios Educativos', url: 'comp', legend:'modalidad'}]]);//12
            return todosLayers;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            return null;
        });
}
// genera las capas de las supervisiones
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
			/*todosLayers.forEach(layers => {
				mymap.addLayer(layers[0][0]);
			})*/
			return todosLayers
	})
	.catch(error => {
		console.error('Error fetching data:', error);
		return null;
	});
	return layersSuperv
}
//genera las caoas de las delegaciones
function getDelegacionLayers(){
	var layerDel = fetch ('mapa/setDelegMarkers')
	.then(response => response.json())
	.then( data => {
		var delegacionLayer = createLayer(data, 'delegacion' , '');
		return delegacionLayer
	})
	.catch(error => {
		console.error('Error fetching data:', error);
		return null;
	});
	return layerDel
}
//(`/geoserver/sigeducativo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sigeducativo%3Abibliotecas_pedagogicas&maxFeatures=50&outputFormat=application%2Fjson&srsname=EPSG:4326`)
function getBibliotecaLayer(){
	var biLayer = fetch ('mapa/setBiblioMarkers')
	.then (response => response.json())
	.then( data => {
		var bibliotecaLayer = createLayer(data, 'biblioteca','');
		return bibliotecaLayer
	})
	.catch(error => {
		console.error('Error fetching data:', error);
		return null;
	})
	return biLayer
}

function getAreasLayer() {
	var area;
	checks = document.querySelectorAll('#areaInstMarker');
	checks.forEach(checkbox => {
		areasControl.forEach(data => {
			if (data.id_institucion == checkbox.value){
				polygonData = data.area;
				checkbox.addEventListener('change', () => {
					if(checkbox.checked) {
						polygon = parseWKT(polygonData);
						area = L.polygon(polygon, {color:'red'}).addTo(mymap);
						data.mostrar = area._leaflet_id;
					} else {
						const layer = Object.values(mymap._layers).find(layer => layer._leaflet_id === data.mostrar)
						mymap.removeLayer(layer);
						areasControl.forEach(data => {
							if (data.id_institucion == checkbox.value){
								data.mostrar = false
							}
						})
		
					}
				})
			}
			})
	})
}

async function getAreasEscolares () {
	fetch('mapa/areasInst')
	.then(response => response.json())
	.then(areas => {
		areasControl = areas;
	})
}

//funcion que finalmente crea las capas y las agrega al mapa
async function generarTodosLayers(layerParam) {
    var layersConfig = [];
	const establecimientos = await getEstablecimientosLayers();
	const delegaciones = await getDelegacionLayers();
	const supervision = await getSupervisionLayers();
	const bibliotecas = await getBibliotecaLayer();
	capaRegiones = await getRegiones();
	capaDepartamentos = await getDepartamentos();
	var i = 0;
	if (layerParam != null) {
		establecimientos.forEach(establecimiento => {
			var inactivo = true;
			if (establecimiento[1][0].url == layerParam) {	
				inactivo = false
			}
			var layer = establecimiento[0][0];
			layersConfig.push({
				label: `${establecimiento[1][0].label}`,
				type: "image",
				url: `icons/establecimientos_${establecimiento[1][0].url}.svg`,
				layers_type: establecimiento[1][0].legend,
				layers: layer,
				inactive: inactivo,
			});
			(establecimiento[1][0].url == layerParam?layer.addTo(mymap):i+=1);
		});

		layersConfig.push({
			label: "Ministerio de Educación",
			type: "image",
			url: "icons/ministerio.svg",
			layers_type: "organizacion",
			layers: [min_educacion],
			inactive: true,
			})

		layersConfig.push({
			label: 'Delegaciones Administrativas',
			type: 'image',
			url: 'icons/delegacion_.svg',
			layers_type: "organizacion",
			layers: delegaciones,
			inactive: true
		})

		layersConfig.push({
			label: 'Bibliotecas Pedagógicas',
			type: 'image',
			url: 'icons/biblioteca_.svg',
			layers_type: "organizacion",
			layers: bibliotecas,
			inactive: true
		})

		layersConfig.push ({
			label: "Regiones Educativas",
			type: "polygon",
			sides: 4,
			color: "#FFFFFF",
			fillColor: "#FF0000",
			weight: 1,
			layers_type: "general",
			layers: [capaRegiones, textLabelR1, textLabelR2 ,textLabelR3, textLabelR4, textLabelR5, textLabelR6],
			inactive: true
			})

		layersConfig.push({
			label: "Departamentos",
			type: "polygon",
			sides: 4,
			color: "#FFF252",
			fillColor: "#FFF252",
			weight: 1,
			layers_type: "general",
			layers: [capaDepartamentos],
			inactive: true,
			})

		supervision.forEach(supervision => {
			var layer = supervision[0][0];
			layersConfig.push({
				label: `Supervisíon ${supervision[1][0].label}`,
				type: "image",
				url: `icons/supervision_${supervision[1][0].url}.svg`,
				layers_type: "organizacion",
				layers: layer,
				inactive: true,
			});
		});

		return layersConfig;

	} else {
			// Obtener establecimientos y crear configuraciones de capas
			establecimientos.forEach(establecimiento => {
				var layer = establecimiento[0][0];
				layersConfig.push({
					label: `${establecimiento[1][0].label}`,
					type: "image",
					url: `icons/establecimientos_${establecimiento[1][0].url}.svg`,
					layers_type: establecimiento[1][0].legend,
					layers: layer,
					inactive: true,
				});
					
			});

			min_educacion.addTo(mymap);
			layersConfig.push({
				label: "Ministerio de Educación",
				type: "image",
				url: "icons/ministerio.svg",
				layers_type: "organizacion",
				layers: [min_educacion],
				inactive: false,
				})

			delegaciones.addTo(mymap);
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
				layers: [capaRegiones, textLabelR1, textLabelR2 ,textLabelR3, textLabelR4, textLabelR5, textLabelR6],
				inactive: false,
				})

			layersConfig.push({
				label: 'Bibliotecas Pedagogicas',
				type: 'image',
				url: 'icons/biblioteca_.svg',
				layers_type: "organizacion",
				layers: bibliotecas,
				inactive: true
			})

			layersConfig.push({
				label: "Departamentos",
				type: "polygon",
				sides: 4,
				color: "#FFF252",
				fillColor: "#FFF252",
				weight: 1,
				layers_type: "general",
				layers: [capaDepartamentos],
				inactive: true,
				})

			supervision.forEach(supervision => {
				var layer = supervision[0][0];
				layer.addTo(mymap);
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
	}


var legends;
var legend;
//agrega la botonera de capas
async function initMap() {
    // Generar y añadir leyendas
	const urlParams = new URLSearchParams(window.location.search);
	const layerParam = urlParams.get('capa');
	legends = await generarTodosLayers(layerParam);
    try {
    	legend = new L.control.Legend({
			position: "topleft",
			title: "Capas",
			collapsed: true,
			symbolWidth: 17, 
			opacity: 1,
			column: false,
			legends: legends
    	}).addTo(mymap);
	} catch (error) {
		console.error('Error al cargar las capas:', error);
	}
	
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
        fetch('buscador/')
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

//agrega boton de pantalla completa
function mostrarFullscreenButton() {
	L.control.fullscreen({
	  position: 'topleft',
	  title: 'Pantalla Completa',
	  titleCancel: 'Salir de Pantalla Completa'
	}).addTo(mymap);
  }
mostrarFiltroButton.addTo(mymap);

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

//añade impresion del mapa completo
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

//añade impresion del manual
function addGuidePrint(){
	let print = document.getElementsByClassName('leaflet-control-browser-print')[0]

		let ul = document.createElement('UL')
		ul.classList = 'browser-print-holder'
		let li = document.createElement('LI')
		li.classList = 'browser-print-mode'
		li.style.display = 'none'
		let a = document.createElement('A')
		a.textContent = 'Descargar Manual de Usuario'
		a.classList = 'descarga'
		a.setAttribute('download','Manual de Usuario SIG.pdf')
		a.setAttribute('href', 'public/pdf/ManualDeUsuarioMapaInteractivo.pdf')
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

//eliminar boton segun id
function removeButtonById(buttonId) {
    var buttonToRemove = document.getElementById(buttonId);
    if (buttonToRemove) {
        // Eliminar el botón del DOM o desactivarlo
        buttonToRemove.parentNode.removeChild(buttonToRemove);}
}

// Agrega los tres botonones despues del legend
async function cargarBotonesMapa() {
		//mostrarFullscreenButton();
		await initMap();
		mostrarConsultaButton.addTo(mymap);
		//mostrarFiltroButton.addTo(mymap);
		controlbrowserPrint.addTo(mymap);
		addFullmapPrint();
		addGuidePrint();		
}
cargarBotonesMapa();

// existe layer

function layerNoExiste(layer){
    var existe=true;
    for (i=0; i < legend.options.legends.length; i++) {
        if(legends[i].label == layer ){
            existe = false;
        }
    }
    return existe;
}

// Agrega o refresca la botonera
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
	addGuidePrint();
}


//FUNCIONES PARA GENERAR UNA BASE DE CAPAS CREADAS POR EL USUARIO

function agregarOpcion() {
    var valorInput = document.getElementById('inputValor').value;
	var select = document.getElementById('selectOpciones');
	var option = document.createElement('option');
	var noEsta = true;
	for (let i = 0; i < select.options.length; i++) {
		if (select.options[i].value == valorInput){
			noEsta = false;
		}
	}
	if (noEsta) {
		if (valorInput != '') {
			option.textContent = valorInput;
			option.value = valorInput;
			select.appendChild(option);
			document.getElementById('inputValor').value = ''; // Limpiar input  
		} else {
			alert("Ingrese un nombre valido para la capa");
		}
	} else  {
		alert("La capa ya existe");
	} 
}


var instSelected = [];
//funcion que busca la ubicacion del resultado del buscador
function itemsearchselected(selected){
	var id = selected.split("-")[0];
	var por = selected.split("-")[1];
	var name = document.getElementById('selectOpciones').value;
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
					onEachFeature: onEachFeatureS
			}));
			instSelected.forEach(marker => {
				baselayer.addLayer(marker)
			})
			updateButtonInLegend(name,{label: name,
				type: "image",
				url:  "icons/establecimientos_consulta.svg",
				layers_type: "consulta",
				layers: instSelected,
				inactive: false,
				});
			
		} else if (!layerNoExiste(name)){
			legend.options.legends.forEach(capa => {
				if (capa.label == name) {
					capa.layers.push(L.geoJSON(data, {
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
						onEachFeature: onEachFeatureS
				}));
				capa.layers.forEach(marker => {
					marker.addTo(mymap);
				})
				}
			})
		}else {
			if(por == "xnombre"){
				document.getElementById("infoNomNombreRepetidoFormControlSelect").style.display= "block";
			} else {
				document.getElementById("infoNumNombreRepetidoFormControlSelect").style.display= "block";
			}
		}	
	})
	instSelected = [];
}

//busca ubicacion obtenida a partir de una cadena "latitud/longitud"
function itemSearchUbicacion(ubi) {
	var lat = ubi.split("/")[0];
	var long = ubi.split("/")[1];
	mymap.setView([lat, long], 16);
	resetForm();
}

//buscar por oferta
clusterOferta = [];
function ofertaSelect(){
    var resultModalidad = document.getElementById("f-select-modalidadesc").value;
    var resultNivel = document.getElementById("f-select-nivelesc").value;
	var name = document.getElementById('selectOpciones').value;
	var ofeSelected = [];
    fetch(`buscador/oferta?nivel=${resultNivel}&modalidad=${resultModalidad}`)
        .then(response => response.json())
        .then((escuelas) => {
			if (escuelas.features.length > 0){
				document.getElementById("infoOfertaNoDatosFinalesFormControlSelect").style.display = "none";
				if (layerNoExiste(name)) {
					var cluster = L.markerClusterGroup({
						showCoverageOnHover: false, // Desactiva la visualización del radio en el hover
						disableClusteringAtZoom: 13, // Desactiva la agrupación a partir de cierto nivel de zoom
						spiderfyOnMaxZoom: false, // No agrupa los marcadores al hacer zoom máximo
						maxClusterRadius: 30, // Establece el radio máximo de agrupación
						iconCreateFunction: function(cluster) {
							return L.divIcon({ 
								html: `<img src="./icons/establecimientos_consulta.svg">`, // Utiliza un ícono personalizado
								className: `search-icons`, // Clase CSS para el ícono
								iconSize: L.point(3, 3) // Tamaño del ícono
							});
						}
					});
					escuelas.features.forEach(data => {			
						ofeSelected.push(L.geoJSON(data, {
							pointToLayer: function (feature, latlng) {
									var marker = L.marker(latlng, {
										icon: L.icon({
											iconUrl: "icons/establecimientos_consulta.svg",
											iconSize:     [22, 22], 
											iconAnchor:   [11, 0], 
											popupAnchor:  [0, 0]
										}),
										riseOnHover: true
									});
									cluster.addLayer(marker);
									return marker
								},	
							onEachFeature: onEachFeatureO
						}));
						cluster.addTo(mymap);
						clusterOferta[`${name}`] = cluster
					})
					updateButtonInLegend(name,{label: name,
						type: "image",
						url:  "icons/establecimientos_consulta.svg",
						layers_type: "consulta",
						layers: cluster,
						inactive: false,
						});
				} else {
					Object.keys(clusterOferta).forEach( nameLayer => {
						if (nameLayer == name) {
							var capaTemp = clusterOferta[nameLayer];
							escuelas.features.forEach(data => {
								var marker = L.geoJSON(data, {
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
									onEachFeature: onEachFeatureO								
								})
								capaTemp.addLayer(marker);
							})
							clusterOferta[nameLayer].remove(mymap);
							clusterOferta[nameLayer] = capaTemp;
							clusterOferta[nameLayer].addTo(mymap);
						}
					})
				}
			} else {
				document.getElementById("infoOfertaNoDatosFinalesFormControlSelect").style.display = "block";
			}					
		});
	ofeSelected = [];
}
//actualiza los botones que debe mostrar la botonera
function updateButtonInLegend(label, newContent) {
    var legends = legend.options.legends;
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
	fnumeroescitem.innerHTML = " ";
	numeroescbtnclean.style.display= "none";
	numeroescbtn.style.display= "block";
	numeroescblockitem.style.display= "none";
	infoNro.style.display= "block";
	infoNroError.style.display= "none";
	infoNroErrorNonombre.style.display= "none";
	var infoNumNombreRepetidoFormControlSelect = document.getElementById("infoNumNombreRepetidoFormControlSelect");
	infoNumNombreRepetidoFormControlSelect.style.display= "none";
}

// Quitar capas  desde legend
function eliminarlayer(namelayer){
	legends = legends.filter(function(value, index, arr){ 
        return value.label != namelayer;
    });
	agregarNuevaLegend();
}

// actualiza legends desde legend
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

// Mostrar poput question de legend
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
						<img class="img-fluid mb-2" src="icons/lxayd0.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">2. Hacer clic sobre el grupo de capas 'Consulta' para desplegarlo.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc1.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">3. Hacer clic sobre el botón 'Eliminar capa', en el ejemplo, se desea eliminar la capa 'Capa de consulta'.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc2.png" alt="busqueda mapa educativo interactivo chubut">
						<p class="text-break fs-6 fst-italic lh-sm user-select-none">4. Se abre el dialogo solicitando que se confirme la acción, en el caso de que se desee continuar, hacer clic sobre el botón 'Confirmar' para eliminar la capa.</p>
						<img class="img-fluid mb-2" src="icons/lxcapaecc3.png" alt="busqueda mapa educativo interactivo chubut">
						<a href='#AyudaCapas' class="text-decoration-none fw-light text-end fs-6 fst-italic">Volver al principio</a>
					</p>`;
	var modalFiltro = new bootstrap.Modal(document.getElementById('staticBackdropleyend'), {});
	modalFiltro.toggle();
}

// Descargar excel desde legend 

async function downloadAsExcel(namelayer){
	var datosLabel = [];
	var datosObj = [];
	var tipo;
	var capa;
	legend.options.legends.forEach(data => {
		if (data.label == namelayer){
			tipo = data.layers_type;
			capa = data;
		}
	});
	if (tipo == 'consulta') {
		datosObj = Object.keys(capa.layers[0]._layers[capa.layers[0]._leaflet_id - 1].feature.properties);
		datosLabel.push(datosObj);
		capa.layers.forEach(marker => {
			datosObj = (Object.values(marker._layers[marker._leaflet_id - 1].feature.properties))
			datosLabel.push(datosObj);
		})
		downloadAsExcelD(namelayer, datosLabel);
	}else if (namelayer == "Delegaciones Administrativas") {
		var delegacion = await getDelegacionLayers();
		datosLabel = delegacion._needsClustering;
		datosLabel.forEach(temp => {
				delete temp.feature.properties.id
		})
		var len = datosLabel.length;
		for (var i = 0; i < len; i++){
			datosObj.push(datosLabel[i].feature.properties);
		}
		downloadAsExcelD(namelayer, datosObj);
	} else if (namelayer == "Ministerio de Educación"){
		datosLabel = ministerio_educacion.features;
		datosObj.push(datosLabel[0].properties);
		downloadAsExcelD(namelayer, datosObj);
		return 0
	} else {
		var localizaciones = [];
		localizaciones.push(await getEstablecimientosLayers())
		localizaciones.push(await getSupervisionLayers())
		localizaciones.forEach(establecimientos => {
			establecimientos.forEach(data => {
					var temp = data[0][0]._needsClustering;
					temp.forEach(data =>{
						delete data.feature.properties.id
					})
			})
			establecimientos.forEach(data => {
				if (data[1][0].label == namelayer || ("Supervisíon " + data[1][0].label) == namelayer) {
					datosLabel = data[0][0]._needsClustering;
				}
			})
		})
		var len = datosLabel.length;
		for (var i = 0; i < len; i++){
			datosObj.push(datosLabel[i].feature.properties);
		}
		downloadAsExcelD(namelayer, datosObj);
	}
}
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
	graficosGenerados = [];
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
	document.getElementById("tablaInfoFiltro").innerHTML = ' '
	return false;
}


//comportamiento del input "establecimiento" del modal filtro
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

//comportamiento del input "nivel" del modal filtro
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
//comportamiento del input "región" del modal filtro en las filas
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
//comportamiento del input "ambito" del modal filtro
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
//comportamiento del input "gestion" del modal filtro
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
//comportamiento del input "región" del modal filtro en las columnas
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


function downloadExcel(ws_data, filtro) {
	var matriz = [];
	matriz.push(Object.keys(ws_data[0]));
	ws_data.forEach(fila => {
		matriz.push(Object.values(fila));
	})
	// Crear una hoja de trabajo
	var ws = XLSX.utils.aoa_to_sheet(matriz);

	// Crear un libro de trabajo
	var wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Hoja1");

	// Escribir el libro de trabajo a un archivo binario
	var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

	// Crear un Blob a partir del archivo binario
	var blob = new Blob([wbout], { type: 'application/octet-stream' });

	// Crear un enlace temporal para la descarga
	var url = URL.createObjectURL(blob);
	var a = document.createElement("a");
	a.href = url;
	a.download = `filtro_${filtro}.xlsx`;

	// Disparar el evento de clic en el enlace temporal
	document.body.appendChild(a);
	a.click();

	// Limpiar el DOM removiendo el enlace temporal
	setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	}, 0);
}

//realiza la consulta dependiendo los filtros aplicados, del otro lado espera un switch
async function filtrar_info(dato, fila, col) {
	return fetch(`mapa/filtrar?dato=${dato}&col=${col}`)
	.then(response => response.json())
	.then(filtro => {
		return filtro
	})
}
//crea talba del modal filtro
function crearTabla(data) {
	const table = document.createElement('table');
	table.classList.add('table');
	table.classList.add('table-light');
	table.classList.add('table-hover');
	const tbody = document.createElement('tbody');
	const cabecera = document.createElement('tr');
	Object.keys(data[0]).forEach(col => {
		const column = document.createElement('td');
		column.textContent = col;
		cabecera.appendChild(column);
	});
	tbody.appendChild(cabecera);
	data.forEach(row => {
		const tr = document.createElement('tr');
		Object.values(row).forEach(cell => {
			const td = document.createElement('td');
			td.textContent = cell;
			tr.appendChild(td);
		});
		tbody.appendChild(tr);
	});

	table.appendChild(tbody);
	document.getElementById("tablaInfoFiltro").appendChild(table);
}

var tablaInfoFiltro = document.getElementById("descargarFiltro");
tablaInfoFiltro.addEventListener('click', function(e) {
	e.preventDefault();
	const selectedCheckbox = document.querySelector('.form-check-input:checked');
	downloadExcel(datosFiltrados, selectedCheckbox.value);
})


//Se dispara al solicitar "Filtrar informacion" realiza una consulta y descarga directamente en excel
var graficosGenerados = [];
var datosFiltrados;
var formfiltroInformacion = document.getElementById("formFiltroInformacion");
formfiltroInformacion.addEventListener("submit", async function(e) {
	e.preventDefault();
	const selectedCheckbox = document.querySelector('.form-check-input:checked');
	var infoestablecimientosxfiltronoselect = document.getElementById("infoestablecimientosxfiltronoselect");
	var fila = document.querySelector('.check-row:checked');
	var col = document.querySelector('.check-column:checked');
		if(selectedCheckbox){
			datosFiltrados = await filtrar_info(selectedCheckbox.value,fila.value,col.value);
			let labels = Object.keys(datosFiltrados[0]);
			labels.splice(0,1);
			let idGrafico;
			let reg = 0;
			datosFiltrados.forEach(grafico => {
				grafico = Object.values(grafico);
				idGrafico = grafico[0];
				grafico.splice(0,1)
				graficosGenerados.push(createPieChart(grafico, labels, idGrafico, posRegiones[reg]))
				reg +=1;
			})
			crearTabla(datosFiltrados);
		} else {
			infoestablecimientosxfiltronoselect.style.display = 'block';
		}
		
	})

function nomostrarestablecimientosinfofiltro(){
	document.getElementById("map").style.display = "block";
	document.getElementById("establecimientosinfofiltro").style.display = 'none';
}
/*Funcion para mostrat los graficos generados
var mostrarGraficos = document.getElementById("mostrarGraficosBoton");
mostrarGraficos.addEventListener('click', function(e) {
	graficosGenerados.forEach(grafico => {
		baselayer.addLayer(grafico.display);
		Plotly.newPlot(grafico.htmlElement, grafico.data, grafico.layout)
		
	})
	document.getElementById("tablaInfoFiltro").innerHTML = ' '	
})*/
//cierra los grafico
function closeChart(id){
	baselayer.eachLayer(function (layer) {
		if (layer.options.icon && layer.options.icon.options.className === id) {
			baselayer.removeLayer(layer);
			let valueToRemove = id.split('-')[2];
			graficosGenerados = graficosGenerados.filter(item => item.htmlElement !== valueToRemove);
		}
	});
}
//crea los graficos
function createPieChart(values, labels, htmlElement, pos){
	var regnum = htmlElement.split(" ")[1];
	htmlElement = htmlElement.split(" ")[0]+regnum;
	var data = [{
		values: values,
		labels: labels,
		type: 'pie',
		automargin: true
	}];
  
	var layout = {
		height: 150,
		width: 150,
		margin: {"t": 0, "b": 0, "l": 0, "r": 0},
		showlegend: false,
		paper_bgcolor:'rgba(0,0,0,0)',
		plot_bgcolor:'rgba(0,0,0,0)' 
	};
	
	
	var display = L.marker(pos, {
		icon: L.divIcon({
			className:`data-chart-${htmlElement}`,
			html: `<div id='${htmlElement}'>Región ${regnum}  <button type="button" id="data-chart-${htmlElement}" class="btn-close btn-sm" aria-label="Close" onclick="return closeChart(this.id);"></button></div>`
		}),
		zIndexOffset: 99
	})
	var div = {
		htmlElement,
		data,
		layout,
		display
	}

	return div
}
//se dispara al hacer zoom, en caso de haber graficos se ajustaran
mymap.on('zoomend', function() {
	var posCharts = [
		[-40, -78],
		[-40, -75],
		[-43, -78],
		[-43, -75],
		[-46, -78],
		[-46, -75]
	]
	var pos = 0;
    // Aquí puedes ejecutar el código que se activará cada vez que cambie el zoom
    var zoomLevel = mymap.getZoom(); // Obtener el nivel de zoom actual
	if (graficosGenerados > 0) {
		if (zoomLevel < 7){
			
			// Si quieres mover los gráficos, puedes hacerlo iterando sobre ellos
			graficosGenerados.forEach(function(grafico) {
				baselayer.eachLayer(function (layer) {
					if (layer.options.icon && layer.options.icon.options.className === 'data-chart-'+grafico.htmlElement) {
						baselayer.removeLayer(layer);
					}
				});
				// Eliminar el gráfico anterior y agregar uno en la nueva posición ajustada
		
				// Crear un nuevo marcador o actualizar el existente
				var newPos = posCharts[pos];
				var nuevoDisplay = L.marker(newPos, {
					icon: L.divIcon({
						className: `data-chart-${grafico.htmlElement}`,
						html: `<div id='${grafico.htmlElement}'>${grafico.htmlElement}<button type="button" id="data-chart-${grafico.htmlElement}" class="btn-close btn-sm" aria-label="Close" onclick="return closeChart(this.id);"></button></div>`
					}),
					zIndexOffset: 99
				});
		
				// Añadir el nuevo marcador al mapa
				baselayer.addLayer(nuevoDisplay);
		
				// Actualizar el gráfico si es necesario
				Plotly.newPlot(grafico.htmlElement, grafico.data, grafico.layout);
				pos +=1
			});
			pos = 0;
		} else {
			// Puedes mover los gráficos iterando sobre ellos
			graficosGenerados.forEach(function(grafico) {
				baselayer.eachLayer(function (layer) {
					if (layer.options.icon && layer.options.icon.options.className === 'data-chart-'+grafico.htmlElement) {
						baselayer.removeLayer(layer);
					}
				});
				var newPos = posRegiones[pos];
				var nuevoDisplay = L.marker(newPos, {
					icon: L.divIcon({
						className: `data-chart-${grafico.htmlElement}`,
						html: `<div id='${grafico.htmlElement}'>${grafico.htmlElement}<button type="button" id="data-chart-${grafico.htmlElement}" class="btn-close btn-sm" aria-label="Close" onclick="return closeChart(this.id);"></button></div>`
					}),
					zIndexOffset: 99
				});
		
				baselayer.addLayer(nuevoDisplay);
				Plotly.newPlot(grafico.htmlElement, grafico.data, grafico.layout);
				pos +=1
			});
			pos = 0;
		}
	}	
   
});
