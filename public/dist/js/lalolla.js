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
/*!
 * Mowe Installery v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Installery = (function() {

	/**
	 * Constructor of Installery
	 * Needs of Mowe Menu (>1.0.0) and jQuery Ajax (>1.11.3)
	 * @param viewport {object}
	 * @param options {object}
	 * @constructor
	 */
	function Installery(viewport, options) {

		var self = this;

		this.viewport = viewport;

		this.view = {};
		this.view.data = [];
		this.view.lastInstagram_id = 0;
		this.view.lastBrand_id = 0;

		this.view.options = {};
		this.view.options.hashtag = false;
		this.view.options.instagramPerView = 6;
		this.view.options.brandPerView = 2;

		this.view.options.query = [];

		this.instagram = {};
		this.instagram.data = [];
		this.instagram.allData = false;
		this.instagram.lastInstagram_id = 0;

		this.brand = {};
		this.brand.data = [];
		this.brand.lastBrands_id = 0;

		this.autoload = false;

		this.loadLast = 0;

		/**
		 * Ctrl the ajax success events
		 * @param data {object}
		 */
		this.ajaxCtrl = function(data) {

			/* EXPIRED TOKEN DEBUG */
			console.log(data);

 			self.updateInstagramData(data);

		};

	}

	/**
	 * Returns true if number (n) is on array (arr)
	 * It can return true if the number (n) doesn't have difference from the index (i)
	 * @param arr {Array}
	 * @param value {number|string}
	 * @param difference {number|boolean}
	 * @return {boolean}
	 */
	Installery.prototype.isOnArray = function(arr, value, difference) {

		for (var i = arr.length; i--; )
			if ( arr[i] == value )
				return true;
			else if (difference)
				if ( !( ( arr[i] - difference > value ) || ( arr[i] + difference < value ) ) )
					return true;

		return false;

	};

	/**
	 * Returns a array of 'n' random numbers based on min (min) and max (max)
	 * It support the isOnArray difference feature (difference, optional)
	 * @param n {number}
	 * @param min {number}
	 * @param max {number}
	 * @param difference {number|boolean} (optional)
	 * @return {Array}
	 */
	Installery.prototype.getNumbers = function(n, min, max, difference) {

		var arr = [];

		while (arr.length != n) {

			var random = Math.floor( Math.random() * ( max - min ) ) + min;

			if (!this.isOnArray(arr, random, difference))
				arr.push(random);

		}

		return arr;

	};

	Installery.prototype.hasTag = function(media, tag) {

		return this.isOnArray(media.tags, tag, false);

	};

	Installery.prototype.doTagQuery = function(media) {

		for (var i = this.view.options.query.length; i--; )
			if (this.hasTag(media, this.view.options.query[i]))
				return true;

		return false;

	};

	/**
	 * Returns 'n' random media from a brand array (this.brand.data)
	 * @param n {number}
	 * @return {Array}
	 */
	Installery.prototype.getBrandMedia = function(n) {

		var arr, numbers;

		arr = [];
		numbers = this.getNumbers(n, 0, 3, false);

		for (var i = n; i--; )
			arr.push(this.brand.data[numbers[i]]);

		return arr;

	};

	/**
	 * Returns 'n' linear media from a instagram array (this.instagram.data)
	 * @param n {number}
	 * @return {Array}
	 */
	Installery.prototype.getInstagramMedia = function(n) {

		var arr, max, isOver, media, count;

		arr = [];
		max = this.view.lastInstagram_id + n;

		isOver = false;

		while ( this.view.lastInstagram_id < max && !isOver ) // default
			if (media = this.instagram.data[this.view.lastInstagram_id]) {

				if (this.view.options.query.length) {

					if (this.doTagQuery(media))
						arr.push(media);

					this.view.lastInstagram_id++;

				} else {

					arr.push(media);
					this.view.lastInstagram_id++;

				}

			} else isOver = !isOver;

		// media is over
		if (this.view.lastInstagram_id >= 20)
			if (this.viewport.parentNode)
				this.viewport.parentNode.classList.add('is-over');

		return arr;

	};

	/**
	 * Returns a merged array with data from brand array and instagram array
	 * The size of array is based on 'n'
	 * @param brand {Array}
	 * @param instagram {Array}
	 * @param n {number}
	 * @return {Array}
	 */
	Installery.prototype.mergeMedia = function(brand, instagram, n) {

		var arr, brandCount, brandPositions, instagramCount;

		arr = [];

		brandPositions = this.getNumbers(this.view.options.brandPerView, 1, n, 2);

		brandCount = 0;
		instagramCount = 0;

		for (var i = 0; i < n; i++) {

			if (!i)
				arr.push(instagram[instagramCount++]);
			else if (this.isOnArray(brandPositions, i, false))
				arr.push(brand[brandCount++]);
			else
				arr.push(instagram[instagramCount++]);

		}

		return arr;

	};

	/**
	 * Return a loaded and merged array of instagram and brand media
	 * The number of media returned is based on 'n'
	 * @param instagramItems {number}
	 * @param brandItems {number}
	 */
	Installery.prototype.loadMedia = function(instagramItems, brandItems) {

		var brand, instagram, media;

		instagram = this.getInstagramMedia(instagramItems);
		brand = this.getBrandMedia(brandItems);

		media = this.mergeMedia(brand, instagram, ( instagram.length + brand.length ));

		return media;

	};

	Installery.prototype.buildMediaItem = function(media) {

		var element = document.createElement('article');
		element.classList.add('InstalleryMedia');

		if (media.brand)
			element.classList.add('InstalleryMedia--brand');
		else element.classList.add('InstalleryMedia--instagram');

		element.style.backgroundImage = 'url("' + media.images.standard_resolution.url + '")';

		return element;


	};

	Installery.prototype.buildView = function(data) {

		var arr = [];

		for (var i = 0; i < data.length; i++) {

			if (data[i]) {

				if (!data[i].viewport)
					data[i].viewport = this.buildMediaItem(data[i]);

				arr.push(data[i]);

			}

		}

		return arr;

	};

	/**
	 * Load a view
	 */
	Installery.prototype.loadView = function() {

		var data = this.loadMedia(this.view.options.instagramPerView, this.view.options.brandPerView);

		if (data) {

			var built = this.buildView(data);

			for (var i = 0; i < built.length; i++)
				this.viewport.appendChild(built[i].viewport.cloneNode(true));

		}

	};

	/**
	 * Load media for the first time
	 */
	Installery.prototype.initMedia = function() {

		this.loadView();

		// persist 7 per 1 brand for the next load
		this.view.options.instagramPerView = 7;
		this.view.options.brandPerView = 1;

	};

	/**
	 * Load the brand data
	 * @param data {Array|object}
	 */
	Installery.prototype.loadBrandData = function(data) {

		for (var i = 0; i < data.length; i++) {
			data[i].brands_id = this.brand.lastBrands_id;
			this.brand.data.push(data[i]);
			this.brand.lastBrands_id = data[i].brands_id;
			this.brand.lastBrands_id++;
		}

	};

	/**
	 * Push the instagram media and give to it a instagram_id
	 * @param media {object}
	 */
	Installery.prototype.updateInstagramMediaItem = function(media) {

		media.instagram_id = this.instagram.lastInstagram_id++;
		this.instagram.data.push(media);

	};

	/**
	 * Update the instagram data and gives to data a instagram_id
	 * The instagram_id is used to control the instagram media
	 * @param data {object}
	 */
	Installery.prototype.updateInstagramData = function(data) {

		this.instagram.meta = data.meta;
		this.instagram.pagination = data.pagination;

		for (var i = 0; i < data.data.length; i++)
			this.updateInstagramMediaItem(data.data[i]);

		if (this.instagram.loadAll) {
			if (this.instagram.pagination.next_url) // the last load doesn't return a next_url
				this.loadInstagramData(this.instagram.pagination.next_url, this);
			else // is the last load
				this.instagram.loadAll = false;
		}

		if (!this.loadLast++) // just init media at first time
			this.initMedia();

		if (this.autoload) {
			this.autoload = false;
			this.initMedia();
		}

	};

	/**
	 * Load the instagram data
	 * @param url {string}
	 * @param self {object}
	 */
	Installery.prototype.loadInstagramData = function(url, self) {

		$.ajax({
			type: 'get',
			dataType: 'jsonp',
			url: url,
			cache: false,
			success: self.ajaxCtrl,
			error: function() {
				console.log('ajax error 1');
			}
		});

	};

	/**
	 * First load of the instagram data
	 * @param url {string}
	 */
	Installery.prototype.firstBiteInstagramData = function(url) {

		$.ajax({
			type: 'get',
			dataType: 'jsonp',
			url: url,
			cache: false,
			success: this.ajaxCtrl,
			error: function() {
				console.log('ajax error 2');
			}
		});

	};

	/**
	 * Load more media to view
	 */
	Installery.prototype.loadMore = function() {

		if (!this.instagram.loadAll)
			this.instagram.loadAll = true;

		if (this.instagram.pagination.next_url)
			this.loadInstagramData(this.instagram.pagination.next_url, this);

		this.loadView();

	};

	Installery.prototype.destroyView = function() {

		this.viewport.innerHTML = '';

		this.view.data = [];
		this.view.lastInstagram_id = 0;

	};

	Installery.prototype.reload = function() {

		this.destroyView();

		this.view.options.query = [
			'camisetas'
		];

		this.autoload = true;

		this.loadView();

	};

	/**
	 * Init the installery
	 * @param url
	 */
	Installery.prototype.init = function(url) {

		this.firstBiteInstagramData(url);

	};

	return Installery;

}());
/*!
 * Mowe Menu v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Menu = (function() {

	/**
	 * Constructor of Menu
	 * @param viewport
	 * @param options
	 * @constructor menu
	 */
	function Menu(viewport, options) {

		var self = this;

		this.viewport = viewport;

		this.name = options.name;

		this.active = false;

		this.title = {};
		this.list = {};
		this.backdrop = {};
		this.toggleButton = {};

		// extend options
		this.showItems = options.showItems || false;
		this.title.title = options.title || false;
		this.list.data = options.list;

		this.toggleClickCtrl = function() {

			self.toggle();

		};

		this.itemClickCtrl = function() {

			self.toggle(this);

		};

	}

	/* Menu Functions */

	/**
	 * Build the menu backdrop to call click and touch events listeners
	 * Return the element
	 * @return {Element}
	 */
	Menu.prototype.buildBackdrop = function() {

		var element = document.createElement('div');
		element.classList.add('Menu-backdrop');

		return element;

	};

	/**
	 * Append the built backdrop and add the click and touch (?) event listener
	 * TODO - Needs to add the touch event
	 */
	Menu.prototype.activeBackdrop = function() {

		this.backdrop.viewport = this.buildBackdrop();
		this.viewport.insertBefore(this.backdrop.viewport, this.list.viewport);
		this.backdrop.viewport.addEventListener('click', this.toggleClickCtrl);

	};

	/**
	 * Destroy all the built backdrop after the menu are closed
	 */
	Menu.prototype.destroyBackdrop = function() {

		this.viewport.removeChild(this.backdrop.viewport);

	};

	/**
	 * Show the menu, it add the class 'is-active' to menu and active the backdrop
	 */
	Menu.prototype.show = function () {

		this.viewport.classList.add('is-active');
		this.activeBackdrop();

		this.active = !this.active;    // true

	};

	/**
	 * Hide the menu, it remove the class 'is-active' to menu and destroy the backdrop
	 */
	Menu.prototype.hide = function() {

		this.viewport.classList.remove('is-active');
		this.destroyBackdrop();

		this.active = !this.active;    // false

	};

	/**
	 * Toggle the menu
	 * @param item {object}
	 */
	Menu.prototype.toggle = function(item) {

		this.listUpdatePosition();

		if (!this.active) {

			if (item) {

				if (!item.isFixed) this.show();

			} else {

				this.show();

			}

		} else {

			this.hide();

		}

	};

	/**
	 * Build the title of menu and to call the toggleButton function
	 * @return {Element}
	 */
	Menu.prototype.buildTitle = function() {

		var element = document.createElement('div');
		element.classList.add('Menu-title');

		var span = document.createElement('span');
		span.innerHTML = this.title.title;

		element.appendChild(span);

		return element;

	};

	/**
	 * Append the built title and add click and touch (?) events listeners
	 * TODO - Needs to add the touch event
	 */
	Menu.prototype.initTitle = function() {

		this.title.viewport = this.buildTitle();
		this.title.viewport.addEventListener('click', this.toggleClickCtrl);

	};

	/* List */

	/**
	 * Update the list position (top and left) relative from the title position
	 */
	Menu.prototype.listUpdatePosition = function() {

		var left, top;

		left = this.toggleButton.viewport.offsetLeft;
		top = this.toggleButton.viewport.offsetTop + this.toggleButton.viewport.offsetHeight;

		this.list.hiddenList.style.top = top + 'px';
		this.list.hiddenList.style.left = left + 'px';

	};

	/**
	 * Build the toggleButton button
	 */
	Menu.prototype.buildToggleButton = function() {

		var button = document.createElement('a');
		button.className = 'Menu-toggle-button';

		var icon = document.createElement('span');
		icon.className = 'icon-ellipsis';

		button.appendChild(icon);

		button.addEventListener('click', this.toggleClickCtrl);

		return button;

	};

	/**
	 * Build a list item and add the click and touch event listeners
	 * for toggleButton and for the custom call function
	 * @param data {object}
	 * @param isFixed {boolean}
	 * @return {Element}
	 */
	Menu.prototype.buildListItem = function(data, isFixed) {

		var element = document.createElement('li');
		element.classList.add('Menu-item');
		element.setAttribute('data-tag', data.name);

		var span = document.createElement('span');
		span.innerHTML = data.title;

		element.appendChild(span);

		element.addEventListener('click', this.itemClickCtrl);
		element.addEventListener('click', data.onClick);

		element.isFixed = !!isFixed;

		return element;

	};

	/**
	 * Build the menu list element and all the list items
	 * @return {Element}
	 */
	Menu.prototype.buildList = function() {

		var i, list, hiddenList;

		list = document.createElement('ul');
		list.classList.add('Menu-list');

		for (i = 0; i < ( this.showItems || 0 ); i++)
			list.appendChild(this.buildListItem(this.list.data[i], true));

		this.toggleButton.viewport = this.buildToggleButton();
		list.appendChild(this.toggleButton.viewport);

		hiddenList = document.createElement('ul');
		hiddenList.classList.add('Menu-hidden-list');

		for (i = 0 + ( this.showItems || 0 ); i < this.list.data.length; i++)
			hiddenList.appendChild(this.buildListItem(this.list.data[i]));

		list.appendChild(hiddenList);

		this.list.hiddenList = hiddenList;

		return list;

	};

	/**
	 * Append the built list to viewport
	 */
	Menu.prototype.initList = function() {

		this.list.viewport = this.buildList();

	};

	/* Builder */

	/**
	 * Append the title and the list to the menu viewport
	 */
	Menu.prototype.build = function() {

		if (this.title.viewport)
			this.viewport.appendChild(this.title.viewport);

		this.viewport.appendChild(this.list.viewport);

	};

	/* Tests */

	/**
	 * Execute tests of menu
	 * @param self
	 * @param move
	 * @param speed
	 */
	Menu.prototype.tests = function(self, move, speed) {

		var size, interval, max, main, plus;

		main = document.getElementById('main');
		size = 0;
		interval = 20;
		max = 400;
		plus = true;

		setInterval(function() {

			if (move) {
				if (plus) {

					size += interval;

					if (size >= max) {
						plus = false;
					}

				} else {

					size -= interval;

					if (size <= 0) {
						plus = true;
					}

				}
			}

			main.style.paddingTop = size + 'px';
			main.style.paddingLeft = size + 'px';

			self.toggleClickCtrl();
		}, speed ? speed : 1000);

	};

	/* Init */

	/**
	 * Init the menu, add style and build the menu
	 */
	Menu.prototype.init = function() {

		this.viewport.classList.add('Menu--unsplash');

		if (this.title.title)
			this.initTitle();

		this.initList();

		this.build();

	};

	return Menu;

}());
/*!
 * Mowe Nav v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

var Nav = (function() {

	/**
	 * Constructor of Nav
	 * @constructor nav
	 */
	function Nav() {

		var self = this;

		this.viewport = document.getElementById('main-nav');

		this.mainHeader = document.getElementById('main-header');

		this.header = {};
		this.header.viewport = document.getElementById('main-nav-header');

		this.body = {};
		this.body.viewport = document.getElementById('main-nav-body');

		this.controller = {};
		this.controller.viewport = document.getElementById('main-nav-controller');
		this.controller.icon = document.getElementById('main-nav-controller-icon');

		this.body.items = [];

		this.menu = {};
		this.menu.items = [];

		this.active = false;

		this.resizeCtrl = function() {

			self.resize();

		};

		this.controllerClickCtrl = function() {

			self.toggleButton(this, true);

		};

		this.header.itemClickCtrl = function() {

			self.toggleButton(this, false);

		};

	}

	Nav.prototype.toggleControllerIcon = function() {

		if (this.active) {
			this.controller.icon.classList.remove('icon-menu');
			this.controller.icon.classList.add('icon-cancel');
		} else {
			this.controller.icon.classList.remove('icon-cancel');
			this.controller.icon.classList.add('icon-menu');
		}

	};

	Nav.prototype.translateItems = function(current) {

		var item, self;

		self = this;

		if (!current) {

			current = this.body.viewport.querySelector('.is-active');

			if (!current)
				current = this.body.items[ this.body.items.length - 1 ];

		}

		for (var i = this.body.items.length; i--; ) {
			item = this.body.items[i];
			item.style.display = 'block';
			item.classList.remove('is-active');
			item.style.transform = 'translateX(' + this.body.viewport.offsetWidth + 'px)';
			item.style.zIndex = 2;
			item.classList.add('is-animating');
		}

		current.classList.add('is-active');
		current.style.transform = 'translateX(0px)';
		current.style.zIndex = 3;

		setTimeout(function() {
			for (var j = self.body.items.length; j--; ) {
				self.body.items[j].classList.remove('is-animating');
				if (!self.body.items[j].classList.contains('is-active'))
					self.body.items[j].style.display = 'none';
			}
		}, 400);

	};

	Nav.prototype.translateViewport = function() {

		var translate;

		if (this.active)
			translate = - this.viewport.offsetWidth + 'px';
		else
			translate = 0;

		this.viewport.style.webkitTransform = 'translateX(' + translate + ')';
		this.viewport.style.msTransform = 'translateX(' + translate + ')';
		this.viewport.style.transform = 'translateX(' + translate + ')';

	};

	Nav.prototype.translate = function(event, translateItems) {

		var self = this;

		self.translateViewport();
		self.translateItems( translateItems ? event.brother : false );

	};

	Nav.prototype.resizeDesktop = function() {

		var self = this;

		this.header.viewport.style.right = 100 + '%';
		this.header.viewport.style.left = 'auto';

		this.body.viewport.style.left = 0;

		if (this.active) {
			this.controller.viewport.style.display = 'flex';
			this.controller.viewport.style.right = '100%';
			this.controller.viewport.style.left = 'auto';
		} else {
			this.controller.viewport.style.display = 'none';
		}

		setTimeout(function() {
			self.body.viewport.style.width = self.viewport.offsetWidth + 'px';
			self.translateViewport();
			self.viewport.classList.add('is-animating');
		}, 300);

	};

	Nav.prototype.resizeMobile = function() {

		var self = this;

		this.controller.viewport.style.display = 'flex';

		this.header.viewport.style.right = 'auto';
		this.header.viewport.style.left = 0;

		if (this.active) {
			this.controller.viewport.style.right = 'auto';
			this.controller.viewport.style.left = 0;
		} else {
			this.controller.viewport.style.left = 'auto';
			this.controller.viewport.style.right = 100 + '%';
			this.body.viewport.style.left = 0;
		}

		this.body.viewport.style.left = this.header.viewport.offsetWidth + 'px';

		setTimeout(function() {
			self.body.viewport.style.width = ( self.viewport.offsetWidth - self.header.viewport.offsetWidth ) + 'px';
			self.translateViewport();
			self.viewport.classList.add('is-animating');
		}, 300);

	};

	Nav.prototype.resize = function() {

		var self = this;

		this.viewport.classList.remove('is-animating');

		setTimeout(function() {
			if (window.innerWidth < 420)
				self.resizeMobile();
			else
				self.resizeDesktop();
		}, 300);

	};

	Nav.prototype.toggleButton = function(event, controller) {

		if (!this.active)
			this.active = !this.active;
		else if ( (controller) )
			this.active = !this.active;

		this.translate(event, !controller);

		this.resize();

		this.toggleControllerIcon();

	};

	Nav.prototype.getItems = function() {

		var menuItems = this.header.viewport.querySelectorAll('.MainNav-menu-item');
		var items = this.body.viewport.querySelectorAll('.MainNav-item');

		for (var i = items.length; i--; ) {

			addListener({
				element: menuItems[i],
				type: 'click',
				crossType: 'onclick',
				listener: this.header.itemClickCtrl,
				useCapture: false
			});

			items[i].brother = menuItems[i];
			menuItems[i].brother = items[i];
			this.menu.items.push(menuItems[i]);
			this.body.items.push(items[i]);

		}

	};

	Nav.prototype.init = function () {

		addListener({
			element: this.controller.viewport,
			type: 'click',
			crossType: 'onclick',
			listener: this.controllerClickCtrl,
			useCapture: false
		});

		this.getItems();

		this.resize();

		this.translate(this, false);

		// add event listeners
		addListener({
			element: window,
			type: 'resize',
			crossType: 'onresize',
			listener: this.resizeCtrl,
			useCapture: false
		});

	};

	return Nav;

}());