var characters = {};
var sceneList = [];

var characterIds = ["stray", "butcher", "galiléo"];
var timePeriodIds = ["baby", "teen", "present", "future"];

var selectedSubject;
var audioSystem;

var mainContainer;
var choiceContainer;
var transitionContainer;
var computerContainer;

var mediaTypes = {
	audio: "audio",
	img: "img"
}

var lockCount = 0;
function lockMainContainer() {
	lockCount++;
	$(mainContainer).addClass("locked");
}

function unlockMainContainer() {
	lockCount--;
	
	if (lockCount <= 0) {
		$(mainContainer).removeClass("locked");
	}
}

function getRandom(min_, max_) {
	var delta = max_ - min_;
	
	return min_ + (delta * Math.random())
}

function randomizeArray(array_) {
	var result = [];
	var maxIndex = array_.length -1;
	
	array_.forEach(function(value_, index_) {
		var tmpIndex = Math.round(getRandom(0, maxIndex));
		
		while (result[tmpIndex] != undefined) {
			tmpIndex = (tmpIndex + 1) % (maxIndex+1);
		}
		
		result[tmpIndex] = value_;
	});
	
	return result;
}

function getRandomFromArray(array_) {
	var tmpIndex = Math.round(getRandom(0, array_.length - 1));
	
	return array_[tmpIndex];
}

var directText = false; //true;
function displayProgressiveText(options_) {
	options_ = options_ || {};
	
	var progressingClass = "text_progressing"
	
	var parameters = {
		"text": "",
		"startIndex": 0,
		"intervalDuration": 10,
		"delayDuration": 0,
		"container": $("<div>")[0],
		"randomSigns": ["%", "€", "$", "£", "µ", "§", "#", "&"],
		"chunkSizeLimits": [1, 1],
	};
	parameters.id = Date.now() + parameters.name;
	
	var getRandomSign = function() {
		return getRandomFromArray(parameters.randomSigns);
	};
	
	Object.keys(options_).forEach(function(key_) {
		parameters[key_] = options_[key_];
	}, this);
	
	callEvent(window.EventTypes.START_PROGRESSIVE_TEXT, window, { "id": parameters.id })
	callEvent(window.EventTypes.PROGRESSIVE_TEXT_STARTED, window, { "id": parameters.id })
	
	var textElement = $(parameters.container);
	var finalText = parameters.text;
		
	if(directText === true){
		textElement.html(finalText);
	} else {
		var increment = parameters.startIndex;
		var interval;
		
		textElement.addClass(progressingClass);
		
		var currentText = "";
		var nextChunkSize;
		setTimeout(function() {
			interval = setInterval(function() {
				nextChunkSize = getRandom(parameters.chunkSizeLimits[0], parameters.chunkSizeLimits[1]);
				
				if(increment >= finalText.length){
					currentText = finalText;
					textElement.html(currentText);
					clearInterval(interval);
					
					textElement.removeClass(progressingClass);
					callEvent(window.EventTypes.END_PROGRESSIVE_TEXT, window, { "id": parameters.id })
					callEvent(window.EventTypes.PROGRESSIVE_TEXT_ENDED, window, { "id": parameters.id })
					
				} else {
					currentText = "";
					currentText += finalText.substring(0, increment);
					for(var i=0 ; i < nextChunkSize ; i++) {
						currentText += getRandomSign();
					}
					
					increment = increment + nextChunkSize;
					textElement.html(currentText);
				}
				
			}, parameters.intervalDuration);
		}, parameters.delayDuration)
	}
}

var currentScene;
function nextScene() {
	var currentSceneIndex = -1;
	if(currentScene != undefined) {
		currentSceneIndex = sceneList.indexOf(currentScene);
	}
	
	var nextSceneIndex = (currentSceneIndex + 1) % sceneList.length;
	currentScene = sceneList[nextSceneIndex];
	currentScene.show(mainContainer);
};

characterIds.forEach(function(characterId_) {
	var tmpImportedTexts = importedTexts.characters[characterId_];
	var tmpImportedImages = importedImages.characters[characterId_];
	
	var tmpTimePeriods = [];
	
	timePeriodIds.forEach(function(timePeriodId_) {
		tmpTimePeriods.push(
			new TimePeriod({
				"periodId": timePeriodId_,
				"characterId": characterId_,
			})
		);
	}, this);
	
	characters[characterId_] = new Character({
		"id": characterId_,
		
		"name": tmpImportedTexts.name,
		"age": tmpImportedTexts.age,
		"specie": tmpImportedTexts.specie,
		"date of birth": tmpImportedTexts["date of birth"],
		
		"timePeriods" : tmpTimePeriods,
	})
}, this);

window.onload = function(event_) {
	mainContainer = $("#mecchi_computer_widget")[0];
	audioSystem = new AudioSystem();
	
	var mouseHoverSound;
	$("body").on("mouseenter", ".btn", function(event_){
		if($(event_.target).hasClass("btn_active") == false){
			if(mouseHoverSound != undefined){
				mouseHoverSound.pause();
			}
			mouseHoverSound = audioSystem.play(importedSounds.mouse_hover);
		}
	});
	
	$("body").on("click", ".btn", function(event_){
		if($(event_.target).hasClass("btn_active") == false){
			audioSystem.play(importedSounds.mouse_click);
		}
	});
	
	window.addEventListener(Scene.EventTypes.APPEAR, function(event_) {
		unlockMainContainer();
	});
	window.addEventListener(Scene.EventTypes.DISAPPEAR, function(event_) {
		lockMainContainer();
	});
	
	$("body").on("mouseenter", "." + RichText.cssClasses.helpAnchorClass, function(event_) {
		var tmpElement = $(event_.currentTarget);
		var tmpTerm = tmpElement.attr("data-definition");
		var termDefinition = importedDefinitions[tmpTerm];
		
		var tmpHelpText = new HelpText();
		
		$(event_.currentTarget).on("mouseleave", function(event_) {
			tmpHelpText.hide();
		});
		
		tmpHelpText.setPosition(tmpElement[0]);
		tmpHelpText.show();
		
		var tmpHelpTextTerm = $("<span>")
			.addClass(HelpText.cssClasses.term)
			.html(tmpTerm)
		;
		
		var tmpPrefix = tmpHelpTextTerm[0].outerHTML;
		displayProgressiveText({
			"text": tmpPrefix + termDefinition,
			"startIndex": tmpPrefix.length,
			"container": $(tmpHelpText.element).find("." + HelpText.cssClasses.body),
			"intervalDuration": 1000/(tmpPrefix + termDefinition).length,
			"chunkSizeLimits": [5, 10],
		});
	});
	
	var refreshMainContainer = function(){
		var tmpWidth = $(mainContainer).width();
		$(mainContainer).css("height", (tmpWidth*9/16) + "px");
	}
	
	var mutationConfig = { attributes: false, childList: true, subtree: true };
	var mutationHandler = function(mutations_) {
		mutations_.forEach(function(mutation_) {
			var eventData = {"mutation": mutation_};
			
			callEvent(window.EventTypes.CHANGE_CHILDLIST, window, eventData);
			callEvent(window.EventTypes.CHILDLIST_CHANGED, window, eventData);
		})
	}
	
	var mutationObserver = new MutationObserver(mutationHandler);
	mutationObserver.observe($("#mecchi_computer_widget")[0], mutationConfig);
	
	window.addEventListener("resize", function(event_){
		refreshMainContainer();
	});
	
	refreshMainContainer();
	
	initChoiceScene();
	initTransitionScene();
	initComputerScene();
	
	mainContainer.append(HelpText.container);
	mainContainer.append(audioSystem.volumeControlContainer);
	
	var mediaToLoad = [];
	
	var getMediaUrls = function(list_, mediaType_) {
		var listKeys = Object.keys(list_);
		
		listKeys.forEach(function(tmpKey_) {
			var value = list_[tmpKey_];
			if(typeof(value) == "string") {
				var urlAlreadyListed = mediaToLoad.some(function(mediaParams_){
					return mediaParams_.url === value;
				});
				
				if(urlAlreadyListed == false){
					mediaToLoad.push({
						"url": value,
						"type": mediaType_
					});
				}
			} else {
				getMediaUrls(value, mediaType_);
			}
		});
	}
	
	var loadedMediaCount = 0;
	
	mediaToLoad.push({ "type": mediaTypes.audio, "url": importedSounds.mouse_click });
	mediaToLoad.push({ "type": mediaTypes.audio, "url": importedSounds.mouse_hover });
	
	mediaToLoad.push({ "type": mediaTypes.img, "url": importedImages.choice.background });
	
	characterIds.forEach(function(characterId_) {
		mediaToLoad.push({ "type": mediaTypes.img, "url": importedImages.characters[characterId_].disk });
		mediaToLoad.push({ "type": mediaTypes.img, "url": importedImages.characters[characterId_].disk_big });
		mediaToLoad.push({ "type": mediaTypes.img, "url": importedImages.characters[characterId_].disk_background });
		mediaToLoad.push({ "type": mediaTypes.img, "url": importedImages.characters[characterId_].disk_background_shadow });
		mediaToLoad.push({ "type": mediaTypes.img, "url": importedImages.characters[characterId_].disk_overlay });
	});
	
	var minimumLoadedMediaCount = mediaToLoad.length;
	
	getMediaUrls(importedImages, mediaTypes.img);
	getMediaUrls(importedSounds, mediaTypes.audio);
	
	var totalMediaToLoad = mediaToLoad.length;
	
	/* ========================================================================================= */
	/* == Assets loading ======================================================================= */
	/* ========================================================================================= */
	
	var loadingElement;
	var loadingCompletedButton = $("<p>")
		.addClass("btn")
		.html("Start")
		.on("click", function(event_){
			lockMainContainer();
			setTimeout(function(){
				$(loadingElement).remove();
				nextScene();
			}, 0)
		})
	;
	
	var refreshLoading = function() {
		if(loadedMediaCount < minimumLoadedMediaCount){
			var progress = "" + loadedMediaCount;
			
			if (minimumLoadedMediaCount > 10) {
				if (loadedMediaCount < 10) {
					progress = "0" + progress;
				}
				
				if (minimumLoadedMediaCount > 100) {
					if (loadedMediaCount < 100) {
						progress = "0" + progress;
					}
				}
			}
			progress = progress + " / " + minimumLoadedMediaCount;
			
			loadingElement = LoadingElement.set(
				[
					"Loading, please wait", 
					progress
				],
				mainContainer
			);
		}
	};
	
	refreshLoading();
	var onLoaded = function(event_) {
		loadedMediaCount++;
		refreshLoading();
		
		if(loadedMediaCount >= minimumLoadedMediaCount) {
			var completedButtonContainer = $("<div>")
				.addClass("loadingCompletedButton-container")
			;
			
			var completedButtonContent = $("<div>")
				.addClass("loadingCompletedButton-content")
				.appendTo(completedButtonContainer)
			;
			
			loadingCompletedButton.appendTo(completedButtonContent);
			
			$(loadingElement)
				.empty()
				.append(completedButtonContainer)
			;
		}
	}
	
	var processImg = function(url_) {
		var tmpImage = new Image();
		
		tmpImage.onload = onLoaded;
		tmpImage.onerror = onLoaded;
		
		tmpImage.src = url_;
	}
	var processAudio = function(url_) {
		var tmpAudio = new Audio(url_);
		tmpAudio.addEventListener("canplaythrough", onLoaded);
	}
	
	mediaToLoad.forEach(function(mediaParameters_) {
		if(mediaParameters_.type == mediaTypes.img){
			processImg(mediaParameters_.url);
		} else {
			processAudio(mediaParameters_.url);
		}
	});
}

addEventTypes(window, [
	"START_PROGRESSIVE_TEXT",
	"PROGRESSIVE_TEXT_STARTED",
	
	"END_PROGRESSIVE_TEXT",
	"PROGRESSIVE_TEXT_ENDED",
	
	"CHANGE_CHILDLIST",
	"CHILDLIST_CHANGED",
])