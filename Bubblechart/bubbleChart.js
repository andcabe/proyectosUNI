function bubbleChart() {
    var width = 900,
        height = 900,
        centroX = width/2,
        centroY = height/2,
        minRadio = 5,
        maxRadio = 90,
        columnaRadio = "times",
        columnaColor = "gender",
        titulo = "Apariciones en los comics de los avengers",
        //Opciones para el selectTag
        opciones = {
            gender: {
                male: "rgb(51, 153, 255)",
                female: "rgb(255, 102, 217)",
                text: "Genero",
                tooltip: "Apariciones"
            },
            year: {
                old: "brown",
                new: "rgb(0,210,0)",
                text: "Año de aparición",
                tooltip: "Apariciones"

            },
            honorary: {
                honorary: "orange",
                academy: "rgb(200,200,255)",
                probationary: "rgb(0,100,200)",
                full:"rgb(150,230,150)",
                text: "Tipo de miembro",
                tooltip: "Apariciones"
            },
            current:{
                yes: "rgb(0,210,0)",
                no: "grey",
                text: "Estado actual",
                tooltip: "Apariciones"

            },
            death:{
                none: "white",
                all: "rgb(175, 0, 0)",
                text: "Numero de muertes",
                tooltip: "Muertes"

            },
            return:{
                none: "rgb(255, 255, 255)",
                all: "rgb(0,230,0)",
                text: "Numero de resurreciones",
                tooltip: "Resurreciones"

            },
        },
        posicionCuadrados = [200, 250, 300, 350];


    function chart(selection) {
        var div = selection,
            svg = div.append("svg").attr("width", width).attr("height", height),
            data = selection.datum();

        svg.append("text")
            .attr("x", width/2)
            .attr("y", 40)
            .text(titulo)
            .attr("text-anchor", "middle")
            .attr("font-family", "monospace")
            .attr("font-size", "30")
            .attr("fill", "red");

        /**
        Tooltip mostrado al posarse encima de las burbujas
        **/
        var tooltip = selection
            .append("div")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("padding", "8px")
            .style("background-color", "white")
            .style("opacity", "0.95")
            .style("border-radius", "6px")
            .style("stroke", "black")
            .style("border-style", "solid")
            .style("border-width", "1px")
            .style("text-align", "center")
            .style("font-family", "monospace")
            .style("width", "200px")
            .style("z-index", "1000")
            .text("");


        /**
        Creacion de la simulación de la fuerza para la colocación de las burbujas.
        **/
        var forceCollide = d3.forceCollide(function(d) { return d.r+5; }).strength(0.8);

        var forceX = d3.forceX(width/2).strength(0.02);

        var forceY = d3.forceY(height/2+30).strength(0.02);

        var force = d3.forceSimulation(data)
            .force('x', forceX)
            .force('y', forceY)
            .force('center', d3.forceCenter(centroX, centroY))
            .force('collide', forceCollide)
            .on('tick', function() {
            svg.selectAll('.node')
                .attr('cx', function(d) { return d.x; })
                .attr('cy', function(d) { return d.y; })
          })

        /**
        Creación de las burbujas y su interacción
        **/
        var nodes = svg.selectAll(".node")
            .data(data)
            .enter()
            .append("circle")
            .classed('node', true)
            .attr("r", function(d){
                return d.r;
            })
            .style("fill", function(d){
                return colorDelCirculo(d);
            })
            .style("stroke", "black") 
            .on("click", function(d){
                window.open(d.url);
            })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

        force.nodes(data)
            .alpha(0.1)
            .restart()

 
        d3.selection.prototype.moveToFront = function() {
            return this.each(function(){
                this.parentNode.appendChild(this);
            });
        };

        function mouseover(d){
            d3.select(this).moveToFront();
            d3.select(this).style("cursor", "pointer");
            tooltip.html("<big>" + d.name + "<big><br>Avenger desde: "+ d.year + "<br><b><big>" + d[columnaRadio] + " </big></b>"+ opciones[columnaColor]["tooltip"] +"</big>");
            tooltip.style("visibility", "visible");
        }

        function mousemove(d){
            tooltip.style("top", (d3.event.pageY - 50) + "px").style("left", (d3.event.pageX + 5) + "px");
        }

        function mouseout(d){
            d3.select(this).style("cursor", "default");
            tooltip.style("visibility", "hidden");
        }

        /**
        Select Tag con las distintas opciones que modifican el color e información mostrada en las burbujas
        **/
        var selectTag = div.append("select")
            .attr("id", "select")
            .style("position", "absolute")
            .style("top", "130px")
            .style("left", "800px")
            .style("width", "210px")
            .style("height", "50px")
            .style("font-size", "20px")
            .on("change", selectChange);

        var options = selectTag.selectAll("option")
            .data(Object.keys(opciones))
            .enter()
            .append("option")
            .text(function(d, i){
                return opciones[d].text;
            })
            .attr("id", function(d){
                return d;
            })
            .style("font-size", "34px");

        /**
        Cambios producidos al elegir una opción en el Select Tag
        **/
        function selectChange(){
            columnaColor = d3.select("#select option:checked").attr("id")
            switch(columnaColor){
                case Object.keys(opciones)[0]:
                    columnaRadio = "times";
                    break;
                case Object.keys(opciones)[1]:
                    columnaRadio = "times";
                    break;
                case Object.keys(opciones)[2]:
                    columnaRadio = "times";
                    break;
                case Object.keys(opciones)[3]:
                    columnaRadio = "times";
                    break;
                case Object.keys(opciones)[4]:
                    columnaRadio = "death"; 
                    break;
                case Object.keys(opciones)[5]:
                    columnaRadio = "return";
                    break;
            }
            cambiarCirculos();
            cambiarCuadrados();
        }

        /**
        Creacion de los distintos indicadores sobre tamaño y color de las burbujas
        **/
        var medidas = div.append("svg")
            .style("position", "absolute")
            .style("top", "200px")
            .style("left", "790px")
            .attr("width", "220px")
            .attr("height", "700px")

        /**
        Muestra el significado de los colores de las burbujas
        **/
        var cuadradosOpciones = medidas.selectAll("rect")
            .data(posicionCuadrados)
            .enter()
            .append("rect")
            .attr("width", "20")
            .attr("height", "20")
            .attr("x", "20")
            .attr("y", function(d){
                return d;
            })
            .style("stroke", "black")
            .style("opacity", "0");

        var cuadradosTexto = medidas.selectAll("text")
            .data(posicionCuadrados)
            .enter()
            .append("text")
            .attr("x", "60")
            .attr("y", function(d){
                return d + 15;
            })
            .attr("font-family", "monospace")
            .attr("font-size", "18")

        cambiarCuadrados();

        /**
        Muestra una comparación del tamaño de las burbujas y el numero de las apariciones
        **/
        var tamano =  medidas.append("text")
            .attr("x", parseInt(medidas.attr("width"))/2)
            .attr("y", "40")
            .attr("text-anchor", "middle")
            .attr("font-family", "monospace")
            .attr("font-size", "18")

        var circuloTamano = medidas.append("circle")
            .attr("cx", function(){
                return parseInt(medidas.attr("width"))/2;
            })
            .attr("cy", function(){
                return parseInt(medidas.attr("width"))/2;
            })
            .style("stroke", "black")
            .style("fill-opacity", "0")

        var circuloTexto = medidas.append("text")
            .attr("x", function(d){
                return parseInt(medidas.attr("width"))/2;
            })
            .attr("y", function(d){
                return parseInt(medidas.attr("width"))/2+4;
            })
            .attr("text-anchor", "middle")
            .attr("font-family", "monospace")
            .attr("font-size", "18")

        cambiarCirculoTamano();

        function cambiarCuadrados(){
            switch(columnaColor){
                case Object.keys(opciones)[0]:
                    cuadradosOpciones.transition().duration(750).style("fill", function(d){
                        if(d==posicionCuadrados[0]) return opciones.gender.male;
                        return opciones.gender.female;
                    })
                    .style("opacity", function(d, i){
                        if(i>1) return 0;
                        return 1
                    });
                    cuadradosTexto.text(function(d,i){
                        if (d==posicionCuadrados[0]) return "Hombre";
                        if (d==posicionCuadrados[1]) return "Mujer";
                    }).transition().duration(750)
                    .style("opacity", function(d,i){
                        if(i>1) return 0;
                        else return 1;
                    });
                    break;
                case Object.keys(opciones)[1]:
                    cuadradosOpciones.transition().duration(750).style("fill", function(d){
                        if(d==posicionCuadrados[0]) return opciones.year.old;
                        return opciones.year.new;
                    })
                    .style("opacity", function(d, i){
                        if(i>1) return 0;
                        return 1;
                    });
                    cuadradosTexto.text(function(d,i){
                        if (d==posicionCuadrados[0]) return "1963";
                        if (d==posicionCuadrados[1]) return "2015";
                    }).transition().duration(750)
                    .style("opacity", function(d,i){
                        if(i>1) return 0;
                        else return 1;
                    });
                    break;
                case Object.keys(opciones)[2]:
                    cuadradosOpciones.transition().duration(750).style("fill", function(d){
                        if(d==posicionCuadrados[0]) return opciones.honorary.full;
                        if(d==posicionCuadrados[1]) return opciones.honorary.academy;
                        if(d==posicionCuadrados[2]) return opciones.honorary.probationary;
                        if(d==posicionCuadrados[3]) return opciones.honorary.honorary;
                    })
                    .style("opacity", function(d, i){
                        return 1;
                    });
                    cuadradosTexto.text(function(d){
                        if (d==posicionCuadrados[0]) return "Completo";
                        if (d==posicionCuadrados[1]) return "Estudiante";
                        if (d==posicionCuadrados[2]) return "En pruebas";
                        if (d==posicionCuadrados[3]) return "Honorario";

                    }).transition().duration(750)
                    .style("opacity", function(d,i){
                        return 1;
                    });

                    break;
                case Object.keys(opciones)[3]:
                    cuadradosOpciones.transition().duration(750).style("fill", function(d){
                        if(d==posicionCuadrados[0]) return opciones.current.yes;
                        return opciones.current.no;
                    })
                    .style("opacity", function(d, i){
                        if(i>1) return 0;
                        return 1;
                    });
                    cuadradosTexto.text(function(d,i){
                        if (d==posicionCuadrados[0]) return "Es Avenger";
                        if (d==posicionCuadrados[1]) return "No es Avenger";
                    }).transition().duration(750)
                    .style("opacity", function(d,i){
                        if(i>1) return 0;
                        else return 1;
                    });

                    break;
                case Object.keys(opciones)[4]:
                    cuadradosOpciones.transition().duration(750).style("fill", function(d){
                        if(d==posicionCuadrados[0]) return opciones.death.none;
                        return opciones.death.all;
                    })
                    .style("opacity", function(d, i){
                        if(i>1) return 0;
                        return 1
                    });
                    cuadradosTexto.text(function(d,i){
                        if (d==posicionCuadrados[0]) return "Ninguna";
                        if (d==posicionCuadrados[1]) return "5 muertes";
                    }).transition().duration(750)
                    .style("opacity", function(d,i){
                        if(i>1) return 0;
                        else return 1;
                    });

                    break;
                case Object.keys(opciones)[5]:
                    cuadradosOpciones.transition().duration(750).style("fill", function(d){
                        if(d==posicionCuadrados[0]) return opciones.return.none;
                        return opciones.return.all;
                    })
                    .style("opacity", function(d, i){
                        if(i>1) return 0;
                        return 1;
                    });

                    cuadradosTexto.text(function(d,i){
                        if (d==posicionCuadrados[0]) return "Ninguna";
                        if (d==posicionCuadrados[1]) return "5 resurreciones";
                    }).transition().duration(750)
                    .style("opacity", function(d,i){
                        if(i>1) return 0;
                        else return 1;
                    });

                    break;
            }
        }

        function cambiarCirculoTamano(){
            var r = d3.scaleLinear()
                .domain([d3.min(data, function(d) { return d[columnaRadio]; }),
                        d3.max(data,function(d) { return d[columnaRadio]; })])
                .range([minRadio, maxRadio]);
            circuloTamano.transition().duration(1500).attr("r",r(parseInt((
                                d3.min(data, function(d) { return d[columnaRadio]; })
                               +d3.max(data,function(d) { return d[columnaRadio]; }))
                                /2)) );
            circuloTexto.text(function(){
                return parseInt((d3.min(data, function(d) { return d[columnaRadio]; })
                                +d3.max(data,function(d) { return d[columnaRadio]; }))
                                /2)
                    });
            tamano.text(opciones[columnaColor].tooltip);
        }

        function cambiarCirculos(){
            force.nodes(data).alpha(0.2).restart()
            nodes.transition().duration(1500)
            .style("fill", function(d){
                return colorDelCirculo(d);
            });

        }

        var color;
        function colorDelCirculo(d){
            switch(columnaColor){
                case Object.keys(opciones)[0]:
                    if(d.gender=="MALE") return opciones.gender.male;
                    else if(d.gender == "FEMALE") return opciones.gender.female;
                    else return "grey";

                case Object.keys(opciones)[1]:
                    color = d3.scaleLinear()
                        .domain([1963, 2018])
                        .range([opciones.year.old, opciones.year.new]);

                    if(d.year>2018 || d.year<1963){
                        return("black")
                    }
                    return(color(d.year))

                case Object.keys(opciones)[2]:
                    if(d.honorary == "Honorary") return opciones.honorary.honorary;
                    else if(d.honorary == "Academy") return opciones.honorary.academy;
                    else if(d.honorary == "Probationary") return opciones.honorary.probationary;
                    else if(d.honorary == "Full") return opciones.honorary.full;
                    else return "black"

                case Object.keys(opciones)[3]:
                    if(d.current == "YES") return opciones.current.yes;
                    else if(d.current =="NO") return opciones.current.no;
                    else return "grey";

                case Object.keys(opciones)[4]:
                    color = d3.scaleLinear()
                        .domain([0, 5])
                        .range([opciones.death.none, opciones.death.all]);
                    return(color(d.death));
                
                case Object.keys(opciones)[5]:
                    color = d3.scaleLinear()
                        .domain([0, 5])
                        .range([opciones.return.none, opciones.return.all]);
                    return(color(d.return));
            }
        }

    }

    /**
    Funciones para cambiar directamente los parámetros del bubbleChart, utiles para la reutilización del codigo
    **/
    chart.width = function(v) {
        if (!arguments.length) {
            return width;
        }
        width = v;
        return chart;
    };

    chart.height = function(v) {
        if (!arguments.length) {
            return height;
        }
        height = v;
        return chart;
    };


    chart.columnaColor = function(v) {
        if (!arguments.length) {
            return columnaColor;
        }
        columnaColor = v;
        return chart;
    };

    chart.columnaRadio = function(v) {
        if (!arguments.length) {
            return columnaRadio;
        }
        columnaRadio = v;
        return chart;
    };

    chart.minRadio = function(v) {
        if (!arguments.length) {
            return minRadio;
        }
        minRadio = v;
        return chart;
    };

    chart.maxRadio = function(v) {
        if (!arguments.length) {
            return maxRadio;
        }
        maxRadio = v;
        return chart;
    };

    chart.centroX = function(v) {
        if (!arguments.length) {
            return centroXe;
        }
        centroX = v;
        return chart;
    };

    chart.centroY = function(v) {
        if (!arguments.length) {
            return centroY;
        }
        centroY = v;
        return chart;
    };

    chart.titulo = function(v) {
        if (!arguments.length) {
            return titulo;
        }
        titulo = v;
        return chart;
    };

    chart.opciones = function(v) {
        if (!arguments.length) {
            return opciones;
        }
        opciones = v;
        return chart;
    };

    chart.posicionCuadrados = function(v) {
        if (!arguments.length) {
            return posicionCuadrados;
        }
        posicionCuadrados = v;
        return chart;
    };
    return chart;

}
        