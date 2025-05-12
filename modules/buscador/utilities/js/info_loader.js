var esc = 0;
document.addEventListener('DOMContentLoaded', (event) => {
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
        var mujeres =0;
        var varones = 0;
        var total = 0;
        //datos oferta
        data.forEach(element => {
            //Matricula
            var matriculaNivel = document.getElementById("matriculainfonivel");
            if (element.varones > 0 || element.mujeres > 0){
                var ul = document.createElement("ul")
                ul.id = "divMostrarMatricula"
                ul.textContent = element.nivel;
                var liV = document.createElement("li")
                liV.textContent = "Varones: " + element.varones;
                var liM = document.createElement("li")
                liM.textContent = "Mujeres: " + element.mujeres;
                matriculaNivel.appendChild(ul);
                ul.appendChild(liM);
                ul.appendChild(liV);
            }
            mujeres += parseInt(element.mujeres)
            varones += parseInt(element.varones)
            total += parseInt(element.mujeres)
            total += parseInt(element.varones)
            
            });
            document.getElementById('matriculamujeres').innerHTML += `${mujeres}`;
            document.getElementById('matriculavarones').innerHTML += `${varones}`;
            document.getElementById('matriculatotal').innerHTML += `${total}`;
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
        data.biblioteca !='NULL'?biblioteca.innerHTML+='<img src="./icons/biblioteca.svg" title="Biblioteca">':biblioteca.innerHTML+='<img src="./icons/bibliotecaNo.png" title="Sin biblioteca">'; 
        data.laboratorio !='NULL'?laboratorio.innerHTML+='<img src="./icons/laboratorio.svg" title="Laboratorio">':laboratorio.innerHTML+='<img src="./icons/laboratorioNo.png" title="Sin laboratorio">';
        data.informatica !='NULL'?informatica.innerHTML+='<img src="./icons/informatica.svg" title="Informatica">':informatica.innerHTML+='<img src="./icons/informaticaNo.png" title="Sin sala informatica">';
        data.artistica != 'NULL'?artistica.innerHTML+='<img src="./icons/artistica.svg" title="Artistica">':artistica.innerHTML+= '<img src="./icons/artisticaNo.png" title="Sin sala artistica">';
        data.taller !='NULL'?taller.innerHTML+='<img src="./icons/taller.svg" title="Taller">':taller.innerHTML+='<img src="./icons/tallerNo.png" title="Sin Taller">';
        data.agua !='NULL'?agua.innerHTML+='<img src="./icons/agua.svg" title="Agua">':agua.innerHTML+='<img src="./icons/aguaNo.svg">';
        data.energia !='NULL'?energia.innerHTML+='<img src="./icons/energia.png" title="Energia">' + ' Fuente: ' + data.fuente_energia:energia.innerHTML+='<img src="./icons/energiaNo.png">';
        data.internet !='NULL'?internet.innerHTML+='<img src="./icons/internet.svg" title="Internet">' + ' Fuente: ' + data.fuente_internet:internet.innerHTML+='<img src="./icons/internetNo.svg">';
        data.calefaccion !='NULL'?calefaccion.innerHTML+='<img src="./icons/calefaccion.svg" title="Calefaccion">': calefaccion.innerHTML+='<img src="./icons/calefaccionNo.png" title="Sin calefaccion">';
        obtenerImagenes()
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

//funcion para cargar las imagenes y cuadros informativos a la pestaña info institucion
function obtenerImagenes (){
    fetch(`https://script.google.com/macros/s/AKfycbyX9EgyakKo60mf8ckFKaygMmAWkyRyfOpwtpiegnKt400GPq6u-eauD6M4M8TO8s5Baw/exec`)
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
            if (escImagen[1]){
                if(escImagen[1] == esc){
                    document.getElementById('imagenInfo').setAttribute('src',imagen.url.replace('02.PNG','01.PNG'))
                    document.getElementById('imagenFotos').setAttribute('src',imagen.url.replace('02.PNG','01.PNG'))
                    
                }
            }
        })
    })
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

