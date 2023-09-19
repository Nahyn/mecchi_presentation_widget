/** Définition de la classe EventTargetableObject
 *	Permet l'émulation d'évènements sur des objets Javascript (ie MaClasseHeritee.addEventListener("click", function(){ console.log("Do interesting stuff here !") }) )
 *	@param {HTMLElement} element_ - HTMLElement lié à l'objet sur lequel les events seront appelés
**/
EventTargetableObject = function EventTargetableObject(element_){
	var self = this;
	
	var _eventElement = element_ || document.createElement("div");
	
	this.addEventListener = function(eventType_, callback_, this_){
		this_ = this_ || this;
		if(eventType_ != undefined){
			if(typeof eventType_ == "string" || eventType_ instanceof String){
				eventType_ = eventType_.split(" ");
			}
		
			eventType_.forEach(function(tmpEventType_) {
				if (tmpEventType_ != undefined) {
					_eventElement.addEventListener(tmpEventType_, callback_); 
				} else {
					console.warn("Tried to addEventListener with an undefined event type on the object : ");
					console.warn(this);
				}
			});
		}
	};
	this.on = this.addEventListener;

	this.removeEventListener = function(eventType_, callback_){ 
		_eventElement.removeEventListener(eventType_, callback_); 
	};

	this.callEvent = function(eventType_, data_){ 
		if(data_ === undefined){
			data_ = {};
		}
		
		var tmpData = getObjectFusion(data_, { "eventTargetableObject" : self });
		
		callEvent(eventType_, _eventElement, tmpData);
	};

	this.one = function(eventType_, callback_){ 
		var tmpCallback;
		tmpCallback = function(event_){ 
			callback_(event_);
			_eventElement.removeEventListener(eventType_, tmpCallback)
		}
		
		_eventElement.addEventListener(eventType_, tmpCallback); 
	};
};


/**	Appel d'un évènement sur l'élément ciblé
 *	@param {string} eventType_ - Nom de l'évènement qui sera appelé
 *	@param {HTMLElement} target_ - Cible sur laquelle l'évènement sera déclenché. Par défaut, la fenêtre est ciblée ("window")
 *	@param {Object} data_ - Donnée supplémentaires accessibles depuis la variable "detail" de l'event
**/
function callEvent(eventType_, target_ = window, data_ = null) {
	target_.dispatchEvent(new CustomEvent(eventType_, {"cancelable": true, "detail": data_}));
}


/** Ajout de nouveaux type d'évènements au constructeur d'un objet
 *	@param {constructor} objectType_ - Classe à laquelle on souhaite rajouter des events
**/
function addEventTypes(objectType_, eventType_){
	if(eventType_ instanceof Array){
		eventType_.forEach(function(currentEventType_){
			addEventTypes(objectType_, currentEventType_);
		});
	} else {
		if(objectType_.EventTypes == undefined){
			objectType_.EventTypes = {}
		}
		
		if(objectType_.EventTypes[eventType_.toUpperCase()] == undefined){
			var eventName = "SigImg_";
			
			if(objectType_.name){
				eventName += objectType_.name.replace(/ /g, "_")+"_";
			}
			
			eventName += eventType_.toLowerCase();
			 
			objectType_.EventTypes[eventType_.toUpperCase()] = eventName
		}
	}
}
