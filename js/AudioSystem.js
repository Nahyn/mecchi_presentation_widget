var AudioSystem = function AudioSystem(options_) {
	var self = this;
	
	this.muted = false;
	this.volume = 50;
	
	this.audioObjects = [];
	this.volumeControlContainer = AudioSystem.createVolumeControl();
	
	EventTargetableObject.call(this, options_);
	
	var muteButton = $("." + AudioSystem.cssClasses.muteButton, this.volumeControlContainer)[0];
	muteButton.addEventListener("click", function(event_) {
		self.muted = !self.muted;
		
		self.refreshAudioParameters();
		self.refreshDisplay();
	});
	
	var volumeContainer = $("." + AudioSystem.cssClasses.volumeLevel.content, this.volumeControlContainer)[0];
	volumeContainer.addEventListener("click", function(event_) {
		var volumeContainerOffset = $(volumeContainer).offset();
		var volumeContainerWidth = $(volumeContainer).width();
		
		var horizontalOffset = event_.pageX - volumeContainerOffset.left;
		
		var newVolume = 100 * horizontalOffset / volumeContainerWidth;
		self.volume = newVolume;
		
		self.refreshAudioParameters();
		self.refreshDisplay();
	});
	
	this.refreshDisplay();
}
AudioSystem.prototype = Object.create(EventTargetableObject.prototype);

AudioSystem.prototype.play = function(url_, parameters_) {
	var self = this;
	
	var tmpAudio = new Audio();
	this.audioObjects.push(tmpAudio);
	
	var onPausedOrEnded = function(event_){
		var audioIndex = self.audioObjects.indexOf(tmpAudio);
		self.audioObjects.splice(audioIndex, 1);
		tmpAudio.remove();
	}
	
	tmpAudio.addEventListener("pause", onPausedOrEnded);
	tmpAudio.addEventListener("ended", onPausedOrEnded);
	
	tmpAudio.addEventListener("canplaythrough", function(event_){
		tmpAudio.volume = self.volume / 100;
		tmpAudio.muted = self.muted;
		
		tmpAudio.play();
	});
	
	tmpAudio.src = url_;
	return tmpAudio;
};

AudioSystem.prototype.refreshAudioParameters = function(){
	var tmpVolume = this.volume / 100;
	var tmpMuted = this.muted;
	
	this.audioObjects.forEach(function(audio_){
		audio_.volume = tmpVolume;
		audio_.muted = tmpMuted;
	});
}

AudioSystem.prototype.refreshDisplay = function(){
	var muteImage = $("." + AudioSystem.cssClasses.muteButton, this.volumeControlContainer);
	var volumeForegroundContainer = $("." + AudioSystem.cssClasses.volumeLevel.foregroundContainer, this.volumeControlContainer);
	
	var muteSrc = importedImages.others.volume_on;
	
	if(this.muted == true){
		muteSrc = importedImages.others.volume_off;
	}
	
	muteImage.attr("src", muteSrc);
	
	var volumeWidth = Math.round(this.volume) + "%";
	volumeForegroundContainer.css("width", volumeWidth);
}

AudioSystem.cssClasses = {};
AudioSystem.cssClasses.controlContainer = "audioSystem-container";
AudioSystem.cssClasses.controlContent = "audioSystem-content";
AudioSystem.cssClasses.muteButton = "audioSystem-muteButton";

AudioSystem.cssClasses.volumeLevel = {};
AudioSystem.cssClasses.volumeLevel.container = "audioSystem-volume-container";
AudioSystem.cssClasses.volumeLevel.content = "audioSystem-volume-content";
AudioSystem.cssClasses.volumeLevel.background = "audioSystem-volume-background";
AudioSystem.cssClasses.volumeLevel.foregroundContainer = "audioSystem-volume-foregroundContainer";
AudioSystem.cssClasses.volumeLevel.foreground = "audioSystem-volume-foreground";

AudioSystem.createVolumeControl = function() {
	var container = $("<div>")
		.addClass(AudioSystem.cssClasses.controlContainer)
	;
	
	var content = $("<div>")
		.addClass(AudioSystem.cssClasses.controlContent)
		.appendTo(container);
	;
	
	var muteButton = $("<img>")
		.addClass(AudioSystem.cssClasses.muteButton)
		.addClass("btn")
		.attr("src", importedImages.others.volume_on)
		.appendTo(content);
	;
	
	var volumeContainer = $("<div>")
		.addClass(AudioSystem.cssClasses.volumeLevel.container)
		.appendTo(content);
	;
	
	var volumeContent = $("<div>")
		.addClass(AudioSystem.cssClasses.volumeLevel.content)
		.addClass("btn")
		.appendTo(volumeContainer);
	;
	
	var volumeBackground = $("<img>")
		.addClass(AudioSystem.cssClasses.volumeLevel.background)
		.attr("src", importedImages.others.volume_background)
		.appendTo(volumeContent);
	;
	
	var volumeForegroundContainer = $("<div>")
		.addClass(AudioSystem.cssClasses.volumeLevel.foregroundContainer)
		.appendTo(volumeContent);
	;
	var volumeForeground = $("<img>")
		.addClass(AudioSystem.cssClasses.volumeLevel.foreground)
		.attr("src", importedImages.others.volume_foreground)
		.appendTo(volumeForegroundContainer);
	;
	
	
	return container[0];
};