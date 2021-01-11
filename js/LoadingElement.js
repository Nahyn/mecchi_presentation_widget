document.getFullscreenElement = function(){
	return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.body;
}

// == Loading with message on element ==============================================================

// OVERLAY
	// CONTAINER
		// SPINNER_BORDER
			// SPINNER_SIZE
		// MESSAGE

LoadingElement = {
	"overlayClass": "load-overlay",
	"containerClass": "load-container",
	"spinnerContainerClass": "load-spinnerContainer",
	"spinnerBorderClass": "load-spinnerBorder",
	"spinnerSizeClass": "load-spinnerSize",
	"messageContainerClass": "load-messageContainer",
	"messageClass": "load-message",
};


LoadingElement.set = function(msg_, target_){
	msg_ = msg_ || "";
	
	if(target_ == undefined){
		target_ = $( document.getFullscreenElement() );
	} else {
		target_ = $($(target_)[0]);
	}
	
	var overlayElement = $($(target_).children("." + LoadingElement.overlayClass)[0]);
	var messageElement;
	
	if(overlayElement.length == 0) {
		overlayElement = $("<div>")
			.addClass(LoadingElement.overlayClass)
			.appendTo(target_)
		;
		
		var loaderContainer = $("<div>")
			.addClass(LoadingElement.containerClass)
			.appendTo(overlayElement)
		;
		
		var spinnerContainerElement = $("<div>")
			.addClass(LoadingElement.spinnerContainerClass)
			.appendTo(loaderContainer)
		;
		
		var spinnerBorderElement = $("<div>")
			.addClass(LoadingElement.spinnerBorderClass)
			.appendTo(spinnerContainerElement)
		;
		
		var spinnerSizeElement = $("<div>")
			.addClass(LoadingElement.spinnerSizeClass)
			.appendTo(spinnerBorderElement)
		;
	}
	
	messageElement = $("." + LoadingElement.containerClass + " ." + LoadingElement.messageContainerClass, overlayElement);
	
	if(messageElement.length == 0){
		messageElement = $("<div>")
			.addClass(LoadingElement.messageContainerClass)
			.prependTo($("." + LoadingElement.containerClass, overlayElement))
		;
	}
	
	var showMessage;
	showMessage	= function(text_, element_){
		switch(true) {
			case (typeof text_ == "string"):
				element_.append(
					$("<p>")
						.addClass(LoadingElement.messageClass)
						.attr("title", text_)
						.html(text_)
				);
				break;
				
			case (text_ instanceof Array):
				var msgContainer = $("<div>")
					.addClass(LoadingElement.messageClass)
					.appendTo(element_)
				;
				
				text_.forEach(function(currentMessage_){
					showMessage(currentMessage_, msgContainer);
				})
				break;
				
			default:
				text_ = JSON.stringify(text_);
				
				element_.append(
					$("<p>")
						.addClass(LoadingElement.messageClass)
						.attr("title", text_)
						.html(text_)
				);
		}
	};
	
	if(msg_ == ""){
		messageElement.remove();
	} else {
		messageElement.html("");
		showMessage(msg_, messageElement);
	}
	
	return overlayElement;
}


LoadingElement.remove = function(targetElement_){
	if(targetElement_ == undefined){
		targetElement_ = $( document.getFullscreenElement() );
	} else {
		targetElement_ = $($(targetElement_)[0]);
	}
	
	var overlayElement = $(targetElement_).children("."+LoadingElement.overlayClass)[0]
	if(overlayElement != undefined){
		$(overlayElement).remove();
	}
}