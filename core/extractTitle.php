<?php

/*
 * Metodo che permette di estrarre il titolo del documento selezionato attraverso
 * l'url passato in input. Mi serve per poter poi definire il titolo del documento e utilizzarlo
 * durante l'esecuzione del programma
 */

$doc= file_get_contents($_POST['URI']);

$html = new DOMDocument();
$html->loadHTML($doc);
//$page = $html->loadHTML($doc); // Carico html del documento per echo

$xpath = new DOMXPath( $html );

$title = '';
$titleFound=false;

/* SE DLIB */
if((parse_url($_POST['URI'],PHP_URL_HOST)=='www.dlib.org') || (parse_url($_POST['URI'],PHP_URL_HOST)=='dlib.org')) {
    $nodelist = $xpath->query("//tr/td/h3[2]");

    foreach ($nodelist as $n){
        $title.=$n->nodeValue;
    }

    if($title!=""){
        $titleFound=true;
    }

}
// SE .UNIBO
else if(strpos(parse_url($_POST['URI'],PHP_URL_HOST),'.unibo.it')) {
    $nodelist = $xpath->query( "//div[@id='articleTitle']/h3[1]");
    error_log(".unibo.it");

    foreach ($nodelist as $n){
        $title.=$n->nodeValue;
    }

    if($title!=""){
        $titleFound=true;
    }

}

// ALTRIMENTI O SE IL TITOLO NON E' STATO TROVATO IN BASE ALL'XPATH
// ESTRAGGO IL TITOLO DAL TAG TITLE
if(!$titleFound) {
    $nodelist = $xpath->query( "//title");
    foreach ($nodelist as $n){
        $title.=$n->nodeValue;
    }
}

$id = $_POST['contatoreDocs'];
$temp = new stdClass();
$temp->getDocument = 'doc'.$id;
$temp->title = str_replace("\"","'",$title);
$temp->uri = $_POST['URI'];
$temp->shortTitle = str_replace("\"","'",substr($title,0,13));
if(strlen($title)>=13){
    $temp->shortTitle=$temp->shortTitle.'...';
}
$temp->shownTitle = str_replace("\"","'",substr($title,0,24));
if(strlen($title)>=24){
    $temp->shownTitle=$temp->shownTitle.'...';
}

echo "{\"getDocument\":\"doc".$id."\",\"title\":\"".$temp->title."\",\"uri\":\"".$_POST['URI']."\",\"shortTitle\":\"".$temp->shortTitle."\",\"shownTitle\":\"".$temp->shownTitle."\"}";

?>