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

		//
		// Find the first item and put this at top of arrays
		//
		//if (!this.view.lastInstagram_id) // first item
		//	for (var i = this.instagram.data.length; i--; )
		//		if (this.hasTag(this.instagram.data[i], 'inauguracao')) {
		//
		//			arr.push(this.instagram.data[i]);
		//			this.view.lastInstagram_id++;
		//
		//		}
		//

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

		console.log('-----------------------------------------------------');

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

		/*
		*
		* TROUBLE HERE! TODO
		*
		* */

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

		var built = this.buildView(data);

		for (var i = 0; i < built.length; i++) {
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
				console.log('ajax error');
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
				console.log('ajax error');
			}
		});

	};

	/**
	 * Load more media to view
	 */
	Installery.prototype.loadMore = function() {

		console.log('kkk');

		if (!this.instagram.loadAll)
			this.instagram.loadAll = true;

		if (this.instagram.pagination.next_url) {
			this.loadInstagramData(this.instagram.pagination.next_url, this);
		}

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