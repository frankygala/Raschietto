/* DIALOG ANNOTAZIONE */

var dialogInserimento;
var $dial;
// INSERIMENTO ANNOTAZIONI
// APRO LA MODAL CHE MI PERMETTE DI INSERIRE UN'ANNOTAZIONE SUL DOCUMENTO
// DOPO LA SELEZIONE DEL FRAMMENTO CHE DEVE ESSERE CORRETTA, NON SU PIU' NODI
// E SELEZIONATA DA SINISTRA VERSO DESTRA
// Simone
function openAnnotationModal($selectedText) {

    if($startSelection==undefined){
        $startSelection=0;
        $endSelection=0;
    }

    if ($startSelection >= 0) {

        // Se entro nel metodo dalla modalita' di modifica, resetto e riabilito i pulsanti
        // cambiati entrando nella modalità di modifica
        if (modalitaModifica) {
            $("#" + $('#tabsContent').find(".active")[0].getAttribute('id') + " .menuAnnotationMobile .btn-info")[0].children[0].setAttribute('class', 'fa fa-edit');
            $("#" + $('#tabsContent').find(".active")[0].getAttribute('id') + " .menuAnnotationMobile .btn-primary").prop('disabled', false);
            $("#" + $('#tabsContent').find(".active")[0].getAttribute('id') + " .menuAnnotationMobile .btn-success").prop('disabled', false);
            $($("#" + $('#tabsContent').find(".active")[0].getAttribute('id') + " .menuAnnotationMobile .btn-info")[0]).attr('data-original-title', 'Inserisci Annotazione');
            modalitaModifica = false;
        }

        // Estraggo timestamp annotazione, lo sistemo e lo salvo in variabile
        var date = new Date();
        var $timestampAnnotation = '' + date.getFullYear() + '-';
        if (((date.getMonth() + 1) >= 1) && ((date.getMonth() + 1) <= 9)) {
            $timestampAnnotation += '0' + (date.getMonth() + 1) + "-";
        } else {
            $timestampAnnotation += (date.getMonth() + 1) + "-";
        }
        if (((date.getDate()) >= 1) && ((date.getDate()) <= 9)) {
            $timestampAnnotation += '0' + (date.getDate());
        } else {
            $timestampAnnotation += (date.getDate());
        }
        if (((date.getHours()) >= 0) && ((date.getHours()) <= 9)) {
            $timestampAnnotation += 'T0' + (date.getHours()) + ":";
        } else {
            $timestampAnnotation += "T" + (date.getHours()) + ":";
        }
        if (((date.getMinutes()) >= 0) && ((date.getMinutes()) <= 9)) {
            $timestampAnnotation += '0' + (date.getMinutes());
        } else {
            $timestampAnnotation += (date.getMinutes());
        }

        // Rendo "fisso" e "statico" il testo selezionato, in modo tale che
        // se clicco da altre parti, la selezione effettuata rimane quella
        // (non creo una reference all'oggetto, ma creo una copia di esso)
        var $selText = $.extend(true, {}, $selectedText);

        var caseDocument = false;

        var $bodyDialog = $('<div></div>');
        var frammentoSel = frammentoSelezionato.replace(/"/g, "&quot;");
        frammentoSel = frammentoSel.replace(/\n/g, " ");
        // Se non e' stato selezionato niente, l\'annotazione e' fatta sull'intero documento, quindi
        // mostro un certo corpo della modal...
        if (($startSelection - $endSelection == 0) || ($selectedText == null) || (frammentoSel == "")) {
            caseDocument = true;
            //qui appendo
            $bodyDialog.append(bodyInsertAnnotation("intero","***ANNOTAZIONE SU INTERO DOCUMENTO***","",Cookies.get('name'),Cookies.get('email'),$timestampAnnotation));
        }
        else {
            // ...altrimenti mostro il corpo relativo all'inserimento dell'annotazione su un frammento
            //qui appendo
            $bodyDialog.append(bodyInsertAnnotation("frammento",frammentoSel,frammentoSel,Cookies.get('name'),Cookies.get('email'),$timestampAnnotation));
        }

        // funzione richiamata per nascondere tutti gli input utilizzabili
        function hideAll() {
            $("#form-group-rhetoric").hide();
            $("#form-group-comment").hide();
            $("#form-group-year").hide();
            $("#form-group-author").hide();
            $("#form-group-title").hide();
            $("#form-group-url").hide();
            $("#form-group-cites").hide();
            $("#form-group-doi").hide();
        }

        // Genero la modal per effettuare l'inserimento dell'annotazione
        // con il corpo generato sopra
        dialogInserimento = new BootstrapDialog.show({
            title: 'Inserisci Annotazione',
            message: $bodyDialog,
            type: BootstrapDialog.TYPE_DEFAULT,
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            onshown: function () { // mostrata la dialog di inserimento,
                // sul cambio del tipo di annotazione che voglio inserire,
                // nascondo tutti i campi e mostro quello che mi interessa
                $("#typeAnnotation").on('change', function () {
                    switch ($("#typeAnnotation").val()) {
                        case "hasTitle":
                            hideAll();
                            $("#form-group-title").show();
                            break;
                        case "hasAuthor":
                            hideAll();
                            $("#form-group-author").show();
                            break;
                        case "hasPublicationYear":
                            hideAll();
                            $("#form-group-year").show();
                            break;
                        case "hasURL":
                            hideAll();
                            $("#form-group-url").show();
                            break;
                        case "hasComment":
                            hideAll();
                            $("#form-group-comment").show();
                            break;
                        case "denotesRhetoric":
                            hideAll();
                            $("#form-group-rhetoric").show();
                            break;
                        case "cites":
                            hideAll();
                            $("#form-group-cites").show();
                            break;
                        case "hasDOI":
                            hideAll();
                            $("#form-group-doi").show();
                            break;

                    }
                });
                // ottengo la lista autori dal mio grafo
                listaAutori();
                if($typeAnnotation!=""){
                    $("#typeAnnotation").val($typeAnnotation);
                    switch ($typeAnnotation) {
                        case "hasTitle":
                            hideAll();
                            $("#form-group-title").show();
                            break;
                        case "hasAuthor":
                            hideAll();
                            $("#form-group-author").show();
                            break;
                        case "hasPublicationYear":
                            hideAll();
                            $("#form-group-year").show();
                            break;
                        case "hasURL":
                            hideAll();
                            $("#form-group-url").show();
                            break;
                        case "hasComment":
                            hideAll();
                            $("#form-group-comment").show();
                            break;
                        case "denotesRhetoric":
                            hideAll();
                            $("#form-group-rhetoric").show();
                            break;
                        case "cites":
                            hideAll();
                            $("#form-group-cites").show();
                            break;
                        case "hasDOI":
                            hideAll();
                            $("#form-group-doi").show();
                            break;
                    }
                    $typeAnnotation="";
                }
            },
            buttons: [{ // creo i bottoni presenti sotto la modal
                label: 'Inserisci Annotazione',
                cssClass: 'btn-primary',
                action: function (dialog) {
                    //console.log($selectedText);
                    // Inserisco l'annotazione

                    var $predic;
                    var $object;
                    // Ricavo predicate
                    switch ($("#typeAnnotation").val()) {
                        case "hasAuthor":
                            $predic = "dcterms:creator";
                            $object = "L\'autore del documento e' " + $('#authorAnnotation').val();
                            break;
                        case "hasPublicationYear":
                            $predic = "fabio:hasPublicationYear";
                            $object = "L\'anno di pubblicazione del documento e' " + $('#yearAnnotation').val();
                            break;
                        case "hasTitle":
                            $predic = "dcterms:title";
                            $object = "Il titolo del documento e' " + $('#titleAnnotation').val();
                            break;
                        case "hasDOI":
                            $predic = "prism:doi";
                            $object = "Il DOI del documento e' " + $('#doiAnnotation').val();
                            break;
                        case "hasURL":
                            $predic = "fabio:hasURL";
                            $object = "L\'url del documento e' " + $('#urlAnnotation').val();
                            break;
                        case "hasComment":
                            $predic = "schema:comment";
                            $object = $('#commentAnnotation').val();
                            break;
                        case "denotesRhetoric":
                            $predic = "semiotics.owl#denotes";
                            $object = "Il frammento selezionato e' un " + $('#typeRhetoric option:selected').text();
                            break;
                        case "cites":
                            $predic = "cito:cites";
                            $object = "Il frammento citato e' " + $('#citesAnnotation').val();
                        default:
                            break;
                    }
                    ;

                    var $domAnnotazione;
                    var $objectAnnotazione;
                    var $labelAnnotazione;

                    // Se non sto creando un'annotazione sull'intero documento...
                    if (!caseDocument) {

                        $objectAnnotazione = $("#fragmentAnnotation").val();
                        $labelAnnotazione = $("#fragmentAnnotation").val();

                        var $domOriginario;
                        // Sostituisco con prima parte dom originario
                        if ($('#tabsContent').find(".active").attr("uri-document").indexOf("dlib.org") != -1) {
                            $domOriginario = "html_body_form_table3_tr_td_table5_tr_td_table1_tr_td2_";
                        }
                        else if ($('#tabsContent').find(".active").attr("uri-document").indexOf(".unibo.it") != -1) {
                            $domOriginario = "html_body_div_div_div_div_";
                        }
                        else {
                            $domOriginario = "html_body_";
                        }

                        // Per uso interno, salvo riferimento al div interno su cui ho creato l'annotazione
                        $domAnnotazione = $selectedElement.replace("/html/body/div/div[2]/div/div[" + document.getElementById($('#tabsContent').find(".active")[0].id).parentNode.children.length + "]/", $domOriginario);
                        $domAnnotazione = $domAnnotazione.replace(/[[\]]/g, "");
                        $domAnnotazione = $domAnnotazione.replace(/\//g, "_");
                        if ($domAnnotazione.indexOf('_h3') != -1 && $('#tabsContent').find(".active").attr("uri-document").indexOf(".unibo.it") != -1) {
                            $domAnnotazione = $domAnnotazione.substr(0, $domAnnotazione.indexOf('_h3'));
                        }
                    }
                    else { // Se invece sto facendo un'annotazione su documento intero
                        // il mio dom e' vuoto (non ho selezionato nulla)
                        $domAnnotazione = "";
                        // il mio start e il mio end sono nulli perche' non ho selezionato niente
                        $startSelection = 0;
                        $endSelection = 0;
                        // Sostituisco la parola frammento con documento per risparmiare righe di codice
                        // per poterlo inserire come commento nel body label
                        $object = $object.replace("frammento", "documento");

                        // ottengo il testo del commento inserito sostituendo la stringa generata
                        // per risparmiare righe di codice
                        var cleanText = $object;

                        cleanText = cleanText.replace("L\'autore del documento e' ", "");
                        cleanText = cleanText.replace("L\'anno di pubblicazione del documento e' ", "");
                        cleanText = cleanText.replace("Il titolo del documento e' ", "");
                        cleanText = cleanText.replace("Il DOI del documento e' ", "");
                        cleanText = cleanText.replace("L\'url del documento e' ", "");
                        cleanText = cleanText.trim();

                        // setto le stringhe generate per permettere l'inserimento nell'oggetto
                        $objectAnnotazione = cleanText;
                        $labelAnnotazione = cleanText;
                    }

                    var $bodySubject = $('#tabsContent').find(".active").attr("uri-document").replace(".html", "").replace(".php", "") + "_ver1";

                    // creo l'annotazione
                    var $annotazioneCreata = {
                        type: $("#typeAnnotation").val(),
                        label: $("#typeAnnotation").children("option:selected").text(),
                        body: {
                            subject: $bodySubject,
                            label: $labelAnnotazione,
                            predicate: $predic,
                            object: $objectAnnotazione,
                            bodyLabel: $object
                        },
                        target: {
                            start: $startSelection,
                            end: $endSelection,
                            id: $domAnnotazione,
                            source: $('#tabsContent').find(".active").attr("uri-document")
                        },
                        provenance: {
                            author: {
                                name: $("#nameAnnotatorAnnotation").val(),
                                email: $("#emailAnnotatorAnnotation").val()
                            },
                            time: $("#timestampAnnotation").val()
                        },
                        internalData: {
                            divId: $('#tabsContent').find(".active").attr('id'),
                            fullDocTitle: $('#tabsContent').find(".active").attr('full-doc-title'),
                            tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                            annotationId: $contaAnnotazioniProvvisorie,
                            xpath: $selectedElement,
                            spedita: false
                        }
                    }

                    // la inserisco nella lista di annotazioni inserite
                    $listaAnnotazioni.push($annotazioneCreata);

                    //console.log("listaAnnotazioni");
                    //console.log($listaAnnotazioni);


                    // Chiudo la dialog
                    dialog.close();

                    // Mostro un alert di corretto inserimento annotazione
                    var $confirmInsert = $("<div></div>");
                    $confirmInsert.append('<div class="alert alert-success customAlert" id="alert" role="alert">Annotazione inserita o modificata correttamente</div>');
                    $('#tabsContent').append($confirmInsert.fadeIn(800));
                    window.setTimeout(function () {
                        $confirmInsert.fadeOut(800);
                        window.setTimeout(function () {
                            $confirmInsert.remove();
                        }, 800);
                    }, 2500);

                    // Mostro l'annotazione appena creata nel documento

                    if (!caseDocument) { // se non sto creando un documento
                        //console.log("selText");
                        //console.log($selText);
                        //console.log("element");
                        //console.log($nodoSelezionatoNoSpan);
                        //console.log("typeannotation");

                        var tempType = $annotazioneCreata.body.predicate;
                        var type = "";

                        if (tempType.indexOf('/') != -1) {
                            type = tempType.substr(tempType.lastIndexOf('/') + 1);
                        }
                        else {
                            type = tempType.substr(tempType.lastIndexOf(':') + 1);
                        }

                        //console.log(type);

                        // var nodeG= document.evaluate(result.replace(/\"/g, ""), document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        setSelectionRange($nodoSelezionatoNoSpan, $startSelection, $endSelection, type, "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                    }

                    $contaAnnotazioniProvvisorie++;

                }
            },
                {
                    label: 'Chiudi',
                    cssClass: 'btn-danger',
                    action: function (dialog) {
                        $("#page-content-wrapper").find(".temp_highlight").removeClass("temp_highlight");
                        dialog.close();
                    }
                }]
        });

        dialogInserimento.getModalHeader().css("background-color", "#d7d7d7");

    } else {
        // Se la selezione non e' corretta, mostro una notifica di selezione non valida
        $.notify({
            message: 'La selezione effettuata non &egrave; valida'
        }, {
            type: 'danger',
            position: 'fixed',
            allow_dismiss: true,
            placement: {
                from: "bottom",
                align: "right"
            },
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            delay: 2000
        });
    }
}

// Quando entro in modalita modifica selezione dall'inserimento, chiudo la dialog ed entro in
// modalita modifica
// Simone
function nascondiPerModifica(){
    dialogInserimento.close();
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0].children[0].setAttribute('class','fa fa-pencil');
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-primary").prop('disabled',true);
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-success").prop('disabled',true);
    $($("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0]).attr('data-original-title','Modifica Selezione');
    modalitaModifica=true;
}

/* DIALOG ANNOTAZIONE */
// APRO LA MODAL CHE MI PERMETTE DI MODIFICARE UN'ANNOTAZIONE SUL DOCUMENTO
// GIA' INSERITA PRECEDENTEMENTE
// Simone
var $dialogTemporanea;
var $timestampEdit="";
var $typeAnnotation="";
function editAnnotation($annotation) {

    if(lastModalOpened=="manageAnnotations") {
        // chiudo la finestra di gestione delle annotazioni temporanee inserite
        $dialogManageAnnotations.close();
    }
    else if(lastModalOpened=="modalTempAnnotation"){
        $dialogModalTempAnnotation.close();
    }
    else if(lastModalOpened=="dialogIntero"){
        dialogIntero.close();
    }

    // cerco su quale annotazione voglio lavorare
    var $editAnnot = null;
    for (var i = 0; i < $listaAnnotazioni.length; i++) {
        if ($listaAnnotazioni[i].internalData.annotationId == $annotation) {
            //console.log("trovato");
            //console.log($listaAnnotazioni[i]);
            $editAnnot = $listaAnnotazioni[i];
            break;
        }
    }

    // se non ho trovato l'annotazione temporanea su cui voglio lavorare, non faccio niente
    if ($editAnnot != null) {

        // genero il widget degli anni da selezionare
        var yearOptionList = function () {
            var list = "";
            for (var $year = 2016; $year >= 1800; $year--) {
                list += '<option value="' + $year + '">' + $year + '</option>';
            }
            return list;
        }

        // pulisco il testo del commento per poterlo inserire nelle caselle presenti nella modal
        // e renderlo disponibile di default nella modal
        var cleanText = $editAnnot.body.object;

        cleanText = cleanText.replace("L\'autore del frammento e' ", "");
        cleanText = cleanText.replace("L\'anno di pubblicazione del frammento e' ", "");
        cleanText = cleanText.replace("Il titolo del frammento e' ", "");
        cleanText = cleanText.replace("Il DOI del frammento e' ", "");
        cleanText = cleanText.replace("L\'url del frammento e' ", "");
        cleanText = cleanText.replace("L\'autore del documento e' ", "");
        cleanText = cleanText.replace("L\'anno di pubblicazione del documento e' ", "");
        cleanText = cleanText.replace("Il titolo del documento e' ", "");
        cleanText = cleanText.replace("Il DOI del documento e' ", "");
        cleanText = cleanText.replace("L\'url del documento e' ", "");
        cleanText = cleanText.replace("Il frammento selezionato e' un ", "");
        cleanText = cleanText.replace("Il documento selezionato e' un ", "");
        cleanText = cleanText.replace("Il frammento citato e' ", "");
        cleanText = cleanText.trim();

        var caseDocument = false;

        var $bodyDialog = $('<div></div>');
        if (($editAnnot.target.start - $editAnnot.target.end) == 0) { // se sono nel caso di annotazione su documento...
            caseDocument = true;
            // ...genero un certo corpo della modal...
            $bodyDialog.append(bodyInsertAnnotation("intero","***ANNOTAZIONE SU INTERO DOCUMENTO***",cleanText,$editAnnot.provenance.author.name,$editAnnot.provenance.author.email,$editAnnot.provenance.time,$annotation));
        } else {
            // ..altrimenti genero il corpo della modal per il caso di annotazione su frammento
            $bodyDialog.append(bodyInsertAnnotation("frammento",$editAnnot.body.label,cleanText,$editAnnot.provenance.author.name,$editAnnot.provenance.author.email,$editAnnot.provenance.time,$annotation));
        }

        // nascondo tutti i widget della modal
        function hideAll() {
            $("#form-group-rhetoric").hide();
            $("#form-group-comment").hide();
            $("#form-group-year").hide();
            $("#form-group-author").hide();
            $("#form-group-title").hide();
            $("#form-group-url").hide();
            $("#form-group-cites").hide();
            $("#form-group-doi").hide();
        }

        // mostro il widget selezionato
        switch ($editAnnot.type) {
            case "hasTitle":
                hideAll();
                $("#form-group-title").show();
                break;
            case "hasAuthor":
                hideAll();
                $("#form-group-author").show();
                break;
            case "hasPublicationYear":
                hideAll();
                $("#form-group-year").show();
                break;
            case "hasURL":
                hideAll();
                $("#form-group-url").show();
                break;
            case "hasComment":
                hideAll();
                $("#form-group-comment").show();
                break;
            case "denotesRhetoric":
                hideAll();
                $("#form-group-rhetoric").show();
                break;
            case "cites":
                hideAll();
                $("#form-group-cites").show();
                break;
            case "hasDOI":
                hideAll();
                $("#form-group-doi").show();
                break;
        }

        // creo e visualizzo la dialog della modifica temporanea
        $dialogTemporanea = new BootstrapDialog.show({
            title: 'Modifica Annotazione',
            message: $bodyDialog,
            onshown: function(dialogRef){ // alla visualizzazione della annotazione temporanea
                // carico la lista autori da visualizzare
                listaAutori();
                // cambiando il tipo di annotazione selezionata, nascondo tutto
                // e mostro il widget desiderato
                $("#typeAnnotation").on('change',function () {
                    $typeAnnotation=$("#typeAnnotation").val();
                    switch ($("#typeAnnotation").val()) {
                        case "hasTitle":
                            hideAll();
                            $("#form-group-title").show();
                            break;
                        case "hasAuthor":
                            hideAll();
                            $("#form-group-author").show();
                            break;
                        case "hasPublicationYear":
                            hideAll();
                            $("#form-group-year").show();
                            break;
                        case "hasURL":
                            hideAll();
                            $("#form-group-url").show();
                            break;
                        case "hasComment":
                            hideAll();
                            $("#form-group-comment").show();
                            break;
                        case "denotesRhetoric":
                            hideAll();
                            $("#form-group-rhetoric").show();
                            break;
                        case "cites":
                            hideAll();
                            $("#form-group-cites").show();
                            break;
                        case "hasDOI":
                            hideAll();
                            $("#form-group-doi").show();
                            break;

                    }
                });
                $("#typeAnnotation").val($editAnnot.type);
                $typeAnnotation=$editAnnot.type;
                // mostro il widget selezionato
                switch ($editAnnot.type) {
                    case "hasTitle":
                        hideAll();
                        $("#form-group-title").show();
                        break;
                    case "hasAuthor":
                        hideAll();
                        $("#form-group-author").show();
                        $("#authorAnnotation").val(cleanText);
                        break;
                    case "hasPublicationYear":
                        hideAll();
                        $("#form-group-year").show();
                        $("#yearAnnotation").val($editAnnot.body.bodyLabel.replace("L'anno di pubblicazione del documento e' ",""));
                        break;
                    case "hasURL":
                        hideAll();
                        $("#form-group-url").show();
                        break;
                    case "hasComment":
                        hideAll();
                        $("#form-group-comment").show();
                        break;
                    case "denotesRhetoric":
                        hideAll();
                        $("#form-group-rhetoric").show();
                        $("#typeRhetoric").filter(function(){return $(this).html() == cleanText}).prop('selected',true);
                        break;
                    case "cites":
                        hideAll();
                        $("#form-group-cites").show();
                        break;
                    case "hasDOI":
                        hideAll();
                        $("#form-group-doi").show();
                        break;
                }
            },
            type: BootstrapDialog.TYPE_DEFAULT,
            closable: false,
            closeByBackdrop: false,
            closeByKeyboard: false,
            buttons: [{
                label: 'Modifica Annotazione',
                cssClass: 'btn-primary',
                action: function (dialog) {

                    var $predic;
                    var $object;
                    var $tempAnnotation = $('#tempAnnotation' + $annotation);
                    //console.log($tempAnnotation);
                    $tempAnnotation.removeClass();
                    // Ricavo predicate e cambio colori all'annotazione
                    switch ($("#typeAnnotation").val()) {
                        case "hasAuthor":
                            $predic = "dcterms:creator";
                            $object = "L\'autore del documento e' " + $('#authorAnnotation').val();
                            //console.log($('span[temp-annotation=tempAnnotation'+$annotation+']'));
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("autore autoreAnnotato ltw1539 annotazione");
                            break;
                        case "hasPublicationYear":
                            $predic = "fabio:hasPublicationYear";
                            $object = "L\'anno di pubblicazione del documento e' " + $('#yearAnnotation').val();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("annoPubblicazione annoPubblicazioneAnnotato ltw1539 annotazione");
                            break;
                        case "hasTitle":
                            $predic = "dcterms:title";
                            $object = "Il titolo del documento e' " + $('#titleAnnotation').val();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("titolo titoloAnnotato ltw1539 annotazione");
                            break;
                        case "hasDOI":
                            $predic = "prism:doi";
                            $object = "Il DOI del documento e' " + $('#doiAnnotation').val();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("doi doiAnnotato ltw1539 annotazione");
                            break;
                        case "hasURL":
                            $predic = "fabio:hasURL";
                            $object = "L\'url del documento e' " + $('#urlAnnotation').val();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("url urlAnnotato ltw1539 annotazione");
                            break;
                        case "hasComment":
                            $predic = "schema:comment";
                            $object = $('#commentAnnotation').val();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("commento commentoAnnotato ltw1539 annotazione");
                            break;
                        case "denotesRhetoric":
                            $predic = "semiotics.owl#denotes";
                            $object = "Il frammento selezionato e' un " + $('#typeRhetoric option:selected').text();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("retorica retoricaAnnotato ltw1539 annotazione");
                            break;
                        case "cites":
                            $predic = "cito:cites";
                            $object = "Il frammento citato e' " + $('#citesAnnotation').val();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').removeClass();
                            $('span[temp-annotation=tempAnnotation'+$annotation+']').addClass("citazione citazioneAnnotato ltw1539 annotazione");
                        default:
                            break;
                    }

                    var $objectAnnotazione;
                    var $labelAnnotazione;

                    if (!caseDocument) {
                        $objectAnnotazione = $("#fragmentAnnotation").val();
                        $labelAnnotazione = $("#fragmentAnnotation").val();
                    }
                    if (caseDocument) { // Se invece sto facendo un'annotazione su documento intero
                        // il mio dom e' vuoto (non ho selezionato nulla)

                        // Sostituisco la parola frammento con documento per risparmiare righe di codice
                        // per poterlo inserire come commento nel body label
                        $object = $object.replace("frammento", "documento");

                        // ottengo il testo del commento inserito sostituendo la stringa generata
                        // per risparmiare righe di codice
                        var cleanText = $object;

                        cleanText = cleanText.replace("L\'autore del documento e' ", "");
                        cleanText = cleanText.replace("L\'anno di pubblicazione del documento e' ", "");
                        cleanText = cleanText.replace("Il titolo del documento e' ", "");
                        cleanText = cleanText.replace("Il DOI del documento e' ", "");
                        cleanText = cleanText.replace("L\'url del documento e' ", "");
                        cleanText = cleanText.trim();

                        // setto le stringhe generate per permettere l'inserimento nell'oggetto
                        $objectAnnotazione = cleanText;
                        $labelAnnotazione = cleanText;
                    }

                    // creo la nuova annotazione basandomi sulla vecchia
                    var $annotazioneCreata = {
                        type: $("#typeAnnotation").val(),
                        label: $("#typeAnnotation").children("option:selected").text(),
                        body: {
                            subject: $editAnnot.body.subject,
                            label: $labelAnnotazione,
                            predicate: $predic,
                            object: $objectAnnotazione,
                            bodyLabel: $object
                        },
                        target: {
                            start: $editAnnot.target.start,
                            end: $editAnnot.target.end,
                            id: $editAnnot.target.id,
                            source: $editAnnot.target.source
                        },
                        provenance: {
                            author: {
                                name: $("#nameAnnotatorAnnotation").val(),
                                email: $("#emailAnnotatorAnnotation").val()
                            },
                            time: $("#timestampAnnotation").val()
                        },
                        internalData: {
                            divId: $editAnnot.internalData.divId,
                            fullDocTitle: $editAnnot.internalData.fullDocTitle,
                            tempInternalId: $editAnnot.internalData.tempInternalId, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                            annotationId: $editAnnot.internalData.annotationId,
                            spedita: false
                        }
                    }

                    // sostituisco l'annotazione vecchia con quella creata
                    for (var i = 0; i < $listaAnnotazioni.length; i++) {
                        if ($listaAnnotazioni[i].internalData.annotationId == $annotation) {
                            $listaAnnotazioni[i] = $annotazioneCreata;
                            break;
                        }
                    }

                    //console.log("listaAnnotazioni");
                    //console.log($listaAnnotazioni);

                    // Chiudo la dialog
                    $dialogTemporanea.close();

                    if(lastModalOpened=="manageAnnotations") {
                        // riapro la lista delle annotazioni temporanee inserite
                        manageAnnotations();
                    }

                }
            },
                {
                    label: 'Chiudi',
                    cssClass: 'btn-danger',
                    action: function (dialog) {
                        $timestampEdit="";
                        $dialogTemporanea.close();
                        if(lastModalOpened=="manageAnnotations") {
                            manageAnnotations();
                        }
                    }
                }]
        });

        $dialogTemporanea.getModalHeader().css("background-color", "#d7d7d7");


    }
}

// Se voglio modificare una annotazione temporanea gia' inserita in lista,
// cambio e disabilito i pulsanti nella barra, elimino la sottolineatura vecchia
// e elimino l'annotazione precedente inserita --- ne verra' ricreata una nuova
// dopo aver selezionato il nuovo frammento
// Simone
/*function nascondiPerModificaTemporanea(annotationId){
    dialogTemporanea.close();
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0].children[0].setAttribute('class','fa fa-pencil');
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-primary").prop('disabled',true);
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-success").prop('disabled',true);
    $($("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0]).attr('data-original-title','Modifica Selezione');

    $('span[temp-annotation="tempAnnotation' + annotationId + '"').contents().unwrap();
    $('span[temp-annotation="tempAnnotation' + annotationId + '"').remove();

    console.log(annotationId);
    modalitaModifica=true;

    for (var r = 0; r < $listaAnnotazioni.length; r++) {
        console.log($listaAnnotazioni[r].internalData.divId);
        if ($listaAnnotazioni[r].internalData.annotationId == annotationId) {
            $listaAnnotazioni.splice(r, 1);
            r--;
        }
    }

}*/

// Se voglio modificare una annotazione temporanea gia' caricata,
// cambio e disabilito i pulsanti nella barra, elimino la sottolineatura vecchia
// e elimino l'annotazione precedente inserita --- ne verra' ricreata una nuova
// dopo aver selezionato il nuovo frammento
// Simone
// DA SISTEMARE
function nascondiPerModificaTemporaneaInviata(annotationId){
    if($dialogTemporanea!=undefined) {
        $dialogTemporanea.close();
    }
    if($dialogModalTempAnnotation!=undefined){
        $dialogModalTempAnnotation.close();
    }
    if($dialogSalvata!=undefined){
        $dialogSalvata.close();
    }
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0].children[0].setAttribute('class','fa fa-pencil');
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-primary").prop('disabled',true);
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-success").prop('disabled',true);
    $($("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0]).attr('data-original-title','Modifica Selezione');

    $('span[temp-annotation="tempAnnotation' + annotationId + '"').contents().unwrap();
    $('span[temp-annotation="tempAnnotation' + annotationId + '"').remove();

    //console.log(annotationId);
    modalitaModifica=true;

    var $annotazioneDaEliminare;
    for (var r = 0; r < $listaAnnotazioni.length; r++) {
        if ($listaAnnotazioni[r].internalData.annotationId == annotationId) {
            $annotazioneDaEliminare=$listaAnnotazioni[r];
            $timestampEdit=$listaAnnotazioni[r].provenance.time;
            $listaAnnotazioni.splice(r, 1);
            r--;
        }
    }

    $.ajax({
        url: "core/insertAnnotation.php",
        type: 'POST',
        data: {annotazione: $annotazioneDaEliminare, uri:$($("#tabsContent").find(".active")[0]).attr('uri-document'), tipoInserimento: 'cancAnnotazione'},
        success: function () {

        },
        error: function () {
            //console.log("ERRORE ");
        }
    });

}

function nascondiPerModificaInviataServer(annotationId){
    if($dialogSalvata!=undefined){
        $dialogSalvata.close();
    }
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0].children[0].setAttribute('class','fa fa-pencil');
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-primary").prop('disabled',true);
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-success").prop('disabled',true);
    $($("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0]).attr('data-original-title','Modifica Selezione');

    $('span[annotation-id="' + annotationId + '"').contents().unwrap();
    $('span[annotation-id="' + annotationId + '"').remove();

    //console.log(annotationId);
    modalitaModifica=true;

    var $annotazioneDaEliminare;
    for (var r = 0; r < annotazioniEstratteGestite.length; r++) {
        if (annotazioniEstratteGestite[r].idAnnotazione == annotationId) {
            $annotazioneDaEliminare=annotazioniEstratteGestite[r];
            $timestampEdit=annotazioniEstratteGestite[r].annotazione.date.value;
            annotazioniEstratteGestite.splice(r, 1);
            r--;
        }
    }

    //console.log($annotazioneDaEliminare);
    $.ajax({
        url: "core/insertAnnotation.php",
        type: 'POST',
        data: {annotazione: $annotazioneDaEliminare, uri:$($("#tabsContent").find(".active")[0]).attr('uri-document'), tipoInserimento: 'cancAnnotazioneCaricata'},
        success: function () {

        },
        error: function () {
            //console.log("ERRORE ");
        }
    });

    // elimina dal server

}

function nascondiPerModificaTemporanea(annotationId){
    if($dialogSalvata!=undefined){
        $dialogSalvata.close();
    }
    if($dialogTemporanea!=undefined){
        $dialogTemporanea.close();
    }
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0].children[0].setAttribute('class','fa fa-pencil');
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-primary").prop('disabled',true);
    $("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-success").prop('disabled',true);
    $($("#"+$('#tabsContent').find(".active")[0].getAttribute('id')+" .menuAnnotationMobile .btn-info")[0]).attr('data-original-title','Modifica Selezione');

    $('span[temp-annotation="tempAnnotation' + annotationId + '"').contents().unwrap();
    $('span[temp-annotation="tempAnnotation' + annotationId + '"').remove();

    //console.log(annotationId);
    modalitaModifica=true;

    for (var r = 0; r < $listaAnnotazioni.length; r++) {
        //console.log($listaAnnotazioni[r].internalData.divId);
        if ($listaAnnotazioni[r].internalData.annotationId == annotationId) {
            //console.log($listaAnnotazioni[r]);
            //console.log($listaAnnotazioni[r].provenance.time);
            $timestampEdit=$listaAnnotazioni[r].provenance.time;
            $listaAnnotazioni.splice(r, 1);
            r--;
        }
    }

}

var $dialogManageAnnotations;
// GESTIONE ANNOTAZIONI TEMPORANEE INSERITE
// PULSANTI INVIO ANNOTAZIONI ED ELIMINAZIONE ANNOTAZIONI
// Simone
var $listaAnnotazioniDaInviare=[];
function manageAnnotations() {

    lastModalOpened="manageAnnotations";

    // verifico quali annotazioni non sono ancora state spedite
    // questa cosa la tengo perche' le annotazioni inviate non sono
    // eliminate, perche' se invio le annotazioni e non ho ancora chiuso
    // la tab desiderata, voglio vedere le informazioni delle annotazioni
    var contaAnnotazioniVisibili=0;
    for(var t=0;t<$listaAnnotazioni.length;t++){
        if($listaAnnotazioni[t].internalData.spedita==false) {
            if($listaAnnotazioni[t].internalData.divId==$($("#tabsContent").find(".active")[0]).attr('id')) {
                contaAnnotazioniVisibili++;
            }
        }
    }

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // INIZIO BOTTONI DA VISUALIZZARE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

    var $buttons = [];

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // BOTTONE INVIO ANNOTAZIONI
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (contaAnnotazioniVisibili > 0) {
        $buttons.push({
            label: 'Invia Annotazioni',
            cssClass: 'btn-primary',
            action: function (dialog) {
                //console.log("Invio annotazioni...");

                $dial = $.notify({
                    message: 'Sto inviando le annotazioni al server..'
                },{
                    position: 'fixed',
                    placement: {
                        from: "bottom",
                        align: "right"
                    },
                    animate: {
                        enter: 'animated fadeInDown',
                        exit: 'animated fadeOutUp'
                    },
                    delay: 0
                });

                $listaAnnotazioniDaInviare=[];
                for(var i=0;i<$listaAnnotazioni.length;i++){
                    if($listaAnnotazioni[i].internalData.divId==$($("#tabsContent").find(".active")[0]).attr('id')){
                        $listaAnnotazioniDaInviare.push($listaAnnotazioni[i]);
                    }
                }

                caricaAnnotazione(0); // MODIFICA FRANKY

                /*
                 $.ajax({
                 url: "core/insertAnnotation.php",
                 type: 'POST',
                 data: {elenco: $listaAnnotazioni, tipoInserimento: 'annotazioni'},
                 success: function () {
                 //console.log("annotazione caricata!");
                 },
                 error: function () {
                 //console.log("ERRORE ");
                 }
                 }).then(function(){
                 $dial.close();
                 $.notify({
                 message: 'Ho inviato tutte le annotazioni al server.'
                 },{
                 position: 'fixed',
                 placement: {
                 from: "bottom",
                 align: "right"
                 },
                 animate: {
                 enter: 'animated fadeInDown',
                 exit: 'animated fadeOutUp'
                 },
                 delay: 0
                 });
                 });
                 */

                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // SE INSERIMENTO OK
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

                // Azzero conteggio annotazioni provvisorie
                //$contaAnnotazioniProvvisorie = 1;
                // Svuoto lista annotazioni temporanee
                // $listaAnnotazioni = [];

                // setto tutte le annotazioni presenti come spedite
                //for(var c=0;c<$listaAnnotazioni.length;c++){
                //    $listaAnnotazioni[c].internalData.spedita=true;
                //}

                // Chiudo la dialog
                dialog.close();

                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // ALERT INSERIMENTO OK
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

                // Mostro un alert di corretto inserimento annotazione
                /*var $confirmSend = $("<div></div>");
                $confirmSend.append('<div class="alert alert-success customAlert" id="alert" role="alert">Annotazioni inviate correttamente</div>');
                $('#tabsContent').append($confirmSend.fadeIn(800));
                window.setTimeout(function () {
                    $confirmSend.fadeOut(800);
                    window.setTimeout(function () {
                        $confirmSend.remove();
                    }, 800);
                }, 2500);*/

                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // FINE ALERT INSERIMENTO OK
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
                // FINE INSERIMENTO OK
                // !!!!!!!!!!!!!!!!!!!!!!!!!!!!


            }
        });
    }
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // FINE BOTTONE INVIO ANNOTAZIONI
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // BOTTONE CHIUSURA DIALOG
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

    $buttons.push({
        label: 'Chiudi',
        cssClass: 'btn-danger',
        action: function (dialog) {
            dialog.close();
        }
    });

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // FINE CHIUSURA DIALOG
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // FINE BOTTONI DA VISUALIZZARE
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!

    var $bodyDialog = $('<div id="bodyAnnotationManagerDialog"></div>');

    // Se non sono presenti annotazioni...
    if (contaAnnotazioniVisibili == 0) {
        $bodyDialog.append('<div align="center"><strong>Spiacenti, non ci sono annotazioni da gestire in questo documento...</strong></div>');
    }
    else {
        // altrimenti le mostro
        for (var $cnt = 0; $cnt < $listaAnnotazioni.length; $cnt++) {
            if($listaAnnotazioni[$cnt].internalData.divId==$($("#tabsContent").find(".active")[0]).attr('id')) {
                //console.log('entro');
                //console.log('annotazione:');
                //console.log($listaAnnotazioni[$cnt]);

                if (!$listaAnnotazioni[$cnt].internalData.spedita) {
                    var lab="";
                    var btns="";
                    if($listaAnnotazioni[$cnt].body.subject.indexOf("_cited_")!=-1){
                        lab="la citazione ";
                        btns='<div align="right" class="opTempAnnotation"><span class="sendSingleTempAnnotation" onclick="sendSingleAnnotation(' + $listaAnnotazioni[$cnt].internalData.annotationId + ');"><i class="fa fa-paper-plane"></i> <span>Invia</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotation(' + $listaAnnotazioni[$cnt].internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina</span></span></div>';
                    } else {
                        lab=" documento ";
                        btns='<div align="right" class="opTempAnnotation"><span class="sendSingleTempAnnotation" onclick="sendSingleAnnotation(' + $listaAnnotazioni[$cnt].internalData.annotationId + ');"><i class="fa fa-paper-plane"></i> <span>Invia</span></span> - <span class="editTempAnnotation" onclick="editAnnotation(' + $listaAnnotazioni[$cnt].internalData.annotationId + ');"><i class="fa fa-pencil"></i> <span>Modifica</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotation(' + $listaAnnotazioni[$cnt].internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina</span></span></div>';
                    }

                    $bodyDialog.append('<div id="tempAnnotationManaged' + $listaAnnotazioni[$cnt].internalData.annotationId + '"><div class="singleAnnotationShownDialog">' +
                        '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + $listaAnnotazioni[$cnt].body.label + '</span>\"</span>' +
                        '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + $listaAnnotazioni[$cnt].label + '</span>' +
                        ' annotato da <span class="latoBoldItalic">' + $listaAnnotazioni[$cnt].provenance.author.name + ' &#60;' + $listaAnnotazioni[$cnt].provenance.author.email + '&#62;' + '</span>' +
                        ' il <span class="latoBoldItalic">' + $listaAnnotazioni[$cnt].provenance.time + '</span>' +
                        '<br />Nel'+lab+'<span class="latoBoldItalic">' + $listaAnnotazioni[$cnt].internalData.fullDocTitle + '</span>"' +
                        '<br />Con il commento: <span class="latoBoldItalic">' + $listaAnnotazioni[$cnt].body.bodyLabel + '</span>' +
                        '</div>' +
                        btns);
                    if ($cnt != $listaAnnotazioni.length - 1) {
                        $bodyDialog.append('<hr id="tempDividerAnnotationManaged' + $listaAnnotazioni[$cnt].internalData.annotationId + '" class="dividerAnnotationModal" />')
                    }
                    $bodyDialog.append('</div>');
                }
            }
        }
    }

    // genero la dialog e la mostro
    var dialog = new BootstrapDialog.show({
        title: 'Gestisci Annotazioni Inserite',
        message: $bodyDialog,
        type: BootstrapDialog.TYPE_DEFAULT,
        buttons: $buttons
    });

    $dialogManageAnnotations = dialog;

    dialog.getModalHeader().css("background-color", "#d7d7d7");

}

// Cliccando sul pulsante di eliminazione di una annotazione, entro in questo metodo
// che mi toglie lo span dell'annotazione temporanea, e rimuove l'annotazione temporanea
// dalla lista di annotazioni temporanee interna all'applicazione
// Simone
function removeAnnotation(annotationId) {
    // Rimuovo annotazione con l'id selezionata dall'array
    var $listaAnnotazioniTemp = [];
    // Vado a cercare l'annotazione desiderata da rimuovere scorrendo
    // la lista delle annotazioni temporanee
    for (var $i = 0; $i < $listaAnnotazioni.length; $i++) {
        if ($listaAnnotazioni[$i].internalData.annotationId != annotationId) {
            $listaAnnotazioniTemp.push($listaAnnotazioni[$i]);
        }
    }
    $listaAnnotazioni = $listaAnnotazioniTemp;

    // Rimuovo l'annotazione dalla lista temporanea visualizzata
    $('#tempAnnotationManaged' + annotationId).remove();
    $('#tempDividerAnnotationManaged' + annotationId).remove();
    $('#internalAnnotationOnDocument' + annotationId).remove();

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Rimuovo lo span "temporaneo" relativo all'annotazione temporanea dal documento
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    $('span[temp-annotation="tempAnnotation' + annotationId + '"').contents().unwrap();
    $('span[temp-annotation="tempAnnotation' + annotationId + '"').remove();

    // Se lista vuota, mostro messaggio di lista vuota
    if ($listaAnnotazioniTemp.length == 0) {
        $('#bodyAnnotationManagerDialog').append('<div align="center"><strong>Spiacenti, non ci sono annotazioni da gestire...</strong></div>');
        $(document).find('.modal-open .bootstrap-dialog .modal-dialog .modal-content .modal-footer .bootstrap-dialog-footer .bootstrap-dialog-footer-buttons .btn.btn-primary').remove();
    }
}

// Modal per inserimento autore sul grafo
// Simone
function modalAddAuthor(author) {

    // creo corpo della modal
    var $bodyDialog = $('<div></div>');
    $bodyDialog.append('<div class="form-group" id="form-group-nome-autore">' +
        '<label id="nomeAutoreLabel" for="nomeAutore">Nome</label>' +
        '<input type="text" class="form-control disabled" id="nomeAutore" placeholder="Inserisci il nome dell\'autore" value="'+author.replace("\"","").substr(0,author.replace("\"","").indexOf(' '))+'" required></div>' +
        '<div class="form-group" id="form-group-cognome-autore">' +
        '<label id="cognomeAutoreLabel" for="cognomeAutore">Cognome</label>' +
        '<input type="text" class="form-control disabled" id="cognomeAutore" placeholder="Inserisci il cognome dell\'autore" value="'+author.replace("\"","").substr(author.replace("\"","").indexOf(' ')+1)+'"></div>');

    // creo e visualizzo la modal
    var dialog = new BootstrapDialog.show({
        title: 'Inserisci Autore',
        message: $bodyDialog,
        type: BootstrapDialog.TYPE_DEFAULT,
        closable: false,
        closeByBackdrop: false,
        closeByKeyboard: false,
        buttons: [{
            label: 'Inserisci Autore',
            cssClass: 'btn-primary',
            action: function (dialog) {

                if ($('#nomeAutore').val().trim() != '' && $('#cognomeAutore').val().trim() != '') {

                    // creo l'iri - Simone
                    var autore=createIRI($('#nomeAutore').val(),$('#cognomeAutore').val());

                    // AGGIUNGO L'AUTORE AL GRAFO

                    /*
                     INIZIO FRANKY autore dentro grafo
                     */
                    var person = {autore: autore};
                    //console.log("stampo person");
                    //console.log(person);

                    var bool = false;
                    var check = person.autore.iri; // che ho creato io quando inserisco l'autore
                    for(var i in $elencoAutor){
                        ///console.log($elencoAutor[i]);
                        if($elencoAutor[i] == check){
                            //console.log("elencoAutor "+$elencoAutor[i]);
                            //console.log("check "+check);
                            bool=true;
                            alert("autore già presente");
                            break;
                        }
                    }

                    $.ajax({
                        url:"core/insertAnnotation.php",
                        type: 'POST',
                        data: {elenco:person ,tipoInserimento:'inserimentoAutore'},
                        success:function(){
                            //console.log("inserisco autore nell'option!!");
                            listaAutori();
                        },
                        error:function(){
                            //console.log("ERRORE!!");
                        }
                    });

                    /*
                     FINE FRANKY autore dentro grafo
                     */


                    // Chiudo la dialog
                    dialog.close();

                }

            }
        },
            {
                label: 'Chiudi',
                cssClass: 'btn-danger',
                action: function (dialog) {
                    dialog.close();
                }
            }]
    });

    dialog.getModalHeader().css("background-color", "#d7d7d7");

}

// Creo IRI riferito all'autore da inserire
// Simone
function createIRI(nome,cognome){
    var nomeAutoreEstratto = S(nome).latinise().s;
    var cognomeAutoreEstratto = S(cognome).latinise().s;

    var cognomi = cognomeAutoreEstratto.split(" ");

    var cognomePerIRI = ""
    if(cognomi.length<=2){
        cognomePerIRI=cognomeAutoreEstratto;
    }
    else{
        cognomePerIRI=cognomi[cognomi.length-2]+" "+cognomi[cognomi.length-1];
    }

    var nomeAutoreEstrattoNoL = nome;
    var cognomeAutoreEstrattoNoL = cognome;

    var iri = "http://vitali.web.cs.unibo.it/raschietto/person/" + S(nomeAutoreEstratto.substr(0, 1).trim() + " " + cognomePerIRI.replace(/ /g, "")).slugify().s;
    //console.log("iri -> " + iri);
    // ritorno oggetto che ritorna parametri richiesti
    return {iri:iri,nomeAutoreEstratto:nomeAutoreEstratto,cognomeAutoreEstratto:cognomeAutoreEstratto,nomeAutoreEstrattoNoL:nomeAutoreEstrattoNoL,cognomeAutoreEstrattoNoL:cognomeAutoreEstrattoNoL}
}

// Annotazioni su citazione
// Creo annotazioni su citazione
// Simone per la parte client, Franky lato sparql/server
var listaAnnotazioniSuCitazionee;
function annotazioniSuFrammento() {

    // salvo il testo selezionato
    var $testoSelezionato= frammentoSelezionato.trim();

    var $dialog = $('<div id="annotationsOnFragment"></div>');

    // QUI LISTA ANNOTAZIONI

    var documentiCitati = [];
    var listaOption = "";
    var listaAnnotazioniInserite = [];

    // Creo il corpo della modal
    var $selectCitazioni='<div class="form-group">' +
        '<label for="annotazioneCitazione">Seleziona Citazione</label>' +
        '<select id="annotazioneCitazione" class="form-control listaCitazioniModal">' +
        '<option selected="true" disabled="disabled">Seleziona una citazione</option>'+
        '</select></div><div id="caricamentoCitazioni"><b>Sto caricando le citazioni...</b></div><hr />' +
        '<div id="inserimentoAnnotazioniCitazioniModal"></div>'+
        '<div id="bodyListaCitazioniModal"></div>';

    $dialog.append($selectCitazioni);

    // Creo e genero la modal
    var dialog = new BootstrapDialog.show({
        title: 'Annotazioni su citazione',
        message: $dialog,
        type: BootstrapDialog.TYPE_DEFAULT,
        onshown: function(){ // dopo l'apertura
            /* AJAX RICHIESTA CITAZIONI SUL NOSTRO GRAFO */

            // localhost
            /*var query = prefissi + "SELECT ?autore ?nomeAutore ?emailAutore ?date ?labelAnno ?path ?start ?end ?subject ?predicate ?object ?bodyLabel\
             WHERE { \
             ?annotation a oa:Annotation ;\
             oa:annotatedAt ?date ;\                   \
             oa:annotatedBy ?autore;\
             oa:hasTarget ?target;\
             oa:hasBody ?body;\
             OPTIONAL{ ?annotation rasch:type ?tipoAnn. }\
             OPTIONAL { ?annotation rdfs:label ?labelAnn }\
             OPTIONAL {?autore foaf:name ?nomeAutore;\
             schema:email ?emailAutore.}\
             ?target a oa:SpecificResource ;\
             oa:hasSource \<"+$('#tabsContent').find(".active").attr("uri-document")+"\> ;\
             oa:hasSelector ?fragment.\
             ?fragment a oa:FragmentSelector ;\
             rdf:value ?path ;\
             oa:start ?start ;\
             oa:end ?end .\
             ?body a rdf:Statement ;\
             rdf:subject ?subject ;\
             rdf:predicate \<http://purl.org/spar/cito/cites\> ;\
             rdf:object ?object.\
             OPTIONAL { ?body rdfs:label ?bodyLabel }\
             }ORDER BY DESC(?date)";*/

            var query = prefissi + "SELECT ?autore ?nomeAutore ?emailAutore ?date ?labelAnno ?path ?start ?end ?subject ?predicate ?object ?bodyLabel\
             WHERE { GRAPH \<http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539\>{ \
             ?annotation a oa:Annotation ;\
             oa:annotatedAt ?date ;\                   \
             oa:annotatedBy ?autore;\
             oa:hasTarget ?target;\
             oa:hasBody ?body;\
             OPTIONAL{ ?annotation rasch:type ?tipoAnn. }\
             OPTIONAL { ?annotation rdfs:label ?labelAnn }\
             OPTIONAL {?autore foaf:name ?nomeAutore;\
             schema:email ?emailAutore.}\
             ?target a oa:SpecificResource ;\
             oa:hasSource \<"+$('#tabsContent').find(".active").attr("uri-document")+"\> ;\
             oa:hasSelector ?fragment.\
             ?fragment a oa:FragmentSelector ;\
             rdf:value ?path ;\
             oa:start ?start ;\
             oa:end ?end .\
             ?body a rdf:Statement ;\
             rdf:subject ?subject ;\
             rdf:predicate \<http://purl.org/spar/cito/cites\> ;\
             rdf:object ?object.\
             OPTIONAL { ?body rdfs:label ?bodyLabel }\
             }}ORDER BY DESC(?date)";


            var queryCodificata = encodeURIComponent(query);
            //da mettere dentro
            var uriCompleto = spar +"?query=" +queryCodificata + "&format=json";

            var listaCitazioniServer="";
            $.ajax({
                url: uriCompleto,
                dataType: "jsonp",
                success: function (data) {
                    //stampalo nella console
                    //console.log(data);
                    //chiama funzione

                    var listaAnnotazioniSuCitazione = data.results.bindings;

                    //console.log(listaAnnotazioniSuCitazione);

                    // Mostro tutte le citazioni selezionate presenti sia nel nostro grafo, che nella lista temporanea

                    for(var ccn=listaAnnotazioniSuCitazione.length-1;ccn>=0;ccn--){
                        if(listaAnnotazioniInserite.indexOf(listaAnnotazioniSuCitazione[ccn].object.value)==-1) {
                            listaCitazioniServer += "<option value=\"\">" + listaAnnotazioniSuCitazione[ccn].object.value + "</option>";
                            listaAnnotazioniInserite.push(listaAnnotazioniSuCitazione[ccn].object.value);
                        }
                    }

                    // annotazioni interne da inviare
                    for(var cn=0; cn<$listaAnnotazioni.length; cn++) {
                        //console.log($listaAnnotazioni[cn]);
                        //console.log($listaAnnotazioni[cn].body.label);
                        //console.log(listaAnnotazioniInserite.indexOf($listaAnnotazioni[cn].body.label)==-1);
                        if(listaAnnotazioniInserite.indexOf($listaAnnotazioni[cn].body.label)==-1) {
                            // se è una citazione e se corrisponde al titolo del documento aperto
                            if ($listaAnnotazioni[cn].label == "Citazione" && $listaAnnotazioni[cn].internalData.fullDocTitle == $($($('#tabsContent').find(".active")[0])[0]).attr('full-doc-title')) {
                                listaAnnotazioniInserite.push($listaAnnotazioni[cn].body.label);
                                listaOption += "<option value=\"\">" + $listaAnnotazioni[cn].body.label + "</option>";
                            }
                        }
                    }

                },
                error: function () {
                    // se riscontro un errore, mostro una notifica
                    $.notify({
                        message: 'A causa di un errore di comunicazione con il server, non e\' stato possibile scaricare le citazioni presenti sul grafo ToRaGaMa.'
                    },{
                        type: 'danger',
                        position: 'fixed',
                        placement: {
                            from: "bottom",
                            align: "right"
                        },
                        animate: {
                            enter: 'animated fadeInDown',
                            exit: 'animated fadeOutUp'
                        },
                        delay: 0
                    });
                    return null;
                }
            }).then(function(){
                // appendo opzioni, lista citazioni e rimuovo messaggio di caricamento
                $("#annotazioneCitazione").append(listaCitazioniServer);
                $("#annotazioneCitazione").append(listaOption);
                $("#caricamentoCitazioni").remove();
                $("#annotazioneCitazione option").attr("style","width:"+$("#annotazioneCitazione").width()+"px;");
            });

            /* FINE AJAX RICHIESTA CITAZIONI SUL NOSTRO GRAFO */

            $dialog.one('click',function(){ // facendo un'operazione all'interno della modal
                $("#annotazioneCitazione").on('change',function(){ // se cambio la citazione

                    ////console.log("entro");

                    // svuoto corpo e widget inserimento
                    $("#bodyListaCitazioniModal").empty();
                    $("#inserimentoAnnotazioniCitazioniModal").empty();

                    // carico messaggio di caricamento
                    $("#bodyListaCitazioniModal").append("<b>Caricamento in corso annotazioni su citazione...</b>");

                    // genero uri della citazione
                    var uriCitazione=$('#tabsContent').find(".active")[0].attributes['uri-document'].value.replace(".html","").replace(".php","")+"._cited_"+encodeURIComponent($("#annotazioneCitazione option:selected").text())+"_ver1";

                    // mostro le annotazioni su citazione presenti in locale
                    var $aannotazioniSuFrammentoVisualizzate="";
                    for(var cr=0;cr<$listaAnnotazioni.length;cr++){

                        if($listaAnnotazioni[cr].internalData.spedita==false){
                        if($listaAnnotazioni[cr].body.subject==uriCitazione){
                            $aannotazioniSuFrammentoVisualizzate += '<div id="annotazioneTemporaneaSuCitazione'+$listaAnnotazioni[cr].internalData.annotationId+'">'+
                                '<div class="singleAnnotationReadShownDialog">' +
                                '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + $listaAnnotazioni[cr].body.object + '</span>\"</span>' +
                                '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + $listaAnnotazioni[cr].label + '</span>' +
                                ' annotato da <span class="latoBoldItalic">' + $listaAnnotazioni[cr].provenance.author.name + " &lt;"+ $listaAnnotazioni[cr].provenance.author.email + '&gt;</span>' +
                                ' il <span class="latoBoldItalic">' + $listaAnnotazioni[cr].provenance.time + '</span><br /><br />';
                            $aannotazioniSuFrammentoVisualizzate += '</div>';
                            // se non e' stata spedita
                            $aannotazioniSuFrammentoVisualizzate += '<div align="right" class="opTempAnnotation"><span class="deleteTempAnnotation" onclick="removeAnnotationOnCit(\'locale\',' + $listaAnnotazioni[cr].internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div></div>';
                            //$aannotazioniSuFrammentoVisualizzate += ('<hr class="dividerAnnotationModal" id="dividerAnnotazioneTemporaneaSuCitazione'+$listaAnnotazioni[cr].internalData.annotationId+'" />');
                        }

                        }

                    }

                    // e quelle caricate sul server
                    /* AJAX RICHIESTA ANNOTAZIONI SU CITAZIONE */
                    var query = prefissi + "SELECT ?autore ?nomeAutore ?emailAutore ?date ?labelAnno ?path ?start ?end ?subject ?predicate ?object ?bodyLabel ?graph\
                              WHERE { GRAPH ?graph {\
                                     ?annotation a oa:Annotation ;\
                                      oa:annotatedAt ?date ;\                   \
                                      oa:annotatedBy ?autore;\
                                      oa:hasTarget ?target;\
                                      oa:hasBody ?body;\
                                     OPTIONAL{ ?annotation rasch:type ?tipoAnn. }\
                                     OPTIONAL { ?annotation rdfs:label ?labelAnn }\
                                     OPTIONAL {?autore foaf:name ?nomeAutore;\
                                     schema:email ?emailAutore.}\
                                     ?target a oa:SpecificResource ;\
                                              oa:hasSource <"+uriCitazione+"> ;\
                                              oa:hasSelector ?fragment.\
                                     ?fragment a oa:FragmentSelector ;\
                                              rdf:value ?path ;\
                                              oa:start ?start ;\
                                              oa:end ?end .\
                                     ?body a rdf:Statement ;\
                                              rdf:subject ?subject ;\
                                              rdf:predicate ?predicate ;\
                                              rdf:object ?object.\
                                     OPTIONAL { ?body rdfs:label ?bodyLabel }\
                                 } }ORDER BY DESC(?date)";

                    var queryCodificata = encodeURIComponent(query);
                    //da mettere dentro
                    var uriCompleto = spar +"?query=" +queryCodificata + "&format=json";

                    $.ajax({
                        url: uriCompleto,
                        dataType: "jsonp",
                        success: function (data) {
                            //stampalo nella console
                            //console.log(data);
                            //chiama funzione

                            listaAnnotazioniSuCitazionee = data.results.bindings;

                            //console.log(listaAnnotazioniSuCitazionee);

                            for(var ccn=0;ccn<listaAnnotazioniSuCitazionee.length;ccn++){

                                var tempType = listaAnnotazioniSuCitazionee[ccn].predicate.value;
                                var type = "";

                                if (tempType.indexOf('/') != -1) {
                                    type = tempType.substr(tempType.lastIndexOf('/') + 1);
                                }
                                else {
                                    type = tempType.substr(tempType.lastIndexOf(':') + 1);
                                }

                                $annotazioniSuFrammentoVisualizzate += '<div id="annotazioneSuCitazione'+ccn+'">' +
                                    '<div class="singleAnnotationReadShownDialog">' +
                                    '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + listaAnnotazioniSuCitazionee[ccn].object.value + '</span>\"</span>' +
                                    '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + convertToString(type) + '</span>' +
                                    ' annotato da <span class="latoBoldItalic">' + listaAnnotazioniSuCitazionee[ccn].nomeAutore.value + " &lt;"+ listaAnnotazioniSuCitazionee[ccn].emailAutore.value + '&gt;</span>' +
                                    ' il <span class="latoBoldItalic">' + listaAnnotazioniSuCitazionee[ccn].date.value + '</span><br /><br />';
                                $annotazioniSuFrammentoVisualizzate += '</div>';
                                if(listaAnnotazioniSuCitazionee[ccn].graph.value=="http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539"){
                                    $annotazioniSuFrammentoVisualizzate += '<div align="right" class="opTempAnnotation"><span class="deleteTempAnnotation" onclick="removeAnnotationOnCit(\'grafo\','+ccn+');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div></div>';
                                }

                                $annotazioniSuFrammentoVisualizzate += ('<br />');

                            }

                        },
                        error: function () { // se qualcosa va storto, mostro un messaggio di errore
                            $.notify({
                                message: 'A causa di un errore di comunicazione con il server, non e\' stato possibile scaricare le annotazioni su citazione.'
                            },{
                                type: 'danger',
                                position: 'fixed',
                                placement: {
                                    from: "bottom",
                                    align: "right"
                                },
                                animate: {
                                    enter: 'animated fadeInDown',
                                    exit: 'animated fadeOutUp'
                                },
                                delay: 0
                            });
                            return null;
                        }
                    }).then(function(){
                        // se tutto va bene, appendo le annotazioni trovate
                        $("#bodyListaCitazioniModal").empty();
                        $("#bodyListaCitazioniModal").append("<hr />");
                        $("#bodyListaCitazioniModal").append($aannotazioniSuFrammentoVisualizzate);
                        $("#bodyListaCitazioniModal").append($annotazioniSuFrammentoVisualizzate);
                    });

                    /* FINE AJAX RICHIESTA ANNOTAZIONI SU CITAZIONE */

                    // genero corpo per inserimento annotazione su citazione
                    var headerBottoni = '<div class="form-group">' +
                        '<label for="typeAnnotation">Inserisci Annotazione</label>' +
                        '<select id="typeAnnotation" class="form-control listaCitazioniModal" id="listaCitazioniModal">' +
                        '<option selected="true" disabled="disabled">Seleziona un tipo di annotazione</option>' +
                        '<option value="hasTitle">Titolo</option>' +
                        '<option value="hasAuthor">Autore</option>' +
                        '<option value="hasPublicationYear">Anno di Pubblicazione</option>' +
                        '<option value="hasURL">URL</option>' +
                        '<option value="hasComment">Commento</option>' +
                        '<option value="hasDOI">DOI</option>' +
                        '</select></div>' +
                        '<div class="form-group" id="annotationCitazione" style="display:none;">' +
                        '<label id="annotationCitazioneLabel" for="textAnnotationCitazione"></label>' +
                        '<input type="text" class="form-control disabled" id="textAnnotationCitazione" value="'+$testoSelezionato.replace(/"/g, "&quot;")+'" ><br />' +
                        '<div align="right">'+
                        '<button class="btn btn-success" id="inviaAnnotazioneCitazione"><i class="fa fa-plus"></i>&nbsp;&nbsp;Aggiungi Annotazione</button>&nbsp;' +
                        '<button class="btn btn-primary" id="cancellaAnnotazioneCitazione" ><i class="fa fa-minus"></i>&nbsp;&nbsp;Cancella</button>' +
                        '</div></div>';

                    // lo appendo
                    $("#inserimentoAnnotazioniCitazioniModal").append(headerBottoni);

                    $("#inserimentoAnnotazioniCitazioniModal").one('click',function(){ // se scelgo di inserire un certo tipo di annotazione dalla option

                        // se clicco sul pulsante di cancellazione annotazione, nascondo il widget
                        $("#cancellaAnnotazioneCitazione").on('click',function(){
                            $("#annotationCitazione").hide();
                        });

                        // altrimenti inserisco l'annotazione su citazione nella lista temporanea
                        $("#inviaAnnotazioneCitazione").unbind().click(function(e){

                            // Estraggo timestamp annotazione, lo sistemo e lo salvo in variabile
                            var date = new Date();
                            var $timestampAnnotation = '' + date.getFullYear() + '-';
                            if (((date.getMonth() + 1) >= 1) && ((date.getMonth() + 1) <= 9)) {
                                $timestampAnnotation += '0' + (date.getMonth() + 1) + "-";
                            } else {
                                $timestampAnnotation += (date.getMonth() + 1) + "-";
                            }
                            if (((date.getDate()) >= 1) && ((date.getDate()) <= 9)) {
                                $timestampAnnotation += '0' + (date.getDate());
                            } else {
                                $timestampAnnotation += (date.getDate());
                            }
                            if (((date.getHours()) >= 0) && ((date.getHours()) <= 9)) {
                                $timestampAnnotation += 'T0' + (date.getHours()) + ":";
                            } else {
                                $timestampAnnotation += "T" + (date.getHours()) + ":";
                            }
                            if (((date.getMinutes()) >= 0) && ((date.getMinutes()) <= 9)) {
                                $timestampAnnotation += '0' + (date.getMinutes());
                            } else {
                                $timestampAnnotation += (date.getMinutes());
                            }

                            var $bodyLabel;
                            var $predicate;

                            switch($("#typeAnnotation option:selected").text()){
                                case "Titolo":
                                    $bodyLabel="Il titolo della citazione e\': "+ $("#textAnnotationCitazione").val();
                                    $predicate="dcterms:title";
                                    break;
                                case "Autore":
                                    $bodyLabel="L\'autore della citazione e\': "+ $("#textAnnotationCitazione").val();
                                    $predicate="dcterms:creator";
                                    break;
                                case "Anno di Pubblicazione":
                                    $bodyLabel="L'anno di pubblicazione della citazione e': "+ $("#textAnnotationCitazione").val();
                                    $predicate="fabio:hasPublicationYear";
                                    break;
                                case "URL":
                                    $bodyLabel="L\'URL della citazione e': "+ $("#textAnnotationCitazione").val();
                                    $predicate="fabio:hasURL";
                                    break;
                                case "Commento":
                                    $bodyLabel="Il commento alla citazione e': "+ $("#textAnnotationCitazione").val();
                                    $predicate="schema:comment";
                                    break;
                                case "DOI":
                                    $bodyLabel="Il DOI della citazione e': "+ $("#textAnnotationCitazione").val();
                                    $predicate = "prism:doi";
                                    break;
                            }


                            // DA INSERIRE IN LISTA TEMPORANEA

                            var $annotazioneCreata = {
                                type: $("#typeAnnotation option:selected").val(),
                                label: $("#typeAnnotation option:selected").text(),
                                body: {
                                    subject: $('#tabsContent').find(".active")[0].attributes['uri-document'].value.replace(".html","").replace("\"","")+"._cited_"+encodeURIComponent($("#annotazioneCitazione option:selected").text())+"_ver1",
                                    label: S($("#textAnnotationCitazione").val()).latinise().s,
                                    predicate: $predicate,
                                    object: S($("#textAnnotationCitazione").val()).latinise().s,
                                    bodyLabel: S($bodyLabel).latinise().s
                                },
                                target: {
                                    start: 0,
                                    end: 0,
                                    id: "",
                                    source: $('#tabsContent').find(".active")[0].attributes['uri-document'].value.replace(".html","").replace("\"","")+"._cited_"+encodeURIComponent($("#annotazioneCitazione option:selected").text())+"_ver1"
                                },
                                provenance: {
                                    author: {
                                        name: Cookies.get('name'),
                                        email: Cookies.get('email')
                                    },
                                    time: $timestampAnnotation
                                },
                                internalData: {
                                    divId: $('#documentTabs').find(".active")[0].childNodes[0].attributes[0].nodeValue.replace("#",""),
                                    fullDocTitle: S($("#annotazioneCitazione option:selected").text()).latinise().s,
                                    tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                                    annotationId: $contaAnnotazioniProvvisorie,
                                    xpath: "",
                                    annotazioneSu: "citazione",
                                    spedita: false
                                }
                            };

                            $listaAnnotazioni.push($annotazioneCreata);

                            //console.log("listaAnnotazioni");
                            //console.log($listaAnnotazioni);

                            // nascondo il widget
                            $("#annotationCitazione").hide();

                            // genero il blocco da mostrare e lo appendo
                            var $annotazioneDaAppendere = '<div id="annotazioneSuCitTemp'+$contaAnnotazioniProvvisorie+'">' +
                                '<div class="singleAnnotationReadShownDialog">' +
                                '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + $annotazioneCreata.body.label + '</span>\"</span>' +
                                '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + $annotazioneCreata.label + '</span>' +
                                ' annotato da <span class="latoBoldItalic">' + $annotazioneCreata.provenance.author.name + " &lt;" + $annotazioneCreata.provenance.author.email + '&gt; </span>' +
                                ' il <span class="latoBoldItalic">' + $annotazioneCreata.provenance.time + '</span><br /><br />';
                            $annotazioneDaAppendere += '</div>';

                            $annotazioneDaAppendere += '<div align="right" class="opTempAnnotation"><span class="deleteTempAnnotation" onclick="removeAnnotationTemp('+$contaAnnotazioniProvvisorie+');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div></div>';

                            $annotazioneDaAppendere += ('<br />');
                            $annotazioneDaAppendere += "</div>";

                            $("#bodyListaCitazioniModal").append($annotazioneDaAppendere);

                            $("#textAnnotationCitazione").val('');

                            $contaAnnotazioniProvvisorie++;

                        });

                        // se cambio tipo di annotazioine su citazione da inserire, cambio la label sopra l'input text
                        $("#typeAnnotation").on('change',function(){

                            $("#annotationCitazione").show();

                            switch($("option:selected", this).text()){
                                case "Titolo":
                                    $("#annotationCitazioneLabel").replaceWith('<label id="annotationCitazioneLabel" for="textAnnotationCitazione">Il titolo della citazione e\'</label>');
                                    break;
                                case "Autore":
                                    $("#annotationCitazioneLabel").replaceWith('<label id="annotationCitazioneLabel" for="textAnnotationCitazione">L\'autore della citazione e\'</label>');
                                    break;
                                case "Anno di Pubblicazione":
                                    $("#annotationCitazioneLabel").replaceWith('<label id="annotationCitazioneLabel" for="textAnnotationCitazione">L\'anno di pubblicazione della citazione e\'</label>');
                                    break;
                                case "URL":
                                    $("#annotationCitazioneLabel").replaceWith('<label id="annotationCitazioneLabel" for="textAnnotationCitazione">L\'URL della citazione e\'</label>');
                                    break;
                                case "Commento":
                                    $("#annotationCitazioneLabel").replaceWith('<label id="annotationCitazioneLabel" for="textAnnotationCitazione">Il commento alla citazione e\'</label>');
                                    break;
                                case "DOI":
                                    $("#annotationCitazioneLabel").replaceWith('<label id="annotationCitazioneLabel" for="textAnnotationCitazione">Il DOI della citazione e\'</label>');
                                    break;
                            }

                        });

                    });

                    var bold = "<b>"+$("option:selected", this).text()+"</b>";

                    // DATA FORMAT
                    // Estraggo timestamp annotazione, lo sistemo e lo salvo in variabile
                    var date = new Date();
                    var $timestampAnnotation = '' + date.getFullYear() + '-';
                    if (((date.getMonth() + 1) >= 1) && ((date.getMonth() + 1) <= 9)) {
                        $timestampAnnotation += '0' + (date.getMonth() + 1) + "-";
                    } else {
                        $timestampAnnotation += (date.getMonth() + 1) + "-";
                    }
                    if (((date.getDate()) >= 1) && ((date.getDate()) <= 9)) {
                        $timestampAnnotation += '0' + (date.getDate());
                    } else {
                        $timestampAnnotation += (date.getDate());
                    }
                    if (((date.getHours()) >= 0) && ((date.getHours()) <= 9)) {
                        $timestampAnnotation += 'T0' + (date.getHours()) + ":";
                    } else {
                        $timestampAnnotation += "T" + (date.getHours()) + ":";
                    }
                    if (((date.getMinutes()) >= 0) && ((date.getMinutes()) <= 9)) {
                        $timestampAnnotation += '0' + (date.getMinutes());
                    } else {
                        $timestampAnnotation += (date.getMinutes());
                    }

                    //RITORNA $timestampAnnotation

                    var $annotazioniSuFrammentoVisualizzate="";

                });
            });

        }
    });

    dialog.getModalHeader().css("background-color", "#d7d7d7");

}

function bodyInsertAnnotation(tipo,frammentoTop,frammento,nome,mail,timestamp,annotation){

    var labelTitolo;
    var labelUrl;
    var labelDoi;
    if(tipo=="intero"){
        labelTitolo="Il titolo del documento &egrave";
        labelUrl="L\'URL del documento &egrave;";
        labelDoi="Il DOI del documento &egrave; (max 80 caratteri)";
    } else {
        labelTitolo="Il titolo selezionato &egrave";
        labelUrl="L\'URL selezionato &egrave;";
        labelDoi="Il DOI selezionato &egrave; (max 80 caratteri)";
    }

    // Creo la lista degli anni selezionabili dal widget
    var yearOptionList = function () {
        var list = "";
        for (var $year = 2016; $year >= 1800; $year--) {
            list += '<option value="' + $year + '">' + $year + '</option>';
        }
        return list;
    }

    var body='<div class="form-group">' +
        '<label id="fragmentAnnotationTextArea" for="fragmentAnnotation">Frammento</label>' +
        '<textarea class="form-control" id="fragmentAnnotation" rows="2" disabled>' + frammentoTop + '</textarea>';
        if(annotation==null && tipo!="intero") {
            body += '<button class="btn btn-default" onclick="nascondiPerModifica()" type="button" style="width:100%;margin-top:1px;"><i class="fa fa-pencil"></i> Modifica Selezione</button></div>';
        }
        else if(annotation!=null && tipo=="frammentoCaricato") {
            body += '<button class="btn btn-default" onclick="nascondiPerModificaInviataServer('+annotation+')" type="button" style="width:100%;margin-top:1px;"><i class="fa fa-pencil"></i> Modifica Selezione</button></div>';
        }
        else if(annotation!=null && tipo=="frammentoSalvato") {
            body += '<button class="btn btn-default" onclick="nascondiPerModificaTemporaneaInviata('+annotation+')" type="button" style="width:100%;margin-top:1px;"><i class="fa fa-pencil"></i> Modifica Selezione</button></div>';
        }
        else if(annotation!=null && tipo!="intero") {
            body += '<button class="btn btn-default" onclick="nascondiPerModificaTemporanea('+annotation+')" type="button" style="width:100%;margin-top:1px;"><i class="fa fa-pencil"></i> Modifica Selezione</button></div>';
        }
        body+='<div class="form-group">' +
        '<label id="nameAnnotatorLabelAnnotation" for="nameAnnotatorAnnotation">Nome</label>' +
        '<input type="name" class="form-control disabled" id="nameAnnotatorAnnotation" value="' + nome + '" disabled></div>' +
        '<div class="form-group">' +
        '<label id="emailAnnotatorLabelAnnotation" for="emailAnnotatorAnnotation">Indirizzo email</label>' +
        '<input type="email" class="form-control disabled" id="emailAnnotatorAnnotation" value="' + mail + '" disabled></div>' +
        '<div class="form-group">' +
        '<label id="timestampLabelAnnotation" for="timestampAnnotation">Data e Ora dell\'Annotazione</label>';
        if($timestampEdit!="") {
            body += '<input type="text" class="form-control disabled" id="timestampAnnotation" value="' + $timestampEdit + '" disabled></div>';
        }
        else {
            body += '<input type="text" class="form-control disabled" id="timestampAnnotation" value="' + timestamp + '" disabled></div>';
        }
        body+='<div class="form-group">' +
        '<label for="typeAnnotation">Tipo Annotazione</label>' +
        '<select id="typeAnnotation" class="form-control">' +
        '<option value="hasTitle">Titolo</option>' +
        '<option value="hasAuthor">Autore</option>' +
        '<option value="hasPublicationYear">Anno di Pubblicazione</option>' +
        '<option value="hasURL">URL</option>' +
        '<option value="hasComment">Commento</option>' +
        '<option value="denotesRhetoric">Retorica</option>';
        if(tipo!='intero') {
            body+='<option value="cites">Citazione</option>';
        }
        body+='<option value="hasDOI">DOI</option>'+
        '</select></div>' +
        '<div class="form-group" id="form-group-comment" style="display:none;">' +
        '<label id="commentLabelAnnotation" for="commentAnnotation">Commento</label>' +
        '<input type="text" class="form-control disabled" id="commentAnnotation" placeholder="Inserisci un commento all\'annotazione"></div>' +
        '<div class="form-group" id="form-group-rhetoric" style="display:none;">' +
        '<label for="typeRhetoric">Retorica</label>' +
        '<select id="typeRhetoric" class="form-control">' +
        '<option value="sro:Abstract">Abstract</option>' +
        '<option value="deo:Introduction">Introduction</option>' +
        '<option value="deo:Materials">Materials</option>' +
        '<option value="deo:Methods">Methods</option>' +
        '<option value="deo:Results">Results</option>' +
        '<option value="sro:Discussion">Discussion</option>' +
        '<option value="sro:Conclusion">Conclusion</option>' +
        '</select></div>' +
        '<div class="form-group" id="form-group-year" style="display:none;">' +
        '<label for="yearAnnotation">Anno Di Pubblicazione</label>' +
        '<select id="yearAnnotation" class="form-control">' +
        yearOptionList() +
        '</select></div>' +
        '<div class="form-group" id="form-group-author" style="display:none;">' +
        '<label for="authorAnnotation">Autore</label>' +
        '<select id="authorAnnotation" class="form-control">' +
            //listaAutori()+
        '</select>' +
        '<button class="btn btn-default" onclick="modalAddAuthor(\'' + frammento + '\')" type="button" style="width:100%;margin-top:1px;"><i class="fa fa-plus"></i> Aggiungi Autore</button>' +
        '</div>' +
        '<div class="form-group" id="form-group-title">' +
        '<label id="titleLabelAnnotation" for="titleAnnotation">Titolo</label>' +
        '<div class="input-group">' +
        '<span class="input-group-addon">'+labelTitolo+'</span>' +
        '<input type="text" class="form-control disabled" id="titleAnnotation" value="' + frammento + '">' +
        '</div></div>' +
        '<div class="form-group" id="form-group-url" style="display:none;">' +
        '<label id="urlLabelAnnotation" for="urlAnnotation">URL</label>' +
        '<div class="input-group">' +
        '<span class="input-group-addon">'+labelUrl+'</span>' +
        '<input type="text" class="form-control disabled" id="urlAnnotation" value="' + frammento + '">' +
        '</div></div>';
        if(tipo!='intero'){
            body+='<div class="form-group" id="form-group-cites" style="display:none;">' +
            '<label id="citesLabelAnnotation" for="citesAnnotation">Citazione</label>' +
            '<div class="input-group">' +
            '<span class="input-group-addon">La citazione selezionata &egrave;</span>' +
            '<input type="text" class="form-control disabled" id="citesAnnotation" placeholder="Inserire citazione" value="' + frammento + '">' +
            '</div></div>';
        }
        body+='<div class="form-group" id="form-group-doi" style="display:none;">' +
        '<label id="doiLabelAnnotation" for="doiAnnotation">DOI</label>' +
        '<div class="input-group">' +
        '<span class="input-group-addon">'+labelDoi+'</span>' +
        '<input type="text" class="form-control disabled" id="doiAnnotation" value="' + frammento + '" maxlength="80">' +
        '</div></div>';

    $timestampEdit="";

    return body;
}

// MODIFICA FRANKY INIZIO
function caricaAnnotazione(cnt) {

    if($listaAnnotazioniDaInviare[cnt]!=undefined) {
        //console.log($listaAnnotazioniDaInviare[cnt]);
        if ($listaAnnotazioniDaInviare[cnt].internalData.spedita == false) {
            //console.log("non e' spedita");
            $.ajax({
                url: "core/insertAnnotation.php",
                type: 'POST',
                data: {elenco: $listaAnnotazioniDaInviare[cnt], tipoInserimento: 'annotazioni'},
                success: function () {
                    $listaAnnotazioniDaInviare[cnt].internalData.spedita = true;
                    //console.log("annotazione caricata!");
                },
                error: function () {
                    //console.log("ERRORE ");
                }
            }).then(function(){
                caricaAnnotazione(cnt+1);
            });
        } else {
            caricaAnnotazione(cnt+1);
        }
    }
    else {
        $dial.close();
        $.notify({
            message: 'Ho inviato tutte le annotazioni al server.'
        }, {
            position: 'fixed',
            placement: {
                from: "bottom",
                align: "right"
            },
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            },
            delay: 0
        });
    }
    //}
    /*if ($listaAnnotazioni.length > 0) {
        $.ajax({
            url: "core/insertAnnotation.php",
            type: 'POST',
            data: {elenco: $listaAnnotazioni[0], tipoInserimento: 'annotazioni'},
            success: function () {
                $listaAnnotazioni.splice(0, 1);
                caricaAnnotazione();
                //console.log("annotazione caricata!");
            },
            error: function () {
                //console.log("ERRORE ");
            }
        });
    }*/
    //else {


    //}
}
// MODIFICA FRANKY FINE

// Invio una singola annotazione
// Simone
function sendSingleAnnotation(annotationId){

    var annotazioneDaInviare;
    for(var i=0;i<$listaAnnotazioni.length;i++){
        if($listaAnnotazioni[i].internalData.annotationId==annotationId){
            $listaAnnotazioni[i].internalData.spedita = true;
            annotazioneDaInviare=$listaAnnotazioni[i];
            break;
        }
    }

    // Rimuovo l'annotazione dalla lista temporanea visualizzata
    $('#tempAnnotationManaged' + annotationId).remove();
    $('#tempDividerAnnotationManaged' + annotationId).remove();

    var $contaAnnotazioniDaInviare=0;
    for(var i=0;i<$listaAnnotazioni.length;i++){
        if($listaAnnotazioni[i].internalData.spedita==false){
            $contaAnnotazioniDaInviare++;
        }
    }

    if($contaAnnotazioniDaInviare==0){
        $dialogManageAnnotations.close();
    }

    $.ajax({
        url: "core/insertAnnotation.php",
        type: 'POST',
        data: {elenco: annotazioneDaInviare, tipoInserimento: 'annotazioni'},
        success: function () {
            //console.log("annotazione caricata!");
        },
        error: function () {
            //console.log("ERRORE ");
        }
    });


}

function removeAnnotationTemp(idAnnotazione){

    $('#annotazioneSuCitTemp'+idAnnotazione).remove();

    for(var i=0;i<$listaAnnotazioni.length;i++){
        if($listaAnnotazioni[i].internalData.annotationId==idAnnotazione){
            $listaAnnotazioni.splice(i,1);
            break;
        }
    }

}