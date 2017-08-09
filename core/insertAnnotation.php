<?php

require('EasyRdf.php');

//test in localhost
//$endPoint = "http://localhost:3030/raschietto/update";
$endPoint = "http://tweb2015.cs.unibo.it:8080/data/update";
$groupName="ltw1539";
$groupPwd="6thU(bB";

$prefissi = "PREFIX fabio: <http://purl.org/spar/fabio/>
      PREFIX oa: <http://www.w3.org/ns/oa#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX dcterms: <http://purl.org/dc/terms/>
      PREFIX frbr: <http://purl.org/vocab/frbr/core#>
      PREFIX ao: <http://purl.org/ontology/ao/core#>
      PREFIX foaf: <http://xmlns.com/foaf/0.1/>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      PREFIX prism: <http://prismstandard.org/namespaces/basic/2.0/>
      PREFIX deo: <http://purl.org/spar/deo/>
      PREFIX schema: <http://schema.org/>
      PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      PREFIX owl: <http://www.w3.org/2002/07/owl#>
      PREFIX rasch: <http://vitali.web.cs.unibo.it/raschietto/>
      PREFIX cito: <http://purl.org/spar/cito/>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX sro: <http://salt.semanticauthoring.org/ontologies/sro#> ";

$tipoRichiesta = $_REQUEST ["tipoInserimento"];

$client = new EasyRdf_Sparql_Client($endPoint.'?user='.$groupName.'&pass='.$groupPwd);

if($tipoRichiesta=="annotazioni") {

	$elAnnotations = $_REQUEST ["elenco"];

	//for ($i = 0; $i < count($elAnnotations); $i++) {


		$query = $prefissi . " INSERT DATA { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>{";
        //$query = $prefissi . " INSERT DATA {  "; //localhost
		if ($elAnnotations != "") {
            if (str_replace('"', '\"', $elAnnotations['body']['predicate']) != "semiotics.owl#denotes") {
                $query .= "[a oa:Annotation ;
						   rdfs:label \"" . str_replace('\n', ' ',str_replace('"', '\"', $elAnnotations['label'])) ." \";
			               rasch:type \"" . str_replace('"', '\"', $elAnnotations['type']) . "\" ^^xsd:string  ;
		                   oa:annotatedAt \"" . str_replace('"', '\"', $elAnnotations['provenance']['time']) . "\";
		                   oa:annotatedBy <mailto:" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "> ;
						   oa:hasTarget [ a oa:SpecificResource ;
						   oa:hasSource <" . str_replace('"', '\"', $elAnnotations['target']['source']) . "> ;
						   oa:hasSelector [ a oa:FragmentSelector ;
						   rdf:value \"" . str_replace('"', '\"', $elAnnotations['target']['id']) . "\";
		                   oa:start \"" . str_replace('"', '\"', $elAnnotations['target']['start']) . "\" ^^xsd:nonNegativeInteger;
		                   oa:end \"" . str_replace('"', '\"', $elAnnotations['target']['end']) . "\" ^^xsd:nonNegativeInteger ] ];
		                   oa:hasBody [a rdf:Statement;
		                   rdf:subject <" . str_replace('"', '\"', $elAnnotations['body']['subject']) . "> ;
						   rdf:predicate " . str_replace('"', '\"', $elAnnotations['body']['predicate']) . " ;
						   rdfs:label \"" . str_replace('\n', ' ',str_replace('"', '\"', $elAnnotations['body']['bodyLabel'])) . "\";
						   rdf:object \"" . str_replace('"', '\"', $elAnnotations['body']['object']) . "\"";
                $query .= "] ] . ";

                //Inserisco l'autore dell'annotazione
                $query .= " <mailto:" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "> a foaf:Person;
						   foaf:name \"" . str_replace('"', '\"', $elAnnotations['provenance']['author']['name']) . "\" ;
		                   schema:email \"" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "\" . ";
            }
            else {
                $query .= "[a oa:Annotation ;
						   rdfs:label \"" . str_replace('\n', ' ',str_replace('"', '\"', $elAnnotations['label'])) ." \";
			               rasch:type \"" . str_replace('"', '\"', $elAnnotations['type']) . "\" ^^xsd:string ;
		                   oa:annotatedAt \"" . str_replace('"', '\"', $elAnnotations['provenance']['time']) . "\";
		                   oa:annotatedBy <mailto:" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "> ;
						   oa:hasTarget [ a oa:SpecificResource ;
						   oa:hasSource <" . str_replace('"', '\"', $elAnnotations['target']['source']) . "> ;
						   oa:hasSelector [ a oa:FragmentSelector ;
						   rdf:value \"" . str_replace('"', '\"', $elAnnotations['target']['id']) . "\";
		                   oa:start \"" . str_replace('"', '\"', $elAnnotations['target']['start']) . "\" ^^xsd:nonNegativeInteger;
		                   oa:end \"" . str_replace('"', '\"', $elAnnotations['target']['end']) . "\" ^^xsd:nonNegativeInteger ] ];
		                   oa:hasBody [a rdf:Statement;
		                   rdf:subject <" . str_replace('"', '\"', $elAnnotations['body']['subject']) . "> ;
						   rdf:predicate \"denotesRhetoric\"^^xsd:string ;
						   rdfs:label \"" . str_replace('\n', ' ',str_replace('"', '\"', $elAnnotations['body']['bodyLabel'])) . "\";
						   rdf:object \"" . str_replace('"', '\"', $elAnnotations['body']['object']) . "\"";
                $query .= "] ] . ";

                //Inserisco l'autore dell'annotazione
                $query .= " <mailto:" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "> a foaf:Person;
						  foaf:name \"" . str_replace('"', '\"', $elAnnotations['provenance']['author']['name']) . "\";
		                  schema:email \"" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "\" . ";
            }
        }
		$query .= "} }";


		echo($query);
        error_log($query);
		$client->update($query);
	//}
}
else if($tipoRichiesta=="inserimentoUri"){

	//echo("entro inser");
	//echo("\n");

	$elAnnotations = $_REQUEST ["elenco"];

	//localhost
	//$query = $prefissi . " INSERT DATA {
	$query = $prefissi . " INSERT DATA { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>{

		<". str_replace('.html', '', $elAnnotations['uri']) ."> a fabio:Work ;
        " . "fabio:hasPortrayal <". $elAnnotations['uri']."> ;
        " . "frbr:realization <". str_replace('.html', '_ver1', $elAnnotations['uri']) ."> .

		<". str_replace('.html', '_ver1', $elAnnotations['uri']) ."> a fabio:Expression ;
        " . "fabio:hasRepresentation <".$elAnnotations['uri']. "> .

        <" .$elAnnotations['uri']. "> a fabio:Item ;
        " . "rdfs:label \"".$elAnnotations['title']."\"^^xsd:string ;".

		"} }";

	echo($query);
	$client->update($query);
}
// franky
else if($tipoRichiesta=="inserimentoAutore"){


	$elAnnotations = $_REQUEST ["elenco"];

	//error_log(print_r($elAnnotations,true));

	//$query = $prefissi . " INSERT DATA {" . //localhost
	$query = $prefissi . " INSERT DATA { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>{ " .
		"<". $elAnnotations['autore']['iri'] ."> a foaf:Person ;
        " . "rdfs:label \"".$elAnnotations['autore']['nomeAutoreEstrattoNoL']. " ".$elAnnotations['autore']['cognomeAutoreEstrattoNoL']."\" ;".

		"} }";

	echo($query);
	$client->update($query);
}
else if($tipoRichiesta=="cancellazione"){

	$elAnnotations = $_REQUEST ["elenco"];

    //error_log(print_r($elAnnotations,true));


	$query = $prefissi ."WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>
		DELETE { ?s ?p ?o . }
		WHERE { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>
            {
                ?s a oa:Annotation;
                oa:hasTarget ?target .
                ?target oa:hasSource <". $elAnnotations ."> .
                ?s ?p ?o.
            }
		}";
    //*******************************
     // s dichiarato sopra è un annotazion e
    /*
      targhet lo chioaro sotto targhet ha come sorzr l'url che gli passo
    */
    //test in locale

    /*$query = $prefissi ."DELETE { ?s ?p ?o . }
		WHERE {
                ?s a oa:Annotation;
                oa:hasTarget ?target .
                ?target oa:hasSource <". $elAnnotations ."> .
                ?s ?p ?o .
		}";

*/
	echo($query);
	$client->update($query);


	$query = $prefissi."DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

	$query = $prefissi."DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

	//$query = $prefissi."CLEAR SILENT GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>";

	//$client->update($query);


}
else if($tipoRichiesta=="cancAnnotazione"){

	$elAnnotations = $_REQUEST ["annotazione"];

	$query = $prefissi ."
	WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>
	DELETE { ?s ?p ?o . }
		WHERE { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539> {
		?s a oa:Annotation;
		oa:annotatedBy <mailto:" . str_replace('"', '\"', $elAnnotations['provenance']['author']['email']) . "> ;
		oa:hasTarget ?target .
		?target oa:hasSource <" . str_replace('"', '\"', $elAnnotations['target']['source']) . "> ;
		oa:hasSelector ?sel .
		?sel a oa:FragmentSelector ;
		rdf:value \"" . str_replace('"', '\"', $elAnnotations['target']['id']) ."\" ;
		oa:end ".$elAnnotations['target']['end']." ;
        oa:start ".$elAnnotations['target']['start']." .
        ?s oa:hasBody ?body .
		?body a rdf:Statement ;
		rdf:object \"" . $elAnnotations['body']['object'] . "\" .
		?s ?p ?o .}
	}";

	echo($query);
	$client->update($query);

	$query = $prefissi."DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

	$query = $prefissi."DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

}
else if($tipoRichiesta=="cancAnnotazioneCaricata") {

	$elAnnotations = $_REQUEST ["annotazione"];

	$query = $prefissi . "
	WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>
	DELETE { ?s ?p ?o . }
		WHERE { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539> {
		?s a oa:Annotation;
		oa:annotatedBy <mailto:" . str_replace('"', '\"', $elAnnotations['annotazione']['emailAutore']['value']) . "> ;
		oa:hasTarget ?target .
		?target oa:hasSource <" . $_REQUEST ["uri"] . "> ;
		oa:hasSelector ?sel .
		?sel a oa:FragmentSelector ;
		rdf:value \"" . str_replace('"', '\"', $elAnnotations['annotazione']['path']['value']) . "\" ;
		oa:end " . $elAnnotations['annotazione']['end']['value'] . " ;
        oa:start " . $elAnnotations['annotazione']['start']['value'] . " .
        ?s oa:hasBody ?body .
		?body a rdf:Statement ;
		rdf:object \"" . $elAnnotations['annotazione']['object']['value'] . "\" .
		?s ?p ?o .}
	}";

	echo($query);
	error_log($query);
	$client->update($query);

	$query = $prefissi . "DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

	$query = $prefissi . "DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

}
else if($tipoRichiesta=="cancAnnotazioneSuCitazioneCaricata") {

	$elAnnotations = $_REQUEST ["annotazione"];

	/*$query = $prefissi . "
	WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>
	DELETE { ?s ?p ?o . }
		WHERE { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539> {
		?s a oa:Annotation;
		rdfs:label \"" . str_replace('"', '\"', $elAnnotations['bodyLabel']['value']) . "\" ;
		oa:annotatedBy <mailto:" . str_replace('"', '\"', $elAnnotations['emailAutore']['value']) . "> ;
		oa:hasTarget ?target .
		?target oa:hasSource <" . $elAnnotations['subject']['value'] . "> ;
		oa:hasSelector ?sel .
		?sel a oa:FragmentSelector ;
		rdf:value \"" . str_replace('"', '\"', $elAnnotations['path']['value']) . "\" ;
		oa:end " . $elAnnotations['end']['value'] . " ;
        oa:start " . $elAnnotations['start']['value'] . " .
		?s ?p ?o .}
	}";*/

	$query = $prefissi . "
	WITH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539>
	DELETE { ?s ?p ?o . }
		WHERE { GRAPH <http://vitali.web.cs.unibo.it/raschietto/graph/ltw1539> {
		?s a oa:Annotation;
		oa:annotatedBy <mailto:" . str_replace('"', '\"', $elAnnotations['emailAutore']['value']) . "> ;
		oa:hasTarget ?target .
		?target oa:hasSource <" . $elAnnotations['subject']['value'] . "> ;
		oa:hasSelector ?sel .
		?sel a oa:FragmentSelector ;
		rdf:value \"" . str_replace('"', '\"', $elAnnotations['path']['value']) . "\" ;
		oa:end " . $elAnnotations['end']['value'] . " ;
        oa:start " . $elAnnotations['start']['value'] . " .
		?s oa:hasBody ?body .
		?body a rdf:Statement ;
		rdf:object \"" . $elAnnotations['object']['value'] . "\" .
		?s ?p ?o .}
	}";

	echo($query);
	error_log($query);
	$client->update($query);

	$query = $prefissi . "DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

	$query = $prefissi . "DELETE { ?s ?p ?o . }
		WHERE {
				FILTER NOT EXISTS {?x ?y ?s .}
				FILTER NOT EXISTS {?s a oa:Annotation .}
				FILTER NOT EXISTS {?s a fabio:Expression .}
				FILTER NOT EXISTS {?s a fabio:Item .}
				FILTER NOT EXISTS {?s a fabio:Work .}
				?s ?p ?o .
		}";
	$client->update($query);

}
else {
	echo "ERRRORE";
}
