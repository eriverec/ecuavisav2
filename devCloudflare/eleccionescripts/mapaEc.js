(async () => {

    var mapData = jsonMap;

    // var columns = {
    //   "range": "'Ark 1'!A1:Z1000",
    //   "majorDimension": "COLUMNS",
    //   "values": [
    //     [
    //       "Key",
    //       "gu",
    //       "n"
    //     ],
    //     [
    //       "State",
    //       "Guayas",
    //       "Napo"
    //     ],
    //     [
    //       "Luisa Gonzáles",
    //       4,
    //       1
    //     ],
    //     [
    //       "Daniel Noboa",
    //       3,
    //       2
    //     ],
    //     [
    //       "Margin (Trump)",
    //       -1,
    //       1
    //     ]/*
    //       Si es -1 ganando Luisa, si es 1 ganando Daniel
    //     */
    //   ]
    // }

    const response = await fetch('https://api-configuracion.vercel.app/web/data-sv');
    if (!response.ok) {
      throw new Error('Error al obtener datos desde JSON');
    }
    const datosJSON = await response.json();
    console.log(datosJSON.values)

    var columns = {
      "range": "'Ark 1'!A1:Z1000",
      "majorDimension": "COLUMNS",
      "values": datosJSON.values
    }

    // Determinar quién es el contrincante mayor para cada provincia
    function getMayorContrincante(row) {
      const danielNoboaVotes = parseInt(columns[3][row], 10);
      const luisaGonzalesVotes = parseInt(columns[2][row], 10);

      if(danielNoboaVotes){
        return danielNoboaVotes > luisaGonzalesVotes ? ['Daniel Noboa', danielNoboaVotes] : ['Luisa González',luisaGonzalesVotes];
      }
      return null;

      
    }
/**
             * Event handler for clicking points. Use jQuery UI to pop up
             * a pie chart showing the details for each state.
             */
            function pointClick() {
                var row = this.options.row,
                    $div = $('<div></div>')
                        .dialog({
                            title: `Provincia - ${this.name}`,
                            width: 320,
                            height: 200
                        });

                window.chart = new Highcharts.Chart({
                    chart: {
                        renderTo: $div[0],
                        type: 'pie',
                        width: 290,
                        height: 140
                    },
                    title: {
                        text: null
                    },
                    exporting: {
                      enabled: false // Esto oculta el botón de menú de exportación
                    },

                    credits: {
                      enabled: false // Esto oculta el crédito de Highcharts
                    },
                    series: [{
                        name: 'Votos',
                        data: [{
                            name: 'Noboa',
                            color: '#672893',
                            y: parseFloat(columns[3][row])
                        }, {
                            name: 'González',
                            color: '#1e96d4',
                            y: parseFloat(columns[2][row])
                        }],
                        dataLabels: {
                            format: '<b>{point.name}</b> <br/> {point.percentage:.1f}%'
                        }
                    }]
                });
            }

            // Make the columns easier to read

            columns = columns.values;
            var keys = columns[0],
                names = columns[1],
                percent = columns[4],
                // Build the chart options
                options = {
                    chart: {
                        type: 'map',
                        map: mapData,
                        renderTo: 'container',
                        borderWidth: 0,
                    },

                    plotOptions: {
                        map: {
                            allAreas: true,
                            tooltip: {
                                headerFormat: '',
                                // pointFormat: '<div style="color:{point.color};">⦿</div> <span style="font-size:14px;font-weight: bold;">{series.name} de {point.name}</span>  <br/> <b>{point.nombreContrincante}</b> lidera con: <b>{point.valorCandidatoG} votos</b>'
                                pointFormatter: function() {
                                    // Puedes acceder a los datos del punto a través de 'this'
                                    const point = this;
                                    
                                    // Construye el contenido personalizado para el tooltip
                                    var luisa = point.options.luisa.votos;
                                    var daniel = point.options.daniel.votos;
                                    var total = luisa + daniel;

                                    const content = `
                                    <span style="font-size:14px;font-weight: bold;">${point.name_2}</span><br/>
                                    <div style="text-align:left"><div style="color:#672893;">⦿</div> 
                                        <small>Daniel Noboa: <br/> ${daniel} %</small>
                                    </div><br><br>
                                    <div style="text-align:left"><div style="color:#1e96d4;">⦿</div> 
                                        <small>Luisa González: <br/> ${luisa} %</small>
                                    </div>`;

                                    // const content = `
                                    // <span style="font-size:14px;font-weight: bold;">${point.name}</span><br/>
                                    // <div style="text-align:left"><div style="color:#672893;">⦿</div> 
                                    //     <small>Daniel Noboa: <br/> ${daniel}  votos - ${((daniel*100)/total).toFixed(2)} %</small>
                                    // </div><br><br>
                                    // <div style="text-align:left"><div style="color:#1e96d4;">⦿</div> 
                                    //     <small>Luisa González: <br/> ${luisa} votos - ${((luisa*100)/total).toFixed(2)} %</small>
                                    // </div>`;
                                    // const content = `<div style="color:${point.color};">⦿</div>
                                    //   <span style="font-size:14px;font-weight: bold;">${point.series.name} de ${point.name}</span><br/>
                                    //   <b>${point.nombreContrincante}</b> lidera con: <b>${point.valorCandidatoG} votos</b>
                                    // `;
                                    
                                    return content;
                                  }
                            },
                            footerFormat: '</br>',

                        }
                    },

                    exporting: {
                      enabled: false // Esto oculta el botón de menú de exportación
                    },

                    credits: {
                      enabled: false // Esto oculta el crédito de Highcharts
                    },

                    title: {
                        text: 'Resultados Segunda Vuelta Elecciones 2023',
                        align: 'center'
                    },
                    subtitle: {
                        text: '<span style="font-size:14px;font-weight: bold;">Fuente: CNE </span>',
                        align: 'center',
                        verticalAlign: 'bottom',
                    },

                    legend: {
                        align: 'center',
                        verticalAlign: 'top',
                        x: 0,
                        y: 0,
                        floating: false,
                        layout: 'horizontal',
                        valueDecimals: 0,
                        backgroundColor: ( // theme
                            Highcharts.defaultOptions &&
                            Highcharts.defaultOptions.legend &&
                            Highcharts.defaultOptions.legend.backgroundColor
                        ) || 'rgba(255, 255, 255, 0.85)'
                    },

                    mapNavigation: {
                        enabled: true,
                        enableButtons: true,
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    },

                    colorAxis: {
                        stops: [
                          [0, '#672893'],       // Color para Daniel Noboa
                          [1, '#1e96d4']        // Color para Luisa Gonzáles
                        ],
                        dataClasses: [{
                            from: -100,
                            to: 0,
                            color: '#1e96d4',
                            name: 'Luisa González'
                        }, {
                            from: 0,
                            to: 100,
                            color: '#672893',
                            name: 'Daniel Noboa'
                        }]
                    },

                    series: [{
                        data: [],
                        joinBy: 'postal-code',
                        dataLabels: {
                            // useHTML:true,
                            enabled: true,
                            // color: '#FFFFFF',
                            // format: '{point.postal-code}',
                            // format: '{point.name} ',// {point.valorCandidatoG} Votos
                            formatter: function () {
                              var v = this.point;
                              // Personaliza el formato de la etiqueta de datos con HTML
                              if(v.hasOwnProperty('valorCandidatoG')){
                              // console.log(this)
                                 return '<b>' + this.point.name_2 + '</b>';
                               }else{
                                return this.point.name_2;
                               }
                             
                            }
                            // style: {
                            //     textTransform: 'uppercase'
                            // }
                        },
                        name: 'Provincia',
                        point: {
                            // events: {
                            //     click: pointClick
                            // }
                        },
                        // tooltip: {
                        //     // ySuffix: ' %',
                        //     formatter: function () {
                        //       // Puedes personalizar el formato del tooltip aquí
                        //       // return `<b>${this.point.name}</b>: ${this.y} % Sufijo Personalizado`;
                        //       return "asdsd";
                        //     }
                        // },
                        cursor: 'pointer'
                    }, {
                        name: 'Separators',
                        type: 'mapline',
                        nullColor: 'silver',
                        showInLegend: false,
                        enableMouseTracking: false,
                        accessibility: {
                            enabled: false
                        }
                    }]
                };
            keys = keys.map(function (key) {
                return key.toUpperCase();
            });


            // Asignar colores a las provincias según el contrincante mayor
            // mapData.objects.default.geometries.forEach(function (geometry) {
            //   if (geometry.properties['postal-code']) {
            //     var postalCode = geometry.properties['postal-code'],
            //       i = $.inArray(postalCode, keys);

            //     var mayorContrincante = getMayorContrincante(i);
            //     var color = '';
            //     if(mayorContrincante){
            //         color = mayorContrincante === 'Daniel Noboa' ? '#672893' : '#1e96d4'; // Cambia los colores aquí
            //     }

            //     console.log(mayorContrincante)
            //     if(names[i]){
            //       options.series[0].data.push(Highcharts.extend({
            //         value: parseFloat(percent[i]),
            //         name: names[i],
            //         'postal-code': postalCode,
            //         row: i,
            //         // color: color // Asigna el color según el contrincante mayor
            //       }, geometry));
            //     }
                
            //   }
            // });

            mapData.objects.default.geometries.forEach(function (geometry) {
              if (geometry.properties['postal-code']) {
                var postalCode = geometry.properties['postal-code'];
                var i = $.inArray(postalCode, keys);
                var mayorContrincante = getMayorContrincante(i);
                var color = '';

                if (mayorContrincante) {
                  color = mayorContrincante[0] === 'Daniel Noboa' ? '#672893' : '#1e96d4'; // Asigna el color según el contrincante mayor
                }

                if (mayorContrincante) {
                    console.log(datosJSON.values[1][i], postalCode)
                  var dataObject = Highcharts.extend({
                    value: parseFloat(percent[i]),
                    valorCandidatoG: parseFloat(mayorContrincante[1]),
                    nombreContrincante: mayorContrincante[0],
                    daniel: {
                        "votos": parseFloat(columns[3][i])
                    },
                    luisa: {
                        "votos": parseFloat(columns[2][i])
                    },
                    name_2: datosJSON.values[1][i],
                    // name_2: names[i]+'asdsdsd',
                    'postal-code': postalCode,
                    row: i,
                  }, geometry);

                  // Asigna el color al objeto de datos
                  // dataObject.color = color;

                  options.series[0].data.push(dataObject);
                }
              }
            });


            // Initialize the chart
            window.chart = new Highcharts.Map(options);
            

})();
