<?php


$typeRequest = $_POST['request'];

// Ottengo la pagina e la carico
if($typeRequest=='showPage'){
    if($_POST['URI']!=null && $_POST['URI']!=''){
        // SE DLIB
        if((parse_url($_POST['URI'],PHP_URL_HOST)=='www.dlib.org') || (parse_url($_POST['URI'],PHP_URL_HOST)=='dlib.org')){
            $doc= file_get_contents($_POST['URI']);

            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $html = new DOMDocument();
            $html->loadHTML($doc);
            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $xpath = new DOMXPath( $html );

            $nodelist = $xpath->query( "//form/table[3]/tr[1]/td[1]/table[5]/tr[1]/td[1]/table[1]/tr[1]/td[2]/*[not(self::script)]");

            $link= $_POST['URI'];

            foreach ($nodelist as $n) {
                //sostituisci url e visualizza immagini
                foreach ($n->getElementsByTagName('img') as $node) {

                    $oldsrc = $node->getAttribute('src');
                    $nodeurl = strrchr($link,'/'); //parte finale dell'url
                    $new_url = str_replace($nodeurl,"",$link);
                    $newsrc = $new_url.'/'.$oldsrc;
                    $node->setAttribute('src', $newsrc);
                }
                foreach ($xpath->query('//a[not(contains(@href, "#"))]') as $node) {
                    $node->setAttribute('target', '_blank');
                }
                // stampo tutto quanto il documento
                echo $n->ownerDocument->saveHTML($n);
            }

            if($nodelist['length']=='0'){
                $doc= file_get_contents($_POST['URI']);

                //$page = $html->loadHTML($doc); // Carico html del documento per echo

                $html = new DOMDocument();
                $html->loadHTML($doc);
                //$page = $html->loadHTML($doc); // Carico html del documento per echo

                while(($r=$html->getElementsByTagName("script")) && $r->length){
                    $r->item(0)->parentNode->removeChild($r->item(0));
                }

                $xpath = new DOMXPath( $html );

                $nodelist = $xpath->query( "//body/*[not(self::script)]");
                foreach ($nodelist as $n) {
                    //sostituisci url e visualizza immagini
                    foreach ($n->getElementsByTagName('img') as $node) {

                        $oldsrc = $node->getAttribute('src');
                        $nodeurl = strrchr($link,'/'); //parte finale dell'url
                        $new_url = str_replace($nodeurl,"",$link);
                        $newsrc = $new_url.'/'.$oldsrc;
                        $node->setAttribute('src', $newsrc);
                    }
                    foreach ($xpath->query('//a[not(contains(@href, "#"))]') as $node) {
                        $node->setAttribute('target', '_blank');
                    }
                    // stampo tutto quanto il documento
                    echo $n->ownerDocument->saveHTML($n);
                }
            }

            //$page=$html->saveHTML();
            //echo $page;
        }
        // SE STATISTICA.UNIBO
        else if(strpos(parse_url($_POST['URI'],PHP_URL_HOST),'.unibo.it')) {
            $doc= file_get_contents($_POST['URI']);

            $html = new DOMDocument();
            $html->loadHTML($doc);

            $xpath = new DOMXPath( $html );

            $nodelist = $xpath->query( "//div[@id='content']/*[not(self::script) and not(@id='cookiesAlert') and not(@id='topBar')]");
            foreach ($nodelist as $n){

                foreach ($xpath->query('//a[not(contains(@href, "#"))]') as $node) {
                    $node->setAttribute('target', '_blank');
                }

                foreach ($xpath->query('//div') as $node) {
                    $node->removeAttribute('id');
                }

                echo $n->ownerDocument->saveHTML($n);
            }

            if($nodelist['length']=='0'){
                $doc= file_get_contents($_POST['URI']);

                //$page = $html->loadHTML($doc); // Carico html del documento per echo

                $html = new DOMDocument();
                $html->loadHTML($doc);
                //$page = $html->loadHTML($doc); // Carico html del documento per echo

                while(($r=$html->getElementsByTagName("script")) && $r->length){
                    $r->item(0)->parentNode->removeChild($r->item(0));
                }

                $xpath = new DOMXPath( $html );

                $nodelist = $xpath->query( "//body/*[not(self::script)]");
                foreach ($nodelist as $n) {
                    //sostituisci url e visualizza immagini
                    foreach ($n->getElementsByTagName('img') as $node) {

                        $oldsrc = $node->getAttribute('src');
                        $nodeurl = strrchr($link,'/'); //parte finale dell'url
                        $new_url = str_replace($nodeurl,"",$link);
                        $newsrc = $new_url.'/'.$oldsrc;
                        $node->setAttribute('src', $newsrc);
                    }
                    foreach ($xpath->query('//a[not(contains(@href, "#"))]') as $node) {
                        $node->setAttribute('target', '_blank');
                    }
                    // stampo tutto quanto il documento
                    echo $n->ownerDocument->saveHTML($n);
                }
            }

        }
        // ALTRIMENTI ESTRAGGO IL BODY E LO VISUALIZZO
        else {
            $doc= file_get_contents($_POST['URI']);

            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $html = new DOMDocument();
            $html->loadHTML($doc);
            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            while(($r=$html->getElementsByTagName("script")) && $r->length){
                $r->item(0)->parentNode->removeChild($r->item(0));
            }

            $xpath = new DOMXPath( $html );

            $nodelist = $xpath->query( "//body/*[not(self::script)]");
            foreach ($nodelist as $n){
                echo $n->ownerDocument->saveHTML($n);
            }

            //$page=$html->saveHTML();
            //echo $page;
        }
    }
}

/*if($typeRequest=='showURI'){
    if($_POST['URI']!=null && $_POST['URI']!=''){
        if((parse_url($_POST['URI'],PHP_URL_HOST)=='www.dlib.org') || (parse_url($_POST['URI'],PHP_URL_HOST)=='dlib.org')) {
            $doc = file_get_contents($_POST['URI']);

            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $html = new DOMDocument();
            $html->loadHTML($doc);
            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $xpath = new DOMXPath($html);

            $link= $_POST['URI'];

            // SE DLIB
            //  //form/table[3]/tr[1]/td[1]/table[5]/tr[1]/td[1]/table[1]/tr[1]/td[2]/*   --> vecchio
            //nuovo rappo!
            $nodelist = $xpath->query("/html/body/form/table[3]/tr/td/table[5]/tr/td/table[1]/tr/*");
            foreach ($nodelist as $n) {
                //sostituisci url e visualizza immagini
                foreach ($n->getElementsByTagName('img') as $node) {

                    $oldsrc = $node->getAttribute('src');
                    $nodeurl = strrchr($link,'/'); //parte finale dell'url
                    $new_url = str_replace($nodeurl,"",$link);
                    $newsrc = $new_url.'/'.$oldsrc;
                    $node->setAttribute('src', $newsrc);
                }
                // stampo tutto quanto il documento
                echo $n->ownerDocument->saveHTML($n);
            }

            //$page=$html->saveHTML();
            //echo $page;
        }
        // SE STATISTICA.UNIBO
        else if(parse_url($_POST['URI'],PHP_URL_HOST)=='rivista-statistica.unibo.it') {
            $doc= file_get_contents($_POST['URI']);

            $html = new DOMDocument();
            $html->loadHTML($doc);

            $xpath = new DOMXPath( $html );

            $nodelist = $xpath->query( "//div[@id='content']");
            foreach ($nodelist as $n){
                echo $n->ownerDocument->saveHTML($n);
            }

        }
        // ALTRIMENTI ESTRAGGO IL BODY E LO VISUALIZZO
        else {
            $doc= file_get_contents($_POST['URI']);

            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $html = new DOMDocument();
            $html->loadHTML($doc);
            //$page = $html->loadHTML($doc); // Carico html del documento per echo

            $xpath = new DOMXPath( $html );

            $nodelist = $xpath->query( "//body");
            foreach ($nodelist as $n){
                echo $n->ownerDocument->saveHTML($n);
            }

            //$page=$html->saveHTML();
            //echo $page;
        }
    }
}*/

?>