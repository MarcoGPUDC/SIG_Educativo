// =========================
// 🗺️ MAPA BASE
// =========================
var osmUrl ='https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
var osmAttrib ='Map data © OpenStreetMap contributors';

var map = L.map('map', {
  markerZoomAnimation: false,
  pmIgnore: false
}).setView([-44.0, -68.41215], 7);

map.pm.addControls();

map.pm.setGlobalOptions({
  markerStyle: {
    opacity: 0 // hace invisible el default
  }
});

L.tileLayer(osmUrl, {
  minZoom: 6,
  maxZoom: 19,
  opacity: 1,
  attribution: osmAttrib
}).addTo(map);

// 🔥 autosave SIEMPRE activo
map.on('pm:create pm:edit pm:remove', () => {
  saveLayersLocal(map);
});

// =========================
// ✏️ DIBUJO DE MARKERS
// =========================
map.on('pm:create', (e) => {
  if (e.shape === 'Marker') {
    const latlng = e.layer.getLatLng();

    map.removeLayer(e.layer); // eliminar default
    iconSelector(latlng);
  }
});

// =========================
// 🎛️ MODAL DE ICONOS
// =========================
function iconSelector(latlng) {
  document.getElementById('draw-modal').style.display = 'block';

  fetch('./categorias')
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById('select-categoria-carto');
      select.innerHTML = "";

      data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.icon;
        option.textContent = item.categoria;
        select.appendChild(option);
      });
    });

  const modal = document.getElementById('draw-modal');
  modal.dataset.lat = latlng.lat;
  modal.dataset.lng = latlng.lng;
}

var marcadores = [];

// =========================
// ➕ CREAR MARKER
// =========================
document.getElementById('save-drawing').addEventListener('click', () => {

  const imgData = document.getElementById('select-categoria-carto').value;

  const lat = parseFloat(document.getElementById('draw-modal').dataset.lat);
  const lng = parseFloat(document.getElementById('draw-modal').dataset.lng);

  const iconUrl = `../modules/mapa/icons/${imgData}`;

  const icon = L.icon({
    iconUrl: iconUrl,
    iconSize: [20],
    iconAnchor: [10, 10],
    className: 'custom-icon'
  });

  const marker = L.marker([lat, lng], { icon });

  // 🧠 metadata CLAVE
  marker.feature = {
    type: "Feature",
    properties: {
      tipo: "marcador",
      categoria: imgData,
      iconUrl: iconUrl
    }
  };

  marker.bindPopup(`Categoría: ${imgData}`);

  marker.addTo(map);
  marcadores.push(marker);

  saveLayersLocal(map);

  document.getElementById('draw-modal').style.display = 'none';
});

// =========================
// 🧠 NORMALIZADOR
// =========================
function normalizarIconUrl(url) {
  if (!url) return null;
  let clean = url.split('?')[0];
  const a = document.createElement('a');
  a.href = clean;
  return a.href;
}

// =========================
// 📦 EXPORTAR ZIP
// =========================
document.getElementById('exportarCapaDibujo').addEventListener('click', async () => {

  const zip = new JSZip();
  const features = [];

  const iconMap = new Map();
  let iconIndex = 1;

  const promises = [];

  map.eachLayer(layer => {
    if (
      layer instanceof L.Marker &&
      layer.options.icon?.options?.iconUrl?.includes('marker-icon.png')
    ) {
      return;
    }
    promises.push(procesarLayer(layer));
  });

  await Promise.all(promises);

  const geojsonFinal = {
    type: 'FeatureCollection',
    features
  };

  zip.file('capa_completa.geojson', JSON.stringify(geojsonFinal, null, 2));

  const blob = await zip.generateAsync({ type: 'blob' });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'capa_sig.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);

  // =========================
  async function procesarLayer(layer) {
      if (layer.options.icon?.options?.iconUrl?.includes('marker-icon.png')) return;

      // 🚫 ignorar capas sin geometría válida
      if (typeof layer.toGeoJSON !== 'function') return;

      let geojson;
      try {
        geojson = layer.toGeoJSON();
      } catch (e) {
        console.warn("Layer inválido:", layer);
        return;
      }

      if (!geojson || !geojson.geometry) return;

      // 📍 MARKERS
      if (geojson.geometry.type === 'Point') {

        const iconOptions = layer.options.icon?.options || {};
        const iconUrl = iconOptions.iconUrl;

        const categoria = layer.feature?.properties?.categoria;
        const iconKey = categoria || normalizarIconUrl(iconUrl);

        let iconName = null;

        if (iconUrl) {

          if (iconMap.has(iconKey)) {
            iconName = iconMap.get(iconKey);
          } else {

            iconName = `icono_${iconIndex++}.png`;
            iconMap.set(iconKey, iconName);

            try {
              let arrayBuffer;

              if (iconUrl.startsWith('data:image')) {
                const base64Data = iconUrl.split(',')[1];
                const binary = atob(base64Data);
                const array = new Uint8Array(binary.length);

                for (let i = 0; i < binary.length; i++) {
                  array[i] = binary.charCodeAt(i);
                }

                arrayBuffer = array;

              } else {
                const response = await fetch(iconUrl);
                const blob = await response.blob();
                arrayBuffer = await blob.arrayBuffer();
              }

              zip.file(iconName, arrayBuffer);

            } catch (err) {
              console.error("Error icono:", iconUrl);
            }
          }
        }

        features.push({
          type: 'Feature',
          geometry: geojson.geometry,
          properties: {
            tipo: 'marcador',
            icon: iconName,
            categoria: categoria,
            popup: layer.getPopup()?.getContent() || null
          }
        });
    }

    // 🔷 POLÍGONOS / LÍNEAS
    else {
      features.push({
        type: 'Feature',
        geometry: geojson.geometry,
        properties: {
          tipo: geojson.geometry.type,
          style: {
            color: layer.options.color || null,
            weight: layer.options.weight || null,
            fillColor: layer.options.fillColor || null,
            fillOpacity: layer.options.fillOpacity || null
          },
          popup: layer.getPopup()?.getContent() || null
        }
      });
    }
  }
});

// =========================
// ❌ CERRAR MODAL
// =========================
document.getElementById('close-drawing').addEventListener('click', () => {
  document.getElementById('draw-modal').style.display = 'none';
});

// =========================
// 💾 GUARDAR LOCAL
// =========================
function saveLayersLocal(map) {

  const features = [];

  
  map.eachLayer(layer => {

  // 🚫 ignorar lo que no es capa editable real
  if (!layer.pm) return;

  // 🚫 ignorar marker default
  if (
    layer instanceof L.Marker &&
    layer.options.icon?.options?.iconUrl?.includes('marker-icon.png')
  ) return;

  // 🚫 ignorar capas sin geometría válida
  if (typeof layer.toGeoJSON !== 'function') return;

  let geojson;
  try {
    geojson = layer.toGeoJSON();
  } catch (e) {
    console.warn("Layer inválido:", layer);
    return;
  }

  if (!geojson || !geojson.geometry) return;

  const props = {};

  // 📍 Marker
  if (geojson.geometry.type === 'Point') {

      const iconOptions = layer.options.icon?.options || {};

      props.tipo = 'marcador';
      props.icon = iconOptions.iconUrl || null;
      props.categoria = layer.feature?.properties?.categoria || null;

    } else {

      props.tipo = geojson.geometry.type;
      props.style = {
        color: layer.options.color || null,
        weight: layer.options.weight || null,
        fillColor: layer.options.fillColor || null,
        fillOpacity: layer.options.fillOpacity || null
      };
    }

    props.popup = layer.getPopup()?.getContent() || null;

    features.push({
      type: 'Feature',
      geometry: geojson.geometry,
      properties: props
    });
  });

  localStorage.setItem('miSIG', JSON.stringify({
    expires: Date.now() + 4 * 60 * 60 * 1000,
    geojson: {
      type: 'FeatureCollection',
      features
    }
  }));
}

// =========================
// 🔄 RESTAURAR
// =========================
window.addEventListener('load', () => {

  const raw = localStorage.getItem('miSIG');
  if (!raw) return;

  const { expires, geojson } = JSON.parse(raw);

  if (Date.now() > expires) {
    localStorage.removeItem('miSIG');
    return;
  }

  L.geoJSON(geojson, {

    pointToLayer: (feature, latlng) => {

      const p = feature.properties;

      if (!p.icon) return null; // 🚫 evita marker fantasma

      const icon = L.icon({
        iconUrl: p.icon,
        iconSize: [20],
        iconAnchor: [10, 10],
        className: 'custom-icon'
      });

      const marker = L.marker(latlng, { icon });

      // 🧠 restaurar metadata
      marker.feature = {
        type: "Feature",
        properties: p
      };

      if (p.popup) marker.bindPopup(p.popup);

      marcadores.push(marker);

      return marker;
    },

    style: (feature) => {
      return feature.properties.style || {};
    },

    onEachFeature: (feature, layer) => {

      const p = feature.properties;

      if (p.popup && feature.geometry.type !== 'Point') {
        layer.bindPopup(p.popup);
      }

      if (layer.pm) {
        layer.pm.enable();
      }
    }

  }).addTo(map);
});