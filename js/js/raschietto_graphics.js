var $document = $(document),
    $window = $(window),
    $headerheight = 150;

/* FUNZIONAMENTO SIDEBAR A SCOMPARSA */
$("#toggle-navbar").click(function(e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});

/* FIXING NAVBAR */
$document.scroll(function() {
    if ($document.scrollTop() >= 120) {
        $('#navbar').addClass('navbar-fixed-top');
        $('#wrapper').attr('style','margin-top:50px;');
        $('#sidebar-wrapper').attr('style','top:50px;');
        $('#sidebar-wrapper').attr('style','top:50px;');
    } else {
        $('#navbar').removeClass('navbar-fixed-top');
        $('#wrapper').attr('style','');
        $('#sidebar-wrapper').attr('style','top:'+($headerheight-$document.scrollTop())+'px;');
    }
});

/* MIN/MAX HEIGHT */
$window.load(function(){
    if ($document.scrollTop() >= 120) {
        $('#page-content-wrapper').attr('style', 'min-height:' + ($window.height() - $headerheight) + 'px;max-height:' + ($window.height() - $headerheight) + 'px;overflow-y:scroll;');
        $('#sidebar-wrapper').attr('style', 'min-height:' + ($window.height() - $headerheight) + 'px;max-height:' + ($window.height() - $headerheight) + 'px;overflow-y:scroll;');
    }
    else{
        $('#page-content-wrapper').attr('style', 'min-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;max-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;overflow-y:scroll;');
        $('#sidebar-wrapper').attr('style', 'min-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;max-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;overflow-y:scroll;');
    }
});
$window.resize(function() {
    if ($document.scrollTop() >= 120) {
        $('#page-content-wrapper').attr('style', 'min-height:' + ($window.height() - $headerheight) + 'px;max-height:' + ($window.height() - $headerheight) + 'px;overflow-y:scroll;');
        $('#sidebar-wrapper').attr('style', 'min-height:' + ($window.height() - $headerheight) + 'px;max-height:' + ($window.height() - $headerheight) + 'px;overflow-y:scroll;');
    }
    else{
        $('#page-content-wrapper').attr('style', 'min-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;max-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;overflow-y:scroll;');
        $('#sidebar-wrapper').attr('style', 'min-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;max-height:' + ($window.height() - ($headerheight-$document.scrollTop())) + 'px;overflow-y:scroll;');
    }
});

/* TABS */
// Registro in quale tab mi trovo correntemente
var tabCorrente;

//----------------------
// Registro quanti tab compose aggiungo (parte per aggiungere tab dinamicamente)
var composeCount = 0;
//----------------------

// Inizializzo comportamento delle tabs
$(function () {

    //when ever any tab is clicked this method will be call
    $("#documentTabs").on("click", "a", function (e) {
        // Elimino eventuali comportamenti di default delle tabs
        e.preventDefault();

        // Visualizzo la tab
        $(this).tab('show');
        // Registro la tab cliccata
        $tabCorrente = $(this);
    });


    registerComposeButtonEvent();
    chiudiTab();
});

//----------------------
// !!!!!!!!!!!!!!!!!
// QUESTO METODO PERMETTE DI AGGIUNGERE TAB DINAMICAMENTE ALL'INSIEME
// E DI AGGIUNGERE DI CONSEGUENZA ANCHE IL DOCUMENTO ASSOCIATO ALLA TAB
// PER POTERLO VISUALIZZARE
// !!!!!!!!!!!!!!!!
//this method will demonstrate how to add tab dynamically
function registerComposeButtonEvent() {
    /* just for this demo */
    $('#composeButton').click(function (e) {
        e.preventDefault();

        var tabId = "compose" + composeCount; //this is id on tab content div where the
        composeCount = composeCount + 1; //increment compose count

        $('.nav-tabs').append('<li><a href="#' + tabId + '"><button class="close closeTab" type="button" >×</button>Compose</a></li>');
        $('.tab-content').append('<div class="tab-pane" id="' + tabId + '"></div>');

        creaTabECaricaUrl("", "./SamplePage.html", "#" + tabId);

        $(this).tab('show');
        visualizzaTab(tabId);
        chiudiTab();
    });

}
//----------------------

// EVENTO DI CLOSE DELLA TAB
//this method will register event on close icon on the tab..
function chiudiTab() {

    $(".closeTab").click(function (e) {

        e.preventDefault();

        //there are multiple elements which has .closeTab icon so close the tab whose close icon is clicked
        var tabContentId = $(this).parent().attr("href");
        $(this).parent().parent().remove(); //remove li of tab
        $('#documentTabs a:last').tab('show'); // Select first tab
        $(tabContentId).remove(); //remove respective tab content

    });
}

// VISUALIZZO DOCUMENTO ASSOCIATO ALLA TAB SELEZIONATA
//shows the tab with passed content div id..paramter tabid indicates the div where the content resides
function visualizzaTab(tabId) {
    $('#documentTabs a[href="#' + tabId + '"]').tab('show');
}
// ASSOCIO ALLA VAR tabCorrente LA TAB CORRENTE SELEZIONATA
//return current active tab
function getTabCorrente() {
    return tabCorrente;
}

//----------------------
// !!!!!!!!!!!!!!!!!
// QUESTO METODO PERMETTE DI AGGIUNGERE IL DOCUMENTO NELLA PAGINA
// ALLA TAB ASSOCIATA PER POTERLO VISUALIZZARE
// !!!!!!!!!!!!!!!!
//This function will create a new tab here and it will load the url content in tab content div.
function creaTabECaricaUrl(parms, url, loadDivSelector) {

    $("" + loadDivSelector).load(url, function (response, status, xhr) {
        if (status == "error") {
            var msg = "Sorry but there was an error getting details ! ";
            $("" + loadDivSelector).html(msg + xhr.status + " " + xhr.statusText);
            $("" + loadDivSelector).html("Load Ajax Content Here...");
        }
    });

}

//this will return element from current tab
//example : if there are two tabs having  textarea with same id or same class name then when $("#someId") whill return both the text area from both tabs
//to take care this situation we need get the element from current tab.
function getElement(selector) {
    var tabContentId = $tabCorrente.attr("href");
    return $("" + tabContentId).find("" + selector);

}

// RIMUOVE LA TAB CORRENTE
function removeCurrentTab() {
    var tabContentId = $currentTab.attr("href");
    $currentTab.parent().remove(); //remove li of tab
    $('#documentTabs a:last').tab('show'); // Select first tab
    $(tabContentId).remove(); //remove respective tab content
}

// DISABILITO COMPORTAMENTO DI a (?)
$("#sidebar-wrapper a").click(function (e) {

});