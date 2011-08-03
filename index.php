<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
	<title>Julien Pellet Photography</title>
	<meta http-equiv="Charset" content="application/xhtml+xml; charset=UTF-8" />
	<meta name="keywords" content="Julien Pellet,Pellet Julien,wellington,new zealand,galerie, gallery, photo, art, photographer, photography, portfolio, book, macro, nature, abstract" />
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon"/>
	<link rel="stylesheet" type="text/css" href="css/main.css" />
	<script type="text/javascript" src="js/mootools.js"></script>
	<script type="text/javascript" src="js/mootools-more.js"></script>
	<script type="text/javascript" src="js/lib.js"></script>
	
</head>
<body>
<div id="white-screen">
	<div id="title"><img src="img/JP.jpg"/></div>
</div>
<div id="container">
	<div id="menu">
		<div class="menu-line">
			<div class="menu-item" id="main"><a href="#main">JULIEN PELLET</a></div>
		</div>
		<div class="hr-line">
		</div>
		<div class="menu-line">
			<div class="menu-item"><a href="#portraits">PEOPLE</a></div>
		</div>
		<div class="menu-line">
			<div class="menu-item"><a href="#nature">LANDSCAPE</a></div>
		</div>
		<div class="menu-line">
			<div class="menu-item"><a href="#wellington">WELLINGTON</a></div>
		</div>
		<div class="menu-line">
			<div class="menu-item"><a href="#fine_art">FINE ART</a></div>
		</div>
		<div class="hr-line">
		</div>
		<!--div class="menu-line">
			<div class="menu-item"><a href="#about">ABOUT</a></div>
		</div-->
		<div class="menu-line">
			<div class="menu-item"><a href="#contact">CONTACT</a></div>
		</div>
	</div>
	<div id="content"/>
</div>
		<div style='display:none'>
		<?
			if (isset($_GET['page'])) {

					
				echo "<div id='hash' class='".$_GET['page']."' ></div>";

				switch ($_GET['page']) {
				    case "portraits":
				    case "nature":
				    case "fine_art":
				    case "wellington":
					include("class/dao.class.php5");
					$dao=new dao();
					$imageData=$dao->getImageData($_GET['page']);
	
					foreach($imageData as $img) {
							echo "\n";
							echo "<a href='photo-".$img['picture_id']."'><img alt='".$img['caption']."' src='gallery/all/".$_GET['page']."/thumbs/".$img['file']."'></img><span>".$img['caption']."</span></a>";
					}

					break;

					case "about":
						echo "
						Julien Pellet, awarded freelance photographer in wellington : portraits, people, arts, events, commercial, advertisement,
						";
					break;
					case "contact":
						echo "Contact Julien Pellet by phone or mail for any question.
						";
					break;
					
				}
			} else 	if (isset($_GET['pic'])) {			
				echo "<div id='hash' class='".$_GET['pic']."' ></div>";
				include("class/dao.class.php5");
				$dao=new dao();
				$imageData=$dao->getImageDetails($_GET['pic']);
				echo $imageData[0]['caption'];
				

			} else {
				echo "
				Julien Pellet, awarded photographer in wellington : portraits, people, arts, events, commercial, advertisement,
				";
				echo "<a href='page-portraits'></a>";
				echo "<a href='page-nature'></a>";
				echo "<a href='page-fine_art'></a>";
				echo "<a href='page-wellington'></a>";
				echo "<a href='page-about'></a>";
				echo "<a href='page-contact'></a>";

			}
		?>
		</div>
</body>
</html>
