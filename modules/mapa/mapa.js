// mapa interactivo ------------------------------------------------------------------------------
//espera 3 segundos antes de mostrar la pantalla

function hideLoadingScreen() {
	document.getElementById('loading-screen').style.display = 'none';
}
//setea el mapa

var mymap = new L.map('map', {
	/*measureControl: {
		enabled: true,
		unitLabel: 'km',
		unitFactor: 1000
	},*/
	fullscreenControl: true,
	fullscreenControlOptions: {
		position: 'topleft',
		forceSeparateButton: true
	},
}); 


// Tile mapas

var osmUrl ='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib ='Map data &copy;  <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a> contributors';
var argenMapaUrl = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png';
var argenMapaAttrib ='<a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a>'; //| <a href="http://pagina estadistica" target="_blank">DEyEE</a>
var googleStreetsUrl = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
var googleStreetsAttrib = 'Map data &copy; Google contributors';
var googleSatUrl = 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
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
	[-42.340042, -67.11289],
	[-43.678353, -70.742548],
	[-43.533583, -67.41289],
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
var textLatLngR2 = [-42.340042, -65.70081];  
var textLabelR2 = L.marker(posRegiones[1], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>II</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
var textLatLngR3 = [-43.678353, -70.742548];  
var textLabelR3 = L.marker(posRegiones[2], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>III</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
var textLatLngR4 = [-43.533583, -67.91289];  
var textLabelR4 = L.marker(posRegiones[3], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>IV</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
var textLatLngR5 = [-45.32692, -70.31852];  
var textLabelR5 = L.marker(posRegiones[4], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>V</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});
var textLatLngR6 = [-45.339412, -67.964911];  
var textLabelR6 = L.marker(posRegiones[5], {
    icon: L.divIcon({
        className: 'text-labels',
        html: '<div>VI</div>'
    }),
    zIndexOffset: -1,
	interactive: false
});


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
                            	//"</td></tr><tr><td><b>Total Localizaciones:</b> "+ (props.cantidades?props.cantidades[4].cantidad:"Sin Localizaciones") +
                            	"</td></tr><tr><td><b>Educación Inicial:</b> "+ (props.cantidades[3]?props.cantidades[3].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Primaria:</b> "+ (props.cantidades[6].cantidad?props.cantidades[6].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Secundaria:</b> "+ (props.cantidades[7]?props.cantidades[7].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Superior:</b> "+ (props.cantidades[9]?props.cantidades[9].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Centros de Formación Profesional:</b> "+ (props.cantidades[0]?props.cantidades[0].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Domiciliaria y Hospitalaria:</b> "+(props.cantidades[2]?props.cantidades[2].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Educación Especial:</b> "+ (props.cantidades[1]?props.cantidades[1].cantidad:"Sin Localizaciones")+
                            	//"</td></tr><tr><td><b>Educación Artística:</b> "+ (props.cantidades[1]?props.cantidades[1].cantidad:"Sin Localizaciones")+
                            	//"</td></tr><tr><td><b>Escuela Permanente para Jovenes y Adultos:</b> "+ (props.cantidades[6]?props.cantidades[6].cantidad:"Sin Localizaciones")+
								//"</td></tr><tr><td><b>Escuela Intercultural Bilingüe:</b> "+ (props.cantidades[5]?props.cantidades[5].cantidad:"Sin Localizaciones")+
								//"</td></tr><tr><td><b>Contexto de Encierro:</b> "+ (props.cantidades[2]?props.cantidades[2].cantidad:"Sin Localizaciones")+
								(esCero(props.cantidades[5].cantidad)?" ":"</td></tr><tr><td><b>Otros Servicios Educativos:</b> "+ props.cantidades[5].cantidad)+
								"</td></tr><tr><td><b>Servicios Alternativos y Complementarios:</b> "+ (props.cantidades[8]?props.cantidades[8].cantidad:"Sin Localizaciones")+
								(esCero(props.cantidades[4].cantidad)?" ":"</td></tr><tr><td><b>Nacionales:</b> "+ props.cantidades[4].cantidad)+
								//"</td></tr><tr><td><b>No corresponde modalidad:</b> "+ (props.cantidades[9]?props.cantidades[9].cantidad:"Sin Localizaciones")+
								//"</td></tr><tr><td><b>No corresponde nivel:</b> "+ (props.cantidades[10]?props.cantidades[10].cantidad:"Sin Localizaciones")+	
								//"</td></tr><tr><td><b>Edificios:</b> "+ ()+
								//"</td></tr><tr><td><b>Sedes:</b> "+ (props.cantidades[16]?props.cantidades[16].cantidad:"Sin Localizaciones")+
								//"</td></tr><tr><td><b>Anexos:</b> "+ (props.cantidades[0]?props.cantidades[0].cantidad:"Sin Localizaciones")+
                            	//"</td></tr><tr><td><b>Población:</b> "+ (props.poblacion?props.poblacion:"Sin Localizaciones")+
								"</td></tr><tr><td><b>TOTAL:</b> "+ (props.cantidades[10]?props.cantidades[10].cantidad:"Sin Localizaciones")+
                            	"</td></tr><tr><td><b>Superficie:</b> "+ (props.superficie?props.superficie:"Sin Información")+
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

function filtrarArreglo(origen, excluir) {
    const excluirSet = new Set(excluir);
    return origen.filter(item => !excluirSet.has(item));
}

var todosLayersTematicos = []
var todosLayersOtros = []
var uriGeo = "";
async function getGeoserverDatastoreLayers(workspace, datastore){

    const response = await fetch(
        `./api/geoserver/layers/${workspace}/${datastore}`
    );

    if (!response.ok){
        throw new Error('Error obteniendo capas');
    }

    var data = await response.json();
	const filtroCapa = ["ed-digital_salas-tecnologia-2024", "ed-digital_salas-tecnologia-2025"]
	data = filtrarArreglo(data, filtroCapa);
    switch (datastore) {

        case 'temáticos':

            for (const layer of data){

                if (
                    layer.split('_')[0] == 'establec' ||
                    layer.split('_')[0] == 'bibliotecas' ||
                    layer.split('_')[0] == 'ed-digital' ||
                    layer.split('_')[0] == 'taller-carto'
                ){

                    const data =
                        await getGeoserverLayer(workspace, layer);

                    todosLayersTematicos.push([
                        data,
                        layer.split('_')[1]
                    ]);
                }
            }

            break;

        case 'otros':

            for (const layer of data){

                const data =
                    await getGeoserverLayer(workspace, layer);

                todosLayersOtros.push([data, layer]);
            }

            break;
    }
}
async function cargarCapasGeoserver() {
	await obtenerCapasGeoserver();
	
	todosLayersOtros.forEach(otro => {
				layersConfig.push({
					label: otro[1].charAt(0).toUpperCase() + otro[1].slice(1),
					type: 'image',
					url: 'icons/tematico.svg',
					layers_type: "otro",
					layers: otro[0],
					inactive: true
				})
			})
}

async function getGeoserverLayer(workspace, layer) {
	const viewLayer = L.tileLayer.wms(`./geoserver/geoserver/ows`, {
		layers: `${workspace}:${layer}`,
		format: 'image/png',
		transparent: true,	
		version: '1.1.1',
		attribution: "SIG Educativo"
	})
	let tipoCapa = layer.split("_")[0];
	let subTipoCapa = layer.split("_")[1];
	let tipoIcon;
	let dataLayer;
	try {
		const geoResponse = await fetch(`./geoserver/geoserver/sigeducativo/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${workspace}%3A${layer}&maxFeatures=300&outputFormat=application%2Fjson&srsname=EPSG:4326`);
		if (!geoResponse.ok) {

			const errorText = await geoResponse.text();

			throw new Error(
				`HTTP ${geoResponse.status}: ${errorText}`
			);
		}
		
		const dataGeoJSON = await geoResponse.json();
		switch (tipoCapa) {
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
					switch (tipoCapa) {
						case 'bibliotecas':
								tipoIcon = 'biblioteca_pop'
							break;
						case 'infra':
								tipoIcon = 'equiInfra'
							break;
						case 'ed-digital':
								switch (subTipoCapa) {
									case 'netbooks':
											tipoIcon = 'netbooks'
										break;
									case 'adm':
											tipoIcon = 'adm'
										break;
									case 'robotica':
											tipoIcon = 'robotica'
										break;
									case 'salas-tecnologia-2024':
											tipoIcon = 'salasTec'
										break;
									case 'salas-tecnologia-2025':
											tipoIcon = 'salasTec'
									case 'starlink':
											tipoIcon = 'starlink'
										break;	
									default:
										tipoIcon = 'edDigital'
										break;
								}
							break;
						default:
							switch (subTipoCapa) {
								case 'cooperadoras':
										tipoIcon = 'cooperadoras'
									break;
								default:
									tipoIcon = 'establecimientos'
									break;
							}
							break;
					}
					if (dataGeoJSON.features[0].geometry.type == 'MultiLineString') {
						dataLayer = createLineLayer(dataGeoJSON, tipoIcon)
					} else {
						dataLayer = createLayer(dataGeoJSON, tipoIcon, '')
					}
				break;
		}

	} catch (e) {
		console.error("Error al cargar la capa: ", e);
        return;
	}
	return dataLayer;
}


// Agregar regiones a mapa
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
  	setTimeout(function(){ layer.closePopup(); }, 30000);  
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

function popup_bib_populares (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Biblioteca Pedagógica "+ (feature.properties.nombre?feature.properties.nombre:"") +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Dirección:</b> "+ (feature.properties.dirección?feature.properties.dirección:"No se registra") +
		"</td></tr><tr><td><b>Contacto:</b> "+ (feature.properties.contacto?feature.properties.contacto:"No se registra") +
		"</td></tr></table></div>",
		{minWidth: 270, maxWidth: 270}
	);
	layer.on({
        popupopen : closepoputNL,
    });
};

function popup_ed_digital_robo (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Hacemos Futuro: Róbotica " +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") +
		"</td></tr><tr><td><b>Cod. Jurisdiccional:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") +
		"</td></tr><tr><td><b>CUE:</b> "+ (feature.properties.cue?feature.properties.cue:"No se registra") +
		"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") +
		"</td></tr><tr><td><b>Observaciones:</b> "+ (feature.properties.observaciones?feature.properties.observaciones:"No se registra") +
		"</td></tr><tr><td><b>Ámbito:</b> "+ (feature.properties.ambito?feature.properties.ambito:"No se registra") +
		(feature.properties.kit_robo_mblock?"</td></tr><tr><td><b>Kit Robótica Mblock:</b> "+feature.properties.kit_robo_mblock:"") +
		(feature.properties.kit_arduino?"</td></tr><tr><td><b>Kit Arduino:</b> "+feature.properties.kit_arduino:"")+
		(feature.properties.placa_microbit?"</td></tr><tr><td><b>Placa Microbit:</b> "+feature.properties.placa_microbit:"")+
		(feature.properties.placa_raspberry?"</td></tr><tr><td><b>Placa Raspberry:</b> "+feature.properties.placa_raspberry:"")+
		"</td></tr></table></div>"),
		{minWidth: 270, maxWidth: 270}
	};

function popup_ed_digital_adm(feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Hacemos Futuro: Aula Digital Movil " +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") +
		"</td></tr><tr><td><b>Cod. Jurisdiccional:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") +
		"</td></tr><tr><td><b>CUE:</b> "+ (feature.properties.cue?feature.properties.cue:"No se registra") +
		"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") +
		"</td></tr><tr><td><b>Observaciones:</b> "+ (feature.properties.observaciones?feature.properties.observaciones:"No se registra") +
		"</td></tr><tr><td><b>Ámbito:</b> "+ (feature.properties.ambito?feature.properties.ambito:"No se registra") +
		(feature.properties.carro?"</td></tr><tr><td><b>ADM:</b> "+feature.properties.carro:"") +
		"</td></tr></table></div>"),
		{minWidth: 270, maxWidth: 270}
	};

function popup_ed_digital_netbooks (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Hacemos Futuro: Neetbooks " +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") +
		"</td></tr><tr><td><b>Cod. Jurisdiccional:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") +
		"</td></tr><tr><td><b>CUE:</b> "+ (feature.properties.cue?feature.properties.cue:"No se registra") +
		"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") +
		"</td></tr><tr><td><b>Observaciones:</b> "+ (feature.properties.observaciones?feature.properties.observaciones:"No se registra") +
		"</td></tr><tr><td><b>Ámbito:</b> "+ (feature.properties.ambito?feature.properties.ambito:"No se registra") +
		"</td></tr><tr><td><b>Neetbooks:</b> "+feature.properties.netbooks +
		"</td></tr></table></div>"),
		{minWidth: 270, maxWidth: 270}
	};

	function popup_ed_digital_salasTec (feature, layer) {
		layer.bindPopup(
			"<div class='p-3'><h6 style='color:#0d6efd'>Salas Tecnologicas" +
			"</h6><table>" +
			"</td></tr><tr><td><b>Nombre:</b> "+ (feature.properties.nombre?feature.properties.nombre:"No se registra") +
			"</td></tr><tr><td><b>Cod. Jurisdiccional:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") +
			"</td></tr><tr><td><b>CUE-Anexo:</b> "+ (feature.properties.cue_anexo?feature.properties.cue_anexo:"No se registra") +
			"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") +
			"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") +
			"</td></tr><tr><td><b>Ámbito:</b> "+ (feature.properties.ambito?feature.properties.ambito:"No se registra") +
			"</td></tr></table></div>"),
			{minWidth: 270, maxWidth: 270}
		};	

function popup_ed_digital (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Hacemos Futuro" +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") +
		"</td></tr><tr><td><b>Cod. Jurisdiccional:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") +
		"</td></tr><tr><td><b>CUE:</b> "+ (feature.properties.cue?feature.properties.cue:"No se registra") +
		"</td></tr><tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") +
		"</td></tr><tr><td><b>Observaciones:</b> "+ (feature.properties.observaciones?feature.properties.observaciones:"No se registra") +
		"</td></tr><tr><td><b>Ámbito:</b> "+ (feature.properties.ambito?feature.properties.ambito:"No se registra") +
		(feature.properties.netbooks?"</td></tr><tr><td><b>Neetbooks:</b> "+ feature.properties.netbooks:"") +
		(feature.properties.kit_robo_mblock?"</td></tr><tr><td><b>Kit Robótica Mblock:</b> "+feature.properties.kit_robo_mblock:"") +
		(feature.properties.kit_arduino?"</td></tr><tr><td><b>Kit Arduino:</b> "+feature.properties.kit_arduino:"")+
		(feature.properties.placa_microbit?"</td></tr><tr><td><b>Placa Microbit:</b> "+feature.properties.placa_microbit:"")+
		(feature.properties.placa_raspberry?"</td></tr><tr><td><b>Placa Raspberry:</b> "+feature.properties.placa_raspberry:"")+
		(feature.properties.carro?"</td></tr><tr><td><b>ADM:</b> "+feature.properties.carro:"") +
		"</td></tr></table></div>"),
		{minWidth: 270, maxWidth: 270}
	};

function popup_ed_digital_starlink (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Conexión STARLINK" +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Numero:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") +
		"</td></tr><tr><td><b>Ámbito:</b> "+ (feature.properties.ambito?feature.properties.ambito:"No se registra") +
		"</td></tr><tr><td><b>Proveedor:</b> "+ (feature.properties.ISP?feature.properties.ISP:"No se registra") +
		"</td></tr><tr><td><b>Comparte con:</b> "+ (feature.properties.comparte === "NO"?feature.properties.comparte:"NO") +
		"</td></tr></table></div>"),
		{minWidth: 270, maxWidth: 270}
	};

function popup_calle (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>Ciudad: "+ (feature.properties.ciudad?feature.properties.ciudad:"") +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Linea:</b> "+ (feature.properties.linea?feature.properties.linea:"No se registra") +
		"</td></tr><tr><td><b>Nombre:</b> "+ (feature.properties.nombre?feature.properties.nombre:"No se registra") +
		"</td></tr></table></div>",
		{minWidth: 270, maxWidth: 270}
	)
	layer.on({
		popupopen: resaltarLinea,
		popupclose: restablecerEstiloLinea
	});
};

function popup_cooperadoras (feature, layer) {
	layer.bindPopup(
		"<div class='p-3'><h6 style='color:#0d6efd'>" + (feature.properties.nombre?feature.properties.nombre:"No se registra") +
		"</h6><table>" + 
		"</td></tr><tr><td><b>Cod. Jurisdiccional:</b> "+ (feature.properties.escuela?feature.properties.escuela:"No se registra") +
		"</td></tr><tr><td><b>N° de Resolución:</b> "+ (feature.properties.n_reso?feature.properties.n_reso:"No se registra") +
		"</td></tr><tr><td><b>Fecha de Resolución:</b> "+ (feature.properties.fecha_reso?feature.properties.fecha_reso:"No se registra") +
		"</td></tr><tr><td><b>Personeria Juridica:</b> "+ (feature.properties.pers_juridica?feature.properties.pers_juridica:"No se registra") +
		"</td></tr><tr><td><b>Presidente:</b> "+ (feature.properties.presidente?feature.properties.presidente:"No se registra") +
		"</td></tr><tr><td><b>Tesorero:</b> "+ (feature.properties.tesorero?feature.properties.tesorero:"No se registra") +
		"</td></tr></table></div>"),
		{minWidth: 270, maxWidth: 270}
	};

function popup_designacion (feature, layer) {
	layer.bindPopup(	
		"<div class='p-3'>"+
		"<h6 style='color:#0d6efd'>"+ ("Designaciones "+feature.properties.nivel+" de "+feature.properties.localidad) + "</h6>" +
		"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>Región:</b> "+ (feature.properties.region?convertirARomano(feature.properties.region):"No se registra") + "</td></tr>" +
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?formatoNombre(feature.properties.localidad):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") + "</td></tr>" +
		"<tr><td><b>Lugar:</b> "+ (feature.properties.lugar?feature.properties.lugar:"No se registra") + "</td></tr>" +
		"<tr><td><b>Horarios:</b> "+ (feature.properties.horario?feature.properties.horario:"No se registra") + "</td></tr>" +
		"</table>" +
		"</div>", {minWidth: 270, maxWidth: 270}
		);
}

function popup_junta (feature, layer) {
	layer.bindPopup(	
		"<div class='p-3'>"+
		"<h6 style='color:#0d6efd'>"+ ("Junta de Clasificación Docente de Nivel "+feature.properties.nivel+" "+feature.properties.nombre) + "</h6>" +
		"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>Región:</b> "+ (feature.properties.region?convertirARomano(feature.properties.region):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") + "</td></tr>" +
		"<tr><td><b>Telefono:</b> "+ (feature.properties.telefono?feature.properties.telefono:"No se registra") + "</td></tr>" +
		"<tr><td><b>Correo:</b> "+ (feature.properties.correo?feature.properties.correo:"No se registra") + "</td></tr>" +
		"</table>" +
		"</div>", {minWidth: 270, maxWidth: 270}
		);
}

function popup_oficinas (feature, layer) {
	layer.bindPopup(	
		"<div class='p-3'>"+
		"<h6 style='color:#0d6efd'>"+ (feature.properties.oficina) + "</h6>" +
		"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") + "</td></tr>" +
		"<tr><td><b>Telefono:</b> "+ (feature.properties.telefono?feature.properties.telefono:"No se registra") + "</td></tr>" +
		"<tr><td><b>Correo:</b> "+ (feature.properties.correo?feature.properties.correo:"No se registra") + "</td></tr>" +
		"<tr><td><b>Web:</b> "+ (feature.properties.web?feature.properties.web:"No se registra") + "</td></tr>" +
		"</table>" +
		"</div>", {minWidth: 270, maxWidth: 270}
		);
}
	


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
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?feature.properties.localidad:"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.domicilio?feature.properties.domicilio:"No se registra") + "</td></tr>" +
		"<tr><td><b>Nivel:</b> "+ (feature.properties.nivel?feature.properties.nivel:"No se registra") + "</td></tr>" +
		"</table>" +
		"<h6 class='mt-3'> Información de Contacto</h6>" + 
		"<table>" +
		"<tr><td><b>Teléfono:</b> "+ (feature.properties.telefono?feature.properties.telefono:"") + "</td></tr>" +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"<tr><td><b>Sitio Web:</b>" + "<a " + (feature.properties.sitioweb && feature.properties.sitioweb != 'Sin información'?"href='"+feature.properties.sitioweb:"") + " ' target='_blank' rel='noopener noreferrer'> "  + (feature.properties.sitioweb?feature.properties.sitioweb:"No se registra") + "</a>"+ "</td></tr>" +
		"<tr><td><b>Responsable:</b> "+ (feature.properties.responsable?feature.properties.responsable:"") + "</td></tr>" +
		//"<tr><td><b>Tel. del Responsable:</b> "+ (feature.properties.tel_resp?feature.properties.tel_resp:"-") + "</td></tr>" +
		"</table>" +
  		"</div></div>" + (feature.properties.area?"<div id='divBotonArea'></td></tr><tr><td><label for='areaInstMarker'>Radio Escolar</label><input type='checkbox' id='areaInstMarker' value='"+feature.properties.id+"'></input></div>":"</div>") +
  		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+(feature.properties.id ? feature.properties.id : feature.properties.id_institucion)+"' target='_blank'>Ver más...</a></div>" +
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
  		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
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
		"</div></div>" + (feature.properties.area?"<div id='divBotonArea'></td></tr><tr><td><label for='areaInstMarker'>Radio Escolar</label><input type='checkbox' id='areaInstMarker' value='"+feature.properties.id+"'></input></div>":"</div>") +
		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
		"</div>", {minWidth: 270, maxWidth: 270}
		);
	}

	function onEachFeatureCsac (feature, layer) {
		layer.bindPopup(	
			"<div class='p-3'>"+
			"<h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") + "</h6>" +
			"<h6> Información General</h6>" + 
			 "<table>"+
			"<tr><td><b>Número:</b> "+ (feature.properties.numero?feature.properties.numero:"No se registra") + "</td></tr>" +
			"<tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") + "</td></tr>" +
			"<tr><td><b>Dirección:</b> "+ (feature.properties.direccion?feature.properties.direccion:"No se registra") + "</td></tr>" +
			"<tr><td><b>Descripcion</b><br> "+ (feature.properties.descripcion?feature.properties.descripcion:"No se registra") + "</td></tr>" +
			"</table>" +
			"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
			"</div>", {minWidth: 270, maxWidth: 270}
			);
		}

	function onEachFeatureC (feature, layer) {
		layer.bindPopup(	
			"<div class='p-3'>"+
			"<h6 style='color:#0d6efd'>"+ (feature.properties.puntos?feature.properties.puntos:"No se registra") + "</h6>" +
			"<h6> Información General</h6>" + 
			 "<table>"+
			"<tr><td><b>Escuela:</b> "+ (feature.properties.escuela?feature.properties.escuela:"No se registra") + "</td></tr>" +
			"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad !=="Chubut" ?feature.properties.localidad:"No se registra") + "</td></tr>" +
			"<tr><td><b>Año</b><br> "+ (feature.properties.año?feature.properties.año:"No se registra") + "</td></tr>" +
			"<tr><td><b>Curso</b><br> "+ (feature.properties.curso?feature.properties.curso:"No se registra") + "</td></tr>" +
			"</table>" +
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
		"<div class=''><div class='d-flex justify-content-end'><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+feature.properties.id+"' target='_blank'>Ver más...</a></div>" +
		"</div>", {minWidth: 270, maxWidth: 270}
		);
	}

function popup_equip_infra (feature, layer) {
	const popup1 = "<div class='p-3'>"+
  		"<h6 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra") + "</h6>" +
	 	"<h6> Información General</h6>" + 
	 	"<table>"+
		"<tr><td><b>CUE - Anexo:</b> "+ (feature.properties.cueanexo?feature.properties.cueanexo:"No se registra") + "</td></tr>"+
		"<tr><td><b>Número:</b> "+ (feature.properties.codjurid?feature.properties.codjurid:"No se registra") + "</td></tr>" + 
		"<tr><td><b>Región:</b> "+ (feature.properties.region?feature.properties.region:"No se registra") + "</td></tr>" +
		"<tr><td><b>Localidad:</b> "+ (feature.properties.localidad?formatoNombre(feature.properties.localidad):"No se registra") + "</td></tr>" +
		"<tr><td><b>Dirección:</b> "+ (feature.properties.domicilio?feature.properties.domicilio:"No se registra") + "</td></tr>" +
		"<tr><td><b>Nivel:</b> "+ (feature.properties.nivel?feature.properties.nivel:"No se registra") + "</td></tr>" +
		"</table>" +
		"<h6 class='mt-3'> Información de Contacto</h6>" + 
		"<table>" +
		"<tr><td><b>Teléfono:</b> "+ (feature.properties.telefono?feature.properties.telefono:"") + "</td></tr>" +
		"<tr><td><b>Email:</b><a " + (feature.properties.email?"href='mailto:"+feature.properties.email:"") + " '> "  + (feature.properties.email?feature.properties.email:"No se registra") + "</a></td></tr>" +
		"<tr><td><b>Sitio Web:</b>" + "<a " + (feature.properties.web && feature.properties.web != 'Sin información'?"href='"+feature.properties.sitioweb:"") + " ' target='_blank' rel='noopener noreferrer'> "  + (feature.properties.sitioweb?feature.properties.sitioweb:"No se registra") + "</a>"+ "</td></tr>" +
		"<tr><td><b>Responsable:</b> "+ (feature.properties.responsabl?feature.properties.responsabl:"") + "</td></tr>" +
		"<tr><td><b>Tel. del Responsable:</b> "+ (feature.properties.resp_tel?feature.properties.resp_tel:"-") + "</td></tr>" +
		"</table>" +
  		"</div></div>" +
  		"<div class='d-flex justify-content-end'><button class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' >Infraestructura</button><a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+feature.properties.id+"' target='_blank'>Ver más...</a>" +
  		"</div>"
	layer.bindPopup(popup1,{minWidth: 270, maxWidth: 270});
	layer.feature.properties.popup1 = popup1;
	layer.feature.properties.popup2 = "<div class='p-3' id='popup_equi_infra'><h5 style='color:#0d6efd'>"+ (feature.properties.nombre?feature.properties.nombre:"No se registra")+
		"</h5><table><tr><td><h6><b>Infraestructura</b></h6></td></tr><tr>" +
		"<td colspan='2'><b>Numero:</b> "+ (feature.properties.codjurid?feature.properties.codjurid:"No se registra") + "</td></tr>" + 
		"<tr><td colspan='2'>"+ (feature.properties.agua == 'SI'?"<img src="+"./icons/agua.svg"+">":"<img src="+"./icons/aguaNo.png"+">") + "</td></tr>" +
		"<tr><td>"+ (feature.properties.internet == 'SI'?"<img src="+"./icons/internet.svg"+">":"<img src="+"./icons/internetNo.png"+">") + "</td> " +
		"<td><b>Proovedor:</b> "+ (feature.properties.fuente_internet?feature.properties.fuente_internet:"No indica"+">") + "</td></tr>" + 
		"<tr><td>"+ (feature.properties.energia == 'SI'?"<img src="+"./icons/energia.png"+">":"<img src="+"./icons/energiaNo.png"+">")  + "</td>" +
		"<td><b>Proovedor:</b> " + (feature.properties.fuente_energia?feature.properties.fuente_energia:"No indica"+">")  + "</td></tr>" +
		"<tr><td>"+ (feature.properties.gas == 'SI'?"<img src="+"./icons/calefaccion.svg"+">":"<img src="+"./icons/calefaccionNo.png"+">") + "</td>" +
		"<tr><td colspan='2'><h6><b>Equipamiento</b></h6></td></tr>" +
		"<tr><td colspan='2'>" + (feature.properties.biblioteca == 'SI'?"<img src="+"./icons/biblioteca.svg"+">":"<img src="+"./icons/bibliotecaNo.png"+">") +
		(feature.properties.laboratorio == 'SI'?"<img src="+"./icons/laboratorio.svg"+">":"<img src="+"./icons/laboratorioNo.png"+">") +
		(feature.properties.informatica == 'SI'?"<img src="+"./icons/informatica.svg"+">":"<img src="+"./icons/informaticaNo.png"+">") +
		(feature.properties.artistica == 'SI'?"<img src="+"./icons/artistica.svg"+">":"<img src="+"./icons/artisticaNo.png"+">") +
		(feature.properties.taller == 'SI'?"<img src="+"./icons/taller.svg"+">":"<img src="+"./icons/tallerNo.png"+">") +
		"</td></tr></table>"+
		"<button class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' >Info general</button> <a class='btn btn-outline-primary btn-sm mt-0 mb-2 m-2' href='./info?num="+feature.properties.id+"' target='_blank'>Ver más...</a>"+
		"</div>";
	layer.currentPopup = "popup1"
	layer.on("popupopen", function (e){
		var popup = e.popup;
		var popupElement = popup._contentNode;

		if (popupElement){
			var button = popupElement.querySelector("button")
			if (button){
				button.onclick = () => cambiarPopup(layer._leaflet_id, layer.feature.properties.popup1, layer.feature.properties.popup2)
			}
		}
	})

	layer.on({
		popupopen : closepoputNL,
	});
}

function cambiarPopup(layerid, popup1, popup2){
	let layer = Object.values(mymap._layers).find(l => l._leaflet_id === layerid);
	var newPopup; 
	layer.currentPopup === 'popup1' ? newPopup = popup2 : newPopup = popup1;
	layer.setPopupContent(newPopup).openPopup();
	layer.currentPopup === 'popup1' ? layer.currentPopup = "popup2" : layer.currentPopup = "popup1";
	layer.closePopup()
	layer.openPopup()
}

function showZoom(){
	var zoom = mymap.getZoom();
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
	const layer = L.geoJSON(data, {
		pointToLayer: function (feature, latlng) {
			if (tipo == 'salasTec' && feature.properties.estado == 1) {
				var marker = L.marker(latlng, {
					icon: L.icon({
						iconUrl: `icons/admok_.svg`,
						iconSize: [22, 22],
						iconAnchor: [11, 0],
						popupAnchor: [0, 0]
					}),
					riseOnHover: true,	
				});
			} else if(tipo == 'salasTec' && feature.properties.estado == 0){
				var marker = L.marker(latlng, {
					icon: L.icon({
						iconUrl: `icons/admno_.svg`,
						iconSize: [22, 22],
						iconAnchor: [11, 0],
						popupAnchor: [0, 0]
					}),
					riseOnHover: true,	
				});
			} else {
				var marker = L.marker(latlng, {
					icon: L.icon({
						iconUrl: `icons/${tipo}_${nivel}.svg`,
						iconSize: [22, 22],
						iconAnchor: [11, 0],
						popupAnchor: [0, 0]
					}),
					riseOnHover: true,	
				});
			}
			var moved = false;
			
			marker.on('mouseover', function(){
				var latlng = marker.getLatLng();
				globalMarkers.forEach(referencia => {
					if (latlng.lat === referencia.getLatLng().lat && latlng.lng === referencia.getLatLng().lng && marker._leaflet_id !== referencia._leaflet_id){
						if (marker.feature.properties.nivel) {
							if(marker.feature.properties.nivel !== referencia.feature.properties.nivel) {
								moverMarcador(marker);
								moved = true;
							}
						} else {
							moverMarcador(marker);
							moved = true;
						}
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
		onEachFeature: (tipo === 'supervision') ? popup_supervision : (tipo === 'delegacion') ? popup_del_admnistrativas : (tipo === 'biblioteca') ? popup_bib_pedagogicas : (tipo === 'establec') ? onEachFeatureEst : (tipo === 'biblioteca_pop') ? popup_bib_populares : (tipo === 'equiInfra') ? popup_equip_infra : (tipo === 'netbooks') ? popup_ed_digital_netbooks : (tipo === 'adm') ? popup_ed_digital_adm : (tipo === 'robotica') ? popup_ed_digital_robo : (tipo === 'edDigital') ? popup_ed_digital: (tipo === 'salasTec') ? popup_ed_digital_salasTec:  (tipo === 'cooperadoras') ? popup_cooperadoras:  (tipo === 'designacion') ? popup_designacion : (tipo === 'junta') ? popup_junta: (tipo === 'oficinas') ? popup_oficinas : (tipo === 'starlink') ? popup_ed_digital_starlink : onEachFeatureL
		});
	return cluster;
}

function createLineLayer(data,tipo) {
	layer = L.geoJSON(data, {
		style:{
			color:'#0000f0',
			weight: 3,
			opacity: 0.3
		},
		onEachFeature: popup_calle,
	});
	return layer;
}

//funciones para estilos de capas con lineas
function resaltarLinea(e){
	const capa = e.target;
	capa.setStyle ({
		color: '#00ff00',
		weight: 5,
		opacity: 0.9
	})
}

function restablecerEstiloLinea(e){
	setTimeout(function(){
		layer.resetStyle(e.targer);
	}, 2000);
	
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

	function getEquiInfra() {
		return fetch('mapa/setEquiInfraMarkers')
		.then(response => response.json())
		.then(institucion => {
			capaEquiInfra = createCluster('establecimientos', 'semaforo')
			var marker = L.geoJSON(institucion.geoJSON.data, {
				pointToLayer: (feature, latlng) => {
					return L.marker(latlng,
						{
							icon: L.icon({
								iconUrl:`./icons/establecimientos_semaforo_${feature.properties.completitud}.svg`,
								iconSize: [22,22],
								iconAnchor: [3,3]
							})
						}
					)
				},
				onEachFeature: popup_equip_infra
				
			})
			capaEquiInfra.addLayer(marker);
			capaEquiInfra.addTo(mymap);
			//renderizarSemaforo(institucion.completitud.data.promedio_completo);
			return capaEquiInfra
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
			todosLayers.push([[primariaLayer],[{label: 'Primario', url: 'primaria', legend:'nivel'}]]);//1
			todosLayers.push([[secundariaLayer],[{label: 'Secundario', url: 'sec', legend:'nivel'}]]);//2
			todosLayers.push([[SNULayer],[{label: 'Superior No Universitario', url: 'superior', legend:'nivel'}]]);//3
			todosLayers.push([[especialLayer],[{label: 'Especial', url: 'especial', legend:'modalidad'}]]);//4
			todosLayers.push([[formProfLayer],[{label: 'ETP', url: 'form_prof', legend:'modalidad'}]]);//5
			todosLayers.push([[domHospLayer],[{label: 'Domiciliaria/Hospitalaria', url: 'dom_hosp', legend:'modalidad'}]]);//6	
			todosLayers.push([[artisticaLayer],[{label: 'Artística', url: 'artistica', legend:'modalidad'}]]);//7
			todosLayers.push([[epjaLayer],[{label: 'EPJA', url: 'epja', legend:'modalidad'}]]);//8
			todosLayers.push([[contextoLayer],[{label: 'Contexto de Encierro', url: 'contexto', legend:'modalidad'}]]);//9
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

// capas cartografia participativa
todosLayerCarto = [];
function getCartoLayers(){
	var cartoLayer = fetch('mapa/setCartoMarkers')
	.then(response => response.json())
	.then( data => {
		var arrayName = [];
		var name;
		data.features.forEach(escuela => {
			name = escuela.properties.escuela;
			if (arrayName.length == 0) {
				arrayName.push([name]);
			} else {
				let esta = false;
				for (let i = 0; i < arrayName.length; i++) {
					if (name == arrayName[i]) {
						esta = true;
					}
				}
				if (!esta) {
						arrayName.push([name]);
				}
			}
		})
		
		data.features.forEach(esc =>{
			
			for (let i = 0; i < arrayName.length; i++) {
				if (esc.properties.escuela == arrayName[i][0]) {
					arrayName[i].push(esc);
				}
			}
		})
		
		for (let i = 0; i < arrayName.length; i++) {
			var cluster = createCluster('common-point-azul', '');
			var geoJSON = {
				type: "FeatureCollection",
				features: arrayName[i].filter(item => item?.type === "Feature")
				};
				const layer = L.geoJSON(geoJSON, {
				pointToLayer: function (feature, latlng) {
					switch (feature.properties.categoria) {
						case "establec-educativo":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/establec-educativo.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "vivienda":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/vivienda.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "centro de salud":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/centro_de_salud.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "centro de seguridad":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/centro_de_seguridad.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "bomberos":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/bomberos.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "museo":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/museo.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "transporte":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/omnibus.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "supermercado":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/supermercado.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "espacio verde":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/espacio_verde.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "organismo publico":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/organismo_publico.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "barrio":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/barrio.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
							case "flora y fauna":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/flora_y_fauna.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "hotel":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/hotel.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "deporte":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/deporte.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "espacio recreativo":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/espacio_recreativo.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "cultura":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/cultura.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "estacion de servicio":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/estacion_de_servicio.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "finanzas":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/finanzas.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "calle":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/calle.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "religion":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/religion.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "monumento":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/monumento.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "universidad":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/universidad.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "agua":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/agua.svg`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "geografia":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/geografia.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "puente":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/puente.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						case "puerto":
							var marker = L.marker(latlng, {
							icon: L.icon({
								iconUrl: `icons/puerto.png`,
								iconSize: [22, 22],
								iconAnchor: [11, 0],
								popupAnchor: [0, 0]
							}),
							riseOnHover: true,
						});
							break;
						default:
							var marker = L.marker(latlng, {
								icon: L.icon({
									iconUrl: `icons/common-point-azul.svg`,
									iconSize: [22, 22],
									iconAnchor: [11, 0],
									popupAnchor: [0, 0]
								}),
								riseOnHover: true,	
							});
							break;
					}
					marker.on('add', function(){
						globalMarkers.push(marker);
					})
					marker.on('remove', function(){
						globalMarkers = globalMarkers.filter(item => item._leaflet_id !== marker._leaflet_id)
					})
					cluster.addLayer(marker);
					return marker;
				},
				onEachFeature: onEachFeatureC
				});
				todosLayerCarto.push([arrayName[i][0],cluster])
			
		}
	})
	
	.catch(error => {
		console.error('Error fetching data:', error);
		return null;
	});
	return cartoLayer;
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
//Bibliotecas Pedagógicas
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

function getDesignacionesLayer(){
	var desigLayer = fetch ('mapa/setDesignacionesMarkers')
	.then (response => response.json())
	.then (data =>{
		var designacionesLayer = [];
		let desigLayerPri = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
		let desigLayerSec = {
			"type": "FeatureCollection",
			"features": [
			]
		}; 
		data.features.forEach(desig => {
			if (desig.properties.nivel == 'Primaria') {
				desigLayerPri.features.push(desig);
			} else {
				desigLayerSec.features.push(desig);
			}
		})
		designacionesLayer.push(createLayer(desigLayerPri,'designacion','primaria'));
		designacionesLayer.push(createLayer(desigLayerSec, 'designacion', 'secundaria'));
		return designacionesLayer
	})
	.catch(error => {
		console.log('Error fetching data:', error);
		return null
	})
	return desigLayer
}

function getJuntaClasificacionLayer(){
	var juntaLayer = fetch ('mapa/setJuntaMarkers')
	.then (response => response.json())
	.then (data =>{
		var juntaLayer = [];
		let juntaLayerPri = {
            "type": "FeatureCollection",
            "features": [
            ]
          };
		let juntaLayerSec = {
			"type": "FeatureCollection",
			"features": [
			]
		}; 
		data.features.forEach(junta => {
			if (junta.properties.nivel == 'inicial/primario') {
				juntaLayerPri.features.push(junta);
			} else {
				juntaLayerSec.features.push(junta);
			}
		})
		juntaLayer.push(createLayer(juntaLayerPri,'junta','primaria'));
		juntaLayer.push(createLayer(juntaLayerSec, 'junta', 'secundaria'));
		return juntaLayer
	})
	.catch(error => {
		console.log('Error fetching data:', error);
		return null
	})
	return juntaLayer
}


function getOficinasLayer(){
	var oficinasLayer = fetch ('mapa/setOficinasMarkers')
	.then (response => response.json())
	.then (data =>{
		let oficinasLayer;
		oficinasLayer = createLayer(data,'oficinas','');
		return oficinasLayer
	})
	.catch(error => {
		console.log('Error fetching data:', error);
		return null
	})
	return oficinasLayer
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
var slider;
var emptyLayer = [0];
var markerGroupCsac = [0];
var sliderControl = false;
function generarEventoCsac () {
	const legendItems = document.querySelectorAll('.leaflet-legend-item');
	legendItems.forEach(item => {
		const span = item.querySelector('span');
		if (span && span.textContent.trim() === 'CSAyC') {
		item.id = 'legend-btn-csayc'}
	})
}
async function getCsacLayer () {
	fetch('mapa/csac')
	.then(response => response.json())
	.then(data => {	     
		getDataAddMarkers = function( {label, value, map} ) {
			map.eachLayer(function (layer) {
					if (layer instanceof L.Marker) {
						map.removeLayer(layer);
					}
			});
	
			filteredData = data.features.filter(function (i, n) {
				return i.properties.title===label;
			});
			var markerArray = [];
			markerArray.push(L.geoJson(filteredData, {
				pointToLayer: (feature, latlng) => {
					return L.marker(latlng,
						{
							icon: L.icon({
								iconUrl:`./icons/common-point-${feature.properties.color}.svg`,
								iconSize: [22,22],
								iconAnchor: [12,8],
								index:3
							})
						}
					)
				},
				onEachFeature: onEachFeatureCsac
			})
			)
			markerGroupCsac[0] = (L.featureGroup(markerArray));
			markerGroupCsac[0].addTo(mymap)
			}
		generarEventoCsac()
		slider = L.control.timelineSlider({
			timelineItems: ["30 Años", "Actualidad"], 
			changeMap: getDataAddMarkers });
			item = document.getElementById('legend-btn-csayc')
			if (item) {
				item.addEventListener('click', () => {
					if (sliderControl) {
						slider.remove(mymap)
						markerGroupCsac[0].remove(mymap)
						sliderControl = false;
					} else {
						slider.addTo(mymap)
						sliderControl = true;
					}
				});	
			}	
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
var layersConfig = [];
async function generarTodosLayers(layerParam, escParam) {
	var emptyLayer = L.layerGroup()
	const establecimientos = await getEstablecimientosLayers();
	const delegaciones = await getDelegacionLayers();
	const supervision = await getSupervisionLayers();
	const bibliotecas = await getBibliotecaLayer();
	const designaciones = await getDesignacionesLayer();
	const junta = await getJuntaClasificacionLayer();
	const oficinas = await getOficinasLayer();
	capaRegiones = await getRegiones();
	const regiones = L.layerGroup([
		capaRegiones,
		textLabelR1,
		textLabelR2,
		textLabelR3,
		textLabelR4,
		textLabelR5,
		textLabelR6
	]);
	capaDepartamentos = await getDepartamentos();
	await getCartoLayers();
	await getCsacLayer();
	
	
	var i = 0;
	if (layerParam != null) {
		var layer;
		establecimientos.forEach(establecimiento => {
			layer = establecimiento[0][0];
			if (establecimiento[1][0].url === layerParam) {
				layersConfig.push({
					label: `${establecimiento[1][0].label}`,
					type: "image",
					url: `icons/establecimientos_${establecimiento[1][0].url}.svg`,
					layers_type: establecimiento[1][0].legend,
					layers: layer,
					inactive: false,
				});
			} else {
				layersConfig.push({
					label: `${establecimiento[1][0].label}`,
					type: "image",
					url: `icons/establecimientos_${establecimiento[1][0].url}.svg`,
					layers_type: establecimiento[1][0].legend,
					layers: layer,
					inactive: true,
				});
			}
			
			
			establecimiento[1][0].url === layerParam?layer.addTo(mymap):"";
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
				label: 'Designacion Primaria',
				type: 'image',
				url: 'icons/designacion_primaria.svg',
				layers_type: "organizacion",
				layers: designaciones[0],
				inactive: true
			})
			
		layersConfig.push({
				label: 'Designacion Secundaria',
				type: 'image',
				url: 'icons/designacion_secundaria.svg',
				layers_type: "organizacion",
				layers: designaciones[1],
				inactive: true
			})

		layersConfig.push({
				label: 'Junta Inicial/Primaria',
				type: 'image',
				url: 'icons/junta_primaria.svg',
				layers_type: "organizacion",
				layers: junta[0],
				inactive: true
			})
			
		layersConfig.push({
				label: 'Junta Secundaria',
				type: 'image',
				url: 'icons/junta_secundaria.svg',
				layers_type: "organizacion",
				layers: junta[1],
				inactive: true
			})

		layersConfig.push({
				label: 'Otras dependencias',
				type: 'image',
				url: 'icons/oficinas_externas.svg',
				layers_type: "organizacion",
				layers: oficinas,
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

		todosLayersTematicos.forEach(tematico => {
			if (tematico[1]== layerParam) {	
				inactivo = false
			} else {
				inactivo = true;
			}
			layer = tematico[0];
			layersConfig.push({
				label: tematico[1].charAt(0).toUpperCase() + tematico[1].slice(1),
				type: 'image',
				url: 'icons/tematico.svg',
				layers_type: "tema",
				layers: tematico[0],
				inactive: inactivo
			});
			(tematico[1] == layerParam?layer.addTo(mymap):i+=1);
		})
		layersConfig.push({
			label: 'CSAyC',
			type: 'image',
			url: 'icons/tematico.svg',
			layers_type: "tema",
			layers: emptyLayer,
			inactive: true
		})


		todosLayerCarto.forEach(carto => {
			layersConfig.push({
				label: carto[0],
				type: 'image',
				url: 'icons/tematico.svg',
				layers_type: "carto",
				layers: carto[1],
				inactive: true
			})
		})


		layersConfig.push ({
			label: "Regiones Educativas",
			type: "polygon",
			sides: 4,
			color: "#FFFFFF",
			fillColor: "#FF0000",
			weight: 1,
			layers_type: "general",
			layers: [regiones],
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
				label: `Supervisíón ${supervision[1][0].label}`,
				type: "image",
				url: `icons/supervision_${supervision[1][0].url}.svg`,
				layers_type: "organizacion",
				layers: layer,
				inactive: true,
			});
		});


		if (layerParam == 'infra') {
			//fetch('https://sistemas2.chubut.edu.ar/sigeducativo/getCookie',{credentials:'include'})
			fetch('./getCookie',{credentials:'include'})
			.then(response => {
				if (!response.ok) {
					// Si la respuesta no es exitosa, muestra el error
					throw new Error(`HTTP error! Status: ${response.status}`);
				}
				return response.json();  // Procesa la respuesta como JSON
			})
			.then(data => {
				if (data.cookie) {
					getEquiInfra()
				}
			});
		}

	} else if (layerParam == 'planeamiento') {}
	else {
			var soloBusqueda = false;
			var busqueda=[];
			const bounds = L.latLngBounds();
			// Obtener establecimientos y crear configuraciones de capas
			establecimientos.forEach(establecimiento => {
				var layer = establecimiento[0][0];
				if (escParam != null) {
					const escs = escParam.split('-');
					if (escs.length > 1) {
						escs.forEach(esc => {
							layer.eachLayer(layer => {
								if (layer.feature.properties.numero == esc && !busqueda.includes(layer.feature.properties.cue_anexo)) {
									layer.addTo(mymap);
									bounds.extend(layer.getLatLng());
									busqueda.push(layer.feature.properties.cue_anexo);
								}

							})
						});
					} else {
						escs.forEach(esc => {
							layer.eachLayer(layer => {
								if (layer.feature.properties.numero == esc && !busqueda.includes(layer.feature.properties.cue_anexo)) {
									layer.addTo(mymap);
									mymap.setView(layer.getLatLng(), 13);
									busqueda.push(layer.feature.properties.cue_anexo);
								}

							})
						});
					}
					soloBusqueda = true;
					if (escs.length > 1) {
						mymap.fitBounds(bounds);
					}
				};
				layersConfig.push({
					label: `${establecimiento[1][0].label}`,
					type: "image",
					url: `icons/establecimientos_${establecimiento[1][0].url}.svg`,
					layers_type: establecimiento[1][0].legend,
					layers: layer,
					inactive: true,
				});
					
			});
			layersConfig.push({
				label: "Ministerio de Educación",
				type: "image",
				url: "icons/ministerio.svg",
				layers_type: "organizacion",
				layers: [min_educacion],
				inactive: soloBusqueda,
				})
			layersConfig.push({
				label: 'Delegaciones Administrativas',
				type: 'image',
				url: 'icons/delegacion_.svg',
				layers_type: "organizacion",
				layers: delegaciones,
				inactive: soloBusqueda,
			})

			layersConfig.push ({
				label: "Regiones Educativas",
				type: "polygon",
				sides: 4,
				color: "#FFFFFF",
				fillColor: "#FF0000",
				weight: 1,
				layers_type: "general",
				layers: [regiones],
				inactive: soloBusqueda,
				})

			

			todosLayersTematicos.forEach(tematico => {
				layersConfig.push({
					label: tematico[1].charAt(0).toUpperCase() + tematico[1].slice(1),
					type: 'image',
					url: 'icons/tematico.svg',
					layers_type: "tema",
					layers: tematico[0],
					inactive: true
				})
			})

			layersConfig.push({
				label: 'CSAyC',
				type: 'image',
				url: 'icons/tematico.svg',
				layers_type: "tema",
				layers: emptyLayer,
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

			todosLayerCarto.forEach(carto => {
			layersConfig.push({
				label: carto[0],
				type: 'image',
				url: 'icons/tematico.svg',
				layers_type: "carto",
				layers: carto[1],
				inactive: true
			})
		})

			supervision.forEach(supervision => {
				var layer = supervision[0][0];
				layersConfig.push({
					label: `Supervisíón ${supervision[1][0].label}`,
					type: "image",
					url: `icons/supervision_${supervision[1][0].url}.svg`,
					layers_type: "organizacion",
					layers: layer,
					inactive: true,
				});
			});
			layersConfig.push({
				label: 'Designaciones Primaria',
				type: 'image',
				url: 'icons/designacion_primaria.svg',
				layers_type: "organizacion",
				layers: designaciones[0],
				inactive: true
			})

			layersConfig.push({
				label: 'Designaciones Secundaria',
				type: 'image',
				url: 'icons/designacion_secundaria.svg',
				layers_type: "organizacion",
				layers: designaciones[1],
				inactive: true
			})

			layersConfig.push({
				label: 'Junta Inicial/Primaria',
				type: 'image',
				url: 'icons/junta_primaria.svg',
				layers_type: "organizacion",
				layers: junta[0],
				inactive: true
			})

			layersConfig.push({
				label: 'Junta Secundaria',
				type: 'image',
				url: 'icons/junta_secundaria.svg',
				layers_type: "organizacion",
				layers: junta[1],
				inactive: true
			})

			layersConfig.push({
				label: 'Otras Dependencias',
				type: 'image',
				url: 'icons/oficinas_externas.svg',
				layers_type: "organizacion",
				layers: oficinas,
				inactive: true
			})
		}
		
		return layersConfig;
	}

function agruparLayers(layersConfig) {
  const grupos = {};

  layersConfig.forEach(item => {
    const tipo = item.layers_type || "otros";

    if (!grupos[tipo]) {
      grupos[tipo] = [];
    }

    grupos[tipo].push(item);
  });

  return grupos;
}

const gruposMeta = {
  organizacion: { label: "🏢 Dependencias", icon: "🏢" },
  nivel: { label: "🎓 Nivel", icon: "🎓" },
  modalidad: { label: "🔀 Modalidad", icon: "🔀" },
  tema: { label: "🌱 Temáticos", icon: "🌱" },
  general: { label: "🗺️ Límites", icon: "🗺️" },
  otro: { label: "📦 Otros", icon: "📦" },
  carto: { label: "🧭 Carto Participativa", icon: "🧭" },
  consultas: { label: "🔍 Consultas", icon: "🔍" },
};

function renderSidebarDesdeConfig(layersConfig) {
  const container = document.getElementById("capas");
  container.innerHTML = `<h2 class="sidebar-title">🗺️ Mapa Educativo Interactivo</h2>`;

  const grupos = agruparLayers(layersConfig);
  Object.keys(gruposMeta).forEach(tipo => {
    if (!grupos[tipo]) return;

    items = grupos[tipo];


    const meta =
        gruposMeta[tipo] || {
            label: tipo,
            icon: "📁"
        };

    const div =
        document.createElement("div");

    div.className = "grupo";

    div.dataset.group = tipo;

    let normales = items;
    let supervisiones = [];
    let otras = [];
	let limites = [];

	//Para aquellas capas que son de tipo organización, hacemos una clasificación adicional para separar supervisiones y oficinas externas del resto de las capas organizativas
	if (tipo === "organizacion" || tipo === "general") {
		normales = [];
		items.forEach(item => {
			if (item.label.toLowerCase().includes("supervis")) {
				supervisiones.push(item);
			} else if (item.label.toLowerCase().includes("designacion") || item.label.toLowerCase().includes("junta") || item.label.toLowerCase().includes("otras")) {
				otras.push(item);
			}  else {
				normales.push(item);
			}
		});
	}
	//titulos de las clasificaciones
    let html = `
		<h4 class="group-header">
			<span class="toggle-icon">▸</span>
			${tipo !== "general"
				? '<input type="checkbox" class="group-toggle">'
				: ''
			}
			${meta.label}
		</h4>
		<span class="info-header-btn" data-info="${meta.label}">❓</span>
		<div class="group-content">
		`;

    normales.forEach(item => {
		const layerId = generarId(item.label);
		layersRegistry[layerId] = item.layers;
		html += `
			<label>
			<input type="checkbox"data-layer="${layerId}" ${item.inactive ? "" : "checked"}>
			${item.label.length < 4 ? item.label.toUpperCase() : item.label}
			${item.layers_type === "tema" ? "" : item.layers_type === "carto" ? "" : item.layers_type === "general"? "" : item.layers_type === "otro"? "" : `<img src="${item.url}" alt="${item.label}" class="sidebar-layer-icon">`}
			</label><br>
			<span class="info-btn" data-info="${item.label}">ℹ️</span>
		`;
	});

	 // 🔹 subgrupo Supervisiones
    if (supervisiones.length) {
      html += `
        <div class="subgrupo collapsed">
          <div class="subgroup-header">
            <span class="toggle-icon">▸</span>
            👁️ Supervisiones
          </div>
		  <span class="info-header-btn" data-info="Supervisiones">❓</span>
          <div class="subgroup-content">
      `;

      supervisiones.forEach(item => {
        const layerId = generarId(item.label);
		layersRegistry[layerId] = item.layers;

        html += `
          <label>
            <input type="checkbox" data-layer="${layerId}" ${item.inactive ? "" : "checked"}>
            ${item.label}
			<img src="${item.url}" alt="${item.label}" class="sidebar-layer-icon">
          </label><br>
		  <span class="info-btn" data-info="${item.label}">ℹ️</span>
        `;
      });

      html += `</div></div>`;
    }

	if (otras.length) {
      html += `
        <div class="subgrupo collapsed">
          <div class="subgroup-header">
            <span class="toggle-icon">▸</span>
            🏬 Oficinas Externas
          </div>
          <span class="info-header-btn" data-info="Oficinas Externas">❓</span>
          <div class="subgroup-content">
      `;

      otras.forEach(item => {
        const layerId = generarId(item.label);
		layersRegistry[layerId] = item.layers;

        html += `
          <label>
            <input type="checkbox" data-layer="${layerId}" ${item.inactive ? "" : "checked"}>
            ${item.label}
			<img src="${item.url}" alt="${item.label}" class="sidebar-layer-icon">
          </label><br>
		  <span class="info-btn" data-info="${item.label}">ℹ️</span>
        `;
      });

      html += `</div></div>`;
    }

	html += `</div>`;
	
	if (items.every(i => i.inactive)) {
		div.classList.add("collapsed");
	}

    div.innerHTML = html;
    container.appendChild(div);
});
}


const layersRegistry = {};

function generarId(label) {
  const id = label
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w]/g, "");

  return id;
}

function normalizarLayers(l) {
  return Array.isArray(l) ? l : [l];
}

function buildLayersRegistry(layersConfig) {
  const layers = {};
  
  layersConfig.forEach(item => {
    const id = generarId(item.label);
	layersRegistry[id] = item.layers;
    layers[id] = normalizarLayers(item.layers);
  });

  return layers;
}

function toggleLayerGroup(layerArray, enabled) {
  layerArray.forEach(layer => {
    if (enabled) {
      if (!mymap.hasLayer(layer)) {
        mymap.addLayer(layer);
      }
    } else {
      if (mymap.hasLayer(layer)) {
        mymap.removeLayer(layer);
      }
    }
  });
}

function mostrarInfoSidebar(nombre) {
	const panel = document.getElementById("info-panel");
	const title = document.getElementById("info-title");
	const content = document.getElementById("info-content");

	title.innerText = nombre;
	content.innerText = getLayerInfo(nombre);

	panel.classList.remove("hidden");
	document.getElementById("info-close").addEventListener("click", () => {
		document.getElementById("info-panel").classList.add("hidden");
	});
}

function initSidebarEvents(layers) {

	// 🔹 Toggle individual
	document.querySelectorAll("[data-layer]").forEach(input => {
	input.addEventListener("change", (e) => {
		const id = e.target.dataset.layer;
		const layerGroup = layers[id];

		if (!layerGroup) return;

		toggleLayerGroup(layerGroup, e.target.checked);

		updateGroupState(e.target);
		saveState();
	});
	});


	// 🔹 Toggle por grupo (categoría)
	document.querySelectorAll(".grupo").forEach(group => {

		const groupToggle = group.querySelector(".group-toggle");
		const inputs = group.querySelectorAll("[data-layer]");
		if (!groupToggle) return;
		groupToggle.addEventListener("change", () => {
			inputs.forEach(input => {
			input.checked = groupToggle.checked;

			const id = input.dataset.layer;
			const layerGroup = layers[id];

			if (!layerGroup) return;

			toggleLayerGroup(layerGroup, groupToggle.checked);
			});

			saveState();
		});
	});

	document.querySelectorAll(".group-header").forEach(header => {
		header.addEventListener("click", (e) => {

			// evitar que el click en el checkbox dispare el colapso
			if (e.target.classList.contains("group-toggle")) return;

			const group = header.closest(".grupo");
			group.classList.toggle("collapsed");
		});
	});

	// subgrupos
	document.querySelectorAll(".subgroup-header").forEach(header => {
		header.addEventListener("click", () => {
			header.closest(".subgrupo").classList.toggle("collapsed");
		});
	});

	document.querySelectorAll(".info-btn").forEach(btn => {
		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			mostrarInfoSidebar(e.target.dataset.info);
		});
	});

	document.querySelectorAll(".info-header-btn").forEach(btn => {
		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			mostrarInfoSidebar(e.target.dataset.info);
		});
	});

	document.querySelectorAll(".group-content").forEach(group => {

		const inputs = group.querySelectorAll("[data-layer]");

		inputs.forEach(input => {

			input.addEventListener("change", () => {

				const id = input.dataset.layer;
				const layerGroup = layers[id];

				if (!layerGroup) return;

				// =========================
				// DEPARTAMENTOS
				// =========================

				if (id === "departamentos" && input.checked) {
					// quitar regiones
					mymap.removeLayer(
						layers["regiones_educativas"][0]
					);

					// descheckear regiones
					const regionesCheckbox =
						document.querySelector(
							'[data-layer="regiones_educativas"]'
						);

					if (regionesCheckbox) {
						regionesCheckbox.checked = false;
					}

					// cambiar leyenda
					document.getElementsByClassName(
						"info leaflet-control"
					)[0].style.display = "none";

					document.getElementsByClassName(
						"infoD leaflet-control"
					)[0].style.display = "block";
				}

				// =========================
				// REGIONES
				// =========================

				if (
					id === "regiones_educativas"
					&& input.checked
				) {
					// quitar departamentos
					mymap.removeLayer(
						layers["departamentos"][0]
					);

					// descheckear departamentos
					const deptosCheckbox =
						document.querySelector(
							'[data-layer="departamentos"]'
						);

					if (deptosCheckbox) {
						deptosCheckbox.checked = false;
					}

					// cambiar leyenda
					document.getElementsByClassName(
						"infoD leaflet-control"
					)[0].style.display = "none";

					document.getElementsByClassName(
						"info leaflet-control"
					)[0].style.display = "block";
				}

			});

		});

	});

	
}

function updateGroupState(childInput) {
  const group = childInput.closest(".grupo");
  const groupToggle = group.querySelector(".group-toggle");
  if (!groupToggle) return;
  const inputs = group.querySelectorAll("[data-layer]");

  const allChecked = [...inputs].every(i => i.checked);
  const noneChecked = [...inputs].every(i => !i.checked);

  if (allChecked) {
    groupToggle.checked = true;
    groupToggle.indeterminate = false;
  } else if (noneChecked) {
    groupToggle.checked = false;
    groupToggle.indeterminate = false;
  } else {
    groupToggle.indeterminate = true;
  }
}

function otrosAccesosCapas(){
	const urlParams = new URLSearchParams(window.location.search);
	const layerParam = urlParams.get('capa');
	if (layerParam == 'csac'){
		const espera = setInterval(() => {
			var botonCsac = document.getElementById('legend-btn-csayc')
			if (botonCsac){
				botonCsac.click()
				clearInterval(espera)
			}
		},100)
	}
}

const STORAGE_KEY = "map_layers_state";

function saveState() {
  const state = {};

  document.querySelectorAll("[data-layer]").forEach(input => {
    state[input.dataset.layer] = input.checked;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function applyInitialState(layers) {
  const state = loadState();

  document.querySelectorAll("[data-layer]").forEach(input => {
    const id = input.dataset.layer;

    if (state[id]) {
      input.checked = true;
      toggleLayerGroup(layers[id], true);
    }

    updateGroupState(input);
  });
}

const sidebar = document.getElementById("sidebar");
const btn = document.getElementById("toggleSidebar");

btn.addEventListener("click", () => {
	sidebar.classList.toggle("open");
	btn.innerHTML = sidebar.classList.contains("open") ? "✖" : `<i class="bi bi-layers"></i>`;
	btn.classList.toggle("open");
	// mover controles del mapa
	document.body.classList.toggle("sidebar-open");
});

var legends;
var legend;
async function initMap() {
	await cargarCapasGeoserver();
	const urlParams = new URLSearchParams(window.location.search);
	const layerParam = urlParams.get('capa');
	const escParam = urlParams.get('escuela');
	const config = await generarTodosLayers(layerParam, escParam);
	
	renderSidebarDesdeConfig(config);

	const layers = buildLayersRegistry(config);

	initSidebarEvents(layers);

	applyInitialState(layers);
}

//agrega apartado consultas
function ensureConsultaGroup() {

  let group = document.querySelector(
    '.grupo[data-group="consulta"]'
  );

  if (group) return group;

  const container = document.getElementById("capas");

  const div = document.createElement("div");

  div.className = "grupo";
  div.dataset.group = "consulta";

  div.innerHTML = `
    <h4 class="group-header">
      <span class="toggle-icon">▸</span>
      🔍 Consultas
    </h4>

    <div class="group-content"></div>
  `;

  container.appendChild(div);

  // evento colapsable
  div.querySelector(".group-header")
    .addEventListener("click", () => {
      div.classList.toggle("collapsed");
    });

  return div;
}

//añadir capa de consulta al sidebar
function addConsultaLayer(config) {

  const group = ensureConsultaGroup();

  const content = group.querySelector(".group-content");

  const layerId = generarId(config.label);

  // evitar duplicados
  if (document.querySelector(`[data-layer="${layerId}"]`)) {
    return;
  }

  // registry
  layersRegistry[layerId] = {
    label: config.label,
    layers: config.layers,
    tipo: "consulta",
    active: true
  };

  // item html
  const label = document.createElement("label");

  label.innerHTML = `
    <input type="checkbox"
           data-layer="${layerId}"
           checked>
    ${config.label}
	<span class="borrar-consulta-btn" data-info="${config.label}">❌</span>
  `;

  content.appendChild(label);
  content.appendChild(document.createElement("br"));

  // evento
  label.querySelector("input")
    .addEventListener("change", (e) => {

      toggleLayerGroup(
        config.layers,
        e.target.checked
      );

      saveState();
    });

  borrarBtns = document.querySelectorAll(".borrar-consulta-btn");
  borrarBtns.forEach(btn => {
	btn.addEventListener("click", (e) => {
	  const layerId = e.target.previousElementSibling.dataset.layer;
	  const layerConfig = layersRegistry[layerId];
	  eliminarLayer(layerConfig.label);
	});
  });
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
	const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

	if (!isiOS) {
		L.control.fullscreen({
		position: 'topleft',
		title: 'Pantalla Completa',
		titleCancel: 'Salir de Pantalla Completa'
		}).addTo(mymap);
	}
	
  }


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
            	text: `<div style="height: 98%; width: 111%; border: 8px solid transparent; border-image: linear-gradient(100deg, #fcc419 , #f59f00 , #e8590c, #4d7ad4, #3a55a5) 1; z-index:2;">
							<div style="background-color: white; padding:1px">
								<div style="display:inline-block;">
									<img class='m-3 mb-0' src='icons/ministerio_educacion.png' style='padding-left: 50%; padding-top: 8px; max-height: 35px; height: auto;'>
								</div>
							</div>
						</div>`,
            	size: "20mm",
            	overTheMap: true,
            },
            footer: {
                enabled: true,
                text: "<span><h6 class='fst-italic mt-1'>Mapa Educativo Interactivo de la Provincia del Chubut</h6></span>",
            	size: "8mm",
                overTheMap: false,
            }
    	}),
        L.BrowserPrint.Mode.Landscape(
        	'A4', {
        	margin: {left: 0, right: 0, top: 0, bottom: 0}, 
        	title: 'Horizontal',
        	header: {
            	enabled: true,
            	text: `<div style="height: 98%; border: 8px solid transparent; border-image: linear-gradient(100deg, #fcc419 , #f59f00 , #e8590c, #4d7ad4, #3a55a5) 1;">
							<div style="background-color: white;">
								<img class='m-3 mb-0' src='icons/ministerio_educacion.png' style='padding-left: 65%; padding-top: 8px; max-height: 35px; height: auto; display:inline;'>
							</div>
						</div>`,
            	size: "20mm",
            	overTheMap: true,
            },
            footer: {
                enabled: true,
                text: "<span><h6 class='fst-italic mt-1'>Mapa Educativo Interactivo de la Provincia del Chubut</h6></span>",
            	size: "8mm",
                overTheMap: false,
            }
    	}),
        L.BrowserPrint.Mode.Personalizado(
        	'A4', {
        	margin: {left: 0, right: 0, top: 0, bottom: 0}, 
        	title: "Seleccionar Área",
        	header: {
            	enabled: true,
            	text: `<div style="height: 99%; border: 8px solid transparent; border-image: linear-gradient(100deg, #fcc419 , #f59f00 , #e8590c, #4d7ad4, #3a55a5) 1;">
							<div style="background-color: white;">
								<img class='m-3 mb-0' src='icons/ministerio_educacion.png' style='padding-left: 65%; padding-top: 8px; max-height: 60px; height: auto; display:inline;'>
							</div>
						</div>`,
            	size: "20mm",
            	overTheMap: true,
            },
            footer: {
                enabled: true,
                text: "<span><h6 class='fst-italic mt-1'>Mapa Educativo Interactivo de la Provincia del Chubut</h6></span>",
            	size: "8mm",
                overTheMap: false,
            }
        })
    ]
}, browserPrint);

//añade impresion del mapa completo
function addFullmapPrint(){
	let print = document.getElementsByClassName('leaflet-control-browser-print')[0]
	print.style.display = 'block';
	print.style.background = '#919187';
		let ul = document.createElement('UL')
		ul.classList = 'browser-print-holder'
		let li = document.createElement('LI')
		li.classList = 'browser-print-mode'
		li.style.display = 'none'
		let a = document.createElement('A')
		a.textContent = 'Descargar Mapa de Establecimientos'
		a.classList = 'descarga'
		a.setAttribute('download','EstablecimientosEducativosChubut.pdf')
		a.setAttribute('href', 'public/pdf/MapaEstablecimientosEducativosChubut.pdf')
		li.append(a)
		ul.append(li)


		print.append(ul)

		print.addEventListener('mouseover', () =>{
			li.style.display = 'block'
		})

		print.addEventListener('mouseout', () =>{
			li.style.display = 'none'
		})
}

//añade impresion de la guia de cartografia participatica
function addGuideCartoPrint(){
	let print = document.getElementsByClassName('leaflet-control-browser-print')[0]

		let ul = document.createElement('UL')
		ul.classList = 'browser-print-holder'
		let li = document.createElement('LI')
		li.classList = 'browser-print-mode'
		li.style.display = 'none'
		let a = document.createElement('A')
		a.style.display = 'block'
		a.textContent = 'Descargar Manual Taller Cartografia'
		a.classList = 'descarga'
		a.setAttribute('download','Taller de Cartografia Participativa.pdf')
		a.setAttribute('href', 'public/pdf/tallerCartoParticipativa.pdf')
		li.append(a)
		ul.append(li)


		print.append(ul)

		print.addEventListener('mouseover', () =>{
			li.style.display = 'block'
		})

		print.addEventListener('mouseout', () =>{
			li.style.display = 'none'
		})
}

//añade impresion de la guia de cartografia participativa digital
function addGuideCartoDigitalPrint(){
	let print = document.getElementsByClassName('leaflet-control-browser-print')[0]

		let ul = document.createElement('UL')
		ul.classList = 'browser-print-holder'
		let li = document.createElement('LI')
		li.classList = 'browser-print-mode'
		li.style.display = 'none'
		let a = document.createElement('A')
		a.textContent = 'Descargar Manual Taller Cartografia Digital'
		a.classList = 'descarga'
		a.setAttribute('download','Taller de Cartografia Participativa.pdf')
		a.setAttribute('href', 'public/pdf/tallerCartoParticipativaDigital.pdf')
		li.append(a)
		ul.append(li)


		print.append(ul)

		print.addEventListener('mouseover', () =>{
			li.style.display = 'block'
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
			li.style.display = 'block'
		})

		print.addEventListener('mouseout', () =>{
			li.style.display = 'none'
		})
}

var downloadButton = L.easyButton({
	id:'idDownloadButton',
	states: [{
		stateName: 'dl-down',
		icon: "<img class='icon' src='icons/downloadButton.svg' style='widht:15px; height:15px;'>",
		tittle: 'Descargas'
	}]
})

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
		mostrarFiltroButton.addTo(mymap);
		mostrarConsultaButton.addTo(mymap);
		controlbrowserPrint.addTo(mymap);
		addFullmapPrint();
		addGuideCartoPrint();
		addGuideCartoDigitalPrint();
		//downloadButton.addTo(mymap);
		addGuidePrint();		
}

async function obtenerCapasGeoserver() {
    await Promise.allSettled([
        getGeoserverDatastoreLayers('sigeducativo','temáticos'),
        getGeoserverDatastoreLayers('sigeducativo','otros')
    ]);
	
}

async function iniciarMapa() {
    // 1. crear mapa primero
	await initMap();
	
    // 2. ocultar loader YA
    hideLoadingScreen();

    // 3. botones
    cargarBotonesMapa();

    // 5. otros accesos
    otrosAccesosCapas();
}



// existe layer

function layerNoExiste(layerId) {
  return !layersRegistry[layerId];
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
	//downloadButton.addTo(mymap);
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
							var marker = L.marker(latlng, {
								icon: L.icon({
									iconUrl: "icons/establecimientos_consulta.svg",
									iconSize:     [22, 22], 
									iconAnchor:   [11, 0], 
									popupAnchor:  [0, 0]
								}),
								riseOnHover: true
							});
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

							return marker
						},		
					onEachFeature: onEachFeatureS
			}));
			instSelected.forEach(marker => {
				baselayer.addLayer(marker)
			})
			addConsultaLayer({
				label: name,
				layers: instSelected
			});
		} else if (!layerNoExiste(name)){
			legend.options.legends.forEach(capa => {
				if (capa.label == name) {
					capa.layers.push(L.geoJSON(data, {
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
								return marker
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
								iconSize: L.point(22, 22) // Tamaño del ícono
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
					addConsultaLayer({
						label: name,
						layers: cluster
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
//buscar por ubicaciones en el buscador
function buscarPorUbicacion(){
    var localidad = document.getElementById("buscadorlocalidad").value.length > 0 ? document.getElementById("buscadorlocalidad").value:null;
    var departamento = document.getElementById("buscadordepartamento").value.length > 0 ? document.getElementById("buscadordepartamento").value: null;
    var region = document.getElementById("buscadorregion").value.length > 0 ? document.getElementById("buscadorregion").value: null;
	var domicilio = document.getElementById("buscadordomicilio").value.length > 0 ? document.getElementById("buscadordomicilio").value: null;
	var cluster = createCluster("establecimientos", "consulta");
    fetch(`mapa/localizar?localidad=${localidad}&departamento=${departamento}&region=${region}&domicilio=${domicilio}`)
    .then(response => response.json())
    .then((escuelas) => {
		var geoLayer = L.geoJSON(escuelas, {
		pointToLayer: function (feature, latlng) {
				var marker = L.marker(latlng, {
					icon: L.icon({
						iconUrl: "icons/establecimientos_consulta.svg",
						iconSize:     [22, 22], 
						iconAnchor:   [11, 0], 
						popupAnchor:  [0, 0] 
					}),
					riseOnHover: true
				})
				cluster.addLayer(marker);
				return marker;			
		},
		onEachFeature: onEachFeatureS
		});
		addConsultaLayer({
			label: "Búsqueda por localización",
			layers: cluster
		});
		cluster.addTo(mymap);
		return geoLayer;
	})		
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

//eliminar capas consultas
function eliminarLayer(layerName) {

  const layerId = generarId(layerName);

  // 🔹 obtener layer del registry
  const layerData = layersRegistry[layerId];

  if (!layerData) return;

  // 🔹 quitar del mapa
  toggleLayerGroup(layerData.layers, false);

  // 🔹 eliminar del DOM
  const checkbox = document.querySelector(
    `[data-layer="${layerId}"]`
  );

  if (checkbox) {

    const label = checkbox.closest("label");

    // eliminar <br> siguiente
    if (label.nextSibling?.tagName === "BR") {
      label.nextSibling.remove();
    }

    label.remove();
  }

  // 🔹 eliminar del registry
  delete layersRegistry[layerId];

  removeConsultaGroupIfEmpty()
}

// actualiza legends desde legend
function actualizarLegends(label, inactive){
    for (i=0; i < legends.length; i++) {
        if(legends[i].label == label ){
            legends[i].inactive = inactive;
        }
    }
}

//limpia el apartado de consultas si no tiene capas
function removeConsultaGroupIfEmpty() {

  const group = document.querySelector(
    '.grupo[data-group="consulta"]'
  );

  if (!group) return;

  const content = group.querySelector(".group-content");

  const hasLayers = content.querySelector("label");

  if (!hasLayers) {
    group.remove();
  }
}


// descripcion sobre las capas
function getLayerInfo(namelayer) {
  switch (namelayer) {
    case "Supervision Inicial":
      return "Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos del nivel inicial";
    case "Supervisión Primaria":
      return "Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos del nivel primario";
	case "Supervisión Secundaria":
		return "Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos del nivel secundario."; 
    case "Supervisión Privada":
	  return "Se encargan de ejercer en primer término y en forma directa el control y supervisión de los aspectos que hacen a la parte operativa de servicios administrativa y financiera de los establecimientos educativos de gestión privada.";
	case "Domiciliaria/Hospitalaria":
		return "Es la modalidad del sistema educativo en los niveles de Educación Inicial, Primaria y Secundaria, destinada a garantizar el derecho a la educación de los/ as estudiantes que, por razones de salud, se ven imposibilitados/as de asistir con regularidad a una institución educativa en los niveles de la educación obligatoria, por períodos de quince (15) días corridos o más.";
	case "Especial":
		return "Es la modalidad del Sistema Educativo destinada a asegurar el derecho a la educación de las personas con discapacidades, temporales o permanentes, en todos los niveles y modalidades del Sistema Educativo.";
	case "Inicial":
		return "La educación inicial constituye una unidad pedagógica que brinda educación a los/as niños/as desde los cuarenta y cinco (45) días hasta los cinco (5) años de edad inclusive, siendo obligatoria la sala de cinco (5) años.";
	case "Primaria":
		return "La educación primaria es obligatoria y constituye una unidad pedagógica que tiene por finalidad brindar una enseñanza común, integral y básica que asegure a los/as niños/as las condiciones para el acceso, tránsito, permanencia y egreso del nivel. Tiene una duración de seis (6) años, organizada en dos ciclos de tres (3) años cada uno.";	
	case "secundaria":
		return "La educación secundaria es obligatoria, constituye una unidad pedagógica y organizativa destinada a los/as adolescentes, jóvenes y adultos que hayan cumplido con el nivel de educación primaria.";	
	case "Superior no universitaria":
		return "Está constituida por los Institutos de Educación Superior, sean éstos de formación docente, humanística, social, técnico-profesional o artística y por instituciones nacionales y provinciales de educación no universitaria.";	
	case "EPJA":
		return "Es la modalidad educativa destinada a garantizar la alfabetización y el cumplimiento de la obligatoriedad escolar, a quienes no la hayan completado en la edad establecida reglamentariamente, y a brindar posibilidades de educación a lo largo de toda la vida.";
	case "ETP":
		return "Es la modalidad de la Educación Secundaria y la Educación Superior, responsable de la formación de Técnicos Medios y Técnicos Superiores, en áreas ocupacionales específicas y de la formación profesional, introduciendo a los/as estudiantes, jóvenes y adultos, en un recorrido de profesionalización a partir del acceso a una base de conocimientos y de habilidades profesionales que les permita su inserción en áreas ocupacionales cuya complejidad exige haber adquirido una formación general, una cultura científico tecnológica de base a la par de una formación técnica específica de carácter profesional, así como continuar aprendiendo durante toda su vida.";
	case "Artística":
		return "Es una modalidad presente en todos los niveles de la educación obligatoria (Inicial, Primaria y Secundaria), y también como formación específica en instituciones destinadas a niñas, niños, adolescentes, jóvenes y adultos. Promueve el arte como derecho y campo de conocimiento, contribuyendo a la formación ciudadana, laboral y cultural."
	case "Contexto de Encierro":
		return "Es una modalidad destinada a garantizar el derecho a la educación de personas privadas de libertad, promoviendo su formación integral y desarrollo pleno. Abarca instituciones como cárceles, centros socioeducativos para jóvenes infractores y centros de tratamiento de adicciones. Su objetivo es asegurar la escolaridad obligatoria, ofrecer formación técnica y superior, facilitar la educación a distancia, promover actividades culturales y deportivas, e impulsar la inclusión social mediante el acceso a la educación y la vida cultural."	
	case "Rural":
		return "Todas los establecimientos educativos ubicados en el amanzanado de una localidad censal de menos de 2000 habitantes y/o las que se ubican en campo abierto"
	case "EIB":
		return "Es una modalidad presente en los niveles Inicial, Primario y Secundario que garantiza el derecho de los pueblos indígenas a recibir una educación que preserve y fortalezca su cultura, lengua, cosmovisión e identidad. Busca incorporar progresivamente esta modalidad en las políticas curriculares. Promueve la participación indígena en la gestión educativa, el desarrollo de materiales pertinentes, el fortalecimiento de trayectorias escolares, el aprendizaje de la lengua indígena y del español, y la inclusión de contenidos culturales indígenas en los currículos nacionales y provinciales."	
	case "CFP":
		return "Es un establecimiento educativo destinado específicamente a la formación y perfeccionamiento laboral, desarrolla sus actividades respondiendo a las necesidades socio-económicas y los requerimientos del mercado laboral de su zona de influencia."	
	case "Regiones Educativas":
		return "Definida por decisión de una autoridad en relación con la conducción, planeamiento y administración de la política educativa. Delimita unidades espaciales de acuerdo con un programa de acción. La provincia cuenta con seis regiones educativas."	
	case "Departamentos":
		return "División territorial administrativa de la Provincia. Chubut está dividida por 15 departamentos"
	case "Urbano":
		return "Todas los establecimientos educativos ubicados en localidades censales de 2000 habitantes y más y/o todas las escuelas ubicadas en localidades censales de menos de 2000 habitantes pero que, según el INDEC, se encuentran “comprendidas” dentro de otra localidad censal de más de 2000 habitantes."
	case "Rural-aglomerado":
		return "Escuelas en ámbito rural aglomerado: todas las escuelas que se ubican en el amanzanado de una localidad censal de menos de 2000 habitantes."	
	case "Rural-disperso":
		return "Escuelas en ámbito rural disperso: todas las escuelas que se ubican en campo abierto."
	case "Sedes":
		return "localización donde cumplen sus funciones la máxima autoridad pedagógica administrativa del establecimiento. "
	case "Anexos":
		return "Es la localización donde funciona una sección o grupo de secciones que dependen pedagógica y administrativamente de una localización sede y funciona en otro lugar geográfico."
	case "Carto Participativa":
		return "alleres destinados a estudiantes y docentes con el objetivo de relevar información geográfica, desde distintas perspectivas y realidades que habitan los jóvenes estudiantes en la provincia y visibilizar la construcción de la información colectiva dentro del mapa interactivo."	
	case "temáticos":
		return "capas en las que se visualizan temáticas específicas"
	case "Oficinas Externas":
		return "Oficinas dependientes del Ministerio de Educación que no estan ubicadas geográficamente en la sede."
	case "Nivel":
		return "Son los tramos en que se estructura el sistema educativo. Se corresponden con las necesidades individuales de las etapas del proceso psico-físico-evolutivo articulado con el desarrollo psico-físico-social y cultural. Supone articulación, coordinación y la definición de objetivos educacionales comunes sean cuales fueren los elementos, condiciones y operaciones que lo componen. Los niveles son: Inicial, Primario, Secundario y  Superior."
	case "Modalidad":
		return "Son Modalidades del Sistema Educativo aquellos enfoques educativos, organizativos y/o curriculares, constitutivos o complementarios de la Educación Común, de carácter permanente o temporal, que dan respuesta a requerimientos específicos de formación articulando con cada Nivel, con el propósito de garantizar los derechos educativos de igualdad, inclusión, calidad y justicia social de todos los niños, jóvenes, adolescentes, adultos y adultos mayores de la Provincia."
		default:
      return "No está la info de la capa.";
  }
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
		if (namelayer.split(' ')[0] == 'Supervisíon') {
			localizaciones.push(await getSupervisionLayers())
		} else {
			localizaciones.push(await getEstablecimientosLayers())
		}
		localizaciones.forEach(establecimientos => {
			establecimientos.forEach(data => {
					var temp = data[0][0]._needsClustering;
					temp.forEach(data =>{
						delete data.feature.properties.id
						delete data.feature.properties.area
					})
			})
			establecimientos.forEach(data => {
				if (data[1][0].label == namelayer || ( 'Supervisíon ' + data[1][0].label) == namelayer){
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

//comportamiento del input "Matricula" del modal filtro
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

function convertirARomano(numero){
	if (numero <= 0 || numero >= 4000){
		return "numero fuera de rango"
	}
	const valores = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
	const simbolos = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I']
	let romano = '';
	for (let i = 0; i<valores.length; i++) {
		while (numero >= valores[i]) {
			romano += simbolos[i];
			numero -= valores[i];
		}
	}
	return romano;
}

function esCero(int){
	if (int === '0') {
		return true
	} else{
		return false
	}
}


function formatoCadena_(cadena){
	var nuevaCadena = cadena.replace(/_/g, ' ')
	if (nuevaCadena.length === 0) return nuevaCadena
	return nuevaCadena.charAt(0).toUpperCase() + nuevaCadena.slice(1)
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
		column.textContent = formatoCadena_(col);
		column.setAttribute("style","font-weight: bold;")
		cabecera.appendChild(column);
	});
	tbody.appendChild(cabecera);
	var rowName = 0;
	data.forEach(row => {
		const tr = document.createElement('tr');
		Object.values(row).forEach(cell => {
			const td = document.createElement('td');
			td.classList.add('tdFiltro')
			td.textContent = cell;
			if (rowName == 0) {
				var romano = cell.split(' ');
				romano = convertirARomano(romano)
				td.textContent = romano;
				td.setAttribute("style","font-weight:bold");
				rowName +=1;
			}
			tr.appendChild(td);

		});
		tbody.appendChild(tr);
		rowName = 0;
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
			var labels = Object.keys(datosFiltrados[0]);
			labels.splice(0,1);
			let idGrafico;
			let reg = 0;
			datosFiltrados.forEach(grafico => {
				let p = 0;
				grafico = Object.values(grafico);
				idGrafico = grafico[0];
				grafico.splice(0,1)
				var valores = [];
				grafico.forEach(data =>{
					let temp = []
					temp.push(labels[p])
					temp.push(parseInt(data))
					valores.push(temp)
					p += 1
				})
				p=0;
				graficosGenerados.push(createPieChart(valores, idGrafico, posRegiones[reg]))
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
//Funcion para mostrat los graficos generados
var dashboard = document.getElementById("dashboard")
var mostrarGraficos = document.getElementById("mostrarGraficosBoton");
mostrarGraficos.addEventListener('click', function(e) {
	graficosGenerados.forEach(grafico =>{
		dashboard.innerHTML += grafico.display
	})
	graficosGenerados.forEach(grafico => {		
		Highcharts.chart(grafico.regnum,{
			chart: {
				styledMode: false
			},
			title: {text:grafico.regnum},
			series: [{
				type: 'pie',
				allowPointSelect: true,
				keys: ['name', 'y'],
				data: grafico.data.values
			}],
			showInLegend: true,
		})
		//Plotly.newPlot(grafico.htmlElement, grafico.data, grafico.layout)
		
	})
	document.getElementById("tablaInfoFiltro").innerHTML = ' '	
})
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
function createPieChart(values, htmlElement){
	var regnum = convertirARomano(htmlElement)
	var data = {
		values: values
	};
	
	
	var display =`<div class="data-chart-${regnum}" id='${regnum}' style="width: 300px; display:inline-block;"></div>`

	var div = {
		regnum,
		data,
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

iniciarMapa();
