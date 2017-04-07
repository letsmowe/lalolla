/*!
 * Mowe Contact v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

/**
 * Constructor of Contact
 * Needs of jQuery Ajax (>1.11.3)
 * @param viewport
 * @param feedback
 * @param options
 * @constructor menu
 */
function Contact(viewport, feedback, options) {

	var self = this;

	this.viewport = viewport;
	this.feedback = feedback;

	this.url = !!options.url ? options.url : false;

	this.data = {};

	this.fields = {};

	this.tries = 0;
	this.maxTries = 3;

	this.clickCtrl = function(e) {

		self.initResponse(this);
		e.preventDefault();

	};

	this.asyncSuccessCtrl = function(data) {

		if (data.sent)
			self.showSuccessMessage();
		else
			self.showFailMessage();

	};

	this.asyncErrorCtrl = function(data) {

		this.tries = this.tries + 1;

		if(this.tries <= this.maxTries)
			self.retry(this.tries);
		else
			self.showErrorMessage();

	};

}

Contact.prototype.showSuccessMessage = function() {

	console.log('enviado');
	this.feedback.innerText = 'Mensagem enviada!';
	this.feedback.classList.add('success');
	this.submit.disabled = true;

};

Contact.prototype.showFailMessage = function() {

	console.log('completou, mas ocorreu uma falha');
	this.feedback.innerText = 'Houve uma falha no envio.';
	this.feedback.classList.add('fail');

};

Contact.prototype.showErrorMessage = function() {

	this.feedback.innerText = 'Não foi possível enviar.';
	this.feedback.classList.add('error');

};

Contact.prototype.showRequiredMessage = function(mailError) {

	if (mailError) {

		document.querySelectorAll('.email-text')[0].focus();
		this.feedback.innerText = 'E-mail preenchido incorretamente';

	} else {

		this.feedback.innerText = 'Preencha todos os campos!';

	}

};

Contact.prototype.send = function() {

	console.log('enviando');
	this.feedback.innerText = 'Enviando...';

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

Contact.prototype.retry = function(tries) {

	console.log('tentando enviar novamente');

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

	if (this.validateFields()) {

		if (this.fields.mail.validity) {

			if (this.fields.mail.validity.valid)
				this.loadFieldsData(true);
			else
				this.showRequiredMessage(true);

		} else {
			//validate only if it have validity object (supports email input type)
			this.loadFieldsData(true);
		}

	} else {
		this.showRequiredMessage(false);
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