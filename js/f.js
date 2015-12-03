/**
 * Add event listeners to element
 * @param parameters
 */
function addListener(parameters) {
	var element = parameters.element;
	var type = parameters.type;
	var crossType = parameters.crossType;
	var listener = parameters.listener;
	var useCapture = parameters.useCapture;

	if (window.addEventListener)
		element.addEventListener(type, listener, !!useCapture);
	else element.attachEvent(crossType ? crossType : type, listener);

}