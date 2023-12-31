// SMF style popup window for form help clicks.
function reqWin(desktopURL, alternateWidth, alternateHeight, noScrollbars)
{
	if ((alternateWidth && self.screen.availWidth * 0.8 < alternateWidth) || (alternateHeight && self.screen.availHeight * 0.8 < alternateHeight))
	{
		noScrollbars = false;
		alternateWidth = Math.min(alternateWidth, self.screen.availWidth * 0.8);
		alternateHeight = Math.min(alternateHeight, self.screen.availHeight * 0.8);
	}
	else
		noScrollbars = typeof(noScrollbars) != "undefined" && noScrollbars == true;

	window.open(desktopURL, 'requested_popup', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=' + (noScrollbars ? 'no' : 'yes') + ',width=' + (alternateWidth ? alternateWidth : 480) + ',height=' + (alternateHeight ? alternateHeight : 220) + ',resizable=no');

// Return false so the click won't follow the link ;).
return false;
}

// Twitter widget junk
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));

// Twitter widget junk
$(document).ready(function()
{
	$('.resp-sharing-button__link').on('click', function()
	{
		window.open(this.href,'', 'menubar=no, toolbar=no, resizable=yes, scrollbars=yes,height=600, width=600');
		return false;
	});
});

// Experimental tabbed form code
function openTab(evt) {
    var y = evt.currentTarget.parentElement.getElementsByTagName("LI");
    console.log(y);
    var x = document.getElementsByTagName("LEGEND");

    for (i = 0; i < x.length; i++)
    {
        for (j = 0; j < y.length; j++)
        {
            if(x[i].innerText === y[j].innerText)
            {
                x[i].parentElement.style.display = "none";
            }
        }
        
        if(x[i].innerText === evt.currentTarget.innerText)
        {  
            x[i].parentElement.style.display = "block";
            
        }
    }
    
    var x = evt.currentTarget.parentElement.getElementsByTagName("LI");
    for (i = 0; i < x.length; i++)
    {
        x[i].classList.remove("active");
    }
    
    evt.currentTarget.className += " active";
}

// Adds listeners to all collapsible divs and form groups
window.addEventListener('DOMContentLoaded', (event) => {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      var initial = coll[i].nextElementSibling;
      var inputcheck = initial.children[0].children[0];
      /*if (inputcheck.value.length == 0)
      {
          console.log("Empty");
      }else
      {
          console.log("NOT Empty");
      }  */        
      
      initial.style.display = "none";
      
      
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "none") {
          content.style.display = "block";
        } else {
          content.style.display = "none";
        }
      });
    }
});

// Runs hasher-js to auto generate ROM/ISO Information field data upon scan request
function GetRomInfo () {
    var fileInput = document.getElementById ("romscan");
    var message = "";
	
    if ('files' in fileInput) {
		var file = fileInput.files[0];
		var hashObj = new Hasher(file);
        
        window.hasherDbPath = location.protocol + '//www.romhacking.net/hash/db/';

		// Output progress to the console
		var progressCallback = function(progress) { 
			var percent = Math.floor(progress * 100);
			var note = fileInput.nextElementSibling;
            note.innerText = '(Scanning: ' + percent + '%)';
		};

		// Display our ROM database match on the console
		hashObj.getRomData(null, progressCallback)
			.then(function(romData) {
				var info = document.getElementById ("rominfo");
				info.value = createSummary(romData);
                // Clear name so file is never actually uploaded when form is submitted.
                fileInput.name = '';
			});
    } 
}

// Helpers taken from HasherUI.js to format output from hasher-js
var getHash = function (region, algo) { return function (item) { return item.region.name === region && item.algoName === algo; }; };
var valOrNull = function (item) { return item ? item.value : null; };
var formatHash = function (name, value) { return value ? name + ": " + value + "\n" : ""; };

// Taken from HasherUI.js to format output from hasher-js
function createSummary(romData) {
    var fileHash = valOrNull(romData.hashes.find(getHash('file', 'sha1')));
    var romHash = valOrNull(romData.hashes.find(getHash('rom', 'sha1')));
    var fileHashCrc = valOrNull(romData.hashes.find(getHash('file', 'crc32')));
    var romHashCrc = valOrNull(romData.hashes.find(getHash('rom', 'crc32')));

    var dbString = "No database match.\n";
    var dbMatch = "";
    if (romData.dbInfo.name && romData.dbInfo.name !== 'not found') {
        dbString = "Database: " + romData.dbInfo.name + " (v. " + romData.dbInfo.version + ")\n";
        dbMatch = "Database match: " + romData.dbMatch + "\n";
    }

    var outputString = "";

    outputString += dbMatch; // "Database match: " + romData.dbMatch + "\n";
    outputString += dbString; // dbString + "\n";

    var sha1matches = fileHash === romHash;
    var crc32matches = fileHashCrc === romHashCrc;

    if (sha1matches) {
        outputString += formatHash("File/ROM SHA-1", fileHash);
    } else {
        outputString += formatHash("File SHA-1", fileHash);
    }
    if (crc32matches) {
        outputString += formatHash("File/ROM CRC32", fileHashCrc);
    } else {
        outputString += formatHash("File CRC32", fileHashCrc);
    }
    if (!sha1matches) {
        outputString += formatHash("ROM SHA-1", romHash);
    }
    if (!crc32matches) {
        outputString += formatHash("ROM CRC32", romHashCrc);
    }

    return outputString;
}