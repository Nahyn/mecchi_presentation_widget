if(window.sceneList == undefined){
	window.sceneList = {};
}

function clearComputerScene() {
	$(computerContainer).empty();
}

function goToComputerScene() {
	$(mainContainer).addClass("computer");
}

function initComputerScene() {
	var tmpSceneId = "computer";
	
	var tmpScene = sceneList.find(function(scene_) {
		return (scene_.id === tmpSceneId);
	})
	
	if(tmpScene == undefined){
		tmpScene = new Scene({
			"id" : tmpSceneId,
			"element": $("<div>").attr("id", tmpSceneId)[0],
			"relatedImportedImages": importedImages[tmpSceneId]
		});
		
	window.addEventListener(ComputerScreen.EventTypes.APPEAR, function(event_) {
		$(mainContainer).removeClass("locked");
	});
	window.addEventListener(ComputerScreen.EventTypes.DISAPPEAR, function(event_) {
		$(mainContainer).addClass("locked");
	});
	

		tmpScene.init = function() {
			var self = this;
			
			var computerContainer = $("<div>")
				.attr("id", "computer_container")
				.appendTo(this.content)
			;
			
			var computerContent = $("<div>")
				.attr("id", "computer_content")
				.appendTo(computerContainer)
			;
			
			
			var computerMenu = $("<div>")
				.attr("id", "computer_menu")
				.appendTo(computerContent)
			;
			
			
			var overlayElement = $("<img>")
				.addClass("overlay")
				.attr("src", this.relatedImportedImages.overlay)
				.appendTo(this.content)
			;
			
			var frameElement = $("<img>")
				.addClass("frame")
				.attr("src", this.relatedImportedImages.frame)
				.appendTo(this.content)
			;
			
			selectedSubject.setContainer(computerContent[0]);
			
			selectedSubject.screens.forEach(function(tmpScreen_) {
				var tmpTab = tmpScreen_.getTabElement();
				
				tmpTab.addEventListener("click", function(event_) {
					if($(tmpTab).hasClass(ComputerScreen.cssClasses.tab.active) == false){
						selectedSubject.showScreen(tmpScreen_);
						$("." + ComputerScreen.cssClasses.tab.active, computerMenu).removeClass(ComputerScreen.cssClasses.tab.active);
						$(tmpTab).addClass(ComputerScreen.cssClasses.tab.active);
					}
				})
				
				computerMenu.append(tmpTab);
			});
			
			var exitButton = $("<div>")
				.addClass(ComputerScreen.cssClasses.tab.container)
				.addClass(ComputerScreen.cssClasses.tab.exit)
				.append(
					$("<p>").html("x")
				)
				.appendTo(computerMenu)
			;
			
			exitButton.on("click", function(event_){
				selectedSubject.hideScreen();
				tmpScene.hide();
			})
			
			selectedSubject.showScreen(0);
			/*
			computerContainer.on("click", function(){
				selectedSubject.nextScreen();
			});
			*/
		}
		
		sceneList.push(tmpScene);
	}
}