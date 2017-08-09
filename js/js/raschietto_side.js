/* APRE HELP DIALOG */

//
function openHelp(){

    var $bodyDialog = $('<div></div>');

    var carousel = '<div id="myCarousel" class="carousel slide" data-ride="carousel">'+
        '<!-- Wrapper for slides -->'+
        '<div class="carousel-inner" role="listbox">'+
        '<div class="item active"> ' +
        '<img src="./img/help02.gif" alt="2" /> ' +
        '</div> ' +
        '    <div class="item"> ' +
        '      <img src="./img/help03.gif" alt="3" /> ' +
        '    </div>' +
        '    <div class="item"> ' +
        '      <img src="./img/help04.gif" alt="4"  />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help05.gif" alt="5" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help06.gif" alt="6" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help07.gif" alt="7" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help08.gif" alt="8" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help09.gif" alt="9" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help10.gif" alt="10" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help11.gif" alt="11" />' +
        '    </div>' +
        '    <div class="item">' +
        '      <img src="./img/help12.gif" alt="12" />' +
        '    </div>' +
        '</div>'+
        '<!-- Controls -->'+
        '<a class="left carousel-control" data-target="#myCarousel" role="button" data-slide="prev">'+
        '<span class="glyphicon glyphicon-chevron-left"></span>'+
        '</a>'+
        '<a class="right carousel-control" data-target="#myCarousel" role="button" data-slide="next">'+
        '<span class="glyphicon glyphicon-chevron-right"></span>'+
        '</a>'+
        '</div> <!-- Carousel -->';

    $bodyDialog.append(carousel);

    var dialog = new BootstrapDialog.show({
        title: 'Help',
        message: $bodyDialog,
        type: BootstrapDialog.TYPE_DEFAULT
    });

    dialog.getModalHeader().css("background-color", "#d7d7d7");

}

/* APRE ABOUT DIALOG */
function openAbout(){

    var $bodyDialog = $('<div></div>');
    $bodyDialog.append('<p><b>ToRaGaMa\'s Raschietto</b> powered by:<br /><br />'+
    'Alessandro Rappini - alessandro.rappini@studio.unibo.it<br />'+
    'Francesco Galasso - francesco.galasso3@studio.unibo.it<br />'+
    'Simone Matteucci - simone.matteucci2@studio.unibo.it</p><br />' +
    '<p><b>Questo progetto usa anche librerie e fonts esterni</b>:<br />'+
    '<ul><li>Bootstrap v3.3.5 - <a href="http://getbootstrap.com">http://getbootstrap.com</a></li>'+
    '<li>JQuery v.2.1.4 - <a href="http://jquery.com/">https://jquery.com/</a></li>' +
    '<li>Bootstrap Dialog - <a href="http://nakupanda.github.io/bootstrap3-dialog/">http://nakupanda.github.io/bootstrap3-dialog/</a></li>'+
    '<li>Bootstrap Switch - <a href="http://www.bootstrap-switch.org/">http://www.bootstrap-switch.org/</a></li>' +
    '<li>Bootstrap Notify - <a href="http://bootstrap-notify.remabledesigns.com/">http://bootstrap-notify.remabledesigns.com/</a></li>' +
    '<li>JS Cookie - <a href="https://github.com/js-cookie/js-cookie">https://github.com/js-cookie/js-cookie</a></li>' +
    '<li>Font Awesome - <a href="https://fortawesome.github.io/Font-Awesome/">https://fortawesome.github.io/Font-Awesome/</a></li>' +
    '<li>Lato Fonts - <a href="http://www.latofonts.com/lato-free-fonts/">http://www.latofonts.com/lato-free-fonts/</a></li>' +
    '<li>Rangy - <a href="https://github.com/timdown/rangy">https://github.com/timdown/rangy</a></li>' +
    '<li>MomentJS - <a href="http://momentjs.com/">http://momentjs.com/</a></li>');

    var dialog = new BootstrapDialog.show({
        title: 'About this project...',
        message: $bodyDialog,
        type: BootstrapDialog.TYPE_DEFAULT
    });

    dialog.getModalHeader().css("background-color", "#d7d7d7");

}

/* COMPORTAMENTO SWITCH */
$("[name='switch-mode']").bootstrapSwitch();

// VERIFICO SE ESISTONO GIA' COOKIE PER LAVORARE IN MODALITA' ANNOTATOR,
// ALTRIMENTI AZZERO I COOKIE E LAVORO IN MODALITA' READER, POI SETTO COMPORTAMENTO SWITCH
$(window).load(function(){
    if(Cookies.get('name')!=undefined && Cookies.get('email')!=undefined){
        $("[name='switch-mode']").bootstrapSwitch('state',false,false);
    }
    else {
        Cookies.remove('name');
        Cookies.remove('email');
        $("[name='switch-mode']").bootstrapSwitch('state',true,true);
    }
    // SE ENTRO IN MODALITA' ANNOTATOR, MOSTRO IL POPUP PER POTER SETTARE I COOKIE E LAVORO
    // IN MODALITA' ANNOTATOR, SE PASSO IN MODALITA' READER ELIMINO I COOKIE E TOLGO LA POSSIBILITA' DI FARE ANNOTAZIONI
    $("[name='switch-mode']").on('switchChange.bootstrapSwitch', function(event, state) {
        if(state==true){
            Cookies.remove('name');
            Cookies.remove('email');
            $document.trigger('cookieUnset');
        }
        else {
            openAnnotatorMode();
        }
    });
});



/* DIALOG SWITCH */
function openAnnotatorMode(){

    var $bodyDialog = $('<div class="form-group"></div>');
    $bodyDialog.append('<div class="form-group"></div>'+
        '<label id="nameAnnotatorLabel" for="nameAnnotator">Nome</label>'+
    '<input type="text" class="form-control" id="nameAnnotator" placeholder="Il tuo nome" value="ToRaGaMa"></div>'+
        '<div class="form-group"></div>'+
    '<label id="emailAnnotatorLabel" for="emailAnnotator">Indirizzo email</label>'+
    '<input type="email" class="form-control" id="emailAnnotator" placeholder="Il tuo indirizzo email" value="toragama@ltw1539.web.cs.unibo.it"></div>');

    var dialog = new BootstrapDialog.show({
        title: 'Modalità Annotator',
        message: $bodyDialog,
        type: BootstrapDialog.TYPE_DEFAULT,
        closable: false,
        buttons: [{
            label: 'Passa ad Annotator',
            cssClass: 'btn-primary',
            action: function(dialog){
                if($("#nameAnnotator").val().trim()!='' && $("#emailAnnotator").val().trim()!='') {
                    // RESET COLORI
                    $("#nameAnnotator").attr("style", "");
                    $("#nameAnnotatorLabel").attr("style", "");
                    $("#emailAnnotator").attr("style", "");
                    $("#emailAnnotatorLabel").attr("style", "");

                    Cookies.set('name', $("#nameAnnotator").val().trim(), {expires: 1});
                    Cookies.set('email', $("#emailAnnotator").val().trim(), {expires: 1});
                    $(document).trigger('cookieSet');
                    dialog.close();
                }
                else {
                    if($("#nameAnnotator").val().trim()==''){
                        $("#nameAnnotator").attr("style", "outline: none; border-color: #ba0000; box-shadow: 0 0 10px #ba0000;");
                        $("#nameAnnotatorLabel").attr("style", "color: #ba0000;");
                    }
                    else {
                        $("#nameAnnotator").attr("style", "");
                        $("#nameAnnotatorLabel").attr("style", "");
                    }
                    if($("#emailAnnotator").val().trim()==''){
                        $("#emailAnnotator").attr("style", "outline: none; border-color: #ba0000; box-shadow: 0 0 10px #ba0000;");
                        $("#emailAnnotatorLabel").attr("style", "color: #ba0000;");
                    }
                    else {
                        $("#emailAnnotator").attr("style", "");
                        $("#emailAnnotatorLabel").attr("style", "");
                    }
                }
            }},
            {
                label: 'Rimani a Reader',
                cssClass: 'btn-danger',
                action: function(dialog){
                    $("[name='switch-mode']").bootstrapSwitch('state',true,true);
                    dialog.close();
                }
        }]
    });

    dialog.getModalHeader().css("background-color", "#d7d7d7");

}