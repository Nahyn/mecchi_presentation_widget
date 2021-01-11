
var easterEggContainer;
var easterEggContent;

var codes = [
	{
		"text" : "FUNGI",
		"callback": function() {
			var overContainer = $(mainContainer);
			
			var fungiPositionner = $("<div>")
				.attr("id", "fungi_positionner")
			;
			
			var fungiContainer = $("<div>")
				.attr("id", "fungi_container")
				.appendTo(fungiPositionner)
			;
			
			var tmpImg = new Image();
			
			tmpImg.onload = function(){
				var fungiImg = $("<img>")
					.attr("id", "fungi")
					.attr("src", importedImages.others.fungi)
					.appendTo(fungiContainer)
				;
				
				fungiPositionner.one("animationstart", function(event_) {
					lockMainContainer();
				});
				
				fungiPositionner.one("animationend", function(event_) {
					unlockMainContainer();
					
					easterEggContainer.remove();	
					easterEggContent.empty();
				});
				
				overContainer.append(easterEggContainer);
				easterEggContent.append(fungiPositionner);
			};
			
			tmpImg.src = importedImages.others.fungi;
		}
	},
	
	{
		"text" : "STRAY",
		"callback": function() {
			var overContainer = $(mainContainer);
			
			var strayPositionner = $("<div>")
				.attr("id", "stray_positionner")
			;
			
			var strayContainer = $("<div>")
				.attr("id", "stray_container")
				.appendTo(strayPositionner)
			;
			
			var strayImg = $("<img>")
				.attr("id", "stray")
				.attr("src", importedImages.others.stray)
				.appendTo(strayContainer)
			;
			var tmpImg = new Image();
			
			tmpImg.onload = function(){
				strayPositionner.on("animationstart", function(event_) {
					lockMainContainer();
				});
				

				strayPositionner.on("animationend", function(event_) {
					if(event_.originalEvent.animationName == "stray_positionner"){
						unlockMainContainer();
						
						easterEggContainer.remove();	
						easterEggContent.empty();
					}
				});
				
				overContainer.append(easterEggContainer);
				easterEggContent.append(strayPositionner);
			};
			
			tmpImg.src = importedImages.others.stray;
		}
	},
]

$(window).on("load", function(){
	easterEggContainer = $("<div>")
		.attr("id", "easterEgg_container")
	;
	easterEggContent = $("<div>")
		.attr("id", "easterEgg_content")
		.appendTo(easterEggContainer)
	;
		

	var currentString = "";
	var checkForEggs = function(){
		var possibleCodes = [];
		codes.forEach(function(tmpCode_) {
			if (tmpCode_.text.indexOf(currentString) == 0) {
				possibleCodes.push(tmpCode_);
			}
		});
		
		
		if(possibleCodes.length == 0) {
			currentString = "";
		} else {
			possibleCodes.forEach(function(tmpCode_) {
				if (tmpCode_.text == currentString) {
					audioSystem.play(importedSounds.easter_egg_discovery);
					tmpCode_.callback();
					currentString = "";
				}
			});
		}
	}

	document.addEventListener("keyup", function(event_) {
		currentString += (event_.key).toLocaleUpperCase();
		checkForEggs();
	})
})