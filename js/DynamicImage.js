var DynamicImage = function DynamicImage(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.sources = [];
	this.intervalDuration = 1000;
	this.increment = 0;
	this.text;
	
	EventTargetableObject.call(self, options_);
	
	if(typeof(self.sources) == "string") {
		self.sources = [self.sources];
	}
	
	var imgLoader = $("<img>")
		.css("display", "none")
	;
		
	$(this.element).addClass(DynamicImage.cssClasses.container);
	
	this.wrapperElement = $("<div>")
		.addClass(DynamicImage.cssClasses.wrapper)
		.appendTo(this.element)
	;
	this.imageElement = $("<img>")
		.addClass(DynamicImage.cssClasses.img)
		.appendTo(this.wrapperElement)
	;
	
	this.textContainer = $("<div>")
		.addClass(DynamicImage.cssClasses.text.container)
	;
	
	this.textContent = $("<div>")
		.addClass(DynamicImage.cssClasses.text.content)
		.appendTo(this.textContainer)
	;
	
	this.textElement = $("<p>")
		.addClass(DynamicImage.cssClasses.text.body)
		.appendTo(this.textContent)
	;
	
	var proceedOnceLoaded = function() {
		imgLoader.remove();
		if(self.text != undefined){
			self.textContainer.appendTo(self.wrapperElement);
			self.textElement.html(self.text);
		}
		
		window.addEventListener(window.EventTypes.CHILDLIST_CHANGED, function(event_){
			var mutation = event_.detail.mutation;
			
			for(var i=0 ; i < mutation.removedNodes.length && self.interval; i++) {
				removeNode_ = mutation.removedNodes[i];
				
				var currentElement = self.element;
				var currentParent;
				
				while((currentParent = $(currentElement).parent()[0]) != undefined && self.interval != undefined) {
					if(removeNode_ == currentParent) {
						self.pause();
					}
					
					currentElement = currentParent;
				}
				
				if(currentParent == undefined && currentElement != document){
					self.pause();
				}
			}
		});
		
		self.initialize();
	};
	
	var loadedImgCount = 0;
	var imageToLoad = this.sources.length;
	
	imgLoader[0].onload = function(event_) {
		loadedImgCount = loadedImgCount+1;
		
		if(loadedImgCount == self.sources.length){
			proceedOnceLoaded();
		} else {
			imgLoader.attr("src", self.sources[loadedImgCount]);
		}
	};
	
	imgLoader[0].onerror = function(event_) {
		self.sources = importedImages.computer.media_unavailable;
		self.intervalDuration = 200;
		self.text = "media unavailable";
			
		proceedOnceLoaded();
	};
	
	imgLoader.attr("src", self.sources[loadedImgCount]);
	$(mainContainer).append(imgLoader);
}
DynamicImage.prototype = Object.create(EventTargetableObject.prototype);

DynamicImage.cssClasses = {};
DynamicImage.cssClasses.container = "dynamicImage_container";
DynamicImage.cssClasses.wrapper = "dynamicImage_wrapper";
DynamicImage.cssClasses.img = "dynamicImage_image";
DynamicImage.cssClasses.hidden = "dynamicImage_hidden";

DynamicImage.cssClasses.text = {};
DynamicImage.cssClasses.text.container = "dynamicImage_text_container";
DynamicImage.cssClasses.text.content = "dynamicImage_text_content";
DynamicImage.cssClasses.text.body = "dynamicImage_text";

DynamicImage.prototype.interval = undefined;
DynamicImage.prototype.show = function(targetElement_) {
	var tmpImg = $("." + DynamicImage.cssClasses.img);
	
	$(targetElement_).append(this.element);
	this.play();
}

DynamicImage.prototype.play = function(targetElement_) {
	var self = this;
	
	if(this.interval != undefined){
		clearInterval(this.interval);
	}
	
	if(this.sources.length > 1) {
		this.interval = setInterval(function() {
			self.increment = (self.increment + 1) % self.sources.length;
			$(self.imageElement).attr("src", self.sources[self.increment]);
		}, this.intervalDuration);
	}
}

DynamicImage.prototype.pause = function(targetElement_) {
	clearInterval(this.interval);
	this.interval = undefined;
}

DynamicImage.prototype.initialize = function() {
	$(this.imageElement).attr("src", this.sources[this.increment]);
}