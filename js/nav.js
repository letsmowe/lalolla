/*!
 * Mowe Nav v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

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