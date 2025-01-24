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
        document.getElementById('resp_telresponsableinfoadicional').innerHTML = `${data.tel_resp}`;
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
            throw new Error('Error al obtener los datos');
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
        data.biblioteca != 'NULL'?biblioteca.innerHTML+=data.biblioteca:biblioteca.innerHTML+='No se registra';
        data.laboratorio != 'NULL'?laboratorio.innerHTML+=data.laboratorio:laboratorio.innerHTML+='No se registra';
        data.informatica != 'NULL'?informatica.innerHTML+=data.informatica:informatica.innerHTML+='No se registra';
        data.artistica != 'NULL'?artistica.innerHTML+=data.artistica:artistica.innerHTML+= 'No se registra';
        data.taller != 'NULL'?taller.innerHTML+=data.taller:taller.innerHTML+='No se registra';
        data.agua != 'NULL'?agua.innerHTML+=data.agua:agua.innerHTML+='No se registra';
        data.energia != 'NULL'?energia.innerHTML+=data.energia + '/ ' + data.fuente_energia:energia.innerHTML+='No se registra';
        data.internet != 'NULL'?internet.innerHTML+=data.internet + '/ ' + data.fuente_internet:internet.innerHTML+='No se registra';
        data.calefaccion != 'NULL'?calefaccion.innerHTML+=data.calefaccion: calefaccion.innerHTML+='No se registra';
            
    })
    .catch(error => {
        console.error('Error:', error);
    });
        
    
};

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


//document.getElementById("exportarinfoadicional").addEventListener("click", downloadAsExceInfoAdicional);
function downloadAsExceInfoAdicional(){
	var namelayer = document.getElementById("fnainfoadicional").innerText;
	var datosObj = [];
	var obj = {};
	obj["cueanexo"] = document.getElementById("cueanexoinfoadicional").innerHTML; 
	//obj["fna"] = document.getElementById("fnainfoadicional").innerHTML;
	obj["domicilio"] = document.getElementById("calleinfoadicional").innerHTML; 
	obj["fun"] = document.getElementById("funinfoadicional").innerHTML; 
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
	obj["tel_responsable"] = document.getElementById("resp_telresponsableinfoadicional").innerHTML; 
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