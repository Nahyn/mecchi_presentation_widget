var RichText = {};

RichText.definitions = importedDefinitions;

RichText.formateText = function(text_) {
	var resultText = "" + text_;
	var keyWords = Object.keys(RichText.definitions);
	
	keyWords.forEach(function(keyWord_) {
		var regexResults = RichText.getWordIndexes(keyWord_, resultText);
		
		regexResults.reverse().forEach(function(regexResult_, i_) {
			var wordOccurence = regexResult_[1];
			var wordIndex = regexResult_.index;
			
			resultText = resultText.substring(0, wordIndex) + RichText.createHelpAnchor(wordOccurence, keyWord_) + resultText.substring(wordIndex + wordOccurence.length);
		});
	});
	
	return resultText;
}

RichText.cssClasses = {};
RichText.cssClasses.helpAnchorClass = "richText_anchor";

RichText.createHelpAnchor = function(wordOccurence_, term_) {
	var result = $("<span>");
	result.addClass(RichText.cssClasses.helpAnchorClass);
	result.attr("data-definition", term_);
	result.html(wordOccurence_);
	
	return result[0].outerHTML;
}

RichText.getWordIndexes = function(word_, source_){
	var tmpRegExp = new RegExp("(" + word_ + "[s]?)", "gi");
	
	var result = [];
	var currentResult;
	
	while((currentResult = tmpRegExp.exec(source_)) != undefined) {
		result.push(currentResult);
	}
	
	return result;
}