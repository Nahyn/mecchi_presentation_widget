var SelectableSubject = function SelectableSubject(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.id = "";
	this.screens = [];
	
	EventTargetableObject.call(this, options_);
}
SelectableSubject.prototype = Object.create(EventTargetableObject.prototype);

SelectableSubject.prototype.setContainer = function(container_) {
	container_.addEventListener("animationend", function(event_){
		switch(true) {
			case(event_.animationName == "computerScreen_appearing") : 
				break;
			case(event_.animationName == "computerScreen_disappearing") : 
				break;
		}
	});
	
	this.screenContainer = container_;
}

SelectableSubject.prototype.screenIndex = 0;
SelectableSubject.prototype.getCurrentScreen = function() {
	return this.screens[this.screenIndex];
}

SelectableSubject.prototype.showScreen = function(index_) {
	index_ = index_ || 0;
	if(index_ instanceof ComputerScreen){
		index_ = this.screens.indexOf(index_);
	}
	var self = this;
	
	index_ = (index_ + self.screens.length) % self.screens.length
	var currentScreen = this.getCurrentScreen();
	
	var proceedToScreen = function() {
		self.screens[index_].show(self.screenContainer);
		self.screenIndex = index_;
	}
	
	if(currentScreen.isVisible()){
		currentScreen.one(ComputerScreen.EventTypes.DISAPPEARED, function(event_){
			proceedToScreen(); 
		});
		
		currentScreen.hide();
	} else {
		proceedToScreen();
	}
	
}

SelectableSubject.prototype.hideScreen = function() {
	this.screens[this.screenIndex].hide();
}

SelectableSubject.prototype.nextScreen = function() {
	this.showScreen(this.screenIndex+1);
}

SelectableSubject.prototype.previousScreen = function() {
	this.showScreen(this.screenIndex-1);
}

SelectableSubject.prototype.addScreen = function(screen_) {
	var self = this;
	screen_.addEventListener(ComputerScreen.EventTypes.ACTIVATE, function(event_) {
		self.screens.forEach(function(tmpScreen_) {
			if(screen_ != tmpScreen_){
				tmpScreen_.deactivate();
			}
		})
	});
	
	this.screens.push(screen_);
}