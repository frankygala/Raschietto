<?php
try {
	error_reporting(E_ALL);
	header("content-type: application/json");
	$doc = new DOMDocument();
	$success = $doc->loadHTMLfile("http://vitali.web.cs.unibo.it/TechWeb15/ProgettoDelCorso");
	$xdoc = new DOMXPath($doc);
	$resId = $xdoc->query("//th[@class='twikiFirstCol']/*");
	$resName = $xdoc->query("//tr/th[2]/*");
	$groups = array();

	for ($i = 1; $i < $resId->length; $i++) {
		//array_push($groups, array(trim($resId->item($i)->nodeValue) => trim($resName->item($i)->nodeValue)));
		$groups[trim($resId->item($i)->nodeValue)] = trim($resName->item($i)->nodeValue);
	}

	echo json_encode($groups);
} catch (Exception $e) {
	echo json_encode($e->getMessage());
}
?>