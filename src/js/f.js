/*!
 * Mowe La Lolla Functions v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

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