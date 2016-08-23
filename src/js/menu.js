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