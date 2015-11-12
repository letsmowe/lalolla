
/* Constructor */

function Nav() {

	var self = this;

	this.viewport = document.getElementById('main-nav');

	this.mainHeader = document.getElementById('main-header');

	this.header = {};
	this.header.viewport = document.getElementById('main-nav-header');

	this.body = {};
	this.body.viewport = document.getElementById('main-nav-body');

	this.body.items = [];

	this.menu = {};
	this.menu.items = [];

	this.active = false;

	this.resizeCtrl = function() {

		self.resize();
		self.move();

	};

	this.header.itemClickCtrl = function() {

		if (!self.active)
			self.active = !self.active;
		else if (this.brother.classList.contains('is-active'))
			self.active = !self.active;

		self.translate(this, true);

	};

}

Nav.prototype.resizeItems = function() {

	for (var i = this.body.items.length; i--; ) {
		this.body.items[i].style.height = this.body.viewport.offsetHeight + 'px';
		this.body.items[i].style.width = this.body.viewport.offsetWidth + 'px';
	}

};

Nav.prototype.move = function() {

	var self = this;

	this.viewport.classList.remove('is-animating');

	this.viewport.style.left = ( this.mainHeader.offsetWidth - 60 ) + 'px';

	setTimeout(function() {
		self.viewport.classList.add('is-animating');
	}, 300);

};

Nav.prototype.resize = function() {

	var self = this;

	this.viewport.classList.remove('is-animating');

	this.viewport.style.height = window.innerHeight + 'px';

	this.resizeItems();

	setTimeout(function() {
		self.viewport.classList.add('is-animating');
	}, 300);

};

Nav.prototype.translateItems = function(current) {

	var item, self;

	self = this;

	for (var i = this.body.items.length; i--; ) {
		item = this.body.items[i];
		item.style.display = 'block';
		item.classList.remove('is-active');
		item.style.transform = 'translateX(' + this.body.viewport.offsetWidth + 'px)';
		item.style.zIndex = 2;
		item.classList.add('is-animating');
	}

	if (current) {
		current.classList.add('is-active');
		current.style.transform = 'translateX(0px)';
		current.style.zIndex = 3;
	}

	setTimeout(function() {
		for (var j = self.body.items.length; j--; ) {
			self.body.items[j].classList.remove('is-animating');
			if (!self.body.items[j].classList.contains('is-active'))
				self.body.items[j].style.display = 'none';
		}
	}, 400);

};

Nav.prototype.translateViewport = function() {

	if (this.active) this.viewport.style.transform = 'translateX(-' + ( this.body.viewport.offsetWidth ) + 'px)';
	else this.viewport.style.transform = 'translateX(' + 0 + ')';

};

Nav.prototype.translate = function(event, translateItems) {

	this.translateViewport();

	this.translateItems( translateItems ? event.brother : false );

};

Nav.prototype.getItems = function() {

	var menuItems = this.header.viewport.getElementsByClassName('MainNav-menu-item');
	var items = this.body.viewport.getElementsByClassName('MainNav-item');

	for (var i = items.length; i--; ) {

		menuItems[i].addEventListener('click', this.header.itemClickCtrl);
		items[i].brother = menuItems[i];
		menuItems[i].brother = items[i];
		this.menu.items.push(menuItems[i]);
		this.body.items.push(items[i]);

	}

};

Nav.prototype.init = function () {

	this.getItems();

	this.resize();
	this.move();

	this.translate(this, false);

	// add event listeners
	window.addEventListener('resize', this.resizeCtrl);

};