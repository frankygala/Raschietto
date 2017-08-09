<?php
$typeRequest = $_POST['request'];

// Ottengo la pagina e la carico
if($typeRequest=='showPage'){
    if($_POST['URI']!=null && $_POST['URI']!=''){

      $doc= file_get_contents($_POST['URI']);
      $html = new DOMDocument();
      $html->loadHTML($doc);
      $xpath = new DOMXPath( $html );

      // SE DLIB
      if((parse_url($_POST['URI'],PHP_URL_HOST)=='www.dlib.org') || (parse_url($_POST['URI'],PHP_URL_HOST)=='dlib.org')){

        //titolo del documento
        $nodoTitolo = $xpath->query("//tr/td/h3[2]/text()");
        $titolo = $nodoTitolo->item(0)->C14N(); //serve per evitare errore -->  Object of class DOMText could not be converted to string;
    	  //echo $titolo; //The HZSK Repository: Implementation, Features, and Use Cases of a Repository for Spoken Language Corpora
    	  $lunghezzaTitolo = strlen($titolo);
    	  //echo $lunghezzaTitolo; //104
    	  $pathTitolo = $nodoTitolo->item(0)->parentNode->getNodePath(); // parentNode per rimuovere text() ||| prende il path
    	  //echo $pathTitolo; ///html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/td[2]/h3[2]

        //anno pubblicazione del Documento
        $nodoAnno = $xpath->query("//tr/td[2]/p[1]/text()");
        $anno = $nodoAnno->item(0)->C14N();
    	  $lunghezzaAnno = strlen($anno);
    	  $pathAnno = $nodoAnno->item(0)->parentNode->getNodePath();

        //autori del Documento
        $arrayAutori = array();
        $dati = array();
        $nodoAutore = $xpath->query("//p[@class='blue']/b/text()");
    	  $num = (int) $nodoAutore->length;
          for ($i = 0; $i < $num; $i++) {
                    $nodoAutoreNome = $nodoAutore->item($i)->C14N();
                    $dati[0]= $nodoAutoreNome;
                    $lunghezzaNome = strlen($nodoAutoreNome);
                    $dati[1]= $lunghezzaNome;
                    $pathAutore = $nodoAutore->item($i)->parentNode->getNodePath();
                    $dati[2]= $pathAutore;
                    $arrayAutori[$i] = $dati;
          }

        //citazioni
        $numCitazioniTrovate=0;
        $arrayCitazioni = array();
        $datiCitazioni = array();
        $nodo = null;
        $nodelist = $xpath->query( "//h3" );
        $o=0;
        foreach ($nodelist as $n){
          if (strpos($n->nodeValue, 'References') !== false) {
              $nodo=$n->nodeValue;
          }
            else if (strpos($n->nodeValue, 'Notes') !== false) {
                $nodo=$n->nodeValue;
            }
            else if (strpos($n->nodeValue, 'Bibliography') !== false) {
                $nodo=$n->nodeValue;
            }
        }
        if($nodo!=null){

          $nodoCitazione = $xpath->query("//p[preceding::h3[text()='".$nodo."']]");
          for ($i = 0; $i < $nodoCitazione->length; $i++) {

            $nodoCitazioneTesto = $nodoCitazione->item($i)->nodeValue;
            $lunghezzaCitazioneTesto = strlen($nodoCitazioneTesto);
            $pathCitazioneTesto = $nodoCitazione->item($i)->getNodePath();

            $controllo = substr($nodoCitazioneTesto, 0 , 1);
            if($controllo == "["){
              $datiCitazioni[0]=$nodoCitazioneTesto;
              $datiCitazioni[1]=$lunghezzaCitazioneTesto;
              $datiCitazioni[2]=$pathCitazioneTesto;
              $arrayCitazioni[$i]=$datiCitazioni;
              $numCitazioniTrovate=$i;
            }
          /*else{
              $datiCitazioni[0]=$nodoCitazioneTesto;
              $datiCitazioni[1]=$lunghezzaCitazioneTesto;
              $datiCitazioni[2]=$pathCitazioneTesto;
              $arrayCitazioni[$i]=$datiCitazioni;
              $numCitazioniTrovate=$i;
          }*/
          }
        }

        //rappo inizio
        $doiCompleto = "";
        $testoPreDoi= "";
        $nodoDoi = $xpath->query("//tr/td/p[2]/text()");
        $lunghezzaNodo = $nodoDoi->length - 1;
  			$testoDoi = $nodoDoi->item($lunghezzaNodo)->C14N();
        $posPreDoi = $lunghezzaNodo-1;
  			for ($i = 0; $i <= $lunghezzaNodo; $i++) {
          $nodoDoiTempo = $nodoDoi->item($i)->C14N();
  				$doiCompleto = $doiCompleto.$nodoDoiTempo;
          if($i == $posPreDoi){
            $testoPreDoi=$doiCompleto;
          }
  			}

  			$inizioDoi = strlen($testoPreDoi);
  			$fineDoi = strlen($doiCompleto);
        $pathDoi = $nodoDoi->item($lunghezzaNodo)->parentNode->getNodePath();
        //rappo fine

        //rappo inizio
        $nodoAbstract = $xpath->query("//p[preceding::h3[text()='Abstract']]/text()");

        $nodoAbstractNome = $nodoAbstract->item(0)->C14N();
        $lunghezzaAbstract = strlen($nodoAbstractNome);
        $pathAbstract = $nodoAbstract->item(0)->parentNode->getNodePath();

        $dati = array( 'fonte' => 'dlib',
                       'testoTitolo' => $titolo , 'lunghezzaTitolo' => $lunghezzaTitolo , 'pathTitolo' => $pathTitolo ,
                       'testoAnno' => $anno , 'lunghezzaAnno' => $lunghezzaAnno , 'pathAnno' => $pathAnno,
                       'numAutori' => $num , 'autori' => $arrayAutori ,
                       'doiCompleto' => $doiCompleto  , 'pathDoi' => $pathDoi,  'fineDoi' => $fineDoi , //rappo
                       'numCitazioni' => $numCitazioniTrovate , 'citazioni' => $arrayCitazioni, 'uri' => $_POST['URI'] ,
                       'testoAbstract' => $nodoAbstractNome , 'lunghezzaAbstract' => $lunghezzaAbstract , 'pathAbstract' => $pathAbstract );
        echo json_encode( $dati);
      }

        else if(strpos(parse_url($_POST['URI'],PHP_URL_HOST),'.unibo.it')) {

            //titolo del Documento
		        $nodoTitolo = $xpath->query("//div[@id='articleTitle']/h3[1]");
            $titolo = $nodoTitolo->item(0)->firstChild->C14N();
            $lunghezzaTitolo = strlen($titolo);
            $pathTitolo = $nodoTitolo->item(0)->getNodePath();

            //autori del Documento
            $num="statistica";
            $arrayAutori = array();
            $nomi = array();
            $dati = array();
            $nodoAutore = $xpath->query("//div[@id='authorString']/em");
            $autori = $nodoAutore->item(0)->firstChild->C14N();
            $dati[0]= $autori;
            $lunghezzaAutori = strlen($autori);
            $dati[1]= $lunghezzaAutori;
            $pathAutori = $nodoAutore->item(0)->parentNode->getNodePath();
            $dati[2]=$pathAutori;
            $arrayAutori[0] = $dati;

            //citazioni
            $arrayCitazioni = array();
            $datiCitazioni = array();
            $nodoCitazione = $xpath->query("//div[@id='articleCitations']/div/p/text()");

            $numCitazioniTrovate = (int) $nodoCitazione->length;

            for ($i = 0; $i < $nodoCitazione->length; $i++) {
              $nodoCitazioneTesto = $nodoCitazione->item($i)->C14N();
              $datiCitazioni[0]=$nodoCitazioneTesto;
              $lunghezzaCitazioneTesto = strlen($nodoCitazioneTesto);
              $datiCitazioni[1]=$lunghezzaCitazioneTesto;
              $pathCitazioneTesto = $nodoCitazione->item($i)->parentNode->getNodePath();
              $datiCitazioni[2]=$pathCitazioneTesto;
              $arrayCitazioni[$i]=$datiCitazioni;
            }
            //rappo inizo
            $nodoDoi= $xpath->query("//a[@id='pub-id::doi']/text()");
            $testoDoi = $nodoDoi->item(0)->C14N();
            $pathDoi = $nodoDoi->item(0)->parentNode->getNodePath();
            $fineDoi = strlen($testoDoi);
            //rappo fine
            // 'doiCompleto' => $doiCompleto  , 'pathDoi' => $pathDoi,  'fineDoi' => $fineDoi ,

            $nodoAbstract = $xpath->query("//div[@id='articleAbstract']/div/p");
            $nodoAbstract2 = $xpath->query("//div[@id='articleAbstract']/div");
            /*if($nodoAbstract->item(0)!=null){
              $nodoAbstractNome = $nodoAbstract->item(0)->C14N();
              $pathAbstract = $nodoAbstract->item(0)->parentNode->getNodePath();
              $lunghezzaAbstract = strlen($nodoAbstractNome);
            } elseif ($nodoAbstract2->item(0)!=null) {
              $nodoAbstractNome = $nodoAbstract2->item(0)->C14N();
              $pathAbstract = $nodoAbstract2->item(0)->parentNode->getNodePath();
              $lunghezzaAbstract = strlen($nodoAbstractNome);
            }*/
            $nodoAbstractNome="";
            if($nodoAbstract->item(0)!=null){
                foreach($nodoAbstract as $n){
                    $nodoAbstractNome.=$n->nodeValue;
                }
                $pathAbstract = $nodoAbstract->item(0)->getNodePath();
            } elseif ($nodoAbstract2->item(0)!=null){
                foreach($nodoAbstract2 as $n){
                    $nodoAbstractNome.=$n->nodeValue;
                }
                $pathAbstract = $nodoAbstract2->item(0)->getNodePath();
            }
            $lunghezzaAbstract= strlen($nodoAbstractNome);

            $dati = array( 'fonte' => 'unibo',
                           'testoTitolo' => $titolo , 'lunghezzaTitolo' => $lunghezzaTitolo , 'pathTitolo' => $pathTitolo ,
                           'testoAnno' => null , 'lunghezzaAnno' => null , 'pathAnno' => null,
                           'numAutori' => $num , 'autori' => $arrayAutori ,
                           'doiCompleto' => $testoDoi  , 'pathDoi' => $pathDoi,  'fineDoi' => $fineDoi , //rappo
                           'testoAbstract' => $nodoAbstractNome , 'lunghezzaAbstract' => $lunghezzaAbstract , 'pathAbstract' => $pathAbstract ,
                           'numCitazioni' => $numCitazioniTrovate , 'citazioni' => $arrayCitazioni, 'uri' => $_POST['URI']   );
            echo json_encode( $dati);
        }

        else {

          //titolo del documento
          $nodoTitolo = $xpath->query("//head/title/text()");
          $titolo = $nodoTitolo->item(0)->C14N(); //serve per evitare errore -->  Object of class DOMText could not be converted to string;
      	  $uri = $_POST['URI'];
          $dati = array();
          $dati = array( 'fonte' => 'altro', 'uri' => 'uri', 'metaTitolo' =>  $titolo);
          echo json_encode( $dati);
        }
    }
}

?>
