function goToChoiceScene() {
	$(mainContainer).addClass("choice");
}

function initChoiceScene() {
	var tmpSceneId = "choice";
	var tmpScene = sceneList.find(function(scene_) {
		return (scene_.id === tmpSceneId);
	})
	
	if(tmpScene == undefined){
		tmpScene = new Scene({
			"id" : tmpSceneId,
			"element": $("<div>").attr("id", tmpSceneId)[0],
			"relatedImportedImages": importedImages[tmpSceneId]
		});

		tmpScene.init = function() {
			var self = this;
			var handContainer;
			var diskContainer;
			var targetDisk;
			
			var createDiskListContainer = function(){
				diskContainer = $("<div>");
				diskContainer.attr("id", "disksContainer");
				diskContainer.appendTo(self.content);
				
				var diskContent = $("<div>");
				diskContent.attr("id", "disksContent");
				diskContainer.append(diskContent);
			}
			
			selectedSubject = undefined;
			
			this.createBackgroundElement();
			createDiskListContainer();
			
			var refreshDiskSize = function() {
				var diskSize = diskContainer.height() * (2/3);
				
				$("." + Character.cssClasses.disk.content).css({
					"height": diskSize + "px",
					"width": diskSize + "px",
				});
			}
			
			randomizeArray(characterIds).forEach(function(characterId_) {
				var tmpCharacter = characters[characterId_];
				
				var tmpDiskElement = tmpCharacter.createDiskElement();
				diskContainer.find("#disksContent").append(tmpDiskElement);
							
				var tmpContent = $(tmpDiskElement).find("." + Character.cssClasses.disk.content);
				
				refreshDiskSize();
				
				tmpDiskElement.addEventListener("animationstart", function(event_) {
					self.hide();
				});
				
				tmpContent.on("click", function(event_) {
					selectedSubject = tmpCharacter;
					$(tmpDiskElement).addClass("selected");
					$(tmpScene.container).addClass("locked");
				});
			});
		}
		
		sceneList.push(tmpScene);
	}
}