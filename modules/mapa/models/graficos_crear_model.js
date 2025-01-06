


function renderizarSemaforo (value) {
    var config = {
        type: 'gauge',
        backgroundColor: 'transparent',
        title: {text:'Semaforo de infraestructura'},
        series:[
            {values:[value]}
        ],
        scaleR: {
            labels:['Capacidad critica', 'Capacidad baja', 'Capacidad media', 'Capacidad buena', 'Capacidad completa'],
            aperture: 200,
            values: '0:100:25',
            tick: {
                lineColor: '#11AAFF',
                lineStyle: 'solid',
                lineWidth: '3px',
                size: 20,
                placement: 'inner'
              },
            ring: {
                size:10,
                rules: [
                    {
                        rule: '%v >= 0 && %v <= 25',
                        backgroundColor: 'red'
                    },
                    {
                        rule: '%v >= 25 && %v <= 50',
                        backgroundColor: 'orange'
                    },
                    {
                        rule: '%v >= 50 && %v <= 75',
                        backgroundColor: 'yellow'
                    },
                    {
                        rule: '%v >= 75 && %v <= 100',
                        backgroundColor: 'green'
                    },
                ]
            }
        }
    }
    zingchart.render({
        id:'semaforoEquiInfra',
        data:config,
        height: 300,
        width: 300,
    });
}

