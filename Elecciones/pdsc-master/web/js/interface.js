class Model {
    
    constructor(electionConfiguration){
        
        this.configuration = electionConfiguration.configuration;
        this.districts = electionConfiguration.districts;
                
    }
    
    static getElectionModel(){
        return '{"configuration":{},"districts":[]}';
    }
    
    static getConfigurationModel(model){
        
        switch(model){
            
            case "congreso": 
                
                return '{"type":"congreso","threshold":3,"month":11,\n\
                                "year":2019,"districts":0,"candidatures":[],\n\
                                "representatives":0}';
            case "europeas": 
                
                return '{"type":"europeas","threshold":3,"month":5,\n\
                                "year":2019,"districts":0,"candidatures":[],\n\
                                "representatives":0}';
            case "autonomicas": 
                
                return '{"type":"autonomicas","threshold":3,"month":5,\n\
                                "year":2019,"districts":0,"candidatures":[],\n\
                                "representatives":0}';
            case "municipales": 
                
                return '{"type":"municipales","threshold":6,"month":5,\n\
                                "year":2019,"districts":0,"candidatures":[],\n\
                                "representatives":0}';
            default: 
            
                return '{"type":"congreso","threshold":3,"month":11,\n\
                                "year":2019,"districts":0,"candidatures":[],\n\
                                "representatives":0}';
            
        }
        
    }
    
    static getDistrictModel(){
        return '{"id":0,"name":"name","null":0,"blank":0,"representatives":0,"candidatures":[]}';
    }
    
    static getCandidatureModel(){
        return '{"id":0,"fullName":"fullName","shortName":"shortName","votes":0}';
    }
    
    static checkValidElection(election){
        

        var valid = true;
        var badDistricts = [];

        if(election.districts.length==0){
            valid = false;
            
        } else{
            for (var d in election.districts){
                if(election.districts[d].candidatures.length == 0){
                    valid = false;
                    badDistricts.push(election.districts[d].id);
                }
            }
        }
        
        return [valid, badDistricts];
    }
    
    //CONFIGURATION GETTER AND SETTER
    
    getConfiguration(){
        return this.configuration;
    }
    
    setConfiguration(configuration){
        this.configuration = configuration;
    }
    
    getConfigurationAttribute(attribute){
        return this.configuration[attribute];
    }
    
    setConfigurationAttribute(attribute, newValue){
        this.configuration[attribute] = newValue;
    }
    
    //DISTRICTS GETTER AND SETTER
    getDistrict(id){
        return this.districts[id];
    }
    
    setDistrict(id, district){
        this.districts[id] = district;
    }
    
    getDistrictAttribute(id, attribute){
        return this.districts[id][attribute];
    }
    
    setDistrictAttribute(id, attribute, newValue){
        this.districts[id][attribute] = newValue;
    }
    
    getDistricts(){
        return this.districts;
    }
    
    setDistricts(districts){
        this.districts = districts;
    }
    
    //CANDIDATURE GETTER AND SETTER
    
    getCandidature(districtId, id){
        return this.districts[districtId].candidatures[id];
    }
    
    setCandidature(districtId, id, candidature){
        this.districts[districtId].candidatures[id] = candidature;
    }
    
    getCandidatureAttribute(districtId, id, attribute){
        return this.districts[districtId].candidatures[id][attribute];
    }
    
    setCandidatureAttribute(districtId, id, attribute, newValue){
        this.districts[districtId].candidatures[id][attribute] = newValue;
        
    }
 
    //ADD AND REMOVE DISTRICT AND CANDIDATURES
 
    addNewDistrict(district){
        this.districts.push(district);
        this.updateDistrictId();
        this.updateConfiguration();
    }        
    
    removeDistrict(id){
        this.districts.splice(id, 1);
        this.updateDistrictId();
        this.updateConfiguration();
    }
    
    addNewCandidature(districtId, candidature){
        this.districts[districtId].candidatures.push(candidature);
        this.updateCandidatureId(districtId);
        this.updateConfiguration();
    }

    removeCandidature(districtId, id){
        this.districts[districtId].candidatures.splice(id, 1);
        this.updateCandidatureId(districtId);
        this.updateConfiguration();
    }

    updateConfiguration(){
        this.configuration.representatives = this.countRepresentatives();
        this.configuration.districts = this.districts.length;
        this.configuration.candidatures = this.countCandidatures();
    }    
 
    updateDistrictId(){
        var id = 0;
        for(var i in this.districts){
            this.districts[i].id = id;
            id+=1;
        }
    }
    
    updateCandidatureId(districtId){
        var id = 0;
        for(var i in this.districts[districtId].candidatures){
            this.districts[districtId].candidatures[i].id = id;
            id+=1;
        }
    }    
    
    countRepresentatives(){
        
        var total = 0;
        for (var i in this.districts){
            total += this.districts[i].representatives;
        }
        return total;
    }
    
    countCandidatures(){
        var candidatures = [];
        for(var i in this.districts){
            candidatures.push(this.districts[i].candidatures.length);
        }
        return candidatures;
    }
    
    
}

var elections = new Model(JSON.parse(Model.getElectionModel()));

function startInterface(){

//ELECTION DROPDOWN SELECTOR
    $('.dropdown').click(clickDropdown);
    $('.dropdown').focusout(focusOutDropdown);
    $('.dropdown-menu li').click(clickDropdownMenu);
    $('.dropdown-menu li').click(changeDropdownValue);  
    
//ELECTION CONFIGURATION INPUTS
    $(".configuration-input").on("input", changeConfigurationInput);
    $("#threshold-input").on("input", thresholdInput);
    $("#month-input").on("input", monthInput);
    $("#year-input").on("input", yearInput);
    $("#representatives-input").keydown(districtsKeyDown);
    $("#representatives-input").on("change", districtsChange);
    $("#representatives-input").attr('tabindex', '-1');
    
//COLLAPSIBLE
    $(".collapsible").click(clickCollapsible);    
    
//MODAL
    $("#addDistrictButton").click(clickAddDistrict);
    $(".modal-close").click(closeModal);
    $(window).click(function (event){
        $(".modal").each(function(){
           if(event.target==$(this)[0]){
               closeModal();
           }
        });
    });
    $("#modal-district-form").submit(submitDistrict);
    $("#modal-candidature-form").submit(submitCandidature);
    $("#modal-district-edit-form").submit(submitEditDistrict);
    $("#modal-candidature-edit-form").submit(submitEditCandidature);
    $("#deleteDistrict").click(clickRemoveDistrict);
    $("#deleteCandidature").click(clickRemoveCandidature);
    
//MODAL INPUTS
    $(".int-input").on("input", intInput);

//SUBMIT ELECTION
    $("#simulation-form").submit(submitElection);

//MAIN DIVS
    $("#last-submit").click(clickLastSimulation);
    if(localStorage.getItem("lastElection2020") != null){
        $("#last-submit").prop('disabled', false);
    }
    
}

//PARAMETERS BUTTON FUNCTIONS
function openPar() {
    $(".sidebar").css('width', '20rem');
    $(".content").css('margin-left', '20rem');
    $(".footer").css('margin-left', '20rem');
    $(".parambtn").attr('onclick', 'closePar()');
    $(".sidebar .sidebarElement.active").fadeTo(300, 1);
}

function closePar() {
    $(".sidebar").css('width', '0');
    $(".content").css('margin-left', '0');
    $(".footer").css('margin-left', '0');
    $(".parambtn").attr('onclick', 'openPar()');
    $(".sidebar .sidebarElement.active").fadeTo(20, 0);
}

//DROPDOWN FUNCTIONS
function clickDropdown(){
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.dropdown-menu').slideToggle(300);
}
function focusOutDropdown(){
    $(this).removeClass('active');
    $(this).find('.dropdown-menu').slideUp(300);
}

function clickDropdownMenu(){
    $(this).parents('.dropdown').find('span').text($(this).text());
    $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
    $(".sidebarElement").toggleClass("active");
    $(".sidebarElement").fadeTo(300, 1);
    electionType($(this).attr('id'));
}
function changeDropdownValue() {
        var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
        msg = '<span class="msg">Hidden input value: ';
        $('.msg').html(msg + input + '</span>');
    }

//CHANGE TYPE OF ELECTION
function electionType(type) {
    elections.configuration = JSON.parse(Model.getConfigurationModel(type));
    elections.updateConfiguration();
    showConfiguration();
    
}

function showConfiguration() {
    $("#threshold-input").val(elections.getConfigurationAttribute("threshold"));
    $("#month-input").val(elections.getConfigurationAttribute("month"));
    $("#year-input").val(elections.getConfigurationAttribute("year"));
    $("#representatives-input").val(elections.getConfigurationAttribute("representatives"));
    $("#representatives-input").trigger("change");
}

function changeConfigurationInput(){
    elections.setConfigurationAttribute($(this).attr("name"), parseFloat($(this).val()));
}

//COLLAPSIBLE FUNCTIONS
function clickCollapsible(){
    var content = $(this).next();
    if (content.css("max-height") == "0px"){
        expandCollapsibleParent($(this), 0);
    } else{
        $(this).removeClass("active");
        content.css("max-height", "0px");
    }
}

function expandCollapsibleParent(son, pixels){
    
    var content = son.next();
    son.addClass("active");
    if (son.hasClass("collapsible-son")){
        var parent = son.parents().eq(2).children(".collapsible");
        if(parent.hasClass("collapsible")){

            expandCollapsibleParent(parent, content[0].scrollHeight);

        }
    }
    
    content.css("max-height", (content[0].scrollHeight + pixels ) + "px" );
    
}

//MODAL FUNCTIONS

function closeModal(){

    $(".modal").css("display", "none");
    
}

//___________________DISTRICTS___________________
    //ADD DISTRICT
function clickAddDistrict(){
  
    $("#modal-district").css("display", "block");
  
}

function submitDistrict(e){
    
    e.preventDefault();
    var districtValues = $(this).serializeArray();

    var newDistrict = JSON.parse(Model.getDistrictModel());
    newDistrict.name = districtValues[0].value;
    newDistrict.null = parseInt(districtValues[1].value);
    newDistrict.blank = parseInt(districtValues[2].value);
    newDistrict.representatives = parseInt(districtValues[3].value);
    
    elections.addNewDistrict(newDistrict);
    
    addDistrict(elections.districts[elections.districts.length-1]);
    showConfiguration();
    closeModal();
    $("#modal-district-form")[0].reset();    

}

function addDistrict(district){
    $("#districts").children().last().before(
                            '<div class="district" id="' + district.id + '">\n\
                                <button type="button" class="collapsible collapsible-son" id="singledistrict">' + district.name + '</button>\n\
                                <div class="collapsible-content district-content">\n\
                                    <div class="modifyElement">\n\
                                        <button class="editButton editDistrict"> Editar </button>\n\
                                    </div>\n\
                                    <div class="collapsible-value">\n\
                                        <p>Representantes: </p>\n\
                                        <input id="representatives" name="representatives" value="' + district.representatives + '" readonly>\n\
                                    </div>\n\
                                    <div class="collapsible-value">\n\
                                        <p>Votos nulos: </p>\n\
                                        <input id="nullVotes" name="nullVotes" value="' + district.null + '" readonly>\n\
                                    </div>\n\
                                    <div class="collapsible-value">\n\
                                        <p>Votos en blanco: </p>\n\
                                        <input id="blankVotes" name="blankVotes" value="' + district.blank + '" readonly>\n\
                                    </div>\n\
                                    <div class="addElement">\n\
                                        <p class="textButton">Añadir candidatura</p>\n\
                                        <p class="addButton addCandidatureButton"> + </p>\n\
                                    </div>\n\
                                </div>\n\
                            </div>');
    
    expandCollapsibleParent($("#everydistrict"), 0);
    $("#" + district.id + ".district").children(".collapsible").click(clickCollapsible);
    $("#" + district.id + ".district").find(".addCandidatureButton").click(clickAddCandidature);
    $("#" + district.id + ".district").find(".editDistrict").click(clickEditDistrict);
    
}

function clickEditDistrict(e){
    
    e.preventDefault();
    $("#modal-district-edit-form")[0].reset();
    
    var parent = $(this).parents().eq(2);
    var districtId = parseInt(parent.attr("id"));
    
    var name = elections.getDistrictAttribute(districtId, "name");
    var representatives = elections.getDistrictAttribute(districtId, "representatives");
    var nullVotes = elections.getDistrictAttribute(districtId, "null");
    var blankVotes = elections.getDistrictAttribute(districtId, "blank");
    
    $("#modal-district-edit-form").find(".text-input[name='name']").val(name);
    $("#modal-district-edit-form").find(".text-input[name='null']").val(nullVotes);
    $("#modal-district-edit-form").find(".text-input[name='blank']").val(blankVotes);
    $("#modal-district-edit-form").find(".text-input[name='representatives']").val(representatives);
    $("#modal-district-edit-form").find("#district-id[name='district']").val(districtId);
    
    
    $("#modal-district-edit").css("display", "block");

}

function submitEditDistrict(e){
    
    e.preventDefault();

    var districtInfo = $(this).serializeArray();
    
    var id = districtInfo[0].value;
    var name = districtInfo[1].value;
    var nullV = parseInt(districtInfo[2].value);
    var blank = parseInt(districtInfo[3].value);
    var representatives = parseInt(districtInfo[4].value);
    
    elections.setDistrictAttribute(id, "name", name);
    elections.setDistrictAttribute(id, "null", nullV);
    elections.setDistrictAttribute(id, "blank", blank);
    elections.setDistrictAttribute(id, "representatives", representatives);
    
    elections.updateConfiguration();
    editDistrict(elections.getDistrict(id));
    showConfiguration();
    closeModal();
}

function editDistrict(district){
    
    var districtDiv = $("#" + district.id + ".district");
    districtDiv.find("#singledistrict").text(district.name);
    districtDiv.find("#representatives").val(district.representatives);
    districtDiv.find("#nullVotes").val(district.null);
    districtDiv.find("#blankVotes").val(district.blank);

}

function clickRemoveDistrict(e){
    
    e.preventDefault();
    
    var districtId = $(this).parent().serializeArray()[0].value;
    elections.removeDistrict(districtId);

    removeDistrict(districtId);
    showConfiguration();
    closeModal();
}

function removeDistrict(districtId){
    
    
    $("#" + districtId + ".district").hide('slow', function(){
        $(this).remove();
        changeIdDistrict();
    });
        
}

function changeIdDistrict(){
    
    $(".district").each(function(id){
        $(this).attr("id", id);
    });
}

//___________________CANDIDATURES___________________
    //ADD CANDIDATURE
function clickAddCandidature(){

    $('#modal-candidature #district-id').val($(this).parents().eq(2).attr('id'));
    $('#modal-candidature').css('display', 'block');

}

function submitCandidature(e){
    
    e.preventDefault();
    
    var candidatureInfo = $(this).serializeArray();
    var newCandidature = JSON.parse(Model.getCandidatureModel());
    var districtId = parseInt(candidatureInfo[0].value);

    newCandidature.fullName = candidatureInfo[1].value;
    newCandidature.shortName = candidatureInfo[2].value;
    newCandidature.votes = parseInt(candidatureInfo[3].value);

    elections.addNewCandidature(districtId, newCandidature);
    
    addCandidature(elections.getCandidature(districtId, elections.districts[districtId].candidatures.length-1), districtId);
    
    closeModal();
    $("#modal-candidature-form")[0].reset();

}

function addCandidature(candidature, districtId){
                            
    $("#" + districtId + ".district" + " .district-content").children().last().before(
            
                        '<div class="candidature" id="' + candidature.id + '">\n\
                            <button type="button" class="collapsible collapsible-son" id="singlecandidature">' + candidature.shortName + '</button>\n\
                            <div class="collapsible-content candidature-content">\n\
                                <div class="modifyElement">\n\
                                    <button class="editButton editCandidature"> Editar </button>\n\
                                </div>\n\
                                <div class="collapsible-value">\n\
                                    <p id="fullName">' + candidature.fullName + '</p>\n\
                                </div>\n\
                                <div class="collapsible-value">\n\
                                    <p>Votos: </p>\n\
                                    <input id="votes" name="votes" value="' + candidature.votes + '" readonly>\n\
                                </div>\n\
                            </div>\n\
                        </div>' );

    expandCollapsibleParent($("#" + districtId + ".district" + " #singledistrict.collapsible"), 0);

    $("#" + districtId + ".district" + " #" + candidature.id + ".candidature" + " .collapsible").click(clickCollapsible);
    $("#" + districtId + ".district" + " #" + candidature.id + ".candidature" + " .editCandidature").click(clickEditCandidature);
}

function clickEditCandidature(e){
    
    e.preventDefault();
    
    $("#modal-candidature-edit-form")[0].reset();
    
    var parent = $(this).parents().eq(2);
    var districtParent = parent.parents().eq(1);
    var candidatureId = parseInt(parent.attr("id"));
    var districtId = parseInt(districtParent.attr("id"));
    
    
    var shortName = elections.getCandidatureAttribute(districtId, candidatureId, "shortName");
    var fullName = elections.getCandidatureAttribute(districtId, candidatureId, "fullName");
    var votes = elections.getCandidatureAttribute(districtId, candidatureId, "votes");
    
    $("#modal-candidature-edit-form").find(".text-input[name='shortName']").val(shortName);
    $("#modal-candidature-edit-form").find(".text-input[name='fullName']").val(fullName);
    $("#modal-candidature-edit-form").find(".text-input[name='votes']").val(votes);
    $("#modal-candidature-edit-form").find("#district-id").val(districtId);
    $("#modal-candidature-edit-form").find("#candidature-id").val(candidatureId);
    
    
    $("#modal-candidature-edit").css("display", "block");

}

function submitEditCandidature(e) {
    
    e.preventDefault();
    
    var candidatureInfo = $(this).serializeArray();
    var newCandidature = JSON.parse(Model.getCandidatureModel());
    
    var districtId = parseInt(candidatureInfo[0].value);
    var candidatureId = parseInt(candidatureInfo[1].value);
    newCandidature.id = candidatureId;
    newCandidature.fullName = candidatureInfo[2].value;
    newCandidature.shortName = candidatureInfo[3].value;
    newCandidature.votes = parseInt(candidatureInfo[4].value);

    elections.setCandidature(districtId, candidatureId, newCandidature);
    
    editCandidature(elections.getCandidature(districtId, candidatureId), districtId);
    closeModal();
    
}

function editCandidature(candidature, districtId){
    
    var candidatureDiv = $("#" + districtId + ".district" + " #" + candidature.id + ".candidature");
    candidatureDiv.find("#singlecandidature").text(candidature.shortName);
    candidatureDiv.find("#fullName").text(candidature.fullName);
    candidatureDiv.find("#votes").val(candidature.votes);
}

function clickRemoveCandidature(e){
    
    e.preventDefault();
    
    var districtId = $(this).parent().serializeArray()[0].value;
    var candidatureId = $(this).parent().serializeArray()[1].value;
        
    elections.removeCandidature(districtId, candidatureId);
    
    removeCandidature(districtId, candidatureId);
    closeModal();
    
}

function removeCandidature(districtId, candidatureId){

    
    $("#" + districtId + ".district" + " #" + candidatureId + ".candidature").hide('slow', function(){
        $(this).remove();
        changeIdCandidature(districtId);
    });
    

    
}

function changeIdCandidature(districtId){
    
    $("#" + districtId + ".district" + " .candidature").each(function(id){
        $(this).attr("id", id);
    });
    
}
//INPUT VALIDATION

function thresholdInput(){
    
    var re = new RegExp("^[0-9]*[.]?[0-9]+$");
    var value = $(this).val();


    if(!re.test(value)){
        $(this)[0].setCustomValidity("Introduce un porcentaje.");
    } else if(value < 0){
        $(this)[0].setCustomValidity("El umbral debe ser mínimo 0.");
    } else if(value > 100){
        $(this)[0].setCustomValidity("El umbral debe ser 100 como máximo.");
    } else {
        $(this)[0].setCustomValidity("");
    }
}

function monthInput(){
 
    var re = new RegExp("^(0?[1-9]|1[012])$");
    
    var value = $(this).val();

    if(!re.test(value)){
        $(this)[0].setCustomValidity("Introduce un mes.");
    } else {
        $(this)[0].setCustomValidity("");
    }

}

function yearInput(){
    
    var re =  new RegExp("^([0-9])+$");
    
    var value = $(this).val();

    if(!re.test(value)){
        $(this)[0].setCustomValidity("Introduce un año.");
    } else {
        $(this)[0].setCustomValidity("");
    }
}

function intInput(){
    
    var re = new RegExp("^[-+]?[0-9]+$");
    
    var value = $(this).val();
    
    if(!re.test(value)){
        $(this)[0].setCustomValidity("Introduce un número entero.");
    } else if(value < 0){
        
        $(this)[0].setCustomValidity("El número tiene que ser mínimo 0.");
        
    }else {

        $(this)[0].setCustomValidity("");
    }
    
}
function districtsKeyDown(e){
    e.preventDefault();
}

function districtsChange(){
    
    var value = parseInt($(this).val());
    if(value <= 0){
        $(this)[0].setCustomValidity("Tiene que existir al menos un representante.");
    } else{
        $(this)[0].setCustomValidity("");
    }
    
}

function submitElection(e){
    
    e.preventDefault();
    
    
    var data = {};
    data.configuration = elections.getConfiguration();
    data.districts = elections.getDistricts();
        
    localStorage.setItem('lastElection2020', JSON.stringify(data));
    $("#last-submit").prop('disabled', false);
    
    var result = dhondtHistory(data);
    createChart(result);
    createTable(result);
}

function createChart(result){
    
    var sum = sumResult(result);
    
    var data = { 
        "labels" : [],
        "datasets" : [{
                "data" : [],
                "backgroundColor" :[],
                "hoverBackgroundColor" :[]
            }]
        
    };

    for(var key in sum){
        var r = Math.floor(Math.random() * 200);
        var g = Math.floor(Math.random() * 200);
        var b = Math.floor(Math.random() * 200);
        var c = 'rgb(' + r + ', ' + g + ', ' + b + ')';
        var h = 'rgb(' + (r+20) + ', ' + (g+20) + ', ' + (b+20) + ')';
        var v = sum[key][1];
        
        data.datasets[0].data.push(v);
        data.datasets[0].backgroundColor.push(c);       
        data.datasets[0].hoverBackgroundColor.push(h);
        data.labels.push(key);
    }

    $("main #chart-box #chart").remove();
    $("main #chart-box").append('<canvas id="chart" width="400" height="400"></canvas>');

    var ctx = document.getElementById('chart').getContext('2d');
                  
    
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
            cutoutPercentage : 40,
            circumference : Math.PI,
            responsive : false,
            rotation : Math.PI,
            title : {
                display: true,
                text: "Resultados electorales:"
            }
        }
    });
    
    
}

function createTable(result){
    var sum = sumResult(result);
    
    $("main #table-box #result-table").remove();
    $("main #table-box").append('\n\
        <table id="result-table">\n\
            <thead>\n\
                <tr>\n\
                    <th title="shortName">Nombre Corto</th>\n\
                    <th title="fullName">Nombre Largo</th>\n\
                    <th title="votes">Votos</th>\n\
                    <th title="result">Escaños</th>\n\
                </tr>\n\
            </thead>\n\
            <tbody>\n\
            </tbody>\n\
        </table>');
    
    var totalVotes = 0;
    var totalValidVotes = 0;
    var totalBlankVotes = 0;
    var totalNullVotes = 0;
    
    for(var d in result){
        totalBlankVotes += result[d][0].blank;
        totalNullVotes += result[d][0].null;
        for(var c in result[d]){
            if(c == 0){
                continue;
            }
            totalValidVotes += result[d][c][0].votes;
            
        }
    }
    totalValidVotes += totalBlankVotes;
    totalVotes += totalValidVotes + totalNullVotes;
    var tableRows = [];

    for(var key in sum){
        var r = sum[key][1];
        var votes = 0;
        var fullName = "";
        var shortName = "";
        
        for(var idx in sum[key][0]){
            var d = parseInt(sum[key][0][idx][0]);
            var c = parseInt(sum[key][0][idx][1]);
            if(idx == 0){
                fullName = result[d][c][0].fullName;
                shortName = result[d][c][0].shortName;
            }
            votes += result[d][c][0].votes;
        }
        tableRows.push({"shortName" : shortName, "fullName" : fullName, "votes" : votes, "result" : r });
        
    }
    
    for(var row in tableRows){
        $("main #table-box tbody").append('\n\
            <tr>\n\
                <td>'+ tableRows[row].shortName +'</td>\n\
                <td>'+ tableRows[row].fullName +'</td>\n\
                <td>'+ tableRows[row].votes +'</td>\n\
                <td>'+ tableRows[row].result +'</td>\n\
            </tr>\n\
            ');
    }
    var type = elections.getConfigurationAttribute('type');
    var threshold = elections.getConfigurationAttribute('threshold');
    var month = elections.getConfigurationAttribute('month');
    var year = elections.getConfigurationAttribute('year');
    var districts = elections.getConfigurationAttribute('districts');
    
    $("main #table-box tbody").append('\n\
            <tr>\n\
                <td><b>Elecciones ' + type + '</b></td>\n\
                <td>Total votos</td>\n\
                <td>' + totalVotes + '</td>\n\
                <td></td>\n\
            </tr>\n\
            <tr>\n\
                <td><b>Umbral: ' + threshold + '%' + '</b></td>\n\
                <td>Votos Válidos</td>\n\
                <td>' + totalValidVotes + '</td>\n\
                <td></td>\n\
            </tr>\n\
            <tr>\n\
                <td><b>Fecha: ' + month + '/' + year + '</b></td>\n\
                <td>Votos en Blanco</td>\n\
                <td>' + totalBlankVotes + '</td>\n\
                <td></td>\n\
            </tr>\n\
            <tr>\n\
                <td><b>N° Circunscripciones: ' + districts + '</b></td>\n\
                <td>Votos nulos</td>\n\
                <td>' + totalNullVotes + '</td>\n\
                <td id="downloadTable">\n\
                    <button onclick="exportTableToCSV(' + "'resultSimulation" + month + year + ".csv'" + ')">\n\
                    Descargar<br>Tabla</button>\n\
                </td>\n\
            </tr>\n\
            ');
    
}

function sumResult(result){
    
    var sum = {};
    
    for(var d in result){
        for(var c in result[d]){
            if(c == 0){
                continue;
            }
            if(result[d][c][0].shortName in sum){
                sum[result[d][c][0].shortName][1] += result[d][c][1];
                sum[result[d][c][0].shortName][0].push([d,c]);
            } else {
                sum[result[d][c][0].shortName] = [[[d,c]], result[d][c][1]];
            }
        }
    }

    return sum;
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");
    
    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (var j = 0; j < cols.length; j++) 
            row.push(cols[j].innerText);
        
        csv.push(row.join(","));        
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    csvFile = new Blob([csv], {type: "text/csv"});

    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
   
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function clickLastSimulation(e){
    
    e.preventDefault();
    
    
    for(var d in elections.districts){
        removeDistrict(d);
    }
    
    var data = JSON.parse(localStorage.getItem('lastElection2020'));
        
    $(".dropdown").trigger("click");
    $(".dropdown" + " #" + data.configuration.type).trigger("click");
    
    elections.setConfiguration(data.configuration);
    elections.setDistricts(data.districts);
    showConfiguration();
    
    for(var d in elections.districts){
        var district = elections.districts[d];
        addDistrict(district);
        for(var c in district.candidatures){
            addCandidature(district.candidatures[c], d);
        }

    }
    
    expandCollapsibleParent($("#" + 0 + ".district" + " #singledistrict.collapsible"), 0);
}