var esc = 0;
document.addEventListener('DOMContentLoaded', (event) => {
});

function descifrarDato(datoCifrado, clave) {
  const bytes = CryptoJS.AES.decrypt(datoCifrado, clave);
  return bytes.toString(CryptoJS.enc.Utf8);
}
obtenerImagenes()
/*async function completarDatosInstitucion() {
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
        esc=data.numero
        document.getElementById('cabecera').innerText += ` ${data.numero}`;
        document.getElementById('cueanexoinfoadicional').innerHTML = `${data.cue_anexo}`;
        //document.getElementById('funinfoadicional').innerHTML = `${data.funcion}`;
        document.getElementById('regioninfoadicional').innerHTML = `${data.region}`;
        document.getElementById('departamentoinfoadicional').innerHTML = `${data.departamento}`;
        document.getElementById('Localidadinfoadicional').innerHTML = `${data.localidad}`;
        document.getElementById('calleinfoadicional').innerHTML = `${data.domicilio}`;
        document.getElementById('cod_postalinfoadicional').innerHTML = `${data.cp}`;
        document.getElementById('amginfoadicional').innerHTML = `${data.ambito}`
        //datos directivo
        document.getElementById('resp_respnsableinfoadicional').innerHTML = `${data.responsable}`;
        document.getElementById('telefonoinfoadicional').innerHTML = `${data.tel}`;
        document.getElementById('emailinfoadicional').innerHTML = `${data.email_inst}`;
        document.getElementById('sitio_webinfoadicional').innerHTML = `${data.web}`;
        //document.getElementById('resp_telresponsableinfoadicional').innerHTML = `${data.telefono}`;
        fetch(`info/obtenerDatosSedeAnexo?cue=${data.cue}&anexo=${data.anexo}`)
        .then (response => {
            if(!response.ok){
                throw new Error('Error al obtener los Datos')
            }
            return response.json()
        })
        .then(dataSA => {
            var data = dataSA[0]
            var anexoActu = parseInt(dataSA[1],10)
            var sede = document.getElementById('sedeinfoadicional')
            var siguiente = document.getElementById('siguiente')
            var anterior = document.getElementById('anterior')
            if (data.length > 1) {
                if (anexoActu == 0) {
                    sede.innerHTML = "SI"
                } else {
                    var anexo = document.getElementById('anexoinfoadicional')
                    var anexolabel = document.getElementById('anexoinfoadicionallabel')
                    anexo.setAttribute('style','display:block')
                    anexolabel.setAttribute('style','display:block')
                    sede.innerHTML = "NO"
                    anexo.innerHTML = "" + anexoActu
                }
                for (let i = 0; i < data.length; i++) {
                    if(data[i].anexo == anexoActu && data[i+1] !== undefined) {
                        siguiente.onclick = function() {
                            window.location.href = "./info?num="+ data[i+1].id_institucion
                        } 
                    }
                    if(data[i].anexo == anexoActu && data[i-1] !== undefined) {
                        anterior.onclick = function() {
                            window.location.href = "./info?num="+ data[i-1].id_institucion
                        } 
                    }                    
                }
            } else {
                sede.innerHTML = "SI"
                anterior.setAttribute('style','display:none')
                siguiente.setAttribute('style','display:none')
            }
        })
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    fetch(`info/busqueda_matricula_nivel?num=${id}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener las matriculas por nivel');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(data => {
        var total = 0;
        //datos oferta
        const matriculaNivel = document.getElementById("matriculainfonivel");
        matriculaNivel.innerHTML = ""; // limpiar antes

        const ul = document.createElement("ul");

        data.forEach(element => {

            const li = document.createElement("li");
            li.textContent = `${element.nivel}: ${parseInt(element.total)}`;

            ul.appendChild(li);
        });

        matriculaNivel.appendChild(ul);

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

    //fetch nuevo
    fetch(`info/obtenerDatosInfra?num=${id}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos de infraestructura');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(datos => {
        var data = datos[0]
        //datos oferta
        var biblioteca = document.getElementById('bibliotecainfoadicional');
        var laboratorio = document.getElementById('laboratorioinfoadicional');
        var informatica = document.getElementById('informaticainfoadicional');
        var artistica = document.getElementById('artisticainfoadicional');
        var taller = document.getElementById('tallerinfoadicional');
        var agua = document.getElementById('aguainfoadicional');
        var energia = document.getElementById('energiainfoadicional');
        var internet = document.getElementById('internetinfoadicional');
        var calefaccion = document.getElementById('calefaccioninfoadicional');
        data.biblioteca !='NULL'?biblioteca.innerHTML+='<img src="./icons/biblioteca.svg" title="Biblioteca">':biblioteca.innerHTML+='<img src="./icons/bibliotecaNo.png" title="Sin biblioteca">'; 
        data.laboratorio !='NULL'?laboratorio.innerHTML+='<img src="./icons/laboratorio.svg" title="Laboratorio">':laboratorio.innerHTML+='<img src="./icons/laboratorioNo.png" title="Sin laboratorio">';
        data.informatica !='NULL'?informatica.innerHTML+='<img src="./icons/informatica.svg" title="Informatica">':informatica.innerHTML+='<img src="./icons/informaticaNo.png" title="Sin sala informatica">';
        data.artistica != 'NULL'?artistica.innerHTML+='<img src="./icons/artistica.svg" title="Artistica">':artistica.innerHTML+= '<img src="./icons/artisticaNo.png" title="Sin sala artistica">';
        data.taller !='NULL'?taller.innerHTML+='<img src="./icons/taller.svg" title="Taller">':taller.innerHTML+='<img src="./icons/tallerNo.png" title="Sin Taller">';
        data.agua !='NULL'?agua.innerHTML+='<img src="./icons/agua.svg" title="Agua">':agua.innerHTML+='<img src="./icons/aguaNo.svg">';
        data.energia !='NULL'?energia.innerHTML+='<img src="./icons/energia.png" title="Energia">' + ' Fuente: ' + data.fuente_energia:energia.innerHTML+='<img src="./icons/energiaNo.png">';
        data.internet !='NULL'?internet.innerHTML+='<img src="./icons/internet.svg" title="Internet">' + ' Fuente: ' + data.fuente_internet:internet.innerHTML+='<img src="./icons/internetNo.svg">';
        data.calefaccion !='NULL'?calefaccion.innerHTML+='<img src="./icons/calefaccion.svg" title="Calefaccion">': calefaccion.innerHTML+='<img src="./icons/calefaccionNo.png" title="Sin calefaccion">';
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
    fetch(`info/obtenerDatosCooperadoras?num=${id}`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos de cooperadora');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(datosCoop => {
        datos = datosCoop[0];
        console.log(datos)
        //datos oferta
        var numeroReso = document.getElementById('numeroReso');
        var fechaReso = document.getElementById('fechaReso');
        var persJuridica = document.getElementById('persJuridica');
        var presidente = document.getElementById('presidente');
        var tesorero = document.getElementById('tesorero');
        if (datos === undefined) {
            numeroReso.innerHTML = 'No indica';
            fechaReso.innerHTML = 'No indica';
            persJuridica.innerHTML = 'No indica';
            presidente.innerHTML = 'No indica';
            tesorero.innerHTML = 'No indica';
        } else {
            (datos.n_reso != null) ? numeroReso.innerHTML = datos.n_reso : numeroReso.innerHTML = 'No indica';
            (datos.fecha_reso != null) ? fechaReso.innerHTML = datos.fecha_reso : fechaReso.innerHTML = 'No indica';
            (datos.pers_juridica != null) ? persJuridica.innerHTML = datos.pers_juridica : persJuridica.innerHTML = 'No indica';
            (datos.presidente != null) ? presidente.innerHTML = datos.presidente : presidente.innerHTML = 'No indica';
            (datos.tesorero != null) ? tesorero.innerHTML = datos.tesorero : tesorero.innerHTML = 'No indica';
        }
        })
    .catch(error => {
        console.error('Error:', error);
    });
};*/

async function completarDatosInstitucion() {

    const $ = id => document.getElementById(id);

    function appendUnique(id, value) {

        if (!value) return;

        const el = $(id);

        if (!el.innerHTML.includes(value)) {

            el.innerHTML +=
                el.innerHTML === ''
                    ? value
                    : ` / ${value}`;
        }
    }

    async function fetchJSON(url) {

        const response = await fetch(url);

        let data = null;

        try {
            data = await response.json();
        } catch {}

        if (!response.ok) {

            throw new Error(
                data?.message ||
                'Error del servidor'
            );
        }

        return data;
    }

    try {

        const parametros =
            new URLSearchParams(window.location.search);

        const id = parametros.get('num');

        // =========================
        // FETCHES PARALELOS
        // =========================

        const [
            institucion,
            matriculas,
            adicionales,
            infraData,
            cooperadoraData,
            edTecnologicaData
        ] = await Promise.all([

            fetchJSON(
                `info/obtenerDatos?num=${id}`
            ),

            fetchJSON(
                `info/busqueda_matricula_nivel?num=${id}`
            ),

            fetchJSON(
                `info/obtenerDatosAdc?num=${id}`
            ),

            fetchJSON(
                `info/obtenerDatosInfra?num=${id}`
            ),

            fetchJSON(
                `info/obtenerDatosCooperadoras?num=${id}`
            ),

            fetchJSON(
                `info/obtenerDatosEdTecnologica?num=${id}`
            )
        ]);

        // =========================
        // DATOS INSTITUCIÓN
        // =========================

        esc = institucion.numero;

        $('cabecera').innerText +=
            ` ${institucion.numero}
            `+`${institucion.nombre}`;

        $('cueanexoinfoadicional').innerHTML =
            institucion.cue_anexo || '-';

        $('regioninfoadicional').innerHTML =
            institucion.region || '-';

        $('departamentoinfoadicional').innerHTML =
            institucion.departamento || '-';

        $('Localidadinfoadicional').innerHTML =
            institucion.localidad || '-';

        $('calleinfoadicional').innerHTML =
            institucion.domicilio || '-';

        $('cod_postalinfoadicional').innerHTML =
            institucion.cp || '-';

        $('amginfoadicional').innerHTML =
            institucion.ambito || '-';

        $('resp_respnsableinfoadicional').innerHTML =
            institucion.responsable || '-';

        $('telefonoinfoadicional').innerHTML =
            institucion.tel || '-';

        $('emailinfoadicional').innerHTML =
            institucion.email_inst || '-';

        $('sitio_webinfoadicional').innerHTML =
            institucion.web || '-';

        // =========================
        // SEDE / ANEXO
        // =========================

        try {

            const sedeData =
                await fetchJSON(
                    `info/obtenerDatosSedeAnexo?cue=${institucion.cue}&anexo=${institucion.anexo}`
                );

            const data = sedeData.data;

            const anexoActu =
                parseInt(sedeData.anexo, 10);

            const sede = $('sedeinfoadicional');

            const siguiente = $('siguiente');

            const anterior = $('anterior');

            if (data.length > 1) {

                if (anexoActu === 0) {
                    sede.innerHTML = "SI";

                } else {

                    $('anexoinfoadicional')
                        .style.display = 'block';

                    $('anexoinfoadicionallabel')
                        .style.display = 'block';

                    sede.innerHTML = "NO";

                    $('anexoinfoadicional')
                        .innerHTML = anexoActu;
                }

                for (let i = 0; i < data.length; i++) {

                    if (
                        data[i].anexo == anexoActu &&
                        data[i + 1]
                    ) {

                        siguiente.onclick = () => {

                            window.location.href =
                                `./info?num=${data[i + 1].id_institucion}`;
                        };
                    }

                    if (
                        data[i].anexo == anexoActu &&
                        data[i - 1]
                    ) {

                        anterior.onclick = () => {

                            window.location.href =
                                `./info?num=${data[i - 1].id_institucion}`;
                        };
                    }
                }

            } else {

                sede.innerHTML = "SI";

                anterior.style.display = 'none';

                siguiente.style.display = 'none';
            }

        } catch(error) {

            console.warn(
                'Sin sedes/anexos:',
                error.message
            );

            $('sedeinfoadicional').innerHTML = "SI";

            $('anterior').style.display = 'none';

            $('siguiente').style.display = 'none';
        }

        // =========================
        // MATRÍCULA
        // =========================

        const matriculaNivel =
            $('matriculainfonivel');

        matriculaNivel.innerHTML = '';

        const ul = document.createElement('ul');

        matriculas.forEach(element => {

            const li =
                document.createElement('li');

            li.textContent =
                `${element.nivel}: ${parseInt(element.total)}`;

            ul.appendChild(li);
        });

        matriculaNivel.appendChild(ul);

        // =========================
        // DATOS ADICIONALES
        // =========================

        adicionales.forEach(element => {

            appendUnique(
                'turnoinfoadicional',
                element.turno
            );

            appendUnique(
                'jornadainfoadicional',
                element.jornada
            );

            appendUnique(
                'modalidadinfoadicional',
                element.modalidad
            );

            appendUnique(
                'nivelesinfoadicional',
                element.nivel
            );
        });

        // =========================
        // INFRAESTRUCTURA
        // =========================

        const data = infraData[0];
        function setInfraIcon(
            elementId,
            condition,
            iconOk,
            iconNo,
            titleOk,
            extra = ''
        ) {

            const el = $(elementId);

            el.innerHTML += condition
                ? `<img src="${iconOk}" title="${titleOk}"> ${extra}`
                : `<img src="${iconNo}">`;
        }

        setInfraIcon(
            'bibliotecainfoadicional',
            data?.biblioteca == 'SI',
            './icons/biblioteca.svg',
            './icons/bibliotecaNo.png',
            'Biblioteca'
        );

        setInfraIcon(
            'laboratorioinfoadicional',
            data?.laboratorio == 'SI',
            './icons/laboratorio.svg',
            './icons/laboratorioNo.png',
            'Laboratorio'
        );

        setInfraIcon(
            'informaticainfoadicional',
            data?.informatica == 'SI',
            './icons/informatica.svg',
            './icons/informaticaNo.png',
            'Informática'
        );

        setInfraIcon(
            'artisticainfoadicional',
            data?.artistica == 'SI',
            './icons/artistica.svg',
            './icons/artisticaNo.png',
            'Artística'
        );

        setInfraIcon(
            'tallerinfoadicional',
            data?.taller == 'SI',
            './icons/taller.svg',
            './icons/tallerNo.png',
            'Taller'
        );

        setInfraIcon(
            'aguainfoadicional',
            data?.agua == 'SI',
            './icons/agua.png',
            './icons/aguaNo.png',
            'Agua'
        );

        setInfraIcon(
            'energiainfoadicional',
            data?.energia == 'SI',
            './icons/energia.png',
            './icons/energiaNo.png',
            'Energía',
            `Fuente: ${data?.fuente_energia || ''}`
        );

        setInfraIcon(
            'internetinfoadicional',
            data?.internet == 'SI',
            './icons/internet.svg',
            './icons/internetNo.svg',
            'Internet',
            `Fuente: ${data.fuente_internet !== 'Sin info' ? data?.fuente_internet + " - " + data?.ISP : data?.ISP || data.fuente_internet}`
        );

        setInfraIcon(
            'calefaccioninfoadicional',
            data?.calefaccion == 'SI',
            './icons/calefaccion.svg',
            './icons/calefaccionNo.png',
            'Calefacción'
        );

        //==========================
        //Educacion tecnologica
        //==========================
        const edTec = edTecnologicaData[0];
        console.log(edTec)
        setInfraIcon(
            'carroinfoadicional',
            edTec?.carro === 0 ? false : true,
            './icons/adm_.svg',
            './icons/admSin_.svg',
            'Carro de robótica',
            edTec?.carro == 0 ? 'No posee carro tecnológico' : `Posee carro tecnológico`
        );

        setInfraIcon(
            'netbooksinfoadicional',
            edTec?.netbooks === 0 ? false : true,
            './icons/netbooks_.svg',
            './icons/netbooksNo_.png',
            'Netbooks',
            edTec?.netbooks == 0 ? 'No posee netbooks' : `${edTec.netbooks} netbooks`
        );

        setInfraIcon(
            'kitsinfoadicional',
            edTec?.kits === 0 ? false : true,
            './icons/robotica_.svg',
            './icons/roboticaNo_.png',
            'Kits de Robotica',
            edTec?.kits == 0 ? 'No posee kits' : `${edTec.kits} kits`
        );

        // =========================
        // COOPERADORA
        // =========================

        const coop =
            cooperadoraData[0];

        $('numeroReso').innerHTML =
            coop?.n_reso || 'No indica';

        $('fechaReso').innerHTML =
            coop?.fecha_reso || 'No indica';

        $('persJuridica').innerHTML =
            coop?.pers_juridica || 'No indica';

        $('presidente').innerHTML =
            coop?.presidente || 'No indica';

        $('tesorero').innerHTML =
            coop?.tesorero || 'No indica';

    } catch(error) {

        console.error(
            'Error general:',
            error
        );
    }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

function saveAsExcel(buffer, filename){
    const data = new Blob([buffer], {type:EXCEL_TYPE});
    saveAs (data,filename + '_export_' + new Date().getTime()+EXCEL_EXTENSION);
}

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

//funcion para cargar las imagenes y cuadros informativos a la pestaña info institucion
function obtenerImagenes (){
    fetch(`https://script.google.com/macros/s/AKfycbwtiZWbiwZjn3_exp5ONv0ZrI_Uw9kOk9WPFn9mng5OjSYd3zISosR8kE5KPFuLqtxcGw/exec`)
    .then(response => {
        // Maneja la respuesta recibida del servidor
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        return response.json(); // Convierte la respuesta en formato JSON
    })
    .then(datos => {
        datos.forEach(imagen => {
            var escImagen = imagen.nombre.split('-');
            var numero = escImagen[1]
            var fotoTipo = escImagen[escImagen.length-1].toString();
            if (numero == esc){
                console.log(fotoTipo)
                if(fotoTipo == "01.PNG"){
                    const proxyUrl = `./proxyimg?url=${encodeURIComponent(imagen.url)}`;
                    document.getElementById("imagenInfo").src = proxyUrl;                 
                }else {
                    if (fotoTipo == "02.PNG") {
                        const proxyUrl = `./proxyimg?url=${encodeURIComponent(imagen.url)}`;
                        document.getElementById("imagenFotos").src = proxyUrl;    
                    }
                    if (escImagen.length == 5){
                        if (fotoTipo == '02.PNG' && escImagen[2] == 'epja'){
                            setTimeout(function(){
                                const proxyUrl = `./proxyimg?url=${encodeURIComponent(imagen.url)}`;
                                document.getElementById("imagenFotosModExtra").src = proxyUrl;    
                                document.getElementById('imagenFotosModExtra').setAttribute('class','d-block')
                            }, 2000);
                        }
                    }
                }   
                }
            }
        )
    }   
    )
    .catch(error => {
        console.error('Error:', error);
    });
}



//document.getElementById("exportarinfoadicional").addEventListener("click", downloadAsExceInfoAdicional);
function downloadAsExceInfoAdicional(){
	var namelayer = document.getElementById("fnainfoadicional").innerText;
	var datosObj = [];
	var obj = {};
	obj["cueanexo"] = document.getElementById("cueanexoinfoadicional").innerHTML; 
	//obj["fna"] = document.getElementById("fnainfoadicional").innerHTML;
	obj["domicilio"] = document.getElementById("calleinfoadicional").innerHTML; 
	//obj["fun"] = document.getElementById("funinfoadicional").innerHTML; 
	obj["codigoPostal"] = document.getElementById("cod_postalinfoadicional").innerHTML;
	obj["localidad"] = document.getElementById("Localidadinfoadicional").innerHTML; 
	obj["departemento"] = document.getElementById("departamentoinfoadicional").innerHTML; 
	obj["ambito"] = document.getElementById("amginfoadicional").innerHTML; 
	obj["region"] = document.getElementById("Regioninfoadicional").innerHTML; 
	obj["modalidad"] = document.getElementById("modalidadinfoadicional").innerHTML; 
	obj["niveles"] = document.getElementById("nivelesinfoadicional").innerHTML; 
	obj["jornadainfoadicional"] = document.getElementById("jornadainfoadicional").innerHTML;
	obj["turnoinfoadicional"] = document.getElementById("turnoinfoadicional").innerHTML;
	//obj["oferta"] = document.getElementById("ofertainfoadicional").innerHTML; 
	//obj["dependencia"] = document.getElementById("dependenciinfoadicional").innerHTML; 
	//obj["gestion"] = document.getElementById("gesinfoadicional").innerHTML;
	obj["telefono"] = document.getElementById("telefonoinfoadicional").innerHTML; 
	obj["email"] = document.getElementById("emailinfoadicional").innerText; 
	obj["web"] = document.getElementById("sitio_webinfoadicional").innerText; 
	obj["responsable"] = document.getElementById("resp_respnsableinfoadicional").innerHTML; 
	//obj["tel_responsable"] = document.getElementById("resp_telresponsableinfoadicional").innerHTML; 
	obj["bibliotecainfoadicional"] = document.getElementById("bibliotecainfoadicional").innerHTML;
	obj["laboratorioinfoadicional"] = document.getElementById("laboratorioinfoadicional").innerHTML;
	obj["internetinfoadicional"] = document.getElementById("internetinfoadicional").innerHTML;
	obj["energiainfoadicional"] = document.getElementById("energiainfoadicional").innerHTML;
	obj["fuentenergiainfoadicional"] = document.getElementById("fuentenergiainfoadicional").innerHTML;
	obj["aguainfoadicional"] = document.getElementById("aguainfoadicional").innerHTML;
	datosObj.push(obj);
	downloadAsExcelD(namelayer, datosObj);
}

completarDatosInstitucion();

