/* SELEZIONE TESTO
 * La selezione è possibile all'interno dei div all'interno di classe main-content, contenuti
 * a loro volta all'interno di div di classe doc */

// Variabile locale che contiene cio' che ho selezionato
var $selectedText;
// Variabile locale che contiene cio' che ho selezionato prima dell'ultima selezione
var $selectedBefore;

var lastIdClicked;

var $contatoreDocs = 1;

var $nodoSelezionatoNoSpan;

var $cited=1;
var $listaAutori="";

// Selezione per annotazione
var $startSelection, $endSelection, $selectedElement;
// Lista annotazioni globale
var $listaAnnotazioni = [];
// Conteggio annotazioni provvisorie;
var $contaAnnotazioniProvvisorie = 1;

var frammentoSelezionato;

var $sitoInfo=[];
var $elencoAutor=[]; //franky

// RICONOSCE SE L'ACCESSO AVVIENE DA MOBILE
var isMobile = false;
// device detection
if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) isMobile = true;

// Annotazioni create globale
var $annotazioneCreata;

var documentoInCaricamento=false;

// Notifiche su eventi
var loadingDocumentsNotify;
var $loadClickedDocument;
var loadAnnotations;
var loadedAnnotations;
var loadScrapingForzato;

var $datiTemporaneiModal;
var modalitaModifica=false;
var lastModalOpened='';


/* Avvio lo script al caricamento del documento */
$(document).ready(function ($) {
    initializeAnnotationMode();
    $("#loadURI").attr("disabled",false);
    $.getScript("js/xpath.js");
    rangy.init();
    //RAPPO
    document.getElementById("ckTitolo").checked = true;
    document.getElementById("ckAutori").checked = true;
    document.getElementById("ckAnnoPub").checked = true;
    document.getElementById("ckCommenti").checked = true;
    document.getElementById("ckRetorica").checked = true;
    document.getElementById("ckCitazioni").checked = true;
    document.getElementById("ckDOI").checked = true;
    document.getElementById("ckURL").checked = true;
    //RAPPO
});

/* Script che permette di settare i comportamenti necessari
 * al funzionamento dell'applicazione */
function initializeAnnotationMode(obj, tabID) {
    if (obj == null) {
    }
    else {
        obj.on('mouseup', function (f) {
            /* Se sono in modalità annotator */
            if (Cookies.get('name') != undefined && Cookies.get('email') != undefined) {
                //console.log(window.getSelection());
                // Salvo in una variabile locale, cio' che ho selezionato
                if ($selectedText != null) {
                    $selectedBefore = $selectedText;
                }
                //Restituisce un oggetto selection che rappresenta il testo selezionato dall'utente.
                $selectedText = window.getSelection();
                //prende il testo selezionato
                frammentoSelezionato = getTestoSelezionato();
                //prende il nodo padre
                var container = $selectedText.focusNode.parentNode; //nostro nodo
                var temp = container;
                //nel caso sia in un link prendi il noso padre ancora
                if(temp.tagName=="A"){
                    temp=temp.parentElement;
                }
                //nel caso sia in un elemento em prendi il noso padre ancora
                if(temp.tagName=="EM"){
                    temp=temp.parentElement;
                }
                //tramite questo for scremo tutti i nodi che inseriamo noi quando scarichiamo il documento
                //al fine di prende il nodo reale dove è stat fatta la sottolineatura
                var spans = document.getElementsByTagName("span");
                for (var i = 0; i < spans.length; i++) {

                    if (temp.className.indexOf("annotazione") != -1) {
                        if (continua = true) {
                            temp = temp.parentNode;
                        }
                    } else {
                        // variabile di uscita --> quando lo trova cambia di stato e l'if sopra smette di entrare nel corpo
                        continua = false;
                    }
                    if(temp.tagName=="A"){
                        temp=temp.parentElement;
                    }
                    if(temp.tagName=="EM"){
                        temp=temp.parentElement;
                    }
                }

                $nodoSelezionatoNoSpan = temp;
                //prendi l'xpath dell elemento
                $selectedElement = getElementXPath(temp);
                continua = true;
                //Restituisce un oggetto range in posizine zero che rappresenta il nodo selezionato.
                var range = $selectedText.getRangeAt(0);
                //Restituisce un oggetto Range con i punti d'inizio e di fine identici a quelli del Range attuale.
                var preCaretRange = range.cloneRange();
                //mposta il Range perchè contenga il contenuti di un dato Node.
                preCaretRange.selectNodeContents($nodoSelezionatoNoSpan);
                /*
                  Imposta la posizione finale di un Range.
                  paramento 1 --> Il Node che termina il Range
                  paramento 2 --> Un intero maggiore o uguale a zero che rappresenta la distanza della fine del Range dall'inizio del paramentro 1
                */
                preCaretRange.setEnd(range.endContainer, range.endOffset);
                if(elementContainsSelection($nodoSelezionatoNoSpan)) {
                    //prende la lunghezza del range
                    $endSelection = preCaretRange.toString().length;
                    //imposta l'inizio del range
                    $startSelection = $endSelection - range.toString().length;
                // /RAPPO
                } else {
                    $startSelection = -1;
                    $endSelection = -1;
                }
            }
        });

        // FONTE: http://stackoverflow.com/questions/972808/get-selected-node-id
        function getFrammentoSelezionato() {
            if (window.getSelection) {
                return window.getSelection();
            } else if (document.getSelection) {
                return document.getSelection();
            } else if (document.selection) {
                return document.selection.createRange().text;
            }
        }

        // FONTE: http://stackoverflow.com/questions/5222814/window-getselection-return-html
        function getTestoSelezionato() {
            var testo = "";
            if (typeof window.getSelection !== "undefined") {
                var selezione = window.getSelection();
                if (selezione.rangeCount) {
                    var contenitore = document.createElement("div");
                    for (var i = 0, len = selezione.rangeCount; i < len; ++i) {
                        contenitore.appendChild(selezione.getRangeAt(i).cloneContents());
                    }
                    testoTemp = contenitore.innerHTML;
                    testo = testoTemp.replace(/<\/?[^>]+(>|$)/g, "");
                }
            } else if (typeof document.selection !== "undefined") {
                if (document.selection.type === "Text") {
                    testo = document.selection.createRange().htmlText;
                }
            }
            return testo;
        }

    }
}

/* SE I COOKIE SONO SETTATI (CIOE' SE SONO IN MODALITA' ANNOTATOR O MENO),
   MOSTRO O NASCONDO I PULSANTI DEDICATI ALLE OPERAZIONI DA ESEGUIRE NEI DOCUMENTI
 */
$(document).on('cookieSet', function () {

    $('.menuAnnotationMobile').addClass('menuAnnotationMobileShow');

});

$(document).on('cookieUnset', function () {

    $('.menuAnnotationMobile').removeClass('menuAnnotationMobileShow');

});

// EVENTO INIZIO CARICAMENTO DOCUMENTO/TAB
$(document).on('loadClickedDocument', function () {
    documentoInCaricamento=true;
    //RAPPO
    document.getElementById("ckTitolo").checked = true;
    document.getElementById("ckAutori").checked = true;
    document.getElementById("ckAnnoPub").checked = true;
    document.getElementById("ckCommenti").checked = true;
    document.getElementById("ckRetorica").checked = true;
    document.getElementById("ckCitazioni").checked = true;
    document.getElementById("ckDOI").checked = true;
    document.getElementById("ckURL").checked = true;
    $(document).find('.ckAutoreAnnotazione').prop("checked",true);
    //RAPPO
    $('#loadURI').attr('disabled',true);
    $("#URIin").attr('disabled', true);
    $loadClickedDocument = $.notify({
        message: 'Sto caricando il documento selezionato...'
    }, {
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
    $('<div id="overlayLoading" style="position:fixed;top:' + $('#headerContainer').height() + 'px;left:0;z-index:100; width:100%; height:100%; background-color: rgba(180,180,180,0.8);"><img style="position:fixed;right:0;left:0;margin-right:auto;margin-left:auto;top:' + ($('#page-content-wrapper').height() / 2) + 'px;" src="img/loading.gif" width="250px"></div>').appendTo("#page-content-wrapper");
    $("#page-content-wrapper").css('overflow-y', 'hidden');
});
$(document).on('loadedClickedDocument', function () {
    $loadClickedDocument.close();
});

// verifico se sono presenti annotazioni temporanee da inviare riferite al documento che si sta chiudendo,
// se si chiedo conferma prima di chiuderlo, altrimenti lo chiudo senza chiedere altre cose
function closeRoutine(elem, closeClicked) {

    var idDoc = elem;
    //console.log(idDoc);

    // verifico quante annotazioni da inviare su quel documento ci sono
    var numeroAnnotazioniTemporanee = 0;
    for (var r = 0; r < $listaAnnotazioni.length; r++) {
        if ($listaAnnotazioni[r].internalData.divId == idDoc && $listaAnnotazioni[r].internalData.spedita==false) {
            numeroAnnotazioniTemporanee++;
        }
    }

    // se ci sono annotazioni temporanee da inviare riferite a quel documento, chiedo conferma prima di chiudere
    if (numeroAnnotazioniTemporanee > 0) {

        if (confirm('Stai chiudendo un documento che contiene annotazioni temporanee non ancora inviate!\nVuoi chiudere comunque la tab selezionata?')) {

            //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
            var tabContentId = $(closeClicked).parent().attr("href");
            $(closeClicked).parent().parent().remove(); //remove li of tab
            $('#documentTabs a:last').tab('show'); // Select first tab
            $(tabContentId).remove(); //remove respective tab content

            removeAnnotationsDoc(idDoc);

        }

    } else { // altrimenti chiudo senza chiede niente
        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(closeClicked).parent().attr("href");
        $(closeClicked).parent().parent().remove(); //remove li of tab
        $('#documentTabs a:last').tab('show'); // Select first tab
        $(tabContentId).remove(); //remove respective tab content

        removeAnnotationsDoc(idDoc);
    }

}

// Rimuove dalla lista delle annotazioni scaricate e dalla lista delle annotazioni temporanee,
// tutte le annotazioni relative A QUEL DOCUMENTO SELEZIONATO che sto chiudendo
// Simone
function removeAnnotationsDoc(docId) {

    // rimuovo dalla lista temporanea
    for (var r = 0; r < $listaAnnotazioni.length; r++) {
        if ($listaAnnotazioni[r].internalData.divId == docId) {
            $listaAnnotazioni.splice(r, 1);
            r--;
        }
    }

    var elem = null;

    // cerco dalla lista dei riferimenti quali elementi devo rimuovere
    // mi torna un oggetto con {id, codice di start, codice di end}
    for (var j = 0; j < annotazioniPerDocumento.length; j++) {
        if (annotazioniPerDocumento[j].id == docId) {
            elem = annotazioniPerDocumento[j];
            annotazioniPerDocumento.splice(j, 1);
            break;
        }
    }
    if (elem == null) {
        return;
    }

    // rimuovo le annotazioni scaricate con riferimento sopra
    if (elem.start != elem.end) {
        for (var i = 0; i < annotazioniEstratteGestite.length; i++) {
            if ((annotazioniEstratteGestite[i].idAnnotazione >= elem.start) && (annotazioniEstratteGestite[i].idAnnotazione <= elem.end)) {
                annotazioniEstratteGestite.splice(i, 1);
                i--;
            }
        }
    }

    //console.log("annotazioniPerDocumento new");
    //console.log(annotazioniPerDocumento);
    //console.log("annotazioniEstratteGestite new");
    //console.log(annotazioniEstratteGestite);
}

// FONTE: http://stackoverflow.com/questions/8339857/how-to-know-if-selected-text-is-inside-a-specific-div
function isOrContains(node, container) {
    while (node) {
        if (node === container) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

function elementContainsSelection(el) {
    var sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount > 0) {
            for (var i = 0; i < sel.rangeCount; ++i) {
                if (!isOrContains(sel.getRangeAt(i).commonAncestorContainer, el)) {
                    return false;
                }
            }
            return true;
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        return isOrContains(sel.createRange().parentElement(), el);
    }
    return false;
}

function convertToString(cites){
    var string;

    switch(cites){
        case "cites":
            string="Citazione";
            break;
        case "hasPublicationYear":
            string="Anno di Pubblicazione";
            break;
        case "title":
            string="Titolo";
            break;
        case "creator":
            string="Autore"
            break;
        case "doi":
            string="DOI"
            break;
        case "comment":
            string="Commento"
            break;
        case "semiotics.owl#denotes":
            string="Retorica"
            break;
        case "hasURL":
            string="URL"
            break;
        case "hasPubblicationYear":
            string="Anno di Pubblicazione";
            break;
        case "denotesRhetoric":
            string="Retorica"
            break;
    }

    return string;
}

/*
  metdoo che utilizzo quando devo sapere le posizione di inizio e di fien dei
  nomi degli autori di un testo di rivista statistica

  passandogli una stringa mi ritorna un array bidimensionale con gli star e gli end di ogni autore
*/
function getPos(res){
    var primo = true;
    var cont=0;
    var array = new Array();
    array[0] = new Array();
    array[1] = new Array();

    for (var i = 0; i < res.length; i++) {

        if(primo == true){
            array[0][cont] = 0;
            array[1][cont] = res[cont].length;
            primo = false;
            cont ++;
        }else {
            var incremento = array[1][cont-1];
            array[0][cont] = incremento + 2;
            array[1][cont] = res[cont].length + incremento + 2;
            cont ++;
        }
    }
    return array;
}

// mi ritorna la lunghezza di un array
function getNum(res){
    var cont=0;
    for (var i = 0; i < res.length; i++) {
        cont++;
    }
    return cont;
}

// LINK http://stackoverflow.com/questions/5222814/window-getselection-return-html
function getTestoSelezionato(selezione) {
    var testo = "";
    if (typeof selezione !== "undefined") {
        if (selezione.rangeCount) {
            var contenitore = document.createElement("div");
            for (var i = 0, len = selezione.rangeCount; i < len; ++i) {
                contenitore.appendChild(selezione.getRangeAt(i).cloneContents());
            }
            testoTemp = contenitore.innerHTML;
            testo = testoTemp.replace(/<\/?[^>]+(>|$)/g, "");
        }
    } else if (typeof document.selection !== "undefined") {
        if (document.selection.type === "Text") {
            testo = document.selection.createRange().htmlText;
        }
    }
    return testo;

}

/*
 Funzione che mi permette di visualizzare la lista dei grafi che hanno delle annotazioni nell'apposita sezione del menu laterale
 Mi creo una lista di appoggio listaAutoriNoDoppioni nella quale inserisco i grafi che non son già presenti
 nella lista di appoggio.
 Gestisco inoltre gli eventi di click della checkbox modificando la visibilità delle annotazioni dei grafi
 sul documento
 */

var listaGruppiNoDoppioni=[];
var contaAutori=1;
function visualizzaPerAutore(gruppo){

    if(listaGruppiNoDoppioni.indexOf(gruppo)==-1){
        listaGruppiNoDoppioni.push(gruppo);
        var $filtroAutori ='<li class="checkbox"><a><label><input type="checkbox" id="ckAutoreAnnotazione_'+gruppo+'" class="ckAutoreAnnotazione" checked />'+showInfoGroup(gruppo)+'</label></a></li>';
        $("#filtri_autori").append($filtroAutori);
        $(document).on('click', '#ckAutoreAnnotazione_'+gruppo, function() {
            //console.log("entro");

            if(!this.checked) {
                var temp = gruppo;
                temp = temp.replace(/[^\w\s]/gi, '');
                temp = temp.replace(/ /g, '');
                $('#page-content-wrapper').find('.'+temp).addClass('nascondoAutore');
            }else{
                var temp = gruppo;
                temp = temp.replace(/[^\w\s]/gi, '');
                temp = temp.replace(/ /g, '');
                $('#page-content-wrapper').find('.'+temp).removeClass('nascondoAutore');
            }
        });
    }


}
