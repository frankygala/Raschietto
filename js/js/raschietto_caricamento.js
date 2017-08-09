var spar = "http://tweb2015.cs.unibo.it:8080/data/query";
//var spar = "http://192.168.0.21:3030/raschietto/query";

var prefissi = "PREFIX fabio: <http://purl.org/spar/fabio/>\
          PREFIX oa: <http://www.w3.org/ns/oa#>\
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\
          PREFIX dcterms: <http://purl.org/dc/terms/>\
          PREFIX frbr: <http://purl.org/vocab/frbr/core#>\
          PREFIX ao: <http://purl.org/ontology/ao/core#>\
          PREFIX foaf: <http://xmlns.com/foaf/0.1/>\
          PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\
          PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>\
          PREFIX deo: <http://purl.org/spar/deo/>\
          PREFIX schema: <http://schema.org/>\
          PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>\
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\
          PREFIX owl: <http://www.w3.org/2002/07/owl#>\
          PREFIX rasch: <http://vitali.web.cs.unibo.it/raschietto/>\
          PREFIX cito: <http://purl.org/spar/cito/>\
          PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
          PREFIX sro: <http://salt.semanticauthoring.org/ontologies/sro#> ";


var dataG;
var start;
var end;
var author;
var date;
var percorso;
var testo;
var path;
var email;

var annotazioni=[];
var listaAutoriAnnotazioniVisualizzate=[];

var TEMPANNOTAZIONEDOCUMENTO=[];

var contaAnnotazioniEstratte=0;
var annotazioniEstratteGestite=[];
var annotazioniPerDocumento=[];

var listaDocumenti=[];

// TRIGGER
$(document).on('loadAnnotations', function(){
    loadAnnotations = $.notify({
        message: 'Sto caricando le annotazioni sul documento selezionato...'
    },{
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
        delay: 0
    });
});
$(document).on("loadingAnnotatedDocs",function(){
    loadingDocumentsNotify = $.notify({
        message: 'Sto caricando i documenti annotati...'
    },{
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
        delay: 0
    });
    $("#URIin").attr('disabled',true);
});
$(document).on("annotatedDocsSuccess",function(){
    //loadClickedDocument();
    loadingDocumentsNotify.close();
    $("#URIin").attr('disabled',false);
});
$(document).on('startScrapingForzato', function(){
    loadScrapingForzato = $.notify({
        message: 'Sto effettuando lo scraping forzato...'
    },{
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
        delay: 0
    });
});
$(document).on('stopScrapingForzato', function(){
    loadScrapingForzato.close();
    $.notify({
        message: 'Ho terminato lo scraping forzato.'
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
// / TRIGGER

// AL TERMINE DEL CARICAMENTO DELLA TAB/DOCUMENTO/ANNOTAZIONE
$(document).on('loadedAnnotations', function(){
    documentoInCaricamento=false;
    $('#loadURI').attr('disabled',false);
    $('#overlayLoading').remove();
    $('#tabsContent').find('.tab-pane.doc').removeClass('active');
    //console.log(lastIdClicked);
    $('#'+lastIdClicked).addClass('active');
    $("#URIin").attr('disabled',false);
    $("#page-content-wrapper").css('overflow-y','scroll');
    loadAnnotations.close();
});

// Selezionando documento cliccato, carico e visualizzo il documento
function loadClickedDocument(elem) {
    // Carico documento selezionato nel side menu tra i documenti annotati
    $(elem).on('click', function () {
        // resetto filtri per nascondere le annotazioni
        $('#tabsContent').find('.nascondoAutore').removeClass('nascondoAutore');
        $('#tabsContent').find('.nascondoAnnotazione').removeClass('nascondoAnnotazione');
        if(!documentoInCaricamento) {
            // chiudo il menu
            $("#wrapper").toggleClass("toggled");
            // Se tab non ancora aperta, la apro da zero
            if ($("#" + $(elem).attr('getDocument')).length == 0) {
                // richiamo evento che mi aggiunge overlay per caricamento documento
                // e disabilita temporaneamente i pulsanti in attesa del caricamento
                $(document).trigger('loadClickedDocument');
                //console.log('clicked ' + $(elem).attr('getDocument'));
                $idClicked = $(elem).attr('getDocument');
                lastIdClicked = $idClicked;
                // Creo il container del documento associato alla tab creata sopra
                var $containerDoc = $('<div id="' + $idClicked + '" class="tab-pane doc active"></div>');

                // Carico il documento tramite ajax per inserirlo nel contenitore creato sopra, poi setto
                // varie proprieta'
                $.when(ajaxScraping($(elem).attr('uri'), $containerDoc, $idClicked, this)).done(function (a) {

                    // Setto uri nel pannello cosi' e' piu' comodo
                    $containerDoc.attr("uri-document", a[1]);

                    // Setto titolo del documento cosi' e' piu' comodo
                    $containerDoc.attr("full-doc-title", a[4].title);

                    $containerDoc.attr("dom-origin", "html");

                    // Tolgo classi 'active' dall'intestazione tab e dal contenuto della tab precedentemente attiva
                    $('#documentTabs').find('.active').removeClass('active');
                    $('#tabsContent').find('.active').removeClass('active');

                    var $classSelector = 'close' + a[3];

                    // Creo l'intestazione della tab da inserire tra le tab aperte, la tab inserita è già creata con classe 'active'
                    $('#documentTabs').append('<li class="active" role="tab"><a href="#' + a[3] + '"><button class="close closeTab ' + $classSelector + '" type="button">×</button>' + $(a[4]).attr('short-title') + '</a></li>');

                    // salvo il "codice" del documento
                    var $divId = a[3];

                    // alla chiusura della tab, effettuo routine prima della chiusura
                    // (se ho annotazioni temporanee presenti da salvare, mostro un alert
                    // che chiede conferma della chiusura, se ok, elimino annotazioni
                    // estratte e temporanee associate, altrimenti apro solo la tab)
                    // altrimenti chiudo la tab
                    var $selector = "#documentTabs .closeTab." + $classSelector;
                    $($selector).on('click', function (e) {

                        e.preventDefault();

                        //console.log("e");
                        //console.log("closeClicked");
                        var $closeClicked = $(this);
                        //console.log($closeClicked);
                        closeRoutine($divId, $closeClicked);

                    });

                    // Appendo sopra i pulsanti per creare le annotazioni
                    // Genero grafica menu
                    var $menu = $('<div class="menuAnnotationMobile">' +
                        '<button class="btn btn-primary btnMenuAnnotation" onclick="annotazioniSuDocumento(\'' + a[1] + '\')" data-toggle="tooltip" data-placement="bottom" title="Annotazioni su Documento"><i class="fa fa-list"></i><span class="buttonsText"></span></button>' +
                        '<button class="btn btn-primary btnMenuAnnotation" onclick="annotazioniSuFrammento()" data-toggle="tooltip" data-placement="bottom" title="Annotazioni su Citazione"><i class="fa fa-quote-right"></i><span class="buttonsText"></span></button>' +
                        '<button class="btn btn-info btnMenuAnnotation" onclick="openAnnotationModal($selectedBefore)" data-toggle="tooltip" data-placement="bottom" title="Inserisci Annotazione"><i class="fa fa-edit"></i><span class="buttonsText"></span></button>' +
                        '<button class="btn btn-success btnMenuAnnotation" onclick="scrapingForzato(\'' + a[1] + '\',\'' + lastIdClicked + '\')" data-toggle="tooltip" data-placement="bottom" title="Scraping Forzato"><i class="fa fa-desktop"></i></button>' +
                        '<button class="btn btn-primary btnMenuAnnotation" onclick="manageAnnotations()" data-toggle="tooltip" data-placement="bottom" title="Annotazioni Inserite..."><i class="fa fa-send"></i><span class="buttonsText"></span></button>' +
                        '</div>');

                    // Appendo la grafica del menu
                    $(a[2]).prepend($menu).ready(function () {
                        $("body").tooltip({selector: '[data-toggle=tooltip]'});
                    });
                    // TOOLTIP

                    // se i cookie sono settati, (sono loggato) mostro subito il menu di annotazione
                    if (Cookies.get('name') != undefined && Cookies.get('email') != undefined) {
                        $(a[2]).find('.menuAnnotationMobile').addClass('menuAnnotationMobileShow');
                    }

                    $(document).trigger('loadedClickedDocument');

                });
            }
            // Altrimenti apro la tab già aperta e resetto i filtri
            else {
                $('#documentTabs').find('.active').removeClass('active');
                $('#documentTabs').find('a[href="#' + $(elem).attr('getDocument') + '"]').parent().addClass("active");
                $('#tabsContent').find('.tab-pane.doc').removeClass('active');
                $("#" + $(elem).attr('getDocument')).addClass('active');
                document.getElementById("ckTitolo").checked = true;
                document.getElementById("ckAutori").checked = true;
                document.getElementById("ckAnnoPub").checked = true;
                document.getElementById("ckCommenti").checked = true;
                document.getElementById("ckRetorica").checked = true;
                document.getElementById("ckCitazioni").checked = true;
                document.getElementById("ckDOI").checked = true;
                document.getElementById("ckURL").checked = true;
                $(document).find('.ckAutoreAnnotazione').prop("checked",true);
            }
        }
    });
}

// Cliccando il pulsante di caricamento da uri
$('#loadURI').on('click', function () {
    // se casella non vuota
    if ($('#URIin').val().trim() != '') {
        // pulisco l'url inserito
        $URIin = $('#URIin').val().trim();
        $('#URIin').val($('#URIin').val().trim());
        $URIin = 'http://' + $URIin.replace("http://", "");

        // avvio trigger che mi blocca l'applicazione per attendere il caricamento
        $(document).trigger('loadClickedDocument');

        // Carico titolo documento per inserirlo tra le tabs, poi creo la tab e all'interno inserisco il documento
        // estratto attraverso il file scraping.php
        $.ajax({
            type: "POST",
            url: 'core/extractTitle.php',
            data: 'URI=' + $URIin + '&contatoreDocs=' + $contatoreDocs,
            success: function (data) {

                $data = $.parseJSON(data);

                $sitoInfo = $data;

                // metto dentro sparql end point franky
                if(listaDocumenti.indexOf($URIin) === -1) {
                    $.ajax({
                        url: "core/insertAnnotation.php",
                        type: 'POST',
                        data: {elenco: $sitoInfo, tipoInserimento: 'inserimentoUri'},
                        success: function () {
                            //console.log("url inserito!");
                        },
                        error: function () {
                            //console.log("ERRORE inserimento url!");
                        }
                    });
                }

                // Creo il container del documento associato alla tab creata sopra
                var $containerDoc = $('<div id="' + $data.getDocument + '" class="tab-pane doc active"></div>');

                lastIdClicked = $data.getDocument;

                // Carico il documento tramite ajax per inserirlo nel contenitore creato sopra, poi setto
                // varie proprieta'
                $.when(ajaxScraping($URIin, $containerDoc, $data.getDocument, this)).done(function (a) {

                    // Setto uri nel pannello cosi' e' piu' comodo
                    $containerDoc.attr("uri-document", a[1]);

                    //console.log("title ");
                    //console.log($data);
                    //console.log("--------");

                    // Setto titolo nel pannello cosi' e' piu' comodo+
                    $containerDoc.attr("full-doc-title", $data.title);

                    $containerDoc.attr("dom-origin", "html");

                    // Tolgo classi 'active' dall'intestazione tab e dal contenuto della tab precedentemente attive
                    $('#documentTabs').find('.active').removeClass('active');
                    $('#tabsContent').find('.active').removeClass('active');

                    var $classSelector = 'close' + $data.getDocument;
                    // Creo l'intestazione della tab da inserire tra le tab aperte, la tab inserita è già creata con classe 'active'
                    $('#documentTabs').append('<li class="active" role="tab"><a href="#' + $data.getDocument + '"><button class="close closeTab ' + $classSelector + '" type="button">×</button>' + $data.shortTitle + '</a></li>');

                    var $divId = $data.getDocument;

                    // alla chiusura della tab, effettuo routine prima della chiusura
                    // (se ho annotazioni temporanee presenti, mostro un alert
                    // che chiede conferma della chiusura, se ok, elimino annotazioni
                    // estratte e temporanee associate, altrimenti apro solo la tab)
                    // altrimenti chiudo la tab
                    var $selector = "#documentTabs .closeTab." + $classSelector;
                    $($selector).on('click', function (e) {

                        e.preventDefault();

                        //console.log("e");
                        var $closeClicked = $(this);
                        closeRoutine($divId, $closeClicked);

                    });

                    // Appendo sopra i pulsanti per creare le annotazioni
                    // Genero grafica menu
                    var $menu = $('<div class="menuAnnotationMobile">' +
                        '<button class="btn btn-primary btnMenuAnnotation" onclick="annotazioniSuDocumento(\'' + a[1] + '\')" data-toggle="tooltip" data-placement="bottom" title="Annotazioni su Documento"><i class="fa fa-list"></i><span class="buttonsText"></span></button>' +
                        '<button class="btn btn-primary btnMenuAnnotation" onclick="annotazioniSuFrammento()" data-toggle="tooltip" data-placement="bottom" title="Annotazioni su Citazione"><i class="fa fa-quote-right"></i><span class="buttonsText"></span></button>' +
                        '<button class="btn btn-info btnMenuAnnotation" onclick="openAnnotationModal($selectedBefore)" data-toggle="tooltip" data-placement="bottom" title="Inserisci Annotazione"><i class="fa fa-edit"></i><span class="buttonsText"></span></button>' +
                        '<button class="btn btn-success btnMenuAnnotation" onclick="scrapingForzato(\'' + a[1] + '\',\''+lastIdClicked+'\')" data-toggle="tooltip" data-placement="bottom" title="Scraping Forzato"><i class="fa fa-desktop"></i></button>' +
                        '<button class="btn btn-primary btnMenuAnnotation" onclick="manageAnnotations()" data-toggle="tooltip" data-placement="bottom" title="Annotazioni Inserite..."><i class="fa fa-send"></i><span class="buttonsText"></span></button>' +
                        '</div>');

                    // Appendo la grafica del menu
                    $containerDoc.prepend($menu).ready(function () {
                        $("body").tooltip({selector: '[data-toggle=tooltip]'});
                    });

                    // se i cookie sono settati, (sono loggato) mostro subito il menu di annotazione
                    if (Cookies.get('name') != undefined && Cookies.get('email') != undefined) {
                        $containerDoc.find('.menuAnnotationMobile').addClass('menuAnnotationMobileShow');
                    }

                    // se il titolo del documento estratto non e' presente nella lista documenti annotati nella colonna a sinistra
                    // lo inserisco, altrimenti non faccio nient'altro
                    var found = true;
                    if(listaDocumenti.indexOf($data.title)==-1){
                        listaDocumenti.push($data.title);
                        found=false;
                    }
                    if (!found) {
                        var $titoloDocumento = $data.title;
                        var $uriDocumento = $URIin;
                        var $puntini = "";
                        if($titoloDocumento.length>=24){
                            $puntini="...";
                        }
                        $idDoc = "doc"+$contatoreDocs;
                        var $documento = "<li>" +
                            "<a id=\"open_"+$idDoc+"\" getdocument=\""+$idDoc+"\" title=\""+$titoloDocumento+"\" uri=\""+$uriDocumento +"\" short-title=\""+$titoloDocumento.substr(0,12)+"...\">"+$titoloDocumento.substr(0,24)+$puntini+"</a>" +
                            "</li>";
                        ////console.log($('#'+$idDoc));
                        $("#documenti_annotati").append($documento);
                        loadClickedDocument("#open_"+$idDoc);
                    };

                });

            },
            error: function (data) {
                //console.log("errore");
            },
        }).then(function () {
            $contatoreDocs++;
            // trigger che dice che il documento e' stato caricato correttamente
            $(document).trigger('loadedClickedDocument');
        });

    }
});

// carico il documento, e lo appendo nel div desiderato
function ajaxScraping(uri, containerDoc, idClicked, obj) {
    // Carico il documento (html) desiderato attraverso ajax
    return [$.ajax({
        type: "POST",
        url: 'core/scraping.php',
        data: {request: 'showPage', URI: uri},
        success: function (html) {
            containerDoc.append(html);
            initializeAnnotationMode(containerDoc, idClicked);

            // Inserisco il container nel documento html
            $('#tabsContent').append(containerDoc);

            // DA CARICARE AJAX PER OTTENERE E VISUALIZZARE LE ANNOTAZIONI
            //console.log(document.getElementById(idClicked).parentNode.children.length);
            //console.log("/html/body/div/div[2]/div/div[" + document.getElementById(idClicked).parentNode.children.length + "]");
            // RAPPO CONTROLLA ANNOTAZIONI
            controllaAnnotazioni(uri, "/html/body/div/div[2]/div/div[" + document.getElementById(idClicked).parentNode.children.length + "]");
        },
        error: function (html) {
            containerDoc.append("<b>Errore nel caricamento del documento richiesto</b>");
            $(document).trigger('loadedClickedDocument');
            documentoInCaricamento=false;
            $('#loadURI').attr('disabled',false);
            $('#overlayLoading').remove();
            $('#tabsContent').find('.tab-pane.doc').removeClass('active');
            //console.log(lastIdClicked);
            $('#'+lastIdClicked).addClass('active');
            $("#URIin").attr('disabled',false);
            $("#page-content-wrapper").css('overflow-y','scroll');
            $.notify({
                message: 'C\'e\' stato un errore nello scaricamento del documento.'
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
        }
    }), uri, containerDoc, idClicked, obj];
}

// Franky
/*
scarico la lista degli autori dal mio grafo e permetto la corretta visualizzazione nella modal,
facendo sempre un controllo sulla presenza o meno dei doppioni
 */
var dialogIntero;
function listaAutori() {
    //console.log("sono dentro la funzione listaAutori");

    // localhost
    /*var queryTrovaAutori = "\
     SELECT DISTINCT ?nomeAutore ?idAutore\
     WHERE {\
     ?idAutore a foaf:Person;\
     rdfs:label ?nomeAutore\
     }";*/
    var queryTrovaAutori = "\
     SELECT DISTINCT ?nomeAutore ?idAutore\
     WHERE { GRAPH \<http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539\>{\
     ?idAutore a foaf:Person;\
     rdfs:label ?nomeAutore\
     }\
     }";
    var encodedquery = encodeURIComponent(prefissi + queryTrovaAutori);
    var queryUrl = spar + "?query=" + encodedquery + "&format=" + "json";
    var listaAutori =[];
    $.ajax({
        dataType: "jsonp",
        url: queryUrl,
        success: function (data) {
            $listaAutori="";
            var lista = data.results.bindings;
            //console.log("scarico la lista dal mio grafo!");
            //console.log(lista);
            $('#authorAnnotation').empty();
            for (i = 0; i < lista.length; i++) {
                if (listaAutori.indexOf(lista[i].nomeAutore.value.trim()) == -1) {
                    listaAutori.push(lista[i].nomeAutore.value.trim());
                    if(lista[i].nomeAutore.value.trim()!= ""){ //franky controllo che la label non sia vuota!
                        $listaAutori+='<option value="' + lista[i].nomeAutore.value.trim() + '">' + lista[i].nomeAutore.value.trim() + '</option>';
                        $elencoAutor.push(lista[i].idAutore.value);
                    }
                }
            }
        },
        error: function (err) {
            alert("ERRORE!!");
        }
    }).then(function () {
        $(document).trigger('loadedListaAutori');
        $("#authorAnnotation").append($listaAutori);
    });
}

// Visualizzo le annotazioni inserite sull'intero documento
// Simone
function annotazioniSuDocumento(urlDocumento) {
    lastModalOpened="dialogIntero";
    var $dialog = $('<div></div>');
    var $bodyDialog;
    $bodyDialog='<div class="bodyModalAnnotationsList">';

    //$listaAnnotazioni
    for (var cc = $listaAnnotazioni.length-1; cc >= 0; cc--) {
        //console.log($listaAnnotazioni[cc].target.source);
        //console.log($listaAnnotazioni[cc].target.source.toString().indexOf(urlDocumento)!=-1);
        if (($listaAnnotazioni[cc].target.source.toString().indexOf(urlDocumento)!=-1) &&
            $listaAnnotazioni[cc].target.start == 0 && $listaAnnotazioni[cc].target.end == 0) {

            //console.log($listaAnnotazioni[cc]);
            var annotazioneCorrente = $listaAnnotazioni[cc];

            $bodyDialog += '<div id="internalAnnotationOnDocument'+annotazioneCorrente.internalData.annotationId+'">'+
                '<div class="singleAnnotationReadShownDialog">' +
                '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + annotazioneCorrente.body.object + '</span>\"</span>' +
                '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + annotazioneCorrente.label + '</span>' +
                ' annotato da <span class="latoBoldItalic">' + annotazioneCorrente.provenance.author.name + " &lt;" + annotazioneCorrente.provenance.author.email + '&gt;</span>' +
                ' il <span class="latoBoldItalic">' + annotazioneCorrente.provenance.time + '</span><br /><br />' +
                'Commento: <span class="latoBoldItalic">' + annotazioneCorrente.body.bodyLabel + '</span>';
            $bodyDialog += '</div>';
            if(annotazioneCorrente.internalData.spedita==true){
                $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="deleteTempAnnotation" onclick="removeAnnotationOnDocument(\'locale\',' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div>';
            } else {
                $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotation(' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotation(' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div>';
            }

            $bodyDialog += ('<hr class="dividerAnnotationModal" id="dividerInternalAnnotationOnDocument'+annotazioneCorrente.internalData.annotationId+'" /></div>');

        }
    }

    for (cc = 0; cc < annotazioniEstratteGestite.length; cc++) {
        if ((annotazioniEstratteGestite[cc].annotazione.subject.value.replace("_ver1", "").toString().indexOf((urlDocumento).replace(".html","").replace(".php",""))!=-1) &&
            annotazioniEstratteGestite[cc].annotazione.subject.value.indexOf("._cited_")==-1 &&
            annotazioniEstratteGestite[cc].tipoAnnotazione!="Citazione" &&
            annotazioniEstratteGestite[cc].annotazione.start.value == 0 && annotazioniEstratteGestite[cc].annotazione.end.value == 0 && annotazioniEstratteGestite[cc].tipoAnnotazione!=undefined) {

            //console.log(annotazioniEstratteGestite[cc]);
            var annotazioneCorrente = annotazioniEstratteGestite[cc];

            var nomeAutore = "";
            if (annotazioneCorrente.annotazione.nomeAutore != null) {
                nomeAutore = annotazioneCorrente.annotazione.nomeAutore.value;
            }

            var emailAutore = "";
            if (annotazioneCorrente.annotazione.emailAutore != null) {
                if (annotazioneCorrente.annotazione.nomeAutore != null) {
                    emailAutore = " ";
                }
                emailAutore += '&#60;' + annotazioneCorrente.annotazione.emailAutore.value + '&#62;';
            }

            if (annotazioneCorrente.annotazione.nomeAutore == null && annotazioneCorrente.annotazione.emailAutore == null) {
                nomeAutore = annotazioneCorrente.annotazione.autore.value.replace('mailto:', '');
            }

            var labelSelezione;
            if (annotazioneCorrente.annotazione.bodyLabel != null) {
                labelSelezione = '<span class="latoBoldItalic">' + annotazioneCorrente.annotazione.bodyLabel.value + '</span>';
            } else {
                labelSelezione = "<span class=\"latoBoldItalic\" style=\"color:#b92c28;\">Commento non presente</span>"
            }

            $bodyDialog += '<div id="loadedAnnotationOnDocument'+annotazioneCorrente.idAnnotazione+'">'+
                '<div class="singleAnnotationReadShownDialog">' +
                '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + labelSelezione + '</span>\"</span>' +
                '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + annotazioneCorrente.tipoAnnotazione + '</span>' +
                ' annotato da <span class="latoBoldItalic">' + nomeAutore + emailAutore + '</span>' +
                ' il <span class="latoBoldItalic">' + annotazioneCorrente.annotazione.date.value + '</span>';
            $bodyDialog += '</div>';
            if(annotazioneCorrente.gruppoLTW=="ltw1539"){
                $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="deleteTempAnnotation" onclick="removeAnnotationOnDocument(\'grafo\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div></div>';
            }

            $bodyDialog += ('<hr class="dividerAnnotationModal" id="dividerLoadedAnnotationOnDocument'+annotazioneCorrente.idAnnotazione+'" />');

        }
    }
    //console.log("----------------------------------------------------");

    $dialog.append($bodyDialog);

    dialogIntero = new BootstrapDialog.show({
        title: 'Annotazioni su documento selezionato',
        message: $bodyDialog,
        type: BootstrapDialog.TYPE_DEFAULT
    });

    dialogIntero.getModalHeader().css("background-color", "#d7d7d7");

}

// MODAL ANNOTAZIONE SINGOLA
// Visualizzo le annotazioni presenti su quel frammento
// Simone
var $dialogModalSingleAnnotation;
function setModalSingleAnnotation(spanI,annotNo){
    spanI.on('dblclick', function(e){
        e.stopPropagation();
        var value= getElementXPath(this);

        var dialog;
        var annotazioneCliccata=null;
        for(var i=0;i<annotazioniEstratteGestite.length;i++){
            if(annotazioniEstratteGestite[i].idAnnotazione==annotNo){
                //console.log("entro qui trovato");
                annotazioneCliccata=annotazioniEstratteGestite[i];
            }
        }

        //console.log("annotNo " + annotNo + " annotazioneCliccata:");
        //console.log(annotazioneCliccata);
        value=value.replace(/span[/]/g,"");
        value=value.replace(/[/]span/g,"");
        //console.log("\n value: "+value);
        //console.log("annotazione cliccata: " + annotNo);
        //console.log("xpath cliccato estratto: " + annotazioneCliccata.xpathInterno);

        //console.log("----------------------------------------------------");
        //console.log("annotazioni trovate riferite allo stesso frammento:");

        // Creo due array, uno riferito alle annotazioni scaricate e uno riferito alle annotazioni temporanee
        // per vedere quali annotazioni devo mostrare nella modal
        var annotazioniDaMostrare=[];
        var annotazioniTempDaMostrare=[];
        annotazioniDaMostrare.push(annotNo.toString().replace("temp",""));
        var spanDaControllare=spanI;
        while(spanDaControllare.parent().hasClass('annotazione')){
            spanDaControllare=spanDaControllare.parent();
            if(spanDaControllare.attr('annotation-id').indexOf('temp')!=-1){
                annotazioniTempDaMostrare.push(spanDaControllare.attr('annotation-id').replace("temp",""));
            } else {
                annotazioniDaMostrare.push(spanDaControllare.attr('annotation-id'));
            }
        }

        var $bodyDialog;
        $bodyDialog='<div class="bodyModalAnnotationsList">';

        // RICERCA IN LISTA ANNOTAZIONI TEMPORANEE
        for(var cc=$listaAnnotazioni.length-1;cc>=0;cc--){

            if(annotazioniTempDaMostrare.indexOf($listaAnnotazioni[cc].internalData.annotationId.toString())!=-1){
                if($("#ckAutoreAnnotazione_ltw1539")[0].checked) {

                    var annotazioneCorrente = $listaAnnotazioni[cc];

                    var nomeAutore = annotazioneCorrente.provenance.author.name;

                    var emailAutore = annotazioneCorrente.provenance.author.email;

                    var labelSelezione = annotazioneCorrente.body.bodyLabel;

                    $bodyDialog += '<div id="tempAnnotationManaged' + annotazioneCorrente.internalData.annotationId + '">' +
                        '<div class="singleAnnotationReadShownDialog">' +
                        '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + annotazioneCorrente.body.label + '</span>\"</span>' +
                        '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + annotazioneCorrente.label + '</span>' +
                        ' annotato da <span class="latoBoldItalic">' + nomeAutore + " &lt;" + emailAutore + '&gt;</span>' +
                        ' il <span class="latoBoldItalic">' + annotazioneCorrente.provenance.time + '</span><br /><br />' +
                        'Commento: <span class="latoBoldItalic">' + labelSelezione + "</span>";
                    $bodyDialog += '</div>';

                    // Devo mantenere i dati presenti nella annotazione (ora, nome, email, annotazione)
                    if (annotazioneCorrente.internalData.spedita == false) {
                        $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotation(' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotation(' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div></div>';
                    } else {
                        // annotazione presente nella lista locale, da rimuovere dalla lista temporanea
                        // e da togliere dal server
                        $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotationLoaded(\'interna\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotationLoaded(\'interna\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div>';
                    }

                    $bodyDialog += ('<hr class="dividerAnnotationModal" id="tempDividerAnnotationManaged' + annotazioneCorrente.internalData.annotationId + '\" />');
                    $bodyDialog += "</div>";

                }
            }
        }

        // RICERCA IN LISTA ANNOTAZIONI SCARICATE
        for(cc=0;cc<annotazioniEstratteGestite.length;cc++){
            if(annotazioniDaMostrare.indexOf(annotazioniEstratteGestite[cc].idAnnotazione.toString())!=-1){

                //console.log(annotazioniEstratteGestite[cc].annotazione.subject.value);
                //console.log(annotazioniEstratteGestite[cc].annotazione.subject.value.indexOf("_cited"));
                // Lo faccio perche' alcuni gruppi hanno dato un xpath valido alle annotazioni su citazione
                // e secondo il nostro standard, non e' giusto
                if(annotazioniEstratteGestite[cc].annotazione.subject.value.indexOf("_cited")==-1) {
                    if($("#ckAutoreAnnotazione_"+annotazioniEstratteGestite[cc].gruppoLTW)[0].checked) {

                        //console.log(annotazioniEstratteGestite[cc]);
                        var annotazioneCorrente = annotazioniEstratteGestite[cc];

                        var nomeAutore = "";
                        if (annotazioneCorrente.annotazione.nomeAutore != null) {
                            nomeAutore = annotazioneCorrente.annotazione.nomeAutore.value;
                        }

                        var emailAutore = "";
                        if (annotazioneCorrente.annotazione.emailAutore != null) {
                            if (annotazioneCorrente.annotazione.nomeAutore != null) {
                                emailAutore = " ";
                            }
                            emailAutore += '&#60;' + annotazioneCorrente.annotazione.emailAutore.value + '&#62;';
                        }

                        if (annotazioneCorrente.annotazione.nomeAutore == null && annotazioneCorrente.annotazione.emailAutore == null) {
                            nomeAutore = annotazioneCorrente.annotazione.autore.value.replace('mailto:', '');
                        }

                        var labelSelezione;
                        if (annotazioneCorrente.annotazione.bodyLabel != null) {
                            labelSelezione = '<span class="latoBoldItalic">' + annotazioneCorrente.annotazione.bodyLabel.value + '</span>';
                        } else {
                            labelSelezione = "<span class=\"latoBoldItalic\" style=\"color:#b92c28;\">Commento non presente</span>"
                        }

                        $bodyDialog += '<div id="annotation' + annotazioniEstratteGestite[cc].idAnnotazione.toString() + '">' +
                            '<div class="singleAnnotationReadShownDialog">' +
                            '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + annotazioneCorrente.frammento + '</span>\"</span>' +
                            '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + annotazioneCorrente.tipoAnnotazione + '</span>' +
                            ' annotato da <span class="latoBoldItalic">' + nomeAutore + "" + emailAutore + '</span>' +
                            ' il <span class="latoBoldItalic">' + annotazioneCorrente.annotazione.date.value + '</span><br /><br />' +
                            'Commento: ' + labelSelezione;
                        $bodyDialog += '</div>';

                        // modifica annotazione
                        // Devo mantenere i dati presenti nella annotazione (ora, nome, email, annotazione)
                        if (annotazioneCorrente.annotazione.graph.value.toString().replace("http://vitali.web.cs.unibo.it/raschietto/graph/", "") == "ltw1539") {
                            $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotationLoaded(\'grafo\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotationLoaded(\'grafo\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div>';
                        }

                        $bodyDialog += ('<hr class="dividerAnnotationModal" id="annotationDivider' + annotazioniEstratteGestite[cc].idAnnotazione.toString() + '" />');
                        $bodyDialog += "</div>";

                    }
                }

            }
        }

        $bodyDialog+="</div>";

        //console.log("----------------------------------------------------");

        lastModalOpened="modalSingleAnnotation";
        $dialogModalSingleAnnotation = new BootstrapDialog.show({
            title: 'Annotazioni in frammento selezionato',
            message: $bodyDialog,
            type: BootstrapDialog.TYPE_DEFAULT
        });

        $dialogModalSingleAnnotation.getModalHeader().css("background-color", "#d7d7d7");

    });
}

// Visualizzo le annotazioni presenti su quel frammento se creo una
// annotazione temporanea
// Simone
var $dialogModalTempAnnotation;
function setModalTempAnnotation(spanI,annotNo){
    spanI.on('dblclick', function(e){

        //console.log(annotNo);

        e.stopPropagation();

        var annotazioneCliccata=null;
        for(var i=0;i<$listaAnnotazioni.length;i++){
            if($listaAnnotazioni[i].internalData.annotationId==annotNo.replace("temp","")){
                //console.log("entro qui trovato");
                annotazioneCliccata=$listaAnnotazioni[i];
            }
        }

        //console.log("annotNo " + annotNo + " annotazioneCliccata:");
        //console.log(annotazioneCliccata);
        //console.log("xpath cliccato estratto: " + annotazioneCliccata.internalData.xpath);

        //console.log("----------------------------------------------------");
        //console.log("annotazioni trovate riferite allo stesso frammento:");

        // Creo due array, uno riferito alle annotazioni scaricate e uno riferito alle annotazioni temporanee
        // per vedere quali annotazioni devo mostrare nella modal
        var annotazioniDaMostrare=[];
        var annotazioniTempDaMostrare=[];
        var spanDaControllare=spanI;
        // Inserisco l'annotazione cliccata nell'array di competenza
        // se è un annotazione temporanea:
        if(spanDaControllare.attr('annotation-id').indexOf('temp')!=-1) {
            annotazioniTempDaMostrare.push(annotNo.toString().replace("temp", ""));
        }
        // altrimenti:
        else {
            annotazioniDaMostrare.push(annotNo.toString().replace("temp", ""));
        }
        while(spanDaControllare.parent().hasClass('annotazione')){
            spanDaControllare=spanDaControllare.parent();
            if(spanDaControllare.attr('annotation-id').indexOf('temp')!=-1){
                annotazioniTempDaMostrare.push(spanDaControllare.attr('annotation-id').replace("temp",""));
            } else {
                annotazioniDaMostrare.push(spanDaControllare.attr('annotation-id'));
            }
        }

        var $bodyDialog;
        $bodyDialog='<div class="bodyModalAnnotationsList">';

        // RICERCA IN LISTA ANNOTAZIONI TEMPORANEE
        for(var cc=$listaAnnotazioni.length-1;cc>=0;cc--){

            if(annotazioniTempDaMostrare.indexOf($listaAnnotazioni[cc].internalData.annotationId.toString())!=-1){

                if($("#ckAutoreAnnotazione_ltw1539")[0].checked) {

                    var annotazioneCorrente = $listaAnnotazioni[cc];

                    var nomeAutore = annotazioneCorrente.provenance.author.name;

                    var emailAutore = annotazioneCorrente.provenance.author.email;

                    var labelSelezione = annotazioneCorrente.body.bodyLabel;

                    $bodyDialog += '<div id="tempAnnotationManaged' + annotazioneCorrente.internalData.annotationId + '">' +
                        '<div class="singleAnnotationReadShownDialog">' +
                        '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + annotazioneCorrente.body.label + '</span>\"</span>' +
                        '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + annotazioneCorrente.label + '</span>' +
                        ' annotato da <span class="latoBoldItalic">' + nomeAutore + " &lt;" + emailAutore + '&gt;</span>' +
                        ' il <span class="latoBoldItalic">' + annotazioneCorrente.provenance.time + '</span><br /><br />' +
                        'Commento: <span class="latoBoldItalic">' + labelSelezione + "</span>";
                    $bodyDialog += '</div>';

                    // Devo mantenere i dati presenti nella annotazione (ora, nome, email, annotazione)
                    if (annotazioneCorrente.internalData.spedita == false) {
                        $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotation(' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotation(' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div></div>';
                    } else {
                        // annotazione presente nella lista locale, da rimuovere dalla lista temporanea
                        // e da togliere dal server
                        $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotationLoaded(\'interna\',' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotationLoaded(\'interna\',' + annotazioneCorrente.internalData.annotationId + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div>';
                    }

                    $bodyDialog += ('<hr class="dividerAnnotationModal" id="tempDividerAnnotationManaged' + annotazioneCorrente.internalData.annotationId + '\" />');
                    $bodyDialog += "</div>";

                }
            }
        }

        // RICERCA IN LISTA ANNOTAZIONI SCARICATE
        for(cc=0;cc<annotazioniEstratteGestite.length;cc++){
            if(annotazioniDaMostrare.indexOf(annotazioniEstratteGestite[cc].idAnnotazione.toString())!=-1){

                //console.log(annotazioniEstratteGestite[cc].annotazione.subject.value);
                //console.log(annotazioniEstratteGestite[cc].annotazione.subject.value.indexOf("_cited"));
                // Lo faccio perche' alcuni gruppi hanno dato un xpath valido alle annotazioni su citazione
                // e secondo il nostro standard, non e' giusto
                if(annotazioniEstratteGestite[cc].annotazione.subject.value.indexOf("_cited")==-1) {

                    if($("#ckAutoreAnnotazione_"+annotazioniEstratteGestite[cc].gruppoLTW)[0].checked) {

                        //console.log(annotazioniEstratteGestite[cc]);
                        var annotazioneCorrente = annotazioniEstratteGestite[cc];

                        var nomeAutore = "";
                        if (annotazioneCorrente.annotazione.nomeAutore != null) {
                            nomeAutore = annotazioneCorrente.annotazione.nomeAutore.value;
                        }

                        var emailAutore = "";
                        if (annotazioneCorrente.annotazione.emailAutore != null) {
                            if (annotazioneCorrente.annotazione.nomeAutore != null) {
                                emailAutore = " ";
                            }
                            emailAutore += '&#60;' + annotazioneCorrente.annotazione.emailAutore.value + '&#62;';
                        }

                        if (annotazioneCorrente.annotazione.nomeAutore == null && annotazioneCorrente.annotazione.emailAutore == null) {
                            nomeAutore = annotazioneCorrente.annotazione.autore.value.replace('mailto:', '');
                        }

                        var labelSelezione;
                        if (annotazioneCorrente.annotazione.bodyLabel != null) {
                            labelSelezione = '<span class="latoBoldItalic">' + annotazioneCorrente.annotazione.bodyLabel.value + '</span>';
                        } else {
                            labelSelezione = "<span class=\"latoBoldItalic\" style=\"color:#b92c28;\">Commento non presente</span>"
                        }

                        $bodyDialog += '<div id="annotation' + annotazioniEstratteGestite[cc].idAnnotazione.toString() + '">' +
                            '<div class="singleAnnotationReadShownDialog">' +
                            '<span class="bodyLabelDialog">\"<span class="latoBoldItalic">' + annotazioneCorrente.frammento + '</span>\"</span>' +
                            '<br /><br />E\' un <span class="latoBoldItalic sottolineaTesto">' + annotazioneCorrente.tipoAnnotazione + '</span>' +
                            ' annotato da <span class="latoBoldItalic">' + nomeAutore + "" + emailAutore + '</span>' +
                            ' il <span class="latoBoldItalic">' + annotazioneCorrente.annotazione.date.value + '</span><br /><br />' +
                            'Commento: ' + labelSelezione.replace("ToRaGaMa ", "");
                        $bodyDialog += '</div>';

                        // modifica annotazione
                        // Devo mantenere i dati presenti nella annotazione (ora, nome, email, annotazione)
                        if (annotazioneCorrente.annotazione.graph.value.toString().replace("http://vitali.web.cs.unibo.it/raschietto/graph/", "") == "ltw1539") {
                            $bodyDialog += '<div align="right" class="opTempAnnotation"><span class="editTempAnnotation" onclick="editAnnotationLoaded(\'grafo\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-pencil"></i> <span>Modifica Annotazione</span></span> - <span class="deleteTempAnnotation" onclick="removeAnnotationLoaded(\'grafo\',' + annotazioneCorrente.idAnnotazione + ');"><i class="fa fa-trash"></i> <span>Elimina Annotazione</span></span></div>';
                        }

                        $bodyDialog += ('<hr class="dividerAnnotationModal" id="annotationDivider' + annotazioniEstratteGestite[cc].idAnnotazione.toString() + '" />');
                        $bodyDialog += "</div>";

                    }
                }

            }
        }

        $bodyDialog+="</div>";

        //console.log("----------------------------------------------------");

            lastModalOpened="modalTempAnnotation";
        $dialogModalTempAnnotation = new BootstrapDialog.show({
            title: 'Annotazioni in frammento selezionato',
            message: $bodyDialog,
            type: BootstrapDialog.TYPE_DEFAULT
        });

        $dialogModalTempAnnotation.getModalHeader().css("background-color", "#d7d7d7");

    });
}

//funzione per lo scaricamento della lista dei documenti annotati
// Simone - Franky
function getAnnotatedDocuments() {
    var ccc=0;
    //Recupero documenti annotati
    // localhost franky simone
    var query = prefissi + "SELECT DISTINCT ?item ?title\
                              WHERE { GRAPH \<http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539> {\
                                ?item a fabio:Item ;\
                                rdfs:label ?title .\
                              } }";

    $(document).trigger('loadingAnnotatedDocs');

    var encodedQuery = encodeURIComponent(query);
    url = spar + "?query=" + encodedQuery + "&format=json";
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: function(data) {
            var bindings = data.results.bindings;
            for (var i in bindings) {
                //verifica che i documenti recuperati non siano delle citazioni
                if ((bindings[i].item.value.indexOf("_cited_") == -1) && (bindings[i].item.value.indexOf("_Reference") == -1) && (bindings[i].item.value.indexOf("_ver") == -1)) {
                    var found = true;
                    if(listaDocumenti.indexOf(bindings[i].item.value)==-1){
                        listaDocumenti.push(bindings[i].item.value);
                        found=false;
                        ccc++;
                    }
                    if (!found) {
                        //$(".document [name='document']").append(new Option(bindings[i].title.value, bindings[i].item.value, null, null));
                        ////console.log("title: " + bindings[i].title.value + " value: " + bindings[i].item.value);
                        var $titoloDocumento = bindings[i].title.value;
                        var $uriDocumento = bindings[i].item.value;
                        var $puntini = "";
                        if($titoloDocumento.length>=24){
                            $puntini="...";
                        }
                        $idDoc = "doc"+$contatoreDocs;
                        var $documento = "<li>" +
                            "<a id=\"open_"+$idDoc+"\" getdocument=\""+$idDoc+"\" title=\""+$titoloDocumento+"\" uri=\""+$uriDocumento +"\" short-title=\""+$titoloDocumento.substr(0,12)+"...\">"+$titoloDocumento.substr(0,24)+$puntini+"</a>" +
                            "</li>";
                        //console.log($('#'+$idDoc));
                        $("#documenti_annotati").append($documento);
                        //$("#"+$idDoc).on('click',function(){console.log('click');});
                        loadClickedDocument("#open_"+$idDoc);
                        $contatoreDocs++;
                        //console.log(new Option(bindings[i].title.value, bindings[i].item.value, null, null));
                    };
                }
            }
            //loadAnnotatedDocs();
            $(document).trigger('annotatedDocsSuccess');
        },
        error: function(){
            $(document).trigger('annotatedDocsSuccess');
            $.notify({
                message: 'A causa di un errore di comunicazione con il server, non e\' stato possibile scaricare i documenti annotati.'
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
        }
    }).then(function(){
        console.log("cont " + ccc);
    });
}

function removeAnnotationLoaded(tipo,annotationId){
    if(tipo=="grafo"){
        //id lista annotazioni gestite
        for(var i=0;i<annotazioniEstratteGestite.length;i++){
            if(annotazioniEstratteGestite[i].idAnnotazione==annotationId){
                $("span[annotation-id="+annotationId+"]").contents().unwrap();
                $("span[annotation-id="+annotationId+"]").remove();
                $("#annotation"+annotationId).remove();

                // ELIMINO DAL SERVER

                var $annotazioneDaEliminare=annotazioniEstratteGestite[i];

                console.log($annotazioneDaEliminare);
                $.ajax({
                    url: "core/insertAnnotation.php",
                    type: 'POST',
                    data: {annotazione: $annotazioneDaEliminare, uri:$($("#tabsContent").find(".active")[0]).attr('uri-document'), tipoInserimento: 'cancAnnotazioneCaricata'},
                    success: function () {

                    },
                    error: function () {
                        console.log("ERRORE ");
                    }
                });

                annotazioniEstratteGestite.splice(i,1);

                break;
            }
        }
     } else {
        //da id interno
        for(var t=0;t<$listaAnnotazioni.length;t++){
            if($listaAnnotazioni[t].internalData.annotationId==annotationId){
                $("span[annotation-id=temp"+annotationId+"]").contents().unwrap();
                $("span[annotation-id=temp"+annotationId+"]").remove();
                $("#tempAnnotationManaged"+annotationId).remove();

                var $annotazioneDaEliminare=$listaAnnotazioni[t];

                $.ajax({
                    url: "core/insertAnnotation.php",
                    type: 'POST',
                    data: {annotazione: $annotazioneDaEliminare, tipoInserimento: 'cancAnnotazione'},
                    success: function () {

                    },
                    error: function () {
                        console.log("ERRORE ");
                    }
                });

                $listaAnnotazioni.splice(t,1);
                break;
            }
        }
     }
    console.log(tipo);
    console.log(annotationId);
}

var $dialogTemporaneaSalvata;
var $dialogSalvata;
function editAnnotationLoaded(tipo, annotationId){
    if(tipo=="grafo"){

        var $editAnnot;
        var indiceAnnotazioneDaModificare;
        for(var i=0;i<annotazioniEstratteGestite.length;i++){
            if(annotazioniEstratteGestite[i].idAnnotazione==annotationId){
                $editAnnot=annotazioniEstratteGestite[i];
                indiceAnnotazioneDaModificare=i;
                break;
            }
        }

        if(lastModalOpened=="modalSingleAnnotation") {
            // chiudo la finestra di gestione delle annotazioni temporanee inserite
            $dialogModalSingleAnnotation.close();
        }
        else if(lastModalOpened=="modalTempAnnotation"){
            $dialogModalTempAnnotation.close();
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
            var cleanText = $editAnnot.annotazione.object.value;

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
            if ((parseInt($editAnnot.annotazione.start.value) - parseInt($editAnnot.annotazione.end.value)) == 0) { // se sono nel caso di annotazione su documento...
                caseDocument = true;
                // ...genero un certo corpo della modal...
                $bodyDialog.append(bodyInsertAnnotation("intero","***ANNOTAZIONE SU INTERO DOCUMENTO***",cleanText,$editAnnot.annotazione.nomeAutore.value,$editAnnot.annotazione.emailAutore.value,$editAnnot.annotazione.date.value,null));
            } else {
                // ..altrimenti genero il corpo della modal per il caso di annotazione su frammento
                $bodyDialog.append(bodyInsertAnnotation("frammentoCaricato",cleanText,cleanText,$editAnnot.annotazione.nomeAutore.value,$editAnnot.annotazione.emailAutore.value,$editAnnot.annotazione.date.value,$editAnnot.idAnnotazione));
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
            $dialogSalvata = new BootstrapDialog.show({
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
                    console.log($editAnnot.tipoAnnotazione);
                    $typeAnnotation=tipoAnnotazioneToHas($editAnnot.tipoAnnotazione);
                    $("#typeAnnotation").val($typeAnnotation);
                    // mostro il widget selezionato
                    switch (tipoAnnotazioneToHas($editAnnot.tipoAnnotazione)) {
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
                            $("#yearAnnotation").val($editAnnot.annotazione.bodyLabel.value.replace("L'anno di pubblicazione del documento e' ",""));
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
                    action: function (dialog) { //qui

                        var $predic;
                        var $object;
                        //var $tempAnnotation = $('#tempAnnotation' + $annotation);
                        //console.log($tempAnnotation);
                        //$tempAnnotation.removeClass();
                        // Ricavo predicate e cambio colori all'annotazione
                        switch ($("#typeAnnotation").val()) {
                            case "hasAuthor":
                                $predic = "dcterms:creator";
                                $object = "L\'autore del documento e' " + $('#authorAnnotation').val();
                                console.log($('span[annotation-id='+annotationId+']'));
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("autore autoreAnnotato ltw1539 annotazione");
                                break;
                            case "hasPublicationYear":
                                $predic = "fabio:hasPublicationYear";
                                $object = "L\'anno di pubblicazione del documento e' " + $('#yearAnnotation').val();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("annoPubblicazione annoPubblicazioneAnnotato ltw1539 annotazione");
                                break;
                            case "hasTitle":
                                $predic = "dcterms:title";
                                $object = "Il titolo del documento e' " + $('#titleAnnotation').val();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("titolo titoloAnnotato ltw1539 annotazione");
                                break;
                            case "hasDOI":
                                $predic = "prism:doi";
                                $object = "Il DOI del documento e' " + $('#doiAnnotation').val();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("doi doiAnnotato ltw1539 annotazione");
                                break;
                            case "hasURL":
                                $predic = "fabio:hasURL";
                                $object = "L\'url del documento e' " + $('#urlAnnotation').val();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("url urlAnnotato ltw1539 annotazione");
                                break;
                            case "hasComment":
                                $predic = "schema:comment";
                                $object = $('#commentAnnotation').val();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("commento commentoAnnotato ltw1539 annotazione");
                                break;
                            case "denotesRhetoric":
                                $predic = "semiotics.owl#denotes";
                                $object = "Il frammento selezionato e' un " + $('#typeRhetoric option:selected').text();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("retorica retoricaAnnotato ltw1539 annotazione");
                                break;
                            case "cites":
                                $predic = "cito:cites";
                                $object = "Il frammento citato e' " + $('#citesAnnotation').val();
                                $('span[annotation-id='+annotationId+']').removeClass();
                                $('span[annotation-id='+annotationId+']').addClass("citazione citazioneAnnotato ltw1539 annotazione");
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
                                subject: $editAnnot.annotazione.subject.value,
                                label: $labelAnnotazione,
                                predicate: $predic,
                                object: $objectAnnotazione,
                                bodyLabel: $object
                            },
                            target: {
                                start: $editAnnot.annotazione.start.value,
                                end: $editAnnot.annotazione.end.value,
                                id: $editAnnot.annotazione.path.value,
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
                                fullDocTitle: $($("#tabsContent").find(".active")).attr('full-doc-title'),
                                tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                                annotationId: $contaAnnotazioniProvvisorie,
                                spedita: false
                            }
                        }

                        // la inserisco nella lista di annotazioni inserite
                        $listaAnnotazioni.push($annotazioneCreata);

                        console.log("listaAnnotazioni");
                        console.log($listaAnnotazioni);

                        // Chiudo la dialog
                        $dialogSalvata.close();

                        $('span[annotation-id='+annotationId+']').attr('temp-annotation','tempAnnotation'+$contaAnnotazioniProvvisorie);
                        $('span[annotation-id='+annotationId+']').attr('annotation-id','temp'+$contaAnnotazioniProvvisorie);
                        $('span[annotation-id=temp'+$contaAnnotazioniProvvisorie+']').unbind('dblclick');
                        setModalTempAnnotation($('span[annotation-id=temp'+$contaAnnotazioniProvvisorie+']'),'temp'+$contaAnnotazioniProvvisorie);

                        for(var i=0;i<annotazioniEstratteGestite.length;i++){
                            if(annotazioniEstratteGestite[i].idAnnotazione==annotationId){

                                // ELIMINO DAL SERVER

                                var $annotazioneDaEliminare=annotazioniEstratteGestite[i];

                                console.log($annotazioneDaEliminare);
                                $.ajax({
                                    url: "core/insertAnnotation.php",
                                    type: 'POST',
                                    data: {annotazione: $annotazioneDaEliminare, uri:$($("#tabsContent").find(".active")[0]).attr('uri-document'), tipoInserimento: 'cancAnnotazioneCaricata'},
                                    success: function () {

                                    },
                                    error: function () {
                                        console.log("ERRORE ");
                                    }
                                });

                                annotazioniEstratteGestite.splice(i,1);

                                break;
                            }
                        }

                        //annotazioniEstratteGestite.splice(indiceAnnotazioneDaModificare,1);

                        $contaAnnotazioniProvvisorie++;
                        $typeAnnotation="";
                    }
                },
                    {
                        label: 'Chiudi',
                        cssClass: 'btn-danger',
                        action: function (dialog) {
                            $timestampEdit="";
                            $typeAnnotation="";
                            $dialogSalvata.close();
                            if(lastModalOpened=="manageAnnotations") {
                                manageAnnotations();
                            }
                        }
                    }]
            });

            $dialogSalvata.getModalHeader().css("background-color", "#d7d7d7");

        }


    } else {

        // GUARDARE

        if(lastModalOpened=="modalSingleAnnotation") {
            // chiudo la finestra di gestione delle annotazioni temporanee inserite
            $dialogModalSingleAnnotation.close();
        }
        else if(lastModalOpened=="modalTempAnnotation"){
            $dialogModalTempAnnotation.close();
        }

        // cerco su quale annotazione voglio lavorare
        var $editAnnot = null;
        for (var i = 0; i < $listaAnnotazioni.length; i++) {
            if ($listaAnnotazioni[i].internalData.annotationId == annotationId) {
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
                $bodyDialog.append(bodyInsertAnnotation("intero","***ANNOTAZIONE SU INTERO DOCUMENTO***",cleanText,$editAnnot.provenance.author.name,$editAnnot.provenance.author.email,$editAnnot.provenance.time,annotationId));
            } else {
                // ..altrimenti genero il corpo della modal per il caso di annotazione su frammento
                $bodyDialog.append(bodyInsertAnnotation("frammentoSalvato",$editAnnot.body.label,cleanText,$editAnnot.provenance.author.name,$editAnnot.provenance.author.email,$editAnnot.provenance.time,annotationId));
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
            $dialogSalvata = new BootstrapDialog.show({
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
                        var $tempAnnotation = $('#tempAnnotation' + annotationId);
                        //console.log($tempAnnotation);
                        $tempAnnotation.removeClass();
                        // Ricavo predicate e cambio colori all'annotazione
                        switch ($("#typeAnnotation").val()) {
                            case "hasAuthor":
                                $predic = "dcterms:creator";
                                $object = "L\'autore del documento e' " + $('#authorAnnotation').val();
                                //console.log($('span[temp-annotation=tempAnnotation'+annotationId+']'));
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("autore autoreAnnotato ltw1539 annotazione");
                                break;
                            case "hasPublicationYear":
                                $predic = "fabio:hasPublicationYear";
                                $object = "L\'anno di pubblicazione del documento e' " + $('#yearAnnotation').val();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("annoPubblicazione annoPubblicazioneAnnotato ltw1539 annotazione");
                                break;
                            case "hasTitle":
                                $predic = "dcterms:title";
                                $object = "Il titolo del documento e' " + $('#titleAnnotation').val();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("titolo titoloAnnotato ltw1539 annotazione");
                                break;
                            case "hasDOI":
                                $predic = "prism:doi";
                                $object = "Il DOI del documento e' " + $('#doiAnnotation').val();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("doi doiAnnotato ltw1539 annotazione");
                                break;
                            case "hasURL":
                                $predic = "fabio:hasURL";
                                $object = "L\'url del documento e' " + $('#urlAnnotation').val();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("url urlAnnotato ltw1539 annotazione");
                                break;
                            case "hasComment":
                                $predic = "schema:comment";
                                $object = $('#commentAnnotation').val();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("commento commentoAnnotato ltw1539 annotazione");
                                break;
                            case "denotesRhetoric":
                                $predic = "semiotics.owl#denotes";
                                $object = "Il frammento selezionato e' un " + $('#typeRhetoric option:selected').text();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("retorica retoricaAnnotato ltw1539 annotazione");
                                break;
                            case "cites":
                                $predic = "cito:cites";
                                $object = "Il frammento citato e' " + $('#citesAnnotation').val();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').removeClass();
                                $('span[temp-annotation=tempAnnotation'+annotationId+']').addClass("citazione citazioneAnnotato ltw1539 annotazione");
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

                        //console.log("listaAnnotazioni");
                        //console.log($listaAnnotazioni);

                        // Chiudo la dialog
                        $dialogSalvata.close();

                        for(var t=0;t<$listaAnnotazioni.length;t++){
                            if($listaAnnotazioni[t].internalData.annotationId==annotationId){

                                var $annotazioneDaEliminare=$listaAnnotazioni[t];

                                $.ajax({
                                    url: "core/insertAnnotation.php",
                                    type: 'POST',
                                    data: {annotazione: $annotazioneDaEliminare, tipoInserimento: 'cancAnnotazione'},
                                    success: function () {

                                    },
                                    error: function () {
                                        //console.log("ERRORE ");
                                    }
                                });

                                break;
                            }
                        }

                        // sostituisco l'annotazione vecchia con quella creata
                        for (var i = 0; i < $listaAnnotazioni.length; i++) {
                            if ($listaAnnotazioni[i].internalData.annotationId == annotationId) {
                                $listaAnnotazioni[i] = $annotazioneCreata;
                                break;
                            }
                        }

                    }
                },
                    {
                        label: 'Chiudi',
                        cssClass: 'btn-danger',
                        action: function (dialog) {
                            $timestampEdit="";
                            $dialogSalvata.close();
                        }
                    }]
            });

            $dialogSalvata.getModalHeader().css("background-color", "#d7d7d7");


        }

    }
    //console.log(annotationId);
}

function tipoAnnotazioneToHas(tipoAnnotazione){
    switch (tipoAnnotazione){
        case "Titolo":
            return "hasTitle";
        case "Autore":
            return "hasAuthor";
        case "Anno di Pubblicazione":
            return "hasPublicationYear";
        case "URL":
            return "hasURL";
        case "Commento":
            return "hasComment";
        case "Retorica":
            return "denotesRhetoric";
        case "Citazione":
            return "cites";
        case "DOI":
            return "hasDOI";
    }
}

function removeAnnotationOnDocument(tipo,annotationId){
    if(tipo=="grafo"){
        //id lista annotazioni gestite
        for(var i=0;i<annotazioniEstratteGestite.length;i++){
            if(annotazioniEstratteGestite[i].idAnnotazione==annotationId){
                // DEVO TOGLIERE L'ANNOTAZIONE DALLA MODAL
                //$("span[annotation-id="+annotationId+"]").contents().unwrap();
                //$("span[annotation-id="+annotationId+"]").remove();
                //$("#annotation"+annotationId).remove();

                $("#dividerLoadedAnnotationOnDocument"+annotationId).remove();
                $("#loadedAnnotationOnDocument"+annotationId).remove();

                // ELIMINO DAL SERVER

                var $annotazioneDaEliminare=annotazioniEstratteGestite[i];

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

                annotazioniEstratteGestite.splice(i,1);

                break;
            }
        }
    } else {
        //da id interno
        for(var t=0;t<$listaAnnotazioni.length;t++){
            if($listaAnnotazioni[t].internalData.annotationId==annotationId){
                //$("span[annotation-id=temp"+annotationId+"]").contents().unwrap();
                //$("span[annotation-id=temp"+annotationId+"]").remove();
                //$("#tempAnnotationManaged"+annotationId).remove();

                $("#annotazioneSuCitazione"+annotationId).remove();
                $("#internalAnnotationOnDocument"+annotationId).remove();

                var $annotazioneDaEliminare=$listaAnnotazioni[t];

                $.ajax({
                    url: "core/insertAnnotation.php",
                    type: 'POST',
                    data: {annotazione: $annotazioneDaEliminare, tipoInserimento: 'cancAnnotazione'},
                    success: function () {

                    },
                    error: function () {
                        //console.log("ERRORE ");
                    }
                });

                $listaAnnotazioni.splice(t,1);
                break;
            }
        }
    }
    //console.log(tipo);
    //console.log(annotationId);
}

function removeAnnotationOnCit(tipo,conta){
    if(tipo=="grafo"){

        $("#annotazioneSuCitazione"+conta).remove();

        var $annotazioneDaEliminare=listaAnnotazioniSuCitazionee[conta];

        //console.log($annotazioneDaEliminare);

        $.ajax({
            url: "core/insertAnnotation.php",
            type: 'POST',
            data: {annotazione: $annotazioneDaEliminare, uri:$($("#tabsContent").find(".active")[0]).attr('uri-document'), tipoInserimento: 'cancAnnotazioneSuCitazioneCaricata'},
            success: function () {

            },
            error: function () {
                //console.log("ERRORE ");
            }
        });
    } else {

        $("#annotazioneTemporaneaSuCitazione"+conta).remove();

        for(var cr=0;cr<$listaAnnotazioni.length;cr++){

            if($listaAnnotazioni[cr].internalData.annotationId==conta){
                $listaAnnotazioni.splice(cr,1);
                break;
            }

        }

    }
    //console.log(tipo);
    ////console.log(annotationId);
}