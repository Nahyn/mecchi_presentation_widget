console.warn("GRAB THE EventTargetableObject.js")
function EventTargetableObject(options_) {
	options_ = options_ || {};
	
	this.element = $("<div>")[0];
	
	Object.keys(options_).forEach(function(key_) {
		this[key_] = options_[key_];
	}, this);
}

EventTargetableObject.prototype.callEvent = function(eventName_, eventData_) {
	callEvent(eventName_, this.element, eventData_);
}

EventTargetableObject.prototype.addEventListener = function(eventName_, handler_) {
	this.element.addEventListener(eventName_, handler_);
}

EventTargetableObject.prototype.removeEventListener = function(eventName_, handler_) {
	this.element.removeEventListener(eventName_, handler_);
}

EventTargetableObject.prototype.one = function(eventName_, handler_) {
	var realHandler;
	var self = this;
	
	var targetElement = this.element;
	realHandler = function(event_) {
		handler_(event_);
		targetElement.removeEventListener(eventName_, realHandler);
	}
	
	targetElement.addEventListener(eventName_, realHandler);
}

/* ================ */

function callEvent(eventName_, eventTarget_, eventData_) {
	eventTarget_.dispatchEvent(new CustomEvent(eventName_, {"detail": eventData_}))
}

function addEventTypes(objectType_, eventName_) {
	if(eventName_ instanceof Array){
		eventName_.forEach(function(tmpEventName_) {
			addEventTypes(objectType_, tmpEventName_);
		})
	} else {
		if(objectType_.EventTypes == undefined){
			objectType_.EventTypes = {};
		}
		
		var objectTypeConstructor = objectType_.name;
		objectType_.EventTypes[eventName_.toLocaleUpperCase()] = (objectTypeConstructor + "_" + eventName_).toLocaleLowerCase();
	}
}