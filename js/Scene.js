var Scene = function Scene(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.id = "";
	this.element = $("<div>")[0];
	this.content = $("<div>")[0];
	this.relatedImportedImages = {};
	
	EventTargetableObject.call(this, options_);
	
	$(this.element).addClass(Scene.cssClasses.container);
	$(this.content).addClass(Scene.cssClasses.content);
	if($(this.content).parent().length == 0) {
		$(this.content).appendTo(this.element);
	}
	
	this.addEventListener("animationstart", function(event_){
		if(event_.animationName == "appear"){
			self.callEvent(Scene.EventTypes.APPEAR);
			callEvent(Scene.EventTypes.APPEAR, window, {"scene": self});
		} else if (event_.animationName == "disappear"){
			self.callEvent(Scene.EventTypes.DISAPPEAR);
			callEvent(Scene.EventTypes.DISAPPEAR, window, {"scene": self});
		} 
	});
	this.addEventListener("animationend", function(event_){
		if(event_.animationName == "appear"){
			self.callEvent(Scene.EventTypes.APPEARED);
			callEvent(Scene.EventTypes.APPEARED, window, {"scene": self});
		} else if (event_.animationName == "disappear"){
			self.callEvent(Scene.EventTypes.DISAPPEARED);
			callEvent(Scene.EventTypes.DISAPPEARED, window, {"scene": self});
		}
	});
	
	this.addEventListener(Scene.EventTypes.APPEARED, function(event_) {
		$(self.element).parent().removeClass(Scene.cssClasses.appearing);
	});
	
	this.addEventListener(Scene.EventTypes.DISAPPEARED, function(event_) {
		var tmpParent = $(self.element).parent();
		self.clear();
		tmpParent.removeClass(Scene.cssClasses.disappearing);
		$(self.element).remove();
		
		nextScene();
	});
}
Scene.prototype = Object.create(EventTargetableObject.prototype);

Scene.cssClasses = {};
Scene.cssClasses.container = "scene_container";
Scene.cssClasses.content = "scene_content";
Scene.cssClasses.appearing = "scene_appearing";
Scene.cssClasses.disappearing = "scene_disappearing";

Scene.prototype.clear = function() {
	$(this.content).empty();
};

Scene.prototype.show = function(targetContainer_) {
	this.init();
	$(targetContainer_).addClass(Scene.cssClasses.appearing);
	$(this.element).appendTo(targetContainer_);
}

Scene.prototype.hide = function() {
	$(this.element).parent().addClass(Scene.cssClasses.disappearing);
}

Scene.prototype.createBackgroundElement = function() {
	var backgroundElement = $("<img>");
	backgroundElement.addClass("background");
	backgroundElement.attr("src", this.relatedImportedImages.background);
	backgroundElement.appendTo(this.content);
}

Scene.prototype.init = function() {
};

addEventTypes(Scene, [
	"APPEAR",
	"APPEARED",
	
	"DISAPPEAR",
	"DISAPPEARED",
]);