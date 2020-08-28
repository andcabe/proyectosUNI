<%-- 
    Document   : index
    Created on : 18-nov-2019, 16:17:59
    Author     : andres
--%>

<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Election Simulator 2019</title>
        <script src="js/jquery.min.js"></script>
        <script src="js/Chart.min.js"></script>
        <script src="js/interface.js"></script>
        <script src="js/dhondt.js"></script>
        <link href="style.css" rel="stylesheet">
    </head>
    <body>
        <div id="root-container" class="container">
            
            <div class="modal" id="modal-district">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <form class="modal-form" id="modal-district-form">
                        <div class="form-input-full">
                            <p class="label-input">Nombre de circunscripción </p>
                            <input class="text-input string-input" type="text" name="name" placeholder="ej: Madrid" required>
                        </div>
                        <div class="form-input-double">
                            <div class="form-input-double-first">
                                <p class="label-input">Votos nulos </p>
                                <input class="text-input int-input" type="text" name="null" placeholder="ej: 1000" required>  
                            </div>
                            <div class="form-input-double-second">
                                <p class="label-input">Votos blancos </p>
                                <input class="text-input int-input" type="text" name="blank" placeholder="ej: 1000" required>  
                            </div>
                        </div>
                        
                        <div class="form-input-double">
                            <p class="label-input">Número de representantes </p>
                            <div class="form-input-double-first">
                                <input class="text-input int-input" type="text" name="representatives" placeholder="ej: 10" required>
                            </div>
                        </div>
                        <button class="modal-form-submit" type="submit"> OK </button>
                    </form>                    
                </div>
            </div>
            
            <div class="modal" id="modal-candidature">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <form class="modal-form" id="modal-candidature-form">
                        <input id="district-id" type="hidden" name="district" value="">
                        <div class="form-input-full">
                            <p class="label-input">Nombre <b>largo</b> de candidatura</p>
                            <input class="text-input string-input" type="text" name="fullName" placeholder="ej: Partido Popular" required>
                        </div>
                        <div class="form-input-full">
                            <p class="label-input">Nombre <b>corto</b> de candidatura</p>
                            <input class="text-input string-input" type="text" name="shortName" placeholder="ej: PP" required>
                        </div>
                        <div class="form-input-double">
                            <div class="form-input-double-first">
                                <p class="label-input">Votos </p>
                                <input class="text-input int-input" type="text" name="votes" placeholder="ej: 1000" required>  
                            </div>
                        </div>
                        <button class="modal-form-submit" type="submit"> OK </button>
                    </form>                    
                </div>
            </div>
            
            <div class="modal" id="modal-district-edit">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <form class="modal-form" id="modal-district-edit-form">
                        <input id="district-id" type="hidden" name="district" value="">
                        <div class="form-input-full">
                            <p class="label-input">Nombre de circunscripción </p>
                            <input class="text-input string-input" type="text" name="name" placeholder="ej: Madrid" required>
                        </div>
                        <div class="form-input-double">
                            <div class="form-input-double-first">
                                <p class="label-input">Votos nulos </p>
                                <input class="text-input int-input" type="text" name="null" placeholder="ej: 1000" required>  
                            </div>
                            <div class="form-input-double-second">
                                <p class="label-input">Votos blancos </p>
                                <input class="text-input int-input" type="text" name="blank" placeholder="ej: 1000" required>  
                            </div>
                        </div>
                        
                        <div class="form-input-double">
                            <p class="label-input">Número de representantes </p>
                            <div class="form-input-double-first">
                                <input class="text-input int-input" type="text" name="representatives" placeholder="ej: 10" required>
                            </div>
                        </div>
                        <button class="modal-form-submit" type="submit"> OK </button>
                        <button class="deleteButton" id="deleteDistrict"> Borrar </button>
                    </form>                    
                </div>
            </div>
            
            <div class="modal" id="modal-candidature-edit">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <form class="modal-form" id="modal-candidature-edit-form">
                        <input id="district-id" type="hidden" name="district" value="">
                        <input id="candidature-id" type="hidden" name="candidature" value="">
                        <div class="form-input-full">
                            <p class="label-input">Nombre <b>largo</b> de candidatura</p>
                            <input class="text-input string-input" type="text" name="fullName" placeholder="ej: Partido Popular" required>
                        </div>
                        <div class="form-input-full">
                            <p class="label-input">Nombre <b>corto</b> de candidatura</p>
                            <input class="text-input string-input" type="text" name="shortName" placeholder="ej: PP" required>
                        </div>
                        <div class="form-input-double">
                            <div class="form-input-double-first">
                                <p class="label-input">Votos </p>
                                <input class="text-input int-input" type="text" name="votes" placeholder="ej: 1000" required>  
                            </div>
                        </div>
                        <button class="modal-form-submit" type="submit"> OK </button>
                        <button class="deleteButton" id="deleteCandidature"> Borrar </button>
                    </form>                    
                </div>
            </div>
            <form class="sidebar-form" id="simulation-form">
                <div id="sidebar" class="sidebar">
                    <a href="javascript:void(0)" class="closebtn" onclick="closePar()">×</a>
                    

                    <div class="dropdown" id="dropdown">
                        <div class="select" id="dropdown">
                            <span>Tipo de elecciones</span>
                            <i class="fa fa-chevron-left" id="fa fa-chevron-left"></i>
                        </div>
                        <input type="hidden" name="election">
                        <ul class="dropdown-menu" id="dropdown">
                            <li id="autonomicas">Autonomicas</li>
                            <li id="congreso">Congreso</li>
                            <li id="europeas">Europeas</li>
                            <li id="municipales">Municipales</li>
                        </ul>
                     </div>


                    <div class="sidebarElement" id="threshold-box">
                        <label for="threshold"><b>Umbral D'Hont (%): </b></label>
                        <input type="text" class="configuration-input" id="threshold-input" name="threshold" placeholder="3" required>
                    </div>

                    <div class="sidebarElement" id="date-box">
                        <label for="month"><b>Fecha: </b></label>
                        <input class="configuration-input" id="month-input" type="text" maxlength="2" name="month" placeholder="mm" required>
                        <label for="year"><b>/</b></label>
                        <input class="configuration-input"  id="year-input" type="text" maxlength="4" name="year" placeholder="aaaa" required>
                    </div>

                    <div class="sidebarElement" id="representatives-box">
                        <label for="representatives"><b>Representantes: </b></label>
                        <input type="text" class="configuration-input" id="representatives-input" name="representatives" placeholder="Total" required>
                    </div>

                    <div class="sidebarElement" id="districts-box">
                        <button type="button" class="collapsible" id="everydistrict">Circunscripciones</button>
                        <div class="collapsible-content" id="districts">
                            <div class="addElement">
                                <p class="textButton">Añadir circunscripción</p>
                                <p class="addButton" id="addDistrictButton">+</p>
                            </div>
                        </div>
                    </div>
                    <div class="sidebarElement" id="submit-box">
                        <button id="election-submit" type="submit"> Simular </button>
                    </div>
                </div>
            </form>

            <main class="content" id="main-content">
                <button class="parambtn" id="parambtn" onclick="closePar()">☰ Parámetros</button>
                <div id="last-box">
                    <button id="last-submit" disabled type="button"> Cargar Última Simulación</button>
                </div>
                <h2>Simulación de elecciones</h2>
                <script>
               </script>
                <p>Para mostrar/cambiar parametros click en el boton</p>

                <div class="main-box" id="table-box">
                    <table id="result-table"></table>
                </div>   
                <div class="main-box" id="chart-box">
                    <canvas id="chart" width="400" height="400"></canvas>
                </div>   

            </main>
            <script>
                startInterface();
            </script>
            <footer class="footer" id="footer"> Patricia Aguado Labrador - Santiago Blasco Arnáiz - Andrés Cabero Mata </footer>
        </div>
    </body>
</html>
