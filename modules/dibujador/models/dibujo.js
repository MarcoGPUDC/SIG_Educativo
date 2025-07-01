
var osmUrl ='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var osmAttrib ='Map data &copy;  <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a> contributors';
var mymap = L.map('map').setView([-44.0,-68.41215], 7);

L.tileLayer(osmUrl, {minZoom: 6, maxZoom: 19, attribution: osmAttrib}).addTo(mymap);

mymap.on('dblclick', (e) => {
    openDrawingModal(e.latlng);
  });


var canvas = null;
function openDrawingModal(latlng) {
  document.getElementById('draw-modal').style.display = 'block';

  const modal = document.getElementById('draw-modal');
  modal.dataset.lat = latlng.lat;
  modal.dataset.lng = latlng.lng;

  // ⚠️ destruí el canvas anterior si existe
  if (canvas != null) {
    canvas.dispose();
  }

  // ✅ creá nuevo canvas y guardalo
  const $ = (id) => document.getElementById(id);

  canvas = new fabric.Canvas('draw-canvas', {
    isDrawingMode: true,
  });

  canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
  

  fabric.Object.prototype.transparentCorners = false;

  var drawingModeEl = $('drawing-mode'),
    drawingOptionsEl = $('drawing-mode-options'),
    drawingColorEl = $('drawing-color'),
    drawingShadowColorEl = $('drawing-shadow-color'),
    drawingLineWidthEl = $('drawing-line-width'),
    drawingShadowWidth = $('drawing-shadow-width'),
    drawingShadowOffset = $('drawing-shadow-offset'),
    clearEl = $('clear-canvas');
  clearEl.onclick = function () {
    canvas.clear();
  };

  drawingModeEl.onclick = function () {
    canvas.isDrawingMode = !canvas.isDrawingMode;
    if (canvas.isDrawingMode) {
      drawingModeEl.innerHTML = 'Cancel drawing mode';
    } else {
      drawingModeEl.innerHTML = 'Enter drawing mode';
    }
  };

  /*if (fabric.PatternBrush) {
    var vLinePatternBrush = new fabric.PatternBrush(canvas);
    vLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var hLinePatternBrush = new fabric.PatternBrush(canvas);
    hLinePatternBrush.getPatternSrc = function () {
      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = 10;
      var ctx = patternCanvas.getContext('2d');

      ctx.strokeStyle = this.color;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(5, 0);
      ctx.lineTo(5, 10);
      ctx.closePath();
      ctx.stroke();

      return patternCanvas;
    };

    var squarePatternBrush = new fabric.PatternBrush(canvas);
    squarePatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 2;

      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
      var ctx = patternCanvas.getContext('2d');

      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, squareWidth, squareWidth);

      return patternCanvas;
    };

    var diamondPatternBrush = new fabric.PatternBrush(canvas);
    diamondPatternBrush.getPatternSrc = function () {
      var squareWidth = 10,
        squareDistance = 5;
      var patternCanvas = fabric.getEnv().document.createElement('canvas');
      var rect = new fabric.Rect({
        width: squareWidth,
        height: squareWidth,
        angle: 45,
        fill: this.color,
      });

      var canvasWidth = rect.getBoundingRect().width;

      patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
      rect.set({
        left: canvasWidth / 2,
        top: canvasWidth / 2,
      });

      var ctx = patternCanvas.getContext('2d');
      rect.render(ctx);

      return patternCanvas;
    };

    var img = new Image();
    img.src = 'public/img/patronesDibujo/ladybug.png';

    var texturePatternBrush = new fabric.PatternBrush(canvas);
    texturePatternBrush.source = img;
  }*/

  /*$('drawing-mode-selector').onchange = function () {
    const tool = this.value;
    canvas.isDrawingMode = tool === 'free';
    if (tool === 'rectangle' || tool === 'circle' || tool === 'line') {
      canvas.off('mouse:down'); // reset events
      canvas.on('mouse:down', function (o) {
        const pointer = canvas.getPointer(o.e);
        const startX = pointer.x;
        const startY = pointer.y;
        let shape;

        if (tool === 'rectangle') {
          shape = new fabric.Rect({
            left: startX,
            top: startY,
            width: 0,
            height: 0,
            fill: 'transparent',
            stroke: drawingColorEl.value,
            strokeWidth: drawingLineWidthEl.value
          });
        } else if (tool === 'circle') {
          shape = new fabric.Circle({
            left: startX,
            top: startY,
            radius: 1,
            fill: 'transparent',
            stroke: drawingColorEl.value,
            strokeWidth: drawingLineWidthEl.value
          });
        } else if (tool === 'line') {
          shape = new fabric.Line([startX, startY, startX, startY], {
            stroke: drawingColorEl.value,
            strokeWidth: drawingLineWidthEl.value
          });
        }

        canvas.add(shape);

        canvas.on('mouse:move', function resizeShape(o) {
          const pointer = canvas.getPointer(o.e);
          if (tool === 'rectangle') {
            shape.set({
              width: pointer.x - startX,
              height: pointer.y - startY
            });
          } else if (tool === 'circle') {
            shape.set({
              radius: Math.sqrt(Math.pow(pointer.x - startX, 2) + Math.pow(pointer.y - startY, 2)) / 2
            });
          } else if (tool === 'line') {
            shape.set({ x2: pointer.x, y2: pointer.y });
          }
          shape.setCoords();
          canvas.renderAll();
        });

        canvas.on('mouse:up', function stopResize() {
          canvas.off('mouse:move');
          canvas.off('mouse:up');
        });
      });
    }

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawingColorEl.value;
      canvas.freeDrawingBrush.width =
        parseInt(drawingLineWidthEl.value, 10) || 1;
      canvas.freeDrawingBrush.shadow = new fabric.Shadow({
        blur: parseInt(drawingShadowWidth.value, 10) || 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: drawingShadowColorEl.value,
      });
    }
  };*/

  drawingColorEl.onchange = function () {
    canvas.freeDrawingBrush.color = this.value;
  };
  drawingShadowColorEl.onchange = function () {
    canvas.freeDrawingBrush.shadow.color = this.value;
  };
  drawingLineWidthEl.onchange = function () {
    canvas.freeDrawingBrush.width = parseInt(this.value, 10) || 1;
    this.previousSibling.querySelector('span').innerHTML = this.value;
  };
  drawingShadowWidth.onchange = function () {
    canvas.freeDrawingBrush.shadow.blur = parseInt(this.value, 10) || 0;
    this.previousSibling.querySelector('span').innerHTML = this.value;
  };
  drawingShadowOffset.onchange = function () {
    canvas.freeDrawingBrush.shadow.offsetX = parseInt(this.value, 10) || 0;
    canvas.freeDrawingBrush.shadow.offsetY = parseInt(this.value, 10) || 0;
    this.previousSibling.querySelector('span').innerHTML = this.value;
  };

  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = drawingColorEl.value;
    canvas.freeDrawingBrush.width = parseInt(drawingLineWidthEl.value, 10) || 1;
    canvas.freeDrawingBrush.shadow = new fabric.Shadow({
      blur: parseInt(drawingShadowWidth.value, 10) || 0,
      offsetX: 0,
      offsetY: 0,
      affectStroke: true,
      color: drawingShadowColorEl.value,
    });
  }
  
}
var marcadores = [];
document.getElementById('save-drawing').addEventListener('click', () => {
    const imgData = canvas.toDataURL(); // Base64 PNG

    const lat = document.getElementById('draw-modal').dataset.lat;
    const lng = document.getElementById('draw-modal').dataset.lng;

    // Crear icono personalizado
    const icon = L.icon({
      iconUrl: imgData,
      iconSize: [150],
      className: 'custom-icon'   // para asegurar que sea interactivo
    });
    const marker = L.marker([lat, lng], { icon });

    // Agregar evento de doble clic para borrar
    marker.on('contextmenu', () => {
      if (confirm('¿Querés borrar este dibujo del mapa?')) {
        mymap.removeLayer(marker); // lo saca del mapa

        // También lo eliminamos del array de marcadores
        const index = marcadores.indexOf(marker);
        if (index > -1) {
          marcadores.splice(index, 1);
          saveMarkersLocal();
        }
      }
    });
    marcadores.push(marker)
    marcadores[marcadores.length-1].addTo(mymap);
    saveMarkersLocal();

    // Cerrar modal
    document.getElementById('draw-modal').style.display = 'none';
});


document.getElementById('exportarCapaDibujo').addEventListener('click', async () => {
  const zip = new JSZip();
  const features = [];

  for (let i = 0; i < marcadores.length; i++) {
      const marker = marcadores[i];
      const latlng = marker.getLatLng();
      const iconDataUrl = marker.options.icon.options.iconUrl;

      // Convertir base64 a binario
      const base64Data = iconDataUrl.split(',')[1];
      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let j = 0; j < binary.length; j++) {
          array[j] = binary.charCodeAt(j);
      }

      const iconName = `icono_${i + 1}.png`;

      // Agregar archivo PNG al ZIP
      zip.file(iconName, array);

      // Agregar Feature al GeoJSON
      features.push({
          type: 'Feature',
          geometry: {
              type: 'Point',
              coordinates: [latlng.lng, latlng.lat]
          },
          properties: {
              icon: iconName
          }
      });
  }

  // Crear archivo GeoJSON
  const geojson = {
      type: 'FeatureCollection',
      features: features
  };

  zip.file('marcadores_dibujo.geojson', JSON.stringify(geojson, null, 2));

  // Generar el ZIP y descargar
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'capa_dibujo.zip';
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById('close-drawing').addEventListener('click', () => {
  // Cerrar modal
  document.getElementById('draw-modal').style.display = 'none';
});

// ----- GUARDAR -----
function saveMarkersLocal() {
  // convertí tus marcadores a un array de objetos simples
  const saved = marcadores.map(m => {
    const ll = m.getLatLng();
    return {
      lat: ll.lat,
      lng: ll.lng,
      icon: m.options.icon.options.iconUrl  // base64
    };
  });
  localStorage.setItem('misIconos', JSON.stringify({
    expires: Date.now() + 4*60*60*1000, // 4 h de vida
    data: saved
  }));
}

// ----- RESTAURAR AL CARGAR LA PÁGINA -----
window.addEventListener('load', () => {
  const raw = localStorage.getItem('misIconos');
  if (!raw) return;

  const { expires, data } = JSON.parse(raw);
  if (Date.now() > expires) {           // ya caducó
    localStorage.removeItem('misIconos');
    return;
  }

  data.forEach(o => {
    const icon = L.icon({
      iconUrl: o.icon,
      iconSize: [150],
      className: 'custom-icon'   // para asegurar que sea interactivo
    });
    const marker = L.marker([o.lat, o.lng], { icon });
    // Agregar evento de doble clic para borrar
    marker.on('contextmenu', function(ev) {
      if (confirm('¿Querés borrar este dibujo del mapa?')) {
        mymap.removeLayer(marker); // lo saca del mapa

        // También lo eliminamos del array de marcadores
        const index = marcadores.indexOf(marker);
        if (index > -1) {
          marcadores.splice(index, 1);
          saveMarkersLocal();
        }
      }
    });
    marcadores.push(marker);
    marcadores[marcadores.length-1].addTo(mymap);
  });
});

