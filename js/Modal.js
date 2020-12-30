var Modal = function Modal(options_) {
	options_ = options_ || {};
	var self = this;
	
	this.target;
	options_.element = Modal.createModal();
	
	EventTargetableObject.call(this, options_);
	
	$("." + Modal.cssClasses.background + ", ." + Modal.cssClasses.exit, this.element).on("click", function() {
		self.hide();
	})
	
	this.addEventListener("animationend", function(event_){
		var target = $(event_.target);
		
		switch(true) {
			case ((event_.animationName == "modal_appearing") && target.hasClass(Modal.cssClasses.content)) :
				$(self.element).removeClass(Modal.cssClasses.appearing);
				break;
				
			case ((event_.animationName == "modal_background_disappearing") && target.hasClass(Modal.cssClasses.background)) :
				$(self.element).remove();
				break;
		}
	});
}
Modal.prototype = Object.create(EventTargetableObject.prototype);

Modal.prototype.show = function() {
	$(this.element).addClass(Modal.cssClasses.visible);
	$(this.element).addClass(Modal.cssClasses.appearing);
}

Modal.prototype.hide = function() {
	$(this.element).removeClass(Modal.cssClasses.visible);
	$(this.element).addClass(Modal.cssClasses.disappearing);
}


Modal.prototype.setTitle = function(title_) {
	var titleElement = $(this.element).find("." + Modal.cssClasses.title);
	titleElement.html(title_);
}

Modal.prototype.setContent = function(content_) {
	var bodyElement = $(this.element).find("." + Modal.cssClasses.body);
	bodyElement.html(content_);
}


Modal.cssClasses = {};

Modal.cssClasses.appearing = "modal_appearing";
Modal.cssClasses.visible = "modal_visible";
Modal.cssClasses.disappearing = "modal_disappearing";

Modal.cssClasses.container = "modal_container";
Modal.cssClasses.background = "modal_background";
Modal.cssClasses.positionner = "modal_positionner";
Modal.cssClasses.content = "modal_content";
Modal.cssClasses.title = "modal_title";
Modal.cssClasses.exit = "modal_exit";
Modal.cssClasses.header = "modal_header";
Modal.cssClasses.body = "modal_body";

Modal.createModal = function() {
	var modalContainer = $("<div>")
		.addClass(Modal.cssClasses.container)
	;
	
	var modalBackground = $("<div>")
		.addClass(Modal.cssClasses.background)
		.appendTo(modalContainer)
	;
	
	var modalPositionner = $("<div>")
		.addClass(Modal.cssClasses.positionner)
		.appendTo(modalContainer)
	;
	
	var modalContent = $("<div>")
		.addClass(Modal.cssClasses.content)
		.appendTo(modalPositionner)
	;
	
	var modalHeader = $("<div>")
		.addClass(Modal.cssClasses.header)
		.appendTo(modalContent)
	;
	
	var modalTitle = $("<p>")
		.addClass(Modal.cssClasses.title)
		.appendTo(modalHeader)
	;
	
	var modalExit = $("<span>")
		.addClass(Modal.cssClasses.exit)
		.html("x")
		.appendTo(modalHeader)
	;
	
	var modalBody = $("<div>")
		.addClass(Modal.cssClasses.body)
		.appendTo(modalContent)
	;
	
	return modalContainer[0];
}

addEventTypes(Modal, [
	"APPEAR",
	"APPEARED",
	
	"DISAPPEAR",
	"DISAPPEARED",
]);