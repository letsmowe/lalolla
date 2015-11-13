/*!
 * Mowe Menu v1.0.0 (http://letsmowe.com/)
 * Copyright 2013-2016 Kabana's Info Developers
 * Licensed under MIT (https://github.com/noibe/villa/blob/master/LICENSE)
 */

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

	this.title.name = options.title;

	this.list.data = options.list;

	this.titleCLickCltrl = function() {

		self.toggle();

	};

	this.itemClickCtrl = function() {

		self.toggle();

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
	this.backdrop.viewport.addEventListener('click', this.titleCLickCltrl);

};

/**
 * Destroy all the built backdrop after the menu are closed
 */
Menu.prototype.destroyBackdrop = function() {

	this.viewport.removeChild(this.backdrop.viewport);

};

/**
 * Toggle the menu, it add the class 'is-active' to menu and active the backdrop
 */
Menu.prototype.toggle = function() {

	this.listUpdatePosition();

	if (!this.active) {

		this.viewport.classList.add('is-active');
		this.activeBackdrop();

		this.active = !this.active;    // true

	} else {

		this.viewport.classList.remove('is-active');
		this.destroyBackdrop();

		this.active = !this.active;    // false

	}

};

/* Title */

/**
 * Build the title of menu and to call the toggle function
 * @return {Element}
 */
Menu.prototype.buildTitle = function() {

	var element = document.createElement('div');
	element.classList.add('Menu-title');

	var span = document.createElement('span');
	span.innerHTML = this.title.name;

	element.appendChild(span);

	return element;

};

/**
 * Append the built title and add click and touch (?) events listeners
 * TODO - Needs to add the touch event
 */
Menu.prototype.initTitle = function() {

	this.title.viewport = this.buildTitle();
	this.title.viewport.addEventListener('click', this.titleCLickCltrl);

};

/* List */

/**
 * Update the list position (top and left) relative from the title position
 */
Menu.prototype.listUpdatePosition = function() {

	var left, top;

	left = this.title.viewport.offsetLeft;
	top = this.title.viewport.offsetTop + this.title.viewport.offsetHeight;

	this.list.viewport.style.top = top + 'px';
	this.list.viewport.style.left = left + 'px';

};

/**
 * Build a list item and add the click and touch event listeners
 * for toggle and for the custom call function
 * @param data
 * @return {Element}
 */
Menu.prototype.buildListItem = function(data) {

	var element = document.createElement('li');
	element.classList.add('Menu-item');
	element.setAttribute('data-tag', data.name);

	var span = document.createElement('span');
	span.innerHTML = data.title;

	element.appendChild(span);

	element.addEventListener('click', this.itemClickCtrl);
	element.addEventListener('click', data.onClick);

	return element;

};

/**
 * Build the menu list element and all the list items
 * @return {Element}
 */
Menu.prototype.buildList = function() {

	var element = document.createElement('ul');
	element.classList.add('Menu-list');

	for (var i = 0; i < this.list.data.length; i++)
		element.appendChild(this.buildListItem(this.list.data[i]));

	return element;

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

		self.titleCLickCltrl();
	}, speed ? speed : 1000);

};

/* Init */

/**
 * Init the menu, add style and build the menu
 */
Menu.prototype.init = function() {

	this.viewport.classList.add('Menu--unsplash');

	this.initTitle();

	this.initList();

	this.build();

};
