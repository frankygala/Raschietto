function controllaAnnotazioni( uri, domDiv ){

    $(document).trigger('loadAnnotations');
    var query = prefissi + "SELECT ?autore ?nomeAutore ?emailAutore ?date ?labelAnno ?path ?start ?end ?subject ?predicate ?object ?bodyLabel ?graph\
                              WHERE { GRAPH ?graph { \
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
                                              oa:hasSource <"+uri+"> ;\
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
                                 } } ORDER BY DESC(?date)";

    var queryCodificata = encodeURIComponent(query);
    var uriCompleto = spar +"?query=" +queryCodificata + "&format=json";

    $.ajax({
        url: uriCompleto,
        dataType: "jsonp",
        success: function (data) {
            dataG=data;
            openJson(data, domDiv, uri);
        },
        error: function () {
            $(document).trigger('loadedAnnotations');
            $.notify({
                message: 'A causa di un errore di comunicazione con il server, non e\' stato possibile scaricare le annotazioni.'
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

    });
}
//FINE SERVER
var result;
function openJson(data, domDiv, uri){
    var entro=0;
    var tot = data.results.bindings.length;
    annotazioni = data.results.bindings;
    var numeroStart=contaAnnotazioniEstratte

    // ciclo for per visualizzare tutte le annotazioni di un determinato grafo
    for (var i=0; i<tot; i++) {

        var gruppoLTW = JSON.stringify(annotazioni[i].graph.value);
        gruppoLTW = gruppoLTW.replace("http://vitali.web.cs.unibo.it/raschietto/graph/", "");
        gruppoLTW = gruppoLTW.replace(/\"/g, "");

        gruppoLTW = showInfoGroupSel(gruppoLTW);

        if (gruppoLTW != undefined) {

            path = JSON.stringify(annotazioni[i].path.value);

            if (annotazioni[i].start.value == 0 && annotazioni[i].end.value == 0) {
                TEMPANNOTAZIONEDOCUMENTO.push(annotazioni[i]);
                contaAnnotazioniEstratte++;
                var tempType = annotazioni[i].predicate.value;
                var type = "";

                if (tempType.indexOf('/') != -1) {
                    type = tempType.substr(tempType.lastIndexOf('/') + 1);
                }
                else {
                    type = tempType.substr(tempType.lastIndexOf(':') + 1);
                }

                annotazioniEstratteGestite.push({
                    idAnnotazione: contaAnnotazioniEstratte,
                    annotazione: annotazioni[i],
                    docId: lastIdClicked,
                    xpathInterno: "",
                    tipoAnnotazione: convertToString(type),
                    frammento: "",
                    eliminato: false,
                    gruppoLTW: gruppoLTW
                });
            }
            else {
                if (annotazioni[i].subject.value.indexOf("_cited") == -1 && annotazioni[i].path.value != "html_body_form_table3_tr_td_table5_tr_td_table1_tr_td2") {

                    if (annotazioni[i].hasOwnProperty('nomeAutore') == false) {
                        author = annotazioni[i].autore.value;
                        author = author.replace("mailto:", "");
                        listaAutoriAnnotazioniVisualizzate.push(author);
                        author = author.replace(/[^\w\s]/gi, '');
                        author = author.replace(/ /g, '');
                    } else {
                        author = annotazioni[i].nomeAutore.value;
                        listaAutoriAnnotazioniVisualizzate.push(author);
                        author = author.replace(/[^\w\s]/gi, '');
                        author = author.replace(/ /g, '');
                    }
                    date = JSON.stringify(annotazioni[i].date.value);
                    percorso = JSON.stringify(annotazioni[i].path.value);

                    //faccio vari replace per formattare come voglio io il path (regular expression)
                    var temp = path.replace(/\//g, "/");
                    temp = path.replace(/\_/g, "/");
                    temp = temp.replace(/\[|\]/g, "");
                    temp = temp.replace(/\"/g, "");
                    temp = temp.replace(/tbody[/]/g, "");
                    if (!temp.indexOf("/") == 0) {
                        temp = "/" + temp;
                    }
                    temp = "\"" + temp + "\"";

                    //test replace
                    temp = temp.replace(/[/]tr[1][/]/g, "/tr/");
                    temp = temp.replace(/[/]td[1][/]/g, "/td/");

                    var finalClearPath = "";
                    var numeric = false;
                    var number = "";
                    for (var j = 0; j < temp.length; j++) {
                        if ($.isNumeric(temp[j])) {
                            if (temp[j - 1] == 'h') {
                                finalClearPath += temp[j];
                            }
                            else {
                                if (!numeric) {
                                    numeric = true;
                                }
                                number += "" + temp[j];
                            }
                        }
                        else {
                            if (numeric) {
                                numeric = false;
                                finalClearPath += "[" + number + "]" + temp[j];
                                number = "";
                            } else {
                                finalClearPath += temp[j];
                            }
                        }
                    }

                    var tempType = annotazioni[i].predicate.value;
                    var type = "";

                    if (tempType.indexOf('/') != -1) {
                        type = tempType.substr(tempType.lastIndexOf('/') + 1);
                    }
                    else {
                        type = tempType.substr(tempType.lastIndexOf(':') + 1);
                    }

                    var tipoValido = false;
                    switch (type) {
                        case "cites":
                            tipoValido = true;
                            break;
                        case "hasPublicationYear":
                            tipoValido = true;
                            break;
                        case "title":
                            tipoValido = true;
                            break;
                        case "creator":
                            tipoValido = true;
                            break;
                        case "doi":
                            tipoValido = true;
                            break;
                        case "comment":
                            tipoValido = true;
                            break;
                        case "semiotics.owl#denotes":
                            tipoValido = true;
                            break;
                        case "denotesRhetoric":
                            tipoValido = true;
                            break;
                        case "hasURL":
                            tipoValido = true;
                            break;
                    }

                    finalClearPath = finalClearPath.replace("/\[1\]/", "");
                    if (((path.toString().length) - 2) != 0) {

                        // CONTROLLO URI PER VISUALIZZARE ANNOTAZIONI
                        var res;
                        if (uri.indexOf("dlib.org") > -1) {
                            res = finalClearPath.replace("html/body/form/table[3]/tr/td/table[5]/tr/td/table/tr/td[2]", domDiv);
                            res = res.replace("html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", domDiv);
                            res = res.replace("form[1]/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", domDiv);

                        } else if (uri.indexOf(".unibo.it") > -1) {

                            res = finalClearPath.replace('/html/body/div/div[2]/div[2]/div[3]', domDiv); //per unibo
                            res = res.replace('/html/body/div/div[3]/div[2]/div[3]', domDiv); //per unibo
                            res = res.replace('/html/body/div/div/div/div', domDiv); //per unibo
                            res = res.replace('/html/body/div/div[2]/div/div[2]/div[2]', domDiv);
                            res = res.replace('/html/body/div/div[2]/div[2]/div[3]/div[2]', domDiv);
                            res = res.replace('/html/body/div/div[3]/div[2]/div[3]/div[2]', domDiv);
                            res = res.replace('/div[1]/div[2]/div[2]/div[3]', domDiv);
                        } else {
                            res = finalClearPath.replace("html/body", domDiv);
                        }

                        result = res;
                        start = (annotazioni[i].start.value);
                        end = (annotazioni[i].end.value);

                        if (result.lastIndexOf("b")) {
                            var index = result.indexOf("tr");

                            if (index != -1) {

                                var temp1 = result.substr(0, index);
                                var temp2 = result.substr(index, result.length);
                                var temp3 = "tbody/".concat(temp2);
                                result = temp1.concat(temp3);

                            }

                        }
                        result = result.replace(/\"/g, "");

                        if (result.charAt(result.length - 1) == "\/") {
                            result = result.substr(0, result.length - 1);
                        }

                        if (result.indexOf(domDiv) > -1 && tipoValido && result != "/" + domDiv) {
                            entro++;

                            var nodeG = document.evaluate(result.replace(/\"/g, ""), document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                            contaAnnotazioniEstratte++;
                            //console.log(annotazioni[i]);
                            //console.log(gruppoLTW);
                            var selezionato = setSelectionRange(nodeG, start, end, type, contaAnnotazioniEstratte, gruppoLTW);

                            annotazioniEstratteGestite.push({
                                idAnnotazione: contaAnnotazioniEstratte,
                                annotazione: annotazioni[i],
                                docId: lastIdClicked,
                                xpathInterno: result,
                                tipoAnnotazione: convertToString(type),
                                frammento: selezionato.testo,
                                eliminato: false,
                                gruppoLTW: gruppoLTW
                            });
                        }
                    }
                }
            }
            boxInfo = annotazioni;
        }
    }

    var $start=numeroStart+1;
    var $end=contaAnnotazioniEstratte;
    var nonTrovate=false;
    if(numeroStart==contaAnnotazioniEstratte){
        nonTrovate=true;
        end++;
    }
    annotazioniPerDocumento.push({id:lastIdClicked,start:$start,end:$end});

    $(document).trigger('loadedAnnotations');
    if(nonTrovate){
        if(Cookies.get('name')!=null && Cookies.get('email')!=null) {
            if (confirm('Non ho trovato annotazioni per questo documento!\nVuoi eseguire lo SCRAPING FORZATO?')) {
                scrapingForzato(uri, lastIdClicked);
            }
        }
    }
}

function lengthNode(node){
    var children = node.childNodes;
    for (i = 0; i < children.length; i ++) {
        child = children[i];
    }
}

/*
 Questo metodo si occupa di riprodurra una selezione su testo a partire da
 un elemento del DOM, uno inizio ed una fine.
 In base alla presenza o non presenza dei parametri type e id, il metodo produrrà
 ulteriori funzioni.

 el -> elemento del dom
 start, end -> offset di inizio e offset di fine
 type -> tipo di selezione.
 author -> gruppo dell'annnotazione che verrà poi visualizzata

 */
// FONTE : http://htmlasks.com/select_a_portion_of_text_within_a_html_element
function setSelectionRange(el, start, end, type, annotNo, author) {
    if (document.createRange && window.getSelection) {
        var range = document.createRange();
        try {
            range.selectNodeContents(el);
        }
        catch(err) {
        }
        var textNodes = getTextNodesIn(el);
        var foundStart = false;
        var charCount = 0, endCharCount;
        if(textNodes != undefined){
            for (var i = 0, textNode; textNode = textNodes[i++];) {
                endCharCount = charCount + textNode.length;
                if (!foundStart && start >= charCount
                    && (start < endCharCount ||
                    (start == endCharCount && i <= textNodes.length))) {
                    range.setStart(textNode, start - charCount);
                    foundStart = true;
                }
                if (foundStart && end <= endCharCount) {
                    range.setEnd(textNode, end - charCount);
                    break;
                }
                charCount = endCharCount;
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        var testo = getTestoSelezionato(sel);
        var hl=Highlight(sel,type, annotNo, author);
        var risultato= $.extend(true,{},hl);
        sel.removeAllRanges();
        return {risultato: risultato, testo: testo};
    }
}


//metodo (trovato su internet) per mettere in un array tutti i textNodes presenti in un Node qualsiasi
// FONTE : http://stackoverflow.com/questions/298750/how-do-i-select-text-nodes-with-jquery
function getTextNodesIn(node) {
    if(node == null) return;
    var textNodes = [];
    if (node.nodeType == 3) {
        textNodes.push(node);
    } else {
        var children = node.childNodes;
        for (var i = 0, len = children.length; i < len; ++i) {
            textNodes.push.apply(textNodes, getTextNodesIn(children[i]));
        }
    }
    return textNodes;
}


/*
 Metodo di evidenziatura.
 */
function Highlight(sel,type,annotNo, author){
    var r = sel.getRangeAt(0);
    var dimRange = r.toString().length;

    var father = r.commonAncestorContainer;
    if(father!= null){
        var rangeFather = document.createRange();
        rangeFather.selectNodeContents(father);
        rangeFather.setEnd(r.endContainer, r.endOffset);
        var dimRangeFather = rangeFather.toString().length;
        var startSelection = dimRangeFather - dimRange;
        var endSelection = startSelection + dimRange;

        startFinal = startSelection;
        endFinal = endSelection;
        return searchNode(startSelection, endSelection, father,type,annotNo, author);
    }
}

function searchNode(start, end, node,type,annotNo, author){
    if(node!=undefined) {
        if (node.nodeType == 3) {
            if (start >= node.length) {
                start -= node.length;
                end -= node.length;
            } else {
                var lunghezzaNodo = node.length;
                if (lunghezzaNodo < end) {
                    displayNotes(node, start, node.length,type,annotNo, author);
                    end -= lunghezzaNodo;
                    start = 0;
                    return {
                        startOffset: start,
                        endOffset: end,
                        salta: true
                    };
                } else {
                    var span=displayNotes(node, start, end, type,annotNo, author);
                    return {
                        finish: true,
                        span:span
                    };
                }
            }
        }
        var i, children = node.childNodes, child, found = {};
        for (i = 0; i < children.length; i += 1) {
            child = children[i];
            found = searchNode(start, end, child,type,annotNo, author);
            if (found.finish) {
                return found;
            }
            if (found.salta) {
                i++;
            }
            start = found.startOffset;
            end = found.endOffset;
        }
        return {
            startOffset: start,
            endOffset: end
        };
    }
}


//metodo finale per il procedimento di selezionatura
function displayNotes(node, start, end, type, annotNo, author){
    //crea un nuovo oggetto range
    var range = document.createRange();
    //setta lo start del range
    range.setStart(node, start);
    //setta la fine del range
    range.setEnd(node, end);
    //crea un elemento span
    var span = document.createElement('span');

    //all'elemento span gli inserisce le varie classi e attributi in base al tipo di annotazione
    switch(type) {
        case "cites":
            $(span).addClass("citazioneAnnotato");
            $(span).addClass("citazione"); // nuovo campo
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).addClass("annotazione");
            $(span).attr('annotation-id',annotNo);
            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;
        case "hasPublicationYear":
            $(span).addClass("annoPubblicazioneAnnotato");
            $(span).addClass("anno"); // nuovo campo
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).addClass("annotazione");
            $(span).attr('annotation-id',annotNo);
            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;
        case "title":
            $(span).addClass("titoloAnnotato");
            $(span).addClass("titolo"); // nuovo campo
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).addClass("annotazione");
            $(span).attr('annotation-id',annotNo);

            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;
        case "creator":
            $(span).addClass("autoreAnnotato");
            $(span).addClass("autore"); // nuovo campo
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).addClass("annotazione");
            $(span).attr('annotation-id',annotNo);
            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;
        case "doi":
            $(span).addClass("doiAnnotato");
            $(span).addClass("doi"); // nuovo campo
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).addClass("annotazione");
            $(span).attr('annotation-id',annotNo);
            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;
        case "comment":
            $(span).addClass("commentoAnnotato");
            $(span).addClass("commento"); // nuovo campo
            $(span).addClass("annotazione");
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).attr('annotation-id',annotNo);

            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;

        case "semiotics.owl#denotes":
            $(span).addClass("retoricaAnnotato");
            $(span).addClass("retorica"); // nuovo campo
            $(span).addClass("annotazione");
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).attr('annotation-id',annotNo);

            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;

        case "denotesRhetoric":
            $(span).addClass("retoricaAnnotato");
            $(span).addClass("retorica"); // nuovo campo
            $(span).addClass("annotazione");
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).attr('annotation-id',annotNo);

            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;

        case "hasURL":
            $(span).addClass("urlAnnotato");
            $(span).addClass("url"); // nuovo campo
            $(span).addClass("annotazione");
            var authorr = author.replace(/[^\w\s]/gi, '');
            authorr = authorr.replace(/ /g, '');
            $(span).addClass(authorr);
            $(span).attr('annotation-id',annotNo);

            if(!$.isNumeric(annotNo)){
                $(span).attr('temp-annotation','tempAnnotation'+annotNo.substr(4));
                setModalTempAnnotation($(span),annotNo);
            } else {
                setModalSingleAnnotation($(span), annotNo);
            }
            break;
        default:
            $(span).contents().unwrap();
            $(span).remove();
            break;
    }

    visualizzaPerAutore(author);
    //inserisce lo span alla interno del nodo selezionato
    range.surroundContents(span);
    return $(span);
}

////////////////////////////////////////////////////////////////////////////////////////
// gestione delle checkbox
// metodi che inseriscono o disinseriscono la classe con l'attibuto background color
///////////////////////////////////////////////////////////////////////////////////////
$("#ckCitazioni").change(function() {
    if(!this.checked) {
        $('.citazione').addClass('nascondoAnnotazione');
    }else{
        $('.citazione').removeClass('nascondoAnnotazione');
    }
});

//anno
$("#ckAnnoPub").change(function() {
    if(!this.checked) {
        $('.anno').addClass('nascondoAnnotazione');
    }else{
        $('.anno').removeClass('nascondoAnnotazione');
    }
});

//titolo
$("#ckTitolo").change(function() {
    if(!this.checked) {
        $('.titolo').addClass('nascondoAnnotazione');
    }else{
        $('.titolo').removeClass('nascondoAnnotazione');
    }
});

//autore
$("#ckAutori").change(function() {
    if(!this.checked) {
        $('.autore').addClass('nascondoAnnotazione');
    }else{
        $('.autore').removeClass('nascondoAnnotazione');
    }
});

//doi
$("#ckDOI").change(function() {
    if(!this.checked) {
        $('.doi').addClass('nascondoAnnotazione');
    }else{
        $('.doi').removeClass('nascondoAnnotazione');
    }
});

//commenti
$("#ckCommenti").change(function() {
    if(!this.checked) {
        $('.commento').addClass('nascondoAnnotazione');
    }else{
        $('.commento').removeClass('nascondoAnnotazione');
    }
});

//retorica
$("#ckRetorica").change(function() {
    if(!this.checked) {
        $('.retorica').addClass('nascondoAnnotazione');
    }else{
        $('.retorica').removeClass('nascondoAnnotazione');
    }
});

//url
$("#ckURL").change(function() {
    if(!this.checked) {
        $('.url').addClass('nascondoAnnotazione');
    }else{
        $('.url').removeClass('nascondoAnnotazione');
    }
});


//funzione per il recupero della lista dei gruppi attivi
$( document ).ready(function getGroups() {
    getAnnotatedDocuments();
});

// funzione che esegue lo scraping forzato della pagina
function scrapingForzato(uri,divId){
    $(document).trigger('startScrapingForzato');
    /*
      chiamata ajax al file insertAnnotation.php che esegue
      la cancellazione di tutte le annotazioni presente
      sul documento corrente, quello a qui viene fatto lo
      scraping forzato
    */
    $.ajax({
        url:"core/insertAnnotation.php",
        type: 'POST',
        data: {elenco:uri ,tipoInserimento:'cancellazione'},
        success:function(){
            ////console.log("SUCCESS scrapingForzato!!");
        },
        error:function(){
            ////console.log("ERROR scrapingForzato!!");
        }
    });
    // togli gli span delle annotazioni temporare
    for(var c=0;c<$listaAnnotazioni.length;c++){
        if($listaAnnotazioni[c].target.source.indexOf(uri)!=-1){
            $('span[temp-annotation="tempAnnotation' + $listaAnnotazioni[c].internalData.annotationId + '"').contents().unwrap();
            $('span[temp-annotation="tempAnnotation' + $listaAnnotazioni[c].internalData.annotationId + '"').remove();
            $listaAnnotazioni.splice(c,1);
            c--;
        }
    }
    // toglie lo span delle annotazioni gestite
    for(var c=0;c<annotazioniEstratteGestite.length;c++){
        if(annotazioniEstratteGestite[c].annotazione.subject.value.indexOf(uri.replace(".html","").replace(".php","")+"_ver1")!=-1){
            if (annotazioniEstratteGestite[c].annotazione.graph.value.replace("http://vitali.web.cs.unibo.it/raschietto/graph/","") == "ltw1539") {
                $('span[annotation-id="' + annotazioniEstratteGestite[c].idAnnotazione + '"').contents().unwrap();
                $('span[annotation-id="' + annotazioniEstratteGestite[c].idAnnotazione + '"').remove();
            }
        }
    }

    /*
      chiamata ajax al file php che mi esegue lo scraping forzato
      ritornandomi, in caso di successo un file json con all'
      interno tutti i dati dello scraping, il metodo crea l'annotazione
      temporanea , la inserisce nella lista delle annotazioni temporane
      e evidenzia il testo che lo scraping forzato è riuscito a trovare,
      crea anche le annotazioni sul documento, che sono l'url e il titolo
    */
    $.ajax({
        url: 'core/scrapingForzato.php',
        type: 'POST',
        data: {request:'showPage',URI:uri},
        success:function(data){
            // parserizza una stringa JSON
            var dataToJson = JSON.parse(data);
            //////////////////////////////////
            //  ANNOTAZIONE SUL DOCUMENTO   //
            //          URL                 //
            /////////////////////////////////
            var $annotazioneCreata = {
                type: "hasUrl",
                label: "URL",
                body: {
                    subject: uri + "_ver1",
                    label: uri.replace(/\n/g," "),
                    predicate: "fabio:hasURL",
                    object: uri.replace(/\n/g," "),
                    bodyLabel: "L\'URL del documento e\' " + uri.replace(/\n/g," "),
                },
                target: {
                    start: 0,
                    end: 0,
                    id: "",
                    source: uri
                },
                provenance: {
                    author: {
                        name: "ToRaGaMa",
                        email: "toragama@ltw1539.web.cs.unibo.it"
                    },
                    time: moment().format('YYYY-MM-DD') + "T" + moment().format('HH:mm')
                },
                internalData: {
                    divId: divId,
                    fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                    tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                    annotationId: $contaAnnotazioniProvvisorie,
                    xpath: "",
                    spedita:false
                }
            }
            //inserisco l'annotazione creata all'interno della lista e ne incremento il contatore
            $listaAnnotazioni.push($annotazioneCreata);
            $contaAnnotazioniProvvisorie++;

            //////////////////////////////////
            //         TITOLO               //
            /////////////////////////////////
            if(dataToJson.testoTitolo!=null && dataToJson.lunghezzaTitolo!=null  && dataToJson.pathTitolo!=null ){

                //converto l'xpath del documento originale in un xpath che posso visualizzare sul mio file
                if(dataToJson.fonte == "dlib" ){
                    var xpTitolo = dataToJson.pathTitolo.replace("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", "");
                    var genTitolo = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTotTitolo = genTitolo + xpTitolo;
                    var docTitolo =  (document.evaluate(xpTotTitolo, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                }else if(dataToJson.fonte == "unibo"){

                    var genTitolo = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTitolo = dataToJson.pathTitolo.replace("/html/body/div/div[2]/div[2]/div[3]", "");
                    var genTitolo = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTotTitolo = genTitolo + xpTitolo;
                    var docTitolo =  (document.evaluate(xpTotTitolo, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                }

                //creo l'xpath in formato che mi richiede lo sparql
                var xpathTitolo = dataToJson.pathTitolo;
                xpathTitolo = xpathTitolo.replace(/\//g, "_");
                xpathTitolo = xpathTitolo.replace(/\[/g, "");
                xpathTitolo = xpathTitolo.replace(/\]/g, "");
                xpathTitolo = xpathTitolo.replace("_", "");
                if(dataToJson.fonte == "unibo"){
                    xpathTitolo=xpathTitolo.replace("_h3","");
                }
                if(dataToJson.uri.indexOf("4598")!=-1){
                    dataToJson.lunghezzaTitolo -= 2;
                }
                //creo l'annotazione temporanea
                var $annotazioneCreata = {
                    type: "hasTitle",
                    label: "Titolo",
                    body: {
                        subject: uri+"_ver1",
                        label: dataToJson.testoTitolo.replace(/\n/g,""),
                        predicate: "dcterms:title",
                        object: dataToJson.testoTitolo.replace(/\n/g,""),
                        bodyLabel: "Il titolo del documento e' " + dataToJson.testoTitolo.replace(/\n/g,""),
                    },
                    target:{
                        start: 0,
                        end: dataToJson.lunghezzaTitolo,
                        id: xpathTitolo,
                        source: uri
                    },
                    provenance:{
                        author:{
                            name:"ToRaGaMa",
                            email:"toragama@ltw1539.web.cs.unibo.it"
                        },
                        time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                    },
                    internalData:{
                        divId: divId,
                        fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                        tempInternalId: null,
                        annotationId: $contaAnnotazioniProvvisorie,
                        xpath: xpTotTitolo,
                        spedita:false
                    }
                };

                //inserisco l'annotazione temporane nella lista
                $listaAnnotazioni.push($annotazioneCreata);
                //evidenzio l'annotazione appena creata
                var selezionato = setSelectionRange(docTitolo, 0, dataToJson.lunghezzaTitolo, "title", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                //incremento il contatore delle annotazioni create
                $contaAnnotazioniProvvisorie++;

                //////////////////////////////////
                //  ANNOTAZIONE SUL DOCUMENTO   //
                //          TITOLO              //
                /////////////////////////////////
                var $annotazioneCreata = {
                    type: "hasTitle",
                    label: "Titolo",
                    body: {
                        subject: uri+"_ver1",
                        label: dataToJson.testoTitolo.replace(/\n/g,""),
                        predicate: "dcterms:title",
                        object: dataToJson.testoTitolo.replace(/\n/g,""),
                        bodyLabel: "Il titolo del documento e' " + dataToJson.testoTitolo.replace(/\n/g,""),
                    },
                    target:{
                        start: 0,
                        end: 0,
                        id: "",
                        source: uri
                    },
                    provenance:{
                        author:{
                            name:"ToRaGaMa",
                            email:"toragama@ltw1539.web.cs.unibo.it"
                        },
                        time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                    },
                    internalData:{
                        divId: divId,
                        fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                        tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                        annotationId: $contaAnnotazioniProvvisorie,
                        xpath: "",
                        spedita:false
                    }
                };
                //inserisco l'annotazione nella lista delle annotazioni temporanee e ne incremento il contatore
                $listaAnnotazioni.push($annotazioneCreata);
                $contaAnnotazioniProvvisorie++;

            }

            //////////////////////////////////
            //          ANNO               //
            /////////////////////////////////

            if(dataToJson.testoAnno!=null && dataToJson.lunghezzaAnno!=null  && dataToJson.pathAnno!=null ){
                //solo nel caso di dlib dato che unibo.it non ha l'anno di pubblicazione visibile
                //converto l'xpath del documento originale in un xpath che posso visualizzare
                if(dataToJson.fonte == "dlib" ){
                    var xpAnno = dataToJson.pathAnno.replace("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", "");
                    var genAnno = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTotAnno = genAnno + xpAnno;
                    var docAnno =  (document.evaluate(xpTotAnno, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                }

                //prendo l'indice di inizio dell anno
                var numb = dataToJson.testoAnno.match(/\d/g); //prendi tutti i numeri e li metti in un array
                numb = numb.join(""); //unisce gli elementi di un array in una stringa
                var start  = dataToJson.testoAnno.indexOf(numb); //prende l'indice della stringa appena trovata

                //crea un xpath adatto allo sparql
                var xpathAnno = dataToJson.pathAnno;
                xpathAnno = xpathAnno.replace(/\//g, "_");
                xpathAnno = xpathAnno.replace(/\[/g, "");
                xpathAnno = xpathAnno.replace(/\]/g, "");
                xpathAnno = xpathAnno.replace("_", "");

                //crea l'annotazione
                var $annotazioneCreata = {
                    type: "hasPubblicationYear",
                    label: "Anno di Pubblicazione",
                    body: {
                        subject: uri+"_ver1",
                        label: numb.replace(/\n/g,""),
                        predicate: "fabio:hasPublicationYear",
                        object: numb.replace(/\n/g," "),
                        bodyLabel: "L\'anno di pubblicazione del documento e' " + numb.replace(/\n/g,"")
                    },
                    target:{
                        start: start,
                        end: dataToJson.lunghezzaAnno,
                        id: xpathAnno,
                        source: uri
                    },
                    provenance:{
                        author:{
                            name:"ToRaGaMa",
                            email:"toragama@ltw1539.web.cs.unibo.it"
                        },
                        time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                    },
                    internalData:{
                        divId: divId,
                        fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                        tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                        annotationId: $contaAnnotazioniProvvisorie,
                        xpath: xpTotAnno,
                        spedita:false
                    }
                }
                //inserisce l'annotazione nella lista delle annotazioni
                $listaAnnotazioni.push($annotazioneCreata);
                //evidenza il testo appena creato
                var selezionato = setSelectionRange(docAnno, start, dataToJson.lunghezzaAnno, "hasPublicationYear", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                //incrementa il contatore delle annotazioni
                $contaAnnotazioniProvvisorie++;
            }

            //////////////////////////////////
            //  AUTORI DEL DOCUMENTO        //
            /////////////////////////////////
            /*
              nella creazione di questa annotazione sono state fatte due casistiche specifiche
              riguarda se gli autori da inserire sono si dlib o sono di unibo
              dato che la formattazione è motlo diversa nel caso dei due domini,
                  dlib pone gli autori su più nodi
                  unibo li mette in una stringa unica separati dalla virgola
              nel caso in cui lo scrapig sia di dlib il numero degli autori mi ritorna sotto fotma di numero dei nodi
              nel caso in cui sia unibo mi ritorna una stringa
            */
            //prendo il numero degli autori
            var numAutori = dataToJson.numAutori;
            //nel caso sia un numero e non una stringa --> dlib
            if(numAutori != "statistica"){
                //faccio un ciclo per prendere tutti gli autori
                for (var i = 0; i < numAutori; i++) {
                    var datiAutore = dataToJson.autori[i];

                    if(datiAutore[0]!=null && datiAutore[1]!=null  && datiAutore[2]!=null ){

                        var selectorlist = datiAutore[2];
                        // trasformo l'xpath del documento originale in un xpath che posso visualizzare
                        if(dataToJson.fonte == "dlib" ){
                            var genAutore = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                            genAutore = genAutore + "/table";
                            var xpAutore = datiAutore[2].replace("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/table", "");
                            var t = xpAutore.indexOf("/");
                            var appoggioAutore = xpAutore.substr(0,t);
                            genAutore =  genAutore+appoggioAutore;
                            var xpAutore = xpAutore.replace(appoggioAutore, "");
                            var appoggioAutore = xpAutore.charAt(0);
                            var xpAutore = xpAutore.replace(appoggioAutore, "");
                            if(xpAutore.charAt(0) == "]"){
                                xpAutore = xpAutore.slice(1);
                            }
                            genAutore = genAutore +"/tbody/" + xpAutore;
                            var docAutore =  (document.evaluate(genAutore, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                        }

                        //adatto l'xpath nel formato che mi richiede lo sparql
                        var xpathAutore = datiAutore[2];
                        xpathAutore = xpathAutore.replace(/\//g, "_");
                        xpathAutore = xpathAutore.replace(/\[/g, "");
                        xpathAutore = xpathAutore.replace(/\]/g, "");
                        xpathAutore = xpathAutore.replace("_", "");
                        //creo l'annotazione temporanea
                        var $annotazioneCreata = {
                            type: "hasAuthor",
                            label: "Autore" ,
                            body: {
                                subject: uri+"_ver1",
                                label: datiAutore[0].replace(/\n/g,""),
                                predicate: "dcterms:creator",
                                object: datiAutore[0].replace(/\n/g,""),
                                bodyLabel: "L\'autore del documento e' " + datiAutore[0].replace(/\n/g,""),
                            },
                            target:{
                                start: 0,
                                end: datiAutore[1],
                                id: xpathAutore,
                                source: uri
                            },
                            provenance:{
                                author:{
                                    name:"ToRaGaMa",
                                    email:"toragama@ltw1539.web.cs.unibo.it"
                                },
                                time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                            },
                            internalData:{
                                divId: divId,
                                fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                                tempInternalId: null,
                                annotationId: $contaAnnotazioniProvvisorie,
                                xpath: genAutore,
                                spedita:false
                            }
                        }
                        //inserisco l'annotazione nella lista delle annotazioni create
                        $listaAnnotazioni.push($annotazioneCreata);
                        //evidenzio l'annotazione
                        var selezionato = setSelectionRange(docAutore, 0, datiAutore[1] , "creator", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                        //incremento il contatore delle annotazioni
                        $contaAnnotazioniProvvisorie++;
                    }
                    //Francesco Galasso
                    var index = datiAutore[0].indexOf("");
                    var nomeA = datiAutore[0].substr(0, index);
                    var cognomeA = datiAutore[0].substr(index, datiAutore[0].length);
                    var autore=createIRI(nomeA,cognomeA);
                    var person = {autore: autore};
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
                    //Francesco Galasso
                }
            }else {
                // nel caso che sia rivista-statistica
                var arrayRange = new Array();
                var datiAutore = dataToJson.autori[0];
                var string = datiAutore[0];
                var res = string.split(", "); //creo un array di nomi togliendo la stringa tra le parentesi
                var arrayBid = new Array(); //creo un arry
                arrayBid = getPos(res); // creo un array bidimensionale con lo star e l'end di ogni singola stringa
                var num = getNum(res); //prendo la lunghezza dell array

                // converto l'xpath della pagina oridinale in un xpath adatto alla mia visualizzazione
                var genAutore = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                var xpAutore = datiAutore[2].replace("/html/body/div/div[2]/div[2]/div[3]", "");
                genAutore = genAutore + xpAutore + "/em";
                var docAutore =  (document.evaluate(genAutore, document, null, XPathResult.ANY_TYPE, null).iterateNext());

                //faccio il ciclo per ogni autore creando l'annotazione temporanea
                for (var i = 0; i < num; i++) {
                    var datiAutore = dataToJson.autori[0];
                    if(datiAutore[0]!=null && datiAutore[1]!=null  && datiAutore[2]!=null ){
                        var xpathAutore = datiAutore[2];
                        //converto l'xpath nel formato richiesto per lo sparql
                        xpathAutore = xpathAutore.replace(/\//g, "_");
                        xpathAutore = xpathAutore.replace(/\[/g, "");
                        xpathAutore = xpathAutore.replace(/\]/g, "");
                        xpathAutore = xpathAutore.replace("_", "");

                        var $annotazioneCreata = {
                            type: "hasAuthor",
                            label: "Autore" ,
                            body: {
                                subject: uri+"_ver1",
                                label: res[i].replace(/\n/g,""),
                                predicate: "dcterms:creator",
                                object: res[i].replace(/\n/g,""),
                                bodyLabel: "L\'autore del documento e' " + res[i].replace(/\n/g,""),
                            },
                            target:{
                                start: arrayBid[0][i],
                                end: arrayBid[1][i],
                                id: xpathAutore,
                                source: uri
                            },
                            provenance:{
                                author:{
                                    name:"ToRaGaMa",
                                    email:"toragama@ltw1539.web.cs.unibo.it"
                                },
                                time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                            },
                            internalData:{
                                divId: divId,
                                fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                                tempInternalId: null,
                                annotationId: $contaAnnotazioniProvvisorie,
                                xpath: genAutore,
                                spedita:false
                            }
                        }
                        //inserisco l'annotazione nella lista delle annotazioni gestite
                        $listaAnnotazioni.push($annotazioneCreata);
                        //evidenzio il testo
                        var selezionato = setSelectionRange(docAutore, arrayBid[0][i] , arrayBid[1][i] , "creator", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                        //incremento il contatore delle annotazioni
                        $contaAnnotazioniProvvisorie++;
                    }
                    //Francesco Galasso
                    var index = res[i].indexOf(" ");
                    var nomeA = res[i].substr(0, index);
                    var cognomeA = res[i].substr(index, res[i].length);
                    var autore=createIRI(nomeA.trim(),cognomeA.trim());
                    var person = {autore: autore};

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
                    //Francesco Galasso
                }
            }

            //////////////////////////////////
            //  CITAZIONI DEL DOCUMENTO     //
            /////////////////////////////////
            var numCitazioni = dataToJson.numCitazioni; //prendo il numero delle citazioni
            if (numCitazioni != undefined && numCitazioni != null) {
                //ciclo le citazioni per gestirle tutte
                for (var i = 0; i < numCitazioni+1; i++) {

                    var datiCitazione = dataToJson.citazioni[i];
                    if (datiCitazione != undefined) {
                        /*
                          in base alla fonte del documento sulla quale ho fatto lo scraping trasformo xpath
                          in un formato adatto alla visualizzazione del mio documento
                        */
                        if (dataToJson.fonte == "dlib") {
                            var xpCitazioni = datiCitazione[2].replace("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", "");
                            var genCitazioni = "/html/body/div/div[2]/div/div[" + ($($('#documentTabs').find(".active")).index() + 1) + "]";
                            var xpTotCitazioni = genCitazioni + xpCitazioni;
                            var docCitazioni = (document.evaluate(xpTotCitazioni, document, null, XPathResult.ANY_TYPE, null).iterateNext());

                        } else if (dataToJson.fonte == "unibo") {
                            var xpCitazioni = datiCitazione[2].replace("/html/body/div/div[2]/div[2]/div[3]", "");
                            var genCitazioni = "/html/body/div/div[2]/div/div[" + ($($('#documentTabs').find(".active")).index() + 1) + "]";
                            var xpTotCitazioni = genCitazioni + xpCitazioni;
                            var docCitazioni = (document.evaluate(xpTotCitazioni, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                        }

                        if (datiCitazione[0] != null && datiCitazione[1] != null && datiCitazione[2] != null) {
                            //sistemo la fine dell annotione per evitare che si siano spazi bianchi
                            var end = sistemaFineStringa(datiCitazione[0] , datiCitazione[1]);
                            //converto l'xoath in un formato che il mio docuemnto lo possa visualizzare
                            var xpathCitazione = datiCitazione[2];
                            xpathCitazione = xpathCitazione.replace(/\//g, "_");
                            xpathCitazione = xpathCitazione.replace(/\[/g, "");
                            xpathCitazione = xpathCitazione.replace(/\]/g, "");
                            xpathCitazione = xpathCitazione.replace("_", "");
                            //creo l'annotione temporanea
                            var $annotazioneCreata = {
                                type: "cites",
                                label: "Citazione",
                                body: {
                                    subject: uri + "_ver1",
                                    label: datiCitazione[0].replace(/\n/g,""),
                                    predicate: "cito:cites  ",
                                    object: datiCitazione[0].replace(/\n/g,""),
                                    bodyLabel: "La citazione &egrave; " + datiCitazione[0].replace(/\n/g,""),
                                },
                                target: {
                                    start: 0,
                                    end: end,
                                    id: xpathCitazione,
                                    source: uri
                                },
                                provenance: {
                                    author: {
                                        name: "ToRaGaMa",
                                        email: "toragama@ltw1539.web.cs.unibo.it"
                                    },
                                    time: moment().format('YYYY-MM-DD') + "T" + moment().format('HH:mm')
                                },
                                internalData: {
                                    divId: divId,
                                    fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                                    tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                                    annotationId: $contaAnnotazioniProvvisorie,
                                    xpath: xpTotCitazioni,
                                    spedita:false
                                }
                            }
                            //inserisco l'annotazione temporanea nella lista
                            $listaAnnotazioni.push($annotazioneCreata);
                            //evidenzio il testo
                            var selezionato = setSelectionRange(docCitazioni, 0, end , "cites", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                            //incremtno il contatore delle annotazioni
                            $contaAnnotazioniProvvisorie++;
                        }
                    }
                }
            }

            /////////////////////////////////
            //  ANNOTAZIONI SUL DOCUMENTO  //
            //  TITOLO DEL DOCUMENTO       //
            /////////////////////////////////

            /*
              nel caso che il documento non sia ne di dlib ne di unibo lo scrapig viene
              fatto solo del titolo che viene preso dai metadati
            */
            if(dataToJson.fonte == "altro"){
                if(dataToJson.testoTitolo != undefined && dataToJson.testoTitolo != null){

                    var $annotazioneCreata = {
                        type: "hasTitle",
                        label: "Titolo",
                        body: {
                            subject: uri + "_ver1",
                            label: dataToJson.testoTitolo.replace(/\n/g,""),
                            predicate: "dcterms:title",
                            object: dataToJson.testoTitolo.replace(/\n/g,""),
                            bodyLabel: "Il titolo del documento e' " + dataToJson.testoTitolo.replace(/\n/g," "),
                        },
                        target: {
                            start: 0,
                            end: 0,
                            id: "",
                            source: uri
                        },
                        provenance: {
                            author: {
                                name: "ToRaGaMa",
                                email: "toragama@ltw1539.web.cs.unibo.it"
                            },
                            time: moment().format('YYYY-MM-DD') + "T" + moment().format('HH:mm')
                        },
                        internalData: {
                            divId: divId,
                            fullDocTitle: $('#tabsContent').find('.active').attr('full-doc-title'),
                            tempInternalId: null, // Qui va l'id univoco temporaneo del frammento selezionato e non ancora salvato
                            annotationId: $contaAnnotazioniProvvisorie,
                            xpath: "",
                            spedita:false
                        }
                    }
                    $listaAnnotazioni.push($annotazioneCreata);
                    $contaAnnotazioniProvvisorie++;
                }
            }

            ////////////////////////////////////
            //  ABSTRACT DEL DOCUMENTO       //
            ///////////////////////////////////
            if(dataToJson.testoAbstract!=null && dataToJson.lunghezzaAbstract!=null  && dataToJson.pathAbstract!=null ){
                // sistemo l'end al fine che non ci siano spazi bianchi
                var end = sistemaFineStringa(dataToJson.testoAbstract, dataToJson.lunghezzaAbstract);
                //convero xpath in mdo che sia visibile sul mio documento
                if(dataToJson.fonte == "dlib" ){
                    var xpAbstract = dataToJson.pathAbstract.replace("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", "");
                    var genAbstract = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTotAbstract = genAbstract + xpAbstract;
                    var docAbstract =  (document.evaluate(xpTotAbstract, document, null, XPathResult.ANY_TYPE, null).iterateNext());

                }else if(dataToJson.fonte == "unibo"){
                    var genAbstract = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpAbstract = dataToJson.pathAbstract.replace("/html/body/div/div[2]/div[2]/div[3]", "");
                    var xpTotAbstract = genAbstract + xpAbstract;
                    //console.log("xpTotAbstract");
                    //console.log(xpTotAbstract);
                    var docAbstract =  (document.evaluate(xpTotAbstract, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                }
                //console.log(docAbstract);
                //convero xpath nel formato sparql
                var xpathAbstract = dataToJson.pathAbstract;
                xpathAbstract = xpathAbstract.replace(/\//g, "_");
                xpathAbstract = xpathAbstract.replace(/\[/g, "");
                xpathAbstract = xpathAbstract.replace(/\]/g, "");
                xpathAbstract = xpathAbstract.replace("_", "");

                //creo l'annotazione
                var $annotazioneCreata = {
                    type: "denotesRhetoric",
                    label: "Retorica",
                    body: {
                        subject: uri+"_ver1",
                        label: dataToJson.testoAbstract.trim().replace(/\n/g,""), // modfica rappo
                        predicate: "semiotics.owl#denotes",
                        object: dataToJson.testoAbstract.trim().replace(/\n/g,""), //modifca rappo
                        bodyLabel: "Il frammento selezionato e\' un Abstract",
                    },
                    target:{
                        start: 0,
                        end: end,
                        id: xpathAbstract,
                        source: uri
                    },
                    provenance:{
                        author:{
                            name:"ToRaGaMa",
                            email:"toragama@ltw1539.web.cs.unibo.it"
                        },
                        time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                    },
                    internalData:{
                        divId: divId,
                        fullDocTitle: dataToJson.testoTitolo,
                        tempInternalId: null,
                        annotationId: $contaAnnotazioniProvvisorie,
                        xpath: xpTotAbstract,
                        spedita: false
                    }
                }
                //inserisco l'annotazione nella lista delle annotazioni temporanee
                $listaAnnotazioni.push($annotazioneCreata);
                //evidenzio il testo
                var selezionato = setSelectionRange(docAbstract, 0, end, "denotesRhetoric", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                //incremotno il contatore
                $contaAnnotazioniProvvisorie++;
            }

            ////////////////////////////////////
            //              DOI              //
            ///////////////////////////////////
            if(dataToJson.doiCompleto!=null && dataToJson.pathDoi!=null  && dataToJson.fineDoi!=null ){
                //converto l'xpath in modo che sia visibile sul documento
                if(dataToJson.fonte == "dlib" ){
                    var xpDOI = dataToJson.pathDoi.replace("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]", "");
                    var genDOI = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTotDOI = genDOI + xpDOI;
                    var docDOI =  (document.evaluate(xpTotDOI, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                }else if(dataToJson.fonte == "unibo"){

                    var xpDOI = dataToJson.pathDoi.replace("/html/body/div/div[2]/div[2]/div[3]", "");
                    var genDOI = "/html/body/div/div[2]/div/div["+($($('#documentTabs').find(".active")).index()+1) + "]";
                    var xpTotDOI = genDOI + xpDOI;
                    var docDOI =  (document.evaluate(xpTotDOI, document, null, XPathResult.ANY_TYPE, null).iterateNext());
                }
                //converto xpath secondo il formato sparql
                var xpathDoi = dataToJson.pathDoi;
                xpathDoi = xpathDoi.replace(/\//g, "_");
                xpathDoi = xpathDoi.replace(/\[/g, "");
                xpathDoi = xpathDoi.replace(/\]/g, "");
                xpathDoi = xpathDoi.replace("_", "");

                //setto lo start del docuemnto
                if(dataToJson.fonte =="dlib"){
                    var n = dataToJson.doiCompleto.indexOf("doi:");
                    var start = n+4;
                    var doi = dataToJson.doiCompleto.substr(start, dataToJson.fineDoi);
                    if(doi.indexOf("november14-beel") != -1){ // MODIFICA FRANKY
                        var start = 302;
                    }
                } else if (dataToJson.fonte =="unibo") {
                    var start = 0;
                    var doi = dataToJson.doiCompleto;
                }
                //correggo l'end al fine che non ci siano spazi bianchi
                var end = sistemaFineStringa(dataToJson.doiCompleto,dataToJson.fineDoi);
                var $annotazioneCreata = {
                    type: "hasDOI",
                    label: "DOI",
                    body: {
                        subject: uri+"_ver1",
                        label: doi.trim().replace(/\n/g,""),
                        predicate: "prism:doi",
                        object: doi.trim().replace(/\n/g,""),
                        bodyLabel: "Il DOI del documento &egrave; " + doi.replace(/\n/g," ")
                    },
                    target:{
                        start: start,
                        end: end,
                        id: xpathDoi,
                        source: uri
                    },
                    provenance:{
                        author:{
                            name:"ToRaGaMa",
                            email:"toragama@ltw1539.web.cs.unibo.it"
                        },
                        time:moment().format('YYYY-MM-DD')+"T"+moment().format('HH:mm')
                    },
                    internalData:{
                        divId: divId,
                        fullDocTitle: dataToJson.testoTitolo,
                        tempInternalId: null,
                        annotationId: $contaAnnotazioniProvvisorie,
                        xpath: xpTotDOI,
                        spedita: false
                    }
                }
                //inserisco l'annotazione all'interno della lista delle annotazioni temporane
                $listaAnnotazioni.push($annotazioneCreata);
                //evidenzio il testo selezionato
                var selezionato = setSelectionRange(docDOI, start, end, "doi", "temp" + $contaAnnotazioniProvvisorie, "ltw1539");
                //incremento il contatore
                $contaAnnotazioniProvvisorie++;
            }
        },
        error: function(html){
            $.notify({
                message: 'Non e\' stato possibile eseguire lo scraping forzato su questo documento.'
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
        $(document).trigger('stopScrapingForzato');
    });
}


function showInfoGroup(numeroGruppo){
    var nomeGruppo;
    switch (numeroGruppo) {
        case "ltw1539":
            nomeGruppo="ToRaGaMa";
            break;
        case "ltw1516":
            nomeGruppo="L.E.U.M.";
            break;
        case "ltw1547":
            nomeGruppo="walterWhite.exe";
            break;
        case "ltw1538":
            nomeGruppo="IronWeb";
            break;
        case "ltw1521":
            nomeGruppo="Sparkle Parkle";
            break;
        case "ltw1508":
            nomeGruppo="Let it code";
            break;
        case "ltw1542":
            nomeGruppo="Brullo";
            break;
    }
    return nomeGruppo;
}

function showInfoGroupSel(numeroGruppo){
    var nomeGruppo;
    switch (numeroGruppo) {
        case "ltw1539":
            nomeGruppo="ltw1539";
            break;
        case "ltw1516":
            nomeGruppo="ltw1516";
            break;
        case "ltw1547":
            nomeGruppo="ltw1547";
            break;
        case "ltw1538":
            nomeGruppo="ltw1538";
            break;
        case "ltw1521":
            nomeGruppo="ltw1521";
            break;
        case "ltw1508":
            nomeGruppo="ltw1508";
            break;
        case "ltw1542":
            nomeGruppo="ltw1542";
            break;
    }
    return nomeGruppo;
}

/*
  funzione che prende in input una stringa e la sua lunghezza, controlla che alla
  fien della stringa non ci siano spazi bianchi al fine di mandare sullo sparql uno
  star e un end corretti
*/
function sistemaFineStringa(string , end) {
    var length = string.length;
    var test=0;
    var scremo = 0 ;
    var stop = 0;
    for (var i = 0; i < length; i++) {
        var lastChar = string.charAt(length - (i+1));
        if(stop == 0){
            if ((lastChar == ' ') || (lastChar == '\t') || (lastChar == '\n')){
                scremo++;
            }else {
                stop++;
            }
        }
        test++;
    }
    var end = end - scremo;
    return end;
}
