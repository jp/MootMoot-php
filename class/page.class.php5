<?php

class page {
	public $head='<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title>__TITLE__</title>
	<meta http-equiv="Charset" content="application/xhtml+xml; charset=UTF-8" />
	<meta name="keywords" content="Julien Pellet,Pellet Julien,galerie, gallery, photo, art, photographe, portfolio, book, macro, nature, strange, abstract" />
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
	<link rel="stylesheet" type="text/css" href="photo.css" />
	<script type="text/javascript" src="js/mootools.js"></script>
	<script type="text/javascript" src="js/lib.js"></script>
</head>';

public $body='<body>
	__RETOUR__
	<div id="loader"></div>
	<div id="horizon">
		__BACKGROUND__
		__CONTENT__
	</div>
	<div id="cc">electronart.fr est sous license &nbsp;
		<a rel="license" target="blank" href="http://creativecommons.org/licenses/by-nc/2.0/fr/"> Creative Commons BY-NC 2.0</a>.
		<a rel="license" href="http://creativecommons.org/licenses/by-nc/2.0/fr/"></a>
	</div>
</body>
</html>';


	public function render($onLoad,$background,$content,$title=false) {
		$main=$this->head.$this->body;
		$main=str_replace("__ONLOAD__", $onLoad, $main);
		$main=str_replace("__BACKGROUND__", $background, $main);
		$main=str_replace("__CONTENT__", $content, $main);

		if($title)
			$main=str_replace("__TITLE__", $title, $main);
		else
			$main=str_replace("__TITLE__", "electron@rt", $main);

		if (isset($_GET['page']))
		{
			if (stristr($_SERVER['HTTP_REFERER'],$_SERVER['SERVER_NAME'])) {

//				$retour='<a href="'.$_SERVER['HTTP_REFERER'].'"><img id="linkback" class="png" src="img/back.png" border="no"/></a>';

				$retour='<a target="blank" onClick="javascript:history.back();"><img id="linkback" class="png" src="img/back.png" border="no"/></a>';
			} else {
				$retour='<a href="/"><img id="linkback" class="png" src="img/back.png" border="no"/></a>';
			}
			$main=str_replace("__RETOUR__", $retour, $main);
		}
		$main=str_replace("__RETOUR__", '', $main);
		echo $main;
	}
}


?>