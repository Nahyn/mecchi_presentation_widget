var HelpText = function HelpText(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.target;
	options_.element = HelpText.createHelpText();
	
	EventTargetableObject.call(this, options_);
	
	this.addEventListener("animationend", function(event_){
		var target = $(event_.target);
		
		switch(true) {
			case ((event_.animationName == "helpText_appearing") && target.hasClass(HelpText.cssClasses.container)) :
				$(self.element).removeClass(Modal.cssClasses.appearing);
				break;
				
			case ((event_.animationName == "helpText_disappearing") && target.hasClass(HelpText.cssClasses.container)) :
				$(self.element).remove();
				break;
		}
	});
	
	window.addEventListener(window.EventTypes.CHILDLIST_CHANGED, function(event_){
		var mutation = event_.detail.mutation;
		var tmpNodes = [];
		
		mutation.addedNodes.forEach(function(tmpNode_) {
			tmpNodes.push(tmpNode_);
		});
		mutation.removedNodes.forEach(function(tmpNode_) {
			tmpNodes.push(tmpNode_);
		});
		
		tmpNodes.forEach(function(removeNode_) {
			var currentElement = self.target;
			while((currentElement = $(currentElement).parent()[0]) != undefined && self.interval != undefined) {
				if(removeNode_ == currentElement) {
					$(self.element).remove();
				}
			}
		})
	});
}
HelpText.prototype = Object.create(EventTargetableObject.prototype);

HelpText.prototype.show = function() {
	$(this.element).addClass(HelpText.cssClasses.visible);
	$(this.element).addClass(HelpText.cssClasses.appearing);
}

HelpText.prototype.hide = function() {
	$(this.element).removeClass(HelpText.cssClasses.visible);
	$(this.element).addClass(HelpText.cssClasses.disappearing);
	clearInterval(this.interval);
}

HelpText.prototype.setPosition = function(targetElement_) {
	var self = this;
	
	var tmpTarget = $(targetElement_);
	var helpTextPositionner = $(this.element);
		
	Object.keys(HelpText.cssClasses.position).forEach(function(cssClass_){
		helpTextPositionner.removeClass(cssClass_);
	}, this);
	
	var targetInfo = {
		"top": tmpTarget.offset().top - $(mainContainer).offset().top,
		"left": tmpTarget.offset().left - $(mainContainer).offset().left,
		"width": tmpTarget.width(),
		"height": tmpTarget.height(),
	}
	
	var targetCenter = [
		targetInfo.left + targetInfo.width/2,
		targetInfo.top + targetInfo.height/2,
	];
	
	var tmpCssClass;
	if(targetCenter[0] < $(HelpText.container).width()/2){
		tmpCssClass = HelpText.cssClasses.position.right;
	} else {
		tmpCssClass = HelpText.cssClasses.position.left;
	}
	helpTextPositionner.addClass(tmpCssClass);
	
	if(targetCenter[1] < $(HelpText.container).height()/2){
		tmpCssClass = HelpText.cssClasses.position.bottom;
	} else {
		tmpCssClass = HelpText.cssClasses.position.top;
	}
	helpTextPositionner.addClass(tmpCssClass);
	
	helpTextPositionner.css(targetInfo);
	helpTextPositionner.appendTo(HelpText.container);
}

HelpText.prototype.setText = function(text_) {
	$(this.element).find("." + HelpText.cssClasses.body).html(text_);
}

HelpText.cssClasses = {};

HelpText.cssClasses.appearing = "helpText_appearing";
HelpText.cssClasses.visible = "helpText_visible";
HelpText.cssClasses.disappearing = "helpText_disappearing";

HelpText.cssClasses.position = {};
HelpText.cssClasses.position.left = "helpText_position_left";
HelpText.cssClasses.position.right = "helpText_position_right";
HelpText.cssClasses.position.top = "helpText_position_top";
HelpText.cssClasses.position.bottom = "helpText_position_bottom";

HelpText.cssClasses.page_container = "helpText_page_container";

HelpText.cssClasses.positionner = "helpText_positionner";
HelpText.cssClasses.container = "helpText_container";
HelpText.cssClasses.content = "helpText_content";
HelpText.cssClasses.term = "helpText_term";
HelpText.cssClasses.body = "helpText_body";

HelpText.positionLimits = {};
HelpText.positionLimits.left = [
	HelpText.cssClasses.position.right,
	HelpText.cssClasses.position.left,
];
HelpText.positionLimits.top = [
	HelpText.cssClasses.position.bottom,
	HelpText.cssClasses.position.top,
];

HelpText.createHelpText = function() {
	var helpTextPositionner = $("<div>")
		.addClass(HelpText.cssClasses.positionner)
	;
	
	var helpTextContainer = $("<div>")
		.addClass(HelpText.cssClasses.container)
		.appendTo(helpTextPositionner)
	;
	
	var helpTextContent = $("<div>")
		.addClass(HelpText.cssClasses.content)
		.appendTo(helpTextContainer)
	;
	
	var helpTextBody = $("<p>")
		.addClass(HelpText.cssClasses.body)
		.appendTo(helpTextContent)
	;
	
	return helpTextPositionner[0];
}

HelpText.container = $("<div>")
	.addClass(HelpText.cssClasses.page_container)[0]
;

addEventTypes(HelpText, [
	"APPEAR",
	"APPEARED",
	
	"DISAPPEAR",
	"DISAPPEARED",
]);