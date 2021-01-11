var ComputerScreen = function ComputerScreen(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.name = "";
	this.element = $("<div>")[0];
	this.content = $("<div>")[0];
	
	EventTargetableObject.call(this, options_);
	
	$(this.element).addClass(ComputerScreen.cssClasses.container);
	$(this.content).addClass(ComputerScreen.cssClasses.content);
	if($(this.content).parent().length == 0) {
		$(this.content).appendTo(this.element);
	}
	
	$(this.content).on("click", "." + Modal.cssClasses.exit, function(event_){
		self.clearModals();
	})
	
	this.addEventListener("animationstart", function(event_){
		if(event_.animationName == "computerScreen_appearing"){
			self.callEvent(ComputerScreen.EventTypes.APPEAR);
			callEvent(ComputerScreen.EventTypes.APPEAR, window, {"screen": self});
		} else if (event_.animationName == "computerScreen_disappearing"){
			self.callEvent(ComputerScreen.EventTypes.DISAPPEAR);
			callEvent(ComputerScreen.EventTypes.DISAPPEAR, window, {"screen": self});
		} 
	});
	this.addEventListener("animationend", function(event_){
		if(event_.animationName == "computerScreen_appearing"){
			self.callEvent(ComputerScreen.EventTypes.APPEARED);
			callEvent(ComputerScreen.EventTypes.APPEARED, window, {"screen": self});
		} else if (event_.animationName == "computerScreen_disappearing"){
			self.callEvent(ComputerScreen.EventTypes.DISAPPEARED);
			callEvent(ComputerScreen.EventTypes.DISAPPEARED, window, {"screen": self});
		}
	});
	
	this.addEventListener(ComputerScreen.EventTypes.APPEARED, function(event_) {
		$(self.element).removeClass(ComputerScreen.cssClasses.appearing);
		$(self.element).addClass(ComputerScreen.cssClasses.visible);
	});
	
	this.addEventListener(ComputerScreen.EventTypes.DISAPPEARED, function(event_) {
		self.clear();
		$(self.element).removeClass(ComputerScreen.cssClasses.disappearing);
		$(self.element).remove();
	});
}
ComputerScreen.prototype = Object.create(EventTargetableObject.prototype);

ComputerScreen.cssClasses = {};

ComputerScreen.cssClasses.appearing = "computerScreen_appearing";
ComputerScreen.cssClasses.visible = "computerScreen_visible";
ComputerScreen.cssClasses.disappearing = "computerScreen_disappearing";

ComputerScreen.cssClasses.container = "computerScreen_container";
ComputerScreen.cssClasses.content = "computerScreen_content";

ComputerScreen.cssClasses.tab = {};
ComputerScreen.cssClasses.tab.exit = "computerScreen_tab_exit";
ComputerScreen.cssClasses.tab.container = "computerScreen_tab_container btn";
ComputerScreen.cssClasses.tab.content = "computerScreen_tab_content";
ComputerScreen.cssClasses.tab.text = "computerScreen_tab_text";

ComputerScreen.cssClasses.tab.active = "btn_active";


ComputerScreen.prototype.tabElement;
ComputerScreen.prototype.getTabElement = function(){
	if(this.tabElement == undefined) {
		var tabElement = $("<div>")
			.addClass(ComputerScreen.cssClasses.tab.container)
		;
		
		var tabContent = $("<div>")
			.addClass(ComputerScreen.cssClasses.tab.content)
			.appendTo(tabElement)
		;
		
		var tabText = $("<p>")
			.addClass(ComputerScreen.cssClasses.tab.text)
			.html(this.name)
			.appendTo(tabContent)
		;
		
		this.tabElement = tabElement[0];
	}
	
	return this.tabElement;
};

ComputerScreen.prototype.activate = function(){
	var tabElement = this.getTabElement();
	
	$(tabElement).addClass(ComputerScreen.cssClasses.tab.active);
}

ComputerScreen.prototype.deactivate = function(){
	var tabElement = this.getTabElement();
	
	$(tabElement).removeClass(ComputerScreen.cssClasses.tab.active);
}

ComputerScreen.prototype.createModal = function(){
	var self = this;
	var tmpModal = new Modal();
	
	$(tmpModal.element).appendTo($(this.content).parents("#computer_container"));
	
	return tmpModal;
}

ComputerScreen.prototype.isVisible = function() {
	var tmpClasses = [
		ComputerScreen.cssClasses.appearing,
		ComputerScreen.cssClasses.visible,
		ComputerScreen.cssClasses.disappearing,
	];
	
	return tmpClasses.some(function(class_) {
		return $(this.element).hasClass(class_);
	}, this);
};

ComputerScreen.prototype.clear = function() {
	$(this.content).empty();
};

ComputerScreen.prototype.show = function(targetContainer_) {
	this.init();
	$(this.element).addClass(ComputerScreen.cssClasses.appearing);
	$(this.element).appendTo(targetContainer_);
	this.activate();
}

ComputerScreen.prototype.hide = function() {
	this.deactivate();
	$(this.element).removeClass(ComputerScreen.cssClasses.visible);
	$(this.element).addClass(ComputerScreen.cssClasses.disappearing);
}

ComputerScreen.prototype.init = function(character_) {
};

addEventTypes(ComputerScreen, [
	"APPEAR",
	"APPEARED",
	
	"DISAPPEAR",
	"DISAPPEARED",
]);