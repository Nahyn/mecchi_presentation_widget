function goToTransitionScene() {
	$(mainContainer).addClass("transition");
}

function initTransitionScene() {
	var tmpSceneId = "transition";
	
	var tmpScene = sceneList.find(function(scene_) {
		return (scene_.id === tmpSceneId);
	})
	
	if(tmpScene == undefined){
		var driveContainer;
		var driveElement;
		
		tmpScene = new Scene({
			"id" : tmpSceneId,
			"element": $("<div>").attr("id", tmpSceneId)[0],
			"relatedImportedImages": importedImages[tmpSceneId]
		});
		
		tmpScene.addEventListener(Scene.EventTypes.DISAPPEAR, function() {
			audioSystem.play(importedSounds.computer_power_on);
		});
		
		tmpScene.addEventListener("transitionend", function(event_){
			tmpScene.hide();
		});
		
		tmpScene.addEventListener("animationend", function(event_){
			if(event_.animationName == "disk_appear") {
				var content = $(tmpScene.content);
				
				var driveWidth = driveElement.width();
				setTimeout(function(){
					driveContainer.css("right", driveWidth + "px");
				}, 200);
			}
		});

		tmpScene.init = function() {
			var self = this;
			
			var createComputerElement = function() {
				var computerSideContainer = $("<div>");
				computerSideContainer.attr("id", "computerSideContainer");
				computerSideContainer.appendTo(self.content);
				
				var computerSideContent = $("<div>");
				computerSideContent.attr("id", "computerSideContent");
				computerSideContainer.append(computerSideContent);
				
				driveContainer = $("<div>");
				driveContainer.attr("id", "driveContainer");
				computerSideContent.append(driveContainer);
				
				var driveContent = $("<div>");
				driveContent.attr("id", "driveContent");
				driveContainer.append(driveContent);
				
				driveElement = $("<img>");
				driveElement.attr("src", self.relatedImportedImages.drive);
				driveElement.attr("id", "driveImg");
				driveContent.append(driveElement);
				
				var diskElement = $("<img>");
				diskElement.attr("src", importedImages.characters[selectedSubject.id].disk_big);
				diskElement.attr("id", "diskImg");
				driveContent.append(diskElement);
				
				diskElement.on("animationend", function(event_) {
					computerSideContainer.addClass("placed");
				});
				
				var computerSideImg  = $("<img>");
				computerSideImg.attr("src", self.relatedImportedImages.computer);
				computerSideImg.attr("id", "computerSide");
				
				computerSideContent.append(computerSideImg);
			}
			
			this.createBackgroundElement();
			createComputerElement();
		}
		
		sceneList.push(tmpScene);
	}
}