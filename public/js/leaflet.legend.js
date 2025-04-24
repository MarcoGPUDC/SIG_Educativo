(function (factory, window) {
    // define an AMD module that relies on 'leaflet'
    if (typeof define === "function" && define.amd) {
        define(["leaflet"], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === "object") {
        module.exports = factory(require("leaflet"));
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== "undefined" && window.L) {
        factory(L);
    }
})(function (L) {
    class LegendSymbol {
        constructor(control, container, legend) {
            this._control = control;
            this._container = container;
            this._legend = legend;
            this._width = this._control.options.symbolWidth;
            this._height = this._control.options.symbolHeight;
        }
    }

    class GeometricSymbol extends LegendSymbol {
        constructor(control, container, legend) {
            super(control, container, legend);

            this._canvas = this._buildCanvas();
            if (this._drawSymbol) {
                this._drawSymbol();
            }
            this._style();
        }

        _buildCanvas() {
            var canvas = L.DomUtil.create("canvas", null, this._container);
            canvas.height = this._control.options.symbolHeight;
            canvas.width = this._control.options.symbolWidth;
            return canvas;
        }

        _drawSymbol() {}

        _style() {
            var ctx = (this._ctx = this._canvas.getContext("2d"));
            if (this._legend.fill || this._legend.fillColor) {
                ctx.globalAlpha = this._legend.fillOpacity || 1;
                ctx.fillStyle = this._legend.fillColor || this._legend.color;
                ctx.fill(this._legend.fillRule || "evenodd");
            }

            if (this._legend.stroke || this._legend.color) {
                if (this._legend.dashArray) {
                    ctx.setLineDash(this._legend.dashArray || []);
                }
                ctx.globalAlpha = this._legend.opacity || 1.0;
                ctx.lineWidth = this._legend.weight || 2;
                ctx.strokeStyle = this._legend.color || "#3388ff";
                ctx.lineCap = this._legend.lineCap || "round";
                ctx.lineJoin = this._legend.lineJoin || "round";
                ctx.stroke();
            }
        }

        rescale() {}

        center() {}
    }

    class CircleSymbol extends GeometricSymbol {
        _drawSymbol() {
            var ctx = (this._ctx = this._canvas.getContext("2d"));

            var legend = this._legend;
            var linelWeight = legend.weight || 3;

            var centerX = this._control.options.symbolWidth / 2;
            var centerY = this._control.options.symbolHeight / 2;
            var maxRadius = Math.min(centerX, centerY) - linelWeight;
            var radius = maxRadius;
            if (legend.radius) {
                radius = Math.min(legend.radius, maxRadius);
            }

            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
        }
    }

    class PolylineSymbol extends GeometricSymbol {
        _drawSymbol() {
            var ctx = (this._ctx = this._canvas.getContext("2d"));

            var x1 = 0;
            var x2 = this._control.options.symbolWidth;
            var y = this._control.options.symbolHeight / 2;

            ctx.beginPath();
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
        }
    }

    class RectangleSymbol extends GeometricSymbol {
        _drawSymbol() {
            var ctx = (this._ctx = this._canvas.getContext("2d"));
            var linelWeight = this._legend.weight || 3;

            var x0 = this._control.options.symbolWidth / 2;
            var y0 = this._control.options.symbolHeight / 2;

            var rx = x0 - linelWeight;
            var ry = y0 - linelWeight;
            if (rx == ry) {
                ry = ry / 2;
            }
            ctx.rect(x0 - rx, y0 - ry, rx * 2, ry * 2);
        }
    }

    /**
     * 圆心坐标：(x0,y0) 半径：r 角度(X轴顺时针旋转)：a
     * 弧度 = 角度 * Math.PI / 180
     * 则圆上任一点为：（x1,y1）
     * x1   =   x0   +   r   *   Math.cos( a  * Math.PI / 180)
     * y1   =   y0   +   r   *   Math.sin( a  * Math.PI / 180)
     */
    class PolygonSymbol extends GeometricSymbol {
        _drawSymbol() {
            var ctx = (this._ctx = this._canvas.getContext("2d"));

            var linelWeight = this._legend.weight || 3;
            var x0 = this._control.options.symbolWidth / 2;
            var y0 = this._control.options.symbolHeight / 2;
            var r = Math.min(x0, y0) - linelWeight;
            var a = 360 / this._legend.sides;
            ctx.beginPath();
            for (var i = 0; i <= this._legend.sides; i++) {
                var x1 = x0 + r * Math.cos(((a * i + (90 - a / 2)) * Math.PI) / 180);
                var y1 = y0 + r * Math.sin(((a * i + (90 - a / 2)) * Math.PI) / 180);
                if (i == 0) {
                    ctx.moveTo(x1, y1);
                } else {
                    ctx.lineTo(x1, y1);
                }
            }
        }
    }

    class ImageSymbol extends LegendSymbol {
        constructor(control, container, legend) {
            super(control, container, legend);
            this._img = null;
            this._loadImages();
        }

        _loadImages() {
            var imageLoaded = () => {
                this.rescale();
            };
            var img = L.DomUtil.create("img", "img-legend", this._container);
            this._img = img;
            img.onload = imageLoaded;
            img.src = this._legend.url;
        }

        rescale() {
            if (this._img) {
                var _options = this._control.options;
                if (this._img.width > _options.symbolWidth || this._img.height > _options.symbolHeight) {
                    var imgW = this._img.width;
                    var imgH = this._img.height;
                    var scaleW = _options.symbolWidth / imgW;
                    var scaleH = _options.symbolHeight / imgH;
                    var scale = Math.min(scaleW, scaleH);
                    this._img.width = imgW * scale;
                    this._img.height = imgH * scale;
                }
                this.center();
            }
        }

        center() {
            var containerCenterX = this._container.offsetWidth / 2;
            var containerCenterY = this._container.offsetHeight / 2;
            var imageCenterX = parseInt(this._img.width) / 2;
            var imageCenterY = parseInt(this._img.height) / 2;

            var shiftX = containerCenterX - imageCenterX;
            var shiftY = containerCenterY - imageCenterY;

            this._img.style.left = shiftX.toString() + "px";
            this._img.style.top = shiftY.toString() + "px";

        }
    }

    L.Control.Legend = L.Control.extend({
        options: {
            position: "topleft",
            title: "Legend",
            legends: [],
            symbolWidth: 24,
            symbolHeight: 24,
            opacity: 1.0,
            column: false,
            collapsed: false,
        },

        initialize: function (options) {
            L.Util.setOptions(this, options);
            this._legendSymbols = [];
            this._buildContainer();
        },

        onAdd: function (map) {
            this._map = map;
            this._initLayout();
            return this._container;
        },

        _export: function (label) {
            downloadAsExcel(label);
        },


        _viewinfo: function (label) {
            mostrarpoputinfo(label);
        },

        _viewquestion: function (msg) {
            mostrarpoputquestion(msg);
        },

        _delete: function (label, layers) {  
            document.getElementById("staticBackdropLabelleyendDelete").innerHTML= label;
            var modalFiltro = new bootstrap.Modal(document.getElementById('staticBackdropleyendDelete'), {});
            modalFiltro.toggle();
            var buttonleyendDelete = document.getElementById("buttonleyendDelete");
             L.DomEvent.on(
                    buttonleyendDelete,
                    "click",
                    function () {
                        this._deletelayerconfirm.call(this, label, layers);
                    },
                    this
                );  
        },

        _deletelayerconfirm: function (label, layers) {  
            if(this._map != null){
                if (L.Util.isArray(layers)) {
                    for (var i = 0, len = layers.length; i < len; i++) {
                        this._map.removeLayer(layers[i]);
                    }
                } else {
                    this._map.removeLayer(layers);
                } 
                eliminarlayer(label);
            }  
        },

        _buildContainer: function () {
            this._container = L.DomUtil.create("div", "leaflet-legend leaflet-bar leaflet-control ");
            this._container.id= "accordionLegend"
            this._container.style.backgroundColor = "rgba(255,255,255, " + this.options.opacity + ")";
            //boton
            this._contents = L.DomUtil.create("div", "leaflet-legend-contents mb-2 accordion", this._container);
            this._link = L.DomUtil.create("a", "leaflet-legend-toggle", this._container);
            this._link.title = "Legend";
            this._link.href = "#";

            this._c = L.DomUtil.create("div", "d-flex align-items-center justify-content-between", this._contents);
            //titulo
            var title = L.DomUtil.create("h6", "leaflet-legend-title", this._c);
            title.innerText = this.options.title || "Legend";


            var buttonquestion = L.DomUtil.create("button", "align-custom leaflet-legend-toggle-question", this._c);
            buttonquestion.title = "Ayuda sobre capas";
            L.DomEvent.on(
                buttonquestion,
                "click",
                function () {
                    this._viewquestion.call(this, "las Capas");
                },
                this
            );
            
            //columnas
            //this._contents1 = L.DomUtil.create("div", "", this._contents);
            //this._contents2 = L.DomUtil.create("div", "", this._contents);


            // categoria organizaciones
            legendContainerO = L.DomUtil.create("div", "accordion-item mt-2 m-2 mb-0", this._contents);
            subtitleO = L.DomUtil.create("h6", "accordion-header", legendContainerO);
            subtitleO.id = "headingOneO";
            buttonO = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleO);
            buttonO.setAttribute('type',"button");
            buttonO.setAttribute('data-bs-toggle',"collapse");
            buttonO.setAttribute('data-bs-target',"#collapseOneO");
            buttonO.setAttribute('aria-expanded',"true");
            buttonO.setAttribute('aria-controls',"collapseOneO");
            buttonO.innerHTML = "Dependencias";
            divCollapseO = L.DomUtil.create("div", "accordion-collapse collapse", subtitleO);
            divCollapseO.id = "collapseOneO";
            divCollapseO.setAttribute('aria-labelledby',"headingOneO");
            divCollapseO.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyO = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseO);

            /* categoria establecimientos
            legendContainerE = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleE = L.DomUtil.create("h6", "accordion-header", legendContainerE);
            subtitleE.id = "headingOneE";
            buttonE = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleE);
            buttonE.setAttribute('type',"button");
            buttonE.setAttribute('data-bs-toggle',"collapse");
            buttonE.setAttribute('data-bs-target',"#collapseOneE");
            buttonE.setAttribute('aria-expanded',"true");
            buttonE.setAttribute('aria-controls',"collapseOneE");
            buttonE.innerHTML = "Establecimientos";
            divCollapseE = L.DomUtil.create("div", "accordion-collapse collapse", subtitleE);
            divCollapseE.id = "collapseOneE";
            divCollapseE.setAttribute('aria-labelledby',"headingOneE");
            divCollapseE.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyE = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseE);*/

            // categoria Nivel
            legendContainerN = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleN = L.DomUtil.create("h6", "accordion-header", legendContainerN);
            subtitleN.id = "headingOneN";
            buttonN = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleN);
            buttonN.setAttribute('type',"button");
            buttonN.setAttribute('data-bs-toggle',"collapse");
            buttonN.setAttribute('data-bs-target',"#collapseOneN");
            buttonN.setAttribute('aria-expanded',"true");
            buttonN.setAttribute('aria-controls',"collapseOneN");
            buttonN.innerHTML = "Nivel";
            divCollapseN = L.DomUtil.create("div", "accordion-collapse collapse", subtitleN);
            divCollapseN.id = "collapseOneN";
            divCollapseN.setAttribute('aria-labelledby',"headingOneN");
            divCollapseN.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyN = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseN);

            // categoria Modalidad
            legendContainerM = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleM = L.DomUtil.create("h6", "accordion-header", legendContainerM);
            subtitleM.id = "headingOneM";
            buttonM = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleM);
            buttonM.setAttribute('type',"button");
            buttonM.setAttribute('data-bs-toggle',"collapse");
            buttonM.setAttribute('data-bs-target',"#collapseOneM");
            buttonM.setAttribute('aria-expanded',"true");
            buttonM.setAttribute('aria-controls',"collapseOneM");
            buttonM.innerHTML = "Modalidad  ";
            divCollapseM = L.DomUtil.create("div", "accordion-collapse collapse", subtitleM);
            divCollapseM.id = "collapseOneM";
            divCollapseM.setAttribute('aria-labelledby',"headingOneM");
            divCollapseM.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyM = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseM);

             // categoria limites (antes se llamaba general)
            legendContainerG = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleG = L.DomUtil.create("h6", "accordion-header", legendContainerG);
            subtitleG.id = "headingOneG";
            buttonG = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleG);
            buttonG.setAttribute('type',"button");
            buttonG.setAttribute('data-bs-toggle',"collapse");
            buttonG.setAttribute('data-bs-target',"#collapseOneG");
            buttonG.setAttribute('aria-expanded',"true");
            buttonG.setAttribute('aria-controls',"collapseOneG");
            buttonG.innerHTML = "Límites";
            divCollapseG = L.DomUtil.create("div", "accordion-collapse collapse", subtitleG);
            divCollapseG.id = "collapseOneG";
            divCollapseG.setAttribute('aria-labelledby',"headingOneG");
            divCollapseG.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyG = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseG);

            // categoria consultas
            legendContainerC = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleC = L.DomUtil.create("h6", "accordion-header", legendContainerC);
            subtitleC.id = "headingOneC";
            buttonC = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleC);
            buttonC.setAttribute('type',"button");
            buttonC.setAttribute('data-bs-toggle',"collapse");
            buttonC.setAttribute('data-bs-target',"#collapseOneC");
            buttonC.setAttribute('aria-expanded',"true");
            buttonC.setAttribute('aria-controls',"collapseOneC");
            buttonC.innerHTML = "Consultas";
            divCollapseC = L.DomUtil.create("div", "accordion-collapse collapse", subtitleC);
            divCollapseC.id = "collapseOneC";
            divCollapseC.setAttribute('aria-labelledby',"headingOneC");
            divCollapseC.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyC = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseC);

            //categoria tematicos
            legendContainerT = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleT = L.DomUtil.create("h6", "accordion-header", legendContainerT);
            subtitleT.id = "headingOneT";
            buttonT = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleT);
            buttonT.setAttribute('type',"button");
            buttonT.setAttribute('data-bs-toggle',"collapse");
            buttonT.setAttribute('data-bs-target',"#collapseOneT");
            buttonT.setAttribute('aria-expanded',"true");
            buttonT.setAttribute('aria-controls',"collapseOneT");
            buttonT.innerHTML = "Temáticos";
            divCollapseT = L.DomUtil.create("div", "accordion-collapse collapse", subtitleT);
            divCollapseT.id = "collapseOneT";
            divCollapseT.setAttribute('aria-labelledby',"headingOneT");
            divCollapseT.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyT = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseT);

            //categoria otros
            legendContainerX = L.DomUtil.create("div", "accordion-item m-2 mb-0 mt-0", this._contents);
            subtitleX = L.DomUtil.create("h6", "accordion-header", legendContainerX);
            subtitleX.id = "headingOneX";
            buttonX = L.DomUtil.create("button", "botoncustomlegend bg-light", subtitleX);
            buttonX.setAttribute('type',"button");
            buttonX.setAttribute('data-bs-toggle',"collapse");
            buttonX.setAttribute('data-bs-target',"#collapseOneX");
            buttonX.setAttribute('aria-expanded',"true");
            buttonX.setAttribute('aria-controls',"collapseOneX");
            buttonX.innerHTML = "Otros";
            divCollapseX = L.DomUtil.create("div", "accordion-collapse collapse", subtitleX);
            divCollapseX.id = "collapseOneX";
            divCollapseX.setAttribute('aria-labelledby',"headingOneX");
            divCollapseX.setAttribute('data-bs-parent',"#accordionLegend");
            divCollapseBodyX = L.DomUtil.create("div", "accordion-body contentcustomlegend", divCollapseX);
      
            var cantconsultas = 0
            var len = this.options.legends.length;

            var legendContainer = this._contents;
            for (var i = 0; i < len; i++){
                if(this.options.legends[i].layers_type == "general"){
                    //legendContainer = legendContainerG;
                    legendContainer = divCollapseBodyG;
                } else if(this.options.legends[i].layers_type == "organizacion"){
                    legendContainer = divCollapseBodyO;
                } else if(this.options.legends[i].layers_type == "nivel"){
                    legendContainer = divCollapseBodyN;
                } else if(this.options.legends[i].layers_type == "modalidad"){
                    legendContainer = divCollapseBodyM;
                }else if(this.options.legends[i].layers_type == "tema"){
                    legendContainer = divCollapseBodyT;
                }else if(this.options.legends[i].layers_type == "otro"){
                    legendContainer = divCollapseBodyX;
                }else {
                    cantconsultas += 1;
                    legendContainer = divCollapseBodyC;
                }
                var legend = this.options.legends[i];
                this._buildLegendItems(legendContainer, legend, legends);
            }
            //columnas
            /*if(this.options.column){
                this._contents1.classList.add("leaflet-legend-column");
                this._contents2.classList.add("leaflet-legend-column");
            }*/
            if (cantconsultas == 0){
                legendContainerC.style.display = "none";
            }

        },

        _buildLegendItems: function (legendContainer, legend, legends) {

            var contents2 = L.DomUtil.create("div", "d-flex align-items-center justify-content-between itemcustomlegend", legendContainer);  
            
            var legendItemDiv = L.DomUtil.create("div", "leaflet-legend-item", contents2);

            if (legend.inactive == 'true' || legend.inactive == true) {
                L.DomUtil.addClass(legendItemDiv, "leaflet-legend-item-inactive"); 
                if(legend.label === "Regiones Educativas"){
                    var infopanel = document.getElementsByClassName("info leaflet-control");
                    infopanel[0].style.display = "none";
                }
                if(legend.label === "Departamentos"){
                    var infopanel = document.getElementsByClassName("infoD leaflet-control");
                    infopanel[0].style.display = "none";
                }
            } else {
                L.DomUtil.removeClass(legendItemDiv, "leaflet-legend-item-inactive");
            }
            
            var symbolContainer = L.DomUtil.create("i", "img-legend", legendItemDiv);

            var legendSymbol;
            if (legend.type === "image") {
                legendSymbol = new ImageSymbol(this, symbolContainer, legend);
            } else if (legend.type === "circle") {
                legendSymbol = new CircleSymbol(this, symbolContainer, legend);
            } else if (legend.type === "rectangle") {
                legendSymbol = new RectangleSymbol(this, symbolContainer, legend);
            } else if (legend.type === "polygon") {
                legendSymbol = new PolygonSymbol(this, symbolContainer, legend);
            } else if (legend.type === "polyline") {
                legendSymbol = new PolylineSymbol(this, symbolContainer, legend);
            } else {
                L.DomUtil.remove(legendItemDiv);
                return;
            }
 
            this._legendSymbols.push(legendSymbol);

            symbolContainer.style.width = this.options.symbolWidth + "px";
            symbolContainer.style.height = this.options.symbolHeight + "px";

            var legendLabel = L.DomUtil.create("span", null, legendItemDiv);
            legendLabel.style="margin-right: 15px;padding-right: 15px;"
            
            legendLabel.innerText = legend.label;
            
            var contents3 = L.DomUtil.create("div", "d-flex justify-content-end", contents2);
                        
            if(legend.layers_type != "general"){
                var buttonexport = L.DomUtil.create("button", "leaflet-legend-toggle-export", contents3);
                buttonexport.title = "Exportar capa a Excel";
                if (legend.inactive == 'true' || legend.inactive == true){
                    buttonexport.style.display = "none";
                }
                L.DomEvent.on(
                    buttonexport,
                    "click",
                    function () {
                        this._export.call(this, legend.label);
                    },
                    this
                );
            }
            
            if (legend.layers) {
                L.DomUtil.addClass(legendItemDiv, "leaflet-legend-item-clickable");
                L.DomEvent.on(
                    legendItemDiv,
                    "click",
                    function () {
                        this._toggleLegend.call(this, legendItemDiv, legend.layers, legend.label, legends, buttonexport);
                    },
                    this
                )
            }

            if(legend.layers_type == "consulta"){
                var buttondelete = L.DomUtil.create("button", "leaflet-legend-toggle-delete", contents3);
                buttondelete.title = "Eliminar capa";
                L.DomEvent.on(
                    buttondelete,
                    "click",
                    function () {
                        this._delete.call(this, legend.label, legend.layers);
                    },
                    this
                );
            }

            if(legend.layers_type != "consulta" && legend.layers_type != "organizacion" && legend.layers_type != "general"){
                var buttonviewinfo = L.DomUtil.create("button", "leaflet-legend-toggle-viewinfo", contents3);
                buttonviewinfo.title = "Saber más sobre esta capa";
                L.DomEvent.on(
  
                    buttonviewinfo,
                    "click",
                    function () {
                        this._viewinfo.call(this, legend.label);
                    },
                    this
                );
            }

            

        },

        _initLayout: function () {
            L.DomEvent.disableClickPropagation(this._container);
            L.DomEvent.disableScrollPropagation(this._container);

            if (this.options.collapsed) {
                this._map.on("click", this.collapse, this);

                L.DomEvent.on(
                    this._container,
                    {
                        mouseenter: this.expand,
                        mouseleave: this.collapse,
                        click: this.reescalar,
                    },
                    this
                );
            } else {
                this.expand();
            }
        },

        _updateLegend: function(label, inactive){
            actualizarLegends(label, inactive);
        },

        _toggleLegend: function (legendDiv, layers, label, legends, buttonexp) {

            if (L.DomUtil.hasClass(legendDiv, "leaflet-legend-item-inactive")) {

                L.DomUtil.removeClass(legendDiv, "leaflet-legend-item-inactive");
                if(buttonexp){
                    buttonexp.style.display = "block";    
                }                
                if (L.Util.isArray(layers)) {
                    for (var i = 0, len = layers.length; i < len; i++) {
                        this._map.addLayer(layers[i]);
                    }
                } else {
                    this._map.addLayer(layers);
                }
                
                // Mostrar panel info de Departamentos y ocultar panel info de Regiones Educativas, y viceversa
 
                var len = legends.length;
                for (var i = 0; i < len; i++){
                    if(legends[i].label == "Departamentos"){
                        var layersD = legends[i].layers;
                    }
                    if(legends[i].label == "Regiones Educativas"){
                        var layersRE = legends[i].layers;
                    }
                }
                if(label === "Regiones Educativas"){
                    var infopanel = document.getElementsByClassName("info leaflet-control");
                    infopanel[0].style.display = "block";
                    var infopaneld = document.getElementsByClassName("infoD leaflet-control");
                    infopaneld[0].style.display = "none";
                    var legendDivD = Array.prototype.slice.call(document.querySelectorAll('div')).filter(function (el) {return el.textContent == 'Departamentos'})[1];
                    if (!L.DomUtil.hasClass(legendDivD, "leaflet-legend-item-inactive")){   
                        L.DomUtil.addClass(legendDivD, "leaflet-legend-item-inactive");
                        if (L.Util.isArray(layersD)) {
                            for (var i = 0, len = layersD.length; i < len; i++) {
                                this._map.removeLayer(layersD[i]);
                            }
                        } else {
                            this._map.removeLayer(layersD);
                        }
                    }
                }
                if(label === "Departamentos"){
                    var infopanel = document.getElementsByClassName("infoD leaflet-control");
                    infopanel[0].style.display = "block";
                    var infopanelr = document.getElementsByClassName("info leaflet-control");
                    infopanelr[0].style.display = "none";
                    var legendDivRE = Array.prototype.slice.call(document.querySelectorAll('div')).filter(function (el) {return el.textContent === 'Regiones Educativas'})[1];
                    if (!L.DomUtil.hasClass(legendDivRE, "leaflet-legend-item-inactive")){
                        L.DomUtil.addClass(legendDivRE, "leaflet-legend-item-inactive");
                        if (L.Util.isArray(layersRE)) {
                            for (var i = 0, len = layersRE.length; i < len; i++) {
                                this._map.removeLayer(layersRE[i]);
                            }
                        } else {
                            this._map.removeLayer(layersRE);
                        }
                    }
                }
                this._updateLegend.call(this, legendDiv.innerText, "false");
            } else {
                L.DomUtil.addClass(legendDiv, "leaflet-legend-item-inactive");
                if(buttonexp){
                    buttonexp.style.display = "none";    
                }
                if (L.Util.isArray(layers)) {
                    for (var i = 0, len = layers.length; i < len; i++) {
                        this._map.removeLayer(layers[i]);
                    }
                } else {
                    this._map.removeLayer(layers);
                }
                // Ocultar panel info
                if(label === "Regiones Educativas"){
                    var infopanel = document.getElementsByClassName("info leaflet-control");
                    infopanel[0].style.display = "none";
                    //var infopaneld = document.getElementsByClassName("infoD leaflet-control");
                    //infopaneld[0].style.display = "block";
                }

                if(label === "Departamentos"){
                    var infopanel = document.getElementsByClassName("infoD leaflet-control");
                    infopanel[0].style.display = "none";
                    //var infopanelr = document.getElementsByClassName("info leaflet-control");
                    //infopanelr[0].style.display = "block";
                }
                this._updateLegend.call(this, legendDiv.innerText, "true");
            }
        },

        reescalar: function (){
                for (var legendSymbol of this._legendSymbols) {
                legendSymbol.rescale();
            }
            return this;
        },

        expand: function () {
            this._link.style.display = "none";
            L.DomUtil.addClass(this._container, "leaflet-legend-expanded");
            for (var legendSymbol of this._legendSymbols) {
                legendSymbol.rescale();
            }
            return this;
        },

        collapse: function () {
            this._link.style.display = "block";
            L.DomUtil.removeClass(this._container, "leaflet-legend-expanded");
            return this;
        },

        redraw: function () {
            L.DomUtil.empty(this._contents);
            this._buildLegendItems();
        },
    });

    L.control.legend = L.control.Legend = function (options) {
        return new L.Control.Legend(options);
    };
}, window);

