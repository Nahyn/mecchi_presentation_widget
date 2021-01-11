/*
	options :
		(string) id
		
		(String) name 
		(String) age
		(Array<String>) description
		(String) illustration
		
		(Array<TimePeriod>) timePeriods
*/
function Character(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.id = "";
	
	this.name = "";
	this.age = "";
	this.birthday = "";
	this.specie = "";
	this.description = [];
	this.illustration = "";
	
	this.timePeriods = [];
	
	SelectableSubject.call(this, options_);
	
	this.relatedImportedImages = importedImages.characters[this.id];
	this.relatedImportedTexts = importedTexts.characters[this.id];
	
	this.initialize();
}
Character.prototype = Object.create(SelectableSubject.prototype);

Character.cssClasses = {};

Character.cssClasses.disk = {};
Character.cssClasses.disk.container = "character_disk_container";
Character.cssClasses.disk.content = "character_disk_content";
Character.cssClasses.disk.back_shadow = "character_disk_back_shadow";
Character.cssClasses.disk.back = "character_disk_back";
Character.cssClasses.disk.img = "character_disk_disk";
Character.cssClasses.disk.overlay = "character_disk_overlay";

Character.diskRotationLimits = {};
Character.diskRotationLimits.container = [-10, 10];
Character.diskRotationLimits.disk = [-45, 45];
Character.diskTranslateLimits = {};
Character.diskTranslateLimits.x = [-25, 25];
Character.diskTranslateLimits.y = [-5, 5];

Character.prototype.createDiskElement = function(){
	var containerRotation = Math.round(getRandom(Character.diskRotationLimits.container[0], Character.diskRotationLimits.container[1]));
	var containerTranslateX = getRandom(Character.diskTranslateLimits.x[0], Character.diskTranslateLimits.x[1]);
	var containerTranslateY = getRandom(Character.diskTranslateLimits.y[0], Character.diskTranslateLimits.y[1]);
	
	var diskContainer = $("<div>")
		.addClass(Character.cssClasses.disk.container)
	;
	
	var diskContent = $("<div>")
		.addClass(Character.cssClasses.disk.content)
		.css("transform", "rotate(" + containerRotation + "deg) translate(" + containerTranslateX + "%, " + containerTranslateY + "%)")
		.appendTo(diskContainer)
	;
	
	var diskBackgroundShadow = $("<img>")
		.addClass(Character.cssClasses.disk.back_shadow)
		.attr("src", this.relatedImportedImages.disk_background_shadow)
		.appendTo(diskContent)
	;
	
	var diskBackground = $("<img>")
		.addClass(Character.cssClasses.disk.back)
		.attr("src", this.relatedImportedImages.disk_background)
		.appendTo(diskContent)
	;
	
	var diskImage = $("<img>")
		.addClass(Character.cssClasses.disk.img)
		.attr("src", this.relatedImportedImages.disk)
		.appendTo(diskContent)
	;
	
	var diskOverlay = $("<img>")
		.addClass(Character.cssClasses.disk.overlay)
		.attr("src", this.relatedImportedImages.disk_overlay)
		.appendTo(diskContent)
	;
	
	return diskContainer[0];
}

Character.prototype.initialize = function() {
	var self = this;
	
	var createGeneralScreen = function() {
		var tmpComputerScreen = new ComputerScreen({
			"name": "general"
		});
		
		var dynamicImages = [];
		tmpComputerScreen.init = function() {
			var infoContainer = $("<div>")
				.addClass("infoContainer")
				.appendTo(tmpComputerScreen.content)
			;
			
			var addInfoLine = function(id_) {
				var tmpLabel = id_.toLocaleUpperCase();
				var tmpValue = self[id_].toLocaleUpperCase();
				
				var lineContainer = $("<div>")
					.addClass("lineContainer")
					.appendTo(infoContainer)
				;
				
				var lineContent = $("<div>")
					.addClass("lineContent")
					.appendTo(lineContainer)
				;
				
				var lineLabel = $("<p>")
					.addClass("lineLabel")
					.attr("title", tmpLabel)
					.html(tmpLabel)
					.appendTo(lineContent)
				;
				
				var lineValue = $("<p>")
					.addClass("lineValue")
					.attr("title", tmpValue)
					.appendTo(lineContent)
				;
				
				var finalText = RichText.formateText(tmpValue);
				displayProgressiveText({
					"intervalDuration": 500/finalText.length,
					"container": lineValue,
					"text": finalText
				});
			}
			
			addInfoLine("name");
			addInfoLine("age");
			addInfoLine("date of birth");
			addInfoLine("specie");
			
			var descriptionContainer = $("<div>")
				.addClass("descriptionContainer")
				.appendTo(infoContainer)
			;
			
			var descriptionContent = $("<div>")
				.addClass("descriptionContent")
				.appendTo(descriptionContainer)
			;
			
			var descriptionParagraphes = [];
			
			self.relatedImportedTexts.description.forEach(function(descriptionParagraph_) {
				var tmpDescriptionParagraphElement = $("<p>")
					.addClass("description_paragraph")
					.html(RichText.formateText(descriptionParagraph_))
				;
				
				descriptionParagraphes.push(tmpDescriptionParagraphElement[0].outerHTML);
			});
			
			var tmpDescriptionText = descriptionParagraphes.join("");
			displayProgressiveText({
				"delayDuration": 200,
				"intervalDuration": 1000 / tmpDescriptionText.length,
				"container": descriptionContent,
				"text": tmpDescriptionText,
				"chunkSizeLimits": [10, 20],
			});
			
			
			var illustrationContainer = $("<div>")
				.addClass("illustrationContainer")
				.appendTo(tmpComputerScreen.content)
			;
			
			var illustrationContent = $("<div>")
				.addClass("illustrationContent")
				.appendTo(illustrationContainer)
			;
			
			var idElement = $("<p>")
				.addClass("idElement")
				.html(self.id)
				.appendTo(illustrationContent)
			;
			
			var descriptionIllustration = new DynamicImage({
				"sources": self.relatedImportedImages.main,
			});
			descriptionIllustration.show(illustrationContent);
			dynamicImages.push(descriptionIllustration);
		};
		
		tmpComputerScreen.addEventListener(ComputerScreen.EventTypes.APPEAR, function() {
			dynamicImages.forEach(function(dynamicImage_){
				dynamicImage_.play();
			});
		});
		
		return tmpComputerScreen;
	}
	
	var createTimePeriodsScreen = function() {
		var tmpComputerScreen = new ComputerScreen({
			"name": "detail"
		});
		
		var dynamicImages;
		var timePeriodAnimations;
		tmpComputerScreen.init = function() {
			dynamicImages = [];
			timePeriodAnimations = [];
			
			var activeTimePeriodCssClass = "timePeriod_active";
			var timePeriodCssClasses_appearing = "timePeriod_appearing";
			var timePeriodCssClasses_visible = "timePeriod_visible";
			var timePeriodCssClasses_disappearing = "timePeriod_disappearing";
			
			var timePeriodContainer = $("<div>")
				.attr("id", "timePeriod_container")
				.appendTo(tmpComputerScreen.content)
			;
			
			var timePeriodChoiceContainer = $("<div>")
				.attr("id", "timePeriod_choices")
				.appendTo(timePeriodContainer)
			;
			
			var timePeriodInfoContainer = $("<div>")
				.addClass("timePeriod_info_container")
				.appendTo(timePeriodContainer)
			;
			
			timePeriodInfoContainer[0].addEventListener("animationend", function(event_) {
				console.log(event_);
				if(event_.animationName == timePeriodCssClasses_appearing) {
					timePeriodInfoContainer
						.removeClass(timePeriodCssClasses_appearing)
						.addClass(timePeriodCssClasses_visible)
					;
				} else {
					timePeriodInfoContainer
						.removeClass(timePeriodCssClasses_disappearing)
						.addClass(timePeriodCssClasses_appearing)
					;
				}
			})
			
			var timePeriodInfoContent = $("<div>")
				.addClass("timePeriod_info_content")
				.appendTo(timePeriodInfoContainer)
			;
			
			var timePeriodDescriptionContainer = $("<div>")
				.attr("id", "timePeriod_description_container")
				.appendTo(timePeriodInfoContent)
			;
			
			var timePeriodDescriptionWrapper = $("<div>")
				.attr("id", "timePeriod_description_wrapper")
				.appendTo(timePeriodDescriptionContainer)
			;
			
			var timePeriodDescriptionContent = $("<div>")
				.attr("id", "timePeriod_description_content")
				.appendTo(timePeriodDescriptionWrapper)
			;
			
			var timePeriodIllustration = $("<div>")
				.attr("id", "timePeriod_illustration")
				.appendTo(timePeriodInfoContent)
			;
			
			var createTimePeriodElement = function(timePeriodId_) {
				var timePeriodImages = self.relatedImportedImages.timePeriods[timePeriodId_];
				
				var animationContainer = $("<div>")
					.addClass("timePeriod_animation_container")
				;
				
				var animationContent = $("<div>")
					.addClass("timePeriod_animation_content")
					.appendTo(animationContainer)
				;
				
				var animationDynamicImage = new DynamicImage({
					"sources": timePeriodImages.animation,
					"intervalDuration": 500
				});
				animationDynamicImage.show(animationContent);
				animationDynamicImage.pause();
				timePeriodAnimations.push(animationDynamicImage);
				
				var descriptionParagraphes = [];
				var timePeriodText = self.relatedImportedTexts.timePeriods[timePeriodId_];
				
				timePeriodText.forEach(function(descriptionParagraph_) {
					var tmpDescriptionParagraphElement = $("<p>")
						.addClass("description_paragraph")
						.html(RichText.formateText(descriptionParagraph_))
					;
					
					descriptionParagraphes.push(tmpDescriptionParagraphElement[0].outerHTML);
				});
				
				var tmpDescriptionText = descriptionParagraphes.join("");
				
				var illustrationDynamicImage = new DynamicImage({
					"sources": timePeriodImages.illustration,
				});
				illustrationDynamicImage.pause();
				dynamicImages.push(illustrationDynamicImage);
				
				$(animationContainer).on("mouseenter", function(event_){
					if($(event_.currentTarget).hasClass(activeTimePeriodCssClass) == false) {
						audioSystem.play(importedSounds.mouse_hover);
						
						timePeriodAnimations.forEach(function(timePeriodAnimation_) {
							timePeriodAnimation_.pause();
						});
						$("." + activeTimePeriodCssClass).removeClass(activeTimePeriodCssClass);
						$(animationContainer).addClass(activeTimePeriodCssClass);
						animationDynamicImage.play();
						
						var animationEndHandler = function() {
							$(timePeriodDescriptionContent).empty();
							$(timePeriodIllustration).empty();
							displayProgressiveText({
								"delayDuration": 200,
								"intervalDuration": 1000 / tmpDescriptionText.length,
								"container": timePeriodDescriptionContent,
								"text": tmpDescriptionText,
								"chunkSizeLimits": [10, 20],
							});
							
							illustrationDynamicImage.show(timePeriodIllustration);
							
						timePeriodInfoContainer[0].removeEventListener("animationend", animationEndHandler);
						}
						
						timePeriodInfoContainer[0].addEventListener("animationend", animationEndHandler);
						
						$(timePeriodInfoContainer)
							.removeClass(timePeriodCssClasses_visible)
							.addClass(timePeriodCssClasses_disappearing)
						;
						
					}
				})
				
				return animationContainer;
			}
			
			timePeriodIds.forEach(function(timePeriodId_){
				var timePeriodElement = createTimePeriodElement(timePeriodId_);
				$(timePeriodElement).appendTo(timePeriodChoiceContainer);
			});
		};
		
		return tmpComputerScreen;
	}
	
	var createGalleryScreen = function() {
		var tmpComputerScreen = new ComputerScreen({
			"name": "gallery"
		});
		
		var dynamicImages = [];
		tmpComputerScreen.init = function() {
			var galleryContainer = $("<div>")
				.attr("id", "gallery_container")
				.appendTo(tmpComputerScreen.content)
			;
			
			var galleryContent = $("<div>")
				.attr("id", "gallery_content")
				.appendTo(galleryContainer)
			;
			
			Object.keys(self.relatedImportedImages.gallery).forEach(function(galleryImageId_) {
				var imageSources = self.relatedImportedImages.gallery[galleryImageId_];
				var galleryImageContainer = $("<div>")
					.addClass("gallery_image")
					.appendTo(galleryContent)
				;
				var tmpImage = new DynamicImage({
					"sources": imageSources.cropped,
				});
				tmpImage.show(galleryImageContainer);
				dynamicImages.push(tmpImage);
				
				$(tmpImage.imageElement).on("mouseenter", function(event_) {
					audioSystem.play(importedSounds.mouse_hover);
				});
				
				$(tmpImage.imageElement).on("click", function(event_) {
					audioSystem.play(importedSounds.mouse_click);
					var tmpModal = tmpComputerScreen.createModal();
					
					var modalBody = $(tmpModal.element).find("." + Modal.cssClasses.body)[0];
					tmpModal.setTitle(self.relatedImportedTexts.gallery[galleryImageId_]);
					
					var tmpImage = new DynamicImage({
						"sources": imageSources.full,
					});
					tmpImage.show(modalBody);
					dynamicImages.push(tmpImage);
					
					tmpModal.show();
				})
			});
		};
		
		tmpComputerScreen.addEventListener(ComputerScreen.EventTypes.APPEAR, function() {
			dynamicImages.forEach(function(dynamicImage_){
				dynamicImage_.play();
			});
		});
		
		tmpComputerScreen.addEventListener(ComputerScreen.EventTypes.DISAPPEARED, function() {
			dynamicImages.forEach(function(dynamicImage_){
				dynamicImage_.pause();
			});
		});
		
		return tmpComputerScreen;
	}
	
	this.addScreen(createGeneralScreen());
	this.addScreen(createTimePeriodsScreen());
	this.addScreen(createGalleryScreen());
}