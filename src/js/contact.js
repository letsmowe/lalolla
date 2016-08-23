/*!
 * Mowe Contact v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

/**
 * Constructor of Contact
 * Needs of jQuery Ajax (>1.11.3)
 * @param viewport
 * @param options
 * @constructor menu
 */
function Contact(viewport, options) {

	var self = this;

	this.viewport = viewport;

	this.url = !!options.url ? options.url : false;

	this.data = {};

	this.fields = {};

	this.clickCtrl = function() {

		self.initResponse(this);

		this.preventDefault();

	};

	this.asyncSuccessCtrl = function(data) {

		if (data.sent)
			self.showMessage();
		else
			self.send();

	};

	this.asyncErrorCtrl = function(data) {

		console.log('erro');
		self.send();

	};

}

Contact.prototype.showMessage = function() {

	console.log('hhee');

};

Contact.prototype.send = function() {

	console.log('enviando');

	$.ajax({
		url: this.url,
		type: 'jsonp',
		cache: false,
		data: this.data,
		method: 'get',
		timeout: 30000,
		success: this.asyncSuccessCtrl,
		error: this.asyncErrorCtrl
	});

};

Contact.prototype.initSend = function() {

	this.send();

};

Contact.prototype.loadTextFieldValue = function(element) {

	return element ? element.value : false;

};

Contact.prototype.loadFieldsData = function(initSend) {

	this.data.name = this.loadTextFieldValue(this.fields.name);
	this.data.mail = this.loadTextFieldValue(this.fields.mail);
	this.data.message = this.loadTextFieldValue(this.fields.message);

	if (initSend) this.initSend();

};

Contact.prototype.validateTextField = function(element) {

	return element ? element.value !== '' : false;

};

Contact.prototype.validateFields = function() {

	return !(!this.validateTextField(this.fields.name) || !this.validateTextField(this.fields.mail) || !this.validateTextField(this.fields.message));

};

Contact.prototype.initResponse = function(event) {

	if (this.validateFields())
		this.loadFieldsData(true);
	else {
		// error function
	}

};

Contact.prototype.addListeners = function() {

	addListener({
		element: this.submit,
		type: 'click',
		crossType: 'onclick',
		listener: this.clickCtrl
	});

};

Contact.prototype.getFields = function() {

	this.fields.name = document.getElementById('cNome');
	this.fields.mail = document.getElementById('cEmail');
	this.fields.message = document.getElementById('cMensagem');

	this.submit = document.getElementById('cSubmit');

	this.addListeners();

};

Contact.prototype.init = function() {

	this.getFields();

};