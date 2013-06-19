// 
// This file shows the minimum you need to provide to BookReader to display a book
//
// Copyright(c)2008-2009 Internet Archive. Software license AGPL version 3.

// Create the BookReader object

	imagesArray = [];
function spreadsheetLoaded(json){

	imagesArray = [];

	json = json.substring(json.indexOf("(")+1);
	json = json.substring(0,json.lastIndexOf(")"));
	
	json=JSON.parse(json);
	parts = json["feed"]["entry"];

	for (n in parts ){
	
	   if (parts[n]["gsx$image"]!=undefined){

		imagesArray.push({"image":parts[n]["gsx$image"]["$t"],"height":parts[n]["gsx$height"]["$t"],"width":parts[n]["gsx$width"]["$t"]});
		}
	}
	var externalArray = [];
	var htmlstring  = "";
	
	
	// Let's go!
	//br.init();

	// read-aloud and search need backend compenents and are not supported in
	// the demo
br = new BookReader();
	br.imagesBaseURL = '../BookReader/images/';

	// Return the width of a given page. Here we assume all images are 800
	// pixels wide
	br.getPageWidth = function(index) {
		if ((imagesArray[index])&&(imagesArray[index].width!=undefined)) {
		return parseInt(imagesArray[index].width);
		}
		else{
		return 800;
		}
	}

	// Return the height of a given page. Here we assume all images are 1200
	// pixels high
	br.getPageHeight = function(index) {
		if ((imagesArray[index])&&(imagesArray[index].height!=undefined)){
		return parseInt(imagesArray[index].height)
		}
		else{
		return 1200;
		}
	}

	// We load the images from archive.org -- you can modify this function to
	// retrieve images
	// using a different URL structure
	br.getPageURI = function(index, reduce, rotate) {
		// reduce and rotate are ignored in this simple implementation, but we
		// could e.g. look at reduce and load images from a different directory
		// or pass the information to an image server
		// var leafStr = '000';
		// var imgStr = (index+1).toString();
		// var re = new RegExp("0{"+imgStr.length+"}$");
		// var url =
		// 'http://www.archive.org/download/BookReader/img/page'+leafStr.replace(re,
		// imgStr) + '.jpg';
		
		url = imagesArray[index].image;

		return url;
	}

	// Return which side, left or right, that a given page should be displayed
	// on
	br.getPageSide = function(index) {
		if (0 == (index & 0x1)) {
			return 'R';
		} else {
			return 'L';
		}
	}

	// This function returns the left and right indices for the user-visible
	// spread that contains the given index. The return values may be
	// null if there is no facing page or the index is invalid.
	br.getSpreadIndices = function(pindex) {
		var spreadIndices = [ null, null ];
		if ('rl' == this.pageProgression) {
			// Right to Left
			if (this.getPageSide(pindex) == 'R') {
				spreadIndices[1] = pindex;
				spreadIndices[0] = pindex + 1;
			} else {
				// Given index was LHS
				spreadIndices[0] = pindex;
				spreadIndices[1] = pindex - 1;
			}
		} else {
			// Left to right
			if (this.getPageSide(pindex) == 'L') {
				spreadIndices[0] = pindex;
				spreadIndices[1] = pindex + 1;
			} else {
				// Given index was RHS
				spreadIndices[1] = pindex;
				spreadIndices[0] = pindex - 1;
			}
		}

		return spreadIndices;
	}

	// For a given "accessible page index" return the page number in the book.
	//
	// For example, index 5 might correspond to "Page 1" if there is front
	// matter such
	// as a title page and table of contents.
	br.getPageNum = function(index) {
		return index + 1;
	}

	// Total number of leafs
	br.numLeafs = imagesArray.length;

	// Book title and the URL used for the book title link
	br.bookTitle = json["feed"]["title"]["$t"];
	br.bookUrl = BookReaderConfig.bookUrl;

	// Override the path used to find UI images
	// br.imagesBaseURL = '../BookReader/images/';

	br.getEmbedCode = function(frameWidth, frameHeight, viewParams) {
		return "Embed code not supported in bookreader demo.";
	}
	br.init();
	$('#BRtoolbar').find('.read').hide();
	$('#textSrch').hide();
	$('#btnSrch').hide();
	return;
}		
function loadData(key){
	var dataurl = 'https://spreadsheets.google.com/feeds/list/'+key+'/od6/public/values?alt=json-in-script&callback=spreadsheetLoaded';
	$.ajax({
	  url: dataurl,
	  dataType: 'jsonP',
	  jsonpCallback: "spreadsheetLoaded",
	    success: function(data){
			spreadsheetLoaded(data);
	    }
	});}
$(document).ready(function() {
	
key = window.location.hash;
key = key.substring(1);
loadData(key);

	
});