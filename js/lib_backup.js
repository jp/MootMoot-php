//console.log("Loading Script")
var START=true;
var galleryNames = ['portraits','nature','fine-art'];


var rollState = {
	maxPics:7,
	firstPictureArrayPosition:0
}



var galleryState = {
	galleryPage:0,
	currentPicture:false,
	firstPicture:false,
	firstPictureInRoll:false,
	galleryCaption:false,
	thumbPath:"galleries/self/thumb/",
	imagePath:"galleries/self/pics/",
	maxPics:5,
	rollUnitWidth:124,
	galleryLength:0,
	maxPicsInRoll:7,
	rollSliding:false,
	maxPictureWidth:"900px",
	maxPictureHeight:"800px",
	randomSlideshowTimer:false
}

var displayData = {
	menuSize:250,
	thumbSize:225,
	contentWidth:900,
	screenWidth:false,
	screenHeight:false
}

var galleryStorage = new Array();
var galleryData = new Array();
var picturesArray = new Array();
function galleryUnit(id,image, src,title,caption,last,next,position,galleryName) {
	this.id = id;
	this.imageDOM = image;
	this.src = src;
	this.title = title;
	this.caption = caption;
	this.last = last;
	this.next = next;
	this.position=position;
	this.galleryName=galleryName;
};

var addImage = function(src,id,title) {
	var li     = new Element('li', {'class': 'thumb-page'});
	var link   = new Element('a', {'class': 'thumb-link','href': '#'+id}).inject(li);
	var thumb    = new Element('img', {'id':id,'src': "gallery/"+galleryState.thumbPath+ src,'class':'mini'}).inject(link);
	var footer = new Element('span').inject(thumb,'after');
	footer.addClass('title');
	footer.set('text', title);
	li.addEvent('click', function(e) {loadPic(id)});
	return li;
}


function loadGallery(gallery) {
	galleryData=galleryStorage[gallery];

	Array.each(galleryStorage[gallery], function(picture, id){

		document.getElementById("content").appendChild(picture.imageDOM.clone(true,true)); //"true,true" : keep content, keep id
	});
	initMouseOverThumb();
	
}

function initMouseOverThumb(){
	Array.each($$('img.mini'), function(thumb, index){
	thumb.set('tween', {transition: Fx.Transitions.Quint.easeOut, duration:500});
		  thumb.addEvents({
		    mouseenter: function(){
				thumb.tween('padding-top', 15);
			},
		    mouseout: function(){
				thumb.tween('padding-top', 0);
			},
		    click:function(){
				PelletStudio.displayPic(thumb.id);
			}

		})
	});
}




var PelletStudio = {
	start: function(){
//		PelletStudio.getGallery("nature");
		

		if (window.location.hash.length>0) {
			window.location.hash="";
		}
		var storedHash = window.location.hash;
		window.setInterval(function () {
		    if (window.location.hash != storedHash) {
			storedHash = window.location.hash;
			PelletStudio.hashChanged(storedHash);
		    }
		}, 250);


			var menuFX = new Fx.Tween('title', {property: 'margin-left',duration:1500,transition: Fx.Transitions.Back.easeOut});
			menuFX.start(-1750,0).chain(
				function(){
					var whiteScreenFX = new Fx.Tween('white-screen', {property: 'opacity',duration:1000});
					whiteScreenFX.start(1,0).chain(
						function(){
							$('white-screen').style.display="none";
							$('menu').style.zIndex=2;
						})
			});

		Array.each(galleryNames, function(name, id){
			PelletStudio.getGallery(name);
		});

//		PelletStudio.displayRandomPictures();

		PelletStudio.getWindowSize();
		PelletStudio.resizeContents();
	},
	getWindowSize : function() {
		var winW = 630, winH = 460;
		if (document.body && document.body.offsetWidth) {
		 winW = document.body.offsetWidth;
		 winH = document.body.offsetHeight;
		}
		if (document.compatMode=='CSS1Compat' &&
		    document.documentElement &&
		    document.documentElement.offsetWidth ) {
		 winW = document.documentElement.offsetWidth;
		 winH = document.documentElement.offsetHeight;
		}
		if (window.innerWidth && window.innerHeight) {
		 winW = window.innerWidth;
		 winH = window.innerHeight;
		}
		displayData.screenWidth=winW;
		displayData.screenHeight=winH;

	},
	resizeContents : function() {
		if (displayData.screenWidth-displayData.menuSize<900) {
//			galleryState.maxPicsInRoll=5;
		}
	},
	hashChanged : function (storedHash) {
		switch (storedHash) {
		 case "#main": //rien et main
		 case "":
			$('content').empty();
//			loadGallery();
			Element('div', {'id':"random-picture"}).inject($('content'));
			PelletStudio.displayRandomPictures();
			 break;
		 case "#portraits":
			PelletStudio.displayGallery("portraits");
			 break;
		 case "#landscapes":
			PelletStudio.displayGallery("nature");
			 break;
		 case "#fine-art":
			PelletStudio.displayGallery("fine-art");
			 break;
		 case "#about":
			PelletStudio.displayAbout();
			break;
		 case "#contact":
			PelletStudio.displayContact();
		}
	},
	displayRandomPictures:function() {
		if (!$('random-picture') || galleryState.randomSlideshowTimer!=false) {
			return;
		}
		var picture = picturesArray.getRandom();


		if ($('pic-frame')) {
			var myFx = new Fx.Tween('pic-frame', {property: 'opacity',duration:'long'});
			myFx.start(1,0).chain(function(){
				$('pic-frame').empty();
				Element('img', {'id':"p"+picture.id,'src': "gallery/all/"+picture.galleryName+"/images/"+ picture.src,'class':'pic'}).inject($('pic-frame'));
				this.start(0,1).chain(
				    function(){ 
					galleryState.randomSlideshowTimer=setTimeout("galleryState.randomSlideshowTimer=false;PelletStudio.displayRandomPictures()",7000); 
					}
			);

			});
			return;
		}

		var roll     = new Element('div', {'id':'roll'}).inject($('content'));
		var frame    = new Element('div', {'id':'pic-frame'}).inject($('content'));
		Element('img', {'id':"p"+picture.id,'src': "gallery/all/"+picture.galleryName+"/images/"+ picture.src,'class':'pic'}).inject($('pic-frame'));

		var myFx = new Fx.Tween('pic-frame', {property: 'opacity',duration:'long'});
		myFx.start(0,1).chain(
		    function(){ 
			setTimeout("PelletStudio.displayRandomPictures()",7000); 
			}
		);

//		$('pic-frame').set('tween', {transition: Fx.Transitions.Quint.easeOut, duration:'long'});
//		$('pic-frame').tween('opacity', 1).delay(5000).chain(displayRandomPictures);

		


		START=false;
	},
	displayAbout:function() {
		$('content').empty();
		var about    = new Element('div', {'id':'about'}).inject($('content'));
		about.set("html","<strong>On Location Photoshoot - $140 </strong><br><br>\
I can come and setup a mobile studio to any location within the Wellington Region for a photoshoot. Each photoshoot will take approx 40-45mins.<br>\
I love capturing natural expressions, so I usually just hang about and observe, especially when it comes to children.<br>\
You will get a minimum of 15 high res photos (A mix of B&W and Colour) on a digital support. I find many people like to be able to print the photos themselves but I am happy to give a cost for printing. I can also arrange for Canvas Prints and Enlargements.");

	},
	displayContact:function() {
		$('content').empty();
		var about    = new Element('div', {'id':'about'}).inject($('content'));
		about.set("html","<center><strong>Julien Pellet Photography</strong><br>\
phone : 02102866409<br>mail : <A HREF='mailto:contact@julienpellet.com'>contact@julienpellet.com</A></center>");
		
	},

	displayPic : function (pictureId){
		if($('pic-frame')) {

			var myFx = new Fx.Tween('pic-frame', {property: 'opacity'});
			myFx.start(1,0).chain(
				function(){
					$('pic-frame').empty();
					var src=galleryData[pictureId].src;
					Element('img', {'id':"p"+pictureId,'src': "gallery/"+galleryState.imagePath+ src,'class':'pic'}).inject($('pic-frame'));

					$('pic-frame').set('tween', {transition: Fx.Transitions.Quint.easeOut, duration:'long'});
					$('pic-frame').tween('opacity', 1);
				});
		} else {

			$('content').empty();
			PelletStudio.displayRoll();

			if (galleryData[pictureId].position>=galleryState.maxPicsInRoll) {

				var decalage=galleryData[pictureId].position+galleryState.maxPicsInRoll-galleryState.galleryLength;
				if (decalage<0)
					decalage=0;
					

				$('roll-prev').style.visibility="hidden";
				$('roll-next').style.visibility="hidden";

				Array.each(galleryData, function(picture, id){
					if(picture.position<galleryData[pictureId].position-decalage) 
					{
						$(picture.id.toString()).style.display="none";
						$(picture.id.toString()).tween('width',0);
						$('roll-prev').style.visibility="visible";
						galleryState.firstPictureInRoll=picture.next;
					}					
					else if(picture.position>galleryData[pictureId].position+6)
					{
//						$(picture.id.toString()).style.display="none";
//						$(picture.id.toString()).tween('width',0);
						$('roll-next').style.visibility="visible";
					}
				});

			}

			var src=galleryData[pictureId].src;
			Element('img', {'id':"p"+pictureId,'src': "gallery/"+galleryState.imagePath+ src,'class':'pic'}).inject($('pic-frame'));

			$('pic-frame').set('tween', {transition: Fx.Transitions.Quint.easeOut, duration:'long'});
			$('pic-frame').tween('opacity', 1);
		}

		galleryState.currentPicture = pictureId;
		$(pictureId.toString()).tween("opacity",1);
		$(pictureId.toString()).removeEvents("mouseout");
		

	},
	displayRoll : function (pictureId){

		var roll     = new Element('div', {'id':'roll'}).inject($('content'));
		var frame    = new Element('div', {'id':'pic-frame'}).inject($('content'));
				
		new Element('div',{'id':'roll-next'}).inject(roll);
		new Element('div',{'id':'roll-prev'}).inject(roll);

		$('roll-next').addEvent('click', function(e) {PelletStudio.rollNext()});
		$('roll-prev').addEvent('click', function(e) {PelletStudio.rollPrev()});
		

		new Element('div',{'id':'roll-container'}).inject(roll);

		galleryState.firstPictureInRoll=false;

		Array.each(galleryData, function(picture, id){
			if (!galleryState.firstPictureInRoll) {
				galleryState.firstPictureInRoll=id;
			}

			var container = new Element('div', {'class': 'thumb-roll-container','id': 'roll-'+id});//.inject(li);;
			var link   = new Element('a', {'class': 'thumb-roll','href': '#'+id}).inject(container);

//			var thumb    = new Element('img', {'id':id,'src': "gallery/"+galleryState.thumbPath+ picture.src,'class':'mini','height':'79px'}).inject(link);
			var thumb = picture.imageDOM.getElementsByTagName('img')[0].clone(true,true).inject(link);

			var footer = new Element('span').inject(thumb,'after');
			footer.addClass('title');
//			footer.set('text', title);

/*			var container = new Element('div', {'class': 'thumb-roll-container','id': 'roll-'+id});//.inject(li);;
			var thumb   = new Element('a', {'id':id	,'class': 'thumb-roll','href': '#'+id}).inject(container);
			thumb.set('text', "text");
			thumb.style.background="url(gallery/"+galleryState.thumbPath+ picture.src+")";
*/
			var footer = new Element('span').inject(thumb,'after');
			footer.addClass('title');
//			footer.set('text', title);


			thumb.set('tween', {transition: Fx.Transitions.Quint.easeOut, duration:750});
			thumb.addEvents({
			    mouseenter: function(){
					if (!galleryState.rollSliding)
						thumb.tween('opacity', 1);
				},
			    mouseout: function(){
					if (!galleryState.rollSliding)
						thumb.tween('opacity', 0.5);
				},
			    click:function(){
					if (galleryState.currentPicture) {
						$(galleryState.currentPicture.toString()).tween('opacity', 0.5);
						$(galleryState.currentPicture.toString()).addEvents({
						    mouseout: function(){
								this.tween('opacity', 0.5);
							}});
					}
					thumb.removeEvents("mouseout");
					PelletStudio.displayPic(thumb.id);
				}
			});

			$('roll-container').appendChild(container); //"true,true" : keep content, keep id
		});

		if (!galleryData[galleryState.firstPictureInRoll].last) {
			$('roll-prev').style.visibility="hidden";
		}

		if (galleryState.galleryLength<=galleryState.maxPicsInRoll) {
			$('roll-next').style.visibility="hidden";
		}
		

//		galleryState.rollUnitWidth=$(galleryState.firstPictureInRoll.toString()).width;


	},
	rollNext : function(){
		if (galleryData[galleryState.firstPictureInRoll].next) {
			$('roll-prev').style.visibility="visible";
			
			var thumbId=galleryState.firstPictureInRoll.toString();
			var myFx = new Fx.Tween(thumbId, {property: 'width'});
			myFx.start(galleryState.rollUnitWidth,0).chain(
				function(){
					$(thumbId.toString()).style.display="none";
				}
			);


			galleryState.firstPictureInRoll = galleryData[galleryState.firstPictureInRoll].next;

			if(galleryData[galleryState.firstPictureInRoll].position+galleryState.maxPicsInRoll>=galleryState.galleryLength) {
				$('roll-next').style.visibility="hidden";
			}

		}

	},
	rollPrev : function(){
		var prevPicId = galleryData[galleryState.firstPictureInRoll.toString()].last;
		if (prevPicId) {
			galleryState.rollSliding=true;
			$('roll-next').style.visibility="visible";
			$(prevPicId.toString()).style.display="";


			var myFx = new Fx.Tween(prevPicId, {property: 'width'});
			myFx.start(0,galleryState.rollUnitWidth).chain(
				function(){
					galleryState.rollSliding=false;
				}
			);

//			$(prevPicId.toString()).set('tween', {transition: Fx.Transitions.Quint.easeOut});
//			$(prevPicId.toString()).tween('width', galleryState.rollUnitWidth);


			galleryState.firstPictureInRoll=prevPicId;
			if (!galleryData[galleryState.firstPictureInRoll.toString()].last) {
				$('roll-prev').style.visibility="hidden";
			}
		}
	},
	getGallery: function(gallery) {

		function parseGallery(request,xmlDoc) {
			var url = 'gallery/imageData.php5';
			var last=false;
			var next=false;
			var id=false;
			var title=false;
			try {
				if(xmlDoc.hasChildNodes() && xmlDoc.getElementsByTagName("IMAGE").length > 0) {

//					galleryState.galleryCaption = xmlDoc.getElementsByTagName("GALLERY_CAPTION")[0].childNodes[0].nodeValue;
//alert("FUCK IE OK 2bis");

					galleryState.imagePath=xmlDoc.documentElement.getAttribute("imagePath")
					galleryState.thumbPath=xmlDoc.documentElement.getAttribute("thumbPath")

					images = xmlDoc.getElementsByTagName("IMAGE");
					galleryState.galleryLength=images.length;
					for (var i=0;i<images.length;i++) {
						if (!galleryState.firstPicture) galleryState.firstPicture=id;
						next=false;
						id=images[i].getAttribute("id");
						src=images[i].getElementsByTagName("NAME")[0].childNodes[0].nodeValue;
						caption=images[i].getElementsByTagName("CAPTION")[0].childNodes[0].nodeValue;
						
						galleryStorage[gallery][id]=
							new galleryUnit(
								id,
								addImage(src,id),
								src,
								title,
								caption,
								last,
								next,
								i,
								gallery
						)
						if (last) galleryStorage[gallery][last].next=id;
						last=id;
					}
				}
//				$('dock-content').innerHTML=galleryState.galleryCaption;
//				loadGallery(gallery);
				picturesArray.append(galleryStorage[gallery].flatten());

				if (START==true && gallery == galleryNames.getLast()) {
					Element('div', {'id':"random-picture"}).inject($('content'));
					PelletStudio.displayRandomPictures();		
				}			

			}
			catch(e) {alert(e)
			}
		}

		if (galleryStorage[gallery]) {
			galleryState.imagePath="/all/"+gallery+"/images/";
			galleryState.thumbPath="/all/"+gallery+"/thumbs/";
			galleryState.galleryLength=galleryStorage[gallery].flatten().length;
			loadGallery(gallery);
		} else {
			galleryStorage[gallery]=new Array();
	
			var ajax = new Request( {
				url : 'gallery/imageData.php5',
				method: 'get',
				data: "gallery="+gallery,
				encoding: 'utf-8',
				onSuccess: parseGallery
			}).send();
		}

	},
	displayGallery:function(galleryName){
		$('content').empty();

		galleryState.imagePath="/all/"+galleryName+"/images/";
		galleryState.thumbPath="/all/"+galleryName+"/thumbs/";
		galleryState.galleryLength=galleryStorage[galleryName].flatten().length;
		loadGallery(galleryName);
	}
}
window.addEvent('load', PelletStudio.start);

