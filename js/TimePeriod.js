/*
	options :
		(String) periodId
		(String) characterId
*/
function TimePeriod(options_) {
	options_ = options_ || {};
	
	this.periodId = "";
	this.characterId = ""
	
	Object.keys(options_).forEach(function(key_) {
		this[key_] = options_[key_];
	}, this);
	
	this.relatedTexts = importedTexts.characters[this.characterId].timePeriods[this.periodId];
	this.relatedImages = importedImages.characters[this.characterId].timePeriods[this.periodId];
	
	this.currentAnimationFrame = 0;
}

TimePeriod.cssClasses = {};

TimePeriod.cssClasses.container = "timeperiod_container";
TimePeriod.cssClasses.wrapper = "timeperiod_wrapper";
TimePeriod.cssClasses.content = "timeperiod_content";

TimePeriod.cssClasses.animation = {};
TimePeriod.cssClasses.animation.container = "timeperiod_animation_container";
TimePeriod.cssClasses.animation.content = "timeperiod_animation_content";

TimePeriod.cssClasses.description = {};
TimePeriod.cssClasses.description.container = "timeperiod_description_container";
TimePeriod.cssClasses.description.content = "timeperiod_description_content";

TimePeriod.cssClasses.illustration = {};
TimePeriod.cssClasses.illustration.container = "timeperiod_illustration_container";
TimePeriod.cssClasses.illustration.content = "timeperiod_illustration_content";

TimePeriod.prototype.getIllustration = function() {
	return this.relatedImages.illustration
}

TimePeriod.prototype.createElement = function() {
	
	return this.relatedImages.illustration
}